//DOM树构建完成后执行
document.addEventListener('DOMContentLoaded',function(){
	//电话号码输入框
	var phone = document.getElementById('phone');
	//电话区域框
	var area = document.getElementsByClassName('area')[0];
	//电话区域值框
	var areaValue = area.children[0];
	//箭头
	var areaJt = area.children[1];
	//电话区域列表
	var areaList = document.getElementsByClassName('areaList')[0];
	var phoneError = document.getElementsByClassName('phoneError')[0];
	//设置密码输入框
	var psw1 = document.getElementById('psw1');
	var psw1Error = document.getElementsByClassName('psw1Error')[0];
	//密码设置规则
	var pswRule = document.getElementsByClassName('rule')[0];
	//确认密码输入框
	var psw2 = document.getElementById('psw2');
	var psw2Error = document.getElementsByClassName('psw2Error')[0];
	//验证码输入框
	var code = document.getElementById('code');
	//验证码显示框
	var showCode = document.getElementsByClassName('showCode')[0];
	var codeError = document.getElementsByClassName('codeError')[0];
	//同意协议选择
	var agree = document.getElementById('agree');
	var agreeError = document.getElementsByClassName('agreeError')[0];
	//注册按键
	var registe_btn = document.getElementsByClassName('registe_btn')[0];
	
	registeCheck();
	//点击注册按键判断
	registe_btn.onclick = async()=>{
		//不满足条件
		//手机号空
		if(phone.value.trim().length == 0){
			phoneError.style.display = 'block';
			phoneError.innerHTML = '手机号不能为空'
			phone.value = '';
			return false;
		}
		//手机格式不正确
		if(!/^1[3-8]\d{9}$/.test(phone.value)){
	        return false;
		}
		//设置密码为空
		if(psw1.value.trim().length == 0){
			psw1Error.style.display = 'block';
			psw1Error.innerHTML = '请输入密码';
			return false;
		}
		//设置密码不合规则
		if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/.test(psw1.value)){
			return false;
		}
		//两次密码不同
		if(psw1.value!=psw2.value){
			psw2Error.innerHTML = '两次输入不一致';
			psw2Error.style.display = 'block';
			return false;
		}
		//验证码输入符
		if(code.value != showCode.innerHTML){
			codeError.innerHTML = '验证码输入错误';
			codeError.style.display = 'block';
			return false;
		}
		//协议未勾选
		if(!agree.checked){
			agreeError.innerHTML = '请勾选同意协议';
			agreeError.style.display = 'block';
			return false;
		}
		//发送请求
		let data = await registe(phone.value, psw1.value);
		console.log(data);
		let fn = {
            success() {
                alert('注册成功');
                location.href = 'login.html';
            },
            fail() {
				alert('该手机已注册');
				showCode.innerHTML = randomStrCode(4);
            }
        }
		fn[data.status]();
	}

	//注册请求函数
	let registe = (inputPhone,inputPassword)=>{
		return new Promise((resolve,reject)=>{
			$.ajax({
				type: 'post',
				url: 'http://localhost:3000/users/registe',
				data: {
					inputPhone,
					inputPassword
				},
				success(data) {
					resolve(data);
				}
			})
		})
	}

	//注册验证
	function registeCheck(){
		//点击电话区域框
		var areaFlag = false;
		area.onclick = function(){
			if(areaFlag){
				areaList.style.display = 'none';
				areaFlag = !areaFlag;
				areaJt.classList.remove('icon-downjt');
				areaJt.classList.add('icon-upjt');
			}else{
				areaList.style.display = 'block';
				areaFlag = !areaFlag;
				areaJt.classList.remove('icon-upjt');
				areaJt.classList.add('icon-downjt');
			}
		}
		areaList.onclick = function(e){
			e = e || window.event;
			target = e.target || e.srcElement;
			if(target.tagName === 'SPAN'){
				var currentSpan = target;
				areaValue.innerHTML = currentSpan.innerHTML;
			}
			areaList.style.display = 'none';
			areaJt.classList.remove('icon-downjt');
			areaJt.classList.add('icon-upjt');
			areaFlag = !areaFlag;
		}
		//手机号码判断(正则)
		/*
	        手机号码
	            11位
	            1 [34578]
	    */
		phone.oninput = function(){
	        var _phone = phone.value;
	        if(!/^1[3-8]\d{9}$/.test(_phone)){
	        	phoneError.style.display = 'block';
	        	phoneError.innerHTML = '手机号输入格式不正确'
	        }else{
	        	phoneError.style.display = 'none';
	        	phoneError.innerHTML = '';
	        }
		}
		phone.onblur = function(){
			if(phone.value.trim().length == 0){
				phoneError.style.display = 'block';
				phoneError.innerHTML = '手机号不能为空'
				phone.value = '';
			}
		}
		//设置密码
		//聚焦
		psw1.onfocus = function(){
			//显示登录密码设置规则
			pswRule.style.display = 'block';
		}
		//失焦
		psw1.onblur = function(){
			//隐藏登录密码设置规则
			pswRule.style.display = 'none';
			if(psw1.value.trim().length == 0){
				psw1Error.style.display = 'block';
				psw1Error.innerHTML = '请输入密码';
			}
		}
		//边输入密码边确认输入字符
		/*
	        密码规则
	        6-20位
	        包含数字、字母、标点符(除空格)
	        数字字母标点符至少包含两种
	    */
		psw1.oninput = function(){
			if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,20}$/.test(psw1.value)){
				psw1Error.style.display = 'block';
				psw1Error.innerHTML = '密码不符合规则';
			}else{
				psw1Error.style.display = 'none';
				psw1Error.innerHTML = '';
			}
		}
		//确认密码判断
		psw2.onblur = function(){
			if(psw1.value!=psw2.value){
				psw2Error.innerHTML = '两次输入不一致';
				psw2Error.style.display = 'block';
			}else{
				psw2Error.style.display = 'none';
			}
		}
		//验证码判断
		showCode.innerHTML = randomStrCode(4);
		//点击切换验证码
		showCode.onclick = function(){
			showCode.innerHTML = randomStrCode(4);
		}
		//失去焦点对比验证码
		code.onblur = function(){
			var _code = code.value;
			if(_code != showCode.innerHTML){
				codeError.innerHTML = '验证码输入错误';
				codeError.style.display = 'block';
			}else{
				codeError.style.display = 'none';
			}
		}
		//协议勾选判断
		agree.onclick = function(){
			if(agree.checked){
				agreeError.style.display = 'none';
			}else{
				agreeError.innerHTML = '请勾选同意协议';
				agreeError.style.display = 'block';
			}
		}
	}
 })