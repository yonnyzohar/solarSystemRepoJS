/*
Open a JavaScript or TypeScript file in VS Code.
In the VS Code command palette, run the TypeScript: Select TypeScript version command.
Make sure you have Use VS Code's version selected

https://youtu.be/8MgpE2DTTKA?t=974
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
        this.loadTextures();

    }
    
    loadTextures()
    {
        var model = this.model;

        var self = this;
        var i = 0;
        const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
        var textures = ['ship',    
                        'mercury','venus', 'earth','mars','jupiter', 'saturn','sun',     
                        'uranus', 'neptune','moon0','moon1', 'moon2', 'moon3','moon4','moon5',
                        'alien1','alien2','alien3','alien4','alien5','alien6','alien7','alien8','alien0',
                        'alien9','alien10','alien11','alien12','alien13','alien14'
                        ];
        
        loader.add('assets/ta.json').load(function () {
            model.allTextures = loader.resources['assets/ta.json'].textures;
            self.onTexturesLoaded();  
            
            
        });

        /*
        for( i = 0; i < textures.length; i++)
        {
            var name = textures[i];
            loader.add(name, 'assets/'+name+'.png');
        }

    
        loader.load((loader, resources) => {
            
             resources;

           
            
        });
        */

    }
           
    onTexturesLoaded()
    {
        this.lastPlanet = null;
        this.yonny = true;
        this.spaceShips = [];
        
        this.model.initPlanets();
        
        var stage = this.stage;
        var model = this.model;
        
        
        
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
        
        
        var pool = Pool.getInstance();
        var stage = this.stage;
        var model = this.model;
        model.lightLayer.mask = model.maskLayer;//light mask is drawn on g0

		PlanetUtils.populatePlanetsARrr(model.sun, model, stage);
        /*
		for (var i = 0; i < model.allEntities.length; i++) {
			var planet = (model.allEntities[i]);
			planet.addMoons();
		}*/
		PlanetUtils.populateBGStars(model, stage);
        
		pool.init(model.allEntities.length * 100, AngledBody, "angle", function(ent){ent.reset();});
		pool.init(100, Point, "point");
        
        var obj = Utils.getMapSize(model, model.sun);
		Model.mapW = obj.w;
		Model.mapH = obj.h;
		Model.mapLeft = obj.left;
		Model.mapTop = obj.top;

		//if want to split the map up to 4 X 4
		var n = 4;
		Model.tileW = Model.mapW / Model.splitFactor;
		Model.tileH = Model.mapH / Model.splitFactor;

		model.sun.draw();

		
		//_numElements : int, _CLS:Class, type:String
		pool.init(50 * Model.numShips, Smoke, "smoke");
        this.spawnSpaceShips();
			
        new Controls(stage, model, this);
        this.assetsLoaded = true;
        
        
    }
    
    spawnSpaceShips()
    {
        var model = this.model;
        var stage = this.stage;
        //place ships randomly in spots where they dont smash into planets
		for(var i = 0; i < Model.numShips; i++)
		{
			var s = new SpaceShip(model, stage);
			var found = false;
			while(!found)
			{
                var colliding = false;
				var _x = Math.random() * Model.mapW + Model.mapLeft;
				var _y = Math.random() * Model.mapH + Model.mapTop;
                
                var col = Math.floor((_x - Model.mapLeft) / Model.tileW);
			    var row = Math.floor((_y - Model.mapTop) / Model.tileH);
                var iter = 5;
                var numChecks = 0;
			
                for(var r = -iter; r < iter; r++)
                {
                    for(var c = -iter; c < iter; c++)
                    {
                        var name = (row+r) + "_" + (col+c);
                        var block = Model.partition[name];
                        if(block)
                        {
                            for(var k in block)
                            {
                                if(block[k].isPlanet)
                                {
                                    var p = block[k];
                                    var rad = p.radius;
                                    var d = MathUtils.getDistance(_x, _y, p.x, p.y);
                                    numChecks++;
                                    if(d < rad + s.radius)
                                    {
                                        colliding = true;
                                        break;
                                    }
                                    else
                                    {
                                        trace("not colliding with " + p.name);
                                    }
                                }
                            }
                        }
                    }
                }
                if(!colliding)
                {
                    s.x =  _x;
                    s.y =  _y;
                    trace("placing ship at " + s.x + " " + s.y + " after " + numChecks + " checks");
				    model.allEntities.push(s);
				    this.spaceShips.push(s);
				    found = true;
                }
 
			}
		}
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
			if (model.currZoom <= model.minZoom) {
				model.currZoom =model.minZoom;
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
				model.txt.text = p.name.toUpperCase();
				model.moonsTxt.text = "";
				if(p.isPlanet)
				{
					if (p.numMoons) {
						model.moonsTxt.text = (p.numMoons) + " Moons";
					}

				}
				Utils.setFollow(p, true, stage, model);
			}
		}
	}

	///////////////////////////---- controls -----/////////
	update(dt) {
        if(!this.assetsLoaded)
        {
           return;
        }
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
			//this.yonny = false;
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

			//this.drawTiles();
			 
			for(var i = 0; i < spaceShips.length; i++)
			{
				var s = spaceShips[i];
				s.draw();
			}
			model.sun.draw();
            Utils.update(dt);
		}
        
	}
    
	drawTiles()
	{
        var model = this.model;
        var stage = this.stage;
        var g = model.debugLayer.graphics;
		g.clear();
		g.lineStyle(0.1, 0x000000);

		for(var k in Model.partition)
		{
			var obj = Model.partition[k];
			if(obj.numPlanets > 0)
			{
				var row = obj.row;
				var col = obj.col;
				var color = obj.color;
				g.beginFill(color, 1);
				g.drawRect((col * Model.tileW) + Model.mapLeft, (row * Model.tileH) + Model.mapTop, Model.tileW , Model.tileH );
				g.endFill();
			}
		}
	}
}