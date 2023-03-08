/**
 * sejak.js
 */

var sejak = {

    ctx : { frag:[], fragment_prefix: 'sejakFrag' },
    h : function(id){ return sejak.ctx.frag[id].h; },

    fragment : function(t,f){

		const j = f.querySelector('sejak'), version = j.getAttribute("version"), tag = j.nodeName.toLowerCase();
		//console.log(version, tag, j.nodeName, j.tagName);
        const v = f.querySelector('section'), s = f.querySelector('script');
		t.innerText = ""; 
        sejak.ctx.pi = (typeof sejak.ctx.pi === 'undefined') ? 1 : sejak.ctx.pi+1;

		const id = sejak.ctx.pi, $v = v, $id = id, fid = `${sejak.ctx.fragment_prefix}-${id}`;
		v.id = fid;
		try{ s.innerHTML = s.innerHTML.replace(/\$this/g,'sejak.h('+id+')');}catch(e){}

        if(s != null) eval('var handle = (function($v,$id){' + s.innerText + '})(v,id);');
		else eval('var handle = (function($v,$id){})(v,id);');

		sejak.ctx.frag[id] = { h: handle };    
		v.innerHTML = v.innerHTML.replace(/\$h/g,'sejak.h('+id+')');
		v.innerHTML = v.innerHTML.replace(/\$s/g,`#${fid}`);

		t.append(v);
		f.remove();

		return id;
    },
    setFrag : function(s, u, p, cb){
		let req = { u: u+`?${ new URLSearchParams(p).toString()}`, p: { method: "GET", headers: { "Content-Type": "text/html", }} };
		if(!u.endsWith('.html') && !u.endsWith('.htm')){
			let pr = []; for(let k in p) pr.push(k + "=" + p[k]);
			req = { u:u, p: {  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", }, body: pr.join('&') }};
		}	
        fetch(req.u, req.p)
		.then(function(response){
			if(response.ok) return response.text();
			else throw new Error('network error');
		})
		.then(function(res){
			
			const fragment = document.createElement('fragment'), target = document.querySelector(s);
			fragment.innerHTML = res;

			/* 이전 모듈 정리	*/
			const prev = target.querySelector('section');
			if(prev != null){ 
				try{
					const pid = prev.id.split('-')[1];
					if(typeof sejak.ctx.frag[pid].h.onextract === 'function') sejak.ctx.frag[pid].h.onextract();
					delete sejak.ctx.frag[pid];
				} catch(e){}	
			}
			
			/* 신규 모듈 로드	*/
			const id = sejak.fragment(target,fragment);
			try{ sejak.ctx.frag[id].h.onload(p); } catch(e){}			
			if(typeof cb === 'function') cb(res);
		});	
    },
	loadSejak : function(t, u, p, cb){

        let req = { u: u+`?${ new URLSearchParams(p).toString()}`, p: { method: "GET", headers: { "Content-Type": "text/html", }} };
		if(!u.endsWith('.html') && !u.endsWith('.htm')){
			let pr = []; for(let k in p) pr.push(k + "=" + p[k]);
			req = { u:u, p: {  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", }, body: pr.join('&') }};
		}	
        fetch(req.u, req.p)
		.then(function(response){
			if(response.ok) return response.text();
			else throw new Error('network error');
		})
		.then(function(res){
			
			const fragment = document.createElement('fragment'), target = t;
			fragment.innerHTML = res;

			/* 이전 모듈 정리	*/
			const prev = target.querySelector('section');
			if(prev != null){ 
				try{
					const pid = prev.id.split('-')[1];
					if(typeof sejak.ctx.frag[pid].h.onextract === 'function') sejak.ctx.frag[pid].h.onextract();
					delete sejak.ctx.frag[pid];
				} catch(e){}	
			}
			
			/* 신규 모듈 로드	*/
			const id = sejak.fragment(target,fragment);
			try{ sejak.ctx.frag[id].h.onload(p); } catch(e){ console.log(e); }			
			if(typeof cb === 'function') cb(res);
		});	
	},
	load : function(){
		document.querySelectorAll('[sejak]').forEach(function(e){
			eval(`var cont = ${e.innerText}`);
			if(cont.src !== undefined){
				sejak.loadSejak(e, cont.src, cont.param, function(res){
					console.log('ok');
					e.removeAttribute('sejak');
				});
			}
		});
	}
}

const $sejak = sejak.h;