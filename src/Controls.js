class Controls{
    constructor(stage, model, target)
    {
        var self = this;
        this.mouseCounter =0;
        this.start = {};
        //mouse events!
        window.onmousedown =  function(event)
        {
            event.preventDefault();
            //trace("onmousedown " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            target.onDown(event)
        }
        window.onmousemove  = function(event) {
            event.preventDefault();
            //trace("onmousemove " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
        }
        window.onmouseup = function(event)
        {
            event.preventDefault();
            //trace("onmouseup " , event.clientX, event.clientY);
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            target.onUp(event)
        }
        window.addEventListener("wheel", event => {
            
            stage.mouseX = event.clientX;
            stage.mouseY = event.clientY;
            const delta = (event.deltaY);
            //trace(delta);
            target.zooom(delta * -1);
        });
        
        //touch events
        this.touchRunning = false;
        this.touches = [];
        
        window.ontouchstart = function(event)
        {
            event.preventDefault();
            
            if(!self.touchRunning)
            {
               self.touches = [];
               self.touchRunning = true;
                
                setTimeout(function(){
                    self.touchRunning = false;
                    var gotTwo = false;
                    var touchEvent;
                    for(var i = 0; i < self.touches.length; i++)
                    {
                        touchEvent = self.touches[i];
                        if (touchEvent.touches.length === 2) {
                            gotTwo = true;
                            break;
                        }
                    }
                    
                    if (gotTwo) {
                        self.start.x = (touchEvent.touches[0].pageX + touchEvent.touches[1].pageX) / 2;
                        self.start.y = (touchEvent.touches[0].pageY + touchEvent.touches[1].pageY) / 2;
                        self.start.distance = self.distance(touchEvent);

                        trace("ontouchstart 2 " + self.start.x+" "+ self.start.y);

                        stage.mouseX = self.start.x;
                        stage.mouseY = self.start.y;
                        self.prevDist = self.distance(touchEvent);
                    }
                    else
                    {
                        var clientX = touchEvent.touches[0].pageX;
                        var clientY = touchEvent.touches[0].pageY;
                        trace("ontouchstart 1 " + clientX+" "+ clientY);
                        stage.mouseX = clientX;
                        stage.mouseY = clientY;
                        target.onDown(touchEvent);
                    }
                    
                    
                }, 10);
            }
            
            self.touches.push(event);
             
            
        }
        
        window.ontouchmove = function(event) {
            event.preventDefault();
            
            if(self.touchRunning)
            {
               return;
            }
            
            if (event.touches.length === 2) {

                const deltaDistance = self.distance(event);
                const deltaX = (event.touches[0].pageX + event.touches[1].pageX) / 2; // x2 for accelarated movement
                const deltaY = (event.touches[0].pageY + event.touches[1].pageY) / 2 ; // x2 for accelarated movement
                stage.mouseX = deltaX;
                stage.mouseY = deltaY;
                /*
                    trace("move 2 " + 
                      "x0 " + event.touches[0].pageX + 
                      " x1 " + event.touches[1].pageX + 
                      " y0 " +  event.touches[0].pageY + 
                      " y1 " + event.touches[1].pageY +
                      " midx " + deltaX + 
                      " midy " + deltaY
                    );
                */
                
                
                var dif = Math.abs(deltaDistance - self.prevDist);
                if(dif > 1)
                   {
                       if(deltaDistance > self.prevDist)
                        {
                           target.zooom(1);
                        }
                        else if(self.prevDist > deltaDistance)
                        {
                            target.zooom(-1);   
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
        
        window.ontouchend = function(event)
        {
            event.preventDefault();
            target.onUp(event)
        } 
    }
    
    distance(event){
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    }
}