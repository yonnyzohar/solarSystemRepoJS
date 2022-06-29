
	class Star extends Planet {

		

		constructor(_model, _stage) {
			super(_model, _stage);
            this.isStar = true;
              this.lightRad;
		      this.pool = Pool.getInstance();
		}

		draw(parentObj = null) {
			super.draw(parentObj);
            var pool = Pool.getInstance();
			pool.clear("angle");
			this.handleLight();
		}
        
        addMC()
         {
             var radius = this.radius;
            var tex = this.model.allTextures["sun"];
            this.mc = new PIXI.Sprite(tex);

            var hW = this.mc.width / 2;
            var diff = hW / radius;
            this.mc.scale.x /= diff;
            this.mc.scale.y /= diff;

            this.mc.anchor.set(0.5);
            this.model.planetLayer.addChild(this.mc);
         }

		

		handleLight() {

			var model = this.model;
            var stage = this.stage;
            var light_rings = this.light_rings;
            var color = this.color;
            var lightRad = this.lightRad;
            var x = this.x;
            var y = this.y;
            var graphics = model.lightLayer.graphics;
            
			graphics.clear();
			var light_rings = 10;

			for (var i = 0; i < light_rings; i++) {
				var per = i / light_rings;
				if (i != light_rings - 1) {
					graphics.beginFill(color,.05); //
					graphics.drawCircle(x, y, lightRad * per);
					graphics.endFill();
				}
			}		

			

			var lightLineThickness = 6;
			

			//model.g0.lineStyle(lightLineThickness, color, 0.4);
			var angles =[];

			//
			this.gatherAllPlanetPositions(angles, model.allEntities, true);
			//trace("angles before manipulations " + angles.length );

			var emptypSpaces = [];
			//sort the array and fix it to contain the accurate gaps so none are overlapping
			angles = this.addEntry1(angles, emptypSpaces);
			//trace("angles after manipulations " + angles.length );

			this.sendBeams(angles,  lightLineThickness,  false);


			//then emit to empty space
			this.sendBeams(emptypSpaces, lightLineThickness, true)
		}

		gatherAllPlanetPositions(angles, allEntities , topHeirarchy = false) {
            var pool = Pool.getInstance();
            var model = this.model;
            var stage = this.stage;
            var light_rings = this.light_rings;
            var color = this.color;
            var lightRad = this.lightRad;
            var x = this.x;
            var y = this.y;
			var p;
			//trace("gatherAllPlanetPositions " + allEntities.length );
			for (var j = 0; j < allEntities.length; j++) {
				p = allEntities[j];
				//trace("checking " +  p.name);

				if (p == this) {
					//trace("skipping " +  name);
					continue;
				}


				//go over all planets and get their angle to the sun
				//get center angle, angle from left side and angle from right side
				//we need to t figure out if they are blocking planets behind them
				var centerAngleToSun = MathUtils.fixAngle(MathUtils.getAngle(p.x, p.y, x, y));
				//trace("shit " + x + " " +  y + " " +  p.x + " " +  p.y);
				var distanceToSun = MathUtils.getDistance(x, y, p.x, p.y);
				//trace("distanceToSun " + distanceToSun + " lightRad " + lightRad);
				if (distanceToSun < lightRad) {
					var leftAngle = centerAngleToSun + (Math.PI / 2);
					var leftPointX = (Math.cos(leftAngle) * p.radius) + p.x;
					var leftPointY = (Math.sin(leftAngle) * p.radius) + p.y;

					//drawCircle(leftPointX, leftPointY, 2);

					var rightAngleToSun = MathUtils.fixAngle(MathUtils.getAngle(leftPointX, leftPointY, x, y));

					var rigtAngle = centerAngleToSun - (Math.PI / 2);
					var rightPointX = (Math.cos(rigtAngle) * p.radius) + p.x;
					var rightPointY = (Math.sin(rigtAngle) * p.radius) + p.y;

					//drawCircle(rightPointX, rightPointY, 2);

					var leftAngleToSun = MathUtils.fixAngle(MathUtils.getAngle(rightPointX, rightPointY, x, y));

					if (leftAngleToSun > rightAngleToSun) {
						rightAngleToSun += (Math.PI * 2);
					}


					//trace(leftAngleToSun + " " +  centerAngleToSun + " " +  rightAngleToSun);

					var obj = pool.get("angle");
					obj.left =  Math.min(leftAngleToSun, rightAngleToSun);
					obj.right= Math.max(leftAngleToSun, rightAngleToSun);
					obj.dist= Math.floor(distanceToSun);
					

					//addEntry(obj, angles)
					//trace("adding angle object");
					angles.push(obj);
				}

				//if (p is Planet && Planet(p).orbitingPlanets) {
					//trace("has moons");
					//gatherAllPlanetPositions(angles, Planet(p).orbitingPlanets, false);
				//}
			}
		}
        
        findBiggestRight(arr) {
			var big = 0;
			var element = null;
            if( arr)
            {
               for (var i = arr.length - 1; i >= 0; i--) {
				var g = arr[i];

                    if (g.right > big) {
                        element = g;
                        big = g.right;
                    }
			     }
            }
			
			return element;
		}

		//now that we have all angles to the sun we need to fix them so none are overlapping
		//some may encapsulte others
		//others may combine to larger gaps
		//once we have this complete list we know how far to draw each ray of the sun
		//if we've made alterations to the array we need to do the algorithm again until we havs the 
		//accurate gaps array

		addEntry1(arr, empties) {
            var pool = Pool.getInstance();
            var model = this.model;
            var stage = this.stage;
            var light_rings = this.light_rings;
            var color = this.color;
            var lightRad = this.lightRad;
            var x = this.x;
            var y = this.y;
			// this fort function sorts the array of planes angles into clusters. each cluster
			//meaning planets are touching each other
			//trace("addEntry1 " +  arr.length );
            
            arr.sort(function compare(a, b) 
            {
              if (a.left > b.left) return 1;
              if (b.left > a.left) return -1;

              return 0;
            });

			var i = 0;
			//fill array with clusters
			var arrNum = -1;
			var bigArr = [];
			var currMax = 0;
			var currMin = 0;
			var currP;
			var h = 0;
			var obj;

			for (i = 0; i < arr.length; i++) {
				currP = arr[i];
				var useNewArr = true;

				if (i == 0) {
					currMin = currP.left;
					currMax = currP.right;
				}

				//this means we have hit a new cluster
				if (currP.left > currMax) {
					bigArr.push([]);
					arrNum++;
					bigArr[arrNum].push(currP);
					currMin = currP.left;
					currMax = currP.right;
				} else {
					if (arrNum == -1) {
						arrNum = 0;
						bigArr[arrNum] = [];
					}
					bigArr[arrNum].push(currP);
					if (currP.right > currMax) {
						currMax = currP.right;
					}
				}
			}
			
			//trace("before manipulations");
			
			for ( h = 0; h < bigArr.length; h++)
			{
				var a = bigArr[h];
				for (i = 0; i < a.length; i++)
				{
					var pp = a[i];
					//trace(h + " debug l " + pp.left + " r " + pp.right +  " d " + pp.dist);
				}
			}/**/

			//trace("fixing pverboard");
			//see if we went overboard
			//since 360 degress wraps around back to 0 we needs to make sure a planet that goes overboard from the last cluster
			//does not interfiere with cluster 0
			var smallestLeft = 0;
			//trace("bigArr " + bigArr.length);
			var lastArr = bigArr[bigArr.length - 1];
			
			var lastElement = this.findBiggestRight(lastArr);
			if (lastElement && lastElement.right > (Math.PI * 2)) {
                
                var r = lastElement.right - (Math.PI * 2);
                obj = pool.get("angle");
				obj.left =  0;
				obj.right= r;
				obj.dist= lastElement.dist;
                
                var firstElement = bigArr[0][0];
                
                //if the new element is touching the first element in clister 0, add it
                //else we need a new cluster
                if(r > firstElement.left)
                {
                   bigArr[0].unshift(obj);
                }
                else
                {
                    var newArr = [obj];
                    bigArr.unshift(newArr);
                }

                var index = lastArr.indexOf(lastElement);
                lastArr.splice(index,1);
                
                obj = pool.get("angle");
				obj.left =  lastElement.left;
				obj.right= (Math.PI * 2);
				obj.dist= lastElement.dist;
                bigArr[bigArr.length - 1].push(obj);
                /*
				var r = lastElement.right - (Math.PI * 2);
				//trace("lastElement l " + lastElement.left + " r " +  r +  " d " + lastElement.dist);
				for ( i = 0; i < bigArr[0].length; i++) {
					var element = bigArr[0][i];
					//trace("	element l " + element.left + " r " + element.right+ " d " + element.dist);
					if (element != lastElement && element.left > r) {
						//trace("		element left is bigger than last right");
                        obj = pool.get("angle");
				        obj.left =  0;
				        obj.right= r;
				        obj.dist= lastElement.dist;

				        bigArr[0].unshift(obj);
						break;
					}
					if (element.right < r) {
						//trace("		element right is smaller than last right");
						if (element.dist > lastElement.dist){
							//trace("		element is farther");
							bigArr[0].splice(i, 1);
							if (bigArr[0].length == 0) {
								bigArr.shift();
								break;
							}
						} else {
							//element is closer
							var index = Math.max(i - 1, 0);
							//trace("		element is closer");

				            obj = pool.get("angle");
							obj.left =  smallestLeft;
							obj.right= element.left;
							obj.dist= lastElement.dist;

							bigArr[0].unshift(obj);
							smallestLeft = element.right;
							i++; //to not get stick in a loop i guess
						}
					} else {
						//current element is bigger than 
						if (element.dist < lastElement.dist) {

							obj = pool.get("angle");
							obj.left =  smallestLeft;
							obj.right= element.left;
							obj.dist= lastElement.dist;


							bigArr[0].unshift(obj);
						} else {

							obj = pool.get("angle");
							obj.left =  smallestLeft;
							obj.right= r;
							obj.dist= lastElement.dist;

							bigArr[0].unshift(obj);
							element.left = r;
						}
						break;
					}

				}*/

			}
			//trace("sanity check");
			for ( h = 0; h < bigArr.length; h++)
			{
				var a = bigArr[h];
				for (i = 0; i < a.length; i++)
				{
					var pp = a[i];
					//trace(h + " debug l " + pp.left + " r "+ pp.right +  " d " + pp.dist);
				}
			}/**/

			//now that the list is sorted into clusters we can begin to sort out who is blocking whom
			//we construct a new list which takes blockins into account
            //it's important we call this twice because the first run does not promise a perfect result
            var tmp1 = this.handleRecursion(bigArr);
			var tmp  = this.handleRecursion(tmp1);

			//trace("bob");
			var res = [];
			for (var b = 0; b < tmp.length; b++) {
				var a = tmp[b];
				for (var i = 0; i < a.length; i++) {
					var pp = a[i];
					res.push(pp);
					//trace("l " + pp.left + " r "+ pp.right+ " d "+pp.dist);
				}

			}
			//trace("--");

			//now do empties
			var o;
			for (h = 0; h < tmp.length; h++) {
				//trace("h " + h);
				var a = tmp[h];
				if (h == 0) 
				{
					if (a[0].left != 0) 
					{

						o = pool.get("angle");
						o.left  =  0;
						o.right = a[0].left;
						o.dist  = lightRad;

						
						empties.push(o);

						o = pool.get("angle");
						o.left =  a[a.length - 1].right;
						o.dist = lightRad;

					} else {
						o = pool.get("angle");
						o.left =  a[a.length - 1].right;
						o.dist = lightRad;
					}

				} 
				else 
				{
					o.right = a[0].left;
					empties.push(o);

					o = pool.get("angle");
					o.left =  a[a.length - 1].right;
					o.dist = lightRad;
				}

				if (h == tmp.length - 1) {
					//trace("added last one!");
					o.right = Math.PI * 2;
					empties.push(o);
				}
				
			}

			
			//trace("output");
			var res = [];
			for (var b = 0; b < tmp.length; b++) {
				var a = tmp[b];
				for (var i = 0; i < a.length; i++) {
					var pp = a[i];
					res.push(pp);
					//trace("l " + pp.left + " r " +  pp.right +  " d " + pp.dist);
				}

			}

			return res;
		}
        
        handleRecursion(bigArr)
        {
            var pool = Pool.getInstance();
            var model = this.model;
            var stage = this.stage;
            var changesMade = false;
            var obj;
            var tmp = [];
            var currP;
			//now sort the clusters 
			for (var h = 0; h < bigArr.length; h++) {
				tmp[h] = [];
				var a = bigArr[h];
				obj = pool.get("angle");
				obj.left =  a[0].left;
				obj.right= a[0].right;
				obj.dist = a[0].dist;

				for (var  i = 1; i < a.length; i++) {
					currP = a[i];

					//if obj is closer
					if (obj.dist < currP.dist) {
						//trace("obj "+Utils.printObj(obj)+" is closer than currP "+Utils.printObj(currP));
						//if obj ends before curr
						if (obj.right < currP.right) {
							//trace("	obj "+Utils.printObj(obj)+" right is less than currP right "+Utils.printObj(currP));
							obj.added = true;
							var r = obj.right;
							tmp[h].push(obj);
							obj = pool.get("angle");
                            changesMade = true;
							obj.left =  r;
							obj.right= currP.right;
							obj.dist= currP.dist;
							//trace("1 "+Utils.printObj(obj));
							
						}
						if (obj.right >= currP.right) {
							//do nothing
						}
					} else {
						//trace("obj "+Utils.printObj(obj)+" is farther than currP "+Utils.printObj(currP));
						//obj is farther away
						//end obj at left 
						if (obj.right < currP.right) {
                            
                            
                            //trace("	obj "+Utils.printObj(obj)+" right is less than currP right "+Utils.printObj(currP));
                                //if obj is farther
                            obj.right = currP.left;
                            obj.added = true;
                            tmp[h].push(obj);
                            changesMade = true;
                            //trace("2 "+Utils.printObj(obj));

                            obj = pool.get("angle");
                            obj.left =  currP.left;
                            obj.right= currP.right;
                            obj.dist= currP.dist;
                            //trace("3 "+Utils.printObj(obj));
							
						} else if (obj.right >= currP.right) {
							//trace("	obj "+Utils.printObj(obj)+" right is more than currP right "+Utils.printObj(currP));
							
							var l = obj.left;
							var r = obj.right;
							var d = obj.dist;
							var orig =  pool.get("angle");
							orig.left= l;
							orig.right= r;
							orig.dist= d;
							
							obj.right = currP.left;
							obj.added = true;
							tmp[h].push(obj);
							//trace("4 "+Utils.printObj(obj));

							obj = pool.get("angle");
							obj.left =  currP.left;
							obj.right= currP.right;
							obj.dist= currP.dist;
							obj.added = true;
                            changesMade = true;
							
							tmp[h].push(obj);
							//trace("5 "+Utils.printObj(obj));

							obj = pool.get("angle");
							obj.left =  currP.right;
							obj.right= orig.right;
							obj.dist= orig.dist;
							//trace("6 "+Utils.printObj(obj));
						}
					}
				}
				if (obj.added != true) {
					tmp[h].push(obj);
				}
			}

            return tmp;
        }

		sendBeams(angles,  lightLineThickness, isEmpty) {
            var pool = Pool.getInstance();
            var model = this.model;
            var stage = this.stage;
            var light_rings = this.light_rings;
            var color = this.color;
            var lightRad = this.lightRad;
            var x = this.x;
            var y = this.y;
			var baseLen = this.radius;
			var a;
            var maskLayerGraphics = model.maskLayer.graphics;

			maskLayerGraphics.lineStyle(0, color, 1); //per * 0.6

			//first emit to all the planets
			//trace(angles.length);
			for (var h = 0; h < angles.length; h++) {
				a = angles[h];
				if (a) {
					maskLayerGraphics.moveTo(x, y);
					maskLayerGraphics.beginFill(color);


					var cos = Math.cos(a.left);
					var sin = Math.sin(a.left);
					var dpX = x + cos * a.dist; //+ lightLineThickness)
					var dpY = y + sin * a.dist; //+ lightLineThickness
					maskLayerGraphics.lineTo(dpX, dpY);
					

					if (isEmpty) {
						//trace("empty left " + a.left +  " right " + a.right);

						var pers = [0.25, 0.5, 0.75];
						for (var i = 0; i < pers.length; i++) {
							var midAngle = a.left + ((a.right - a.left) * pers[i]);
							//trace(midAngle);
							cos = Math.cos(midAngle);
							sin = Math.sin(midAngle);
							dpX = x + cos * a.dist; //+ lightLineThickness)
							dpY = y + sin * a.dist; //+ lightLineThickness
							maskLayerGraphics.lineTo(dpX, dpY);
						}

					}

					cos = Math.cos(a.right);
					sin = Math.sin(a.right);
					dpX = x + cos * a.dist; //+ lightLineThickness)
					dpY = y + sin * a.dist; //+ lightLineThickness
					maskLayerGraphics.lineTo(dpX, dpY);

					maskLayerGraphics.lineTo(x, y);
					maskLayerGraphics.endFill();

					

				}
			}
		}
	}



