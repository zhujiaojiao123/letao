// 做题思路1.开分支 2.写静态页面 3分页和渲染在页面上借助模板 4.点击添加分类 出现模态框5 发送ajax请求，模态框消失重新渲染页面
$(function () {
  var page = 1;
  var pageSize = 5;
  // 页面一加载出来，进行渲染一次,
  render();
  // 1.点即添加按钮，出现模态框，然后进行发送ajax请求
  $(".btn-add").on("click", function () {
    $("#firstModal").modal("show");
  });
  // 2.进行表单的校验
  $("form").bootstrapValidator({
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    },
      // 配置小图标
       feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    }
  })
  // 3给表单注册事件成功后，进行ajax请求，然后渲染页面，并返回第一页
    $("form").on("success.form.bv",function(e){
      // 阻止默认行为,并阻止表单默认提交
       e.preventDefault();
       $.ajax({
        type:"post",
        url:"/category/addTopCategory",
        data:$("form").serialize(),
        success:function(info){
          // console.log(info);
          if(info.success){
            // 隐藏模态框
             $("#firstModal").modal("hide");
            // 渲染第一页
            page=1;
            render();
            // 重置表单
            $("form").data("bootstrapValidator").resetForm(true);
          }
        }
      })
    })
      
   

  // 4.借助模板和分页进行发送ajax请求
  function render() {
    // 发送ajax请求
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        //  进行渲染在页面利用模板引擎
        var html = template("tpl", info);
        $("tbody").html(html);
        // 返回数据后进行分页的处理
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            //渲染p对应的页面即可
            page = p;
            render();
          }
        });
      }
    })
  }

})