var form = layui.form;
form.verify({
    unick: [
        /^[\S]{0,16}$/, '用户昵称必须为0-16位任意非空格字符！'
    ]
});

$(function () {
    
});