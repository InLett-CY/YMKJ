$(function () {
    // 初始化文章类型的下拉列表
    if (!localStorage.getItem("token")) {
        return layer.open({
            title: '提示',
            icon: 2,
            content: "用户登录信息无效，请重新登录！",
            time: 2000,
            end: function () {
                location.href = "./../../login.html";
            }
        });
    }
    initTable();
    $("tbody").on("click", "button.canclick", function (e) {
        if (e.currentTarget.id === "btn-pub") {
            pubArticle($(e.currentTarget).data("artid"));
        } else if (e.currentTarget.id === "btn-update") {
            console.log("修改");
        } else if (e.currentTarget.id === "btn-delete") {
            deleteArticle($(e.currentTarget).data("artid"));
        }
    });
});
var q = {
    orderType: "DESC",
    pageNum: 1,
    pageCount: 12
};
// 来渲染分页的方法
function renderPage(total) {
    var laypage = layui.laypage;
    laypage.render({
        elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
        count: total, //数据的总条数
        limit: q.pageCount,
        curr: q.pageNum,
        layout: ["limit", "prev", "page", "next", "skip", 'count'],
        limits: [4, 8, 12, 16, 20],
        // jump回调函数有两种状态
        // 1.点击页码的时候会调用一次
        // 2.只要调用了laypage.render函数也会触发
        jump: function (obj, first) {
            q.pageNum = obj.curr;
            q.pageCount = obj.limit;
            if (!first) {
                initTable();
            }
        }
    });
}

function initTable() {
    $.ajax({
        type: "GET",
        url: "/my/article/getArticleByAuthor",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            }
            var htmlStr = template("article-table", res);
            $("tbody").empty().html(htmlStr);
        }
    });
    $.ajax({
        type: "GET",
        url: "/my/article/getPagecount",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.open({
                    title: '提示',
                    icon: 2,
                    content: res.msg
                });
            }
            renderPage(res.data.total);
            $("#pageBox>div").css("margin", "0 auto");
        }
    });
}

function pubArticle(id) {
    $.ajax({
        type: "GET",
        url: "/my/article/pubArticle",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        data: {
            artid: id
        },
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
                time: 2000,
                content: "发表文章成功！"
            });
            initTable();
        }
    });
}

function deleteArticle(id) {
    console.log(id);
    $.ajax({
        type: "GET",
        url: "/my/article/deleteArticle",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        data: {
            artid: id
        },
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
                time: 2000,
                content: "删除文章成功！"
            });
            initTable();
        }
    });
}

template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1);
    var d = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

    var hh = dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
    var mm = dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
    var ss = dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};