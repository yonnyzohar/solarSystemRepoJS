 class Planet extends Entity{
     
     
     
	constructor(_model, _stage)
    {
        super(_model, _stage);
     
        this.distanceFromParent;
        this.orbitingPlanets ;
        this.showOrbit = false;
        this.numMoons = null;
        this.isMoon = false;
        this.isPlanet = true;
        this.rings;
        
    }
     
     addMoons() {
        var numMoons = this.numMoons;
        var orbitingPlanets = this.orbitingPlanets;
        var model = this.model;
        var stage = this.stage;
        var radius = this.radius;
        
		if (numMoons) {
			if (!orbitingPlanets) {
				orbitingPlanets = [];
			}
			var dist = radius + 20;
			for (var j = 0; j < numMoons; j++) {

				var moon = new Planet(model, stage);
				moon.radius = Math.max(radius * (Math.random() - 0.6), radius * 0.3);
				moon.color = 0xffffff * Math.random();
				moon.distanceFromParent = dist;
				moon.angle = Math.random() * (Math.PI * 2);
				moon.speed = (Model.maxDistance / moon.distanceFromParent) * 0.000001; //speed = Utils.getSpeed(true);
				moon.name = "moon" + Planet.nextMoonIndex();
				moon.isMoon = true;
                moon.addMC();

				dist += (moon.radius * 4);

				orbitingPlanets.push(moon);
				model.allPlanets.push(moon);
			}
            
            this.orbitingPlanets = orbitingPlanets;
		}

	}
     
     addMC()
     {
         var radius = this.radius;
         var rnd = Math.floor(Math.random() * this.model.planetTextures.length);
        var tex = this.model.planetTextures[rnd];

        this.mc = new PIXI.Sprite(tex);
        
        var hW = this.mc.width / 2;
        var diff = hW / radius;
        this.mc.scale.x /= diff;
        this.mc.scale.y /= diff;
        
        this.mc.anchor.set(0.5);
        this.model.planetLayer.addChild(this.mc);
     }


	
	init(_radius, _color, _distanceFromParent, _angle, _name, _numMoons = 0, _numRings = 0)
	{
		this.radius= _radius;
		this.color= _color;
		this.distanceFromParent= _distanceFromParent;
		this.angle= _angle;
		this.name= _name;
		this.numMoons = _numMoons;
        
        this.addMC();
        
        


		if(_numRings > 0)
		{
			this.rings = [];

			for(var i = 0; i < _numRings; i++)
			{
				this.rings.push(Math.random() * 0xffffff);
			}
		}
		
		this.speed = (Model.maxDistance / this.distanceFromParent) * 0.000001;
	}

	draw(parentObj = null) {
		super.draw(parentObj);
		
		var i;
		var j;
        var distanceFromParent = this.distanceFromParent;
        var model = this.model;
        var angle = this.angle;
        var stage = this.stage;
        var radius = this.radius;
        var color = this.color;
        var rings = this.rings;
        var orbitingPlanets = this.orbitingPlanets;
        var planetLayerGraphics = model.planetLayer.graphics;
        
        if(this.mc)
        {
          this.mc.rotation-= 0.001;       
        }
        
		if (parentObj) {
			var cos = Math.cos(angle) * (distanceFromParent + parentObj.radius);
			var sin = Math.sin(angle) * (distanceFromParent + parentObj.radius);
			cos += parentObj.x;
			sin += parentObj.y;
			//trace("pre draw", x,y,angle);
			this.x = cos;
			this.y = sin;
            
            if(this.mc)
            {
               this.mc.x = cos;
               this.mc.y = sin;
                
            }
            
	

			//trace("draw", name, x,y, parentObj.x, parentObj.y, angle, parentObj.radius);

			this.angle += this.speed;
			this.angle = MathUtils.fixAngle(this.angle);

			if (this.showOrbit || parentObj.showOrbit) {
				planetLayerGraphics.lineStyle(2, 0xffffff, 1);
				planetLayerGraphics.drawCircle(parentObj.x, parentObj.y, distanceFromParent + parentObj.radius);
				planetLayerGraphics.endFill();
			}
			/**/


		}
        
        var x = this.x;
        var y = this.y;
		
		if (
			Utils.isInScreen(x, y, model.layers, stage) ||
			Utils.isInScreen(x + radius, y, model.layers, stage) ||
			Utils.isInScreen(x - radius, y, model.layers, stage) ||
			Utils.isInScreen(x, y + radius, model.layers, stage) ||
			Utils.isInScreen(x, y - radius, model.layers, stage)

		) {
			
            if(this.mc)
            {
                this.mc.visible = true;
               this.mc.x = x;
                this.mc.y = y;
            }
            /*
            if(this.isStar)
            {
                planetLayerGraphics.beginFill(color, 1);
			 planetLayerGraphics.drawCircle(x, y, radius); // Draw the circle, assigning it a x position, y position, raidius.
			 planetLayerGraphics.endFill();
            }
            */
			if (rings) {
				var thickness = 10;
				var startDist = radius + (radius * 0.4);
				for (i = 0; i < rings.length; i++) {
					var color = rings[i];
					planetLayerGraphics.lineStyle(thickness, color, .5);

					//for (j = 0; j < 15; j++) {
						planetLayerGraphics.drawCircle(x, y, startDist);
						planetLayerGraphics.endFill();
					//}
					startDist += thickness;
				}
			}
		}
        else
        {
            if(this.mc)
            {
                this.mc.visible = false;
            }
        }


		var p;
		if (orbitingPlanets) {
			for ( i = 0; i < orbitingPlanets.length; i++) {
				p = (orbitingPlanets[i]);
				p.draw(this);
			}
		}
		/**/


		
	}

	

}
Planet.moonIndex = 0;

Planet.nextMoonIndex = function()
{
	Planet.moonIndex++;
	return Planet.moonIndex;
}

