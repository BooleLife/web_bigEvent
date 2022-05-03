$(function() {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    // 定义查询参数对象
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()

    // 初始化文章表格的方法
    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        const y = padZero(dt.getFullYear())
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        const hh = padZero(dt.getHours())
        const mm = padZero(dt.getMinutes())
        const ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 因为代码从上到下执行，还没有发起请求前，layui 已经渲染好了分类的下拉选项卡，但其中没有任何选项，因此页面中不会显示出分类的下拉选项卡
                // 因此我们需要在发起请求之后再渲染一次页面
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    function renderPage(total) {
        laypage.render({

            elem: 'pageBox', //注意，pageBox 是 ID，不用加 # 号
            count: total, //数据总数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义排版,数组中的顺序代表显示的顺序
            limits: [2, 3, 4], //用户可以选择每页显示几条数据

            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调

            jump: function(obj, first) {
                q.pagenum = obj.curr // obj.curr可以获得最新的页码值
                q.pagesize = obj.limit // obj.limit可以获得最新的条目数

                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    initTable()
                }
            }
        })

    }

    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id') //获取文章id

        // 通过一页的删除按钮的个数,判断是否需要页面减一
        // 如果一页上面只有一个删除按钮了,则删除了这条数据之后页面值就需要减一
        let len = $('.btn-delete').length

        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        // 如果这是最后一页的数据了,这页码值不能再减了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })

    })
})