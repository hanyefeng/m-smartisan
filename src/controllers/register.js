const registerTpl=require('../views/register.html')

import Router from '../router/'

const render=()=>{
    $("#index").html(registerTpl)

    //1.input时候对应label消失，红框消失   blur 对应内容为空时label显示
    //blur  手机号判断（1。格式 2. 是否已注册） 不通过分别提示 并加红框 
    //blur  密码  判断格式符合才通过  判断
    //blur  重复密码 若 密码格式不对提示密码格式错误
                    //若  密码格式正确提示密码不一致

    //input 密码的时候判断 重复密码是否为空  
    //不为空则进行一次判断 若不符合则提示密码不一致
    $("input").on("input",function(){
        $(this).prev().hide();
        $(this).parent().removeClass("invalid");

        //确定按钮
        let isEmpty=true;
        for(let i=0;i<$("input").length;i++){
            if($("input").eq(i).val()==""){
                isEmpty=false;
            }
        }
        if(isEmpty&&!$(".input").hasClass("invalid")){
            
            $(".btn-wrapper .btn").removeClass("disabled");
        }else{
            $(".btn-wrapper .btn").addClass("disabled");
        }

        if($(this).attr("name")=="password"&&$("#repassword").val()!==""){
            if($(this).val()!==$("#repassword").val()){
                $("#repassword").parent().addClass("invalid")
                $(".tips").addClass("on").children("label").text("两次输入密码不一致");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
                },1000)
                $(".btn-wrapper .btn").addClass("disabled");
            }else{
                $("#repassword").parent().removeClass("invalid")

            }
        }else if($(this).attr("name")=="repassword"){
            if($(this).val()!==$("#password").val()){
                $(".btn-wrapper .btn").addClass("disabled");
            }
        }

        

        

    }).on("blur",function(){
        if($(this).val()===""){
            $(this).prev().show();
            if($(this).attr("name")=="repassword"&&$("#password").val()!==""){
                $(this).parent().addClass("invalid");
                $(".tips").addClass("on").children("label").text("两次密码输入不一致");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
              },1000)
            }
        }else{
            switch ($(this).attr("name")){
                case "mobile":{
                    if(!/^1[35678]\d{9}$/.test($(this).val())){
                        $(this).parent().addClass("invalid");
                        $(".btn-wrapper .btn").addClass("disabled");
                        $(".tips").addClass("on").children("label").text("手机号格式不正确");
                        setTimeout(()=>{
                            $(".tips").removeClass("on");
                        },1000)
                    }else{
                        //验证是否存在该用户
                        let userinfoStr=localStorage.getItem("userinfo");
                        if(userinfoStr){
                            let userinfo=JSON.parse(userinfoStr);
                            let sameInfo=userinfo.some(t => {
                                return t["username"]==$(".username input").val()
                            });
                            if(sameInfo){
                                $(this).parent().addClass("invalid");
                                $(".btn-wrapper .btn").addClass("disabled");
                                $(".tips").addClass("on").children("label").text("该手机号已注册");
                                setTimeout(()=>{
                                    $(".tips").removeClass("on");
                                },1000)
                            }
                        }
                    }
                    break;
                }
                case "verification":{
                    
                    break;
                }
                case "password":{
                // 验证密码格式 密码长度 6~16 位，数字、字母和符号至少包含两种
                //即 不是纯数字 纯字母 或纯字符
                    if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/.test($(this).val())){
                        $(this).parent().addClass("invalid");
                        $(".tips").addClass("on").children("label").text("密码长度 6~16 位，数字、字母和符号至少包含两种");
                        setTimeout(()=>{
                            $(".tips").removeClass("on");
                        },1000)
                        $(".btn-wrapper .btn").addClass("disabled");
                    }else{
                        $(this).parent().removeClass("invalid");
                    }
                    break;
                }
                case "repassword":{
                    if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/.test($(this).val())){
                        $(this).parent().addClass("invalid");
                        $(".tips").addClass("on").children("label").text("密码长度 6~16 位，数字、字母和符号至少包含两种");
                        setTimeout(()=>{
                            $(".tips").removeClass("on");
                        },1000)
                        $(".btn-wrapper .btn").addClass("disabled");
                    }else{
                        if($("#password").val()!==$("#repassword").val()){
                            $(this).parent().addClass("invalid");
                            $(".btn-wrapper .btn").addClass("disabled");
                            $(".tips").addClass("on").children("label").text("两次输入密码不一致");
                            setTimeout(()=>{
                                $(".tips").removeClass("on");
                            },1000)
                        }else{
                            $(this).parent().removeClass("invalid");
                        }                   
                    }
                    break;
                }
            }
        }
    })
                                                

    $(".password input").focus(function(){
        $(".password-repeat").animate({height:".45rem"},300);
    })

    $(".agreement").on("click",function(){
        if($(".checkbox").is(".checked")){
            $(".checkbox").removeClass("checked");
        }else{
            $(".checkbox").addClass("checked");
        }
    })

    $(".btn-wrapper .btn").on("click",function(){
        // if(!($("input").val()!==""&&$(".input").has(".invalid").length==0))return;
        if($(".btn-wrapper .btn").is(".disabled")) return;
        let userinfoStr=localStorage.getItem("userinfo");
        if(!userinfoStr){
            localStorage.setItem("userinfo",
                JSON.stringify([{
                    username:$(".username input").val(),
                    password:$(".password input").val()
                }])
            )       
        }else{
            let userinfo=JSON.parse(userinfoStr);
            let sameInfo=userinfo.some(t => {
                return t["username"]==$(".username input").val()
            });
            if(sameInfo){
                $(".username .input").addClass("invalid");
                $(".btn-wrapper .btn").addClass("disabled");
                $(".tips").addClass("on").children("label").text("该手机号已注册");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
                },1000)
            }else{
                userinfo.push({
                    username:$(".username input").val(),
                    password:$(".password input").val()
                })
                localStorage.setItem("userinfo",JSON.stringify(userinfo));
                $(".tips").addClass("on").children("label").text("注册成功，三秒后自动跳转登陆");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
                    let router = new Router({mode: 'hash'})
                    router.push('/index/login')
                },3000)
            }
        }
    })
}

export default{
    render
}