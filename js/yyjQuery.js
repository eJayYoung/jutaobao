/*yyjQuery*/
'use strict'
/*数组查重*/
function findInArr(n,arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i]==n){
            return true;
        }
    }
    return false;
};
/*随机数*/
function rnd(n,m){
    return parseInt(Math.random()*(m-n)+n);
};
/*十位补零*/
function toDou(n){
    return n<10?'0'+n:''+n;
};
/*选项卡*/
function tab(id,sEv){
    var oBox=document.getElementById(id);
    var aBtn=oBox.getElementsByTagName('input');
    var aDiv=oBox.getElementsByTagName('div');
    for(var i=0;i<aBtn.length;i++){
        aBtn[i].index=i;
        aBtn[i][sEv]=function(){
            for(var i=0;i<aBtn.length;i++){
                aBtn[i].className="";
                aDiv[i].className="";
            }
            aBtn[i].className="on";
            aDiv[this.index].className="show";
        }
    }
};
/*添加class*/
function addClass(obj,sClass){
    if(obj.className){
        var re=new RegExp('\\b'+sClass+'\\b');
        if(obj.className.search(re)==-1){
            obj.className+=' '+sClass;
        }
    }else{
        obj.className=sClass;
    }
}
/*删除class*/
function removeClass(obj,sClass){
    if(obj.className){
        var re=new RegExp('\\b'+sClass+'\\b');
        obj.className=obj.className.replace(re,'').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
    }
    if(obj.className==''){
        obj.removeAttribute('class');
    }
}
/*查询class名个数*/
function getByClass(obj,sClass){
    var aResult=[];
    var aEle=obj.getElementsByTagName('*');
    for(var i=0;i<aEle.length;i++){
        var aClass=aEle[i].className.split(' ');
        if(findInArr(sClass,aClass)){
            aResult.push(aEle[i]);
        }
    }
    return aResult.length;
};
/*获取非行间样式*/
function getStyle(obj,sName){
    // if(obj.currentStyle){
    //     return obj.currentStyle[sName];
    // }else{
    //     return getComputedStyle(obj,false)[sName];      //false为兼容firefox3.0
    // }
    return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
/*设置样式*/
function setStyle(obj,json){
    for(var name in json){
        obj.style[name]=json[name];
    }
}
/*拍卖倒计时*/
function sTate(obj,start,end){
    var aS1=obj.getElementsByTagName('strong')[0];
    var aS2=obj.getElementsByTagName('span')[0];
    var timer=null;
    var timer2=null;
    countDown1();
    function countDown1(){
        start--;
        if(start<0){
            clearInterval(timer);
            start=0;
            aS1.className='start';
            aS1.innerHTML='正在拍卖';
            countDown2();
            function countDown2(){
                end--;
                if(end<0){
                    clearInterval(timer2);
                    end=0;
                    aS2.className='end';
                    aS2.innerHTML='拍卖结束';
                }
                aS2.innerHTML=parseInt(end/60)+':'+end%60;
            }
            timer2=setInterval(countDown2,1000);
        }
        aS2.innerHTML=parseInt(start/60)+':'+satrt%60;
    }
    timer=setInterval(countDown1,1000);
};
/*手写sort中查找数组中最小值并替换*/
function findMin(arr,start){
    var iMin=arr[start];
    var iMinIndex=start;
    for(var i=start+1;i<arr.length;i++){
        if(arr[i]<iMin){
            iMin=arr[i];
            iMinIndex=i;
        }
    }
    return iMinIndex;
};
/*添加和删除事件监听*/
function addEvent(obj,sEv,fn){
    if(obj.addEventListener){
        obj.addEventListener(sEv,fn,false);
    }else{
        obj.attachEvent('on'+sEv,fn);
    }
};
function removeEvent(obj,sEv,fn){
    if(obj.removeEventListener){
        obj.removeEventListener(sEv,fn,false);
    }else{
        obj.detachEvent('on'+sEv,fn);
    }
};
/*添加鼠标滚轮事件*/
function addWheel(obj,fn){
    function fnDir(ev){
        var oEvent=ev||event;
        var dir=oEvent.wheelDelta?oEvent.wheelDelta<0:oEvent.detail>0;
        fn&&fn(dir);
        oEvent.preventDefault&&oEvent.preventDefault();
        return false;
    }
    if(window.navigator.userAgent.indexOf('Firefox')!=-1){
        addEvent(obj,'DOMMouseScroll',fnDir);
    }else{
        addEvnet(obj,'mousewheel',fnDir);
    }
};
/*文档准备事件*/
function DOMReady(fn){
    if(document.addEventListener){
        addEvent(document,'DOMContentLoaded',function(){
            fn&&fn();
        });
    }else{
        addEvent(document,'readystatechange',function(){
            if(document.readtStae=='complete'){
                fn&&fn();
            }
        });
    }
};
/*运动框架
*默认运动时间700ms
*默认运动类型ease-out
*/
function startMove(obj,json,options){
    //obj,{width:目标位置},...
    options=options||{};
    options.duration=options.duration||700;
    options.easing=options.easing||'ease-out';

    var start={};
    var dis={};
    for(var name in json){
        start[name]=parseFloat(getStyle(obj,name));
        if(isNaN(start[name])){
            start[name]=1;
        }
        dis[name]=json[name]-start[name];
    }
    var count=Math.floor(options.duration/30);
    var n=0;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;
        for(var name in json){
            switch(options.easing){
                case 'linear':
                    var cur=start[name]+dis[name]*n/count;
                break;
                case 'ease-in':
                    var cur=start[name]+dis[name]*Math.pow(n/count,3);
                break;
                case 'ease-out':
                    var cur=start[name]+dis[name]*(1-Math.pow(1-n/count,3));
                break;
            }
            if(name=='opacity'){
                obj.style.opacity=cur;
                obj.style.filter='alpha(opacity:'+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }
        if(n==count){
            clearInterval(obj.timer);
            options.complete&&options.complete();
        }
    },30);
}

//设置、获取、清除cookie
function setCookie(sName,sValue,iDay){
    if(iDay){
        var oDate = new Date();
        oDate.setDate(oDate.getDate()+iDay);
        oDate.setHours(0,0,0,0);
        document.cookie=sName+'='+sValue+'; PATH=/; EXPIRES='+oDate.toGMTString();
    }else{
        document.cookie=sName+'='+sValue+'; PATH=/';
    }
}
function getCookie(sName){
    var arr = document.cookie.split('; ');
    for(var i=0;i<arr.length;i++){
        var arr2 = arr[i].split('=');
        if(arr2[0]==sName){
            return arr2[1];
        }
    }
}
function removeCookie(sName){
    setCookie(sName,1,-10);
}