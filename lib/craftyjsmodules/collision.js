Crafty.c("Collision", {
	init: function () {
        this.requires("2D");
        var area = this._mbr || this;

        poly = new Crafty.polygon([0, 0], [area._w, 0], [area._w, area._h], [0, area._h]);
		console.log(poly);
        this.map = poly;
        this.attach(this.map);
        this.map.shift(area._x, area._y);
    },
	
	collision: function (poly) {
		var area = this._mbr || this;

		if (!poly) {
			return this;
		}
        
        if (arguments.length > 1) {
            //convert args to array to create polygon
            var args = Array.prototype.slice.call(arguments, 0);
            poly = new Crafty.polygon(args);
        }

        this.map = poly;
        this.attach(this.map);
        this.map.shift(area._x, area._y);

        return this;
    },
	
	
	hit: function (comp) {
		var area = this._mbr || this,
			results = Crafty.map.search(area, false),
			i = 0, l = results.length,
			dupes = {},
			id, obj, oarea, key,
			hasMap = ('map' in this && 'containsPoint' in this.map),
			finalresult = [];

		if (!l) {
			return false;
		}

		for (; i < l; ++i) {
			obj = results[i];
			oarea = obj._mbr || obj; //use the mbr

			if (!obj) continue;
			id = obj[0];

			//check if not added to hash and that actually intersects
			if (!dupes[id] && this[0] !== id && obj.__c[comp] &&
							 oarea._x < area._x + area._w && oarea._x + oarea._w > area._x &&
							 oarea._y < area._y + area._h && oarea._h + oarea._y > area._y)
				dupes[id] = obj;
		}

		for (key in dupes) {
			obj = dupes[key];

			if (hasMap && 'map' in obj) {
				var SAT = this._SAT(this.map, obj.map);
				SAT.obj = obj;
				SAT.type = "SAT";
				if (SAT) finalresult.push(SAT);
			} else {
				finalresult.push({ obj: obj, type: "MBR" });
			}
		}

		if (!finalresult.length) {
			return false;
		}

		return finalresult;
	},
	
	onHit: function (comp, callback, callbackOff) {
		//console.log('hit');
		var justHit = false;
		this.bind("EnterFrame", function () {
            //console.log('frame hit collision');
			var hitdata = this.hit(comp);
			if (hitdata) {
				justHit = true;
                //console.log('true hit collision');
				callback.call(this, hitdata);
			} else if (justHit) {
				if (typeof callbackOff == 'function') {
					callbackOff.call(this);
				}
				justHit = false;
                //console.log('false hit collision');
			}
		});
		return this;
	},

	_SAT: function (poly1, poly2) {
		var points1 = poly1.points,
			points2 = poly2.points,
			i = 0, l = points1.length,
			j, k = points2.length,
			normal = { x: 0, y: 0 },
			length,
			min1, min2,
			max1, max2,
			interval,
			MTV = null,
			MTV2 = null,
			MN = null,
			dot,
			nextPoint,
			currentPoint;

		//loop through the edges of Polygon 1
		for (; i < l; i++) {
			nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
			currentPoint = points1[i];

			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);

			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;

			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;

			//project all vertices from poly1 onto axis
			for (j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if (dot > max1 || max1 === -1) max1 = dot;
				if (dot < min1 || min1 === -1) min1 = dot;
			}

			//project all vertices from poly2 onto axis
			for (j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if (dot > max2 || max2 === -1) max2 = dot;
				if (dot < min2 || min2 === -1) min2 = dot;
			}

			//calculate the minimum translation vector should be negative
			if (min1 < min2) {
				interval = min2 - max1;

				normal.x = -normal.x;
				normal.y = -normal.y;
			} else {
				interval = min1 - max2;
			}

			//exit early if positive
			if (interval >= 0) {
				return false;
			}

			if (MTV === null || interval > MTV) {
				MTV = interval;
				MN = { x: normal.x, y: normal.y };
			}
		}

		//loop through the edges of Polygon 2
		for (i = 0; i < k; i++) {
			nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
			currentPoint = points2[i];

			//generate the normal for the current edge
			normal.x = -(nextPoint[1] - currentPoint[1]);
			normal.y = (nextPoint[0] - currentPoint[0]);

			//normalize the vector
			length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= length;
			normal.y /= length;

			//default min max
			min1 = min2 = -1;
			max1 = max2 = -1;

			//project all vertices from poly1 onto axis
			for (j = 0; j < l; ++j) {
				dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
				if (dot > max1 || max1 === -1) max1 = dot;
				if (dot < min1 || min1 === -1) min1 = dot;
			}

			//project all vertices from poly2 onto axis
			for (j = 0; j < k; ++j) {
				dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
				if (dot > max2 || max2 === -1) max2 = dot;
				if (dot < min2 || min2 === -1) min2 = dot;
			}

			//calculate the minimum translation vector should be negative
			if (min1 < min2) {
				interval = min2 - max1;

				normal.x = -normal.x;
				normal.y = -normal.y;
			} else {
				interval = min1 - max2;


			}

			//exit early if positive
			if (interval >= 0) {
				return false;
			}

			if (MTV === null || interval > MTV) MTV = interval;
			if (interval > MTV2 || MTV2 === null) {
				MTV2 = interval;
				MN = { x: normal.x, y: normal.y };
			}
		}

		return { overlap: MTV2, normal: MN };
	}
});
