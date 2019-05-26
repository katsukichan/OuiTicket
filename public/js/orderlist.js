$(() => {
	//订单列表框
	var $orderList = $(".order_list_container");

	(async () => {
		let fn = {
			true: async (uid) => {
				fn.createHasToken();
				fn.createOrderListContent(uid);
			},
			false: async () => {
				fn.createNotToken();
			},
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
			getOrderData(uid) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/userOrder',
						data: {
							sendUid: uid
						},
						success(data) {
							resolve(data);
						}
					})
				})
			},
			updateOrderStatus(orderId) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/changedata/updateOrderStatus',
						data: {
							sendId: orderId
						},
						success(data) {
							resolve(data)
						}
					})
				})
			},
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
					location.href = 'login.html';
				})
			},
			createNotToken() {
				location.href = 'login.html';
			},
			createOrderList(data) {
				$orderList.html(data.map((item) => {
					var str = `<div class="order_list_item" data-id="${item.id}">
					<div class="order-list-item-header">订单号：${item.l_id}</div>
					<div class="order-list-item-bottom clearfix">
						<div class="fl project-name" style="width: 390px;">
							<div class="project-name-wrapper clearfix">
								<div class="project-name-img fl">
									<img src="${item.img}">
								</div>
								<div class="project-name-content fl">
									<div class="next-row project-name">${item.title}</div>
									<div class="next-row project-name-perform">
										<span>演出场次：${item.date}</span>
									</div>
									<div class="next-row project-name-venue">演出场馆：${item.place}</div>
								</div>
							</div>
						</div>
						<div class="fl ticket-number" style="width: 144px;">
							<div class="ticket-number-wrapper">${item.num}</div>
						</div>
						<div class="fl order-amount" style="width: 130px;">
							<div class="order-amount-wrapper">
								<div class="order-amount-content">￥${item.price}</div>
								<div class="transportation-costs">(含运费￥0.00)</div>
							</div>
						</div>
						<div class="fl transaction-status" style="width: 130px;">`;
					if (item.status == 1) {
						str += `<div class="transaction-status-wrapper">已取消</div>`;
					} else if (item.status == 2) {
						str += `<div class="transaction-status-wrapper">未支付</div>`;
					} else {
						str += `<div class="transaction-status-wrapper">已支付</div>`;
					}
					str += `</div>
											<div class="fl transaction-operation" style="width: 180px;">
												<div class="transaction-operation-wrapper">
													<a href="javascript:;" class="o_del">取消订单</a>
												</div>
											</div>
										</div>
									</div>`
					return str
				}).join(''));
			},
			orderListClick() {
				//事件委托
				$orderList.on('click', async (e) => {
					e = e || window.event;
					//获取事件源
					var target = e.target || e.srcElement;
					if (target.className == 'o_del') {
						var curOrder = target.parentElement.parentElement.parentElement.parentElement;
						var curOrderid = curOrder.getAttribute('data-id');
						//获取当前订单状态值
						var curStatus = target.parentElement.parentElement.previousElementSibling.children[0].innerHTML;
						if (curStatus == '已取消') {
							alert('订单已经取消');
						} else {
							//发送请求
							let result = await fn.updateOrderStatus(curOrderid);
							if (result == 'update order status success') {
								alert('取消订单成功');
								location.reload();
							} else {
								alert('订单已支付，取消请联系客服');
							}
						}
					}
				})
			},
			createOrderListContent: async (uid) => {
				let data = await fn.getOrderData(uid);
				fn.createOrderList(data);
				fn.orderListClick();
			},
		}
		let isLogin = await fn.isLogin();
		if (isLogin.status) {
			//登录状态，将当期用户id传入
			fn[isLogin.status](isLogin.uid);
		} else {
			fn[isLogin.status]();
		}
	})()
})