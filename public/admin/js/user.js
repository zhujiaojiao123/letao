// 做题思路：1.准备分支 2.准备静态页面 3.借助模板和分页进行渲染 4.点击按钮，出现模态框，5.确定按钮发送ajax请求，成功就渲染页面，模态框消失

$(function () {
  var page = 1;//当前页
  var pageSize = 5;//每页的条数
  // 1.页面一打开就进行页面渲染
  render();
  // 2.点击禁用或者启用模态框的状态
  var id;
  var isDelete;
  // 因为是动态渲染，所以需要事件委托
  $("tbody").on("click",".btn",function(){
    // 模态框出现
    $("#userModal").modal("show");
    // 如果是确定则发送ajax请求
    // 先获取id ,isDelete;因为接口文档是必须要传的
    id=$(this).parent().data("id");
    isDelete=$(this).hasClass("btn-success")?"1":"0";
    $(".btn_confirm").on("click",function(){
         $.ajax({
      type:"post",
      url:"/user/updateUser",
      data:{
        id:id,
        isDelete:isDelete
      },
      success:function(info){
        // console.log(info);
        if(info.success){
          // 模态框消失
          $("#userModal").modal("hide");
          // 重新渲染页面
          render();
        }

      }
    })
    })
   
  })

  // 3.发送ajax请求
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        // 1.将模板和模板引擎结合起来
        var html = template("tpl", info);
        $("tbody").html(html);
        //2。成功之后把分页写出来，返回数据就进行分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//版本
          currentPage:page,
          totalPages:Math.ceil(info.total/info.size),
          // 点击页码的回调函数
          onPageClicked:function(a,b,c,p){
            // 修改当前页
            page=p,
            // 重新渲染
            render();
          }
        })

      }


  })
}
})

