"use strict";function ContributorsService(t){var e={show:!1,ingroup:!1,stick:!1};return t.get("placenames/resources/config/contributors.json").then(function(t){e.orgs=t.data}),{getState:function(){return e}}}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}angular.module("placenames.contributors",[]).directive("placenamesContributors",["$interval","contributorsService",function(t,e){return{templateUrl:"contributors/contributors.html",scope:{},link:function(r,n){var o=void 0;r.contributors=e.getState(),r.over=function(){t.cancel(o),r.contributors.ingroup=!0},r.out=function(){o=t(function(){r.contributors.ingroup=!1},1e3)},r.unstick=function(){r.contributors.ingroup=r.contributors.show=r.contributors.stick=!1,n.find("a").blur()}}}}]).directive("placenamesContributorsLink",["$interval","contributorsService",function(t,e){return{restrict:"AE",templateUrl:"contributors/show.html",scope:{},link:function(r){var n=void 0;r.contributors=e.getState(),r.over=function(){t.cancel(n),r.contributors.show=!0},r.toggleStick=function(){r.contributors.stick=!r.contributors.stick,r.contributors.stick||(r.contributors.show=r.contributors.ingroup=!1)},r.out=function(){n=t(function(){r.contributors.show=!1},700)}}}}]).factory("contributorsService",ContributorsService).filter("activeContributors",function(){return function(t){return t?t.filter(function(t){return t.enabled}):[]}}),ContributorsService.$inject=["$http"],angular.module("placenames.altthemes",["placenames.storage"]).directive("altThemes",["altthemesService",function(t){return{restrict:"AE",templateUrl:"navigation/altthemes.html",scope:{current:"="},link:function(e){t.getThemes().then(function(t){e.themes=t}),t.getCurrentTheme().then(function(t){e.theme=t}),e.changeTheme=function(r){e.theme=r,t.setTheme(r.key)}}}}]).controller("altthemesCtrl",["altthemesService",function(t){this.service=t}]).filter("altthemesFilter",function(){return function(t,e){var r=[];return e?(t&&t.forEach(function(t){t.themes&&t.themes.some(function(t){return t===e.key})&&r.push(t)}),r):t}}).factory("altthemesService",["$q","$http","storageService",function(t,e,r){var n="placenames.current.theme",o="placenames/resources/config/themes.json",a="All",i=[],s=this;return this.themes=[],this.theme=null,r.getItem(n).then(function(t){t||(t=a),e.get(o,{cache:!0}).then(function(e){var r=e.data.themes;s.themes=r,s.theme=r[t],angular.forEach(r,function(t,e){t.key=e}),i.forEach(function(t){t.resolve(s.theme)})})}),this.getCurrentTheme=function(){if(this.theme)return t.when(s.theme);var e=t.defer();return i.push(e),e.promise},this.getThemes=function(){return e.get(o,{cache:!0}).then(function(t){return t.data.themes})},this.setTheme=function(t){this.theme=this.themes[t],r.setItem(n,t)},this}]).filter("altthemesEnabled",function(){return function(t){return t?t.filter(function(t){return!!t.enabled}):t}}).filter("altthemesMatchCurrent",function(){return function(t,e){return t?t.filter(function(t){return!!t.keys.find(function(t){return t===e})}):t}}),angular.module("placenames.navigation",["placenames.altthemes"]).directive("placenamesNavigation",[function(){return{restrict:"AE",template:"<alt-themes current='current'></alt-themes>",scope:{current:"=?"},link:function(t){t.username="Anonymous",t.current||(t.current="none")}}}]).factory("navigationService",[function(){return{}}]),function(t){t.module("placenames.header",[]).controller("headerController",["$scope","$q","$timeout",function(t,e,r){var n=function(t){return t};t.$on("headerUpdated",function(e,r){t.headerConfig=n(r)})}]).directive("placenamesHeader",[function(){var e={current:"none",heading:"ICSM",headingtitle:"ICSM",helpurl:"help.html",helptitle:"Get help about ICSM",helpalttext:"Get help about ICSM",skiptocontenttitle:"Skip to content",skiptocontent:"Skip to content",quicklinksurl:"/search/api/quickLinks/json?lang=en-US"};return{transclude:!0,restrict:"EA",templateUrl:"header/header.html",scope:{current:"=",breadcrumbs:"=",heading:"=",headingtitle:"=",helpurl:"=",helptitle:"=",helpalttext:"=",skiptocontenttitle:"=",skiptocontent:"=",quicklinksurl:"="},link:function(r,n,o){t.copy(e);t.forEach(e,function(t,e){e in r||(r[e]=t)})}}}]).factory("headerService",["$http",function(){}])}(angular),angular.module("placenames.storage",[]).factory("storageService",["$log","$q",function(t,e){var r="elvis.placenames";return{setGlobalItem:function(t,e){this._setItem("_system",t,e)},setItem:function(t,e){this._setItem(r,t,e)},_setItem:function(e,r,n){t.debug("Fetching state for key locally"+r),localStorage.setItem(e+"."+r,JSON.stringify(n))},getGlobalItem:function(t){return this._getItem("_system",t)},getItem:function(t){var n=e.defer();return this._getItem(r,t).then(function(t){n.resolve(t)}),n.promise},_getItem:function(r,n){t.debug("Fetching state locally for key "+n);var o=localStorage.getItem(r+"."+n);if(o)try{o=JSON.parse(o)}catch(a){}return e.when(o)}}}]);var RootCtrl=function t(e,r){var n=this;_classCallCheck(this,t),this.map=r.map,e.getConfig().then(function(t){n.data=t})};RootCtrl.$invoke=["configService","mapService"],angular.module("AntarcticApp",["antarctic.maps","antarctic.templates","explorer.config","explorer.confirm","explorer.enter","explorer.flasher","explorer.googleanalytics","explorer.info","explorer.message","explorer.modal","explorer.persist","explorer.version","placenames.contributors","placenames.header","placenames.navigation","exp.ui.templates","explorer.map.templates","ui.bootstrap","ngAutocomplete","ngSanitize","page.footer"]).config(["configServiceProvider","persistServiceProvider","projectsServiceProvider","versionServiceProvider",function(t,e,r,n){t.location("placenames/resources/config/config.json?v=4"),t.dynamicLocation("placenames/resources/config/configclient.json?"),n.url("placenames/assets/package.json"),e.handler("local"),r.setProject("placenames")}]).run(["mapService",function(t){window.map=t.map}]).controller("RootCtrl",RootCtrl).filter("bytes",function(){return function(t,e){if(isNaN(parseFloat(t))||!isFinite(t))return"-";"undefined"==typeof e&&(e=0);var r=["bytes","kB","MB","GB","TB","PB"],n=Math.floor(Math.log(t)/Math.log(1024));return(t/Math.pow(1024,Math.floor(n))).toFixed(e)+" "+r[n]}}).factory("userService",[function(){function t(){return!0}return{login:t,hasAcceptedTerms:t,setAcceptedTerms:t,getUsername:function(){return"anon"}}}]),"every"in Array.prototype||(Array.prototype.every=function(t,e){for(var r=0,n=this.length;r<n;r++)if(r in this&&!t.call(e,this[r],r,this))return!1;return!0}),Array.from||(Array.from=function(){var t=Object.prototype.toString,e=function(e){return"function"==typeof e||"[object Function]"===t.call(e)},r=function(t){var e=Number(t);return isNaN(e)?0:0!==e&&isFinite(e)?(e>0?1:-1)*Math.floor(Math.abs(e)):e},n=Math.pow(2,53)-1,o=function(t){var e=r(t);return Math.min(Math.max(e,0),n)};return function(t){var r=this,n=Object(t);if(null===t)throw new TypeError("Array.from requires an array-like object - not null or undefined");var a=arguments.length>1?arguments[1]:void 0,i=void 0;if("undefined"!=typeof a){if(!e(a))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(i=arguments[2])}for(var s=o(n.length),c=e(r)?Object(new r(s)):new Array(s),l=0,u=void 0;l<s;)u=n[l],a?c[l]="undefined"==typeof i?a(u,l):a.call(i,u,l):c[l]=u,l+=1;return c.length=s,c}}());var MapService=function e(){_classCallCheck(this,e);var t=new L.Proj.CRS("EPSG:3031","+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",{origin:[-4194304,4194304],resolutions:[8192,4096,2048,1024,512,256],bounds:[[-4194304,-4194304],[4194304,4194304]]}),r=this.map=L.map("mappo",{center:[-90,0],zoom:0,maxZoom:5,crs:t}),n="//map1{s}.vis.earthdata.nasa.gov/wmts-antarctic/{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.jpg",o=this.layer=L.tileLayer(n,{layer:"MODIS_Aqua_CorrectedReflectance_TrueColor",tileMatrixSet:"EPSG3031_250m",format:"image%2Fjpeg",time:"2013-12-01",tileSize:512,subdomains:"abc",noWrap:!0,continuousWorld:!0,attribution:"<a href='https://wiki.earthdata.nasa.gov/display/GIBS'>NASA EOSDIS GIBS</a>"}),a=o.getTileUrl;o.getTileUrl=function(t){var e=Math.pow(2,o._getZoomForUrl()+1);return t.x<0?"":t.y<0?"":t.x>=e?"":t.y>=e?"":a.call(o,t)},r.addLayer(o);for(var i=-180;i<181;i+=10)L.marker([-81+i/20,i]).addTo(r);L.marker([-90,0]).addTo(r),L.marker([-88,0]).addTo(r),L.marker([-80,0]).addTo(r),L.marker([-78,0]).addTo(r),L.marker([-70,0]).addTo(r),L.marker([-68,0]).addTo(r),L.marker([-90,-90]).addTo(r),L.marker([-88,-88]).addTo(r),L.marker([-80,-90]).addTo(r),L.marker([-78,-88]).addTo(r),L.marker([-70,-90]).addTo(r),L.marker([-68,-88]).addTo(r)};angular.module("antarctic.maps",[]).service("mapService",[function(){new MapService}]),angular.module("antarctic.templates",[]).run(["$templateCache",function(t){t.put("contributors/contributors.html",'<span class="contributors" ng-mouseenter="over()" ng-mouseleave="out()" style="z-index:1500"\r\n      ng-class="(contributors.show || contributors.ingroup || contributors.stick) ? \'transitioned-down\' : \'transitioned-up\'">\r\n   <button class="undecorated contributors-unstick" ng-click="unstick()" style="float:right">X</button>\r\n   <div ng-repeat="contributor in contributors.orgs | activeContributors" style="text-align:cnter">\r\n      <a ng-href="{{contributor.href}}" name="contributors{{$index}}" title="{{contributor.title}}" target="_blank">\r\n         <img ng-src="{{contributor.image}}" alt="{{contributor.title}}" class="elvis-logo" ng-class="contributor.class"></img>\r\n      </a>\r\n   </div>\r\n</span>'),t.put("contributors/show.html",'<a ng-mouseenter="over()" ng-mouseleave="out()" class="contributors-link" title="Click to lock/unlock contributors list."\r\n      ng-click="toggleStick()" href="#contributors0">Contributors</a>'),t.put("navigation/altthemes.html",'<span class="altthemes-container">\r\n\t<span ng-repeat="item in themes | altthemesMatchCurrent : current">\r\n       <a title="{{item.label}}" ng-href="{{item.url}}" class="altthemesItemCompact" target="_blank">\r\n         <span class="altthemes-icon" ng-class="item.className"></span>\r\n       </a>\r\n    </li>\r\n</span>'),t.put("header/header.html",'<div class="container-full common-header" style="padding-right:10px; padding-left:10px">\r\n   <div class="navbar-header">\r\n\r\n      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".ga-header-collapse">\r\n         <span class="sr-only">Toggle navigation</span>\r\n         <span class="icon-bar"></span>\r\n         <span class="icon-bar"></span>\r\n         <span class="icon-bar"></span>\r\n      </button>\r\n\r\n      <a href="/" class="appTitle visible-xs">\r\n         <h1 style="font-size:120%">{{heading}}</h1>\r\n      </a>\r\n   </div>\r\n   <div class="navbar-collapse collapse ga-header-collapse">\r\n      <ul class="nav navbar-nav">\r\n         <li class="hidden-xs">\r\n            <a href="/">\r\n               <h1 class="applicationTitle">{{heading}}</h1>\r\n            </a>\r\n         </li>\r\n      </ul>\r\n      <ul class="nav navbar-nav navbar-right nav-icons">\r\n         <li role="menuitem" style="padding-right:10px;position: relative;top: -3px;">\r\n            <span class="altthemes-container">\r\n               <span>\r\n                  <a title="Location INformation Knowledge platform (LINK)" href="http://fsdf.org.au/" target="_blank">\r\n                     <img alt="FSDF" src="placenames/resources/img/FSDFimagev4.0.png" style="height: 66px">\r\n                  </a>\r\n               </span>\r\n            </span>\r\n         </li>\r\n         <li placenames-navigation role="menuitem" current="current" style="padding-right:10px"></li>\r\n         <li mars-version-display role="menuitem"></li>\r\n         <li style="width:10px"></li>\r\n      </ul>\r\n   </div>\r\n   <!--/.nav-collapse -->\r\n</div>\r\n<div class="contributorsLink" style="position: absolute; right:7px; bottom:15px">\r\n   <placenames-contributors-link></placenames-contributors-link>\r\n</div>\r\n<!-- Strap -->\r\n<div class="row">\r\n   <div class="col-md-12">\r\n      <div class="strap-blue">\r\n      </div>\r\n      <div class="strap-white">\r\n      </div>\r\n      <div class="strap-red">\r\n      </div>\r\n   </div>\r\n</div>')}]);