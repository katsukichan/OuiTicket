$(() => {
    //创建地址按键
    var $addressAdd = $(".addressAdd");
    //创建地址框
    var $addBox = $("#addBox");
    //收件人输入框
    var $c_recipientName = $("#c_recipientName");
    //收件人错误信息
    var $recipient_error = $("#recipient_error");
    //手机输入框
    var $c_recipientPhone = $("#c_recipientPhone");
    //手机错误信息
    var $phone_error = $("#phone_error");
    //地址输入框
    var $c_recipientAddress = $("#c_recipientAddress");
    //地址错误信息
    var $address_error = $("#address_error")
    //保存地址按键
    var $saveCreate = $("#saveCreate");
    //取消按键
    var $cancleCreate = $("#cancleCreate");
    //用户收货地址，事件委托
    var $listUl = $(".addressList").children("ul");

    (async () => {
        let fn = {
            true: async (uid) => {
                fn.createHasToken();
                fn.createAddressConent(uid);
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
            addUserAddress(name, phone, address, uid) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'post',
                        url: 'http://localhost:3000/changedata/addAddress',
                        data: {
                            sendUid: uid,
                            sendName: name,
                            sendPhone: phone,
                            sendAddress: address
                        },
                        success(data) {
                            resolve(data);
                        }
                    })
                })
            },
            delUserAddress(addressId) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'post',
                        url: 'http://localhost:3000/changedata/delAddress',
                        data: {
                            sendAid: addressId,
                        },
                        success(data) {
                            resolve(data);
                        }
                    })
                })
            },
            updateUserAddress(name,phone,address,addressId) {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: 'post',
                        url: 'http://localhost:3000/changedata/upadteAddress',
                        data: {
                            sendAid: addressId,
                            sendName: name,
                            sendPhone: phone,
                            sendAddress: address
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
                    location.reload();
                })
            },
            createNotToken() {
                location.href = 'login.html';
            },
            createUserAddressList(data) {
                if(data.length == 0){
                    $listUl.html('');
                }else{
                    var str = data.map((item)=>{
                        return `<li data-id="${item.id}">
                                    <h2 class="clearfix">
                                        <p class="fr clearfix">
                                            <a href="javascript:;" class="fl msg_btn change">修改</a><span
                                                class="fl line">|</span><a href="javascript:;" class="fl msg_btn del">删除</a>
                                        </p>
                                    </h2>
                                    <dl class="m_add_dl">
                                        <dd>${item.name}${" "}${item.phone}</dd>
                                        <dd style="width:580px;word-break:break-all;">${item.address}</dd>
                                    </dl>
                                    <div class="createBox" style="display: none">
                                        <div class="content">
                                            <dl class="clearfix">
                                                <dt class="fl"><span class="c4">*</span>收件人：</dt>
                                                <dd class="fl"><input type="text" class="input-text" value="${item.name}">
                                                    <span style="color:red"></span></dd>
                                            </dl>
                                            <dl class="clearfix">
                                                <dt class="fl"><span class="c4">*</span>手机：</dt>
                                                <dd class="fl"><input type="text" class="input-text" value="${item.phone}">
                                                    <span style="color:red"></span></dd>
                                            </dl>
                                            <dl class="clearfix">
                                                <dt class="fl"><span class="c4">*</span>配送地址：</dt>
                                                <dd class="fl"><input type="text" class="w400 input-text" value="${item.address}">
                                                    <span style="color:red"></span></dd>
                                            </dl>
                                            <p class="clearfix">
                                                <a href="javascript:;" class="fl btn save">保存地址</a>
                                                <a href="javascript:;" class="fl btn cancle">取消</a>
                                            </p>
                                        </div>
                                    </div>
                                </li>`
                    }).join('');
                    $listUl.html(str);
                }
            },
            // 事件绑定函数
            bindcreateAddressClick(uid) {
                //创建地址绑定
                //创建地址点击
                $addressAdd.on("click", () => {
                    $addBox.css("display", "block");
                })
                //创建地址取消点击
                $cancleCreate.on("click", () => {
                    $addBox.css("display", "none");
                    //输入框清空
                    $c_recipientName.val('');
                    $c_recipientPhone.val('');
                    $c_recipientAddress.val('');
                    //错误信息清空
                    $recipient_error.css('display', 'none');
                    $recipient_error.html('');

                })
                //创建地址保存地址点击
                $saveCreate.on("click", async () => {
                    var _recipientName = $c_recipientName.val();
                    var _recipientPhone = $c_recipientPhone.val();
                    var _recipientAddress = $c_recipientAddress.val();
                    var result = fn.checkCreateAddress(_recipientName, _recipientPhone, _recipientAddress);
                    if (!result) {
                        return false;
                    }
                    //发送请求，添加地址
                    await fn.addUserAddress(_recipientName, _recipientPhone, _recipientAddress, uid);
                    alert('添加成功');
                    location.reload();
                })
            },
            bindUserAddressClick() {
                //ul点击事件
                $listUl.on('click', async(e) => {
                    e = e || window.event;
                    //获取事件源
                    var target = e.target || e.srcElement;
                    //地址修改按键
                    if (target.className == 'fl msg_btn change') {
                        var curLi = target.parentElement.parentElement.parentElement;
                        var curCreateBox = curLi.children[2];
                        $(curCreateBox).css('display', 'block');
                    }
                    //地址取消按键
                    if (target.className == 'fl btn cancle') {
                        var curCreateBox = target.parentElement.parentElement.parentElement;
                        $(curCreateBox).css('display', 'none');
                        var curContent = target.parentElement.parentElement;
                        //错误信息清空
                        curContent.children[0].children[1].children[1].innerHTML = '';
                        curContent.children[1].children[1].children[1].innerHTML = '';
                        curContent.children[2].children[1].children[1].innerHTML = '';
                    }
                    //删除按键
                    if (target.className == 'fl msg_btn del') {
                        var curLiId = target.parentElement.parentElement.parentElement.getAttribute('data-id');
                        //发送请求
                        var isdel = confirm('确认删除该地址？');
                        if(isdel){
                            await fn.delUserAddress(curLiId);
                            alert('删除成功');
                            location.reload();
                        }else{
                            return ;
                        }
                    }
                    //保存地址按键
                    if (target.className == 'fl btn save') {
                        var curContent = target.parentElement.parentElement;
                        //输入框值
                        var _name = curContent.children[0].children[1].children[0].value;
                        var _phone = curContent.children[1].children[1].children[0].value;
                        var _address = curContent.children[2].children[1].children[0].value;
                        //错误提示框
                        var nameError = curContent.children[0].children[1].children[1];
                        var phoneError = curContent.children[1].children[1].children[1];
                        var addressError = curContent.children[2].children[1].children[1];
                        //姓名判断
                        if (_name.trim() == '') {
                            $(nameError).css('display', 'inline-block');
                            $(nameError).html('姓名不能为空');
                            return false;
                        } else if (!/^[\u4e00-\u9fa5 ]{2,5}$/.test(_name)) {
                            $(nameError).css('display', 'inline-block');
                            $(nameError).html('姓名为2到5位中文');
                            return false;
                        } else {
                            $(nameError).css('display', 'none');
                            $(nameError).html('');
                        }
                        //手机判断
                        if (_phone.trim() == '') {
                            $(phoneError).css('display', 'inline-block');
                            $(phoneError).html('手机不能为空');
                            return false;
                        } else if (!/^1[3-8]\d{9}$/.test(_phone)) {
                            $(phoneError).css('display', 'inline-block');
                            $(phoneError).html('手机格式不正确');
                            return false;
                        } else {
                            $(phoneError).css('display', 'none');
                            $(phoneError).html('');
                        }
                        //地址判断
                        if (_address.trim() == '') {
                            $(addressError).css('display', 'inline-block');
                            $(addressError).html('地址不能为空');
                            return false;
                        } else {
                            $(addressError).css('display', 'none');
                            $(addressError).html('');
                        }
                        var curLiId = target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
                        console.log(curLiId);
                        //发送请求
                        await fn.updateUserAddress(_name,_phone,_address,curLiId);
                        alert("更改成功");
                        location.reload();
                    }
                })
            },
            //创建地址输入框判断函数
            checkCreateAddress(name, phone, address) {
                if (name.trim() == '') {
                    $recipient_error.css('display', 'inline-block');
                    $recipient_error.html('姓名不能为空');
                    return false;
                } else if (!/^[\u4e00-\u9fa5 ]{2,5}$/.test(name)) {
                    $recipient_error.css('display', 'inline-block');
                    $recipient_error.html('姓名为2到5位中文');
                    return false;
                } else {
                    $recipient_error.css('display', 'none');
                    $recipient_error.html('');
                    var nameBoolean = true;
                }

                if (phone.trim() == '') {
                    $phone_error.css('display', 'inline-block');
                    $phone_error.html('手机不能为空');
                    return false;
                } else if (!/^1[3-8]\d{9}$/.test(phone)) {
                    $phone_error.css('display', 'inline-block');
                    $phone_error.html('手机格式不正确');
                    return false;
                } else {
                    $phone_error.css('display', 'none');
                    $phone_error.html('');
                    var phoneBoolean = true;
                }

                if (address.trim() == '') {
                    $address_error.css('display', 'inline-block');
                    $address_error.html('地址不能为空');
                    return false;
                } else {
                    $address_error.css('display', 'none');
                    $address_error.html('');
                    var addressBoolean = true;
                }
                if (nameBoolean && phoneBoolean && addressBoolean) {
                    return true;
                }
            },
            createAddressConent: async (uid) => {
                fn.bindcreateAddressClick(uid);
                let data = await fn.getUserAddressData(uid);
                console.log(data);
                fn.createUserAddressList(data);
                fn.bindUserAddressClick();
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