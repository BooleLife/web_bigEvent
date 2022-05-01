$(function() {
    getUserInfo()
    let layer = layui.layer

    $('#btnLogout').on('click', function() {
        layer.confirm('是否退出登录', { icon: 3, title: '提示' }, function(index) {
            // 移除本地的token
            localStorage.removeItem('token')

            // 退出后跳转到login.html
            location.href = '/login.html'
            layer.close(index)
        })
    })

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',

            // 需要将本地保存的token 传给服务器
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                renderAvatar(res.data)
            },

            //不管请求是否成功都会执行这个函数
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 强制清空token
            //         localStorage.removeItem('token')

            //         // 强制跳转到login.html
            //         location.href = '/login.html'
            //     }
            // }
        })
    }
    window.getUserInfo = getUserInfo

    function renderAvatar(user) {
        let name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            let first = name[0].toUpperCase()
            $('.layui-nav-img').hide()
            $('.text-avatar').html(first).show()
        }
    }
})