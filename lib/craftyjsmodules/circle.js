Crafty.circle = function (x, y, radius) {
	this.x = x;
	this.y = y;
	this.radius = radius;

	// Creates an octogon that aproximate the circle for backward compatibility.
	this.points = [];
	var theta;

	for (var i = 0; i < 8; i++) {
		theta = i * Math.PI / 4;
		this.points[i] = [Math.sin(theta) * radius, Math.cos(theta) * radius];
	}
};

Crafty.circle.prototype = {
	containsPoint: function (x, y) {
		var radius = this.radius,
		    sqrt = Math.sqrt,
		    deltaX = this.x - x,
		    deltaY = this.y - y;

		return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
	},

	shift: function (x, y) {
		this.x += x;
		this.y += y;

		var i = 0, l = this.points.length, current;
		for (; i < l; i++) {
			current = this.points[i];
			current[0] += x;
			current[1] += y;
		}
	},

	rotate: function () {
		// We are a circle, we don't have to rotate :)
	}
};

//console.log(Crafty.circle());
//console.log(Crafty);