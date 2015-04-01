angular.module('app')
	.controller('app.controllers.sample', ['FileUploader',
	function(FileUploader) {
	
		this.img = 'http://www.menshealth.com/women-of-mh/sites/default/files/george-holz3.jpg';

		var url = 'upload.php',
			uploader = this.uploader = new FileUploader({url});

		uploader.filters.push({
			name: 'imageFilter',
			fn: (item) => {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});


		
	}]);