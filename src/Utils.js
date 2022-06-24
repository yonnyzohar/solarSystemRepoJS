var Utils = {
        _updateables : new WeakMap(),
		getSpeed:function(isMoon = false) {
			var speed = (Math.random() * 0.005) + 0.001;
			if (isMoon) {
				speed += (Math.random() * 0.05) + 0.01;
			}
			return speed;
		},

		duplicate:function(o) {
			var newO = {};
			for (var k in o) {
				newO[k] = o[k];
			}
			return newO;
		},
	

		setFollow:function(p, firstTime, stage,model) {
			var l = model.layers[1];
			var i = 0;
			for (i = 0; i < model.layers.length; i++) {
				l = model.layers[i];
				var fX = 0;
				var fY = 0;

				fX -= (p.x * model.currZoom);
				fY -= (p.y * model.currZoom);
				fX += (stage.stageWidth / 2); //
				fY += (stage.stageHeight / 2); //
				if(p.isPlanet)
				{
					p.showOrbit = true;
				}
				model.tweenTo = {
					planet: p,
					x: fX,
					y: fY,
					firstTime: firstTime
				};
			}
		},

		isInScreen:function(p1X, p1Y, layers, _stage) {
			var l = layers[1];
			var pool = Pool.getInstance();
			var point = pool.get("point");
			point.x = p1X;
			point.y = p1Y;
			var localPos = l.toGlobal(point);
			pool.putBack(point, "point");
			var w = _stage.stageWidth;
			var h = _stage.stageHeight;
			if (localPos.x > 0 && localPos.x < w && localPos.y > 0 && localPos.y < h) {
				return true;
			} else {
				return false;
			}

		},
	
		

		printObj:function(obj) {
			var str = "left " + obj.left + " right " + obj.right + " dist " + obj.dist ;
			return str;
		},

		getMapSize:function(model, center) {
			var left = 100000000;
			var right = -100000000;
			var top = 1000000000;
			var btm = -1000000000;

			for (var i = 0; i < model.allPlanets.length; i++) {
				var e = model.allPlanets[i];
				//trace(e.x);
				if (e.x < left) {
					left = e.x;
				}
				if (e.x > right) {
					right = e.x;
				}
				if (e.y < top) {
					top = e.y;
				}
				if (e.y > btm) {
					btm = e.y;
				}
			}

			var lr = Math.max(Math.abs(left), right);
			var ud = Math.max(Math.abs(top), btm);
			var m = Math.max(lr,ud );


			var t = Math.floor(center.y - m);
			var b = Math.floor(center.y + m);

			var l = Math.floor(center.x - m);
			var r = Math.floor(center.x + m);

			return {
				left: l,
				right: r,
				top: t,
				btm: b,
				w: Math.floor(r - l),
				h: Math.floor(b - t)
			};
		},
        update:function(dt)
        {
            for(var k in Utils._updateables)
            {
                Utils._updateables[k].update(dt)
            }
        },
        addUpdateable:function(name, instance)
        {
            Utils._updateables[name] = instance;
        },

        removeUpdateable:function(name, instance)
        {
            delete Utils._updateables[name];
        }
	}

//