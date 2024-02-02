define('panels/histogram/interval',[
  'kbn'
],
function (kbn) {
  'use strict';

  /**
   * manages the interval logic
   * @param {[type]} interval_string  An interval string in the format '1m', '1y', etc
   */
  function Interval(interval_string) {
    this.string = interval_string;

    var info = kbn.describe_interval(interval_string);
    this.type = info.type;
    this.ms = info.sec * 1000 * info.count;

    // does the length of the interval change based on the current time?
    if (this.type === 'y' || this.type === 'M') {
      // we will just modify this time object rather that create a new one constantly
      this.get = this.get_complex;
      this.date = new Date(0);
    } else {
      this.get = this.get_simple;
    }
  }

  Interval.prototype = {
    toString: function () {
      return this.string;
    },
    after: function(current_ms) {
      return this.get(current_ms, 1);
    },
    before: function (current_ms) {
      return this.get(current_ms, -1);
    },
    get_complex: function (current, delta) {
      this.date.setTime(current);
      switch(this.type) {
      case 'M':
        this.date.setUTCMonth(this.date.getUTCMonth() + delta);
        break;
      case 'y':
        this.date.setUTCFullYear(this.date.getUTCFullYear() + delta);
        break;
      }
      return this.date.getTime();
    },
    get_simple: function (current, delta) {
      return current + (delta * this.ms);
    }
  };

  return Interval;

});
define('panels/histogram/timeSeries',[
  'underscore',
  './interval'
],
function (_, Interval) {
  'use strict';

  var ts = {};

  // map compatable parseInt
  function base10Int(val) {
    return parseInt(val, 10);
  }

  // trim the ms off of a time, but return it with empty ms.
  function getDatesTime(date) {
    return Math.floor(date.getTime() / 1000)*1000;
  }

  /**
   * Certain graphs require 0 entries to be specified for them to render
   * properly (like the line graph). So with this we will caluclate all of
   * the expected time measurements, and fill the missing ones in with 0
   * @param {object} opts  An object specifying some/all of the options
   *
   * OPTIONS:
   * @opt   {string}   interval    The interval notion describing the expected spacing between
   *                                each data point.
   * @opt   {date}     start_date  (optional) The start point for the time series, setting this and the
   *                                end_date will ensure that the series streches to resemble the entire
   *                                expected result
   * @opt   {date}     end_date    (optional) The end point for the time series, see start_date
   * @opt   {string}   fill_style  Either "minimal", or "all" describing the strategy used to zero-fill
   *                                the series.
   */
  ts.ZeroFilled = function (opts) {
    opts = _.defaults(opts, {
      interval: '10m',
      start_date: null,
      end_date: null,
      fill_style: 'minimal'
    });

    // the expected differenece between readings.
    this.interval = new Interval(opts.interval);

    // will keep all values here, keyed by their time
    this._data = {};
    this.start_time = opts.start_date && getDatesTime(opts.start_date);
    this.end_time = opts.end_date && getDatesTime(opts.end_date);
    this.opts = opts;
  };

  /**
   * Add a row
   * @param {int}  time  The time for the value, in
   * @param {any}  value The value at this time
   */
  ts.ZeroFilled.prototype.addValue = function (time, value) {
    if (time instanceof Date) {
      time = getDatesTime(time);
    } else {
      time = base10Int(time);
    }
    if (!isNaN(time)) {
      this._data[time] = (_.isUndefined(value) ? 0 : value);
    }
    this._cached_times = null;
  };

  /**
   * Add a row and sum the value
   * @param {int}  time  The time for the value, in
   * @param {any}  value The value at this time
   */
  ts.ZeroFilled.prototype.sumValue = function (time, value) {
    if (time instanceof Date) {
      time = getDatesTime(time);
    } else {
      time = base10Int(time);
    }
    if (!isNaN(time)) {

      var curValue = 0;
      if (!isNaN(this._data[time])){
          curValue = this._data[time];
      }


      this._data[time] = curValue + (_.isUndefined(value) ? 0 : value);
    }
    this._cached_times = null;
  };

  /**
   * Get an array of the times that have been explicitly set in the series
   * @param  {array} include (optional) list of timestamps to include in the response
   * @return {array} An array of integer times.
   */
  ts.ZeroFilled.prototype.getOrderedTimes = function (include) {
    var times = _.map(_.keys(this._data), base10Int);
    if (_.isArray(include)) {
      times = times.concat(include);
    }
    return _.uniq(times.sort(function (a, b) {
      // decending numeric sort
      return a - b;
    }), true);
  };

  /**
   * return the rows in the format:
   * [ [time, value], [time, value], ... ]
   *
   * Heavy lifting is done by _get(Min|All)FlotPairs()
   * @param  {array} required_times  An array of timestamps that must be in the resulting pairs
   * @return {array}
   */
  ts.ZeroFilled.prototype.getFlotPairs = function (required_times) {
    var times = this.getOrderedTimes(required_times),
      strategy,
      pairs;

    if(this.opts.fill_style === 'all') {
      strategy = this._getAllFlotPairs;
    } else {
      strategy = this._getMinFlotPairs;
    }

    pairs = _.reduce(
      times,    // what
      strategy, // how
      [],       // where
      this      // context
    );

    // if the first or last pair is inside either the start or end time,
    // add those times to the series with null values so the graph will stretch to contain them.
    if (this.start_time && (pairs.length === 0 || pairs[0][0] > this.start_time)) {
      pairs.unshift([this.start_time, null]);
    }
    if (this.end_time && (pairs.length === 0 || pairs[pairs.length - 1][0] < this.end_time)) {
      pairs.push([this.end_time, null]);
    }

    return pairs;
  };

  /**
   * ** called as a reduce stragegy in getFlotPairs() **
   * Fill zero's on either side of the current time, unless there is already a measurement there or
   * we are looking at an edge.
   * @return {array} An array of points to plot with flot
   */
  ts.ZeroFilled.prototype._getMinFlotPairs = function (result, time, i, times) {
    var next, expected_next, prev, expected_prev;

    // check for previous measurement
    if (i > 0) {
      prev = times[i - 1];
      expected_prev = this.interval.before(time);
      if (prev < expected_prev) {
        result.push([expected_prev, 0]);
      }
    }

    // add the current time
    result.push([ time, this._data[time] || 0 ]);

    // check for next measurement
    if (times.length > i) {
      next = times[i + 1];
      expected_next = this.interval.after(time);
      if (next > expected_next) {
        result.push([expected_next, 0]);
      }
    }

    return result;
  };

  /**
   * ** called as a reduce stragegy in getFlotPairs() **
   * Fill zero's to the right of each time, until the next measurement is reached or we are at the
   * last measurement
   * @return {array}  An array of points to plot with flot
   */
  ts.ZeroFilled.prototype._getAllFlotPairs = function (result, time, i, times) {
    var next, expected_next;

    result.push([ times[i], this._data[times[i]] || 0 ]);
    next = times[i + 1];
    expected_next = this.interval.after(time);
    for(; times.length > i && next > expected_next; expected_next = this.interval.after(expected_next)) {
      result.push([expected_next, 0]);
    }

    return result;
  };


  return ts;
});

/* Flot plugin for selecting regions of a plot.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin supports these options:

selection: {
	mode: null or "x" or "y" or "xy",
	color: color,
	shape: "round" or "miter" or "bevel",
	minSize: number of pixels
}

Selection support is enabled by setting the mode to one of "x", "y" or "xy".
In "x" mode, the user will only be able to specify the x range, similarly for
"y" mode. For "xy", the selection becomes a rectangle where both ranges can be
specified. "color" is color of the selection (if you need to change the color
later on, you can get to it with plot.getOptions().selection.color). "shape"
is the shape of the corners of the selection.

"minSize" is the minimum size a selection can be in pixels. This value can
be customized to determine the smallest size a selection can be and still
have the selection rectangle be displayed. When customizing this value, the
fact that it refers to pixels, not axis units must be taken into account.
Thus, for example, if there is a bar graph in time mode with BarWidth set to 1
minute, setting "minSize" to 1 will not make the minimum selection size 1
minute, but rather 1 pixel. Note also that setting "minSize" to 0 will prevent
"plotunselected" events from being fired when the user clicks the mouse without
dragging.

When selection support is enabled, a "plotselected" event will be emitted on
the DOM element you passed into the plot function. The event handler gets a
parameter with the ranges selected on the axes, like this:

	placeholder.bind( "plotselected", function( event, ranges ) {
		alert("You selected " + ranges.xaxis.from + " to " + ranges.xaxis.to)
		// similar for yaxis - with multiple axes, the extra ones are in
		// x2axis, x3axis, ...
	});

The "plotselected" event is only fired when the user has finished making the
selection. A "plotselecting" event is fired during the process with the same
parameters as the "plotselected" event, in case you want to know what's
happening while it's happening,

A "plotunselected" event with no arguments is emitted when the user clicks the
mouse to remove the selection. As stated above, setting "minSize" to 0 will
destroy this behavior.

The plugin allso adds the following methods to the plot object:

- setSelection( ranges, preventEvent )

  Set the selection rectangle. The passed in ranges is on the same form as
  returned in the "plotselected" event. If the selection mode is "x", you
  should put in either an xaxis range, if the mode is "y" you need to put in
  an yaxis range and both xaxis and yaxis if the selection mode is "xy", like
  this:

	setSelection({ xaxis: { from: 0, to: 10 }, yaxis: { from: 40, to: 60 } });

  setSelection will trigger the "plotselected" event when called. If you don't
  want that to happen, e.g. if you're inside a "plotselected" handler, pass
  true as the second parameter. If you are using multiple axes, you can
  specify the ranges on any of those, e.g. as x2axis/x3axis/... instead of
  xaxis, the plugin picks the first one it sees.

- clearSelection( preventEvent )

  Clear the selection rectangle. Pass in true to avoid getting a
  "plotunselected" event.

- getSelection()

  Returns the current selection in the same format as the "plotselected"
  event. If there's currently no selection, the function returns null.

*/

