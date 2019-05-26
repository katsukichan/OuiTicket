//DOM树构建完成后执行
document.addEventListener('DOMContentLoaded',function(){
	//登录输入框
	var username = document.getElementById('username');
	//密码输入框
	var password = document.getElementById('password');
	//记住密码框
	var auto_box = document.getElementById('auto_box');
	//登录按键
	var login_btn = document.getElementsByClassName('login_btn')[0];
	//登录方式栏
	var login_tab = document.getElementsByClassName('login_tab')[0];
	//账号登录
	var account_btn = login_tab.children[0];
	//二维码登录
	var qr_btn = login_tab.children[1];
	//账号登录内容
	var login_input = document.getElementsByClassName('login_input')[0];
	//二维码登录内容
	var login_qr = document.getElementsByClassName('login_qr')[0];
	//账号登录错误信息
	var error = login_input.children[0];
	
	//登录按钮点击
	login_btn.onclick = async()=>{
		//trim去除前后空格
		var _name = username.value.trim();
		var _psw = password.value.trim();
		//自动登录判断值
		var isAuto = false;
		if(_name.length == 0){
			error.innerHTML = '请输入手机号'
			error.style.display = 'block';
			return false;
		}else if(_psw.length == 0){
			error.innerHTML = '请输密码'
			error.style.display = 'block';
			return false;
		}
		//选中记住密码auto_box，获取输入的账号密码写入token加密
		if(auto_box.checked){
			isAuto = true;
		}
		let data = await login(_name,_psw);
		let fn = {
			success(){
				if(isAuto){
					//选择自动登录，token存入localStorage 一直保存
					localStorage.setItem("token", data.token);
					location.href = '../index.html';
				}else{
					//清除之前失效的token
					localStorage.clear();
					//不选择自动登录，token存入sessionStorage 网页关闭清除
					sessionStorage.setItem("token", data.token);
					location.href = '../index.html';
				}
			},
			fail(){
				error.innerHTML = '账号或密码错误'
				error.style.display = 'block';
			}
		}
		fn[data.status]();
	}
	//账号登录点击显示
	account_btn.onclick = function(){
		account_btn.className = 'currentTab';
		qr_btn.className = '';
		login_input.style.display = 'block';
		login_qr.style.display = 'none';
	}
	//二维码登录点击显示
	qr_btn.onclick = function(){
		account_btn.className = '';
		qr_btn.className = 'currentTab';
		login_input.style.display = 'none';
		login_qr.style.display = 'block';
		//切换后去除原先的账号密码输入值
		username.value = '';
		password.value = '';
		//error信息隐藏
		error.style.display = 'none';
	}

	//登录请求函数
	let login = (inputPhone,inputPassword)=>{
		return new Promise((resolve,reject)=>{
			$.ajax({
				type: 'post',
				url: 'http://localhost:3000/users/login',
				data: {
					inputPhone,
					inputPassword,
				},
				success(data) {
					resolve(data);
				}
			})
		})
	}
})