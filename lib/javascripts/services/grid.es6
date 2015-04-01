angular.module('fbPostImageValidator')
	.service('fbPostImageValidator.services.grid', [
	'fbPostImageValidator.constants.imgCaseStates',
	function(IMG_CASE_STATES) {
		
		this.generate = generate;
		this.getAmountOfSelectedCase = getAmountOfSelectedCase;

		function generate(width = 1, height = 1) {

			var grid = [];

			width = parseInt(width,10);
			height = parseInt(height,10);

			for(var x = 0; x<width; x++) {
				grid.push([]);
				for(var y = 0; y<height; y++)
					grid[x].push(IMG_CASE_STATES.UNDEFINED);
			}

			return grid;
		}

		function getAmountOfSelectedCase(grid = []) {
			var length = 0;

			for(var x = 0; x<grid.length; x++)
				for(var y = 0; y<grid[x].length; y++)
					if(typeof grid[x][y] !== 'undefined' && grid[x][y] !== IMG_CASE_STATES.UNDEFINED)
						length++;

			return length;
		}
	}]);