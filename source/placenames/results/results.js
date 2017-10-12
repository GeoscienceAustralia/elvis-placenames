{
   angular.module("placenames.results", ['placenames.results.item', 'placenames.scroll'])

      .directive("placenamesResults", ['placenamesResultsService', function (placenamesResultsService) {
         return {
            templateUrl: 'placenames/results/results.html',
            restrict: "AE",
            bindToController: {
               data: "="
            },
            controller: function () {
               this.clear = function (data) {
                  this.data.searched = null;
               };

               this.more = function () {
                  placenamesResultsService.moreDocs(this.data.persist);
               };

               this.download = function () {
                  placenamesResultsService.download(this.data.persist.data.response.docs.map(doc => doc.id));
               };
            },
            controllerAs: "pr",
            link: function (scope) {
               scope.$destroy = function () {
                  placenamesResultsService.hide();
               };
               placenamesResultsService.moreDocs(scope.pr.data.persist);
            }
         };
      }])

      .factory("placenamesResultsService", ResultsService)

      .filter("resultsHasSomeData", function () {
         return function (list) {
            return list.some(item => item);
         };
      });

   ResultsService.$inject = ['proxy', '$http', '$rootScope', '$timeout', 'configService', 'mapService', 'placenamesSearchService'];
}

function ResultsService(proxy, $http, $rootScope, $timeout, configService, mapService, placenamesSearchService) {
   const ZOOM_IN = 7;
   var marker;

   var service = {
      showPan(what) {
         return this.show(what).then(details => {
            var map = details.map;
            map.panTo(details.location, { animate: true });
            if (map.getZoom() < ZOOM_IN) {
               map.setZoom(ZOOM_IN, { animate: true });
            }
            return details;
         });
      },

      show(what) {
         return this.hide().then(map => {
            var location = what.location.split(" ").reverse().map(str => +str);
            // split lng/lat string seperated by space, reverse to lat/lng, cooerce to numbers
            marker = L.popup()
               .setLatLng(location)
               .setContent(what.name + "<br/>Lat/Lng: " +
               location[0] + "&deg;" +
               location[1] + "&deg;")
               .openOn(map);

            return {
               location,
               map,
               marker
            };
         });
      },

      downloadOld(ids) {
         this.config.then(config => {
            proxy.get(config.esriTemplate.replace("${id}", ids.join(","))).then(data => {
               var blob = new Blob([JSON.stringify(data, null, 3)], { type: "application/json;charset=utf-8" });
               saveAs(blob, "gazetteer-esri-features-" + Date.now() + ".json");
            });
         });
      },

      download(ids) {
         this.config.then(config => {
            proxy.get(config.esriTemplate.replace("${id}", ids.join(","))).then(data => {
               var blob = new Blob([JSON.stringify(data, null, 3)], { type: "application/json;charset=utf-8" });
               saveAs(blob, "gazetteer-esri-features-" + Date.now() + ".json");
            });
         });
      },

      hide(what) {
         return mapService.getMap().then(map => {
            if (marker) {
               map.removeLayer(marker);
            }
            return map;
         });
      },

      get config() {
         return configService.getConfig().then(config => {
            return config.results;
         });
      },

      load(id) {
         return this.config.then(({ esriTemplate }) => {
            return $http.get(esriTemplate.replace("${id}", id), { cache: true }).then(response => {
               console.log("argghhh1! " + response.status);
               return response.data;
            },
               () => {
                  // No data is a valid response.
                  return {
                     features: [{
                        noData: true
                     }]
                  };
               });
         });
      },

      moreDocs(persist) {
         var response = persist.data.response;
         var start = response.docs.length;
         if (start >= response.numFound) {
            return;
         }

         let params = persist.params;
         params.start = start;

         placenamesSearchService.request(params).then(data => {
            response.docs.push(...data.response.docs);
         });
      }
   };

   return service;
}