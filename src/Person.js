class Person extends Entity{
    constructor(model, stage)
    {
        super(model, stage);
        this.circles = [];
		this.color = 0xffffff * Math.random();
		this.name = "person" + Entity.nextIndex();
        this.angle = Math.random() * (Math.PI * 2);
        
        var rnd = Math.floor(Math.random() * 14);
        var tex = this.model.allTextures["alien" + rnd];
        this.mc = new PIXI.Sprite(tex);
        this.mc.anchor.set(0.5, 1);
        
        var hW = this.mc.width / 2;
        var diff = hW / 20;
        this.mc.scale.x /= diff;
        this.mc.scale.y /= diff;
        
        this.radius = this.mc.width/2;
        
        this.numCircles = Math.floor(this.mc.height / this.mc.width);
        if(this.numCircles < 1)
        {
           this.numCircles = 1;
        }
        else
        {
         var a = 1;       
        }
    }
    
    attachToPlanet(ship, planet)
    {
        this.angle = MathUtils.getAngle(ship.x, ship.y, planet.x,planet.y);
        this.attachedPlanet = planet;
        planet.tourists.push(this);
        Utils.addUpdateable(this.name, this);
        var planetLayer = this.model.planetLayer
        planetLayer.addChildAt(this.mc,0);
        this.mc.visible = true;
        for(var i = 0; i < this.numCircles; i++)
        {
            var o = {x : 0, y : 0, radius : this.radius};
            this.circles.push(o);
            this.model.allEntities.push(o);
        }
    }
    
    update()
    {
        var p = this.attachedPlanet;
        if(p)
        {
            this.angle -= p.rotationSpeed;
            var r = p.radius;
            var cos = Math.cos(this.angle) * r;
            var sin = Math.sin(this.angle) *  r;
            cos += p.x;
            sin += p.y;
                
            
            this.x = cos;
            this.y = sin;
            this.mc.x = cos;
            this.mc.y = sin;
            this.mc.rotation = this.angle + (Math.PI / 2);
            
            r += (this.radius/2) ;
            for(var i = 0; i < this.numCircles; i++)
            {
                cos = Math.cos(this.angle) * r;
                sin = Math.sin(this.angle) *  r;
                cos += p.x;
                sin += p.y;
                 
                
                this.circles[i].x = cos;
                this.circles[i].y = sin;
                /*
                var planetLayerGraphics = this.model.planetLayer.graphics;
                planetLayerGraphics.lineStyle(0.1, 0x000000, 0);
                planetLayerGraphics.beginFill(this.color, 1);
			     planetLayerGraphics.drawCircle(this.circles[i].x, this.circles[i].y, this.radius); 
			     planetLayerGraphics.endFill();
                 */
                r += (this.radius*2) ;
            }
            
            
            /*
            
            */
            
        }
    }
    
    detachFromPlanet()
    {
        var tIndex = this.attachedPlanet.tourists.indexOf(this);
        this.attachedPlanet.tourists.splice(tIndex, 1);
        this.attachedPlanet = null;
        Utils.removeUpdateable(this.name, this);
        this.mc.visible = false;
        var planetLayer = this.model.planetLayer
        planetLayer.removeChild(this.mc);
        
        for(var i = 0; i < this.circles.length; i++)
        {
            var o =  this.circles[i];
            var index = this.model.allEntities.indexOf(o);
            this.model.allEntities.splice(index, 1);
        }
        
        
        this.circles = [];
    }
}