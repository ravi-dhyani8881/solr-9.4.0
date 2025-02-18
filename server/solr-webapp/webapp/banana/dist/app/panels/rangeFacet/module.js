define('panels/rangeFacet/interval',[
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
define('panels/rangeFacet/timeSeries',[
  'underscore',
  './interval'
],
function (_, Interval) {
  'use strict';

  var ts = {};

  function parseFloatValue(val) {
    return parseFloat(val);
  }

  // map compatable parseInt
//  function base10Int(val) {
//    return parseInt(val, 10);
//  }

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
    //this.interval = 1

    // will keep all values here, keyed by their time
    this._data = {};
    this.start_value = opts.start_date && parseFloatValue(opts.start_date);
    this.end_value = opts.end_date && parseFloatValue(opts.end_date);
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
      time = parseFloatValue(time);
    }
    if (!isNaN(time)) {
      this._data[time] = (_.isUndefined(value) ? 0 : value);
    }
    this._cached_times = null;
  };

  /**
   * Get an array of the times that have been explicitly set in the series
   * @param  {array} include (optional) list of timestamps to include in the response
   * @return {array} An array of integer times.
   */
  ts.ZeroFilled.prototype.getOrderedTimes = function (include) {
    var times = _.map(_.keys(this._data), parseFloatValue);
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
    if (this.start_value && (pairs.length === 0 || pairs[0][0] > this.start_value)) {
      pairs.unshift([this.start_value, null]);
    }
    if (this.end_value && (pairs.length === 0 || pairs[pairs.length - 1][0] < this.end_value)) {
      pairs.push([this.end_value, null]);
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

/*
  ## RangeFacet
  ### Parameters
  * fill :: Only applies to line charts. Level of area shading from 0-10
  * linewidth ::  Only applies to line charts. How thick the line should be in pixels
                  While the editor only exposes 0-10, this can be any numeric value.
                  Set to 0 and you'll get something like a scatter plot
  * spyable ::  Dislay the 'eye' icon that show the last elasticsearch query
  * zoomlinks :: Show the zoom links?
  * bars :: Show bars in the chart
  * points :: Should circles at the data points on the chart
  * lines :: Line chart? Sweet.
  * legend :: Show the legend?
  * x-axis :: Show x-axis labels and grid lines
  * y-axis :: Show y-axis labels and grid lines
  * interactive :: Allow drag to select time range
*/
define('panels/rangeFacet/module',[
  'angular',
  'app',
  'jquery',
  'underscore',
  'kbn',
  'moment',
  './timeSeries'
],
function (angular, app, $, _, kbn, moment, timeSeries) {
  'use strict';

  var module = angular.module('kibana.panels.rangeFacet', []);
  app.useModule(module);

  module.controller('rangeFacet', function($scope, $q, $timeout, timer, querySrv, dashboard, filterSrv) {
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
      status  : "Beta",
      description : "Histogram view across any numeric field using Solr’s range.facet functionality. Works similar to the time series histogram, allowing selection of ranges, and zooming in/out to the desired numeric range. Range selections in panel are reflected across the entire dashboard."
    };

    // Set and populate defaults
    var _d = {
      mode        : 'count',
      time_field  : 'timestamp',
      queries     : {
        mode        : 'all',
        ids         : [],
        query       : '*:*',
        custom      : ''
      },
      max_rows    : 100000,  // maximum number of rows returned from Solr (also use this for group.limit to simplify UI setting)
      value_field : null,
      fill        : 0,
      linewidth   : 3,
      auto_int    : true,
      resolution  : 100,
      interval    : '10',
      interval_decimal: 1,   // default number of decimals to display in the chart for each range.
                             // This number is automatically calculated.
      resolutions : [5,10,25,50,75,100],
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
      minimum     : 0,     // Default x-axis minimum value
      maximum     : 1000,  // Default x-axis maximum value
      chart_minimum: 0,    // Current min value for x-axis
      chart_maximum: 1000, // Current max value for x-axis
      tooltip     : {
        value_type: 'cumulative',
        query_as_alias: false
      },
      showChart: true,
      show_queries: true,
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

      $scope.set_configurations($scope.panel.minimum, $scope.panel.maximum);
      $scope.get_data();

      $scope.$on('refresh',function(){
        $scope.get_data();
      });
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

    $scope.set_precision = function(precision) {
      $scope.panel.resolution = precision;
    };

    $scope.set_interval = function(interval) {
      if (interval !== 'auto') {
        $scope.panel.auto_int = false;
        $scope.panel.interval = interval;
      } else {
        $scope.panel.auto_int = true;
      }
    };
    
    $scope.calculate_tick_value = function(interval) {
      if (interval >= 1) {
        return 1;
      } else {
        return interval;
      }
    };

    $scope.calculate_tick_decimals = function(interval) {
      if (interval >= 1) {
        return 0;
      } else {
        return 1;
      }
    };

    $scope.interval_label = function(interval) {
      // return $scope.panel.auto_int && interval === $scope.panel.interval ? interval+" (auto)" : interval;
      return interval;
    };

    /**
     * Get the range filter effecting the panel.
     * If no existing filter being applied from the filter panel, use the panel's settings.
     * @return {from:number, to:number} - range filter object
     */
    $scope.get_facet_range = function() {
      var foundFilter = {};
      var filterIds = filterSrv.idsByTypeAndField('range', $scope.panel.range_field);

      if (!_.isEmpty(filterIds)) {
        foundFilter = filterSrv.getEjsObj(filterIds[0]); // There should be only one filter id.
      }

      if (_.isEmpty(foundFilter)) { return {from: $scope.panel.minimum, to: $scope.panel.maximum}; }

      return {from: foundFilter.from(), to: foundFilter.to()};
    };

    /**
     * Get interval to be used
     */
    $scope.get_interval = function() {
      var interval = $scope.panel.interval, range;
      if ($scope.panel.auto_int) {
        range = $scope.get_facet_range();
        if (range) {
          interval = $scope.calculate_gap(range.from, range.to, $scope.panel.resolution, 0);
        }
      }
      $scope.panel.interval = interval || '10';
      return $scope.panel.interval;
    };

    /**
     * Set a range filter and remove an existing filter. This is mainly used when selecting an area in the chart.
     * @param from - facet.range.start
     * @param to - facet.range.end
     */
    $scope.set_range_filter = function(from,to) {
      filterSrv.removeByTypeAndField('range',$scope.panel.range_field);
      filterSrv.set({
        type: 'range',
        from: parseFloat(from).toFixed($scope.panel.interval_decimal),
        to: parseFloat(to).toFixed($scope.panel.interval_decimal),
        field: $scope.panel.range_field
      });
      dashboard.refresh();
    };

    /**
     * Set the configurations in settings (for chart display)
     * @param from - facet.range.start
     * @param to - facet.range.end
     */
    $scope.set_configurations = function(from,to) {
      $scope.panel.chart_minimum = parseFloat(from).toFixed($scope.panel.interval_decimal);
      $scope.panel.chart_maximum = parseFloat(to).toFixed($scope.panel.interval_decimal);
    };

    /**
     * Calculate range facet interval
     *
     * from::           Integer containing the start of range
     * to::             Integer containing the end of range
     * size::           Calculate to approximately this many bars
     * user_interval::  User specified histogram interval
     *
     */
    $scope.calculate_gap = function(from,to,size,user_interval) {
      if (user_interval !== 0) {
        return user_interval;
      } else {
        var gap_interval = ((to-from)/size);
        if (gap_interval > 1) {
          return $scope.round_gap(gap_interval);
        } else {
          var gap = gap_interval.toFixed($scope.panel.interval_decimal); // .toFixed() returns string
          if (gap <= 0) {
            return 1;
          } else {
            return gap;
          }
        }
      }
    };

    /**
     * Round the value of interval to fit this defined resolution
     *
     */
    $scope.round_gap = function(interval) {
      return Math.round(interval) + 1;
    };

    /**
     * Fetch the data for a chunk of a queries results. Multiple segments occur when several indicies
     * need to be consulted (like timestamped logstash indicies)
     *
     * The results of this function are stored on the scope's data property. This property will be an
     * array of objects with the properties info, numeric_series, and hits. These objects are used in the
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
      $scope.panelMeta.loading = true;
      delete $scope.panel.error;

      if (_.isUndefined(segment)) {
        segment = 0;
      }

      // Make sure we have everything for the request to complete
      if(dashboard.indices.length === 0) {
        return;
      }

      var _range = $scope.get_facet_range();
      if ($scope.panel.auto_int) {
        $scope.panel.interval = $scope.calculate_gap(_range.from, _range.to, $scope.panel.resolution, 0);
      }

      // check if interval contains decimal (.)
      var interval_str = $scope.panel.interval.toString().split('.');
      if (interval_str.length > 1) {
        $scope.panel.interval_decimal = interval_str[1].length;
      } else {
        $scope.panel.interval_decimal = 0;
      }

      // Solr
      $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);

      var request = $scope.sjs.Request().indices(dashboard.indices[segment]);
      $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);
      
      // Build the query
      _.each($scope.panel.queries.ids, function(id) {
        var query = $scope.sjs.FilteredQuery(
          querySrv.getEjsObj(id),
          filterSrv.getBoolFilter(filterSrv.ids)
        );

        var facet = $scope.sjs.DateHistogramFacet(id);

        if ($scope.panel.mode === 'count') {
          facet = facet.field($scope.panel.time_field);
        } else {
          if (_.isNull($scope.panel.value_field)) {
            $scope.panel.error = "In " + $scope.panel.mode + " mode a field must be specified";
            return;
          }
          facet = facet.keyField($scope.panel.time_field).valueField($scope.panel.value_field);
        }

        facet = facet.facetFilter($scope.sjs.QueryFilter(query));
        request = request.facet(facet).size(0);
      });

      // Populate the inspector panel
      $scope.populate_modal(request);

      // Build Solr query
      var fq = '';
      if (filterSrv.getSolrFq()) {
        fq = '&' + filterSrv.getSolrFq();
      }
      var wt_json = '&wt=json';
      var rows_limit = '&rows=0'; // for RangeFacet, we do not need the actual response doc, so set rows=0
      var facet = '&facet=true' +
                  '&facet.range=' + $scope.panel.range_field +
                  '&facet.range.start=' + (parseFloat(_range.from)) +
                  '&facet.range.end=' + (parseFloat(_range.to) + $scope.calculate_tick_value(parseFloat($scope.panel.interval))) +
                  '&facet.range.gap=' + $scope.panel.interval;
      var promises = [];
      $scope.panel.queries.query = "";

      _.each($scope.panel.queries.ids, function(id) {
        var temp_q =  querySrv.getQuery(id) + wt_json + rows_limit + fq + facet ;
        $scope.panel.queries.query += temp_q + "\n";
        if ($scope.panel.queries.custom !== null) {
          request = request.setQuery(temp_q + $scope.panel.queries.custom);
        } else {
          request = request.setQuery(temp_q);
        }
        promises.push(request.doSearch());
      });

      // Populate scope when we have results
      $q.all(promises).then(function(results) {
        var _range = $scope.get_facet_range();

        $scope.panelMeta.loading = false;
        if(segment === 0) {
          $scope.hits = 0;
          $scope.data = [];
          query_id = $scope.query_id = new Date().getTime();
        }

        var i = 0,
          numeric_series,
          hits;

        _.each($scope.panel.queries.ids, function(id,index) {
          // Check for error and abort if found
          if (!(_.isUndefined(results[index].error))) {
            $scope.panel.error = $scope.parse_error(results[index].error.msg);
            return;
          }
          // we need to initialize the data variable on the first run,
          // and when we are working on the first segment of the data.
          if(_.isUndefined($scope.data[i]) || segment === 0) {
            numeric_series = new timeSeries.ZeroFilled({
              start_date: _range && _range.from,
              end_date: _range && _range.to,
              fill_style: 'minimal'
            });
            hits = 0;
          } else {
            numeric_series = $scope.data[i].numeric_series;
            // Bug fix for wrong event count:
            //   Solr don't need to accumulate hits count since it can get total count from facet query.
            //   Therefore, I need to set hits and $scope.hits to zero.
            // hits = $scope.data[i].hits;
            hits = 0;
            $scope.hits = 0;
          }
          $scope.range_count = 0;
          // Solr facet counts response is in one big array.
          // So no need to get each segment like Elasticsearch does.
          // Entries from facet_ranges counts
          var entries = results[index].facet_counts.facet_ranges[$scope.panel.range_field].counts;
          for (var j = 0; j < entries.length; j++) {
            var entry_time = parseFloat(entries[j]).toFixed($scope.panel.interval_decimal); // convert to the same number of decimals as specified interval.
            j++;
            var entry_count = entries[j];
            numeric_series.addValue(entry_time, entry_count);
            hits += entry_count; // The series level hits counter
            $scope.hits += entry_count; // Entire dataset level hits counter
            $scope.range_count += 1; // count the number of ranges to help later in bar width
          }
          $scope.data[i] = {
            info: querySrv.list[id],
            numeric_series: numeric_series,
            hits: hits
          };

          i++;
        });

        $scope.render();
      });
    };

    // function $scope.zoom
    // factor :: Zoom factor, so 0.5 = cuts timespan in half, 2 doubles timespan
    $scope.zoom = function(factor) {
      var _range = filterSrv.facetRange($scope.panel.range_field)[1];
      if (_.isUndefined(_range)){
        _range = {
          from: $scope.panel.chart_minimum,
          to: $scope.panel.chart_maximum
        };
      }

      var _timespan = (_range.to.valueOf() - _range.from.valueOf());
      var _center = _range.to.valueOf() - _timespan/2;

      var _to = (_center + (_timespan*factor)/2);
      var _from = (_center - (_timespan*factor)/2);

      $scope.set_range_filter(_from, _to);
      $scope.set_configurations(_from, _to);
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
      $scope.render();
    };

    $scope.render = function() {
      $scope.$emit('render');
    };
  });

  module.directive('rangefacetChart', function(dashboard) {
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
          var barwidth = scope.panel.chart_maximum - scope.panel.chart_minimum;
          var stack = scope.panel.stack ? true : null;
          var facet_range = scope.get_facet_range();

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
                  barWidth: barwidth/(1.8*scope.range_count),
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
                min: 0,
                max: scope.panel.percentage && scope.panel.stack ? 100 : null,
                axisLabel: 'count'
              },
              xaxis: {
                show: scope.panel['x-axis'],
                min: parseFloat(facet_range.from) - scope.calculate_tick_value(parseFloat(scope.panel.interval)),
                max: parseFloat(facet_range.to) + scope.calculate_tick_value(parseFloat(scope.panel.interval)),
                autoscaleMargin : scope.panel.interval,
                minTickSize : scope.panel.interval,
                tickDecimals: scope.calculate_tick_decimals(scope.panel.interval),
                axisLabel: scope.panel.range_field
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
                return query.numeric_series.getOrderedTimes();
              }));
              required_times = _.uniq(required_times.sort(function (a, b) {
                // decending numeric sort
                return a-b;
              }), true);
            }

            for (var i = 0; i < scope.data.length; i++) {
              scope.data[i].data = scope.data[i].numeric_series.getFlotPairs(required_times);
            }

            // ISSUE: SOL-76
            // If 'lines_smooth' is enabled, loop through $scope.data[] and remove zero filled entries.
            // Without zero values, the line chart will appear smooth as SiLK ;-)
            if (scope.panel.lines_smooth) {
              for (var k=0; k < scope.data.length; k++) {
                var new_data = [];
                for (var j=0; j < scope.data[k].data.length; j++) {
                  // if value of the timestamp !== 0, then add it to new_data
                  if (scope.data[k].data[j][1] !== 0) {
                    new_data.push(scope.data[k].data[j]);
                  }
                }
                scope.data[k].data = new_data;
              }
            }

            scope.plot = $.plot(elem, scope.data, options);
          } catch(e) {
            // TODO: Need to fix bug => "Invalid dimensions for plot, width = 0, height = 200"
            console.log(e);
          }
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
            $tooltip
              .html(
                group + dashboard.numberWithCommas(value) + " [" + item.datapoint[0].toFixed(scope.panel.interval_decimal) +" - "+ (item.datapoint[0] + parseFloat(scope.panel.interval)).toFixed(scope.panel.interval_decimal) +"]"
              )
              .place_tt(pos.pageX, pos.pageY);
          } else {
            $tooltip.detach();
          }
        });

        elem.bind("plotselected", function (event, ranges) {
          scope.set_range_filter(ranges.xaxis.from, ranges.xaxis.to);
          scope.set_configurations(ranges.xaxis.from, ranges.xaxis.to);
          dashboard.refresh();
        });
      }
    };
  });
});

