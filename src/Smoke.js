class Smoke
{

    constructor(_model, _stage) 
    {
        this.name = "Smoke" + Smoke.COUNTER;
        Smoke.COUNTER++;
    }
    
    play(callback,model ,x,y)
    {
        this.model = model;
        this.alpha = 0.5;
        this.radius = 15;
        this.numSteps = 100;
        this.step = 0;
        this.callback = callback;
        this.x = x;
        this.y = y;
        this.iter = 0;
        Utils.addUpdateable(this.name, this);
    }
    
    
    update(dt)
    {
        
            var model = this.model;
            var per = 1 - (this.step / this.numSteps);
            model.planetLayer.graphics.lineStyle(0.1, 0xffffff, 0.1);
            model.planetLayer.graphics.beginFill(0xffffff, this.alpha * per);
            model.planetLayer.graphics.drawCircle(this.x, this.y, this.radius * per); // Draw the circle, assigning it a x position, y position, raidius.
            model.planetLayer.graphics.endFill();

            this.step++;

            if(per <= 0)
            {
                Utils.removeUpdateable(this.name, this);
                this.callback(this);
            }
       
        
    }
}
Smoke.COUNTER = 0;