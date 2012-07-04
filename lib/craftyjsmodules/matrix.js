Crafty.matrix = function (m) {
	this.mtx = m;
	this.width = m[0].length;
	this.height = m.length;
};

Crafty.matrix.prototype = {
	x: function (other) {
		if (this.width != other.height) {
			return;
		}

		var result = [];
		for (var i = 0; i < this.height; i++) {
			result[i] = [];
			for (var j = 0; j < other.width; j++) {
				var sum = 0;
				for (var k = 0; k < this.width; k++) {
					sum += this.mtx[i][k] * other.mtx[k][j];
				}
				result[i][j] = sum;
			}
		}
		return new Crafty.matrix(result);
	},


	e: function (row, col) {
		//test if out of bounds
		if (row < 1 || row > this.mtx.length || col < 1 || col > this.mtx[0].length) return null;
		return this.mtx[row - 1][col - 1];
	}
}