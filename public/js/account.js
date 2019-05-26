$(() => {
	//原密码输入框
	var $oldPsw = $(".psw1");
	//新密码输入框
	var $newPsw = $(".psw2");
	//密码规则
	var $passwordRule = $(".password_rule");
	//确认按钮
	var $confirmBtn = $("#password_save_btn");

	(async () => {
		let fn = {
			true: async (uid) => {
				fn.createHasToken();
				fn.bindPageEvent(uid);
			},
			false: async () => {
				fn.createNotToken();
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
			updatePassword(oldPsw, newPsw, uid) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/changedata/updatePassword',
						data: {
							sendOldPsw: oldPsw,
							sendNewPsw: newPsw,
							sendUid: uid
						},
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
					location.href = 'login.html';
				})
			},
			createNotToken() {
				location.href = 'login.html';
			},
			// 事件绑定函数
			bindPageEvent(id) {
				//新密码输入框聚焦事件
				$newPsw.on('focus', () => {
					$passwordRule.css('display', 'block');
				})
				//新密码输入框失焦事件
				$newPsw.on('blur', () => {
					$passwordRule.css('display', 'none');
				})
				//按钮点击事件
				$confirmBtn.on('click', async () => {
					var _oldPsw = $oldPsw.val();
					var _newPsw = $newPsw.val();
					if (_oldPsw.trim() == '') {
						alert('原密码不能为空');
						$newPsw.val('');
						return false;
					}
					if (_newPsw.trim() == '') {
						alert('新密码不能为空格');
						$newPsw.val('');
						return false;
					}
					if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/.test(_newPsw)) {
						alert('设置的新密码不符合规则');
						return false;
					}
					//发送请求，判断原密码是否匹配，更新密码
					let result = await fn.updatePassword(_oldPsw, _newPsw, id);
					console.log(result);
					if (result == 'success') {
						alert('修改成功，请重新登录');
						//成功清空token值并返回登录页
						localStorage.removeItem('token');
						sessionStorage.removeItem('token');
						location.href = 'login.html';
					} else {
						alert('原密码不匹配，请重新输入');
						$oldPsw.val('').focus();
					}

				})
			}
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