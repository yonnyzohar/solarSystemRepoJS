class Model {

    constructor(_stage)
    {
        //textures
        this.stage = _stage;
		this.allEntities= [];
		this.tweenTo = null;
		this.layers;
		this.starsLayer =  new PIXI.Container();
        this.lightLayer =  new PIXI.Container();
        this.maskLayer = new PIXI.Container();
        this.planetLayer = new PIXI.Container();
        this.debugLayer = new PIXI.Container();
        
		this.offsetX = 0;
		this.offsetY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.zoomAmount = 0.05;
        this.minZoom = 0.1;
		this.currZoom = 1;
		this.mouseDown = false;
        
        this.starsLayer.graphics = new PIXI.Graphics();
        this.starsLayer.addChild(this.starsLayer.graphics);
        
        this.lightLayer.graphics = new PIXI.Graphics();
        this.lightLayer.addChild(this.lightLayer.graphics);
        
        this.maskLayer.graphics = new PIXI.Graphics();
        this.maskLayer.addChild(this.maskLayer.graphics);
        
        this.planetLayer.graphics = new PIXI.Graphics();
        this.planetLayer.addChild(this.planetLayer.graphics);
        
        this.debugLayer.graphics = new PIXI.Graphics();
        this.debugLayer.addChild(this.debugLayer.graphics);
        
        
        this.layers = [ this.starsLayer, this.lightLayer, this.maskLayer, this.planetLayer, this.debugLayer];
			

    }
    
    initPlanets()
    {
        var mercury;
		var venus;
		var earth;
		var mars;
		var jupiter;
		var saturn;
		var uranus;
		var neptune;
		var sun;
        var stage = this.stage;
			
			var dist = 500;
            var moonsDist = 0;

			mercury = new Planet(this, stage);
			mercury.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	500, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"mercury"
			);
            
			
			
            moonsDist = mercury.addMoons();
            dist += (mercury.radius + moonsDist + this.gap());

			venus = new Planet(this, stage);
			venus.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"venus"
			);
            
			
			
            moonsDist = venus.addMoons();
            dist += (venus.radius  + moonsDist + this.gap());

			earth = new Planet(this, stage);
			earth.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	0,//Math.random() * (Math.PI * 2), 
			/*name*/	"earth",
			/*numMoons*/1
			);
            
            
			
            moonsDist = earth.addMoons();
            dist += (earth.radius +  moonsDist + this.gap());


			mars = new Planet(this, stage);
			mars.init(
			/*radius*/	35, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"mars",
			/*numMoons*/2
			);
            
			
            moonsDist = mars.addMoons();
            dist += (mars.radius  + moonsDist + this.gap());
			

			jupiter = new Planet(this, stage);
			jupiter.init(
			/*radius*/	200, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"jupiter",
			/*numMoons*/5
			);
            
			
            moonsDist = jupiter.addMoons();
            dist += (jupiter.radius + (moonsDist /2)+ this.gap());

			saturn = new Planet(this, stage);
			saturn.init(
			/*radius*/	180, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"saturn",
			/*numMoons*/7,
			/*numRings*/ 10
			);
            
			
            moonsDist = saturn.addMoons();
            dist += (saturn.radius + moonsDist + this.gap());


			uranus = new Planet(this, stage);
			uranus.init(
			/*radius*/	80, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"uranus",
			3
			);
            
			
			moonsDist = uranus.addMoons();
            dist += (uranus.radius + (moonsDist /2)+ this.gap());

			neptune = new Planet(this, stage);
			neptune.init(
			/*radius*/	70, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"neptune",
			4,
			2
			);
            
			
			moonsDist = neptune.addMoons();
            dist += (neptune.radius + moonsDist + this.gap());

			sun = new Star(this, stage);
			sun.init(
			/*radius*/	500, 
			/*color*/	0xffff00,
			/*distanceFromParent*/	10000, 
			/*angle*/	0, 
			/*name*/	"sun"
			);
			
			sun.lightRad = dist * 1.5;
			sun.x= stage.stageWidth / 2;
			sun.y= stage.stageHeight / 2;
			sun.orbitingPlanets = [];

			sun.orbitingPlanets.push(mercury);
			sun.orbitingPlanets.push(venus);
			sun.orbitingPlanets.push(earth);
			sun.orbitingPlanets.push(mars);
			sun.orbitingPlanets.push(jupiter);
			sun.orbitingPlanets.push(saturn);
			sun.orbitingPlanets.push(uranus);
			sun.orbitingPlanets.push(neptune); 
        
            this.sun = sun;
    }
    
    gap()
    {
        return (500 * Math.random()) + 300;
    }
	
}



Model.partition = {};
Model.tileW;
Model.tileH;
Model.mapW;
Model.mapH ;
Model.mapLeft;
Model.mapTop;
Model.numShips = 10;
Model.splitFactor = 4;
Model.maxDistance = 1000000;