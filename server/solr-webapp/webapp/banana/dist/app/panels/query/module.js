
define('css-embed', function()
{
	function embed_css(content)
	{
		var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style'),
		rules = document.createTextNode(content);
		style.type = 'text/css';
		if(style.styleSheet)
			style.styleSheet.cssText = rules.nodeValue;
		else style.appendChild(rules);
			head.appendChild(style);
	}
	return embed_css;
});

define('css!panels/query/query.css', ['css-embed'], 
function(embed)
{
	embed(
	'.short-query{display:inline-block;margin-right:10px}.begin-query{position:absolute;left:13px;top:5px}.end-query{position:absolute;right:15px;top:5px}.panel-query{padding-left:35px!important;height:31px!important;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.form-search:hover .has-remove{padding-left:50px!important}.remove-query{opacity:0}.last-query{padding-right:70px!important}.form-search:hover .remove-query{opacity:1}.query-panel .pins{text-decoration:underline}.query-panel .pinned{margin-right:5px}'
	);
	return true;
});

/*

  ## query

  ### Parameters
  * query ::  A string or an array of querys. String if multi is off, array if it is on
              This should be fixed, it should always be an array even if its only
              one element
*/
define('panels/query/module',[
  'angular',
  'app',
  'underscore',
  'css!./query.css'
], function (angular, app, _) {
  'use strict';

  var module = angular.module('kibana.panels.query', []);
  app.useModule(module);

  module.controller('query', function($scope, querySrv, $rootScope) {
    $scope.panelMeta = {
      modals: [{
        description: "Inspect",
        icon: "icon-info-sign",
        partial: "app/partials/inspector.html",
        show: true
      }],
      status  : "Stable",
      description : "Provide a search bar for free-form queries. You almost certainly want one of these somewhere prominent on your dashboard."
    };

    // Set and populate defaults
    var _d = {
      query   : "*:*",
      pinned  : true,
      history : [],
      spyable : true,
      remember: 10, // max: 100, angular strap can't take a variable for items param
    };
    _.defaults($scope.panel,_d);

    $scope.querySrv = querySrv;

    $scope.init = function() {
    };

    $scope.reset = function() {
      $scope.querySrv.list[Object.keys($scope.querySrv.list).length - 1].query = _d.query;
      $rootScope.$broadcast('refresh');
    };

    $scope.refresh = function() {
      update_history(_.pluck($scope.querySrv.list,'query'));
      $rootScope.$broadcast('refresh');
    };

    $scope.render = function() {
      $rootScope.$broadcast('render');
    };

    $scope.toggle_pin = function(id) {
      querySrv.list[id].pin = querySrv.list[id].pin ? false : true;
    };

    $scope.close_edit = function() {
      $scope.refresh();
    };

    var update_history = function(query) {
      if($scope.panel.remember > 0) {
        $scope.panel.history = _.union(query.reverse(),$scope.panel.history);
        var _length = $scope.panel.history.length;
        if(_length > $scope.panel.remember) {
          $scope.panel.history = $scope.panel.history.slice(0,$scope.panel.remember);
        }
      }
    };

    $scope.init();
  });
});

