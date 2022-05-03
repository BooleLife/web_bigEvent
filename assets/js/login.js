$(function() {
    // 导入 layui 中的 form 对象、layer 对象
    const form = layui.form
    const layer = layui.layer

    // 为去注册的按钮绑定点击事件
    $('#linkReg').on('click', function() {

        // 点击注册时，隐藏登录的表单框
        $('.loginBox').hide()

        // 显示注册的表单框
        $('.regBox').show()
    })

    // 为去登录的按钮绑定点击事件
    $('#linkLogin').on('click', function() {

        // 点击登录时，隐藏注册的表单框
        $('.regBox').hide()

        // 显示登录的表单框
        $('.loginBox').show()
    })

    // 自定义校验规则（密码）
    // 调用了 layui 中 form 对象提供的 verify 方法
    form.verify({

        // 密码的一个校验规则
        // 语法：规则名:[正则表达式，错误提示]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 确认密码的一个校验规则
        // 因为不是一个正则表达式就能校验，因此使用函数的方式进行校验
        // 语法：规则名:函数体
        // value可以拿到表单框里面的值
        repwd: function(value) {

            // 获取注册框里面的密码值
            // 作用：用于后面确认密码框和其进行匹配
            let pwd = $('.regBox [name=password]').val()

            // 如果密码框和确认密码框里面的值不一样，则return 两次密码不一致的错误提示
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交的事件
    $('#formReg').on('submit', function(e) {

        // 阻止默认的提交行为
        e.preventDefault()

        // 声明一个对象用于存储登录表单中填写的用户名和密码
        let data = {
            username: $('#formReg [name=username]').val(),
            password: $('#formReg [name=password]').val()
        }

        // 发起ajax请求 POST
        // 将登录表单的用户名和密码提交到后台，存储到数据库中
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: (res) => {
                // 判断服务器响应给客户端的状态是否为 0 
                // 如果不是 0 则代表请求失败，反之请求成功
                if (res.status !== 0) return layer.msg(res.message)

                layer.msg('注册成功,请登录')

                // 请求成功之后,手动调用一次去登录的点击事件
                $('#linkLogin').click()
            }
        })
    })

    // 监听登录表单的提交的事件
    $('#formLogin').submit(function(e) {
        e.preventDefault()
            // 发起ajax请求,POST
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), //同过serialize()获取表单中填写的全部值,提交给后台进行校验
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功')

                // 登录成功后，将服务器返回的 token 字符串存储在 localStorage 中
                localStorage.setItem('token', res.token)

                // 然后跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})