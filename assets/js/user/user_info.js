$(function() {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1~6 个字符之间'
            }
        }
    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res)
                form.val("formTest", res.data)
            }
        })
    }

    // 表单重置
    $('#btnReset').on('click', function(e) {
        e.preventDefault()

        // 重置为之前的文本内容
        initUserInfo()
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()

        //发起post请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败')
                }
                layer.msg('修改用户信息成功')
                console.log(window)
                    // 在子页面中调用父页面的方法
                window.parent.getUserInfo()
            }
        })
    })
})