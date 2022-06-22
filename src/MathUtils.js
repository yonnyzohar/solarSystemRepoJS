var MathUtils  = {

		fixAngle : function(angle) {
			if (angle > Math.PI * 2) {
				angle -= Math.PI * 2;
			} else if (angle < 0) {
				angle += Math.PI * 2;
			}
			return angle;
		},

		getDistance:function(p1X, p1Y, p2X, p2Y) {
			var dX = p1X - p2X;
			var dY = p1Y - p2Y;
			var dist = Math.sqrt(dX * dX + dY * dY);
			return dist;
		},

		getAngle:function(p1X, p1Y, p2X, p2Y) {
			var dX = p1X - p2X;
			var dY = p1Y - p2Y;
			return Math.atan2(dY, dX);
		},

		getVector:function(x1, y1, x2, y2)
		{
			return {x : x2 - x2, y : y2 - y1};
		},

		dotPruduct:function(vec1, vec2)
		{
			return vec1.x * vec2.x + vec1.y * vec2.y;
		},

		normalize:function(vec)
		{
			var distance = MathUtils.getDistance(vec.x, vec.y, vec.x, vec.y);
			return {
				x : vec.x / distance,
				y : vec.y / distance
			}
		}
		//var v1 = getVector();
		//var v2 = getVector();
		//var dot = dotPruduct(normalize(getVector(x1,y1,x2,y2)), normalize(getVector(x1,y1,x2,y2)))


	}
