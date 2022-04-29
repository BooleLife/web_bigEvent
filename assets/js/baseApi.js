//每次发起请求时，都会先调用 $.ajaxPrefilter 这个函数
// 这个函数可以拿到我们给ajax提供的配置对像

$.ajaxPrefilter(function(options) {
    // 为路径统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url


    if (options.url.indexOf('/my/') !== -1) {
        // 为有权限的接口统一设置headers属性
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

        // 为有权限的接口统一设置complete 函数
        options.complete = function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')

                // 强制跳转到login.html
                location.href = '/login.html'
            }
        }
    }

})