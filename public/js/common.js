//原型式继承方法封装
function object(o){
    function F(){}
    F.prototype = o;//F.prototype = 传入父类.prototype
    return new F();
}
/**
 * [任意位数随机数字]
 * @param  {Number} n [n位数]
 * @return {String}   [返回的数字]
 */
function randomCode(n){
	// 显示4为随机数
	// 字符串拼接
	var mycode = '';
	for(var i=0;i<n;i++){
		mycode += parseInt(Math.random()*10);
	}

	return mycode;
}

// randomCode(4);
// randomCode(6);
/**
 * [任意位数随机字母数字验证码]
 * @param  {Number} n [随机验证码的位数]
 * @return {String}   [返回的验证码]
 */
function randomStrCode(n){
    //显示n位随机验证码
    //字符串拼接
    var str = '0123456789abcdefghijklmnopqrstuvwxyz';
    var strCode = '';
    for(var i=0;i<n;i++){
        var idx = parseInt(Math.random()*str.length);
        strCode += str[idx];
    }
    return strCode;
}
/**
 * [数组去重]
 * @param  {arr} [数组]
 * @return {String}   [返回的去重后的新数组]
 */
function norepeat(arr){
	//定义空数组
	var newArr = [];
	for(var i=0;i<arr.length;i++){
		for(var j=0;j<newArr.length;j++){
		//遍历newArr，判断是否有相同元素
			if(arr[i] === newArr[j]){
				break;
			}
		}
		if(j === newArr.length){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}


/**
 * 随机颜色
 * @return {String} [rgb颜色]
 */
function randomColor(num){
	if(num === 16){
		var str = '0123456789abcdef';//str[0]
		
		var color = '#';
		
		for(var i=0;i<6;i++){
			// 获取随机索引值
			var idx = parseInt(Math.random()*str.length);

			// 根据随机索引值得到随机16进制字符
			color += str[idx];
		}

		return color;
	}else{
		var r = parseInt(Math.random()*256);
		var g = parseInt(Math.random()*256);
		var b = parseInt(Math.random()*256);


		return 'rgb('+r+','+g+','+b+')';
		
	}
}


/**
 * 任意范围内的随机整数
 * @param  {Number} min [最小值]
 * @param  {Number} max [最大值]
 * @return {Number}     [min-max间的随机整数]
 */

function randomNumber(min,max){
	// Math.random();//0-1（不包括1）的数

	/*
		Math.random()		res
		0					min
		1					max
	 */
	return parseInt(Math.random()*(max-min+1))+min;
}

// randomNumber(0,255);
// randomNumber(1,100);
// randomNumber(100,999);


var Element = {
	// 对象的方法

	/**
	 * 过滤非元素节点
	 * @param  {Array} nodes [节点集合]
	 * @return {Array} [返回只包含元素节点的数组]
	 */
	get:function(nodes){
		// 用于存放结果
		var res = [];

		// 删除非元素节点
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].nodeType === 1){
				res.push(nodes[i]);
			}
		}

		return res;
	},

	/**
	 * [得到ele元素下的所有子元素]
	 * @param  {Element} ele [父元素]
	 * @return {Array}     [ele元素的所有子元素]
	 */
	children:function(ele){
		// var res = [];

		// for(var i=0;i<ele.childNodes.length;i++){
		// 	if(ele.childNodes[i].nodeType === 1){
		// 		res.push(ele.childNodes[i]);
		// 	}
		// }

		// return res;

		return this.get(ele.childNodes);
	},

	// 得到前一个元素节点
	prev:function(ele){
		var res = ele.previousSibling;

		// while循环方案
		// while(res.nodeType !== 1 && res !== null){
		// 	res = res.previousSibling
		// }

		// return res;


		// 递归方案
		if(res===null || res.nodeType === 1){
			return res;
		}

		return this.prev(res);
	},

	// 得到后一个元素节点
	next:function(ele){
		var res = ele.nextSibling;
		if(res===null || res.nodeType === 1){
			return res;
		}

		return this.next(res);
	},

	// 兼容IE8-
	getByClass:function(name){
		//存在该方法调用
		if(document.getElementsByClassName){
			return document.getElementsByClassName(name);
		}
		//IE8-
		//var nodes=document.getElementsByTagName("*");//获取页面里所有元素，因为他会匹配全页面元素，所以性能上有缺陷，但是可以约束他的搜索范围；  
		var arr=[];//用来保存符合的className；  
		for(var i=0;i<nodes.length;i++){  
			if(hasClass(nodes[i],className)) arr.push(nodes[i]);  
		}  
		return arr;
	}
}

