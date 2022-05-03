$(function() {
    const layer = layui.layer
    const form = layui.form

    // 初始化文章列表的函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                let htmlStr = template('tpl-table', res) // 调用template模板的template函数
                $('tbody').html(htmlStr) // 将其展示到页面上
            }
        })
    }

    // 初始化文章列表
    initArtCateList()

    // 声明一个变量用保存layui 弹出框的索引,便于关闭
    let indexAdd = null

    // 为添加按钮绑定单击事件
    $('#btnAddCate').on('click', function() {

        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增数据失败')
                }
                layer.msg('新增数据成功')

                layer.close(indexAdd)

                // 添加数据之后需要重新渲染页面
                initArtCateList()
            }
        })
    })

    // 声明一个变量用保存layui 弹出框的索引,便于关闭
    let indexEdit = null

    // 运用事件委托的方式为编辑按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 给编辑的表单form赋上原本的值
                form.val('form-edit', res.data)
            }
        })
    })

    // 运用事件委托的方式为表单绑定点击事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')

                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 运用事件委托的方式为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')

                    layer.close(index)

                    initArtCateList()
                }
            })

        });
    })
})