const loginTpl=require('../views/login.html')

import Router from '../router/'

const render=()=>{
    $("#index").html(loginTpl);
    $("input").on("input",function(){
        $(this).prev().hide();
        if(/^1[35678]\d{9}$/.test($(".username input").val())&&$(".password input").val()!==""){
            $(".loginContainer .btn").removeClass("disabled");
        }else{
            $(".loginContainer .btn").addClass("disabled");
        }
    }).on("blur",function(){
        if($(this).val()==""){
            $(this).prev().show();
            return;
        }
        if($(this).attr("name")=="username"){
            if(!/^1[35678]\d{9}$/.test($(this).val())&&!/^[\da-zA-Z][\w\.-]*[^\.-]@[0-9a-z]+(\.[0-9a-z]+)+$/g.test($(this).val())){
                //提示
                $(".tips").addClass("on").children("label").text("手机号/邮箱格式错误");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
              },1000)
            }
        }
    })

    $(".loginContainer .btn").on("click",function(){
        if($(this).hasClass("disabled"))return;
        if($(".password input").val().length<6){
            $(".tips").addClass("on").children("label").text("密码错误");
            setTimeout(()=>{
                $(".tips").removeClass("on");
            },1000)
            $(".loginContainer .btn").addClass("disabled");
        }else{
            let userinfoStr=localStorage.getItem("userinfo");
            if(!userinfoStr){
                $(".username .input").addClass("invalid");
                $(".tips").addClass("on").children("label").text("手机号/邮箱不存在");
                setTimeout(()=>{
                    $(".tips").removeClass("on");
                },1000)
                $(".loginContainer .btn").addClass("disabled");
            }else{
                let userinfo=JSON.parse(userinfoStr);
                let userExist=userinfo.some(function(t){
                    return t["username"]==$(".username input").val();
                })
                if(!userExist){
                    $(".username .input").addClass("invalid");
                    $(".tips").addClass("on").children("label").text("手机号/邮箱不存在");
                    setTimeout(()=>{
                        $(".tips").removeClass("on");
                    },1000)
                    $(".btn").addClass("disabled");
                }else{
                    let passwordTrue=userinfo.some(function(t){
                        return t["username"]==$(".username input").val()&&t["password"]==$(".password input").val();
                    })
                    if(!passwordTrue){
                        $(".password .input").addClass("invalid");
                        $(".tips").addClass("on").children("label").text("密码错误");
                        setTimeout(()=>{
                            $(".tips").removeClass("on");
                        },1000)
                        $(".btn").addClass("disabled");
                    }else{
                        addCookie("userinfo",JSON.stringify({username:$(".username input").val(),password:$(".password input").val()}),10);
                        let router = new Router({mode: 'hash'})
                        router.push('/index/home/position')
                    }
                }
            }
        }
    })

}

export default {
    render
  }