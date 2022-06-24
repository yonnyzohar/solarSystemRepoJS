/*
Open a JavaScript or TypeScript file in VS Code.
In the VS Code command palette, run the TypeScript: Select TypeScript version command.
Make sure you have Use VS Code's version selected


*/


class Main{
    
    constructor(app) {
        app.stage.stageWidth = app.screen.width;
        app.stage.stageHeight = app.screen.height;
        app.stage.interactive = true;
        //app.stage.on()
        
        this.stage = app.stage;
        //this.gameHolder

        this.model = new Model(this.stage);
        this.lastPlanet = null;
        this.yonny = true;
        this.spaceShips = [];
        this.mouseCounter =0;
        
        var stage = this.stage;
        var model = this.model;
        this.start = {};
        
        
        var pool = Pool.getInstance();
       
		for (var i = 0; i < model.layers.length; i++) 
		{
			var l = model.layers[i];//: Sprite
			stage.addChild(l);
			//l.mouseChildren = false;
			//l.mouseEnabled = false;
		}
        
        var params = {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'};
        model.txt = new PIXI.Text('',params);
        stage.addChild(model.txt);
        model.moonsTxt = new PIXI.Text('',params);
        stage.addChild(model.moonsTxt );
        model.moonsTxt.y = 50;

		
		model.lightLayer.mask = model.maskLayer;//light mask is drawn on g0

		PlanetUtils.populatePlanetsARrr(model.sun, model, stage);

		for (var i = 0; i < model.allPlanets.length; i++) {
			var planet = (model.allPlanets[i]);
			planet.addMoons();
		}
		PlanetUtils.populateBGStars(model, stage);
        
		pool.init(model.allPlanets.length * 50, AngledBody, "angle", function(ent){ent.reset();});
		pool.init(100, Point, "point");

		model.sun.draw();

		var obj = Utils.getMapSize(model, model.sun);
		Model.mapW = obj.w;
		Model.mapH = obj.h;
		Model.mapLeft = obj.left;
		Model.mapTop = obj.top;

		//if want to split the map up to 4 X 4
		var n = 4;
		Model.tileW = Model.mapW / n;
		Model.tileH = Model.mapH / n;

		

		PlanetUtils.createPartition(model, Model.mapLeft, Model.mapTop);

		//_numElements : int, _CLS:Class, type:String
		pool.init(50 * Model.numShips, Smoke, "smoke");
			
		//place ships randomly in spots where they dont smash into planets
		for(var i = 0; i < Model.numShips; i++)
		{
			var s = new SpaceShip(model, stage);
			var found = false;
			while(!found)
			{
				var _x = Math.random() * Model.mapW + Model.mapLeft;
				var _y = Math.random() * Model.mapH + Model.mapTop;
				for(var j = 0; j < model.allPlanets.length; j++)
				{
					if(model.allPlanets[j].isPlanet)
					{
						var p = (model.allPlanets[j]);
						var rad = p.radius;
						var d = MathUtils.getDistance(_x, _y, p.x, p.y);
						if(d > rad + s.radius)
						{
							s.x =  _x;
							s.y =  _y;
							model.allPlanets.push(s);
							this.spaceShips.push(s);
							found = true;
							break;
						}

					}
				}
			}
		}
        /**/
        
        
        var self = this;
        window.onmousemove  = function(event) {
            event.preventDefault();
            //trace("onmousemove " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
        }
        window.ontouchmove = function(event) {
            event.preventDefault();
            
            if (event.touches.length === 2) {

                const deltaDistance = self.distance(event);
                const deltaX = (event.touches[0].pageX + event.touches[1].pageX) / 2; // x2 for accelarated movement
                const deltaY = (event.touches[0].pageY + event.touches[1].pageY) / 2 ; // x2 for accelarated movement
                stage.mouseX = deltaX;
                stage.mouseY = deltaY;
                trace("move 2 " + 
                      "x0 " + event.touches[0].pageX + 
                      " x1 " + event.touches[1].pageX + 
                      " y0 " +  event.touches[0].pageY + 
                      " y1 " + event.touches[1].pageY +
                      " midx " + deltaX + 
                      " midy " + deltaY
                    );
                
                var dif = Math.abs(deltaDistance - self.prevDist);
                if(dif > 1)
                   {
                       if(deltaDistance > self.prevDist)
                        {
                           self.zooom(1);
                        }
                        else if(self.prevDist > deltaDistance)
                        {
                            self.zooom(-1);   
                        }
                   }
                
                
                self.prevDist = deltaDistance;
            }
            else
            {
                var clientX = event.touches[0].pageX;
                var clientY = event.touches[0].pageY;
                
                trace("move 1 " + clientX + " " + clientY);
            
                // trace("ontouchmove " , clientX, clientY);
                stage.mouseX = clientX;
                stage.mouseY = clientY;
            }

            
            
        }
        window.onmousedown =  function(event)
        {
            event.preventDefault();
            //trace("onmousedown " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            self.onDown(event)
        }
         window.ontouchstart = function(event)
        {
            event.preventDefault();
             
            if (event.touches.length === 2) {

                self.start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                self.start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                self.start.distance = self.distance(event);
                
                trace("ontouchstart 2 " + self.start.x+" "+ self.start.y);
                
                stage.mouseX = self.start.x;
                stage.mouseY = self.start.y;
                self.prevDist = self.distance(event);
            }
            else
            {
                var clientX = event.touches[0].pageX;
                var clientY = event.touches[0].pageY;
                trace("ontouchstart 1 " + clientX+" "+ clientY);
                stage.mouseX = clientX;
                stage.mouseY = clientY;
                self.onDown(event);
            }
        }
        window.onmouseup = function(event)
        {
            event.preventDefault();
            //trace("onmouseup " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            self.onUp(event)
        }
        window.ontouchend = function(event)
        {
            event.preventDefault();
            self.onUp(event)
        }
        window.addEventListener("wheel", event => {
            
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            const delta = (event.deltaY);
            //trace(delta);
            self.zooom(delta * -1);
        });
    }
    
    distance(event){
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    }

	zooom(delta) {
        var pool = Pool.getInstance();
        var model = this.model;
        var stage = this.stage;
		var l = model.layers[1];
		var point = pool.get("point");
		point.x = stage.mouseX;
		point.y = stage.mouseY;
		//this is the mouse position at current scale inside 
		var localPosPre = l.toLocal(point);
		pool.putBack(point, "point");
		//drawCircle(localPosPre.x, localPosPre.y, 10, 0x00cc00);
		var proceed = true;
		if (delta > 0) {
			model.currZoom += model.zoomAmount;
		} else if (delta < 0) {
			model.currZoom -= model.zoomAmount;
			if (model.currZoom <= 0.1) {
				model.currZoom = 0.1;
				proceed = false;
			}
		}

		//txt.text = String(event.delta);

		if (!proceed) {
			return;
		}


		var i = 0;


		for (i = 0; i < model.layers.length; i++) {
			l = model.layers[i];

			if (i != 0) {
				l.scale.x = model.currZoom;
				l.scale.y = model.currZoom;
			}
		}


		for (i = 0; i < model.layers.length; i++) {
			l = model.layers[i];

			if (i != 0) {
				l.x = stage.mouseX- (localPosPre.x * model.currZoom);
				l.y = stage.mouseY- (localPosPre.y * model.currZoom);
			}
		}

	}
    
    releaseTween()
	{
        var model = this.model;
        
		if (model.tweenTo) {
			if(model.tweenTo.planet.isPlanet)
			{
				model.tweenTo.planet.showOrbit = false;
			}
			model.tweenTo = null;
			model.txt.text = "";
			model.moonsTxt.text = "";
			return true;
		}
		return false;
	}

		

	onDown(event) {

        var model = this.model;
        var stage = this.stage;
		this.mouseCounter = 0;
		var l = model.layers[1];
		//this is the offset in origin coords, at scale 1
		model.offsetX = (stage.mouseX - l.x) / model.currZoom;
		model.offsetY = (stage.mouseY - l.y) / model.currZoom;
		model.mouseDown = true;

		
	}

	onUp(event) {

        var model = this.model;
        var stage = this.stage;
		model.mouseDown = false;
        var pool = Pool.getInstance();
		this.releaseTween();
       
		if(this.mouseCounter < 10)
		{
			var l = model.layers[1];
			var point = pool.get("point");
			point.x = stage.mouseX;
			point.y = stage.mouseY;
			var localPos = l.toLocal(point);
			pool.putBack(point, "point");
            model.txt.text = "";
            model.moonsTxt.text = "";
			var p = PlanetUtils.findNearestPlanet(model, localPos.x, localPos.y);
			if (p) {
				model.txt.text = p.name;
				model.moonsTxt.text = "";
				if(p.isPlanet)
				{
					if (p.numMoons) {
						model.moonsTxt.text = (p.numMoons) + " Moons";
					}

				}
				
				//spaceShip.moveTo(p);

				Utils.setFollow(p, true, stage, model);
			}
		}
	}



	///////////////////////////---- controls -----/////////
	

	update(dt) {
     
        var pool = Pool.getInstance();
        var model = this.model;
        var stage = this.stage;
		var i = 0;
		var l;
		this.mouseCounter++;
		

		if (model.tweenTo != null) {

			if (model.tweenTo.firstTime) {
				l = model.layers[1];
				var dX = ((model.tweenTo.x - l.x) / 2);
				var dY = ((model.tweenTo.y - l.y) / 2);

				for (i = 0; i < model.layers.length; i++) {
					l = model.layers[i];
					if (i != 0) {

						l.x += dX;
						l.y += dY;

					}
				}

				if (MathUtils.getDistance(l.x, l.y, model.tweenTo.x, model.tweenTo.y) < 0.5) {
					Utils.setFollow(model.tweenTo.planet, false, stage, model);
				}


			} else {
				var fX = 0;
				var fY = 0;

				fX -= (model.tweenTo.planet.x * model.currZoom);
				fY -= (model.tweenTo.planet.y * model.currZoom);
				fX += (stage.stageWidth / 2); //
				fY += (stage.stageHeight / 2); //
				for (i = 0; i < model.layers.length; i++) {
					l = model.layers[i];
					if (i != 0) {

						l.x = fX;
						l.y = fY;
					}
				}
			}

		} else {
			if (model.mouseDown) {
				var l = model.layers[1];
				//this is absolute position in scene, scaled
				var newX = stage.mouseX - (model.offsetX * model.currZoom);
				var newY = stage.mouseY - (model.offsetY * model.currZoom);
				for (i = 0; i < model.layers.length; i++) {
					l = model.layers[i];
					if (i != 0) {
						l.x = newX;
						l.y = newY;
					}
				}

				model.prevX = l.x;
				model.prevY = l.y;


			} else {
				
				var l = model.layers[1];
				var point = pool.get("point");
				point.x = stage.mouseX;
				point.y = stage.mouseY;

				var localPos = l.toLocal(point);
				pool.putBack(point, "point");
				var p = PlanetUtils.findNearestPlanet(model, localPos.x, localPos.y);
				if (p && p != this.lastPlanet) {
                    
					model.txt.text = p.name;
					model.moonsTxt.text = "";
                    
					if(p.isPlanet)
					{
						if (p.numMoons) {
							model.moonsTxt.text = (p.numMoons) + " Moons";
						}
					}
					
					
				} else {
					if (p == null && this.lastPlanet != null) {
						model.txt.text = "";
						model.moonsTxt.text = "";
					}

				}

				this.lastPlanet = p;
			}
		}

		if (this.yonny) 
		{
			//trace("");
			//yonny = false;
			var model = this.model;
            var stage = this.stage;
            var maskLayerGraphics = model.maskLayer.graphics;
			maskLayerGraphics.clear();
            
            var planetLayerGraphics = model.planetLayer.graphics;
            
			planetLayerGraphics.lineStyle(0.1, 0x000000);
			planetLayerGraphics.clear();
            
            var planetLayerGraphics = model.planetLayer.graphics;
            
			planetLayerGraphics.clear();
			planetLayerGraphics.lineStyle(0.1, 0x000000);
            var spaceShips = this.spaceShips;

			//drawTiles();
			 
			for(var i = 0; i < spaceShips.length; i++)
			{
				var s = spaceShips[i];
				s.draw();
			}
			model.sun.draw();
			//stage.removeEventListener(Event.ENTER_FRAME, update);
			//

			
			
		}
        Utils.update(dt);
        
        
	}
    
    

	drawTiles()
	{
        var model = this.model;
        var stage = this.stage;
		model.dg.clear();
		model.dg.lineStyle(0.1, 0x000000);

		for(var k in Model.partition)
		{
			var obj = Model.partition[k];
			if(obj.numPlanets > 0)
			{
				var row = obj.row;
				var col = obj.col;
				var color = obj.color;
				//trace("color", color);
				model.dg.beginFill(color, 1);
				model.dg.drawRect((col * Model.tileW) + Model.mapLeft, (row * Model.tileH) + Model.mapTop, Model.tileW , Model.tileH );
				model.dg.endFill();
			}
			
		}
	}
   /* */
}

