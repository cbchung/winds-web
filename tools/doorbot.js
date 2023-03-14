/*
 * doorbot.js
 */
importScripts('/tools/idb.js');

onmessage = function(e){
    const msg = e.data[0], cmd = msg.cmd;
    console.log('worker.onmessage', e.data[0]);

}

var doorbot = {
    init : function(){
        const hostname = location.hostname, wsu = hostname.startsWith('www') ? 'www' : 'dev';
        this.url = `wss://${wsu}.on-remote.com/doorbot`;

        /*
        idb.init().then(function(){
            p79.getDid();
        });
        */
       doorbot.test();
        
    },
    start : function(room, uid, cate){
        const sock = p79.socket = new WebSocket(this.url);
        sock.onmessage = function(e) {  
            console.log('e.data', e.data);

            let tokens = e.data.split('|');
            const type = tokens[0], cmd = tokens[1];
            tokens.splice(0,2);
            const data = JSON.parse(tokens.join(''));

            switch(cmd){
                case 'ev-enter':
                    postMessage({type:'ev-enter', data:data});
                    break;
                case 'ev-info':
                    postMessage({type:'ev-info', data:data});
                    break;
                case 'res-enter':
                    postMessage({type:'res-enter', data:data});
                    break;
                default :
            }
        };
        sock.onerror = function(er) { console.log('error:', er); };
        sock.onclose = function(){ console.log('socket-closed!!---------reStart required'); };

        sock.onopen = function(e){
            const data = { did: p79.did, uid:uid, cate:cate, room:room };
            console.log('data', data);
            sock.send('sw|enter|'+JSON.stringify(data));
        };
    },
    test : function(){
        const sock = doorbot.socket = new WebSocket(this.url);
        sock.onmessage = function(e) {  
            console.log('e.data', e.data);

            let tokens = e.data.split('|');
            const type = tokens[0], cmd = tokens[1];
            tokens.splice(0,2);
            const data = JSON.parse(tokens.join(''));

            switch(cmd){
                case 'ev-enter':
                    postMessage({type:'ev-enter', data:data});
                    break;
                case 'ev-info':
                    postMessage({type:'ev-info', data:data});
                    break;
                case 'res-enter':
                    postMessage({type:'res-enter', data:data});
                    break;
                default :
            }
        };
        sock.onerror = function(er) { console.log('error:', er); };
        sock.onclose = function(){ console.log('socket-closed!!---------reStart required'); };

        sock.onopen = function(e){
            const data = { did: 'kkk' };
            console.log('data', data);
            sock.send('sw|enter|'+JSON.stringify(data));
        };
    },
};

doorbot.init();