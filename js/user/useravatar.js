$(function () {
    //图像上传
    $("#chooseImg").on("change", function (e) {
        var file = $(this)[0];
        console.log(file.files[0].name);
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
        aspectRatio: 1 / 1, //默认比例
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
    $(".cropper-rotate-btn").on("click", function () {
        $('#image').cropper("rotate", 45);
    });
    //复位
    $(".cropper-reset-btn").on("click", function () {
        $('#image').cropper("reset");
    });
    //换向
    var flagX = true;
    $(".cropper-scaleX-btn").on("click", function () {
        if (flagX) {
            $('#image').cropper("scaleX", -1);
            flagX = false;
        } else {
            $('#image').cropper("scaleX", 1);
            flagX = true;
        }
        flagX != flagX;
    });

    //裁剪后的处理
    $("#sureCut").on("click", function () {
        if ($("#image").attr("src") == null) {
            return false;
        } else {
            var cas = $('#image').cropper('getCroppedCanvas', {
                width: 100,
                height:100
            }); //获取被裁剪后的canvas
            var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
            $.ajax({
                type: "POST",
                url: "/my/avatar",
                headers: {
                    Authorization: localStorage.getItem("token") || ''
                },
                data: {
                    avatar:base64url
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
                        time:2000,
                        content: "更改用户头像成功！"
                    });
                    // 在iframe里面可以window.parent属性访问其父级html中引用的js的全局数据
                    window.parent.getUserinfor();
                }
            });
        }
    });
});