/**
 * [获取元素的css样式，兼容IE8-]
 * @param  {Element} ele  [获取样式的元素]
 * @param  {String} attr [css属性名]
 * @return {String}      [返回attr对应的css属性值]
 */
function getCss(ele,attr){
	// 不要判断是否为IE6,IE7,IE8
	// 而是判断用户的浏览器是否支持某一个方法
	if(window.getComputedStyle){
		// 标准浏览器
		return getComputedStyle(ele)[attr];
	}else if(ele.currentStyle){
		// IE6,7,8
		return ele.currentStyle[attr];
	}else{
		// 其他浏览器，直接返回内联样式
		return ele.style[attr];
	}
}

// getCss(box,'font-size');//30px

var Cookie = {
	//增 改
	/**
	 * 设置cookie
	 * @param  {String} name [cookie名]
	 * @param  {String} value [cookie值]
	 * @param {[Object]} params  [参数，是一个对象]
		* expires     {Date}       日期
		* path        {String}     保存路径
		* domain      {String}     域名
		* secure      {Boolean}    安全性
	 */
	set: function(name,value,params){
		//必填
		var str = name + '=' + value;
		//判断是否有参数
		if(params){
			//有效期
			if(params.expires){
				str += ';expires=' + params.expires.toUTCString();
			}
			//保存路径
			if(params.path){
				str += ';path=' + params.path;
			}
			//域名
			if(params.domain){
				str += ';domain=' + params.domain;
			}
			//安全性
			if(params.secure){
				str += ';secure';
			}
		}
		document.cookie = str;
	},
	//删
	remove: function(name){
		var now = new Date();
		now.setDate(now.getDate()-1);
		//document.cookie = name + '=null;expirse=' + now.toUTCString();
		//利用设置达到删除效果
		this.set(name,'null',{expirse:now});
	},
	//查
	/**
	 * 获取name对应的cookie值
	 * @param  {String} name [cookie名]
	 * @return  {String}  [返回name对应的cookie值]
	 */
	get: function(name){
		//获取所有cookie
		var all = document.cookie;
		//用于保存结果
		var res = '';
		//分割 String --> Arry
		var cookies = all.split('; ');
		//遍历
		cookies.forEach(function(item){
			//拆分name 和 value
			var arr = item.split('=');
			if(arr[0]===name){
				res = arr[1];
			}
		});
		return res;
	}
}

/**
 * [事件绑定兼容]
 * @param  {Element} ele  [事件绑定元素]
 * @param  {String} type [事件类型]
 * @param {function} fn  [事件函数]
 * @param {Boolean} isCapture [是否捕获]
 */
 function bind(ele,type,fn,isCapture){
 	if(ele.addEventListener){
 		ele.addEventListener(type,fn,isCapture);
 	}else if(ele.attachEvent){
 		ele.attachEvent('on' + type,fn);
 	}else{
 		ele['on' + type] = fn;
 	}
 }


/**
 * [缓冲动画]
 * @param  {Element} ele  [获取动画的元素]
 * @param  {Object} obj [ele的属性对象]
 * 		attr     {Sting}       属性名
 *  	target   {Number}      动画的目标值
 * @param {Number} time [定时器时间(毫秒)]
 * @param {function} fn [函数]
 */
