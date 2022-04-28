//每次发起请求时，都会先调用 $.ajaxPrefilter 这个函数
// 这个函数可以拿到我们给ajax提供的配置对像
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
        // http://www.liulongbin.top:3007
})