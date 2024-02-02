/* jshint ignore:start */
var stopwords = ["by", "owing", "anything", "theirs", "of", "here", "they're", "theres", "hed", "contain", "howbeit", "more", "once", "appropriate", "how", "hereby", "above", "isn't", "they", "nothing", "keep", "old", "i'll", "pp", "present", "unlikely", "give", "tends", "truly", "let", "sure", "cant", "you'd", "very", "im", "why", "therefore", "if", "other", "announce", "few", "be", "you've", "herself", "overall", "h", "affecting", "ltd", "ones", "see", "out", "briefly", "these", "largely", "are", "according", "she'll", "k", "really", "ninety", "made", "que", "until", "quite", "unless", "fix", "per", "gotten", "whereby", "lately", "i'm", "should", "might", "potentially", "may", "mrs", "sufficiently", "better", "definitely", "results", "nevertheless", "up", "going", "useful", "recent", "he'll", "ed", "ignored", "ourselves", "perhaps", "always", "immediately", "least", "substantially", "home", "course", "couldn't", "use", "slightly", "to", "towards", "beginnings", "was", "became", "hid", "others", "various", "him", "thanks", "us", "after", "co", "and", "all", "only", "then", "merely", "wish", "seriously", "eighty", "too", "your", "affects", "specifically", "thanx", "hasn't", "refs", "there", "further", "she'd", "as", "ok", "ord", "eight", "pages", "that", "know", "previously", "an", "a's", "inner", "ought", "nonetheless", "everywhere", "want", "accordance", "need", "during", "went", "themselves", "obviously", "et-al", "greetings", "certainly", "five", "million", "past", "hes", "significant", "arise", "most", "whom", "than", "being", "former", "were", "could", "arent", "apparently", "considering", "whenever", "sub", "come", "id", "tell", "it'll", "near", "selves", "twice", "omitted", "anyways", "there's", "anyway", "also", "whereas", "anyhow", "consider", "done", "available", "cause", "wherein", "wasn't", "itd", "seeing", "nearly", "showed", "due", "thoroughly", "that's", "let's", "taken", "related", "within", "o", "indicated", "am", "seen", "primarily", "whereupon", "at", "almost", "presumably", "we're", "seem", "wants", "didn't", "despite", "where", "neither", "thereupon", "upon", "resulting", "maybe", "plus", "over", "able", "everything", "later", "last", "specify", "biol", "them", "for", "having", "toward", "regardless", "followed", "asking", "via", "who", "following", "onto", "concerning", "afterwards", "i'd", "on", "novel", "shall", "where's", "below", "means", "sorry", "appear", "nd", "similar", "name", "necessarily", "now", "respectively", "even", "ca", "it's", "known", "etc", "mean", "somehow", "t's", "well", "becoming", "along", "although", "you're", "ending", "act", "found", "line", "aside", "else", "whither", "willing", "yourself", "currently", "un", "insofar", "indicate", "her", "under", "heres", "seemed", "another", "page", "both", "s", "latter", "never", "thank", "but", "immediate", "okay", "uses", "such", "sometime", "th", "behind", "shes", "non", "been", "three", "proud", "about", "added", "yes", "cannot", "yours", "wouldn't", "thorough", "gets", "soon", "suggest", "edu", "goes", "mg", "throughout", "whence", "everybody", "into", "in", "meanwhile", "shows", "m", "specified", "no", "adj", "trying", "each", "noted", "second", "between", "she", "mustn't", "moreover", "showns", "far", "would", "ever", "tried", "somebody", "his", "certain", "using", "instead", "across", "lest", "described", "take", "'ll", "our", "first", "or", "yourselves", "saw", "third", "must", "looking", "ours", "e", "mug", "whatever", "already", "much", "specifying", "thus", "somewhere", "b", "hereupon", "six", "giving", "because", "just", "kg", "re", "several", "saying", "four", "whoever", "formerly", "example", "one", "i", "won't", "away", "contains", "invention", "right", "best", "causes", "those", "together", "rd", "significantly", "somewhat", "looks", "ref", "j", "have", "affected", "alone", "sometimes", "little", "say", "it'd", "provides", "itself", "thence", "do", "sent", "section", "though", "either", "becomes", "quickly", "exactly", "you'll", "said", "actually", "nos", "ie", "containing", "therein", "indicates", "wonder", "besides", "www", "every", "happens", "necessary", "you", "myself", "own", "end", "thru", "none", "possibly", "whole", "thereby", "resulted", "through", "placed", "inasmuch", "says", "from", "meantime", "show", "ff", "my", "successfully", "beside", "rather", "unfortunately", "eg", "hereafter", "ran", "their", "particular", "think", "shed", "however", "sec", "brief", "c's", "needs", "et", "sup", "himself", "usually", "viz", "someone", "why's", "unto", "hither", "hello", "doesn't", "keeps", "keep 	keeps", "herein", "different", "hopefully", "is", "seven", "nay", "look", "anywhere", "while", "so", "c'mon", "possible", "information", "with", "allow", "back", "seeming", "outside", "n", "normally", "lets", "it", "they'll", "p", "given", "g", "we'd", "when's", "believe", "beforehand", "can", "go", "nowhere", "off", "liked", "many", "similarly", "thereafter", "particularly", "vs", "relatively", "had", "accordingly", "what's", "still", "somethan", "oh", "what", "stop", "probably", "inc", "downwards", "na", "has", "help", "especially", "make", "put", "latterly", "mostly", "appreciate", "elsewhere", "its", "does", "apart", "which", "noone", "nor", "indeed", "like", "strongly", "they'd", "we've", "namely", "regards", "not", "begins", "poorly", "they've", "forth", "way", "something", "gone", "will", "ain't", "shown", "before", "ah", "ml", "less", "whether", "importance", "me", "furthermore", "com", "this", "makes", "self", "aren't", "getting", "l", "when", "how's", "gives", "who's", "allows", "knows", "again", "value", "reasonably", "ex", "i've", "whose", "c", "tries", "date", "haven't", "except", "can't", "welcome", "likely", "become", "we'll", "corresponding", "changes", "auth", "wherever", "seems", "mr", "did", "r", "secondly", "he'd", "begin", "she's", "new", "readily", "fifth", "otherwise", "don't", "around", "nine", "sensible", "predominantly", "used", "hers", "part", "against", "a", "inward", "qv", "doing", "obtain", "follows", "kept", "obtained", "yet", "effect", "got", "approximately", "km", "without", "next", "came", "hadn't", "consequently", "get", "entirely", "beginning", "q", "same", "serious", "miss", "associated", "shouldn't", "anyone", "run", "abst", "clearly", "thats", "we", "aren", "often", "shan't", "here's", "mainly", "some", "index", "d", "the", "please", "research", "recently", "among", "couldnt", "enough", "hi", "ask", "he's", "beyond", "nobody", "took", "whereafter", "hardly", "comes", "try", "gave", "hence", "hundred", "down", "any", "since", "amongst", "anybody", "everyone", "awfully", "anymore", "zero", "two", "weren't", "he", "regarding", "important", "promptly", "f"];
/* jshint ignore:end */
;
define("panels/tagcloud/stopWords", function(){});

