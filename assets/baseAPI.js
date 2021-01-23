// 每次只要使用jq中的ajax请求，不区分请求方式，在发起请求之前都会先调用这个函数
// 我们调用的ajax的参数全部以options参数的形式传入这个回调函数
$.ajaxPrefilter(function (options) {
    options.url = "http://192.168.0.138:8024" + options.url; 
    
});

$(function () {
    var storage = sessionStorage.getItem("refresh");
    // 证明这个网站被关闭过
    if (!storage) {
        // 如果需要实现自动登录，务必在登录成功的时候再创建第2个localStorage
        // 然后每次打开浏览器务必会先进来
        // 进来之后先获取登录成功时创建的第2个localStorage，判断其内部的数据结果为true、false
        localStorage.clear();        
    }
});

