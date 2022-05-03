//每次发起请求时，都会先调用 $.ajaxPrefilter 这个函数
// 在这个函数中可以拿到我们给ajax提供的配置对像(method\url等)
// options代表我们拿到的给ajax的配置对象
$.ajaxPrefilter(function(options) {
    // 为路径统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 如果请求的是有权限的接口
    if (options.url.indexOf('/my/') !== -1) {

        // 为有权限的接口统一设置headers属性
        options.headers = {
            Authorization: localStorage.getItem('token') || '' //浏览器本地有token则使用,反之则使用空字符串
        }

        // 为有权限的接口统一设置complete 函数,不管调用接口是否成功,都会调用这个方法
        options.complete = function(res) {
            // 防止用同使用加token
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')

                // 强制跳转到login.html
                location.href = '/login.html'
            }
        }
    }

})