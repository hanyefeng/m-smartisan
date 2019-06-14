function debounce(fun, delay){
    let t = null;
    return function(){
        clearTimeout(t)
        t = setTimeout(()=>{
            fun();
        }, delay)
    }
}

function throttle(fun, duration) {
    let lasttime = 0;
    return function(){
        //判断上一次执行的时间
        //当前时间
        let now = new Date().getTime();
        //查看时间间隔
        //间隔如果小于duration 不执行
        if(now - lasttime > duration) {
            fun(arguments);
            lasttime = new Date().getTime();
        }
    }
}


function addCookie(key,value,days) {
	var now = new Date();
	now.setDate(now.getDate() + days);
	document.cookie = key+"="+value+"; expires="+now+";path="+"/"
}

function getCookie(key) {
	var str = document.cookie; 
	if(!str) return null;
	
	var reg1 = new RegExp(key+"=([^;]+)$");
	var reg2 = new RegExp(key+"=([^;]+);");
	if(reg1.test(str)) {
		return str.match(reg1)[1];
	} else {
		return str.match(reg2)[1];
	}
}

function num2money(num){
    let a=String(num);
    let b=a.split("").reverse();
    for(let i=0;i<b.length;i++){
        if((i+1)%4==0){
            b.splice(i,0,',');
        }
    }
    b.reverse(); 
    let str = '';
    for(let i=0;i<b.length;i++){
        str += b[i]	
    }
    return str;
}