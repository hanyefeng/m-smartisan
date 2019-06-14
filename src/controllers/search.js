const searchheaderTpl = require('../views/headerTpl/searchheaderTpl.html')
const hotsearchTpl=require('../views/hotsearch.html')
const hotListTpl=require('../views/hotList.html')
const queryString = require('query-string');

import Router from '../router/'

import fetch from '../models/fetch'

const searchEvent=async()=>{
  $(".hotList").empty();
  let searchList= await fetch.get("/goodslist/v1/search/suggest?keyword="+$("input").val())
  let data=searchList.data;
  let renderhotListTpl=template.render(hotListTpl,{data});
  $(".hotList").html(renderhotListTpl);
  $(".hotList li").each(function(){
    let span=$(this).text();
    let re =new RegExp("(" + $("input").val() + ")","ig");
    span=(span.replace(re,"<span>$1</span>"))
    $(this).html(span);
  })
  $(".hotList li").on("click",gotoGoodsList);

}

const gotoGoodsList=(e) => {
  let query = queryString.parse(location.hash.split('?')[1])
  let router = new Router({mode: 'hash'})
  router.push('/index/search/searchresult?value='+$(e.target).text()+'&from='+query.from)

}

const render= async()=>{
    $('#index').html(searchheaderTpl)
    let hotword=await fetch.get("/goodslist/v1/search/hot-words")
    let data=hotword.hot;
    let renderhotsearchTpl=template.render(hotsearchTpl,{data});
    $("main").html(renderhotsearchTpl);


    let CnKey=true;
    $("input").on("focus",function(){
        $(".shadow").show();
    }).on("input",function(){
      if($(this).val()!==""){
        $("figure").css("display","block");
        $(".hotList").show();
        setTimeout(function(){
					if(CnKey) {
						searchEvent();
					}
				},1)
      }else{
        $("figure").css("display","none");
        $(".hotList").hide();
      }
    }).on("blur",function(){
        $(".shadow").hide();
    }).on('compositionstart',function(){
      CnKey = false;
    }).on('compositionend',function(){
      CnKey = true;
    });

    $(".hot-search li").on("click",gotoGoodsList)

    $(".cancel").unbind("click").click(function(){
        let router = new Router({mode: 'hash'})
        let query = queryString.parse(location.hash.split('?')[1])
        router.push('/index/home/'+query.from)
    })

    $("figure").on("click",function(){
      $(this).hide();
      $(".shadow").show();
      $(".hotList").hide();
      $("input").val("");
    })
}


export default {
  render
}