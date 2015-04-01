angular.module('fbPostImageValidator')
	.directive('fbImgValidator',[
	'fbPostImageValidator.services.grid',
	'fbPostImageValidator.services.fileReader',
	'fbPostImageValidator.constants.imgCaseStates',
	'$q',
	function(gridService, fileReaderService, IMG_CASE_STATES, $q) {
		return {
			scope: {
				value: '=ngModel',
				col: '@?col',
				row: '@?row',
				maxText: '=?maxText',
				width: '=?imgWidth',
				height: '=?imgHeight',
				name: '@name'
			},
			require: 'ngModel',
			restrict: 'AE',
			templateUrl: '../lib/templates/fbImgValidator.jade',
			link: function($scope, $node, attributes, ngModel) {

				$scope.maxText = $scope.maxText ? parseInt($scope.maxText, 10) : 20;
				$scope.col = $scope.col ? parseInt($scope.col, 10) : 1;
				$scope.row = $scope.row ? parseInt($scope.row, 10) : 1;
				$scope.grid = [];
				$scope.caseStyle = {};
				$scope.rowStyle = {};
				$scope.containerStyle = {};
				$scope.toggleCase = check_uncheckGridCase;

				ngModel.$name = $scope.name;

				var canvas = $node[0].querySelector('canvas'),
					checked = [];

				$scope.$watch('col+row', () => $scope.grid = gridService.generate($scope.col, $scope.row));
				$scope.$watch('value', () => render($scope.value));

				function check_uncheckGridCase(x,y) {

					var key = `${x}:${y}`,
						index = checked.indexOf(key);
					if(!!~index)
						checked.splice(index,1);

					if($scope.grid[x][y] !== IMG_CASE_STATES.UNDEFINED)
						$scope.grid[x][y] = IMG_CASE_STATES.UNDEFINED;
					else
						checked.push(key);

					updateStates();

					ngModel.$setValidity('tooManyText', !isLimitReached());
				}

				function updateStates() {
					var authorizedCheckedCaseAmount = getAuthorizedCheckedCaseAmount();
					for(var i = 0; i<checked.length; i++) {
						let [x,y] = checked[i].split(':');
						$scope.grid[x][y] = i < authorizedCheckedCaseAmount ? IMG_CASE_STATES.VALID : IMG_CASE_STATES.INVALID;
					}
				}

				function isLimitReached(simuleOneMoreCheck = false) {
					return ( checked.length  + (simuleOneMoreCheck?1:0) ) > getAuthorizedCheckedCaseAmount();
				}

				function getAuthorizedCheckedCaseAmount() {
					return $scope.maxText / 100 * ($scope.row * $scope.col);
				}

				function render(src) {
					
					var promise;
					if(src instanceof Object)
						promise = fileReaderService(src).loadImage();
					else {
						var img = new Image(),
							deferred = $q.defer();
						img.onload = function() {deferred.resolve(this);};
						img.src = src;

						promise = deferred.promise;
					}

					promise.then((loaded) => draw(loaded));

				}

				function draw(image) {
					var height = image.height,
						width = image.width;

					if($scope.width) {
						width = parseInt($scope.width, 10);
						if(!$scope.height)
							height = ($scope.width / image.width ) *  image.height;
					}

					if($scope.height) {
						height = parseInt($scope.height, 10);

						if(!$scope.width)
							width = ($scope.height / image.height ) *  image.width;
					}

					setStyleProperties(width, height);

					canvas.setAttribute('width', $scope.width);
                    canvas.setAttribute('height', height);
                    canvas.getContext('2d').drawImage(image, 0, 0, $scope.width, height);
				}

				function setStyleProperties(width, height) {
					$scope.caseStyle.width = `${width/$scope.col}px`;
					$scope.caseStyle.height = `${height/$scope.row}px`;
					$scope.rowStyle.height = `${height/$scope.row}px`;
					$scope.rowStyle.width = `${width}px`;
					$scope.containerStyle.width = `${width}px`;
					$scope.containerStyle.height = `${height}px`;
				}
			}
		};
	}]);