(function ($) {
    function init(plot) {
        var selection = {
                first: { x: -1, y: -1}, second: { x: -1, y: -1},
                show: false,
                active: false
            };

        // FIXME: The drag handling implemented here should be
        // abstracted out, there's some similar code from a library in
        // the navigation plugin, this should be massaged a bit to fit
        // the Flot cases here better and reused. Doing this would
        // make this plugin much slimmer.
        var savedhandlers = {};

        var mouseUpHandler = null;
        
        function onMouseMove(e) {
            if (selection.active) {
                updateSelection(e);
                
                plot.getPlaceholder().trigger("plotselecting", [ getSelection() ]);
            }
        }

        function onMouseDown(e) {
            if (e.which != 1)  // only accept left-click
                return;
            
            // cancel out any text selections
            document.body.focus();

            // prevent text selection and drag in old-school browsers
            if (document.onselectstart !== undefined && savedhandlers.onselectstart == null) {
                savedhandlers.onselectstart = document.onselectstart;
                document.onselectstart = function () { return false; };
            }
            if (document.ondrag !== undefined && savedhandlers.ondrag == null) {
                savedhandlers.ondrag = document.ondrag;
                document.ondrag = function () { return false; };
            }

            setSelectionPos(selection.first, e);

            selection.active = true;

            // this is a bit silly, but we have to use a closure to be
            // able to whack the same handler again
            mouseUpHandler = function (e) { onMouseUp(e); };
            
            $(document).one("mouseup", mouseUpHandler);
        }

        function onMouseUp(e) {
            mouseUpHandler = null;
            
            // revert drag stuff for old-school browsers
            if (document.onselectstart !== undefined)
                document.onselectstart = savedhandlers.onselectstart;
            if (document.ondrag !== undefined)
                document.ondrag = savedhandlers.ondrag;

            // no more dragging
            selection.active = false;
            updateSelection(e);

            if (selectionIsSane())
                triggerSelectedEvent();
            else {
                // this counts as a clear
                plot.getPlaceholder().trigger("plotunselected", [ ]);
                plot.getPlaceholder().trigger("plotselecting", [ null ]);
            }

            return false;
        }

        function getSelection() {
            if (!selectionIsSane())
                return null;
            
            if (!selection.show) return null;

            var r = {}, c1 = selection.first, c2 = selection.second;
            $.each(plot.getAxes(), function (name, axis) {
                if (axis.used) {
                    var p1 = axis.c2p(c1[axis.direction]), p2 = axis.c2p(c2[axis.direction]); 
                    r[name] = { from: Math.min(p1, p2), to: Math.max(p1, p2) };
                }
            });
            return r;
        }

        function triggerSelectedEvent() {
            var r = getSelection();

            plot.getPlaceholder().trigger("plotselected", [ r ]);

            // backwards-compat stuff, to be removed in future
            if (r.xaxis && r.yaxis)
                plot.getPlaceholder().trigger("selected", [ { x1: r.xaxis.from, y1: r.yaxis.from, x2: r.xaxis.to, y2: r.yaxis.to } ]);
        }

        function clamp(min, value, max) {
            return value < min ? min: (value > max ? max: value);
        }

        function setSelectionPos(pos, e) {
            var o = plot.getOptions();
            var offset = plot.getPlaceholder().offset();
            var plotOffset = plot.getPlotOffset();
            pos.x = clamp(0, e.pageX - offset.left - plotOffset.left, plot.width());
            pos.y = clamp(0, e.pageY - offset.top - plotOffset.top, plot.height());

            if (o.selection.mode == "y")
                pos.x = pos == selection.first ? 0 : plot.width();

            if (o.selection.mode == "x")
                pos.y = pos == selection.first ? 0 : plot.height();
        }

        function updateSelection(pos) {
            if (pos.pageX == null)
                return;

            setSelectionPos(selection.second, pos);
            if (selectionIsSane()) {
                selection.show = true;
                plot.triggerRedrawOverlay();
            }
            else
                clearSelection(true);
        }

        function clearSelection(preventEvent) {
            if (selection.show) {
                selection.show = false;
                plot.triggerRedrawOverlay();
                if (!preventEvent)
                    plot.getPlaceholder().trigger("plotunselected", [ ]);
            }
        }

        // function taken from markings support in Flot
        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = plot.getAxes();

            for (var k in axes) {
                axis = axes[k];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? plot.getXAxes()[0] : plot.getYAxes()[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }
            
            return { from: from, to: to, axis: axis };
        }
        
        function setSelection(ranges, preventEvent) {
            var axis, range, o = plot.getOptions();

            if (o.selection.mode == "y") {
                selection.first.x = 0;
                selection.second.x = plot.width();
            }
            else {
                range = extractRange(ranges, "x");

                selection.first.x = range.axis.p2c(range.from);
                selection.second.x = range.axis.p2c(range.to);
            }

            if (o.selection.mode == "x") {
                selection.first.y = 0;
                selection.second.y = plot.height();
            }
            else {
                range = extractRange(ranges, "y");

                selection.first.y = range.axis.p2c(range.from);
                selection.second.y = range.axis.p2c(range.to);
            }

            selection.show = true;
            plot.triggerRedrawOverlay();
            if (!preventEvent && selectionIsSane())
                triggerSelectedEvent();
        }

        function selectionIsSane() {
            var minSize = plot.getOptions().selection.minSize;
            return Math.abs(selection.second.x - selection.first.x) >= minSize &&
                Math.abs(selection.second.y - selection.first.y) >= minSize;
        }

        plot.clearSelection = clearSelection;
        plot.setSelection = setSelection;
        plot.getSelection = getSelection;

        plot.hooks.bindEvents.push(function(plot, eventHolder) {
            var o = plot.getOptions();
            if (o.selection.mode != null) {
                eventHolder.mousemove(onMouseMove);
                eventHolder.mousedown(onMouseDown);
            }
        });


        plot.hooks.drawOverlay.push(function (plot, ctx) {
            // draw selection
            if (selection.show && selectionIsSane()) {
                var plotOffset = plot.getPlotOffset();
                var o = plot.getOptions();

                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);

                var c = $.color.parse(o.selection.color);

                ctx.strokeStyle = c.scale('a', 0.8).toString();
                ctx.lineWidth = 1;
                ctx.lineJoin = o.selection.shape;
                ctx.fillStyle = c.scale('a', 0.4).toString();

                var x = Math.min(selection.first.x, selection.second.x) + 0.5,
                    y = Math.min(selection.first.y, selection.second.y) + 0.5,
                    w = Math.abs(selection.second.x - selection.first.x) - 1,
                    h = Math.abs(selection.second.y - selection.first.y) - 1;

                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);

                ctx.restore();
            }
        });
        
        plot.hooks.shutdown.push(function (plot, eventHolder) {
            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mousedown", onMouseDown);
            
            if (mouseUpHandler)
                $(document).unbind("mouseup", mouseUpHandler);
        });

    }

    $.plot.plugins.push({
        init: init,
        options: {
            selection: {
                mode: null, // one of null, "x", "y" or "xy"
                color: "#e8cfac",
                shape: "round", // one of "round", "miter", or "bevel"
                minSize: 5 // minimum number of pixels
            }
        },
        name: 'selection',
        version: '1.1'
    });
})(jQuery);

define("jquery.flot.selection", ["jquery","jquery.flot"], function(){});

/* Pretty handling of time axes.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

Set axis.mode to "time" to enable. See the section "Time series data" in
API.txt for details.

*/

