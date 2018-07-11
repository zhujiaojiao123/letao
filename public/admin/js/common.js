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
