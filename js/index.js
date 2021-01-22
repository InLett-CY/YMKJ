$(function () {
    $.ajax({
        type: "GET",
        url: "/my/myinfor",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        success: function (res) {
            // 判断如果根据token获取用户信息失败的话，要跳转到登录界面，
            if (res.status !== 0) {
                layer.open({
                    title: '提示',
                    icon: 2,
                    content: "用户登录信息无效，请重新登录！",
                    time: 2000,
                    end: function () {
                        location.href = "./../login.html";
                    }
                });
            } else {
                renderAvatar(res.data);
            }
        }
    });

    $("#exit_link").on("click", function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
            location.href = "./../login.html";
            layer.close(index);
          });
        
    });
});

function renderAvatar(user) {
    // 1.先获取用户名称或昵称，原则是优先获取昵称
    var nick = user.unick || user.uname;
    // 2.设置问候语
    $("#welcome").html(`欢迎&nbsp;&nbsp;${nick}`);
    // 3.按需求进行用户头像的渲染
    if (user.upicimage!==null) {
        $(".layui-nav-img").attr("src", user.upicimage).show();
        $(".text-avatar").hide();
    } else {
        $(".layui-nav-img").hide();
        $(".text-avatar").text(nick[0].toUpperCase()).show();
    }
}