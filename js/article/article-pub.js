$(function () {
    var form = layui.form;
    form.render();
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

    function initType() {
        $.ajax({
            type: "GET",
            url: "/my/article/arttype",
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
                // 调用模板引擎渲染分类的下拉列表
                var htmlStr = template("article-type", res);
                $("[name=type_id]").html(htmlStr);
                // 一定要重新渲染layui的form
                form.render();
            }
        });
    }
    initType();
    //图像上传
    $("#chooseImg").on("change", function (e) {
        var file = $(this)[0];
        if (!file.files || !file.files[0]) {
            return;
        }
        $("#filename").text(file.files[0].name);
        var reader = new FileReader();
        reader.onload = function (evt) {
            var replaceSrc = evt.target.result;
            //更换cropper的图片
            $('#image').cropper('replace', replaceSrc, false); //默认false，适应高度，不失真
        }
        reader.readAsDataURL(file.files[0]);
    });
    //cropper图片裁剪
    $('#image').cropper({
        aspectRatio: 1 / 1.2, //默认比例
        preview: '.previewImg', //预览视图
        guides: true, //裁剪框的虚线(九宫格)
        autoCropArea: 0.5, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        movable: false, //是否允许移动图片
        dragCrop: true, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true, //是否允许移动剪裁框
        resizable: true, //是否允许改变裁剪框的大小
        zoomable: false, //是否允许缩放图片大小
        mouseWheelZoom: false, //是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true, //是否允许通过触摸移动来缩放图片
        rotatable: true, //是否允许旋转图片
        crop: function (e) {
            // 输出结果数据裁剪图像。
        }
    });
    //旋转
    $(".cropper-rotate-btn").on("click", function (e) {
        e.preventDefault();
        $('#image').cropper("rotate", 45);
    });
    //复位
    $(".cropper-reset-btn").on("click", function (e) {
        e.preventDefault();
        $('#image').cropper("reset");
    });
    //换向
    var flagX = true;
    $(".cropper-scaleX-btn").on("click", function (e) {
        e.preventDefault();
        if (flagX) {
            $('#image').cropper("scaleX", -1);
            flagX = false;
        } else {
            $('#image').cropper("scaleX", 1);
            flagX = true;
        }
        flagX != flagX;
    });

    $("#btn-pubilish").click(function (e) {
        $("[name='status']").val("publish");
    });

    $("#btn-save").click(function (e) {
        $("[name='status']").val("save");
    });

    // 第一种是将文章保存为草稿
    $("#aritcle-pub").on("submit", function (e) {
        e.preventDefault();
        // 获取所有表单元素的数据
        var data = new FormData($(this)[0]);
        if (data.get("status") === "publish") {
            data.set("status", "发表");
        }
        else if(data.get("status") === "save"){
            data.set("status", "草稿");
        }
        if ($("#image").attr("src") == null) {
            return false;
        } else {
            var cas = $('#image').cropper('getCroppedCanvas', {
                width: 200,
                height: 240
            }); //获取被裁剪后的canvas
            cas.toBlob(function (blob) {
                // 将Canvas画布上的内容，转换为文件对象
                // 得到的文件，进行后续操作，将文件对象，存储到data中
                data.set("conpicimage",blob);
                publishArt(data);
            });
        }
    });

    // 重置添加文章界面
    $("#btn-reset").on("click", function () {
        $("#filename").text("未选择图片");
        $('#image').cropper('replace', "./../../img/文章封面.jpg", false);
    });
});
// 发起添加文章的ajax请求
function publishArt(data) {
    $.ajax({
        type: "POST",
        url: "/my/article/add",
        headers: {
            Authorization: localStorage.getItem("token") || ''
        },
        cache: false, 
        data: data,
        // 向服务器提交的数据不在是json，是Formdata数据
        // Formdate格式的数据必须要添加这两个属性
        contentType: false,
        processData: false,
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
                content: "文章发布/保存成功！"
            });
            $("#btn-reset").click();
        }
    });
}


// 简历里面到底是一个什么项目，个人博客？
// 项目从前端到后端
// 后端：服务器接口程序(完成了后台项目的接口，以及部分前台项目接口)
// 前端：
//      后台管理系统模块(讲的核心是这个模块)
//      前台网站程序模块(你们自己完成的模块)
//      前台模块：(浏览界面、写博客、评论、好友关注)

// 项目的需求分析：重新梳理
