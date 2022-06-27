class SpaceShip extends Entity
{

    constructor(_model, _stage) 
    {
        super(_model, _stage);
        
        
        
        this.attachedPlanet;
        this.moveObj;
        this.distanceFromParent;
        this.currPlanet;
        this.mc;
        this.smokePool = Pool.getInstance();
        this.smokeCounter = 0;
        this.gotMyAngle = false;
    	this.color = 0xffffff * Math.random();
    	this.radius = 15;
    	this.speed = 5;
    	this.mc = new PIXI.Sprite(this.model.allTextures["ship"].texture);
        
        this.mc.anchor.set(0.5);
       
        this.setMcPos(this.x, this.y);
    	
    	this.model.planetLayer.addChild(this.mc);
        
    	//this.mc.fireMC.visible = false;

    	this.findTarget(true);
    	this.name = "ship" + SpaceShip.COUNT;
    	SpaceShip.COUNT++;
        /**/

    }
    
    setMcPos(_x, _y)
    {
        this.mc.x = _x ;
    	this.mc.y = _y;
    }

	findTarget(immidiate = false)
	{
        var model = this.model;
		var time = Math.random() * 15;
		time += 2;
		time *= 1000;
		if(immidiate)
		{
			time = 0;
		}

		setTimeout(function()
		{
			var found = false;
			while(!found)
			{
				var rnd = Math.floor(Math.random() * model.allPlanets.length);
				if(model.allPlanets[rnd].isPlanet)
				{
					var p = (model.allPlanets[rnd]);
					if(this.currPlanet != p)
					{
						if(!p.isMoon)
						{
							this.moveTo(p);
							found = true;
							return;
						}
						
					}
				}
			}
        }.bind(this), time);
	}

	moveTo(p)
	{
		//trace("going to " + p.name);
		this.smokeCounter = 0;
		var w = p.x - this.x;
		var h = p.y - this.y;
		var distance = MathUtils.getDistance(this.x, this.y, p.x, p.y);
		var vx = w / this.distance;
		var vy = h / this.distance;
		this.currPlanet = null;
		//this.mc.fireMC.visible = true;
		this.moveObj = {
			destX: p.x,
			destY: p.y,
			vx : vx,
			vy : vy,
			radius : p.radius,
			p : p

		};
	}

	draw(parentObj = null) {
		super.draw(parentObj);
		
		var i;
		var j;
		this.gotMyAngle = false;
		var vis = false;
        var x = this.x;
        var y = this.y;
        var radius = this.radius;
        var model = this.model;
        var stage = this.stage;
        var speed = this.speed;
        var mc = this.mc;
        
       // model.planetLayer.graphics.beginFill(this.color, 1);
        

		if(Utils.isInScreen(x, y, model.layers, stage) ||
			Utils.isInScreen(x + radius, y, model.layers, stage) ||
			Utils.isInScreen(x - radius, y, model.layers, stage) ||
			Utils.isInScreen(x, y + radius, model.layers, stage) ||
			Utils.isInScreen(x, y - radius, model.layers, stage)
			)
		{
			vis = true;
			mc.visible = true;
		}
		else{
			mc.visible = false;
		}
        
        //trace(mc.visible);


		if(this.moveObj)
		{
			this.smokeCounter++;
			var myP = this.moveObj.p;
			var w = myP.x - x;
			var h = myP.y - y;
			var distance = MathUtils.getDistance(x, y, myP.x, myP.y);
			var orbit = (myP.radius  + (myP.radius * 0.5));
			if(distance <= orbit )
			{
				this.moveObj = null;
				//this.mc.fireMC.visible = false;
				this.angle = MathUtils.getAngle( x, y,myP.x, myP.y);
				this.distanceFromParent = orbit;
				this.currPlanet = myP;	
				this.findTarget();
				return;
			}

			this.moveObj.vx = w / distance;
			this.moveObj.vy = h / distance;

			var nextX = x + this.moveObj.vx * speed;
			var nextY = y + this.moveObj.vy * speed;

			var fX = 0;
			var fY = 0;
			var num = 0;
            var sAngle;

			

			var col = Math.floor((x - Model.mapLeft) / Model.tileW);
			var row = Math.floor((y - Model.mapTop) / Model.tileH);
            var iter = 5;
			
			for(var r = -iter; r < iter; r++)
			{
				for(var c = -iter; c < iter; c++)
				{
					var name = (row+r) + "_" + (col+c);
					var block = Model.partition[name];
					if(block)
					{
						//model.dg.lineStyle(10, 0xffffff);
						//model.dg.moveTo(Model.tileW * ((col+c)  - Model.mapLeft)  , Model.tileH * ((row+r)   - Model.mapTop) );
						//model.dg.lineTo(Model.tileW * ((col+c+1) - Model.mapLeft),  Model.tileH * ((row+r+1) - Model.mapTop));

						for(var k in block)
						{
							if(block[k].isPlanet)
							{
								var p = (block[k]);
                                
								if(p != myP)
								{
                                    //trace("checking " + p.name + " going to " + myP.name);
									var rad = p.radius;
									var d = MathUtils.getDistance(x, y, p.x, p.y);
									sAngle = MathUtils.getAngle(x, y, p.x, p.y );
									var cos = Math.cos(sAngle);
									var sin = Math.sin(sAngle);
									num++;
									var mag = 100;
									if(p.isMoon)
									{
										mag = 1;
									}
									fX -= ((cos * speed)  / (d - rad)) * mag ;//
									fY -= ((sin * speed)  / (d - rad)) * mag ; // 
								}
							}

						}
					}
				}
			}
			

			//trace("checked " + num + " stars");

			///////////////////////

			//trace(fX, fY);
			nextX -= fX;
			nextY -= fY;

			sAngle = MathUtils.getAngle(nextX, nextY, x, y);

			this.y = nextY;
			this.x = nextX;
           
            if(this.smokeCounter % 8 == 0 && vis)
			{
                this.smokeCounter = 0;
				var smoke = (this.smokePool.get("smoke"));
				//model.planetLayer.addChild(smoke);
			
				smoke.play(this.onStep1Complete.bind(this), this.model, x,y);
			}
            /* */
            this.setMcPos(this.x, this.y);
			mc.rotation = sAngle;
		}
        
		if (this.currPlanet) {
			var cos = Math.cos(this.angle) * (this.distanceFromParent );
			var sin = Math.sin(this.angle) * (this.distanceFromParent );
			cos += this.currPlanet.x;
			sin += this.currPlanet.y;
			//trace("pre draw", x,y,angle);
			this.x = cos;
			this.y = sin;
            this.setMcPos(this.x, this.y);
			this.angle += (this.speed * 0.001);
			this.angle = MathUtils.fixAngle(this.angle);
			this.mc.rotation = (this.angle + (Math.PI / 2));// * 180 / Math.PI;

		}
        
        x = this.x;
        y = this.y;
		/*
		if (
			Utils.isInScreen(x, y, model.layers, stage) ||
			Utils.isInScreen(x + radius, y, model.layers, stage) ||
			Utils.isInScreen(x - radius, y, model.layers, stage) ||
			Utils.isInScreen(x, y + radius, model.layers, stage) ||
			Utils.isInScreen(x, y - radius, model.layers, stage)

		) {
			model.planetLayer.graphics.drawCircle(x, y, radius); // Draw the circle, assigning it a x position, y position, raidius.
			model.planetLayer.graphics.endFill();
		}
		*/
	}

    onStep1Complete(target)
    {
        //trace("back in pool");
        //model.planetLayer.removeChild(target);
        this.smokePool.putBack(target, "smoke");
    }

}
	
SpaceShip.COUNT = 0;
