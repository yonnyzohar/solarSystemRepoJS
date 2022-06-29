
	 class Entity {
         
         constructor(_model,_stage )
         {
            this.name;
            this.x;
            this.y;
            this.radius;
            this.color;
            this.angle;
            this.speed;
            this.prevRow;
            this.prevCol;
            this.model = _model;
		    this.stage = _stage;
		}

		draw(parentObj = null)
		{
			var col = Math.floor((this.x - Model.mapLeft) / Model.tileW);
			var row = Math.floor((this.y - Model.mapTop) / Model.tileH);
            if(isNaN(col))
               {
               var a = 1;
               }

			if(row != this.prevRow || col != this.prevCol)
			{
				var oldDictName = (this.prevRow) + "_" + (this.prevCol);
				var block = Model.partition[oldDictName];
				if(block)
				{
					block.numPlanets--;
					delete block[this.name];
				}
				
				
				var newDictName = (row) + "_" + (col);
				if(!Model.partition[newDictName])
				{
					Model.partition[newDictName] = { color : 0xffffff * Math.random(), row : row, col:col ,numPlanets:0};
				}
				Model.partition[newDictName][this.name] = this;
				Model.partition[newDictName].numPlanets++;
				this.prevRow = row;
				this.prevCol = col;
                
			}
		}

	}
Entity.index = 0;

Entity.nextIndex = function()
{
	Entity.index++;
	return Entity.index;
}

	

