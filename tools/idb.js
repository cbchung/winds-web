var idb = {
    name : 'meta',
    init : function(){
        
        const request = indexedDB.open(this.name, 2);
        request.onupgradeneeded = function(event){
            console.log('initdb-onupgradeneeded');
            const db = event.target.result;
            if(!db.objectStoreNames.contains('props')){
                db.createObjectStore("props", { keyPath: "key" });
            }
        }
        
        return new Promise(function(resolve, reject) {
            request.onsuccess = function(e) { idb.db = request.result; resolve(request); };
            request.onerror = function(e) { reject(e); };
        });	
    },

    getProp : function(key){ return this.get(["props"],"props", key); },
    putProp : function(data){ return this.put(["props"],"props", data); },
    addProp : function(data){ return this.add(["props"],"props", data); },
    setProp : function(key,data){ return this.set(["props"],"props", key, data); },

    get: function(trans, obj, key){
        const _s = this.db.transaction(trans).objectStore(obj);
        const req = _s.get(key);
        return new Promise(function(resolve, reject) {
            req.onsuccess = function(e) { resolve(req.result); };
            req.onerror = function(e) { reject(e); };
        });	
    },
    
    put : function(trans, obj, data){
        const _s = this.db.transaction(trans, "readwrite").objectStore(obj);
        const req = _s.put(data);
        
        return new Promise(function(resolve, reject) {
            req.onsuccess = function(e) { resolve(data); };
            req.onerror = function(e) { reject(e); };
        });	
    },

    add : function(trans, obj, data){
        const _s = this.db.transaction(trans, "readwrite").objectStore(obj);
        const req = _s.add(data);
        
        return new Promise(function(resolve, reject) {
            req.onsuccess = function(e) { resolve(data); };
            req.onerror = function(e) { reject(e); };
        });	
    },

    set : function(trans, obj, key, data){
        const _s = this.db.transaction(trans).objectStore(obj);
        const req = _s.get(key);
        return new Promise(function(resolve, reject) {

            req.onsuccess = function(e) {
                let td = req.result;
                if(td === undefined) td = data;
                else for(const k in data) td[k] = data[k];
                resolve({ cmd:'put', data:data });
            };
            req.onerror = function(e) { 
                resolve({ cmd:'add', data:data });
            };
        });	
    }
};
