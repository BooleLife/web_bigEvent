$(function() {
    // 为注册按钮绑定点击事件
    $('#linkReg').on('click', function() {

        $('.loginBox').hide()

        // 注册框显示
        $('.regBox').show()
    })

    // 为登录按钮绑定点击事件
    $('#linkLogin').on('click', function() {
        // 注册框隐藏
        $('.regBox').hide()

        // 登录框显示
        $('.loginBox').show()
    })

    // 导入 layui 中的 form 对象
    const form = layui.form

    // 导入 layui 中的 layer 对象
    const layer = layui.layer
    let pwd = $('.regBox [name=password]').val()

    // 自定义校验规则（密码）
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            let pwd = $('.regBox [name=password]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交的事件
    $('#formReg').on('submit', function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
        let data = {
                username: $('#formReg [name=username]').val(),
                password: $('#formReg [name=password]').val()
            }
            // 发起post请求
            // $.post('/api/reguser',data, (res) => {
            //     if (res.status !== 0) return layer.msg(res.message)
            //     layer.msg('注册成功，请登录')
            // })

        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功,请登录')
                $('#linkLogin').click()
            }
        })
    })
    console.log(this)

    // 监听登录表单的提交的事件
    $('#formLogin').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功')

                // 将登录成功后，服务器返回的 token 字符串存储在 localStorage 中
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })


})