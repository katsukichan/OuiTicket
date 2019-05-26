document.addEventListener("DOMContentLoaded", function () {
	//取票方式div
	var ticketGet = document.querySelector('.ticketGet');
	//二维码电子票背景
	var qr_bg = ticketGet.children[0].children[0];
	//快递配送背景
	var deliver_bg = ticketGet.children[1].children[0];
	//Oui自取背景
	var self_bg = ticketGet.children[2].children[0];
	//取票方式信息填写div
	var ticketMsg = document.querySelector('.ticketMsg');
	//取票方式二维码电子票
	var m_qr = ticketMsg.children[0];
	//取票方式快递配送
	var m_deliver = ticketMsg.children[1];
	//取票方式Oui自取
	var m_self = ticketMsg.children[2];
	//二维码电子票姓名填写框
	var qr_name = document.querySelector('#qr_name');
	//二维码电子票填手机写框
	var qr_phone = document.querySelector('#qr_phone');
	//Oui自取票姓名填写框
	var self_name = document.querySelector('#self_name');
	//Oui自取票填手机写框
	var self_phone = document.querySelector('#self_phone');
	//错误信息框
	var qr_name_error = document.querySelector('.qr_name_error');
	var qr_phone_error = document.querySelector('.qr_phone_error');
	var self_name_error = document.querySelector('.self_name_error');
	var self_phone_error = document.querySelector('.self_phone_error');
	//地址选择ul
	var addressList = document.querySelector('.addressList');
	//用户没地址信息提示
	var noAddress = document.querySelector('.noAddress');
	//订单列表
	var tableBox = document.querySelector('.tableBox');
	//提交订单最终价格
	var finalPrice = document.querySelector('.finalPrice');
	//同意协议判断盒
	var agree = document.querySelector('#agree');
	//提交订单按钮
	var submitBtn = document.querySelector('.submitBtn');

	//判断选择的购票人信息填写方式
	var qrFlag = true;
	var deliverFlag = false;
	var selfFlag = false;
	//支付方式变量（0二维码票 1快递票 2自取票）默认0
	var payWay = '0';
	//存是否支付状态变量 (2未支付 3已支付)
	var payStatus;
	//存放总价变量
	var totalPriceNum = 0;

	(async () => {
		let fn = {
			true: async () => {
				fn.createConfirmContent();
			},
			false: async () => {
				alert("登录已失效，请重新登录");
				location.href = 'login.html';
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
			//获取cookie函数
			getCookie() {
				//获取详情页设置的cookie
				if (document.cookie) {
					var ticketOrder = JSON.parse(Cookie.get('ticketOrder'));
					fn.createTicketList(ticketOrder);
					return ticketOrder;
				}
			},
			//请求函数
			getUserAddressData(uid) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/userAddress',
						data: {
							sendUid: uid
						},
						success(data) {
							resolve(data);
						}
					})
				})
			},
			addOrderList(sendObj) {
				//生成订单请求
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/changedata/addOrder',
						data: sendObj,
						success(data) {
							resolve(data);
						}
					})
				})
			},
			//结构生成函数
			createTicketList(ticketListObj) {
				//订单渲染
				var str = '';
				str += `<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tbody>
								<tr>
									<th class="c1">商品名称</th>
									<th class="c2">座位号</th>
									<th class="c3">价格</th>
									<th class="c4">数量</th>
									<th class="c5">价格小计（元）</th>
								</tr>
							</tbody>
						</table>
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tbody>`;
				var totalPrice = 0;
				ticketListObj.map(function (item) {
					var _price = parseFloat(item.price);
					var _num = parseFloat(item.num);
					str += `<tr>
							 <td class="c1"><p>${item.title}${item.dateTime}</p></td>
							 <td class="c2"><p>暂无座位信息</p></td>
							 <td class="c3"><p>${item.price}</p></td>
							 <td class="c4"><p>${item.num}</p></td>
							 <td class="c5"><p>${_price * _num}</p></td>
						   </tr>`;
					totalPrice += _price * _num;
				}).join('');
				str += `</tbody>
						 </table>
						 <table width="100%">
							 <tbody>
								 <tr>
									 <td><span class="totalPrice">合计:￥${totalPrice}</span></td>
								 </tr>
							 </tbody>
						 </table>`;
				tableBox.innerHTML = str;
				//赋值到全局总价变量
				totalPriceNum = totalPrice;
				finalPrice.innerHTML = `￥${totalPrice}`;
			},
			createAddressList(addressObj) {
				//地址渲染
				//数组长度大于0，生成结构
				if (addressObj.length > 0) {
					//第一个选为默认地址
					var str = `<li>
									<input type="radio" name="address" checked="checked">
									<span>配送地址： <span class="d_name">${addressObj[0].name}</span>
									<span class="d_address">${addressObj[0].address}</span>
									<span class="d_phone">${addressObj[0].phone}</span></span>
								</li>`;
					if (addressObj.length > 1) {
						for (var i = 1; i < addressObj.length; i++) {
							//对象解构
							var { name, address, phone } = addressObj[i];
							str += `<li>
										<input type="radio" name="address">
										<span>配送地址： <span class="d_name">${name}</span>
										<span class="d_address">${address}</span>
										<span class="d_phone">${phone}</span></span>
									</li>`;
						}
					}
					addressList.innerHTML = str;
				}
				//数组长度为0，显示提示
				if (addressObj.length == 0) {
					noAddress.style.display = "block";
				}
			},
			bindTicketGetWayClick() {
				//取票方式点击
				ticketGet.onclick = (e) => {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					if (target.tagName == 'SPAN') {
						currentBg = target.previousElementSibling;
						fn.changeSubmit(currentBg.className);
					}
					if (target.tagName == 'H3') {
						currentBg = target;
						fn.changeSubmit(currentBg.className);
					}
				}
			},
			submitBtnClick(curCookie, addressData) {
				//提交按钮点击，获取信息存入数据库
				submitBtn.onclick = async () => {
					//获取订单总金额
					var totalPrice = totalPriceNum;
					//选择二维码
					if (qrFlag) {
						if (qr_name.value.trim().length == 0) {
							qr_name_error.innerHTML = '姓名不能为空';
							qr_name.value = '';
							return;
						}
						if (!/^[\u4e00-\u9fa5 ]{2,20}$/.test(qr_name.value)) {
							return;
						}
						if (qr_phone.value.trim().length == 0) {
							qr_phone_error.innerHTML = '手机不能为空';
							qr_phone.value = '';
							return;
						}
						if (!/^1[3-8]\d{9}$/.test(qr_phone.value)) {
							return;
						}
						//未选中同意协议跳出
						if (!agree.checked) {
							alert('请同意协议');
							return;
						}
						var _qrName = qr_name.value;
						var _qrPhone = qr_phone.value;
						//演出场次
						var dateTime = curCookie[0].dateTime;
						//演出图片路径
						var img = curCookie[0].img;
						//演出场馆
						var place = curCookie[0].place;
						//演出题头
						var title = curCookie[0].title;
						//购买的用户id
						var userId = curCookie[0].userId;
						//订单流水号
						var orderNum = curCookie[0].orderNum;
						//购票票总数
						var ticketAllNum = 0;
						for (let i = 0; i < curCookie.length; i++) {
							ticketAllNum += curCookie[i].num * 1
						}
						fn.isPay();
						//将订单内容写入对象
						var sendObj = {
							sendOrderNum: orderNum,
							sendtotalPrice: totalPrice,
							sendName: _qrName,
							sendPhone: _qrPhone,
							sendAddress: '',
							sendDateTime: dateTime,
							sendImg: img,
							sendPlace: place,
							sendTitle: title,
							sendUserId: userId,
							sendTicketNum: ticketAllNum,
							sendPayWay: payWay,
							sendPayStatus: payStatus
						}
						//发送请求
						await fn.addOrderList(sendObj);
						Cookie.remove('ticketOrder');
						location.href = 'orderlist.html';
					}
					//选择送货
					if (deliverFlag) {
						//地址数据数组长度不为0执行
						if (addressData.length > 0) {
							//未选中同意协议跳出
							if (!agree.checked) {
								alert('请同意协议');
								return;
							}
							//获取单选按钮数组
							var addressRadios = document.getElementsByName('address');
							for (var i = 0; i < addressRadios.length; i++) {
								if (addressRadios[i].checked == true) {
									var deliverMsg = addressRadios[i].nextElementSibling;
									//姓名
									var _deliverName = deliverMsg.children[0].innerHTML;
									//地址
									var _deliverAddress = deliverMsg.children[1].innerHTML;
									//电话
									var _deliverPhone = deliverMsg.children[2].innerHTML;
									break;
								}
							}
							console.log(_deliverName, _deliverAddress, _deliverPhone);
							//演出场次
							var dateTime = curCookie[0].dateTime;
							//演出图片路径
							var img = curCookie[0].img;
							//演出场馆
							var place = curCookie[0].place;
							//演出题头
							var title = curCookie[0].title;
							//购买的用户id
							var userId = curCookie[0].userId;
							//订单流水号
							var orderNum = curCookie[0].orderNum;
							//购票票总数
							var ticketAllNum = 0;
							for (let i = 0; i < curCookie.length; i++) {
								ticketAllNum += curCookie[i].num * 1
							}
							fn.isPay();
							var sendObj = {
								sendOrderNum: orderNum,
								sendtotalPrice: totalPrice,
								sendName: _deliverName,
								sendPhone: _deliverPhone,
								sendAddress: _deliverAddress,
								sendDateTime: dateTime,
								sendImg: img,
								sendPlace: place,
								sendTitle: title,
								sendUserId: userId,
								sendTicketNum: ticketAllNum,
								sendPayWay: payWay,
								sendPayStatus: payStatus
							}
							//发送请求
							await fn.addOrderList(sendObj);
							Cookie.remove('ticketOrder');
							location.href = 'orderlist.html';
						} else {
							//否则不能地址方式提交
							alert('无地址可选用，请换其他方式');
							return;
						}
					}
					//选择自取
					if (selfFlag) {
						if (self_name.value.trim().length == 0) {
							self_name_error.innerHTML = '姓名不能为空';
							self_name.value = '';
							return;
						}
						if (!/^[\u4e00-\u9fa5 ]{2,20}$/.test(self_name.value)) {
							return;
						}
						if (self_phone.value.trim().length == 0) {
							self_phone_error.innerHTML = '手机不能为空';
							self_name.value = '';
							return;
						}
						if (!/^1[3-8]\d{9}$/.test(self_phone.value)) {
							return;
						}
						//未选中同意协议跳出
						if (!agree.checked) {
							alert('请同意协议');
							return;
						}
						var _selfName = self_name.value;
						var _selfPhone = self_phone.value;
						//演出场次
						var dateTime = curCookie[0].dateTime;
						//演出图片路径
						var img = curCookie[0].img;
						//演出场馆
						var place = curCookie[0].place;
						//演出题头
						var title = curCookie[0].title;
						//购买的用户id
						var userId = curCookie[0].userId;
						//订单流水号
						var orderNum = curCookie[0].orderNum;
						//购票票总数
						var ticketAllNum = 0;
						for (let i = 0; i < curCookie.length; i++) {
							ticketAllNum += curCookie[i].num * 1
						}
						fn.isPay();
						var sendObj = {
							sendOrderNum: orderNum,
							sendtotalPrice: totalPrice,
							sendName: _selfName,
							sendPhone: _selfPhone,
							sendAddress: '',
							sendDateTime: dateTime,
							sendImg: img,
							sendPlace: place,
							sendTitle: title,
							sendUserId: userId,
							sendTicketNum: ticketAllNum,
							sendPayWay: payWay,
							sendPayStatus: payStatus
						}
						//发送请求
						await fn.addOrderList(sendObj);
						Cookie.remove('ticketOrder');
						location.href = 'orderlist.html';
					}
				}
			},
			changeSubmit(className) {
				//更改购票方式信息函数
				if (className == 'qr_bg') {
					//支付方式值变更
					payWay = '0';
					//图片变换
					qr_bg.style.backgroundPosition = '-78px 0';
					deliver_bg.style.backgroundPosition = '0 -78px';
					self_bg.style.backgroundPosition = '0 -156px';
					//结构显示变换
					m_qr.classList.add('show');
					m_deliver.classList.remove('show');
					m_self.classList.remove('show');
					//判断值变换
					qrFlag = true;
					deliverFlag = false;
					selfFlag = false;
					//错误信息清空
					self_name_error.innerHTML = '';
					self_name_error.innerHTML = '';
					//清空自取值
					self_name.value = '';
					self_phone.value = '';
				}
				if (className == 'deliver_bg') {
					//支付方式值变更
					payWay = '1';
					//图片变换
					qr_bg.style.backgroundPosition = '0 0';
					deliver_bg.style.backgroundPosition = '78px -78px';
					self_bg.style.backgroundPosition = '0 -156px';
					//结构显示变换
					m_qr.classList.remove('show');
					m_deliver.classList.add('show');
					m_self.classList.remove('show');
					//判断值变换
					qrFlag = false;
					deliverFlag = true;
					selfFlag = false;
					//错误信息清空
					qr_name_error.innerHTML = '';
					qr_phone_error.innerHTML = '';
					self_name_error.innerHTML = '';
					self_phone_error.innerHTML = '';
				}
				if (className == 'self_bg') {
					//支付方式值变更
					payWay = '2';
					//图片变换
					qr_bg.style.backgroundPosition = '0 0';
					deliver_bg.style.backgroundPosition = '0 -78px';
					self_bg.style.backgroundPosition = '-78px -156px';
					//结构显示变换
					m_qr.classList.remove('show');
					m_deliver.classList.remove('show');
					m_self.classList.add('show');
					//判断值变换
					qrFlag = false;
					deliverFlag = false;
					selfFlag = true;
					//错误信息清空
					qr_name_error.innerHTML = '';
					qr_phone_error.innerHTML = '';
					//清空二维码值
					qr_name.value = '';
					qr_phone.value = '';
				}
			},
			confirmCheck() {
				//信息填写判断函数
				qr_name.onblur = function () {
					if (qr_name.value.trim().length == 0) {
						qr_name_error.innerHTML = '姓名不能为空';
					}
				}
				qr_name.oninput = function () {
					if (!/^[\u4e00-\u9fa5 ]{2,5}$/.test(qr_name.value)) {
						qr_name_error.innerHTML = '姓名为2到5位中文';
					} else {
						qr_name_error.innerHTML = '';
					}
				}
				qr_phone.oninput = function () {
					if (!/^1[3-8]\d{9}$/.test(qr_phone.value)) {
						qr_phone_error.innerHTML = '手机号输入格式不正确'
					} else {
						qr_phone_error.innerHTML = '';
					}
				}
				qr_phone.onblur = function () {
					if (qr_phone.value.trim().length == 0) {
						qr_phone_error.innerHTML = '手机号不能为空'
						qr_phone_error.value = '';
					}
				}
				self_name.onblur = function () {
					if (self_name.value.trim().length == 0) {
						self_name_error.innerHTML = '姓名不能为空';
					}
				}
				self_name.oninput = function () {
					if (!/^[\u4e00-\u9fa5 ]{2,5}$/.test(self_name.value)) {
						self_name_error.innerHTML = '姓名为2到5位中文';
					} else {
						self_name_error.innerHTML = '';
					}
				}
				self_phone.oninput = function () {
					if (!/^1[3-8]\d{9}$/.test(self_phone.value)) {
						self_phone_error.innerHTML = '手机号输入格式不正确'
					} else {
						self_phone_error.innerHTML = '';
					}
				}
				self_phone.onblur = function () {
					if (self_phone.value.trim().length == 0) {
						self_phone_error.innerHTML = '手机号不能为空'
						self_phone_error.value = '';
					}
				}
			},
			isPay() {
				//是否支付函数，用于订单状态
				var isPay = confirm("是否支付？");
				if (isPay) {
					//已支付状态码
					payStatus = '3';
				} else {
					//未支付状态码
					payStatus = '2';
				}
			},
			createConfirmContent: async () => {
				fn.confirmCheck();
				fn.bindTicketGetWayClick();
				let curCookie = fn.getCookie();
				let addressData = await fn.getUserAddressData(curCookie[0].userId);
				fn.createAddressList(addressData);
				fn.submitBtnClick(curCookie, addressData);
			}
		}
		let isLogin = await fn.isLogin();
		if (isLogin.status) {
			fn[isLogin.status]();
		} else {
			fn[isLogin.status]();
		}
	})();
})