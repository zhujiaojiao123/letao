// 做题思路：1.开分支 2.写静态页面 3.模板渲染到页面 4.分页的生成 5.模态框的出现 6.二级渲染到模态矿中 7.图片的上传 8.表单校验 9.校验成功后注册的事件 10.合并分支 
$(function () {
  var page = 1;
  var pageSize = 5;
  // 创建一个空数组。用来装图片的地址
  var imgs = [];
  //页面一加载出来就渲染出来
  render();

  // 1.点击添加按钮，出现模态框
  $(".btn-add").on("click", function () {
    $("#productModal").modal("show");
    // 修改静态的模态框,并且发送ajax请求渲染在二级分类的页面上
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var html = template("tpl2", info);
        $(".dropdown-menu").html(html);
      }
    })
  })
  // 2.给模态框中记录下a的文本和id赋值给对应的二级分类和隐藏框，进行事件委托
  $(".dropdown-menu").on("click", "a", function () {
    // 2.1获取文本给二级分类
    $(".dropdown-text").text($(this).text());
    // 2.2获取id给隐藏框
    $("input[name='brandId']").val($(this).data("id"));
    // 2.3动态的改变校验的状态,手动的把brandid验证通过
    $("form").data("bootstrapValidator").updateStatus("brandId", "VALID")
  })
  // 3.上传图片三个步骤，引包，name和data-url属性，获取图片的路径
  $("#filedUpload").fileupload({
    // 上传成功之后执行的文件
    done: function (e, data) {
      if (imgs.length == 3) {
        return;
      }
      // 1.动态的创建图片，吧返回的图片地址赋值给动态创建的img
      console.log(data.result);
      // 将其放在数组中
      imgs.push(data.result);

      $(".img_box").append('<img src="' + data.result.picAddr + '" width=100 height=100 alt="">');
      // 动态的改变校验的状态，手动使得 brandLogo通过
      if (imgs.length == 3) {
        // 让其通过验证
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID")
      } else {
        $("form").data("bootstrapValidator").updateStatus("brandLogo", "INVALID")
      }

    }
  })
  // 5.表单的检验
  $("form").bootstrapValidator({
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          // 正则校验
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入正确的库存'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "尺寸不能为空"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的库存'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "原价不能为空"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "价格不能为空"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "图片不能为空"
          }
        }
      }


    },
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 3.指定不校验的类型
    excluded: []

  })
  // 6.当校验成功之后发送ajax请求
  $("form").on("success.form.bv", function (e) {
    // 阻止默认行为
    e.preventDefault();
    // 发送ajax请求
    var param = $("form").serialize();

    param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
    param += "&picName1=" + imgs[1].picName + "&picAddr1=" + imgs[1].picAddr;
    param += "&picName1=" + imgs[2].picName + "&picAddr1=" + imgs[2].picAddr;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: param,
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 1.隐藏模态框
          $("#productModal").modal("hide");
          // 2.重新渲染页面
          page = 1;
          render();
          // 3.重置表单的内容和样式
          $("form").data("bootstrapValidator").resetForm(true);
          // 4.重置表单两个特殊的地方，二级分类和图片上传
          $(".dropdown-text").text("请输入二级分类");
          $(".img_box").empty();
          // 5.清空数组
          imgs = [];
        }
      }
    })
  })

  // 6.发送ajax请求并模板渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);

        var html = template("tpl", info);
        $("tbody").html(html);
        // 返回成功后进行分页
        $.ajax({
          type: "get",
          url: "/product/queryProductDetailList",
          data: {
            page: page,
            pageSize: pageSize
          },
          success: function (info) {
            $("#paginator").bootstrapPaginator({
              bootstrapMajorVersion: 3,
              currentPage: page,
              totalPages: Math.ceil(info.total / info.size),
              itemTexts: function (type, page, current) {
                  switch(type){
                    case "first":
                    return "首页";
                    case "prev":
                    return "上一页";
                    case "page":
                    return page+"页";
                    case "next":
                    return "下一页";
                    case "last":
                    return "最后一页";
                  }
              },

              tooltipTitles:function(type,page,current){
                switch(type){
                    case "first":
                    return "首页";
                    case "prev":
                    return "上一页";
                    case "page":
                    return page+"页";
                    case "next":
                    return "下一页";
                    case "last":
                    return "最后一页";
                  }
              },
                useBootstrapTooltip:true,
              onPageClicked:function(a,b,c,p){
                page=p;
                render();
              }

            })


          }
        })

      }
    })
  }
})