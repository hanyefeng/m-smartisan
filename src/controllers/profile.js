const profileheaderTpl=require('../views/headerTpl/profileheader.html')
const profileTpl = require('../views/profile.html')

import Router from '../router/'

export default {
  render() {
    $('header').html(profileheaderTpl);
    $('main').html(profileTpl)

    let islogin=null;
    if(!getCookie("userinfo")){
      $(".box-userinfo").click(function(){
        let router = new Router({mode: 'hash'})
        router.push('/index/login')
      })
    }else{
      //已登录
      let username=JSON.parse(getCookie("userinfo"))["username"];
      let showname=username.replace(/(.{3}).*(.{4})/, '$1******$2')

      $(".box-userinfo h3").text("+86 "+showname);
      $(".box-userinfo").click(function(){
        let router = new Router({mode: 'hash'})
        addCookie("userinfo","",-1);
        router.push('/index/home/position')
      })
    }
  }
}