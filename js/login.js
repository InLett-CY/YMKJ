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
                    content: '登录成功！'
                });
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
            }
            else {
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
        if (user.uemail!=$("#form-fpwdemail").serialize().uemail) {
            return layer.open({
                title: '提示',
                icon: 2,
                content: "此邮箱并非账号绑定邮箱，请重新检查！"
            });
        }
        // 邮箱对应，需要向该邮箱发送一封邮件

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
            }
        }, 1000);
    });
});