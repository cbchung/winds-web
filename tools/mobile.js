var navigate = {

    init : function(){
        window.navigate = this;
        this.callNative('onAppLoaded');
    },
    /*
     * onAppLoaded
     */
    callNative : function(handle, params){
        if(window.AndroidBridge) AndroidBridge[handle](params!=undefined ? params : '');
        else if(window.webkit) window.webkit.messageHandlers.bridge.postMessage({handle:handle, params:params});
        //else if(app.osType == 'iOS' || app.osType == 'Android') app.mobile[handle](params!=undefined ? params : '');
        //else console.log('unsupported os-type:' + app.osType + ' - ' + navigator.userAgent || navigator.vendor || window.opera);
        else app.mobile[handle](params!=undefined ? params : '');
       console.log('callNative');
    }
};

