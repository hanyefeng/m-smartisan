const detailsTpl = require('../views/details.html')
const dbListGoodsTpl=require('../views/dbListGoods.html')
const queryString = require('query-string');

import fetch from '../models/fetch'

import Router from '../router/'
import { inherits } from 'util';

const gotoDetails = id=>{
  let router = new Router({mode: 'hash'})
  router.push('/index/details?id=' + id)
}

const dialogShow = () =>{
  $('body').addClass("wrap_on");
  $(".dialog-wrap").show();
  $(".toshopcart").hide();
  $('.highlight').hide();
  $(".affirm").css({display:'flex'});
}

const dialogHide = () =>{
  $('body').removeClass("wrap_on");
  $(".dialog-wrap").hide();
  $(".toshopcart").show();
  $('.highlight').show();
  $(".affirm").hide();
}

const addShoppingList = (data) =>{
  let id=String(data.id);
  let num=Number(data.num);
  let shoppingListStr=localStorage.getItem("shoppingList");
  if(!shoppingListStr){
      localStorage.setItem("shoppingList",JSON.stringify({
          [id]:{
              "id":id,
              "num":num
          }
      }))       
  }else{
      let shoppingList=JSON.parse(shoppingListStr);
      if(!shoppingList[id]){
          shoppingList[id]={
                  "id":id,
                  "num":num
          }
          localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
          $(".toast-tips").addClass("on").children("label").text("已添至购物车");
            setTimeout(()=>{
                $(".toast-tips").removeClass("on");
          },1000)
          init();
      }else{
          if(shoppingList[id]["num"]+num>10){
              $(".toast-tips").addClass("on").children("label").text("失败，超过数量限制");
              setTimeout(()=>{
                  $(".toast-tips").removeClass("on");
              },1000)
              return;
          }else{
              shoppingList[id]["num"]+=num;
              localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
              $(".toast-tips").addClass("on").children("label").text("已添至购物车");
                setTimeout(()=>{
                    $(".toast-tips").removeClass("on");
              },1000)
              init();
          }
      }
  }
}

const init = ()=>{
  if($('body').hasClass("wrap_on")){
    dialogShow();
  }else{
    dialogHide();
  }

  let shoppingListStr=localStorage.getItem("shoppingList")
  if(shoppingListStr=="{}"||!shoppingListStr){
    $(".tag").hide();
  }else{
    let shoppingList=JSON.parse(shoppingListStr);
    let numAll=0;
    for(let prop in shoppingList){
      numAll+=Number(shoppingList[prop].num)
    }
    $(".tag").children("span").text(numAll);
    $(".tag").show();
  }
}

const render= async() =>{
  let query = queryString.parse(location.hash.split('?')[1])

  //根据商品信息获取对应信息
  let sku = await fetch.get('/goodslist/product/skus?ids='+query.id+"&with_spu=true");
  let data=sku["data"]["list"][0];
  let renderedDetailTpl = template.render(detailsTpl, {data})
  $('#index').html(renderedDetailTpl)

  for(let prop in data.attr_info){
    $(".attr_item li").each(function(){
      if($(this).eq(0).attr('spec_id')==data.attr_info[prop].spec_value_id){
       $(this).eq(0).addClass("active")
      }
    })
  }

  //商品展示（轮播图）
  new Swiper('.swiper-container', {
    loop:true,
    pagination: {
        el: '.swiper-pagination',
        clickable :true
    },
  })

  //获取初始值
  let _offsetTop=[];
  $('.section').each(function(){
    _offsetTop.push($(this).offset().top-105);
  })

  //标签控制页面滚动
  $(".bar li").on("click",function(){
    $('main').scrollTop(_offsetTop[$(this).attr('page-id')])
  })

  //根据页面滚动让标签变化
  $('main').scroll(function(){
    $(".section").each(function(index,item){
      if($(this).offset().top<=110){
        $(`[page-id="${index}"]`).addClass("active").siblings().removeClass("active")
      }
    })
  })

  init();

  $(".nav-back").on("click",async()=>{
    await $(".dialog-wrap").remove();
    location.hash="#/index/home/position"
  })

  //获取推荐列表
  let nowTime=new Date().getTime();
  let recommendList = await fetch.get('/index/www_json/DefaultRecmdSku.json?_v='+nowTime);
    //1-乱序  2-取10个
  let sortRecom=recommendList.sort(function(){
    　return Math.random() > .5 ? -1:1;
  });
  sortRecom=sortRecom.splice(10);
  let recStr=sortRecom.join(',')
  let rocommendSku = await fetch.get('/goodslist/product/skus?ids='+recStr);
  let dbData={
    item:sortRecom,
    sku:rocommendSku.data.list
  }
  let renderdbListGoodsTpl=template.render(dbListGoodsTpl,{dbData});
  $('.dbContent').html(renderdbListGoodsTpl)

  //模态窗
  $(".highlight").on('click',dialogShow)
  $(".toshopcart").on('click',dialogShow)
  $(".item-select").on('click',dialogShow)

  $('.dialog-shadow').on("click",dialogHide)

  $(".affirm").unbind("click").click(function(){
    //如数量超限则提示上限否则 存入localstroage 提示存入成功
    //关闭模态窗
    //改变下方tag值
    let goodsData={
      id:query.id,
      num:$(".btn-num").text()
    }
    addShoppingList(goodsData);
    dialogHide();
  })

  //模态窗里li的点击切换效果
  $(".attr_item li").unbind("click").click(function(){
    if($(this).hasClass("active"))return;
    $(this).addClass("active").siblings().removeClass("active");
    
    let targetArr=[];
    $(".attr_item li.active").each(function(t){
      targetArr.push({
        type:$(this).attr("typeId"),
        spec_id:$(this).attr("spec_id")
      })
    })
    // $(".dialog-wrap").remove();
    let styleArr=data.spu.sku_info;
    for(let i=0;i<styleArr.length;i++){
      for(let k=0;k<styleArr[i]["spec_json"].length;k++){
          if(!(styleArr[i]["spec_json"][k]["spec_id"]==targetArr[k]["type"]&&styleArr[i]["spec_json"][k]["spec_value_id"]==targetArr[k]["spec_id"])){
              break;
          }
          if(k==styleArr[i]["spec_json"].length-1){
              let skuid=styleArr[i]["sku_id"];
              gotoDetails(skuid);
          }
      }
    }
  })

  //商品数量
  $(".count-btn").unbind("click").click(function(e){
    if($(this).hasClass("disabled"))return;
    if($(this).hasClass('down')){ 
      $(this).next().text(Number($(this).next().text())-1)
      $(".up").removeClass("disabled");
      if($(".btn-num").text()<=1){
        
        $(this).addClass("disabled")
      }
    }else{
      $(this).prev().text(Number($(this).prev().text())+1)
      $(".down").removeClass("disabled");
      if($(".btn-num").text()>=10){$(this).addClass("disabled")}
    }
  })


  //根据商品进入商品详情
  $("[sku_id]").on("click",function(){
    let skuid=$(this).attr('sku_id');
    gotoDetails(skuid);
  })
}
export default {
  render
}