/* global Canvas, module */

// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf
define('panels/tagcloud/d3.layout.cloud',[
    'd3'
  ],
  function(d3) {

  	'use strict';

    (function() {
      function cloud() {
        var size = [256, 256],
          text = cloudText,
          font = cloudFont,
          fontSize = cloudFontSize,
          fontStyle = cloudFontNormal,
          fontWeight = cloudFontNormal,
          rotate = cloudRotate,
          padding = cloudPadding,
          spiral = archimedeanSpiral,
          words = [],
          timeInterval = Infinity,
          event = d3.dispatch("word", "end"),
          timer = null,
          cloud = {}; // jshint ignore:line

        cloud.start = function() {

          var step = function() {
            var start = +new Date,
              d;
            while (+new Date - start < timeInterval && ++i < n && timer) {
              d = data[i];
              d.x = (size[0] * (Math.random() + 0.5)) >> 1;
              d.y = (size[1] * (Math.random() + 0.5)) >> 1;
              cloudSprite(d, data, i);
              if (d.hasText && place(board, d, bounds)) {
                tags.push(d);
                event.word(d);
                if (bounds) { cloudBounds(bounds, d); }
                else {
                   bounds = [{
                    x: d.x + d.x0,
                    y: d.y + d.y0
                  }, {
                    x: d.x + d.x1,
                    y: d.y + d.y1
                  }];
                }
                // Temporary hack
                d.x -= size[0] >> 1;
                d.y -= size[1] >> 1;
              }
            }
            if (i >= n) {
              cloud.stop();
              event.end(tags, bounds);
            }
          },

            board = zeroArray((size[0] >> 5) * size[1]),
            bounds = null,
            n = words.length,
            i = -1,
            tags = [],
            data = words.map(function(d, i) {
              d.text = text.call(this, d, i);
              d.font = font.call(this, d, i);
              d.style = fontStyle.call(this, d, i);
              d.weight = fontWeight.call(this, d, i);
              d.rotate = rotate.call(this, d, i);
              d.size = ~~fontSize.call(this, d, i);
              d.padding = padding.call(this, d, i);
              return d;
            }).sort(function(a, b) {
              return b.size - a.size;
            });

          if (timer) { clearInterval(timer); }
          timer = setInterval(step, 0);
          step();

          return cloud;
        };

        cloud.stop = function() {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          return cloud;
        };

        cloud.timeInterval = function(x) {
          if (!arguments.length) { return timeInterval; }
          timeInterval = x == null ? Infinity : x;
          return cloud;
        };

        function place(board, tag, bounds) {
          var startX = tag.x,
            startY = tag.y,
            maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
            s = spiral(size),
            dt = Math.random() < 0.5 ? 1 : -1,
            t = -dt,
            dxdy,
            dx,
            dy;

          while (dxdy = s(t += dt)) {
            dx = ~~dxdy[0];
            dy = ~~dxdy[1];

            if (Math.min(dx, dy) > maxDelta) { break; }

            tag.x = startX + dx;
            tag.y = startY + dy;

            if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
              tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) { continue; }
            // TODO only check for collisions within current bounds.
            if (!bounds || !cloudCollide(tag, board, size[0])) {
              if (!bounds || collideRects(tag, bounds)) {
                var sprite = tag.sprite,
                  w = tag.width >> 5,
                  sw = size[0] >> 5,
                  lx = tag.x - (w << 4),
                  sx = lx & 0x7f,
                  msx = 32 - sx,
                  h = tag.y1 - tag.y0,
                  x = (tag.y + tag.y0) * sw + (lx >> 5),
                  last;
                for (var j = 0; j < h; j++) {
                  last = 0;
                  for (var i = 0; i <= w; i++) {
                    board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
                  }
                  x += sw;
                }
                delete tag.sprite;
                return true;
              }
            }
          }
          return false;
        }

        cloud.words = function(x) {
          if (!arguments.length) { return words; }
          words = x;
          return cloud;
        };

        cloud.size = function(x) {
          if (!arguments.length) { return size; }
          size = [+x[0], +x[1]];
          return cloud;
        };

        cloud.font = function(x) {
          if (!arguments.length) { return font; }
          font = d3.functor(x);
          return cloud;
        };

        cloud.fontStyle = function(x) {
          if (!arguments.length) { return fontStyle; }
          fontStyle = d3.functor(x);
          return cloud;
        };

        cloud.fontWeight = function(x) {
          if (!arguments.length) { return fontWeight; }
          fontWeight = d3.functor(x);
          return cloud;
        };

        cloud.rotate = function(x) {
          if (!arguments.length) { return rotate; }
          rotate = d3.functor(x);
          return cloud;
        };

        cloud.text = function(x) {
          if (!arguments.length) { return text; }
          text = d3.functor(x);
          return cloud;
        };

        cloud.spiral = function(x) {
          if (!arguments.length) { return spiral; }
          spiral = spirals[x + ""] || x;
          return cloud;
        };

        cloud.fontSize = function(x) {
          if (!arguments.length) { return fontSize; }
          fontSize = d3.functor(x);
          return cloud;
        };

        cloud.padding = function(x) {
          if (!arguments.length) { return padding; }
          padding = d3.functor(x);
          return cloud;
        };

        return d3.rebind(cloud, event, "on");
      }

      function cloudText(d) {
        return d.text;
      }

      function cloudFont() {
        return "serif";
      }

      function cloudFontNormal() {
        return "normal";
      }

      function cloudFontSize(d) {
        return Math.sqrt(d.value);
      }

      function cloudRotate() {
        return (~~(Math.random() * 6) - 3) * 30;
      }

      function cloudPadding() {
        return 1;
      }

      // Fetches a monochrome sprite bitmap for the specified text.
      // Load in batches for speed.
      function cloudSprite(d, data, di) {
        if (d.sprite) { return; }
        c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
        var x = 0,
          y = 0,
          w = 0,
          h = 0,
          maxh = 0,
          n = data.length;
        --di;
        while (++di < n) {
          d = data[di];
          c.save();
          c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
          w = c.measureText(d.text + "m").width * ratio;
          h = d.size << 1;
          if (d.rotate) {
            var sr = Math.sin(d.rotate * cloudRadians),
              cr = Math.cos(d.rotate * cloudRadians),
              wcr = w * cr,
              wsr = w * sr,
              hcr = h * cr,
              hsr = h * sr;
            w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
            h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
          } else {
            w = (w + 0x1f) >> 5 << 5;
          }
          if (h > maxh) { maxh = h; }
          if (x + w >= (cw << 5)) {
            x = 0;
            y += maxh;
            maxh = 0;
          }
          if (y + h >= ch) { break; }
          c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
          if (d.rotate) { c.rotate(d.rotate * cloudRadians); }
          c.fillText(d.text, 0, 0);
          if (d.padding) { c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0); }
          c.restore();
          d.width = w;
          d.height = h;
          d.xoff = x;
          d.yoff = y;
          d.x1 = w >> 1;
          d.y1 = h >> 1;
          d.x0 = -d.x1;
          d.y0 = -d.y1;
          d.hasText = true;
          x += w;
        }
        var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
          sprite = [];
        while (--di >= 0) {
          d = data[di];
          if (!d.hasText) { continue; }
          w = d.width;
          var w32 = w >> 5;
          h = d.y1 - d.y0;
          // Zero the buffer
          for (var i = 0; i < h * w32; i++) { sprite[i] = 0; }
          x = d.xoff;
          if (x == null) { return; }
          y = d.yoff;
          var seen = 0,
            seenRow = -1;
          for (var j = 0; j < h; j++) {
            for (i = 0; i < w; i++) {
              var k = w32 * j + (i >> 5),
                m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
              sprite[k] |= m;
              seen |= m;
            }
            if (seen) { seenRow = j; }
            else {
              d.y0++;
              h--;
              j--;
              y++;
            }
          }
          d.y1 = d.y0 + seenRow;
          d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
        }
      }

      // Use mask-based collision detection.
      function cloudCollide(tag, board, sw) {
        sw >>= 5;
        var sprite = tag.sprite,
          w = tag.width >> 5,
          lx = tag.x - (w << 4),
          sx = lx & 0x7f,
          msx = 32 - sx,
          h = tag.y1 - tag.y0,
          x = (tag.y + tag.y0) * sw + (lx >> 5),
          last;
        for (var j = 0; j < h; j++) {
          last = 0;
          for (var i = 0; i <= w; i++) {
            if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0)) & board[x + i]) { return true; }
          }
          x += sw;
        }
        return false;
      }

      function cloudBounds(bounds, d) {
        var b0 = bounds[0],
          b1 = bounds[1];
        if (d.x + d.x0 < b0.x) { b0.x = d.x + d.x0; }
        if (d.y + d.y0 < b0.y) { b0.y = d.y + d.y0; }
        if (d.x + d.x1 > b1.x) { b1.x = d.x + d.x1; }
        if (d.y + d.y1 > b1.y) { b1.y = d.y + d.y1; }
      }

      function collideRects(a, b) {
        return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
      }

      function archimedeanSpiral(size) {
        var e = size[0] / size[1];
        return function(t) {
          return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];
        };
      }

      function rectangularSpiral(size) {
        var dy = 4,
          dx = dy * size[0] / size[1],
          x = 0,
          y = 0;
        return function(t) {
          var sign = t < 0 ? -1 : 1;
          // See triangular numbers: T_n = n * (n + 1) / 2.
          switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
            case 0:
              x += dx;
              break;
            case 1:
              y += dy;
              break;
            case 2:
              x -= dx;
              break;
            default:
              y -= dy;
              break;
          }
          return [x, y];
        };
      }

      // TODO reuse arrays?
      function zeroArray(n) {
        var a = [],
          i = -1;
        while (++i < n) { a[i] = 0; }
        return a;
      }

      var cloudRadians = Math.PI / 180,
        cw = 1 << 11 >> 5,
        ch = 1 << 11,
        canvas,
        ratio = 1;

      if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
        canvas.width = (cw << 5) / ratio;
        canvas.height = ch / ratio;
      } else {
        // Attempt to use node-canvas.
        canvas = new Canvas(cw << 5, ch);
      }

      var c = canvas.getContext("2d"),
        spirals = {
          archimedean: archimedeanSpiral,
          rectangular: rectangularSpiral
        };
      c.fillStyle = c.strokeStyle = "red";
      c.textAlign = "center";

      if (typeof module === "object" && module.exports) { module.exports = cloud; }
