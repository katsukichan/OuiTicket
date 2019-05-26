//DOM树构建完成后执行
document.addEventListener('DOMContentLoaded',function(){
	//轮播图div
	var banner = document.querySelector('.banner');
	var ulBox = banner.children[0];
	var firstImg = ulBox.children[0].children[0].children[0];
	//图片切换按键div
	var nav = banner.children[3];
	//图片后退按键
	var prev = banner.children[1];
	//图片前进按键
	var next = banner.children[2];
	//首页主体内容div
	var $msgFrameBox = $(".msgFrameBox");
	//分类选择导航
	var $category = $(".category");	
	backTop();

	//轮播图代码
	//3复制索引值所在的元素，追加到ul的最后面
	var cloneLi = ulBox.children[0].cloneNode(true);
	ulBox.appendChild(cloneLi);
	// 获取ul的子元素长度
	var len = ulBox.children.length;
	//定义img对应索引值
	var idx = 0;
	//定时器名称为全局变量，解决清除定时器问题
	var timer;
	// 1.banner呈现图片，宽度为第一张图片的宽度。ul的宽度=图片的宽度*图片张数
    //  * 必须等待第一张图片加载完成后，再获取宽度
    firstImg.onload = function(){
    	ulBox.style.width = firstImg.offsetWidth * len + 'px';
    }
    //autoPlay中需要用到nav，所以createPage返回nav
    var nav = createPage();
    autoPlay();
    //4鼠标移入，清除定时器,移出，重新开始定时器
    banner.onmouseover = function(){
    	clearInterval(timer);
    }
    banner.onmouseout = function(){
    	autoPlay();
    }
    //5点击小圆点，获取span的data-idx ==> 索引
    nav.onclick = function(e){
    	if(e.target.tagName === 'SPAN'){
    		//取值并赋值到全局idx
    		idx = e.target.getAttribute('data-idx');
    		showPic();
    	}
    }
    //点击左箭头
    prev.onclick = function(){
    	idx--;
    	showPic();
    }
    //点击右箭头
    next.onclick = function(){
    	idx ++;
    	showPic();
    }
    //2开启定时器，定义一个索引（0 1），索引改变从而改变ul的left值
    //轮播图播放函数
    function autoPlay(){
    	timer = setInterval(function(){
	    	idx ++;
	    	showPic();
    		},5000)
    }
    //只呈现图片
    function showPic(){
    	if(idx < 0){
    		ulBox.style.left = - firstImg.offsetWidth * (len-1) + 'px';
    		idx = len-2;
    	}
    	//当索引值等于ul数组长度，left重新赋值为0,idx赋值为第二张图的索引
    	if(idx == len){
    		ulBox.style.left = 0;
    		idx = 1;
    	}
    	//4滚动过程中索引改变，去除所有高亮，再让对应的索引高亮
    	//  *  当到达复制那张图片的索引时，对应索引为0的圆点高亮
    	//其余取消高亮
    	for(var i=0;i<len-1;i++){
    		nav.children[i].classList.remove('active');
    	}
    	//由于cloneLi多出一张图片，到达该图片索引时给第一张图的角标高亮
    	if(idx == len-1){
    		nav.children[0].classList.add('active');
    	}else{
    		nav.children[idx].classList.add('active');
    	}
		// ulBox.style.left = - firstImg.offsetWidth * idx + 'px';
		//调用common.js里封装的缓冲动画
		animate(ulBox,{left:- firstImg.offsetWidth * idx},30);
    }
    //创建圆点页标函数
    function createPage(){
    	//3生成右下点击标签，根据len-1生成圆点数量
	    for(var i=0;i<len-1;i++){
	    	var page = document.createElement('span');
	    	//设置标准属性，用于之后点击取值并赋值到全局idx
	    	page.dataset.idx = i;
	    	nav.appendChild(page);
	    }
	    //添加高亮类名
	    nav.children[0].classList.add('active');
	    return nav;
	}
	
	(async()=>{
		let fn = {
			//根据登录返回布尔值执行函数
			true: async()=>{
				//已登录状态结构生成
				fn.createHasToken();
				fn.createIndexContent();
			},
			false: async()=>{
				//未登录状态结构生成
				fn.createNotToken();
				fn.createIndexContent();
			},
			//请求函数
			isLogin(){
				//登录状态判断请求
				var tokenValue = '';
				if(localStorage.getItem("token") == null){
					tokenValue = sessionStorage.getItem("token");
				}else{
					tokenValue = localStorage.getItem("token");
				}
				return new Promise((resolve,reject)=>{
					$.ajax({
						type: 'post',
						headers: {
							token : tokenValue
						},
						url: 'http://localhost:3000/users/isLogin',
						success(data){
							resolve(data);
						}
					})
				})
			},
			getCategoryData(){
				return new Promise((resolve,rject)=>{
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/category',
						success(data){
							resolve(data);
						}
					})
				})
			},
			getShowData(category){
				//根据传入分类得到数据 如 动漫
				return new Promise((resolve,reject)=>{
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/getdata/showByCategory',
						data: {
							type: category
						},
						success(data){
							resolve(data);
						}
					})
				})
			},
			//结构生成函数
			createHasToken(){
				//头部用户登录，已登录渲染函数
				var str = `<a href="html/personal.html" class="userName"><i class="iconfont icon-user"></i>${isLogin.nickname}</a>
							<ul class="userList">
								<li><a href="html/personal.html">个人信息</a></li>
								<li><a href="html/account.html">账号设置</a></li>
								<li><a href="html/orderlist.html">订单管理</a></li>
								<li><a href="javascript:;" id="signOut">退出登录</a></li>
								<div class="trianglebd"></div>
								<div class="triangle"></div>
							</ul>`
				$(".user").html(str);
				$("#signOut").on('click',()=>{
					localStorage.removeItem("token");
					sessionStorage.removeItem("token");
					location.reload();
				})
			},
			createNotToken(){
				//头部用户登录，未登录渲染函数
				var str = `<a href="html/login.html" class="userName"><i class="iconfont icon-user"></i>登录</a>`
				$(".user").html(str);
			},
			createCategoryNav(data){
				//分类导航栏只显示前10个分类名称
				var str = `<a href="javascript:;" class="category_list">
								<span class="category_icon live"></span>
								<p class="category_name">${data[0].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon opera"></span>
								<p class="category_name">${data[1].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon sport"></span>
								<p class="category_name">${data[2].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon child"></span>
								<p class="category_name">${data[3].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon vacation"></span>
								<p class="category_name">${data[4].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon concert"></span>
								<p class="category_name">${data[5].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon speak"></span>
								<p class="category_name">${data[6].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon dance"></span>
								<p class="category_name">${data[7].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon comic"></span>
								<p class="category_name">${data[8].name}</p>
							</a>
							<a href="javascript:;" class="category_list">
								<span class="category_icon exhibition"></span>
								<p class="category_name">${data[9].name}</p>
							</a>`
				$category.html(str);
			},
			createMsgFrame(data){
				//执行生成一个msgFrame
				//获取一种分类的演出，拿7个长度，第一个放到左侧大图，剩余放右侧
				//获取最低价格数组
				var startPriceArr = [];
				for(let i=0;i<7;i++){
					let sp = data[i].price.split(',')[0];
					startPriceArr.push(sp);
				}
				//生成msgFrame元素
				var $msgFrame = $(`<div class="msgFrame"></div>`);
				var str = `<h2 class="clearfix">
								<span class="type_name">${data[0].category}</span>
								<a href="javascript:;" class="cur_check_all">查看全部</a>
							</h2>
							<div class="content_box">
								<a href="javascript:;" class="box_left" data-sid=${data[0].id}>
									<img src="${data[0].img}" class="left_img">
									<div class="box_leftInfo">
										<div class="title">${data[0].title}</div>
										<div class="price">￥${startPriceArr[0]}起</div>
									</div>
								</a>
								<div class="box_right">`;
				for(let i=1;i<7;i++){
					str += `<a href="javascript:;" class="box_rightItem" data-sid=${data[i].id}>
			   			<div class="itemImg"><img src="${data[i].img}" class="right_img"></div>
					   		<div class="itemInfo"><div class="title">${data[i].title}</div>
					   		<div class="place">${data[i].place}</div>
					   		<div class="time">${data[i].first_play_date}</div>
					   		<div class="price">￥${startPriceArr[i]}起</div>
			   			</div>
			   		</a>`;
				}
				str += `</div>`;
				//插入结构 添加到父元素
				$msgFrame.html(str).appendTo($msgFrameBox);
			},
			//点击事件函数
			categoryNavClick(){
				//分类导航点击事件
				$category.on('click',(e)=>{
					var target = e.target;
					var curCategory;
					if(target.tagName == 'A'){
						curCategory = $(target).children().eq(1).html();
					}
					if(target.tagName == 'SPAN'){
						curCategory = $(target).next().html();
					}
					if(target.tagName == 'P'){
						curCategory = target.innerHTML;
					}
					location.href = `html/classify.html?category=${curCategory}`;
				})
			},
			msgFrameClick(){
				//消息框点击事件，父元素事件委托
				$msgFrameBox.on('click',(e)=>{
					var target = e.target;
					if(target.className == 'cur_check_all'){
						var curCategory = $(target).prev().html();
						location.href = `html/classify.html?category=${curCategory}`;
					}
					//演出点击判断
					if(target.className == 'title' || target.className == 'place' || target.className == 'time' || target.className == 'price'){
						var curSid = $(target).parent().parent().attr('data-sid');
						//打开新页面 window.open
						window.open(`html/details.html?id=${curSid}`);
					}
					if(target.className == 'right_img'){
						var curSid = $(target).parent().parent().attr('data-sid');
						window.open(`html/details.html?id=${curSid}`);
					}
					if(target.className == 'left_img'){
						var curSid = $(target).parent().attr('data-sid');
						window.open(`html/details.html?id=${curSid}`);
					}
				}) 
			},
			createIndexContent: async()=>{
				//获取分类导航数据
				let categoryData = await fn.getCategoryData();
				fn.createCategoryNav(categoryData);
				fn.categoryNavClick();
				//获取首页演出数据
				let data1 = fn.getShowData('动漫');
				let dmData;
				//获取promiseValue值 
				await data1.then((result)=>{
					dmData = result;
				})

				let data2 = fn.getShowData('演唱会');
				let ychData; 
				await data2.then((result)=>{
					ychData = result;
				})

				let data3 = fn.getShowData('话剧歌剧');
				let hjData; 
				await data3.then((result)=>{
					hjData = result;
				})

				let data4 = fn.getShowData('体育赛事');
				let tyData; 
				await data4.then((result)=>{
					tyData = result;
				})

				fn.createMsgFrame(dmData);
				fn.createMsgFrame(ychData);
				fn.createMsgFrame(hjData);
				fn.createMsgFrame(tyData);
				fn.msgFrameClick();
			}
		}
		let isLogin = await fn.isLogin();
		fn[isLogin.status]();
	})()
})