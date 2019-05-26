$(() => {
	//nickName输入框dd
	var $nickNameDd = $("#nickName_dd");
	//gender单选dd
	var $genderDd = $("#gender_dd");

	(async () => {
		let fn = {
			true: async (uid) => {
				fn.createHasToken();
				fn.createPersonalContent(uid);
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
			getUserInfoData(id) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'get',
						url: 'http://localhost:3000/getdata/userInfo',
						data: {
							uid: id
						},
						success(data) {
							resolve(data);
						}
					})
				})
			},
			updateUserInfo(nickName, gender, uid) {
				return new Promise((resolve, reject) => {
					$.ajax({
						type: 'post',
						url: 'http://localhost:3000/changedata/updateUserInfo',
						data: {
							sendNickName: nickName,
							sendGender: gender,
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
			createPage(data) {
				if (data.length > 0) {
					var nickNameStr = `<input type="text" class="nickName input-text" maxlength="16" value="${data[0].nickname}">
									<span class="nickTip">2-16个字符，可由中英文、数字组成</span>`;
					var genderStr;
					if (data[0].gender == '男') {
						genderStr = `<label class="radio">
										<input type="radio" name="gender" checked><span class="m">男</span>
									</label>
									<label class="radio">
										<input type="radio" name="gender"><span class="f">女</span>
									</label>`;
					} else {
						genderStr = `<label class="radio">
										<input type="radio" name="gender"><span class="m">男</span>
									</label>
									<label class="radio">
										<input type="radio" name="gender" checked><span class="f">女</span>
									</label>`;
					}
				} else {
					var nickNameStr = `<input type="text" class="nickName input-text" maxlength="16" value="">
									<span class="nickTip">2-16个字符，可由中英文、数字组成</span>`;
					var genderStr = `<label class="radio">
										<input type="radio" name="gender" checked><span class="m">男</span>
									</label>
									<label class="radio">
										<input type="radio" name="gender"><span class="f">女</span>
									</label>`;
				}

				$nickNameDd.html(nickNameStr);
				$genderDd.html(genderStr);
			},
			//绑定事件函数
			bindPageEvent(uid) {
				//昵称输入框
				var $nickName = $(".nickName");
				//昵称输入规则
				var $nickTip = $(".nickTip");
				//保存按钮
				var $saveBtn = $("#msg_save_btn");
				//昵称输入框聚焦事件
				$nickName.on('focus', () => {
					$nickTip.css('display', 'inline-block');
				})
				//昵称输入框失焦事件
				$nickName.on('blur', () => {
					$nickTip.css('display', 'none');
				})
				//获取当前用户id
				var _uid = uid;
				//按钮点击事件
				$saveBtn.on('click', async () => {
					var _nickName = $nickName.val();
					if (_nickName.trim() == '') {
						alert('昵称不能为空');
						$nickName.val('');
						return false;
					}
					if (!/[\u4e00-\u9fa5a-zA-Z0-9]{2,16}/.test(_nickName)) {
						alert('昵称不符合规则');
						return false;
					}
					//选中的性别单选
					var _gender = $(":checked").next().html();
					//发送请求，update到数据库
					let result = await fn.updateUserInfo(_nickName, _gender, _uid);
					if (result == 'nickname already use') {
						alert('该昵称已被使用，仅性别更改');
						location.reload();
					} else {
						alert('更新成功');
						location.reload();
					}
				})
			},
			createPersonalContent: async (uid) => {
				let data = await fn.getUserInfoData(uid);
				await fn.createPage(data);
				fn.bindPageEvent(uid);
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