(function($) {

	var options = {
		xaxis: {
			timezone: null,		// "browser" for local to the client or timezone for timezone-js
			timeformat: null,	// format string to use
			twelveHourClock: false,	// 12 or 24 time in time mode
			monthNames: null	// list of names of months
		}
	};

	// round to nearby lower multiple of base

	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	// Returns a string with the date d formatted according to fmt.
	// A subset of the Open Group's strftime format is supported.

	function formatDate(d, fmt, monthNames, dayNames) {

		if (typeof d.strftime == "function") {
			return d.strftime(fmt);
		}

		var leftPad = function(n, pad) {
			n = "" + n;
			pad = "" + (pad == null ? "0" : pad);
			return n.length == 1 ? pad + n : n;
		};

		var r = [];
		var escape = false;
		var hours = d.getHours();
		var isAM = hours < 12;

		if (monthNames == null) {
			monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}

		if (dayNames == null) {
			dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		}

		var hours12;

		if (hours > 12) {
			hours12 = hours - 12;
		} else if (hours == 0) {
			hours12 = 12;
		} else {
			hours12 = hours;
		}

		for (var i = 0; i < fmt.length; ++i) {

			var c = fmt.charAt(i);

			if (escape) {
				switch (c) {
					case 'a': c = "" + dayNames[d.getDay()]; break;
					case 'b': c = "" + monthNames[d.getMonth()]; break;
					case 'd': c = leftPad(d.getDate()); break;
					case 'e': c = leftPad(d.getDate(), " "); break;
					case 'h':	// For back-compat with 0.7; remove in 1.0
					case 'H': c = leftPad(hours); break;
					case 'I': c = leftPad(hours12); break;
					case 'l': c = leftPad(hours12, " "); break;
					case 'm': c = leftPad(d.getMonth() + 1); break;
					case 'M': c = leftPad(d.getMinutes()); break;
					// quarters not in Open Group's strftime specification
					case 'q':
						c = "" + (Math.floor(d.getMonth() / 3) + 1); break;
					case 'S': c = leftPad(d.getSeconds()); break;
					case 'y': c = leftPad(d.getFullYear() % 100); break;
					case 'Y': c = "" + d.getFullYear(); break;
					case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
					case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
					case 'w': c = "" + d.getDay(); break;
				}
				r.push(c);
				escape = false;
			} else {
				if (c == "%") {
					escape = true;
				} else {
					r.push(c);
				}
			}
		}

		return r.join("");
	}

	// To have a consistent view of time-based data independent of which time
	// zone the client happens to be in we need a date-like object independent
	// of time zones.  This is done through a wrapper that only calls the UTC
	// versions of the accessor methods.

	function makeUtcWrapper(d) {

		function addProxyMethod(sourceObj, sourceMethod, targetObj, targetMethod) {
			sourceObj[sourceMethod] = function() {
				return targetObj[targetMethod].apply(targetObj, arguments);
			};
		};

		var utc = {
			date: d
		};

		// support strftime, if found

		if (d.strftime != undefined) {
			addProxyMethod(utc, "strftime", d, "strftime");
		}

		addProxyMethod(utc, "getTime", d, "getTime");
		addProxyMethod(utc, "setTime", d, "setTime");

		var props = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];

		for (var p = 0; p < props.length; p++) {
			addProxyMethod(utc, "get" + props[p], d, "getUTC" + props[p]);
			addProxyMethod(utc, "set" + props[p], d, "setUTC" + props[p]);
		}

		return utc;
	};

	// select time zone strategy.  This returns a date-like object tied to the
	// desired timezone

	function dateGenerator(ts, opts) {
		if (opts.timezone == "browser") {
			return new Date(ts);
		} else if (!opts.timezone || opts.timezone == "utc") {
			return makeUtcWrapper(new Date(ts));
		} else if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
			var d = new timezoneJS.Date();
			// timezone-js is fickle, so be sure to set the time zone before
			// setting the time.
			d.setTimezone(opts.timezone);
			d.setTime(ts);
			return d;
		} else {
			return makeUtcWrapper(new Date(ts));
		}
	}
	
	// map of app. size of time units in milliseconds

	var timeUnitSize = {
		"second": 1000,
		"minute": 60 * 1000,
		"hour": 60 * 60 * 1000,
		"day": 24 * 60 * 60 * 1000,
		"month": 30 * 24 * 60 * 60 * 1000,
		"quarter": 3 * 30 * 24 * 60 * 60 * 1000,
		"year": 365.2425 * 24 * 60 * 60 * 1000
	};

	// the allowed tick sizes, after 1 year we use
	// an integer algorithm

	var baseSpec = [
		[1, "second"], [2, "second"], [5, "second"], [10, "second"],
		[30, "second"], 
		[1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
		[30, "minute"], 
		[1, "hour"], [2, "hour"], [4, "hour"],
		[8, "hour"], [12, "hour"],
		[1, "day"], [2, "day"], [3, "day"],
		[0.25, "month"], [0.5, "month"], [1, "month"],
		[2, "month"]
	];

	// we don't know which variant(s) we'll need yet, but generating both is
	// cheap

	var specMonths = baseSpec.concat([[3, "month"], [6, "month"],
		[1, "year"]]);
	var specQuarters = baseSpec.concat([[1, "quarter"], [2, "quarter"],
		[1, "year"]]);

	function init(plot) {
		plot.hooks.processOptions.push(function (plot, options) {
			$.each(plot.getAxes(), function(axisName, axis) {

				var opts = axis.options;

				if (opts.mode == "time") {
					axis.tickGenerator = function(axis) {

						var ticks = [];
						var d = dateGenerator(axis.min, opts);
						var minSize = 0;

						// make quarter use a possibility if quarters are
						// mentioned in either of these options

						var spec = (opts.tickSize && opts.tickSize[1] ===
							"quarter") ||
							(opts.minTickSize && opts.minTickSize[1] ===
							"quarter") ? specQuarters : specMonths;

						if (opts.minTickSize != null) {
							if (typeof opts.tickSize == "number") {
								minSize = opts.tickSize;
							} else {
								minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
							}
						}

						for (var i = 0; i < spec.length - 1; ++i) {
							if (axis.delta < (spec[i][0] * timeUnitSize[spec[i][1]]
											  + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
								&& spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
								break;
							}
						}

						var size = spec[i][0];
						var unit = spec[i][1];

						// special-case the possibility of several years

						if (unit == "year") {

							// if given a minTickSize in years, just use it,
							// ensuring that it's an integer

							if (opts.minTickSize != null && opts.minTickSize[1] == "year") {
								size = Math.floor(opts.minTickSize[0]);
							} else {

								var magn = Math.pow(10, Math.floor(Math.log(axis.delta / timeUnitSize.year) / Math.LN10));
								var norm = (axis.delta / timeUnitSize.year) / magn;

								if (norm < 1.5) {
									size = 1;
								} else if (norm < 3) {
									size = 2;
								} else if (norm < 7.5) {
									size = 5;
								} else {
									size = 10;
								}

								size *= magn;
							}

							// minimum size for years is 1

							if (size < 1) {
								size = 1;
							}
						}

						axis.tickSize = opts.tickSize || [size, unit];
						var tickSize = axis.tickSize[0];
						unit = axis.tickSize[1];

						var step = tickSize * timeUnitSize[unit];

						if (unit == "second") {
							d.setSeconds(floorInBase(d.getSeconds(), tickSize));
						} else if (unit == "minute") {
							d.setMinutes(floorInBase(d.getMinutes(), tickSize));
						} else if (unit == "hour") {
							d.setHours(floorInBase(d.getHours(), tickSize));
						} else if (unit == "month") {
							d.setMonth(floorInBase(d.getMonth(), tickSize));
						} else if (unit == "quarter") {
							d.setMonth(3 * floorInBase(d.getMonth() / 3,
								tickSize));
						} else if (unit == "year") {
							d.setFullYear(floorInBase(d.getFullYear(), tickSize));
						}

						// reset smaller components

						d.setMilliseconds(0);

						if (step >= timeUnitSize.minute) {
							d.setSeconds(0);
						}
						if (step >= timeUnitSize.hour) {
							d.setMinutes(0);
						}
						if (step >= timeUnitSize.day) {
							d.setHours(0);
						}
						if (step >= timeUnitSize.day * 4) {
							d.setDate(1);
						}
						if (step >= timeUnitSize.month * 2) {
							d.setMonth(floorInBase(d.getMonth(), 3));
						}
						if (step >= timeUnitSize.quarter * 2) {
							d.setMonth(floorInBase(d.getMonth(), 6));
						}
						if (step >= timeUnitSize.year) {
							d.setMonth(0);
						}

						var carry = 0;
						var v = Number.NaN;
						var prev;

						do {

							prev = v;
							v = d.getTime();
							ticks.push(v);

							if (unit == "month" || unit == "quarter") {
								if (tickSize < 1) {

									// a bit complicated - we'll divide the
									// month/quarter up but we need to take
									// care of fractions so we don't end up in
									// the middle of a day

									d.setDate(1);
									var start = d.getTime();
									d.setMonth(d.getMonth() +
										(unit == "quarter" ? 3 : 1));
									var end = d.getTime();
									d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
									carry = d.getHours();
									d.setHours(0);
								} else {
									d.setMonth(d.getMonth() +
										tickSize * (unit == "quarter" ? 3 : 1));
								}
							} else if (unit == "year") {
								d.setFullYear(d.getFullYear() + tickSize);
							} else {
								d.setTime(v + step);
							}
						} while (v < axis.max && v != prev);

						return ticks;
					};

					axis.tickFormatter = function (v, axis) {

						var d = dateGenerator(v, axis.options);

						// first check global format

						if (opts.timeformat != null) {
							return formatDate(d, opts.timeformat, opts.monthNames, opts.dayNames);
						}

						// possibly use quarters if quarters are mentioned in
						// any of these places

						var useQuarters = (axis.options.tickSize &&
								axis.options.tickSize[1] == "quarter") ||
							(axis.options.minTickSize &&
								axis.options.minTickSize[1] == "quarter");

						var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
						var span = axis.max - axis.min;
						var suffix = (opts.twelveHourClock) ? " %p" : "";
						var hourCode = (opts.twelveHourClock) ? "%I" : "%H";
						var fmt;

						if (t < timeUnitSize.minute) {
							fmt = hourCode + ":%M:%S" + suffix;
						} else if (t < timeUnitSize.day) {
							if (span < 2 * timeUnitSize.day) {
								fmt = hourCode + ":%M" + suffix;
							} else {
								fmt = "%b %d " + hourCode + ":%M" + suffix;
							}
						} else if (t < timeUnitSize.month) {
							fmt = "%b %d";
						} else if ((useQuarters && t < timeUnitSize.quarter) ||
							(!useQuarters && t < timeUnitSize.year)) {
							if (span < timeUnitSize.year) {
								fmt = "%b";
							} else {
								fmt = "%b %Y";
							}
						} else if (useQuarters && t < timeUnitSize.year) {
							if (span < timeUnitSize.year) {
								fmt = "Q%q";
							} else {
								fmt = "Q%q %Y";
							}
						} else {
							fmt = "%Y";
						}

						var rt = formatDate(d, fmt, opts.monthNames, opts.dayNames);

						return rt;
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'time',
		version: '1.0'
	});

	// Time-axis support used to be in Flot core, which exposed the
	// formatDate function on the plot object.  Various plugins depend
	// on the function, so we need to re-expose it here.

	$.plot.formatDate = formatDate;

})(jQuery);

define("jquery.flot.time", ["jquery","jquery.flot"], function(){});

/* Flot plugin for stacking data sets rather than overlyaing them.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

The plugin assumes the data is sorted on x (or y if stacking horizontally).
For line charts, it is assumed that if a line has an undefined gap (from a
null point), then the line above it should have the same gap - insert zeros
instead of "null" if you want another behaviour. This also holds for the start
and end of the chart. Note that stacking a mix of positive and negative values
in most instances doesn't make sense (so it looks weird).

Two or more series are stacked when their "stack" attribute is set to the same
key (which can be any number or string or just "true"). To specify the default
stack, you can set the stack option like this:

	series: {
		stack: null/false, true, or a key (number/string)
	}

You can also specify it for a single series, like this:

	$.plot( $("#placeholder"), [{
		data: [ ... ],
		stack: true
	}])

The stacking order is determined by the order of the data series in the array
(later series end up on top of the previous).

Internally, the plugin modifies the datapoints in each series, adding an
offset to the y value. For line series, extra data points are inserted through
interpolation. If there's a second y value, it's also adjusted (e.g for bar
charts or filled areas).

*/

(function ($) {
    var options = {
        series: { stack: null } // or number/string
    };
    
    function init(plot) {
        function findMatchingSeries(s, allseries) {
            var res = null;
            for (var i = 0; i < allseries.length; ++i) {
                if (s == allseries[i])
                    break;
                
                if (allseries[i].stack == s.stack)
                    res = allseries[i];
            }
            
            return res;
        }
        
        function stackData(plot, s, datapoints) {
            if (s.stack == null || s.stack === false)
                return;

            var other = findMatchingSeries(s, plot.getData());
            if (!other)
                return;

            var ps = datapoints.pointsize,
                points = datapoints.points,
                otherps = other.datapoints.pointsize,
                otherpoints = other.datapoints.points,
                newpoints = [],
                px, py, intery, qx, qy, bottom,
                withlines = s.lines.show,
                horizontal = s.bars.horizontal,
                withbottom = ps > 2 && (horizontal ? datapoints.format[2].x : datapoints.format[2].y),
                withsteps = withlines && s.lines.steps,
                fromgap = true,
                keyOffset = horizontal ? 1 : 0,
                accumulateOffset = horizontal ? 0 : 1,
                i = 0, j = 0, l, m;

            while (true) {
                if (i >= points.length)
                    break;

                l = newpoints.length;

                if (points[i] == null) {
                    // copy gaps
                    for (m = 0; m < ps; ++m)
                        newpoints.push(points[i + m]);
                    i += ps;
                }
                else if (j >= otherpoints.length) {
                    // for lines, we can't use the rest of the points
                    if (!withlines) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                    }
                    i += ps;
                }
                else if (otherpoints[j] == null) {
                    // oops, got a gap
                    for (m = 0; m < ps; ++m)
                        newpoints.push(null);
                    fromgap = true;
                    j += otherps;
                }
                else {
                    // cases where we actually got two points
                    px = points[i + keyOffset];
                    py = points[i + accumulateOffset];
                    qx = otherpoints[j + keyOffset];
                    qy = otherpoints[j + accumulateOffset];
                    bottom = 0;

                    if (px == qx) {
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);

                        newpoints[l + accumulateOffset] += qy;
                        bottom = qy;
                        
                        i += ps;
                        j += otherps;
                    }
                    else if (px > qx) {
                        // we got past point below, might need to
                        // insert interpolated extra point
                        if (withlines && i > 0 && points[i - ps] != null) {
                            intery = py + (points[i - ps + accumulateOffset] - py) * (qx - px) / (points[i - ps + keyOffset] - px);
                            newpoints.push(qx);
                            newpoints.push(intery + qy);
                            for (m = 2; m < ps; ++m)
                                newpoints.push(points[i + m]);
                            bottom = qy; 
                        }

                        j += otherps;
                    }
                    else { // px < qx
                        if (fromgap && withlines) {
                            // if we come from a gap, we just skip this point
                            i += ps;
                            continue;
                        }
                            
                        for (m = 0; m < ps; ++m)
                            newpoints.push(points[i + m]);
                        
                        // we might be able to interpolate a point below,
                        // this can give us a better y
                        if (withlines && j > 0 && otherpoints[j - otherps] != null)
                            bottom = qy + (otherpoints[j - otherps + accumulateOffset] - qy) * (px - qx) / (otherpoints[j - otherps + keyOffset] - qx);

                        newpoints[l + accumulateOffset] += bottom;
                        
                        i += ps;
                    }

                    fromgap = false;
                    
                    if (l != newpoints.length && withbottom)
                        newpoints[l + 2] += bottom;
                }

                // maintain the line steps invariant
                if (withsteps && l != newpoints.length && l > 0
                    && newpoints[l] != null
                    && newpoints[l] != newpoints[l - ps]
                    && newpoints[l + 1] != newpoints[l - ps + 1]) {
                    for (m = 0; m < ps; ++m)
                        newpoints[l + ps + m] = newpoints[l + m];
                    newpoints[l + 1] = newpoints[l - ps + 1];
                }
            }

            datapoints.points = newpoints;
        }
        
        plot.hooks.processDatapoints.push(stackData);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stack',
        version: '1.2'
    });
})(jQuery);

define("jquery.flot.stack", ["jquery","jquery.flot"], function(){});

(function ($) {
    var options = {
        series: {
            stackpercent: null
        } // or number/string
    };

    function init(plot) {

        // will be built up dynamically as a hash from x-value, or y-value if horizontal
        var stackBases = {};
        var processed = false;
        var stackSums = {};

        //set percentage for stacked chart
        function processRawData(plot, series, data, datapoints) {
            if (!processed) {
                processed = true;
                stackSums = getStackSums(plot.getData());
            }
			if (series.stackpercent == true) {
				var num = data.length;
				series.percents = [];
				var key_idx = 0;
				var value_idx = 1;
				if (series.bars && series.bars.horizontal && series.bars.horizontal === true) {
					key_idx = 1;
					value_idx = 0;
				}
				for (var j = 0; j < num; j++) {
					var sum = stackSums[data[j][key_idx] + ""];
					if (sum > 0) {
						series.percents.push(data[j][value_idx] * 100 / sum);
					} else {
						series.percents.push(0);
					}
				}
			}
        }

        //calculate summary
        function getStackSums(_data) {
            var data_len = _data.length;
            var sums = {};
            if (data_len > 0) {
                //caculate summary
                for (var i = 0; i < data_len; i++) {
                    if (_data[i].stackpercent) {
						var key_idx = 0;
						var value_idx = 1;
						if (_data[i].bars && _data[i].bars.horizontal && _data[i].bars.horizontal === true) {
							key_idx = 1;
							value_idx = 0;
						}
                        var num = _data[i].data.length;
                        for (var j = 0; j < num; j++) {
                            var value = 0;
                            if (_data[i].data[j][1] != null) {
                                value = _data[i].data[j][value_idx];
                            }
                            if (sums[_data[i].data[j][key_idx] + ""]) {
                                sums[_data[i].data[j][key_idx] + ""] += value;
                            } else {
                                sums[_data[i].data[j][key_idx] + ""] = value;
                            }

                        }
                    }
                }
            }
            return sums;
        }

        function stackData(plot, s, datapoints) {
            if (!s.stackpercent) return;
            if (!processed) {
                stackSums = getStackSums(plot.getData());
            }
            var newPoints = [];


			var key_idx = 0;
			var value_idx = 1;
			if (s.bars && s.bars.horizontal && s.bars.horizontal === true) {
				key_idx = 1;
				value_idx = 0;
			}

			for (var i = 0; i < datapoints.points.length; i += 3) {
				// note that the values need to be turned into absolute y-values.
				// in other words, if you were to stack (x, y1), (x, y2), and (x, y3),
				// (each from different series, which is where stackBases comes in),
				// you'd want the new points to be (x, y1, 0), (x, y1+y2, y1), (x, y1+y2+y3, y1+y2)
				// generally, (x, thisValue + (base up to this point), + (base up to this point))
				if (!stackBases[datapoints.points[i + key_idx]]) {
					stackBases[datapoints.points[i + key_idx]] = 0;
				}
				newPoints[i + key_idx] = datapoints.points[i + key_idx];
				newPoints[i + value_idx] = datapoints.points[i + value_idx] + stackBases[datapoints.points[i + key_idx]];
				newPoints[i + 2] = stackBases[datapoints.points[i + key_idx]];
				stackBases[datapoints.points[i + key_idx]] += datapoints.points[i + value_idx];
				// change points to percentage values
				// you may need to set yaxis:{ max = 100 }
				if ( stackSums[newPoints[i+key_idx]+""] > 0 ){
					newPoints[i + value_idx] = newPoints[i + value_idx] * 100 / stackSums[newPoints[i + key_idx] + ""];
					newPoints[i + 2] = newPoints[i + 2] * 100 / stackSums[newPoints[i + key_idx] + ""];
				} else {
					newPoints[i + value_idx] = 0;
					newPoints[i + 2] = 0;
				}
			}

            datapoints.points = newPoints;
        }

		plot.hooks.processRawData.push(processRawData);
        plot.hooks.processDatapoints.push(stackData);
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'stackpercent',
        version: '0.1'
    });
})(jQuery);

define("jquery.flot.stackpercent", ["jquery","jquery.flot"], function(){});

/*
Axis Labels Plugin for flot.
http://github.com/markrcote/flot-axislabels

Original code is Copyright (c) 2010 Xuan Luo.
Original code was released under the GPLv3 license by Xuan Luo, September 2010.
Original code was rereleased under the MIT license by Xuan Luo, April 2012.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function ($) {
    var options = {
      axisLabels: {
        show: true
      }
    };

    function canvasSupported() {
        return !!document.createElement('canvas').getContext;
    }

    function canvasTextSupported() {
        if (!canvasSupported()) {
            return false;
        }
        var dummy_canvas = document.createElement('canvas');
        var context = dummy_canvas.getContext('2d');
        return typeof context.fillText == 'function';
    }

    function css3TransitionSupported() {
        var div = document.createElement('div');
        return typeof div.style.MozTransition != 'undefined'    // Gecko
            || typeof div.style.OTransition != 'undefined'      // Opera
            || typeof div.style.webkitTransition != 'undefined' // WebKit
            || typeof div.style.transition != 'undefined';
    }


    function AxisLabel(axisName, position, padding, plot, opts) {
        this.axisName = axisName;
        this.position = position;
        this.padding = padding;
        this.plot = plot;
        this.opts = opts;
        this.width = 0;
        this.height = 0;
    }

    AxisLabel.prototype.cleanup = function() {
    };


    CanvasAxisLabel.prototype = new AxisLabel();
    CanvasAxisLabel.prototype.constructor = CanvasAxisLabel;
    function CanvasAxisLabel(axisName, position, padding, plot, opts) {
        AxisLabel.prototype.constructor.call(this, axisName, position, padding,
                                             plot, opts);
    }

    CanvasAxisLabel.prototype.calculateSize = function() {
        if (!this.opts.axisLabelFontSizePixels)
            this.opts.axisLabelFontSizePixels = 14;
        if (!this.opts.axisLabelFontFamily)
            this.opts.axisLabelFontFamily = 'sans-serif';

        var textWidth = this.opts.axisLabelFontSizePixels + this.padding;
        var textHeight = this.opts.axisLabelFontSizePixels + this.padding;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.opts.axisLabelFontSizePixels + this.padding;
            this.height = 0;
        } else {
            this.width = 0;
            this.height = this.opts.axisLabelFontSizePixels + this.padding;
        }
    };

    CanvasAxisLabel.prototype.draw = function(box) {
        if (!this.opts.axisLabelColour)
            this.opts.axisLabelColour = 'black';
        var ctx = this.plot.getCanvas().getContext('2d');
        ctx.save();
        ctx.font = this.opts.axisLabelFontSizePixels + 'px ' +
            this.opts.axisLabelFontFamily;
        ctx.fillStyle = this.opts.axisLabelColour;
        var width = ctx.measureText(this.opts.axisLabel).width;
        var height = this.opts.axisLabelFontSizePixels;
        var x, y, angle = 0;
        if (this.position == 'top') {
            x = box.left + box.width/2 - width/2;
            y = box.top + height*0.72;
        } else if (this.position == 'bottom') {
            x = box.left + box.width/2 - width/2;
            y = box.top + box.height - height*0.72;
        } else if (this.position == 'left') {
            x = box.left + height*0.72;
            y = box.height/2 + box.top + width/2;
            angle = -Math.PI/2;
        } else if (this.position == 'right') {
            x = box.left + box.width - height*0.72;
            y = box.height/2 + box.top - width/2;
            angle = Math.PI/2;
        }
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(this.opts.axisLabel, 0, 0);
        ctx.restore();
    };


    HtmlAxisLabel.prototype = new AxisLabel();
    HtmlAxisLabel.prototype.constructor = HtmlAxisLabel;
    function HtmlAxisLabel(axisName, position, padding, plot, opts) {
        AxisLabel.prototype.constructor.call(this, axisName, position,
                                             padding, plot, opts);
        this.elem = null;
    }

    HtmlAxisLabel.prototype.calculateSize = function() {
        var elem = $('<div class="axisLabels" style="position:absolute;">' +
                     this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(elem);
        // store height and width of label itself, for use in draw()
        this.labelWidth = elem.outerWidth(true);
        this.labelHeight = elem.outerHeight(true);
        elem.remove();

        this.width = this.height = 0;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.labelWidth + this.padding;
        } else {
            this.height = this.labelHeight + this.padding;
        }
    };

    HtmlAxisLabel.prototype.cleanup = function() {
        if (this.elem) {
            this.elem.remove();
        }
    };

    HtmlAxisLabel.prototype.draw = function(box) {
        this.plot.getPlaceholder().find('#' + this.axisName + 'Label').remove();
        this.elem = $('<div id="' + this.axisName +
                      'Label" " class="axisLabels" style="position:absolute;">'
                      + this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(this.elem);
        if (this.position == 'top') {
            this.elem.css('left', box.left + box.width/2 - this.labelWidth/2 +
                          'px');
            this.elem.css('top', box.top + 'px');
        } else if (this.position == 'bottom') {
            this.elem.css('left', box.left + box.width/2 - this.labelWidth/2 +
                          'px');
            this.elem.css('top', box.top + box.height - this.labelHeight +
                          'px');
        } else if (this.position == 'left') {
            this.elem.css('top', box.top + box.height/2 - this.labelHeight/2 +
                          'px');
            this.elem.css('left', box.left + 'px');
        } else if (this.position == 'right') {
            this.elem.css('top', box.top + box.height/2 - this.labelHeight/2 +
                          'px');
            this.elem.css('left', box.left + box.width - this.labelWidth +
                          'px');
        }
    };


    CssTransformAxisLabel.prototype = new HtmlAxisLabel();
    CssTransformAxisLabel.prototype.constructor = CssTransformAxisLabel;
    function CssTransformAxisLabel(axisName, position, padding, plot, opts) {
        HtmlAxisLabel.prototype.constructor.call(this, axisName, position,
                                                 padding, plot, opts);
    }

    CssTransformAxisLabel.prototype.calculateSize = function() {
        HtmlAxisLabel.prototype.calculateSize.call(this);
        this.width = this.height = 0;
        if (this.position == 'left' || this.position == 'right') {
            this.width = this.labelHeight + this.padding;
        } else {
            this.height = this.labelHeight + this.padding;
        }
    };

    CssTransformAxisLabel.prototype.transforms = function(degrees, x, y) {
        var stransforms = {
            '-moz-transform': '',
            '-webkit-transform': '',
            '-o-transform': '',
            '-ms-transform': ''
        };
        if (x != 0 || y != 0) {
            var stdTranslate = ' translate(' + x + 'px, ' + y + 'px)';
            stransforms['-moz-transform'] += stdTranslate;
            stransforms['-webkit-transform'] += stdTranslate;
            stransforms['-o-transform'] += stdTranslate;
            stransforms['-ms-transform'] += stdTranslate;
        }
        if (degrees != 0) {
            var rotation = degrees / 90;
            var stdRotate = ' rotate(' + degrees + 'deg)';
            stransforms['-moz-transform'] += stdRotate;
            stransforms['-webkit-transform'] += stdRotate;
            stransforms['-o-transform'] += stdRotate;
            stransforms['-ms-transform'] += stdRotate;
        }
        var s = 'top: 0; left: 0; ';
        for (var prop in stransforms) {
            if (stransforms[prop]) {
                s += prop + ':' + stransforms[prop] + ';';
            }
        }
        s += ';';
        return s;
    };

    CssTransformAxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = { x: 0, y: 0, degrees: 0 };
        if (this.position == 'bottom') {
            offsets.x = box.left + box.width/2 - this.labelWidth/2;
            offsets.y = box.top + box.height - this.labelHeight;
        } else if (this.position == 'top') {
            offsets.x = box.left + box.width/2 - this.labelWidth/2;
            offsets.y = box.top;
        } else if (this.position == 'left') {
            offsets.degrees = -90;
            offsets.x = box.left - this.labelWidth/2 + this.labelHeight/2;
            offsets.y = box.height/2 + box.top;
        } else if (this.position == 'right') {
            offsets.degrees = 90;
            offsets.x = box.left + box.width - this.labelWidth/2
                        - this.labelHeight/2;
            offsets.y = box.height/2 + box.top;
        }
        offsets.x = Math.round(offsets.x);
        offsets.y = Math.round(offsets.y);

        return offsets;
    };

    CssTransformAxisLabel.prototype.draw = function(box) {
        this.plot.getPlaceholder().find("." + this.axisName + "Label").remove();
        var offsets = this.calculateOffsets(box);
        this.elem = $('<div class="axisLabels ' + this.axisName +
                      'Label" style="position:absolute; ' +
                      this.transforms(offsets.degrees, offsets.x, offsets.y) +
                      '">' + this.opts.axisLabel + '</div>');
        this.plot.getPlaceholder().append(this.elem);
    };


    IeTransformAxisLabel.prototype = new CssTransformAxisLabel();
    IeTransformAxisLabel.prototype.constructor = IeTransformAxisLabel;
    function IeTransformAxisLabel(axisName, position, padding, plot, opts) {
        CssTransformAxisLabel.prototype.constructor.call(this, axisName,
                                                         position, padding,
                                                         plot, opts);
        this.requiresResize = false;
    }

    IeTransformAxisLabel.prototype.transforms = function(degrees, x, y) {
        // I didn't feel like learning the crazy Matrix stuff, so this uses
        // a combination of the rotation transform and CSS positioning.
        var s = '';
        if (degrees != 0) {
            var rotation = degrees/90;
            while (rotation < 0) {
                rotation += 4;
            }
            s += ' filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=' + rotation + '); ';
            // see below
            this.requiresResize = (this.position == 'right');
        }
        if (x != 0) {
            s += 'left: ' + x + 'px; ';
        }
        if (y != 0) {
            s += 'top: ' + y + 'px; ';
        }
        return s;
    };

    IeTransformAxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = CssTransformAxisLabel.prototype.calculateOffsets.call(
                          this, box);
        // adjust some values to take into account differences between
        // CSS and IE rotations.
        if (this.position == 'top') {
            // FIXME: not sure why, but placing this exactly at the top causes
            // the top axis label to flip to the bottom...
            offsets.y = box.top + 1;
        } else if (this.position == 'left') {
            offsets.x = box.left;
            offsets.y = box.height/2 + box.top - this.labelWidth/2;
        } else if (this.position == 'right') {
            offsets.x = box.left + box.width - this.labelHeight;
            offsets.y = box.height/2 + box.top - this.labelWidth/2;
        }
        return offsets;
    };

    IeTransformAxisLabel.prototype.draw = function(box) {
        CssTransformAxisLabel.prototype.draw.call(this, box);
        if (this.requiresResize) {
            this.elem = this.plot.getPlaceholder().find("." + this.axisName +
                                                        "Label");
            // Since we used CSS positioning instead of transforms for
            // translating the element, and since the positioning is done
            // before any rotations, we have to reset the width and height
            // in case the browser wrapped the text (specifically for the
            // y2axis).
            this.elem.css('width', this.labelWidth);
            this.elem.css('height', this.labelHeight);
        }
    };


    function init(plot) {
        plot.hooks.processOptions.push(function (plot, options) {

            if (!options.axisLabels.show)
                return;

            // This is kind of a hack. There are no hooks in Flot between
            // the creation and measuring of the ticks (setTicks, measureTickLabels
            // in setupGrid() ) and the drawing of the ticks and plot box
            // (insertAxisLabels in setupGrid() ).
            //
            // Therefore, we use a trick where we run the draw routine twice:
            // the first time to get the tick measurements, so that we can change
            // them, and then have it draw it again.
            var secondPass = false;

            var axisLabels = {};
            var axisOffsetCounts = { left: 0, right: 0, top: 0, bottom: 0 };

            var defaultPadding = 2;  // padding between axis and tick labels
            plot.hooks.draw.push(function (plot, ctx) {
                var hasAxisLabels = false;
                if (!secondPass) {
                    // MEASURE AND SET OPTIONS
                    $.each(plot.getAxes(), function(axisName, axis) {
                        var opts = axis.options // Flot 0.7
                            || plot.getOptions()[axisName]; // Flot 0.6

                        // Handle redraws initiated outside of this plug-in.
                        if (axisName in axisLabels) {
                            axis.labelHeight = axis.labelHeight -
                                axisLabels[axisName].height;
                            axis.labelWidth = axis.labelWidth -
                                axisLabels[axisName].width;
                            opts.labelHeight = axis.labelHeight;
                            opts.labelWidth = axis.labelWidth;
                            axisLabels[axisName].cleanup();
                            delete axisLabels[axisName];
                        }

                        if (!opts || !opts.axisLabel || !axis.show)
                            return;

                        hasAxisLabels = true;
                        var renderer = null;

                        if (!opts.axisLabelUseHtml &&
                            navigator.appName == 'Microsoft Internet Explorer') {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null) {
                                rv = parseFloat(RegExp.$1);
                            }
                            if (rv >= 9 && !opts.axisLabelUseCanvas && !opts.axisLabelUseHtml) {
                                renderer = CssTransformAxisLabel;
                            } else if (!opts.axisLabelUseCanvas && !opts.axisLabelUseHtml) {
                                renderer = IeTransformAxisLabel;
                            } else if (opts.axisLabelUseCanvas) {
                                renderer = CanvasAxisLabel;
                            } else {
                                renderer = HtmlAxisLabel;
                            }
                        } else {
                            if (opts.axisLabelUseHtml || (!css3TransitionSupported() && !canvasTextSupported()) && !opts.axisLabelUseCanvas) {
                                renderer = HtmlAxisLabel;
                            } else if (opts.axisLabelUseCanvas || !css3TransitionSupported()) {
                                renderer = CanvasAxisLabel;
                            } else {
                                renderer = CssTransformAxisLabel;
                            }
                        }

                        var padding = opts.axisLabelPadding === undefined ?
                                      defaultPadding : opts.axisLabelPadding;

                        axisLabels[axisName] = new renderer(axisName,
                                                            axis.position, padding,
                                                            plot, opts);

                        // flot interprets axis.labelHeight and .labelWidth as
                        // the height and width of the tick labels. We increase
                        // these values to make room for the axis label and
                        // padding.

                        axisLabels[axisName].calculateSize();

                        // AxisLabel.height and .width are the size of the
                        // axis label and padding.
                        // Just set opts here because axis will be sorted out on
                        // the redraw.

                        opts.labelHeight = axis.labelHeight +
                            axisLabels[axisName].height;
                        opts.labelWidth = axis.labelWidth +
                            axisLabels[axisName].width;
                    });

                    // If there are axis labels, re-draw with new label widths and
                    // heights.

                    if (hasAxisLabels) {
                        secondPass = true;
                        plot.setupGrid();
                        plot.draw();
                    }
                } else {
                    secondPass = false;
                    // DRAW
                    $.each(plot.getAxes(), function(axisName, axis) {
                        var opts = axis.options // Flot 0.7
                            || plot.getOptions()[axisName]; // Flot 0.6
                        if (!opts || !opts.axisLabel || !axis.show)
                            return;

                        axisLabels[axisName].draw(axis.box);
                    });
                }
            });
        });
    }


    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '2.0'
    });
})(jQuery);

define("jquery.flot.axislabels", ["jquery","jquery.flot"], function(){});

/*

  ## Histogram

  ### Parameters
  * auto_int :: Auto calculate data point interval?
  * resolution ::  If auto_int is enables, shoot for this many data points, rounding to
                    sane intervals
  * interval :: Datapoint interval in elasticsearch date math format (eg 1d, 1w, 1y, 5y)
  * fill :: Only applies to line charts. Level of area shading from 0-10
  * linewidth ::  Only applies to line charts. How thick the line should be in pixels
                  While the editor only exposes 0-10, this can be any numeric value.
                  Set to 0 and you'll get something like a scatter plot
  * timezone :: This isn't totally functional yet. Currently only supports browser and utc.
                browser will adjust the x-axis labels to match the timezone of the user's
                browser
  * spyable ::  Dislay the 'eye' icon that show the last elasticsearch query
  * zoomlinks :: Show the zoom links?
  * bars :: Show bars in the chart
  * stack :: Stack multiple queries. This generally a crappy way to represent things.
             You probably should just use a line chart without stacking
  * points :: Should circles at the data points on the chart
  * lines :: Line chart? Sweet.
  * legend :: Show the legend?
  * x-axis :: Show x-axis labels and grid lines
  * y-axis :: Show y-axis labels and grid lines
  * interactive :: Allow drag to select time range

*/
define('panels/histogram/module',[
  'angular',
  'app',
  'jquery',
  'underscore',
  'kbn',
  'moment',
  './timeSeries',

  'jquery.flot',
  'jquery.flot.pie',
  'jquery.flot.selection',
  'jquery.flot.time',
  'jquery.flot.stack',
  'jquery.flot.stackpercent',
  'jquery.flot.axislabels'
],
function (angular, app, $, _, kbn, moment, timeSeries) {
  'use strict';

  var module = angular.module('kibana.panels.histogram', []);
  app.useModule(module);

  module.controller('histogram', function($scope, $q, $timeout, timer, querySrv, dashboard, filterSrv) {
    $scope.panelMeta = {
      modals : [
        {
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }
      ],
      editorTabs : [
        {
          title:'Queries',
          src:'app/partials/querySelect.html'
        }
      ],
      status  : "Stable",
      description : "A bucketed time series chart of the current query, including all applied time and non-time filters, when used in <i>count</i> mode. Uses Solr’s facet.range query parameters. In <i>values</i> mode, it plots the value of a specific field over time, and allows the user to group field values by a second field."
    };

    // Set and populate defaults
    var _d = {
      mode        : 'count',
      queries     : {
        mode        : 'all',
        ids         : [],
        query       : '*:*',
        custom      : ''
      },
      max_rows    : 100000,  // maximum number of rows returned from Solr (also use this for group.limit to simplify UI setting)
      value_field : null,
      group_field : null,
      sum_value   : false,
      auto_int    : true,
      resolution  : 100,
      interval    : '5m',
      intervals   : ['auto','1s','1m','5m','10m','30m','1h','3h','12h','1d','1w','1M','1y'],
      fill        : 0,
      linewidth   : 3,
      timezone    : 'browser', // browser, utc or a standard timezone
      spyable     : true,
      zoomlinks   : true,
      bars        : true,
      stack       : true,
      points      : false,
      lines       : false,
      lines_smooth: false, // Enable 'smooth line' mode by removing zero values from the plot.
      legend      : true,
      'x-axis'    : true,
      'y-axis'    : true,
      percentage  : false,
      interactive : true,
      options     : true,
      show_queries: true,
      tooltip     : {
        value_type: 'cumulative',
        query_as_alias: false
      },
      refresh: {
        enable: false,
        interval: 2
      }
    };

    _.defaults($scope.panel,_d);

    $scope.init = function() {
      // Hide view options by default
      $scope.options = false;

      // Start refresh timer if enabled
      if ($scope.panel.refresh.enable) {
        $scope.set_timer($scope.panel.refresh.interval);
      }

      $scope.$on('refresh',function(){
        $scope.get_data();
      });

      $scope.get_data();
    };

    $scope.set_timer = function(refresh_interval) {
      $scope.panel.refresh.interval = refresh_interval;
      if (_.isNumber($scope.panel.refresh.interval)) {
        timer.cancel($scope.refresh_timer);
        $scope.realtime();
      } else {
        timer.cancel($scope.refresh_timer);
      }
    };

    $scope.realtime = function() {
      if ($scope.panel.refresh.enable) {
        timer.cancel($scope.refresh_timer);

        $scope.refresh_timer = timer.register($timeout(function() {
          $scope.realtime();
          $scope.get_data();
        }, $scope.panel.refresh.interval*1000));
      } else {
        timer.cancel($scope.refresh_timer);
      }
    };

    $scope.set_interval = function(interval) {
      if(interval !== 'auto') {
        $scope.panel.auto_int = false;
        $scope.panel.interval = interval;
      } else {
        $scope.panel.auto_int = true;
      }
    };

    $scope.interval_label = function(interval) {
      return $scope.panel.auto_int && interval === $scope.panel.interval ? interval+" (auto)" : interval;
    };

    /**
     * The time range effecting the panel
     * @return {[type]} [description]
     */
    $scope.get_time_range = function () {
      var range = $scope.range = filterSrv.timeRange('min');
      return range;
    };

    $scope.get_interval = function () {
      var interval = $scope.panel.interval,
                      range;
      if ($scope.panel.auto_int) {
        range = $scope.get_time_range();
        if (range) {
          interval = kbn.secondsToHms(
            kbn.calculate_interval(range.from, range.to, $scope.panel.resolution, 0) / 1000
          );
        }
      }
      $scope.panel.interval = interval || '10m';
      return $scope.panel.interval;
    };

    /**
     * Fetch the data for a chunk of a queries results. Multiple segments occur when several indicies
     * need to be consulted (like timestamped logstash indicies)
     *
     * The results of this function are stored on the scope's data property. This property will be an
     * array of objects with the properties info, time_series, and hits. These objects are used in the
     * render_panel function to create the historgram.
     *
     * !!! Solr does not need to fetch the data in chunk because it uses a facet search and retrieve
     * !!! all events from a single query.
     *
     * @param {number} segment   The segment count, (0 based)
     * @param {number} query_id  The id of the query, generated on the first run and passed back when
     *                            this call is made recursively for more segments
     */
    $scope.get_data = function(segment, query_id) {
      if (_.isUndefined(segment)) {
        segment = 0;
      }
      delete $scope.panel.error;

      // Make sure we have everything for the request to complete
      if(dashboard.indices.length === 0) {
        return;
      }
      var _range = $scope.get_time_range();
      var _interval = $scope.get_interval(_range);

      if ($scope.panel.auto_int) {
        $scope.panel.interval = kbn.secondsToHms(
          kbn.calculate_interval(_range.from,_range.to,$scope.panel.resolution,0)/1000);
      }

      $scope.panelMeta.loading = true;

      // Solr
      $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);

      var request = $scope.sjs.Request().indices(dashboard.indices[segment]);
      $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);
      

      $scope.panel.queries.query = "";
      // Build the query
      _.each($scope.panel.queries.ids, function(id) {
        var query = $scope.sjs.FilteredQuery(
          querySrv.getEjsObj(id),
          filterSrv.getBoolFilter(filterSrv.ids)
        );

        var facet = $scope.sjs.DateHistogramFacet(id);

        if($scope.panel.mode === 'count') {
          facet = facet.field(filterSrv.getTimeField());
        } else {
          if(_.isNull($scope.panel.value_field)) {
            $scope.panel.error = "In " + $scope.panel.mode + " mode a field must be specified";
            return;
          }
          facet = facet.keyField(filterSrv.getTimeField()).valueField($scope.panel.value_field);
        }
        facet = facet.interval(_interval).facetFilter($scope.sjs.QueryFilter(query));
        request = request.facet(facet).size(0);
      });

      // Populate the inspector panel
      $scope.populate_modal(request);

      // Build Solr query
      var fq = '';
      if (filterSrv.getSolrFq()) {
        fq = '&' + filterSrv.getSolrFq();
      }
      var time_field = filterSrv.getTimeField();
      var start_time = filterSrv.getStartTime();
      var end_time = filterSrv.getEndTime();

      // facet.range.end does NOT accept * as a value, need to convert it to NOW
      if (end_time === '*') {
        end_time = 'NOW';
      }

      var wt_json = '&wt=json';
      var rows_limit = '&rows=0'; // for histogram, we do not need the actual response doc, so set rows=0
      var facet_gap = $scope.sjs.convertFacetGap($scope.panel.interval);
      var facet = '&facet=true' +
                  '&facet.range=' + time_field +
                  '&facet.range.start=' + start_time +
                  '&facet.range.end=' + end_time +
                  '&facet.range.gap=' + facet_gap;
      var values_mode_query = '';

      // For mode = value
      if($scope.panel.mode === 'values') {
        if (!$scope.panel.value_field) {
            $scope.panel.error = "In " + $scope.panel.mode + " mode a field must be specified";
            return;
        }

        values_mode_query = '&fl=' + time_field + ' ' + $scope.panel.value_field;
        rows_limit = '&rows=' + $scope.panel.max_rows;
        facet = '';

        // if Group By Field is specified
        if ($scope.panel.group_field) {
          values_mode_query += '&group=true&group.field=' + $scope.panel.group_field + '&group.limit=' + $scope.panel.max_rows;
        }
      }
      
      var mypromises = [];
       _.each($scope.panel.queries.ids, function(id) {
        var temp_q =  querySrv.getQuery(id) + wt_json + rows_limit + fq + facet + values_mode_query;
        $scope.panel.queries.query += temp_q + "\n";
        if ($scope.panel.queries.custom !== null) {
          request = request.setQuery(temp_q + $scope.panel.queries.custom);
        } else {
          request = request.setQuery(temp_q);
        }
        mypromises.push(request.doSearch());
      });

      if (dashboard.current.services.query.ids.length >= 1) {
        $q.all(mypromises).then(function(results) {
          $scope.panelMeta.loading = false;
          if (segment === 0) {
            $scope.hits = 0;
            $scope.data = [];
            query_id = $scope.query_id = new Date().getTime();
          }
          // Convert facet ids to numbers
          // var facetIds = _.map(_.keys(results.facets),function(k){return parseInt(k, 10);});
          // TODO: change this, Solr do faceting differently
          // var facetIds = [0]; // Need to fix this

          // Make sure we're still on the same query/queries
          // TODO: We probably DON'T NEED THIS unless we have to support multiple queries in query module.
          // if ($scope.query_id === query_id && _.difference(facetIds, $scope.panel.queries.ids).length === 0) {
            var i = 0,
              time_series,
              hits;

            _.each($scope.panel.queries.ids, function(id,index) {
              // Check for error and abort if found
              if (!(_.isUndefined(results[index].error))) {
                $scope.panel.error = $scope.parse_error(results[index].error.msg);
                return;
              }
              // we need to initialize the data variable on the first run,
              // and when we are working on the first segment of the data.
              if (_.isUndefined($scope.data[i]) || segment === 0) {
                time_series = new timeSeries.ZeroFilled({
                  interval: _interval,
                  start_date: _range && _range.from,
                  end_date: _range && _range.to,
                  fill_style: 'minimal'
                });
                hits = 0;
              } else {
                time_series = $scope.data[i].time_series;
                // Bug fix for wrong event count:
                //   Solr don't need to accumulate hits count since it can get total count from facet query.
                //   Therefore, I need to set hits and $scope.hits to zero.
                // hits = $scope.data[i].hits;
                hits = 0;
                $scope.hits = 0;
              }

              // Solr facet counts response is in one big array.
              // So no need to get each segment like Elasticsearch does.
              var entry_time, entries, entry_value;
              if ($scope.panel.mode === 'count') {
                // Entries from facet_ranges counts
                entries = results[index].facet_counts.facet_ranges[time_field].counts;
                for (var j = 0; j < entries.length; j++) {
                  entry_time = new Date(entries[j]).getTime(); // convert to millisec
                  j++;
                  var entry_count = entries[j];
                  time_series.addValue(entry_time, entry_count);
                  hits += entry_count; // The series level hits counter
                  $scope.hits += entry_count; // Entire dataset level hits counter
                }
              } else if ($scope.panel.mode === 'values') {
                if ($scope.panel.group_field) {
                  // Group By Field is specified
                  var groups = results[index].grouped[$scope.panel.group_field].groups;

                  for (var j = 0; j < groups.length; j++) { // jshint ignore: line
                    var docs = groups[j].doclist.docs;
                    // var numFound = groups[j].doclist.numFound;
                    var group_time_series = new timeSeries.ZeroFilled({
                      interval: _interval,
                      start_date: _range && _range.from,
                      end_date: _range && _range.to,
                      fill_style: 'minimal'
                    });
                    hits = 0;

                    // loop through each group results
                    for (var k = 0; k < docs.length; k++) {
                      entry_time = new Date(docs[k][time_field]).getTime(); // convert to millisec
                      entry_value = docs[k][$scope.panel.value_field];
                      if($scope.panel.sum_value) {
                        group_time_series.sumValue(entry_time, entry_value);
                      }else {
                        group_time_series.addValue(entry_time, entry_value);
                      }

                      hits += 1;
                      $scope.hits += 1;
                    }


                    $scope.data[j] = {
                      // info: querySrv.list[id],
                      // Need to define chart info here according to the results, cannot use querySrv.list[id]
                      info: {
                        alias: groups[j].groupValue,
                        color: querySrv.colors[j],

                      },
                      time_series: group_time_series,
                      hits: hits
                    };
                  }

                } else { // Group By Field is not specified
                  entries = results[index].response.docs;
                  for (var j = 0; j < entries.length; j++) { // jshint ignore: line
                    entry_time = new Date(entries[j][time_field]).getTime(); // convert to millisec
                    entry_value = entries[j][$scope.panel.value_field];
                    time_series.addValue(entry_time, entry_value);
                    hits += 1;
                    $scope.hits += 1;
                  }

                  $scope.data[i] = {
                    info: querySrv.list[id],
                    time_series: time_series,
                    hits: hits
                  };
                }
              }

              if ($scope.panel.mode !== 'values') {
                $scope.data[i] = {
                  info: querySrv.list[id],
                  time_series: time_series,
                  hits: hits
                };
              }

              i++;
            });

            // Tell the histogram directive to render.
            $scope.$emit('render');
          // }
        });
      }
    };

    // function $scope.zoom
    // factor :: Zoom factor, so 0.5 = cuts timespan in half, 2 doubles timespan
    $scope.zoom = function(factor) {
      var _range = filterSrv.timeRange('min');
      var _timespan = (_range.to.valueOf() - _range.from.valueOf());
      var _center = _range.to.valueOf() - _timespan/2;

      var _to = (_center + (_timespan*factor)/2);
      var _from = (_center - (_timespan*factor)/2);

      // If we're not already looking into the future, don't.
      if(_to > Date.now() && _range.to < Date.now()) {
        var _offset = _to - Date.now();
        _from = _from - _offset;
        _to = Date.now();
      }

      var time_field = filterSrv.getTimeField();
      if(factor > 1) {
        filterSrv.removeByType('time');
      }

      filterSrv.set({
        type:'time',
        from:moment.utc(_from).toDate(),
        to:moment.utc(_to).toDate(),
        field:time_field
      });

      dashboard.refresh();

    };

    // I really don't like this function, too much dom manip. Break out into directive?
    $scope.populate_modal = function(request) {
      $scope.inspector = angular.toJson(JSON.parse(request.toString()),true);
    };

    $scope.set_refresh = function (state) {
      $scope.refresh = state;
    };

    $scope.close_edit = function() {
      // Start refresh timer if enabled
      if ($scope.panel.refresh.enable) {
        $scope.set_timer($scope.panel.refresh.interval);
      }
      if ($scope.refresh) {
        $scope.get_data();
      }
      $scope.refresh = false;
      $scope.$emit('render');
    };

    $scope.render = function() {
      $scope.$emit('render');
    };
  });

  module.directive('histogramChart', function(dashboard, filterSrv) {
    return {
      restrict: 'A',
      template: '<div></div>',
      link: function(scope, elem) {

        // Receive render events
        scope.$on('render',function(){
          render_panel();
        });

        // Re-render if the window is resized
        angular.element(window).bind('resize', function(){
          render_panel();
        });

        // Function for rendering panel
        function render_panel() {
          // IE doesn't work without this
          elem.css({height:scope.panel.height || scope.row.height});

          // Populate from the query service
          try {
            _.each(scope.data, function(series) {
              series.label = series.info.alias;
              series.color = series.info.color;
            });
          } catch(e) {return;}

          // Set barwidth based on specified interval
          var barwidth = kbn.interval_to_ms(scope.panel.interval);

          var stack = scope.panel.stack ? true : null;

          // Populate element
          try {
            var options = {
              legend: { show: false },
              series: {
                stackpercent: scope.panel.stack ? scope.panel.percentage : false,
                stack: scope.panel.percentage ? null : stack,
                lines:  {
                  show: scope.panel.lines,
                  // Silly, but fixes bug in stacked percentages
                  fill: scope.panel.fill === 0 ? 0.001 : scope.panel.fill/10,
                  lineWidth: scope.panel.linewidth,
                  steps: false
                },
                bars:   {
                  show: scope.panel.bars,
                  fill: 1,
                  barWidth: barwidth/1.8,
                  zero: false,
                  lineWidth: 0
                },
                points: {
                  show: scope.panel.points,
                  fill: 1,
                  fillColor: false,
                  radius: 5
                },
                shadowSize: 1
              },
               axisLabels: {
                show: true
              },
              yaxis: {
                show: scope.panel['y-axis'],
                min: null, // TODO - make this adjusted dynamicmally, and add it to configuration panel
                max: scope.panel.percentage && scope.panel.stack ? 100 : null,
                axisLabel: scope.panel.mode,
              },
              xaxis: {
                timezone: scope.panel.timezone,
                show: scope.panel['x-axis'],
                mode: "time",
                min: _.isUndefined(scope.range.from) ? null : scope.range.from.getTime(),
                max: _.isUndefined(scope.range.to) ? null : scope.range.to.getTime(),
                timeformat: time_format(scope.panel.interval),
                label: "Datetime",
                axisLabel: filterSrv.getTimeField(),
              },
              grid: {
                backgroundColor: null,
                borderWidth: 0,
                hoverable: true,
                color: '#c8c8c8'
              }
            };

            if(scope.panel.interactive) {
              options.selection = { mode: "x", color: '#666' };
            }

            // when rendering stacked bars, we need to ensure each point that has data is zero-filled
            // so that the stacking happens in the proper order
            var required_times = [];
            if (scope.data.length > 1) {
              required_times = Array.prototype.concat.apply([], _.map(scope.data, function (query) {
                return query.time_series.getOrderedTimes();
              }));
              required_times = _.uniq(required_times.sort(function (a, b) {
                // decending numeric sort
                return a-b;
              }), true);
            }

            for (var i = 0; i < scope.data.length; i++) {
              scope.data[i].data = scope.data[i].time_series.getFlotPairs(required_times);
            }

            // ISSUE: SOL-76
            // If 'lines_smooth' is enabled, loop through $scope.data[] and remove zero filled entries.
            // Without zero values, the line chart will appear smooth as SiLK ;-)
            if (scope.panel.lines_smooth) {
              for (var i=0; i < scope.data.length; i++) { // jshint ignore: line
                var new_data = [];
                for (var j=0; j < scope.data[i].data.length; j++) {
                  // if value of the timestamp !== 0, then add it to new_data
                  if (scope.data[i].data[j][1] !== 0) {
                    new_data.push(scope.data[i].data[j]);
                  }
                }
                scope.data[i].data = new_data;
              }
            }

            scope.plot = $.plot(elem, scope.data, options);
          } catch(e) {
            // TODO: Need to fix bug => "Invalid dimensions for plot, width = 0, height = 200"
            console.log(e);
          }
        }

        function time_format(interval) {
          var _int = kbn.interval_to_seconds(interval);
          if(_int >= 2628000) {
            return "%m/%y";
          }
          if(_int >= 86400) {
            return "%m/%d/%y";
          }
          if(_int >= 60) {
            return "%H:%M<br>%m/%d";
          }

          return "%H:%M:%S";
        }

        var $tooltip = $('<div>');
        elem.bind("plothover", function (event, pos, item) {
          var group, value;
          if (item) {
            if (item.series.info.alias || scope.panel.tooltip.query_as_alias) {
              group = '<small style="font-size:0.9em;">' +
                '<i class="icon-circle" style="color:'+item.series.color+';"></i>' + ' ' +
                (item.series.info.alias || item.series.info.query)+
              '</small><br>';
            } else {
              group = kbn.query_color_dot(item.series.color, 15) + ' ';
            }
            if (scope.panel.stack && scope.panel.tooltip.value_type === 'individual')  {
              value = item.datapoint[1] - item.datapoint[2];
            } else {
              value = item.datapoint[1];
            }

            var lnLastValue = value;

            var lbPositiveValue = (lnLastValue>0);

            var lsItemTT = group + dashboard.numberWithCommas(value) + " @ " + (scope.panel.timezone === 'utc'? moment.utc(item.datapoint[0]).format('MM/DD HH:mm:ss') : moment(item.datapoint[0]).format('MM/DD HH:mm:ss'));

            var hoverSeries = item.series;
            var x = item.datapoint[0];
                // y = item.datapoint[1];

            var lsTT = lsItemTT;
            var allSeries = scope.plot.getData();
            var posSerie = -1;
            for (var i= allSeries.length - 1 ; i>=0; i--) {

              //if stack stop at the first positive value
              if (scope.panel.stack && lbPositiveValue){
                break;
              }

              var s = allSeries[i];
              i = parseInt(i);


              if (s === hoverSeries ) {
                posSerie = i;
              }

              //not consider serie "upper" the hover serie
              if (  i >= posSerie ){
                continue;
              }

              //search in current serie a point with de same position.
              for(var j= 0; j< s.data.length;j++){
                var p = s.data[j];
                if (p[0] === x ){

                  if (scope.panel.stack && scope.panel.tooltip.value_type === 'individual' && !isNaN(p[2]))  {
                    value = p[1] - p[2];
                  } else {
                    value = p[1];
                  }

                  lbPositiveValue = value > 0;

                  if (! scope.panel.stack && value !== lnLastValue){
                    break;
                  }

                  posSerie = i;
                  lnLastValue = value;


                  if (s.info.alias || scope.panel.tooltip.query_as_alias) {
                    group = '<small style="font-size:0.9em;">' +
                        '<i class="icon-circle" style="color:'+s.color+';"></i>' + ' ' +
                        (s.info.alias || s.info.query)+
                        '</small><br>';
                  } else {
                    group = kbn.query_color_dot(s.color, 15) + ' ';
                  }

                  lsItemTT = group + dashboard.numberWithCommas(value) + " @ " + (scope.panel.timezone === 'utc'? moment.utc(p[0]).format('MM/DD HH:mm:ss') : moment(p[0]).format('MM/DD HH:mm:ss'));
                  lsTT = lsTT +"</br>"+ lsItemTT;
                  break;
                }
              }
            }


            $tooltip
              .html( lsTT )
              .place_tt(pos.pageX, pos.pageY);
          } else {
            $tooltip.detach();
          }
        });

        elem.bind("plotselected", function (event, ranges) {
          filterSrv.set({
            type  : 'time',
            // from  : moment.utc(ranges.xaxis.from),
            // to    : moment.utc(ranges.xaxis.to),
            from  : moment.utc(ranges.xaxis.from).toDate(),
            to    : moment.utc(ranges.xaxis.to).toDate(),
            field : filterSrv.getTimeField()
          });
          dashboard.refresh();
        });
      }
    };
  });

});

