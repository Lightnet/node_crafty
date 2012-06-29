/*
 * Created By:Lightnet
 * 
 * src link:https://bitbucket.org/Lightnet/node_crafty
 *
 * Credits: Craftyjs
*/
var Vector2D = (function () {

	function Vector2D(x, y) {
		if (x instanceof Vector2D) {
			this.x = x.x;
			this.y = x.y;
		} else if (arguments.length === 2) {
			this.x = x;
			this.y = y;
		} else if (arguments.length > 0)
			throw "Unexpected number of arguments for Vector2D()";
	} // class Vector2D
	
	Vector2D.prototype.x = 0;
	Vector2D.prototype.y = 0;
	
	Vector2D.prototype.add = function (vecRH) {
		this.x += vecRH.x;
		this.y += vecRH.y;
		return this;
	} // add( )
	
	Vector2D.prototype.angleBetween = function (vecRH) {
		return Math.atan2(this.x * vecRH.y - this.y * vecRH.x, this.x * vecRH.x + this.y * vecRH.y);
	} // angleBetween( )
	
	Vector2D.prototype.angleTo = function (vecRH) {
		return Math.atan2(vecRH.y - this.y, vecRH.x - this.x);
	};
	
	Vector2D.prototype.clone = function () {
		return new Vector2D(this);
	} // clone( )
	
	Vector2D.prototype.distance = function (vecRH) {
		return Math.sqrt((vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y));
	} // distance( )
	
	Vector2D.prototype.distanceSq = function (vecRH) {
		return (vecRH.x - this.x) * (vecRH.x - this.x) + (vecRH.y - this.y) * (vecRH.y - this.y);
	} // distanceSq( )
	
	Vector2D.prototype.divide = function (vecRH) {
		this.x /= vecRH.x;
		this.y /= vecRH.y;
		return this;
	} // divide( )
	
	Vector2D.prototype.dotProduct = function (vecRH) {
		return this.x * vecRH.x + this.y * vecRH.y;
	} // dotProduct( )
	
	Vector2D.prototype.equals = function (vecRH) {
		return vecRH instanceof Vector2D &&
			this.x == vecRH.x && this.y == vecRH.y;
	} // equals( )
	
	Vector2D.prototype.getNormal = function (vecRH) {
		if (vecRH === undefined)
			return new Vector2D(-this.y, this.x); // assume vecRH is <0, 0>
		return new Vector2D(vecRH.y - this.y, this.x - vecRH.x).normalize();
	} // getNormal( )
	
	Vector2D.prototype.isZero = function () {
		return this.x === 0 && this.y === 0;
	} // isZero( )
	
	Vector2D.prototype.magnitude = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	} // magnitude( )
	
	Vector2D.prototype.magnitudeSq = function () {
		return this.x * this.x + this.y * this.y;
	} // magnitudeSq( )
	
	Vector2D.prototype.multiply = function (vecRH) {
		this.x *= vecRH.x;
		this.y *= vecRH.y;
		return this;
	} // multiply( )
	
	Vector2D.prototype.negate = function () {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	} // negate( )
	
	Vector2D.prototype.normalize = function () {
		var lng = Math.sqrt(this.x * this.x + this.y * this.y);

		if (lng === 0) {
			// default due East
			this.x = 1;
			this.y = 0;
		} else {
			this.x /= lng;
			this.y /= lng;
		} // else

		return this;
	} // normalize( )
	
	Vector2D.prototype.scale = function (scalarX, scalarY) {
		if (scalarY === undefined)
			scalarY = scalarX;

		this.x *= scalarX;
		this.y *= scalarY;

		return this;
	} // scale( )
	
	Vector2D.prototype.scaleToMagnitude = function (mag) {
		var k = mag / this.magnitude();
		this.x *= k;
		this.y *= k;
		return this;
	} // scaleToMagnitude( )
	
	Vector2D.prototype.setValues = function (x, y) {
		if (x instanceof Vector2D) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		} // else

		return this;
	} // setValues( )
	
	Vector2D.prototype.subtract = function (vecRH) {
		this.x -= vecRH.x;
		this.y -= vecRH.y;
		return this;
	} // subtract( )
	
	Vector2D.prototype.toString = function () {
		return "Vector2D(" + this.x + ", " + this.y + ")";
	} // toString( )
	
	Vector2D.prototype.translate = function (dx, dy) {
		if (dy === undefined)
			dy = dx;

		this.x += dx;
		this.y += dy;

		return this;
	} // translate( )
	
	Vector2D.tripleProduct = function (a, b, c) {
		var ac = a.dotProduct(c);
		var bc = b.dotProduct(c);
		return new Crafty.math.Vector2D(b.x * ac - a.x * bc, b.y * ac - a.y * bc);
	};
	
		return Vector2D;
})();

