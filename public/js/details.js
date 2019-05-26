document.addEventListener("DOMContentLoaded", function () {
	//页面大图片img
	var $detailsImg = $(".details_img");
	//上方标题
	var $topTitle = $(".details_title");
	//题头 时间 等结构外层div
	var $detailsMsg = $('.detailsMsg');
	//场次选择div
	var showTime = document.querySelector('.showTime');
	//场次选择ul子元素
	var showTimeLst = showTime.children[0].children;
	//价格选择div
	var showPrice = document.querySelector('.showPrice');
	//价格选择ul
	var showPriceLst = showPrice.children[0];
	//购票车ul
	var ticketCar = document.querySelector('.ticketCar');
	//购票车ul外层div
	var ticketCarBox = ticketCar.parentElement;
	//购买按键div
	var buyBtnBox = document.querySelector('.buyBtn');
	//购买按键
	var buyBtn = buyBtnBox.children[0];
	//有关详细信息标签切换ul
	var detailsBox = document.querySelector('.detailsBox');
	//各标签
	var tabItems = detailsBox.children[0].children[0].children;
	//标签内容
	var tabContent = detailsBox.children[1].children;
	//登录状态判断值，用于购物车购买前判断
	var allowToBuy;

	(async () => {
		let fn = {
			true: async (uid) => {
				fn.createHasToken();
				fn.createDetailsContent(uid);
			},
			false: async () => {
				fn.createNotToken();
				fn.createDetailsContent();
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
			getShowData() {
				//获取url传入的id
				let params = location.search;
				//去除开头?
				params = params.substring(1);
				//以等号分割
				params = params.split('=');
				let getId = decodeURI(params[1]);
				return new Promise((resolve, reject) => {
					//发送请求
					$.ajax({
						type: 'get',
						url: `http://localhost:3000/getdata/showById`,
						data: {
							sid: getId
						},
						success(data) {
							resolve(data);
						}
					})
				})
			},
			//结构生成渲染函数
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
			createPageData(data) {
				//获取到的数据渲染函数
				//时间数据处理
				var timeSplit1 = data.time.split(",");
				//时间
				var time = timeSplit1[1];
				//年日期
				var yearDate = timeSplit1[0];
				var timeSplit2 = yearDate.split("/");
				//处理跨年
				if (timeSplit2.length > 2) {
					var timeSplit3 = timeSplit2[1].split("-");
					//上年
					var firstYear = timeSplit2[0];
					//上日期
					var firstDate = timeSplit3[0];
					//下年
					var lastYear = timeSplit3[1];
					//下日期
					var lastDate = timeSplit2[2];
					var timeStr = firstYear + `.` + firstDate + `-` + lastYear + `.` + lastDate + ` ` + time;
				} else {
					//年
					var year = timeSplit2[0];
					//日期
					var date = timeSplit2[1];
					var timeStr = year + `.` + date + ` ` + time;
				}

				//价格
				var priceArr = data.price.split(",");
				//图片
				$detailsImg.attr('src', data.img);
				//顶部标题
				$topTitle.html(data.title);
				//标题
				$detailsMsg.children().eq(0).html(data.title);
				//时间
				$detailsMsg.children().eq(1).children().eq(1).html(timeStr);
				//场馆
				$detailsMsg.children().eq(2).children().eq(1).html(data.place);

				//场次选数据处理
				//场次开始时间
				var playStartTime = time.split("-")[0];
				var yearDateSplit = yearDate.split("-");
				var playShowTime = '';
				if (yearDateSplit.length == 1) {
					//演出为一天处理
					//场次年日期
					var playYearDate = yearDateSplit[0];
					var playYearDateArr = playYearDate.split("/");
					//场次年
					var playYear = playYearDateArr[0];
					var playDate = playYearDateArr[1];
					var playDateArr = playDate.split(".");
					//场次月
					var playMonth = playDateArr[0];
					//场次日
					var playDay = playDateArr[1];
					//场次拼接
					var playTimeStr = playYear + '-' + playMonth + '-' + playDay;
					playShowTime = `<li><a href="javascript:;">${playTimeStr}${" "}${playStartTime}</a></li>`;
				} else {
					//演出为多天处理
					var yearDateSplit2 = yearDateSplit[0];
					//场次年
					var year = yearDateSplit2.split("/")[0];
					var startDate = yearDateSplit2.split("/")[1];
					var endDate = yearDateSplit[1];
					var checkEndDate = endDate.split("/");
					if (checkEndDate.length > 1) {
						//结束日期含年份
						//首场次年月日
						var startDateArr = startDate.split(".");
						var startYear = year;
						var startMonth = startDateArr[0];
						var startDay = startDateArr[1];
						//末场次年月日
						var endYear = checkEndDate[0];
						var endDateArr = checkEndDate[1].split(".");
						var endMonth = endDateArr[0];
						var endDay = endDateArr[1];
						//场次日期拼接
						var startTimeStr = startYear + '-' + startMonth + '-' + startDay;
						var endTimeStr = endYear + '-' + endMonth + '-' + endDay;
						playShowTime = `<li><a href="javascript:;">${startTimeStr}${" "}${playStartTime}</a></li>
										<li><a href="javascript:;">${endTimeStr}${" "}${playStartTime}</a></li>`;
					} else {
						//结束日期不含年份
						//首场次月日
						var startDateArr = startDate.split(".");
						var startMonth = startDateArr[0];
						var startDay = startDateArr[1];
						//末场次月日
						var endDateArr = endDate.split(".");
						var endMonth = endDateArr[0];
						var endDay = endDateArr[1];
						//场次日期拼接
						var startTimeStr = year + '-' + startMonth + '-' + startDay;
						var endTimeStr = year + '-' + endMonth + '-' + endDay;
						//调用common.js的封装 getBetweenDateStr()，得到两个日期间的日期数组
						if (startMonth == endMonth && startDay * 1 >= 29 && endDay * 1 > startDay) {
							//处理getBetweenDateStr同月的日期29-31号问题
							if (endDay * 1 - startDay * 1 == 2) {
								//日期为29-31时处理
								var betweenTimeStr = year + '-' + startMonth + '-' + '30';
								playShowTime = `<li><a href="javascript:;">${startTimeStr}${" "}${playStartTime}</a></li>
												<li><a href="javascript:;">${betweenTimeStr}${" "}${playStartTime}</a></li>
												<li><a href="javascript:;">${endTimeStr}${" "}${playStartTime}</a></li>`
							} else {
								//日期为相邻两条处理
								playShowTime = `<li><a href="javascript:;">${startTimeStr}${" "}${playStartTime}</a></li>
											<li><a href="javascript:;">${endTimeStr}${" "}${playStartTime}</a></li>`
							}
						} else {
							//正常调用
							let allDateArr = getBetweenDateStr(startTimeStr, endTimeStr);
							playShowTime = allDateArr.map((item) => {
								return `<li><a href="javascript:;">${item}${" "}${playStartTime}</a></li>`;
							}).join("");
						}
					}
				}
				//插入场次结构
				$(showTime).children().eq(0).html(playShowTime);

				//价格选择框
				var priceStr = priceArr.map((item) => {
					return `<li><a href="javascript:;">${item}元</a></li>`
				}).join("");
				//插入价格结构
				$(showPriceLst).html(priceStr);
			},
			createDetailsContent: async (uid) => {
				let showData = await fn.getShowData();
				await fn.createPageData(showData[0]);

				//购票车逻辑部分
				//判断购买按键是否能执行点击事件
				var buyBtnFlag = false;
				//判断场次是否高亮
				var showTimeFlag = false;
				//存储选择场次的内容
				var showTimeContent = '';
				//存储选择的价格数组
				var priceArr = [];
				//存储购票数量
				var ticketNumArr = [];
				//存储购票车数量输入框元素
				var inputNumArr = [];

				//场次选择点击
				for (var i = 0; i < showTimeLst.length; i++) {
					showTimeLst[i].setAttribute('data-idx', i);
					showTimeLst[i].onclick = function (e) {
						e = e || window.event;
						//获取事件源
						var target = e.target || e.srcElement;
						//高亮显示取消效果
						if (target.tagName === 'A') {
							var currentA = target;
							if (target.className === 'active') {
								currentA.classList.remove('active');
								//取消场次高亮时，价格高亮也全取消
								for (var i = 0; i < showPriceLst.children.length; i++) {
									var A = showPriceLst.children[i].children[0];
									A.classList.remove('active');
								}
								//存储选择的价格数组清空
								priceArr = [];
								//买票数量数组清空
								ticketNumArr = [];
								//存储购票车数量输入框元素
								inputNumArr = [];
								//清空场次内容
								showTimeContent = '';
								//清空隐藏购票车
								ticketCar.innerHTML = '';
								ticketCarBox.style.display = 'none';
								showTimeFlag = false;
								//购票车结构隐藏时，失效
								buyBtnFlag = false;
							} else {
								currentA.classList.add('active');
								showTimeFlag = true;
							}
						}
						//点击其中一个后，其他取消高亮
						if (target.className === 'active') {
							var idx = this.getAttribute('data-idx');
							for (var i = 0; i < showTimeLst.length; i++) {
								if (i == idx) {
									//获取到高亮场次内容
									showTimeContent = showTimeLst[i].children[0].innerHTML;
									if (priceArr.length != 0) {
										createTicketCar(showTimeContent, priceArr, ticketNumArr);
									}
								} else {
									//其他取消高亮
									showTimeLst[i].children[0].classList.remove('active');
								}
							}
						}
					}
				}

				//价格选择点击及购票车生成
				showPriceLst.onclick = function (e) {
					if (!showTimeFlag) {
						alert("请选择场次");
						return;
					}
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					if (target.tagName === 'A') {
						var currentA = target;
						if (target.className === 'active') {
							currentA.classList.remove('active');
							if (priceArr.indexOf(currentA.innerHTML) !== -1) {
								//找到对应的元素删除
								var idx = priceArr.indexOf(currentA.innerHTML);
								priceArr.splice(idx, 1);
								//对应的购买数量删除
								ticketNumArr.splice(idx, 1);
								createTicketCar(showTimeContent, priceArr, ticketNumArr);
								//价格数组为0时，隐藏购票车
								if (priceArr.length == 0) {
									ticketCarBox.style.display = 'none';
									//购票车结构隐藏时，失效
									buyBtnFlag = false;
								}
							}
						} else {
							currentA.classList.add('active');
							if (priceArr.indexOf(currentA.innerHTML) === -1) {
								priceArr.push(currentA.innerHTML);
								ticketNumArr.push("1");
								createTicketCar(showTimeContent, priceArr, ticketNumArr);
								ticketCarBox.style.display = 'block';
								//购票车结构出现时，才能点击购买生效
								buyBtnFlag = true;
								//绑定数量输入框事件函数
								bindInputNum();
							}
						}
					}
				}

				//购票车点击
				ticketCar.onclick = function (e) {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					// 删除按键
					if (target.className === 'deleteBtn') {
						var currentLi = target.parentElement;
						var currentPrice = currentLi.children[1].innerHTML;
						//遍历priceArr，删除
						for (var i = 0; i < priceArr.length; i++) {
							if (priceArr[i] == currentPrice) {
								var idx = i;
								break;
							}
						}
						priceArr.splice(idx, 1);
						//删除对应的买票数量
						ticketNumArr.splice(idx, 1);
						currentLi.outerHTML = '';
						//购票车结构再生成
						createTicketCar(showTimeContent, priceArr, ticketNumArr);
						//价格选择对应高亮取消
						for (var i = 0; i < showPriceLst.children.length; i++) {
							var priceBtnContent = showPriceLst.children[i].children[0].innerHTML;
							if (priceBtnContent == currentPrice) {
								showPriceLst.children[i].children[0].classList.remove('active');
								break;
							}
						}
						// priceArr长度为0时，隐藏购票车，对应的场次内容清空并取消高亮
						if (priceArr.length === 0) {
							ticketCarBox.style.display = 'none';
							//购票车结构隐藏时，失效
							buyBtnFlag = false;
							//时间选择判断值变回不可点击
							showTimeFlag = false;
							var currentTime = currentLi.children[0].innerHTML;
							for (var i = 0; i < showTimeLst.length; i++) {
								var timeBtnContent = showTimeLst[i].children[0].innerHTML;
								if (timeBtnContent == currentTime) {
									showTimeLst[i].children[0].classList.remove('active');
									break;
								}
							}
						} else {
							//绑定数量输入框事件函数
							bindInputNum();
						}
					}
					// 票数量增按键
					if (target.className === 'plusBtn') {
						var currentInput = target.previousElementSibling;
						currentInput.value++;
						//根据当前li的data-idx属性判断改变数量数组的哪个值
						var currentLi = currentInput.parentElement.parentElement;
						var idx = currentLi.getAttribute('data-idx');
						ticketNumArr.splice(idx, 1, currentInput.value);
					}
					//票数量减按键
					if (target.className === 'minusBtn') {
						var currentInput = target.nextElementSibling;
						currentInput.value--;
						var currentLi = currentInput.parentElement.parentElement;
						var idx = currentLi.getAttribute('data-idx');
						if (currentInput.value == 0) {
							currentInput.value = 1;
						}
						ticketNumArr.splice(idx, 1, currentInput.value);
					}
				}

				//购买按键点击
				buyBtn.onclick = function () {
					if (!buyBtnFlag) {
						alert('请添加购票再点击');
						return;
					}
					//登录判断
					if (!allowToBuy) {
						alert('请登录购买');
						return;
					}
					console.log(showTimeContent);
					console.log(priceArr);
					console.log(ticketNumArr);

					//将购票车数据写入cookie，确认订单再写入数据库
					//定义数组存购票信息对象
					var ticketArr = [];
					//调用common.js生成随机数，作为订单流水号
					var setOrderNum = randomCode(13);
					//获取购票车信息写入对象
					for (let i = 0; i < ticketCar.children.length; i++) {
						var ticketMsg = {
							userId: uid,
							orderNum: setOrderNum,
							img: showData[0].img,
							title: showData[0].title,
							dateTime: showTimeContent,
							place: showData[0].place,
							price: priceArr[i],
							num: ticketNumArr[i]
						}
						ticketArr.push(ticketMsg);
					}
					console.log(JSON.stringify(ticketArr));
					//调用common.js的cookie封装
					Cookie.set('ticketOrder', JSON.stringify(ticketArr));
					console.log(Cookie.get('ticketOrder'));
					location.href = "confirm.html";
				}

				//标签高亮初始化,对应标签内容添加show类名
				tabItems[0].children[0].classList.add('active');
				tabContent[0].classList.add('show');
				for (var i = 0; i < tabItems.length; i++) {
					// 给html元素添加idx属性，保存对应索引值
					tabItems[i].setAttribute('data-idx', i);
					//点击切换
					tabItems[i].onclick = function () {
						var idx = this.getAttribute('data-idx');
						for (var i = 0; i < tabItems.length; i++) {
							if (i == idx) {
								tabItems[i].children[0].classList.add('active');
								tabContent[i].classList.add('show');
							} else {
								tabItems[i].children[0].classList.remove('active');
								tabContent[i].classList.remove('show');
							}
						}
					}
				}

				//购票车渲染
				function createTicketCar(showTimeContent, priceArr, ticketNumArr) {
					var str = '';
					for (var i = 0; i < priceArr.length; i++) {
						str += `<li class="clearfix" data-idx="${i}">
									<span class="dateTime">${showTimeContent}</span> 
									<span class="price">${priceArr[i]}</span> 
									<span class="nums"> 
										<a href="javascript:;" class="minusBtn"></a> 
										<input type="text" class="inputNum" value="${ticketNumArr[i]}" maxlength="2"> 
										<a href="javascript:;" class="plusBtn"></a> 
									</span> 
									<a href="javascript:;" class="deleteBtn">删除</a> 
								</li>`;
					}
					ticketCar.innerHTML = str;
				}

				//结构生成后，绑定数量输入框的失去焦点事件
				function bindInputNum() {
					inputNumArr = document.getElementsByClassName('inputNum');
					for (var i = 0; i < ticketNumArr.length; i++) {
						inputNumArr[i].addEventListener('blur', inputTicketNum);
					}
				}

				//购票车输入票数函数
				function inputTicketNum(e) {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					//输入的值为2位或1位数字正则判断
					if (/(^[0-9]{1,2}$)/.test(target.value)) {
						var currentLi = target.parentElement.parentElement;
						var idx = currentLi.getAttribute('data-idx');
						ticketNumArr.splice(idx, 1, target.value);
					} else {
						alert("请输入2位及以内整数");
						target.value = 1;
						var currentLi = target.parentElement.parentElement;
						var idx = currentLi.getAttribute('data-idx');
						ticketNumArr.splice(idx, 1, target.value);
					}
				}

			}
		}
		let isLogin = await fn.isLogin();
		allowToBuy = isLogin.status
		if (isLogin.status) {
			//登录状态，将当期用户id传入
			fn[isLogin.status](isLogin.uid);
		} else {
			fn[isLogin.status]();
		}
	})()
})