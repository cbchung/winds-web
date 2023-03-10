var navigate = {

    invokers : [],
    init : function(){
        window.navigate = this;
        this.callNative('onAppLoaded');
    },
    /*
     * onAppLoaded
     */
    callNative : function(handle, params){
        if(window.AndroidBridge) eval(`AndroidBridge.${handle}('${params === undefined ? '': typeof params === "object" ? JSON.stringify(params) : params}');`);
        else if(window.webkit) window.webkit.messageHandlers.bridge.postMessage({handle:handle, params:params});
        //else if(app.osType == 'iOS' || app.osType == 'Android') app.mobile[handle](params!=undefined ? params : '');
        //else console.log('unsupported os-type:' + app.osType + ' - ' + navigator.userAgent || navigator.vendor || window.opera);
        else app.mobile[handle](params!=undefined ? params : '');
       console.log('callNative');
    },
    addInvoker : function(el){
        if(!this.invokers.includes(el)) this.invokers.push(el);
    },
    removeInvoker : function(el){
        if(this.invokers.includes(el)) this.invokers.splice(this.invokers.indexOf(el), 1);
    },
    invoke : function(cmd, param){
        console.log('invoke', cmd, param);
        const evt = new CustomEvent(cmd, { detail:{ data: param } })
        for(const v of this.invokers){
            v.dispatchEvent(evt);
            console.log('dispatchEvent', v.id);
        }
    }
};