exports.Vector2D = Vector2D;
//console.log('Vector2D:');
//var vec2_1 = new Vector2D(0,1);
//var vec2_2 = new Vector2D(0,1);
//vec2_1.add(vec2_2);
//console.log(vec2_1);
	
	
//Crafty.math.Matrix2D = (function () {
var Matrix2D = (function () {
	
	Matrix2D = function (a, b, c, d, e, f) {
		if (a instanceof Matrix2D) {
			this.a = a.a;
			this.b = a.b;
			this.c = a.c;
			this.d = a.d;
			this.e = a.e;
			this.f = a.f;
		} else if (arguments.length === 6) {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.e = e;
			this.f = f;
		} else if (arguments.length > 0)
			throw "Unexpected number of arguments for Matrix2D()";
	} // class Matrix2D
	
	Matrix2D.prototype.a = 1;
	Matrix2D.prototype.b = 0;
	Matrix2D.prototype.c = 0;
	Matrix2D.prototype.d = 1;
	Matrix2D.prototype.e = 0;
	Matrix2D.prototype.f = 0;
	
	Matrix2D.prototype.apply = function (vecRH) {
		// I'm not sure of the best way for this function to be implemented. Ideally
		// support for other objects (rectangles, polygons, etc) should be easily
		// addable in the future. Maybe a function (apply) is not the best way to do
		// this...?

		var tmpX = vecRH.x;
		vecRH.x = tmpX * this.a + vecRH.y * this.c + this.e;
		vecRH.y = tmpX * this.b + vecRH.y * this.d + this.f;
		// no need to homogenize since the third row is always [0, 0, 1]

		return vecRH;
	} // apply( )
	
	Matrix2D.prototype.clone = function () {
		return new Matrix2D(this);
	} // clone( )
	
	
	Matrix2D.prototype.combine = function (mtrxRH) {
		var tmp = this.a;
		this.a = tmp * mtrxRH.a + this.b * mtrxRH.c;
		this.b = tmp * mtrxRH.b + this.b * mtrxRH.d;
		tmp = this.c;
		this.c = tmp * mtrxRH.a + this.d * mtrxRH.c;
		this.d = tmp * mtrxRH.b + this.d * mtrxRH.d;
		tmp = this.e;
		this.e = tmp * mtrxRH.a + this.f * mtrxRH.c + mtrxRH.e;
		this.f = tmp * mtrxRH.b + this.f * mtrxRH.d + mtrxRH.f;
		return this;
	} // combine( )
	
	
	Matrix2D.prototype.equals = function (mtrxRH) {
		return mtrxRH instanceof Matrix2D &&
			this.a == mtrxRH.a && this.b == mtrxRH.b && this.c == mtrxRH.c &&
			this.d == mtrxRH.d && this.e == mtrxRH.e && this.f == mtrxRH.f;
	} // equals( )
	
	Matrix2D.prototype.determinant = function () {
		return this.a * this.d - this.b * this.c;
	} // determinant( )
	
	
	Matrix2D.prototype.invert = function () {
		var det = this.determinant();

		// matrix is invertible if its determinant is non-zero
		if (det !== 0) {
			var old = {
				a: this.a,
				b: this.b,
				c: this.c,
				d: this.d,
				e: this.e,
				f: this.f
			};
			this.a = old.d / det;
			this.b = -old.b / det;
			this.c = -old.c / det;
			this.d = old.a / det;
			this.e = (old.c * old.f - old.e * old.d) / det;
			this.f = (old.e * old.b - old.a * old.f) / det;
		} // if

		return this;
	} // invert( )
	
	Matrix2D.prototype.isIdentity = function () {
		return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
	} // isIdentity( )
	
	Matrix2D.prototype.isInvertible = function () {
		return this.determinant() !== 0;
	} // isInvertible( )
	
	Matrix2D.prototype.preRotate = function (rads) {
		var nCos = Math.cos(rads);
		var nSin = Math.sin(rads);

		var tmp = this.a;
		this.a = nCos * tmp - nSin * this.b;
		this.b = nSin * tmp + nCos * this.b;
		tmp = this.c;
		this.c = nCos * tmp - nSin * this.d;
		this.d = nSin * tmp + nCos * this.d;

		return this;
	} // preRotate( )
	
	Matrix2D.prototype.preScale = function (scalarX, scalarY) {
		if (scalarY === undefined)
			scalarY = scalarX;

		this.a *= scalarX;
		this.b *= scalarY;
		this.c *= scalarX;
		this.d *= scalarY;

		return this;
	} // preScale( )
	
	Matrix2D.prototype.preTranslate = function (dx, dy) {
		if (typeof dx === "number") {
			this.e += dx;
			this.f += dy;
		} else {
			this.e += dx.x;
			this.f += dx.y;
		} // else

		return this;
	} // preTranslate( )
	
	Matrix2D.prototype.rotate = function (rads) {
		var nCos = Math.cos(rads);
		var nSin = Math.sin(rads);

		var tmp = this.a;
		this.a = nCos * tmp - nSin * this.b;
		this.b = nSin * tmp + nCos * this.b;
		tmp = this.c;
		this.c = nCos * tmp - nSin * this.d;
		this.d = nSin * tmp + nCos * this.d;
		tmp = this.e;
		this.e = nCos * tmp - nSin * this.f;
		this.f = nSin * tmp + nCos * this.f;

		return this;
	} // rotate( )
	
	Matrix2D.prototype.scale = function (scalarX, scalarY) {
		if (scalarY === undefined)
			scalarY = scalarX;

		this.a *= scalarX;
		this.b *= scalarY;
		this.c *= scalarX;
		this.d *= scalarY;
		this.e *= scalarX;
		this.f *= scalarY;

		return this;
	} // scale( )
	
	Matrix2D.prototype.setValues = function (a, b, c, d, e, f) {
		if (a instanceof Matrix2D) {
			this.a = a.a;
			this.b = a.b;
			this.c = a.c;
			this.d = a.d;
			this.e = a.e;
			this.f = a.f;
		} else {
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.e = e;
			this.f = f;
		} // else

		return this;
	} // setValues( )
	
	Matrix2D.prototype.toString = function () {
		return "Matrix2D([" + this.a + ", " + this.c + ", " + this.e +
			"] [" + this.b + ", " + this.d + ", " + this.f + "] [0, 0, 1])";
	} // toString( )
	
	Matrix2D.prototype.translate = function (dx, dy) {
		if (typeof dx === "number") {
			this.e += this.a * dx + this.c * dy;
			this.f += this.b * dx + this.d * dy;
		} else {
			this.e += this.a * dx.x + this.c * dx.y;
			this.f += this.b * dx.x + this.d * dx.y;
		} // else

		return this;
	} // translate( )
	
	return Matrix2D;
})();

exports.Matrix2D = Matrix2D;
//console.log(Matrix2D);
//var mat = new Matrix2D(0,0,0,0,0,0);
//console.log(mat);
	


