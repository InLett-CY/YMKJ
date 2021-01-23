$(function () {
    var form = layui.form;
    form.verify({
        upwd: [
            /^[\S]{6,18}$/, '密码必须6-18位，不能使用空格'
        ],
        newpwd: function (value) {
            if (value === $("[name=oldpwd]").val()) {
                return "新密码与原密码不能相同！";
            }
        },
        aginpwd: function (value) {
            if (value!==$("[name=newpwd]").val()) {
                return "两次密码不一致！";
            }
        }
    });

    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/repwd",
            headers: {
                Authorization: localStorage.getItem("token") || ''
            },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.open({
                        title: '提示',
                        icon: 2,
                        content: res.msg,
                        time: 2000
                    });
                }
                layer.open({
                    title: '提示',
                    icon: 1,
                    content: "密码修改成功！"
                });
                $(".layui-form")[0].reset();
            }
        });
    });
});