//      else (d3.layout || (d3.layout = {})).cloud = cloud;
      else {
      	(d3.layout || (d3.layout = {})).cloud = cloud;
      }

    })();
  });

/*
  ## tagcloud

  ### Parameters
  * size :: top N
  * alignment :: How should I arrange the words in cloud 'horizontal and vertical' or 'Random'
  * fontScale :: Increase the font scale for all words
  * ignoreStopWords :: Whether to Ignore Stop Words
*/
define('panels/tagcloud/module',[
    'angular',
    'app',
    'underscore',
    'jquery',
    'kbn',
    'd3',
    './stopWords',
    './d3.layout.cloud'
  ],
  function(angular, app, _, $, kbn, d3, stopwords) {
    'use strict';

    var module = angular.module('kibana.panels.tagcloud', []);
    app.useModule(module);

    module.controller('tagcloud', function($scope, querySrv, dashboard, filterSrv) {
      $scope.panelMeta = {
        modals: [{
          description: "Inspect",
          icon: "icon-info-sign",
          partial: "app/partials/inspector.html",
          show: $scope.panel.spyable
        }],
        editorTabs: [{
          title: 'Queries',
          src: 'app/partials/querySelect.html'
        }],
        status: "Experimental",
        description: "Display the tag cloud of the top N words from a specified field."
      };

      // Set and populate defaults
      var _d = {
        queries: {
          mode: 'all',
          ids: [],
          query: '*:*',
          custom: ''
        },
        field: '',
        size: 10,
        alignment: 'vertical and horizontal',
        fontScale: 1,
        ignoreStopWords: false,
        spyable: true,
        show_queries: true,
        error: '',
      };
      _.defaults($scope.panel, _d);

      $scope.init = function() {
        $scope.hits = 0;
        $scope.$on('refresh', function() {
          $scope.get_data();
        });
        $scope.get_data();
      };

      $scope.get_data = function() {
        // Make sure we have everything for the request to complete
        if (dashboard.indices.length === 0) {
          return;
        }
        delete $scope.panel.error;
        $scope.panelMeta.loading = true;
        var request, results;

        $scope.sjs.client.server(dashboard.current.solr.server + dashboard.current.solr.core_name);

        request = $scope.sjs.Request().indices(dashboard.indices);
        $scope.panel.queries.ids = querySrv.idsByMode($scope.panel.queries);

        // Populate the inspector panel
        $scope.inspector = angular.toJson(JSON.parse(request.toString()), true);

        // Build Solr query
        var fq = '';
        if (filterSrv.getSolrFq()) {
          fq = '&' + filterSrv.getSolrFq();
        }
        var wt_json = '&wt=json';
        var rows_limit = '&rows=0'; // for terms, we do not need the actual response doc, so set rows=0
        var facet = '&facet=true&facet.field=' + $scope.panel.field + '&facet.limit=' + $scope.panel.size;

        // Set the panel's query
        $scope.panel.queries.query = querySrv.getORquery() + wt_json + rows_limit + fq + facet;

        // Set the additional custom query
        if ($scope.panel.queries.custom != null) {
          request = request.setQuery($scope.panel.queries.query + $scope.panel.queries.custom);
        } else {
          request = request.setQuery($scope.panel.queries.query);
        }

        results = request.doSearch();

        // Populate scope when we have results
        results.then(function(results) {
          // Check for error and abort if found
          if (!(_.isUndefined(results.error))) {
            $scope.panel.error = $scope.parse_error(results.error.msg);
            return;
          }

          var sum = 0;
//          var k = 0;
          var missing = 0;
          $scope.panelMeta.loading = false;
          $scope.hits = results.response.numFound;
          $scope.data = [];
          $scope.maxRatio = 0;


          $scope.yaxis_min = 0;
          _.each(results.facet_counts.facet_fields, function(v) {
            for (var i = 0; i < v.length; i++) {
              var term = v[i];
              i++;
              var count = v[i];
              sum += count;

              // if ignoreStopWords is enabled, skip this term.
              if ($scope.panel.ignoreStopWords && stopwords.indexOf(term.toLowerCase()) > -1) {
                continue;
              }

              if (term === null) {
                missing = count;
              } else {
                // if count = 0, do not add it to the chart, just skip it
                if (count === 0) {
                  continue;
                }
                var slice = {
                  label: term,
                  data: count,
                  actions: true
                };
                if (count / $scope.hits > $scope.maxRatio) {
                  $scope.maxRatio = count / $scope.hits;
                }
                $scope.data.push(slice);
              }
            }
          });
          $scope.$emit('render');
        });
      };

      $scope.set_refresh = function(state) {
        $scope.refresh = state;
        // if 'count' mode is selected, set decimal_points to zero automatically.
        if ($scope.panel.mode === 'count') {
          $scope.panel.decimal_points = 0;
        }
      };

      $scope.close_edit = function() {
        if ($scope.refresh) {
          $scope.get_data();
        }
        $scope.refresh = false;
        $scope.$emit('render');
      };
    });

    module.directive('tagcloudChart', function(/*querySrv, dashboard, filterSrv*/) {
      return {
        restrict: 'A',
        link: function(scope, element) {

          // Receive render events
          scope.$on('render', function() {
            render_panel();
          });

          // Re-render if the window is resized
          angular.element(window).bind('resize', function() {
            render_panel();
          });

          // Function for rendering panel
          function render_panel() {

            function draw(words) {
              d3.select(el).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + (width - 20) / 2 + "," + (height - 20) / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) {
                  return d.size + "px";
                })
                .style("font-family", "Impact, Haettenschweiler, 'Franklin Gothic Bold', Charcoal, 'Helvetica Inserat', 'Bitstream Vera Sans Bold', 'Arial Black', 'sans-serif'")
                .style("fill", function(d, i) {
                  //return  color(i);
                  return fill(i);
                })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) {
                  return d.text;
                });
            }

            element.html("");

            var el = element[0];
            var width = element.parent().width();
            var height = parseInt(scope.row.height);

            var fill = d3.scale.category20();
/*
            var color = d3.scale.linear()
              .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
              .range(["#7EB26D", "#EAB839", "#6ED0E0", "#EF843C", "#E24D42", "#1F78C1", "#BA43A9", "#705DA0", "#890F02", "#0A437C", "#6D1F62", "#584477"]);
*/

            var scale = d3.scale.linear().domain([0, scope.maxRatio]).range([0, 30]);
            var randomRotate = d3.scale.linear().domain([0, 1]).range([-90, 90]);

            d3.layout.cloud().size([width - 20, height - 20])
              .words(scope.data.map(function(d) {
                return {
                  text: d.label,
                  size: 5 + scale(d.data / scope.hits) + parseInt(scope.panel.fontScale)
                };
              })).rotate(function() {
                if (scope.panel.alignment === 'vertical and horizontal') {
                  return~~ (Math.random() * 2) * -90;
                } else if (scope.panel.alignment === 'horizontal') {
                  return 0;
                }
                else if (scope.panel.alignment === 'vertical(+90)') {
                  return 90;
                }
                else if (scope.panel.alignment === 'vertical(-90)') {
                  return -90;
                }
                else {
                  return randomRotate(Math.random());
                }
              })
              .font("sans-serif")
              .fontSize(function(d) {
                return d.size;
              })
              .on("end", draw)
              .start();


          }

        }
      };
    });

  });

