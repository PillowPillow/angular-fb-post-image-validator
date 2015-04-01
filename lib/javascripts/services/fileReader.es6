angular.module('fbPostImageValidator')
	.service('fbPostImageValidator.services.fileReader', ['$window', '$q',
	function($window, $q) {
		
		this.extractInfos = extractInfos;

		return (file) => {

			var fInfos = this.extractInfos(file);

			if(!fInfos.isImage(file))
				throw Error('Not an image');

			this.loadImage = () => {
				var reader = new FileReader(),
					deferred = $q.defer();

				reader.readAsDataURL(file);
				reader.onload = (event) => {
					var img = new Image();
					img.onload = onLoadImg;
					img.src = event.target.result;
				};

				function onLoadImg() {
					deferred.resolve(this);
				}

				return deferred.promise;
			};

			return this;

		};

		function extractInfos(file) {
			return {
				support: !!($window.FileReader && $window.CanvasRenderingContext2D),
				isImage: (file) => {
					var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
					return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
				}
			};
		}

	}]);