//DOM树构建完成后执行
document.addEventListener('DOMContentLoaded', function () {
	//顶部商品总数
	var $totalItemNum = $(".total_itemNum");
	//条件筛选框
	var $searchBox = $(".searchBox");
	//全部城市筛选键
	var $cityAll = $(".cityAll");
	//城市筛选ul
	var $cityUl = $(".search_city_all");
	//全部分类筛选键
	var $categoryAll = $(".categoryAll");
	//分类筛选ul
	var $categoryUl = $(".search_category_all");
	//全部时间筛选键
	var $timeAll = $(".timeAll");
	//时间筛选ul
	var $timeUl = $(".search_time_all");
	//城市筛选更多
	var cityMore = document.querySelector('.cityMore');
	//城市筛选收起
	var cityBack = document.querySelector('.cityBack');
	//城市地点ul列表
	var search_city_num = document.querySelector('.search_city_num');
	//猜你喜欢内容外层div
	var likeItemBox = document.querySelector('.likeItemBox');
	//推荐排序
	var sort_rm = document.querySelector('.sort_rm');
	//时间排序
	var sort_time = document.querySelector('.sort_time');
	//列表结构
	var list_mode = document.querySelector('.list_mode');
	//块结构
	var dic_mode = document.querySelector('.dic_mode');
	//筛选内容框
	var search_list = document.querySelector('.search_list');
	//search_sort顶部右侧页码
	var $search_top_page = $('.search_top_page');

	//页码变量
	//列表结构的每页数量
	var listQty = 10;
	//块结构的每页数量
	var dicQty = 12;
	//当前页码
	var curPage = 1;
	//记录总页数变量
	var totalPage;
	//是否为块结构布尔值，默认false
	var isDic = false;
	//排序判断变量，默认为id排序
	var orderBy = 'id';
	//筛选条件变量，默认全部
	var selectCity = '全部';
	var selectCategory = '全部';

	backTop();

	(async () => {
		let fn = {
			//根据登录返回布尔值执行函数
			true: async () => {
				fn.createHasToken();
				fn.createClassifyContent();
			},
			false: async () => {
				fn.createNotToken();
				fn.createClassifyContent();
			},
			//请求函数
			isLogin() {
				//登录状态判断请求
				var tokenValue = '';
				if (localStorage.getItem("token") == null) {
					tokenValue = sessionStorage.getItem("token");
				} else {
					tokenValue = localStorage.getItem("token");
				}
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						headers: {
							token: tokenValue
						},
						url: 'http://localhost:3000/users/isLogin',
						success(data) {
							resolve(data);
						}
					})
				})
			},
			getCityData() {
				//获取城市数据请求
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/city',
						success(data) {
							resolve(data);
						}
					})
				})
			},
			getCategoryData() {
				//获取分类数据请求
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/category',
						success(data) {
							resolve(data);
						}
					})
				})
			},
			getShowData(isDic) {
				if (isDic) {
					//为块结构时
					var sendObj = {
						qty: dicQty,
						currentPage: curPage,
						order: orderBy,
						curCity: selectCity,
						curCategory: selectCategory
					}
				} else {
					//为列表结构时
					var sendObj = {
						qty: listQty,
						currentPage: curPage,
						order: orderBy,
						curCity: selectCity,
						curCategory: selectCategory
					}
				}
				//获取演出数据请求
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/getdata/show',
						data: sendObj,
						success(data) {
							resolve(data);
						}
					})
				})
			},
			//结构生成函数
			createHasToken() {
				//头部用户登录，已登录渲染函数
				var str = `<a href="personal.html" class="userName"><i class="iconfont icon-user"></i>${isLogin.nickname}</a>
							<ul class="userList">
								<li><a href="personal.html">个人信息</a></li>
								<li><a href="account.html">账号设置</a></li>
								<li><a href="orderlist.html">订单管理</a></li>
								<li><a href="javascript:;" id="signOut">退出登录</a></li>
								<div class="trianglebd"></div>
								<div class="triangle"></div>
							</ul>`
				$(".user").html(str);
				$("#signOut").on('click', () => {
					localStorage.removeItem("token");
					sessionStorage.removeItem("token");
					location.reload();
				})
			},
			createNotToken() {
				//头部用户登录，未登录渲染函数
				var str = `<a href="login.html" class="userName"><i class="iconfont icon-user"></i>登录</a>`
				$(".user").html(str);
			},
			createCitySelect(data) {
				//城市筛选渲染
				var str = '';
				for (let i = 0; i < data.length; i++) {
					str += `<li><a href="javascript:;">${data[i].name}</a></li>`;
				}
				$cityUl.html(str);
			},
			createCategorySelect(data) {
				//分类筛选渲染
				var str = '';
				for (let i = 0; i < data.length; i++) {
					str += `<li><a href="javascript:;">${data[i].name}</a></li>`;
				}
				$categoryUl.html(str);
			},
			createTopPage() {
				//初次生成结构调用
				//总页码
				var str = `<a href="javascript:;" class="search_prev"><</a>
							<p><span>${curPage}</span>/<span>${totalPage}</span></p>
							<a href="javascript:;" class="search_next">></a>`
				$search_top_page.html(str);
				//顶部页码事件绑定
				fn.topPageClick();
			},
			reCreateTopPage() {
				var str = `<a href="javascript:;" class="search_prev"><</a>
							<p><span>${curPage}</span>/<span>${totalPage}</span></p>
							<a href="javascript:;" class="search_next">></a>`
				$search_top_page.html(str);
			},
			createSearchList(data) {
				//查询列表结构渲染
				//数据数组
				var dataArr = data.data;
				//总长度，计算总页数
				var totalLen = data.totalLen;
				//总页码
				var totalPage = Math.ceil(totalLen / data.sendQty);
				//获取最低价格数组
				var startPriceArr = [];
				for (let i = 0; i < dataArr.length; i++) {
					let sp = dataArr[i].price.split(',')[0];
					startPriceArr.push(sp);
				}
				$totalItemNum.html(totalLen);
				//结构拼接
				var str = '';
				for (var i = 0; i < dataArr.length; i++) {
					str += `<li class="clearfix" data-sid="${dataArr[i].id}">
							<div class="search_img">
								<a href="javascript:;"><img src="${dataArr[i].img}" class="list_img"></a>
							</div>
							<div class="search_txt">
								<h3><a href="javascript:;" class="list_a">${dataArr[i].title}</a></h3>
								<p>${dataArr[i].first_play_date}</p>
								<p>${dataArr[i].place}</p>
								<p><em>${startPriceArr[i]}元</em><span>售票中</span></p>
							</div>
						</li>`;
				}
				//生成底部页码
				str += `<li class="search_list_page clearfix">
							<ul class="page_ul fr clearfix">`
				if (data.sendPage == 1) {
					str += `<li class="upPage gray"><上一页</li>`
				} else {
					str += `<li class="upPage"><上一页</li>`
				}
				for (let i = 1; i <= totalPage; i++) {
					if (data.sendPage == i) {
						str += `<li class="select">${i}</li>`
					} else {
						str += `<li>${i}</li>`
					}
				}
				if (data.sendPage == totalPage) {
					str += `<li class="downPage gray">下一页></li>`
				} else {
					str += `<li class="downPage">下一页></li>`
				}
				str += `	</ul>
				 		</li>`
				$(search_list).html(str);
				//绑定底部页码点击事件
				fn.bottomPageClick();
			},
			createSearchDic(data) {
				//查询块结构渲染
				//数据数组
				var dataArr = data.data;
				//总长度，计算总页数
				var totalLen = data.totalLen;
				//总页码
				var totalPage = Math.ceil(totalLen / data.sendQty);
				//获取最低价格数组
				var startPriceArr = [];
				for (let i = 0; i < dataArr.length; i++) {
					let sp = dataArr[i].price.split(',')[0];
					startPriceArr.push(sp);
				}
				$totalItemNum.html(totalLen);
				//结构拼接
				var str = '';
				// 每个li有4个内容块
				var liNum = Math.ceil(dataArr.length / 4);
				//记录数据数组的下标值
				var k = 0;
				//存储当前剩下的内容块数量
				var remainItem = dataArr.length;
				for (var i = 0; i < liNum; i++) {
					str += `<li class="clearfix">`;
					remainItem -= 4;
					if (remainItem >= 0) {
						for (var j = 0; j < 4; j++) {
							str += `<div class="search_dic_item" data-sid="${dataArr[k].id}">
										<div class="place">${dataArr[k].place}</div>
										<a href="javascript:;" class="pic"><img src="${dataArr[k].img}" class="dic_img"></a>
										<h3><a href="javascript:;" class="dic_a">${dataArr[k].title}</a></h3>
										<p>${dataArr[k].first_play_date}</p>
										<p><em>${startPriceArr[k]}</em><span>售票中</span></p>
									</div>`;
							k++;
						}
					}
					if (remainItem < 0) {
						for (var j = 0; j < 4 + remainItem; j++) {
							str += `<div class="search_dic_item" data-sid="${dataArr[k].id}">
										<div class="place">${dataArr[k].place}</div>
										<a href="javascript:;" class="pic"><img src="${dataArr[k].img}" class="dic_img"></a>
										<h3><a href="javascript:;" class="dic_a">${dataArr[k].title}</a></h3>
										<p>${dataArr[k].first_play_date}</p>
										<p><em>${startPriceArr[k]}</em><span>售票中</span></p>
									</div>`;
							k++;
						}
					}
				}
				//生成底部页码
				str += `<li class="search_list_page clearfix">
							<ul class="page_ul fr clearfix">`
				if (data.sendPage == 1) {
					str += `<li class="upPage gray"><上一页</li>`
				} else {
					str += `<li class="upPage"><上一页</li>`
				}
				for (let i = 1; i <= totalPage; i++) {
					if (data.sendPage == i) {
						str += `<li class="select">${i}</li>`
					} else {
						str += `<li>${i}</li>`
					}
				}
				if (data.sendPage == totalPage) {
					str += `<li class="downPage gray">下一页></li>`
				} else {
					str += `<li class="downPage">下一页></li>`
				}
				str += `	</ul>
				 		</li>`
				$(search_list).html(str);
				//绑定底部页码点击事件
				fn.bottomPageClick();
			},
			//点击事件函数
			topPageClick() {
				//search_sort顶部右侧页码点击
				$search_top_page.on('click', async (e) => {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					if (target.className == 'search_prev') {
						if (curPage == 1) {
							return;
						} else {
							curPage--;
							//页码改变后发送请求获取对应数据
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}
					}
					if (target.className == 'search_next') {
						var stopNum = $(e.target).prev().children().eq(1).html();
						//无内容查询到时返回判断
						if (curPage == totalPage || curPage >= stopNum) {
							return;
						} else {
							curPage++;
							//页码改变后发送请求获取对应数据
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}
					}
				})
			},
			bottomPageClick() {
				//绑定底部页码点击事件
				//结构生成后获取search_sort底部页码
				var $page_ul = $('.page_ul');
				//search_sort底部页码点击
				$page_ul.on('click', async (e) => {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					//点击有select类名页码
					if (target.className == 'select') {
						return;
					}
					//点击未选中页码
					if (target.tagName == 'LI' && target.className == '') {
						curPage = target.innerHTML;
						if (isDic) {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchDic(showData);
						} else {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchList(showData);
						}
						scrollTo(0, 345);
					}
					//点击上一页为第一页时，有gray类名
					if (target.className == 'upPage gray') {
						return;
					}
					//点击下一页为最后页时，有gray类名
					if (target.className == 'downPage gray') {
						return;
					}
					//点击上一页
					if (target.className == 'upPage') {
						//发送请求
						curPage--;
						if (isDic) {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchDic(showData);
						} else {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchList(showData);
						}
						scrollTo(0, 345);
					}
					//点击下一页
					if (target.className == 'downPage') {
						//无内容查询到时返回判断
						if ($(target).prev().html() == '&lt;上一页') {
							return;
						}
						//发送请求
						curPage++;
						if (isDic) {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchDic(showData);
						} else {
							let showData = await fn.getShowData(isDic);
							$(search_list).html('');
							totalPage = Math.ceil(showData.totalLen / showData.sendQty);
							fn.reCreateTopPage();
							fn.createSearchList(showData);
						}
						scrollTo(0, 345);
					}

				})
			},
			modeClick() {
				//筛选展示内容结构切换点击
				list_mode.onclick = async () => {
					list_mode.style.background = 'url(../img/sort_page.png) no-repeat -34px 11px #ed0a75';
					dic_mode.style.background = 'url(../img/sort_page.png) no-repeat -80px 11px';
					//加载列表结构
					isDic = false;
					let showData = await fn.getShowData(isDic);
					$(search_list).html('');
					totalPage = Math.ceil(showData.totalLen / showData.sendQty);
					fn.reCreateTopPage();
					fn.createSearchList(showData);
				}
				dic_mode.onclick = async () => {
					list_mode.style.background = 'url(../img/sort_page.png) no-repeat 11px 11px';
					dic_mode.style.background = 'url(../img/sort_page.png) no-repeat -125px 11px #ed0a75';
					//加载块结构
					isDic = true;
					let showData = await fn.getShowData(isDic);
					$(search_list).html('');
					totalPage = Math.ceil(showData.totalLen / showData.sendQty);
					fn.reCreateTopPage();
					fn.createSearchDic(showData);
				}
			},
			cityMoreClick() {
				//城市更多、收起点击
				//城市更多点击
				cityMore.onclick = function () {
					cityBack.style.display = 'block';
					cityMore.style.display = 'none';
					search_city_num.style.height = 'auto';
				}
				//城市收起点击
				cityBack.onclick = function () {
					cityBack.style.display = 'none';
					cityMore.style.display = 'block';
					search_city_num.style.height = '62px';
				}
			},
			sortClcik() {
				//排序按钮点击
				//排序点击
				sort_rm.onclick = async () => {
					sort_rm.classList.add('sortactive');
					sort_time.classList.remove('sortactive');
					//发送请求，按id排序获取数据
					orderBy = 'id';
					if (isDic) {
						let showData = await fn.getShowData(isDic);
						$(search_list).html('');
						totalPage = Math.ceil(showData.totalLen / showData.sendQty);
						fn.reCreateTopPage();
						fn.createSearchDic(showData);
					} else {
						let showData = await fn.getShowData(isDic);
						$(search_list).html('');
						totalPage = Math.ceil(showData.totalLen / showData.sendQty);
						fn.reCreateTopPage();
						fn.createSearchList(showData);
					}
				}
				sort_time.onclick = async () => {
					sort_time.classList.add('sortactive');
					sort_rm.classList.remove('sortactive');
					//发送请求，按日期排序获取数据
					orderBy = 'date';
					if (isDic) {
						let showData = await fn.getShowData(isDic);
						$(search_list).html('');
						totalPage = Math.ceil(showData.totalLen / showData.sendQty);
						fn.reCreateTopPage();
						fn.createSearchDic(showData);
					} else {
						let showData = await fn.getShowData(isDic);
						$(search_list).html('');
						totalPage = Math.ceil(showData.totalLen / showData.sendQty);
						fn.reCreateTopPage();
						fn.createSearchList(showData);
					}
				}
			},
			selectBoxClick() {
				//筛选条件点击
				$searchBox.on("click", async (e) => {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					if (target.tagName == 'A') {
						//城市
						if (target.className == "cityAll") {
							//取消所有高亮
							$cityUl.children().children().removeClass('active');
							//城市全部按键高亮
							$cityAll.addClass('active');
							selectCity = '全部';
							curPage = 1;
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}
						if (target.parentElement.parentElement.className == 'search_city_all clearfix') {
							//取消所有高亮
							$cityUl.children().children().removeClass('active');
							//当前选中高亮
							$(target).addClass('active');
							//城市全部按键取消高亮
							$cityAll.removeClass('active');
							selectCity = $(target).html();
							curPage = 1;
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}

						//分类
						if (target.className == "categoryAll") {
							//取消所有高亮
							$categoryUl.children().children().removeClass('active');
							//分类全部按键高亮
							$categoryAll.addClass('active');
							selectCategory = '全部';
							curPage = 1;
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}
						if (target.parentElement.parentElement.className == 'search_category_all clearfix') {
							//取消所有高亮
							$categoryUl.children().children().removeClass('active');
							//当前选中高亮
							$(target).addClass('active');
							//分类全部按键取消高亮
							$categoryAll.removeClass('active');
							selectCategory = $(target).html();
							curPage = 1;
							if (isDic) {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchDic(showData);
							} else {
								let showData = await fn.getShowData(isDic);
								$(search_list).html('');
								totalPage = Math.ceil(showData.totalLen / showData.sendQty);
								fn.reCreateTopPage();
								fn.createSearchList(showData);
							}
						}

						//时间
						if (target.className == "timeAll") {
							//取消所有高亮
							$timeUl.children().children().removeClass('active');
							//时间全部按键高亮
							$timeAll.addClass('active');
						}
						if (target.parentElement.parentElement.className == 'search_time_all clearfix') {
							//取消所有高亮
							$timeUl.children().children().removeClass('active');
							//当前选中高亮
							$(target).addClass('active');
							//时间全部按键取消高亮
							$timeAll.removeClass('active');
						}
					}
				})
			},
			searchListClick(){
				//演出列表点击事件
				$(search_list).on('click',(e)=>{
					var target = e.target;
					if(target.className == 'dic_img' || target.className == 'dic_a'){
						var curSid = $(target).parent().parent().attr('data-sid');
						location.href = `details.html?id=${curSid}`;
					}
					if(target.className == 'list_img' || target.className == 'list_a'){
						var curSid = $(target).parent().parent().parent().attr('data-sid');
						location.href = `details.html?id=${curSid}`;
					}
				})
			},
			//初始设置函数
			setSelectActive(){
				//初始化筛选高亮部分
				//url无传参，默认全部高亮
				if (location.search == '') {
					$cityAll.addClass('active');
					$categoryAll.addClass('active');
					$timeAll.addClass('active');
				} else {
					//获取url带参部分 
					let params = location.search;
					//去除开头?
					params = params.substring(1);
					//以等号分割
					params = params.split('=');
					let getCategory = decodeURI(params[1])
					selectCategory = getCategory;
					//遍历分类，对应名称的标签高亮
					for (let i = 0; i < $categoryUl.children().length; i++) {
						if($categoryUl.children().children().eq(i).html() == getCategory){
							$categoryUl.children().children().eq(i).addClass('active');
						}
					}
					$cityAll.addClass('active');
					$timeAll.addClass('active');
				}
			},
			//生成结构
			createClassifyContent: async () => {
				//获取城市数据
				let cityData = await fn.getCityData();
				fn.createCitySelect(cityData);
				let categoryData = await fn.getCategoryData();
				fn.createCategorySelect(categoryData);
				fn.cityMoreClick();
				fn.sortClcik();
				fn.setSelectActive();
				fn.selectBoxClick();
				let showData = await fn.getShowData(isDic);
				totalPage = Math.ceil(showData.totalLen / showData.sendQty);
				fn.modeClick();
				fn.createTopPage();
				fn.createSearchList(showData);
				fn.searchListClick();
			}
		}
		let isLogin = await fn.isLogin();
		fn[isLogin.status]();

		//生成猜你喜欢HTNL结构
		var _likeData = likeData();
		getlikeItem(_likeData);

		//猜你喜欢渲染
		function getlikeItem(likeData) {
			var str = '';
			likeData.map(function (item) {
				//传入对象解构
				var { like_img, like_title, like_place, like_time, like_price } = item;
				str += `<a href="javascript:;" class="likeItem">
							<div class="itemImg">
								<img src="../${like_img}">
							</div>
							<div class="itemInfo">
								<div class="title">${like_title}</div>
								<div class="place">${like_place}</div>
								<div class="time">${like_time}</div>
								<div class="price">￥${like_price}起</div>
							</div>
						</a>`
			}).join('');
			likeItemBox.innerHTML = str;
		}
	})()
})