$(function () {
    var form = layui.form;
    form.verify({
        unick: [
            /^[\S]{0,16}$/, '用户昵称必须为0-16位任意非空格字符！'
        ]
    });
    function getuserInfor() {
        $.ajax({
            type: "GET",
            url: "/my/myinfor",
            headers: {
                Authorization: localStorage.getItem("token") || ''
            },
            success: function (res) {
                if (res.status !== 0) {
                    layer.open({
                        title: '提示',
                        icon: 2,
                        content: "用户登录信息无效，请重新登录！",
                        time: 2000,
                        end: function () {
                            location.href = "./../../login.html";
                        }
                    });
                } else {
                    // 给基础信息部分和修改信息部分都要绑定数据
                    bindBaseInfor(res.data);
                    form.val('formUserInfor', res.data);
                    $("#reset-btn").on("click", (e) => {
                        e.preventDefault();
                        form.val('formUserInfor', res.data);
                    });
                }
            }
        });
    }
    getuserInfor();
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updateuser",
            headers: {
                Authorization: localStorage.getItem("token") || ''
            },
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
                    title: '提示',
                    icon: 1,
                    time:2000,
                    content: "更新用户信息成功！"
                });
                getuserInfor();
                window.parent.getUserinfor();
            }
        });
    });

    function bindBaseInfor(user) {
        $("#myuid").text(user.ulogid);
        $("#myunick").text(user.unick);
        $("#myuname").text(user.uname);
        $("#myuemail").text(user.uemail);
    }
});