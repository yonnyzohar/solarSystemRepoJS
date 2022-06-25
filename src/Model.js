class Model {

    constructor(_stage)
    {
        //textures
        this.stage = _stage;
		this.allPlanets= [];
		this.tweenTo = null;
		this.layers;
		this.starsLayer =  new PIXI.Container();
        this.lightLayer =  new PIXI.Container();
        this.maskLayer = new PIXI.Container();
        this.planetLayer = new PIXI.Container();
        
		this.offsetX = 0;
		this.offsetY = 0;
		this.prevX = 0;
		this.prevY = 0;
		this.zoomAmount = 0.005;
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
        
        
			this.layers = [ this.starsLayer, this.lightLayer, this.maskLayer, this.planetLayer];
			

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

			mercury = new Planet(this, stage);
			mercury.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	500, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"mercury"
			);
			
			dist += (mercury.radius * 10);

			venus = new Planet(this, stage);
			venus.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"venus"
			);
			
			dist += (venus.radius * 10);

			earth = new Planet(this, stage);
			earth.init(
			/*radius*/	50, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	0,//Math.random() * (Math.PI * 2), 
			/*name*/	"earth",
			/*numMoons*/3
			);

			dist += (earth.radius * 10);


			mars = new Planet(this, stage);
			mars.init(
			/*radius*/	35, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"mars",
			/*numMoons*/1
			);

			dist += (mars.radius * 10);
			

			jupiter = new Planet(this, stage);
			jupiter.init(
			/*radius*/	200, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"jupiter",
			/*numMoons*/5
			);

			dist += (jupiter.radius * 10);

			saturn = new Planet(this, stage);
			saturn.init(
			/*radius*/	180, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"saturn",
			/*numMoons*/3,
			/*numRings*/ 8
			);

			dist += (saturn.radius * 10);



			uranus = new Planet(this, stage);
			uranus.init(
			/*radius*/	80, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"uranus",
			4
			);

			dist += (uranus.radius * 10);
			

			neptune = new Planet(this, stage);
			neptune.init(
			/*radius*/	70, 
			/*color*/	0xffffff * Math.random(),
			/*distanceFromParent*/	dist, 
			/*angle*/	Math.random() * (Math.PI * 2), 
			/*name*/	"neptune",
			3,
			2
			);

			dist += (neptune.radius * 10);
			

			sun = new Star(this, stage);
			sun.init(
			/*radius*/	300, 
			/*color*/	0xffff00,
			/*distanceFromParent*/	10000, 
			/*angle*/	0, 
			/*name*/	"sun"
			);
			
			sun.lightRad = 9000;
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
	
}

Model.partition = {};
Model.tileW;
Model.tileH;
Model.mapW;
Model.mapH ;
Model.mapLeft;
Model.mapTop;
Model.numShips = 10;
Model.maxDistance = 1000000;