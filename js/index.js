$(function () {
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
                        location.href = "./../login.html";
                    }
                });
            } else {
                $("#uname").text(res.data.uname);
            }
        }
    });

    $("#exit_link").on("click", function () {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
        }
        location.href = "./../login.html";
    });
});