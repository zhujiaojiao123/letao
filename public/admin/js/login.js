$(function () {
  // 1.表单验证，bootstrapValidator这个表单有要求,bootstrapValidator会在代码提交的时候做表单验证，如果校验失败啦，阻止表单提交， 显示错误信息
  $("form").bootstrapValidator({
    // 2.配置校验的规则，根据表单中的name 属性
    fields: {
      // 3.username的校验规则
      username: {
        validators: {
          // 不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          // 长度的限制
          stringLength: {
            min: 3,
            max: 6,
            message: "用户名长度必须是3-6位"
          },
          callback:{
            message:"用户名不存在",
          }
        }
      },
      // 4.password的校验规则
      password: {
        validators: {
          // 校验是否为空
          notEmpty: {
            message: "密码不能为空",
          },
          // 长度的限制
          stringLength: {
            min: 6,
            max: 12,
            message: "密码的长度必须是6-12位"
          },

          callback:{
            message:"用户名不存在",
          }
        }
      }

      
      
    },
    // 5.配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    }
  });
  // 2.给表单注册一个校验成功的事件,会触发一个事件success.form.bv

  $("form").on("success.form.bv", function (e) {
    // 阻止浏览器的默认行为
    e.preventDefault();
    // alert(123)
    // 发送ajax请求
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("form").serialize(),
      dataType:'json',
      success: function (info) {
        // 修改状态

       if(info.error===1000){
          $("form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
       }
        if(info.error===1001){
          $("form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
        if(info.success){
          // 登陆成功
          location.href="index.html";
        }
      }
    })
  });
  // 3.点击重置按钮。需要把内容及样式都清空
  $("[type='reset']").on("click",function(){
    $("form").data("bootstrapValidator").resetForm(true);
  })
})