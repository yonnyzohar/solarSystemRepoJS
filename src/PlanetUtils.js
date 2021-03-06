var PlanetUtils = {};

	

PlanetUtils.findNearestPlanet = function(model, mx, my)
{
	
	var xPos = mx; //(  ((stage.mouseX* currZoom) - l.x)  ); // l.x + -
	var yPos = my; //(  ((stage.mouseY* currZoom) - l.y) ); //l.y + -
	var shortestP;
	var shortestDist = 10000000;
	var found = false;
	var i = 0;


	var col = Math.floor((xPos - Model.mapLeft) / Model.tileW);
	var row = Math.floor((yPos - Model.mapTop) / Model.tileH);
	
	for(var r = -1; r < 1; r++)
	{
		for(var c = -1; c < 1; c++)
		{
			var name = (row+r) + "_" + (col+c);
			var block = Model.partition[name];
			if(block)
			{
				for(var k in block)
				{
					
					if(block[k] )//is Entity
					{
						var e = block[k];
						//p = Planet(e);
						var d = MathUtils.getDistance(xPos, yPos , e.x, e.y);
						if (d < e.radius) {
							found = true;
							return e;
						}
						if(d < shortestDist)
						{
							shortestDist = d;
							shortestP = e;
						}
					}
				}
			}
		}
	}
	
	return shortestP;
	
}

PlanetUtils.populatePlanetsARrr = function(planet,model, stage)
{
       model.allEntities.push(planet);
        //console.log("adding " + planet.name + " to allEntities");
        if (planet.orbitingPlanets)
        {
            for (var i = 0; i < planet.orbitingPlanets.length; i++)
            {
                //this will make planets move slower if they are farther away
                var p = (planet.orbitingPlanets[i]);
                PlanetUtils.populatePlanetsARrr(p, model, stage);
            }
        }
    
	
	
}


PlanetUtils.populateBGStars = function(model, stage)
{
    var graphics = model.starsLayer.graphics;
	graphics.lineStyle(0.1, 0x000000);

	for (var i = 0; i < 500; i++)
	{
		var _x = stage.stageWidth * Math.random();
		var _y = stage.stageHeight * Math.random();
		graphics.beginFill(0xffffff, 1);
		graphics.drawCircle(_x, _y, 1); // Draw the circle, assigning it a x position, y position, raidius.
		graphics.endFill();
	}
}
