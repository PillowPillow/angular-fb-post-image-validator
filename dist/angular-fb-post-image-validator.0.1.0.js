// angular-fb-post-image-validator
// version: 0.1.0
// author: Gaignoux Nicolas
// generated: Thu Apr 02 2015 11:23:31 GMT+0200 (Paris, Madrid (heure d’été))
// Autogenerated, do not edit. All changes will be undone.
(function (window,document,angular) {

	"use strict";
	
	angular.module("fbPostImageValidator", []);
	angular.module('fbPostImageValidator').run(['$templateCache', function($templateCache) {
		$templateCache.put('../lib/templates/fbImgValidator.jade',
			'<section class="img-container">\n' +
			'  <canvas></canvas>\n' +
			'</section>\n' +
			'<section ng-style="containerStyle" class="case-container">\n' +
			'  <article ng-style="rowStyle" ng-repeat="(x,col) in grid track by $index" class="case-col">\n' +
			'    <article ng-style="caseStyle" ng-class="{valid:value===1,invalid:value===0}" ng-repeat="(y,value) in col track by $index" ng-click="toggleCase(x,y)" class="case-row"></article>\n' +
			'  </article>\n' +
			'</section>');
	}]);
	
	"use strict";
	
	angular.module("fbPostImageValidator").constant("fbPostImageValidator.constants.imgCaseStates", {
		VALID: 1,
		INVALID: 0,
		UNDEFINED: -1
	});
	"use strict";
	
	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
	
	angular.module("fbPostImageValidator").directive("fbImgValidator", ["fbPostImageValidator.services.grid", "fbPostImageValidator.services.fileReader", "fbPostImageValidator.constants.imgCaseStates", "$q", function (gridService, fileReaderService, IMG_CASE_STATES, $q) {
		return {
			scope: {
				value: "=ngModel",
				col: "@?col",
				row: "@?row",
				maxText: "=?maxText",
				width: "=?imgWidth",
				height: "=?imgHeight",
				name: "@name"
			},
			require: "ngModel",
			restrict: "AE",
			templateUrl: "../lib/templates/fbImgValidator.jade",
			link: function link($scope, $node, attributes, ngModel) {
	
				$scope.maxText = $scope.maxText ? parseInt($scope.maxText, 10) : 20;
				$scope.col = $scope.col ? parseInt($scope.col, 10) : 1;
				$scope.row = $scope.row ? parseInt($scope.row, 10) : 1;
				$scope.grid = [];
				$scope.caseStyle = {};
				$scope.rowStyle = {};
				$scope.containerStyle = {};
				$scope.toggleCase = check_uncheckGridCase;
	
				ngModel.$name = $scope.name;
	
				var canvas = $node[0].querySelector("canvas"),
				    checked = [];
	
				$scope.$watch("col+row", function () {
					return $scope.grid = gridService.generate($scope.col, $scope.row);
				});
				$scope.$watch("value", function () {
					return render($scope.value);
				});
	
				function check_uncheckGridCase(x, y) {
	
					var key = "" + x + ":" + y,
					    index = checked.indexOf(key);
					if (!! ~index) checked.splice(index, 1);
	
					if ($scope.grid[x][y] !== IMG_CASE_STATES.UNDEFINED) $scope.grid[x][y] = IMG_CASE_STATES.UNDEFINED;else checked.push(key);
	
					updateStates();
	
					ngModel.$setValidity("tooManyText", !isLimitReached());
				}
	
				function updateStates() {
					var authorizedCheckedCaseAmount = getAuthorizedCheckedCaseAmount();
					for (var i = 0; i < checked.length; i++) {
						var _checked$i$split = checked[i].split(":");
	
						var _checked$i$split2 = _slicedToArray(_checked$i$split, 2);
	
						var x = _checked$i$split2[0];
						var y = _checked$i$split2[1];
	
						$scope.grid[x][y] = i < authorizedCheckedCaseAmount ? IMG_CASE_STATES.VALID : IMG_CASE_STATES.INVALID;
					}
				}
	
				function isLimitReached() {
					var simuleOneMoreCheck = arguments[0] === undefined ? false : arguments[0];
	
					return checked.length + (simuleOneMoreCheck ? 1 : 0) > getAuthorizedCheckedCaseAmount();
				}
	
				function getAuthorizedCheckedCaseAmount() {
					return $scope.maxText / 100 * ($scope.row * $scope.col);
				}
	
				function render(src) {
	
					var promise;
					if (src instanceof Object) promise = fileReaderService(src).loadImage();else {
						var img = new Image(),
						    deferred = $q.defer();
						img.onload = function () {
							deferred.resolve(this);
						};
						img.src = src;
	
						promise = deferred.promise;
					}
	
					promise.then(function (loaded) {
						return draw(loaded);
					});
				}
	
				function draw(image) {
					var height = image.height,
					    width = image.width;
	
					if ($scope.width) {
						width = parseInt($scope.width, 10);
						if (!$scope.height) height = $scope.width / image.width * image.height;
					}
	
					if ($scope.height) {
						height = parseInt($scope.height, 10);
	
						if (!$scope.width) width = $scope.height / image.height * image.width;
					}
					setStyleProperties(width, height);
	
					canvas.setAttribute("width", width);
					canvas.setAttribute("height", height);
					canvas.getContext("2d").drawImage(image, 0, 0, width, height);
				}
	
				function setStyleProperties(width, height) {
					$scope.caseStyle.width = "" + width / $scope.col + "px";
					$scope.caseStyle.height = "" + height / $scope.row + "px";
					$scope.rowStyle.height = "" + height / $scope.row + "px";
					$scope.rowStyle.width = "" + width + "px";
					$scope.containerStyle.width = "" + width + "px";
					$scope.containerStyle.height = "" + height + "px";
				}
			}
		};
	}]);
	"use strict";
	
	angular.module("fbPostImageValidator").service("fbPostImageValidator.services.fileReader", ["$window", "$q", function ($window, $q) {
		var _this = this;
	
		this.extractInfos = extractInfos;
	
		return function (file) {
	
			var fInfos = _this.extractInfos(file);
	
			if (!fInfos.isImage(file)) throw Error("Not an image");
	
			_this.loadImage = function () {
				var reader = new FileReader(),
				    deferred = $q.defer();
	
				reader.readAsDataURL(file);
				reader.onload = function (event) {
					var img = new Image();
					img.onload = onLoadImg;
					img.src = event.target.result;
				};
	
				function onLoadImg() {
					deferred.resolve(this);
				}
	
				return deferred.promise;
			};
	
			return _this;
		};
	
		function extractInfos(file) {
			return {
				support: !!($window.FileReader && $window.CanvasRenderingContext2D),
				isImage: function (file) {
					var type = "|" + file.type.slice(file.type.lastIndexOf("/") + 1) + "|";
					return "|jpg|png|jpeg|bmp|gif|".indexOf(type) !== -1;
				}
			};
		}
	}]);
	"use strict";
	
	angular.module("fbPostImageValidator").service("fbPostImageValidator.services.grid", ["fbPostImageValidator.constants.imgCaseStates", function (IMG_CASE_STATES) {
	
		this.generate = generate;
		this.getAmountOfSelectedCase = getAmountOfSelectedCase;
	
		function generate() {
			var width = arguments[0] === undefined ? 1 : arguments[0];
			var height = arguments[1] === undefined ? 1 : arguments[1];
	
			var grid = [];
	
			width = parseInt(width, 10);
			height = parseInt(height, 10);
	
			for (var x = 0; x < width; x++) {
				grid.push([]);
				for (var y = 0; y < height; y++) grid[x].push(IMG_CASE_STATES.UNDEFINED);
			}
	
			return grid;
		}
	
		function getAmountOfSelectedCase() {
			var grid = arguments[0] === undefined ? [] : arguments[0];
	
			var length = 0;
	
			for (var x = 0; x < grid.length; x++) for (var y = 0; y < grid[x].length; y++) if (typeof grid[x][y] !== "undefined" && grid[x][y] !== IMG_CASE_STATES.UNDEFINED) length++;
	
			return length;
		}
	}]);

})(window,window.document,window.angular);