//1.开启定时器
//(1)获取当前值
//(2)获取当前速度(目标值-当前值).
//     * 当速度大于0时，Math.ceil()
//     * 当速度小于0时，Math.floor()
//(3)改变当前值：当前值+速度
//(3)将改变后的值赋值给元素的样式
//(4)当改变后的值等于目标值，清除定时器
//备注: 事件开启定时器之前，一定要记得先清除已存在的定时器。
 function animate(ele,obj,time,fn){
	//3为实现所有动画执行完毕后，进行fn操作，首先存储执行次数
	var count = 0;
	//对象遍历
	for(var key in obj){
		count ++;
		//2.1利用let，将attr、target的值保留在当前的块级作用域
		let attr = key;
		let target = obj[key];
		/*2.2利用函数的形参，将attr、target的值存在局部作用域
		var attr = key;
		var target = attr[key];
		然后将下面代码封装成函数，传参，假若封装成show
		show(attr,target);*/
		clearInterval(ele[attr + "Timer"]);
 		//1定时器赋值给的变量名不同，不会发生覆盖，实现多个动画进行
 		ele[attr + "Timer"] = setInterval(function(){
	 		var current = window.getComputedStyle(ele)[attr];
	 		var unit = current.match(/[a-z]+$/);
	 		unit = unit? unit[0] : '';
	 		current = parseFloat(current);
	 		var speed = (target-current)/10;
	 		if(attr === 'opacity'){
	 			speed = speed>0? 0.01 : -0.01;
	 		}else{
	 			speed = speed>0? Math.ceil(speed) : Math.floor(speed);
	 		}
	 		current += speed;
	 		if(current == target){
	            clearInterval(ele[attr + "Timer"]);
	            current = target;
	            //3当count减为0时，即为最后一个动画执行完毕
	            count --;
	            if(count == 0 && fn && typeof(fn) == "function"){
	            	fn();
	            }
        	}
 			ele.style[attr] = current + unit;
 		},time)
	}
 }

 /**
 * [匀速动画]
 * @param  {String} speed [速度值]
 * @param  {Element} ele  [获取动画的元素]
 * @param  {String} attr [ele的属性名]
 * @param {Number} target [动画的目标值]
 * @param {Number} time [定时器时间(毫秒)]
 */
function linearAnimate(speed,ele,attr,target,time){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		//获取当前值
		var current = window.getComputedStyle(ele)[attr];
		//提取单位
 		var unit = current.match(/[a-z]+$/);
 		//判断有无单位并赋值
 		unit = unit? unit[0] : '';
 		//取到数值，不用parseInt是考虑到可能小数
 		current = parseFloat(current);
 		//改变当前值
 		current += speed;
 		ele.style[attr] = current + unit;
 		if(speed>0 && current >= target || speed<0 && current <= target){
			current = target;
        	clearInterval(ele.timer);
		}
	})
}


 /**
 * [获取两个日期之间的日期]
 * @param  {String} start [开始日期]
 * @param  {String} end  [结束日期]
 */
//获取两个日期之间的日期，同年份，前日期不大于后日期
//getBetweenDateStr('2019-04-18','2019-04-21');
//返回包含放入日期数组

//因2月的28号问题，同年同月时以29-31日期为开始日期 会出现bug 
//如getBetweenDateStr('2018-12-29','2018-12-31');
function getBetweenDateStr(start,end){
    var result = [];
    var beginDay = start.split("-");
    var endDay = end.split("-");
    var diffDay = new Date();
    var dateList = new Array;
    var i = 0;
    diffDay.setDate(beginDay[2]);
    diffDay.setMonth(beginDay[1]-1);
    diffDay.setFullYear(beginDay[0]);
    result.push(start);
    while(i == 0){
        var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
        diffDay.setTime(countDay);
        dateList[2] = diffDay.getDate();
        dateList[1] = diffDay.getMonth() + 1;
        dateList[0] = diffDay.getFullYear();
        if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]};
        if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]};
        result.push(dateList[0]+"-"+dateList[1]+"-"+dateList[2]);
        if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;
        }
	};
    return result;
};