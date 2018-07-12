// ajax有6个全局变量
// ajaxStart();ajaxSend();ajaxSuccess();ajaxError();ajaxComplete();ajaxStop();
$(document).ajaxStart(function(){
  NProgress.start();
});

$(document).ajaxStop(function(){
  setTimeout(function(){
    // ajax请求之后
    NProgress.done();
  },500)
})
// 二级菜单的显示与隐藏
$(".second").prev().on("click",function(){
  $(this).next().slideToggle();
})
// 侧边栏的显示与隐藏
$(".icon_menu").on("click",function(){
  $(".lt_aside").toggleClass("active");
  $("body").toggleClass("active");
})
// 退出功能
$(".icon_logout").on("click",function(){
  $("#logoutModal").modal("show");
})
//给退出功能发送ajax请求
$(".btn_logout").on("click",function(){
  // 发送ajax请求
  $.ajax({
    type:"get",
    url:'/employee/employeeLogout',
    success:function(info){
      if(info.success){
        location.href="login.html";
      }
    }
  })
})