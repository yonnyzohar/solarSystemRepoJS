class Pool {

		

		
		
		constructor()
		{
			if (Pool.instance)
			{
				throw new Error("Singleton and can only be accessed through Singleton.getInstance()");
			}
            else{
                this.dict = {};
            }
		}
		
		

		init(_numElements , _CLS, type, fnctn = null) 
		{
			
			this.dict[type] = {
				curIndex : 0,
				numElements : _numElements,
				CLS : CLS,
				pool : new Array(_numElements),
				fnctn:fnctn
			};

			var CLS = _CLS;
			//the current index of the pool
			var pool = this.dict[type].pool;//the actual pool storing the elements
			for(var i = 0; i < _numElements; i++)
			{
				pool[i] = new CLS();
				if(fnctn != null) 
				{
					fnctn(pool[i]);
				}
			}
		}

		clear(type)
		{
			var dict = this.dict;
			if(dict[type])
			{
				var obj = dict[type];
				obj.curIndex = 0;
			}
			else{
				throw new Error("pool " + type + " does not exit in pool");
			}
			
		}

		get(type)
		{
            var dict = this.dict;
			if(dict[type])
			{
				var obj = dict[type];
				var pool = obj.pool;
				var e = pool[obj.curIndex];
				if(e == null)
				{
					throw new Error("pool " + type + " limit exceeded " + obj.curIndex);
				}
				if(obj.fnctn)
				{
					obj.fnctn(e);
				}
				obj.curIndex++;
				return e;
			}
			else{
				throw new Error("pool " + type + " does not exit in pool");
			}
			return null;
			
		}

		putBack(e, type)
		{
            var dict = this.dict;
			if(dict[type])
			{
				var obj = dict[type];
				var pool = obj.pool;
				obj.curIndex--;
				pool[obj.curIndex] = e;
			}
			else{
				throw new Error("pool " + type + " does not exit in pool");
			}
			
		}


	}
    
    Pool.instance = new Pool();
Pool.getInstance = function()
		{
			return Pool.instance;
		}
	

