// 做题思路1.开分支 2.写静态页面3。写模板和渲染页面 4.点击添加按钮出现模态框 5.进行模态框消失，然后渲染页面
$(function () {
  var page = 1;
  var pageSize = 5;
  // 打开页面，加载出来
  render();
  // 1.点击按钮出现模态框
  $(".btn-add").on("click", function () {
    $("#secondModal").modal("show");
    // 2.进行表单里各项元素的操作
    // 2.1发送ajax请求，获取一级元素的元素，进行渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }

    })

  })
  // 3.给a注册点击事件，进行事件委托
  $(".dropdown-menu").on("click", "a", function () {
    // 3.1获取当前的a的文本
    $(".dropdown-text").html($(this).text());
    // 3.2获取a的id
    var id = $(this).data("id");
    $("input[name='categoryId']").val(id);

  })

  // 4.图片上传功能
  // 4.1引包
  // 4.2设置url和name属性
  // 4.3fileupload方法
  $("#filedUpload").fileupload({
    done: function (e, data) {
      // 1.显示图片
      $(".img_box img").attr("src", data.result.picAddr);
      // 2.把图片地址返回给隐藏的input中
      $("[name='brandLogo']").val(data.result.picAddr);
      // 3.让brandLogo验证通过
      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");

    }
  })
  // 5.表单校验
  $("form").bootstrapValidator({
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
        brandName: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      },
      
    },

    // 配置不做校验的类型
      excluded: [],
      //  配置小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      }
  });
// 6.当表单注册成功时发送ajax请求
  $("form").on("success.form.bv",function(e){
    // 1.阻止默认行为
    e.preventDefault();
    // 2.发送ajax请求
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data:$("form").serialize(),
      success:function(info){
        console.log(info);
        // 进行判断
        if(info.success){
          // 1.隐藏模态框
            $("#secondModal").modal("hide");
            // 2.渲染页面的第一页
            page=1;
            render();
            // 3.重置表单
            $("form").data("bootstrapValidator").resetForm(true);
            // 选择一级和图片回到默认的状态
             $(".dropdown-text").html("请选择一级分类");
              $(".img_box img").attr("src", "./images/none.png");

        }
      },
    })
  })

  // 1.发送ajax请求
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        // 根据模板进行渲染
        var html = template("tpl", info);
        $("tbody").html(html);
        // 然后进行分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            // 渲染当前页面
            page = p;
            render();
          }
        })
      }
    })
  }
})