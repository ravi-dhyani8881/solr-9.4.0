/*
 Licensed to the Apache Software Foundation (ASF) under one or more
 contributor license agreements.  See the NOTICE file distributed with
 this work for additional information regarding copyright ownership.
 The ASF licenses this file to You under the Apache License, Version 2.0
 (the "License"); you may not use this file except in compliance with
 the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

var solrAdminServices = angular.module('solrAdminServices', ['ngResource']);

solrAdminServices.factory('System',
  ['$resource', function($resource) {
    return $resource('admin/info/system', {"wt":"json", "nodes": "@nodes", "_":Date.now()});
  }])
.factory('Metrics',
    ['$resource', function($resource) {
      return $resource('admin/metrics', {"wt":"json", "nodes": "@nodes", "prefix":"@prefix", "_":Date.now()});
    }])
.factory('Collections',
  ['$resource', function($resource) {
    return $resource('admin/collections',
    {'wt':'json', '_':Date.now()}, {
    "list": {params:{action: "LIST"}},
    "listaliases": {params:{action: "LISTALIASES"}},
    "status": {params:{action: "CLUSTERSTATUS"}},
    "add": {params:{action: "CREATE"}},
    "delete": {params:{action: "DELETE"}},
    "rename": {params:{action: "RENAME"}},
    "createAlias": {params:{action: "CREATEALIAS"}},
    "deleteAlias": {params:{action: "DELETEALIAS"}},
    "deleteReplica": {params:{action: "DELETEREPLICA"}},
    "addReplica": {params:{action: "ADDREPLICA"}},
    "deleteShard": {params:{action: "DELETESHARD"}},
    "reload": {method: "GET", params:{action:"RELOAD", core: "@core"}}
    });
  }])
.factory('ConfigSets',
 ['$resource', function ($resource) {
    return $resource('admin/configs', {'wt': 'json', '_': Date.now()}, {"configs": {params: {action: "LIST"}}
    });
 }])
.factory('Cores',
  ['$resource', function($resource) {
    return $resource('admin/cores',
    {'wt':'json', '_':Date.now()}, {
    "query": {},
    "list": {params:{indexInfo: false}},
    "add": {params:{action: "CREATE"}},
    "unload": {params:{action: "UNLOAD", core: "@core"}},
    "rename": {params:{action: "RENAME"}},
    "swap": {params:{action: "SWAP"}},
    "reload": {method: "GET", params:{action:"RELOAD", core: "@core"}, headers:{doNotIntercept: "true"}}
    });
  }])
.factory('Logging',
  ['$resource', function($resource) {
    return $resource('admin/info/logging', {'wt':'json', '_':Date.now()}, {
      "events": {params: {since:'0'}},
      "levels": {},
      "setLevel": {params: {nodes:'all'}}
      });
  }])
.factory('Zookeeper',
  ['$resource', function($resource) {
    return $resource('admin/zookeeper', {wt:'json', _:Date.now()}, {
      "simple": {},
      "liveNodes": {params: {path: '/live_nodes'}},
      "clusterState": {params: {detail: "true", path: "/clusterstate.json"}},
      "detail": {params: {detail: "true", path: "@path"}},
      "configs": {params: {detail:false, path: "/configs/"}},
      "aliases": {params: {detail: "true", path: "/aliases.json"}, transformResponse:function(data) {
        var znode = $.parseJSON(data).znode;
        if (znode.data) {
          return {aliases: $.parseJSON(znode.data).collection};
        } else {
          return {aliases: {}};
        }
      }}
    });
  }])
.factory('ZookeeperStatus',
  ['$resource', function($resource) {
    return $resource('admin/zookeeper/status', {wt:'json', _:Date.now()}, {
      "monitor": {}
    });
  }])
.factory('Properties',
  ['$resource', function($resource) {
    return $resource('admin/info/properties', {'wt':'json', '_':Date.now()});
  }])
.factory('Threads',
  ['$resource', function($resource) {
    return $resource('admin/info/threads', {'wt':'json', '_':Date.now()});
  }])
.factory('Properties',
  ['$resource', function($resource) {
    return $resource('admin/info/properties', {'wt':'json', '_':Date.now()});
  }])
.factory('Replication',
  ['$resource', function($resource) {
    return $resource(':core/replication', {'wt':'json', core: "@core", '_':Date.now()}, {
      "details": {params: {command: "details"}},
      "command": {params: {}}
    });
  }])
.factory('CoreSystem',
  ['$resource', function($resource) {
    return $resource(':core/admin/system', {wt:'json', core: "@core", _:Date.now()});
  }])
.factory('Update',
  ['$resource', function($resource) {
    return $resource(':core/:handler', {core: '@core', wt:'json', _:Date.now(), handler:'update'}, {
      "commit": {params: {commit: "true"}},
      "post": {headers: {'Content-type': 'application/json'}, method: "POST", params: {handler: '@handler'}},
      "postJson": {headers: {'Content-type': 'application/json'}, method: "POST", params: {handler: '@handler'}},
      "postXml": {headers: {'Content-type': 'text/xml'}, method: "POST", params: {handler: '@handler'}},
      "postCsv": {headers: {'Content-type': 'application/csv'}, method: "POST", params: {handler: '@handler'}}
    });
  }])
.factory('ParamSet',
  ['$resource', function($resource) {
    return $resource(':core/config/params/:name', {core: '@core', wt:'json', _:Date.now()}, {
      "submit": {headers: {'Content-type': 'application/json'}, method: "POST"},
      "get": {headers: {'Content-type': 'application/json'}, method: "GET"}
    });
  }])
.service('FileUpload', function ($http) {
    this.upload = function(params, file, success, error){
        var url = "" + params.core + "/" + params.handler + "?";
        raw = params.raw;
        delete params.core;
        delete params.handler;
        delete params.raw;
        url += $.param(params);
        if (raw && raw.length>0) {
            if (raw[0] != "&") raw = "&" + raw;
            url += raw;
        }
        var fd = new FormData();
        fd.append('file', file);
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(success).error(error);
    }
})
.filter('splitByComma', function() {
  return function(input) {
    return input === undefined ? input : input.split(',');
  }
})
.factory('Luke',
  ['$resource', function($resource) {
    return $resource(':core/admin/luke', {core: '@core', wt:'json', _:Date.now()}, {
      "index":  {params: {numTerms: 0, show: 'index'}},
      "raw": {params: {numTerms: 0}},
      "schema": {params: {show:'schema'}},
      "field": {},
      "fields": {params: {show:'schema'}, interceptor: {
          response: function(response) {
              var fieldsAndTypes = [];
              for (var field in response.data.schema.fields) {
                fieldsAndTypes.push({group: "Fields", label: field, value: "fieldname=" + field});
              }
              for (var type in response.data.schema.types) {
                fieldsAndTypes.push({group: "Types", label: type, value: "fieldtype=" + type});
              }
              return fieldsAndTypes;
          }
      }}
    });
  }])
.factory('Analysis',
  ['$resource', function($resource) {
    return $resource(':core/analysis/field', {core: '@core', wt:'json', _:Date.now()}, {
      "field": {params: {"analysis.showmatch": true}}
    });
  }])
.factory('Ping',
  ['$resource', function($resource) {
    return $resource(':core/admin/ping', {wt:'json', core: '@core', ts:Date.now(), _:Date.now()}, {
     "ping": {},
     "enable": {params:{action:"enable"}, headers: {doNotIntercept: "true"}},
     "disable": {params:{action:"disable"}, headers: {doNotIntercept: "true"}},
     "status": {params:{action:"status"}, headers: {doNotIntercept: "true"}
    }});
  }])
.factory('Mbeans',
  ['$resource', function($resource) {
    return $resource(':core/admin/mbeans', {'wt':'json', core: '@core', '_':Date.now()}, {
        stats: {params: {stats: true}},
        info: {},
        reference: {
            params: {wt: "xml", stats: true}, transformResponse: function (data) {
                return {reference: data}
            }
        },
        delta: {method: "POST",
                params: {stats: true, diff:true},
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {
                    return "stream.body=" + encodeURIComponent(data);
                }
        }
    });
  }])
.factory('Files',
  ['$resource', function($resource) {
    return $resource(':core/admin/file', {'wt':'json', core: '@core', '_':Date.now()}, {
      "list": {},
      "get": {method: "GET", interceptor: {
          response: function(config) {return config;}
      }, transformResponse: function(data) {
          return data;
      }}
    });
  }])
.factory('Query',
    ['$resource', function($resource) {
       var resource = $resource(':core/:handler', {core: '@core', handler: '@handler', '_':Date.now()}, {
           "query": {
             method: "GET",
             transformResponse: function (data) {
               return {data: data}
             },
             headers: {doNotIntercept: "true"}
           }
       });
       resource.url = function(params) {
           var qs = [];
           for (key in params) {
               if (key != "core" && key != "handler") {
                   for (var i in params[key]) {
                       qs.push(key + "=" + encodeURIComponent(params[key][i]));
                   }
               }
           }
           return "" + params.core + "/" + params.handler + "?" + qs.sort().join("&");
       }
       return resource;
}])
.factory('Segments',
   ['$resource', function($resource) {
       return $resource(':core/admin/segments', {'wt':'json', core: '@core', _:Date.now()}, {
           get: {}
       });
}])
.factory('Schema',
   ['$resource', function($resource) {
     return $resource(':core/schema', {wt: 'json', core: '@core', _:Date.now()}, {
       get: {method: "GET"},
       check: {method: "GET", headers: {doNotIntercept: "true"}},
       post: {method: "POST"}
     });
}])
.factory('Config',
   ['$resource', function($resource) {
     return $resource(':core/config', {wt: 'json', core: '@core', _:Date.now()}, {
       get: {method: "GET"}
     })
}])
.factory('SchemaDesigner',
   ['$resource', function($resource) {
     return $resource('/api/schema-designer/:path', {wt: 'json', path: '@path', _:Date.now()}, {
       get: {method: "GET"},
       post: {method: "POST", timeout: 90000},
       put: {method: "PUT"},
       postXml: {headers: {'Content-type': 'text/xml'}, method: "POST", timeout: 90000},
       postCsv: {headers: {'Content-type': 'application/csv'}, method: "POST", timeout: 90000},
       upload: {method: "POST", transformRequest: angular.identity, headers: {'Content-Type': undefined}, timeout: 90000}
     })
}])
.factory('Security',
    ['$resource', function($resource) {
          return $resource('/api/cluster/security/:path', {wt: 'json', path: '@path', _:Date.now()}, {
            get: {method: "GET"}, post: {method: "POST", timeout: 90000}
        })
}])
.factory('AuthenticationService',
    ['base64', '$resource', function (base64, $resource) {
      var service = {};

      service.getOAuthTokens = function (url, data) {
        var serializedData = serialize(data);
        var resource = $resource(url, {}, {
          getToken: {
            method: 'POST',
            timeout: 10000,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': undefined // Set this header to undefined to prevent preflight requests
            },
            transformResponse: function (data) {
              return angular.fromJson(data);
            }
          }
        });
        return resource.getToken({}, serializedData).$promise;
      };

      var codeChallengeMethod = "S256";
      service.getCodeChallengeMethod = function getCodeChallengeMethod() {
        return codeChallengeMethod;
      }

      service.generateCodeVerifier = function generateCodeVerifier() {
        var codeVerifier = '';
        var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        for (var i = 0; i < 96; i++) {
          codeVerifier += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return codeVerifier;
      }

      service.generateCodeChallengeFromVerifier = async function generateCodeChallengeFromVerifier(v) {
        var hashed = await sha256(v);
        var base64encoded = base64urlencode(hashed);
        return base64encoded;
      }

      function sha256(str) {
        const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
        shaObj.update(str);
        return shaObj.getHash("UINT8ARRAY");
      }

      function base64urlencode(a) {
        var str = "";
        var bytes = new Uint8Array(a);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          str += String.fromCharCode(bytes[i]);
        }
        return btoa(str)
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      var serialize = function (obj) {
        var str = [];
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        }
        return str.join("&");
      };

        service.SetCredentials = function (username, password) {
          var authdata = base64.encode(username + ':' + password);

          sessionStorage.setItem("auth.header", "Basic " + authdata);
          sessionStorage.setItem("auth.username", username);
        };

        service.ClearCredentials = function () {
          sessionStorage.removeItem("auth.header");
          sessionStorage.removeItem("auth.scheme");
          sessionStorage.removeItem("auth.realm");
          sessionStorage.removeItem("auth.username");
          sessionStorage.removeItem("auth.wwwAuthHeader");
          sessionStorage.removeItem("auth.statusText");
          localStorage.removeItem("auth.stateRandom");
          sessionStorage.removeItem("auth.nonce");
          sessionStorage.removeItem("auth.flow");
        };

        service.getAuthDataHeader = function () {
          try {
            var header64 = sessionStorage.getItem("auth.authDataHeader");
            var headerJson = base64.decode(header64);
            return JSON.parse(headerJson);
          } catch (e) {
            console.log("WARN: Wrong or missing X-Solr-AuthData header on 401 response " + e);
            return null;
          }
        };

        service.decodeJwtPart = function (jwtPart) {
          try {
            return JSON.parse(base64.urldecode(jwtPart));
          } catch (e) {
            console.log("WARN: Invalid format of JWT part: " + e);
            return {};
          }
        };

        service.isJwtCallback = function (hash) {
          var hp = this.decodeHashParams(hash);
          // console.log("Decoded hash as " + JSON.stringify(hp, undefined, 2)); // For debugging callbacks
          return (hp['access_token'] && hp['token_type'] && hp['state']) || (hp['code'] && hp['state'])|| hp['error'];
        };

        service.decodeHashParams = function(hash) {
          // access_token, token_type, expires_in, state, code
          if (hash == null || hash.length === 0) {
            return {};
          }
          var params = {};
          var parts = hash.split("&");
          for (var p in parts) {
            var kv = parts[p].split("=");
            if (kv.length === 2) {
              params[kv[0]] = decodeURIComponent(kv[1]);
            } else {
              console.log("Invalid callback URI, got parameter " + parts[p] + " but expected key=value");
            }
          }
          return params;
        };
        
        return service;
      }]);
