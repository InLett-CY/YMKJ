$(function () {
    $(".link_reg").on("click", function () {
        $(".reg-box").show().siblings("div").hide();
    });
    $(".link_login").on("click", function () {
        $(".login-box").show().siblings("div").hide();
    });
    $(".link_find").on("click", function () {
        $(".findpwd-box").show().siblings("div").hide();
        code_draw();
    });
    var form = layui.form;
    form.verify({
        uid: [
            /^[a-zA-z\d]{6,11}$/,
            '账号必须为6-11位字母数字组合'
        ],
        upwd: [
            /^[\S]{6,18}$/, '密码必须6-18位，不能使用空格'
        ]
    });



    $("#canvas").on("click", function () {
        code_draw();
    });


    $(".btn-backLog").click(function (e) {
        $(".login-box").show().siblings("div").hide();
        $.each($(".fpwd-content .layui-form"), function (i, n) {
            n.reset();
        });
        nextnav(0);
        user = null;
        if (sessionStorage.getItem("token")) {
            sessionStorage.removeItem("token");
        }
        if (sessionStorage.getItem("idtoken")) {
            sessionStorage.removeItem("idtoken");
        }
    });


    // div参数是当前的表单，index是当前的表单索引。完成找回密码的表单切换
    function nextnav(index) {
        $(".fpwd-content>div").addClass("fpwd").eq(index).removeClass("fpwd");
        var liststrong = $(".layui-breadcrumb>strong");
        $.each(liststrong, function (i, n) {
            $(n).text($(n).text());
        });
        var nexttxt = $(liststrong[index]).text();
        $(liststrong[index]).html("<cite>" + nexttxt + "</cite>");
    }

    // 登录功能的实现
    $("#form-login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                layer.open({
                    title: '注意',
                    icon:1,
                    content: '登录成功！',
                    time: 2000
                });
                localStorage.setItem("token", res.token);
                location.href = "./../index.html";
            }
        });
    });

    // 注册功能的实现
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        $.post("/api/reguser", $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            }
            var layerindex = layer.open({
                title: '提示',
                content: res.msg + "请登录！",
                btn: ['确定', '取消'],
                icon: 1,
                yes: function () {
                    layer.close(layerindex);
                    $("#form-reg")[0].reset();
                    $(".link_login").click();
                },
                btn2: function () {
                    $("#form-reg")[0].reset();
                }
            });
        });
    });

    var user = null;
    // 找回密码的功能实现
    $("#form-fpwdid").on("submit", function (e) {
        e.preventDefault();
        // 将输入的内容转为大写，可通过这步进行大小写验证
        $.post("/api/getuser", $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            } else {
                user = res.data;
                var val = $(".codeval").val().toLowerCase();
                // 获取生成验证码值
                var num = $('#canvas').attr('data-code');
                if (val == '') {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: '请输入验证码！'
                    });
                } else if (val == num) {
                    $(".codeval").val('');
                    nextnav(1);
                } else {
                    $(".codeval").val('');
                    code_draw();
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: '验证码错误，请重新输入！'
                    });
                }
            }
        });
    });


    // 处理获取邮箱验证码
    $(".btn-getemailcode").on("click", function () {
        // 先判断邮箱地址是否和账号中的邮箱对应
        if (!user) {
            layer.open({
                title: '提示',
                icon: 2,
                content: "请先输入您要找回的账号！"
            });
            return nextnav(0);
        }
        if (user.uemail.toLowerCase() != $("#idemail").val().toLowerCase()) {
            return layer.open({
                title: '提示',
                icon: 2,
                content: "此邮箱并非账号绑定邮箱，请重新检查！"
            });
        }
        // 邮箱对应，需要向该邮箱发送一封邮件
        $.post("/api/getecode", { id: user.id, uemail: $("#idemail").val() }, (res) => {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: "邮箱接收验证码失败！请稍后再试！"
                });
            }
            layer.open({
                title: '提示',
                icon: 1,
                content: res.msg,
                time: 2000
            });
            // sessionStorage不支持页面跳转
            sessionStorage.setItem('token', res.token);
            var time = 60;
            $(this).addClass("layui-disabled").attr("disabled", "disabled");
            $(this).text(`${time}s`);
            var interval = setInterval(() => {
                time--;
                $(this).text(`${time}s`);
                if (time == 0) {
                    $(this).removeClass("layui-disabled").removeAttr("disabled");
                    $(this).text("获取邮箱验证码");
                    clearInterval(interval);
                    if (sessionStorage.getItem("token")) {
                        sessionStorage.removeItem("token");
                    }
                }
            }, 1000);
        });
    });

    $("#form-fpwdemail").on("submit", function (e) {
        e.preventDefault();
        if (!sessionStorage.getItem("token")) {
            return layer.open({
                title: '提示',
                icon: 2,
                content: "邮箱动态码已过期，请重新获取！"
            });
        }
        $.ajax({
            type: "POST",
            url: "/my/ckcode",
            // 设置headers，请求头部配置
            headers: {
                Authorization:sessionStorage.getItem("token")||''
            },
            data: $("#form-fpwdemail").serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }
                nextnav(2);
                layer.open({
                    title: '提示',
                    icon: 3,
                    content: "请在10分钟内完成操作！"
                });
                sessionStorage.setItem('idtoken', res.token);
                sessionStorage.removeItem("token");
                var time = 10*60;
                var interval=setInterval(function () {
                    time--;
                    if (time == 0) {
                        clearInterval(interval);
                        if (sessionStorage.getItem("idtoken")) {
                            sessionStorage.removeItem("idtoken");
                        }
                        
                    }
                },1000);
            }
        });
    });

    $("#form-fpwdpwd").on("submit", function (e) {
        e.preventDefault();
        console.log(sessionStorage.getItem("idtoken"));
        if (!sessionStorage.getItem("idtoken")) {
            return layer.open({
                title: '提示',
                icon: 2,
                content: "身份验证失败，请重新找回密码！"
            });
        }
        $.ajax({
            type: "POST",
            url: "/my/setpwd",
            headers: {
                Authorization: sessionStorage.getItem("idtoken") || ''
            },
            data: $("#form-fpwdpwd").serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg
                    });
                }  
                nextnav(3);
                sessionStorage.removeItem("idtoken");
            }
        });
    });
});