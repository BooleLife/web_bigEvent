$(function() {
    const layer = layui.layer

    // 获取用户的信息的函数
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }

                // 渲染头像
                renderAvatar(res.data)
            },

        })
    }

    // 将getUserInfo挂载到window上,方便后面子文件的使用
    window.getUserInfo = getUserInfo

    // 获取用户的信息
    getUserInfo()

    // 渲染头像的函数
    function renderAvatar(user) {

        // 如果用户有昵称就使用昵称,反之使用用户名
        let name = user.nickname || user.username

        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

        // 如果用户有头像则使用,反之将用户名的第一个字转成大写当作头像
        if (user.user_pic !== null) {

            // 用户有头像时，显示，并隐藏文字头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 获取用户名的第一个字，并将其大写
            let first = name[0].toUpperCase()

            // 用户没有头像时，隐藏图片头像，显示文字头像
            $('.layui-nav-img').hide()
            $('.text-avatar').html(first).show()
        }
    }

    // 为退出按钮绑定单击事件
    $('#btnLogout').on('click', function() {

        // 运用layui提供的confirm询问框
        layer.confirm('是否退出登录', { icon: 3, title: '提示' }, function(index) {
            // 退出后，移除本地的token
            localStorage.removeItem('token')

            // 退出后，强制跳转到login.html
            location.href = '/login.html'

            // 关闭询问框
            layer.close(index)
        })
    })
})