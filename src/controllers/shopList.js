const shopListheaderTpl = require('../views/headerTpl/shopListheader.html')
const shopListTpl=require("../views/shopList.html")
const shopListEmptyTpl = require('../views/shopListEmpty.html')

import Router from '../router/'

import fetch from '../models/fetch'



const render = async()=>{
  $('header').html(shopListheaderTpl)

  let shoppingListStr=localStorage.getItem("shoppingList");
  let goodsData={};
  if(shoppingListStr=="{}"||!shoppingListStr){
    $('main').html(shopListEmptyTpl)
    if(getCookie("userinfo")){
      $(".login").remove();
    }
  }else{
    let shoppingList=JSON.parse(shoppingListStr);
    let idArr=[];
    for(let prop in shoppingList){
      idArr.push(shoppingList[prop].id);
    }
    let skuStr=idArr.join(",");
    let sku = await fetch.get('/goodslist/product/skus?ids='+skuStr);
    goodsData=sku.data.list;
    let data={
      localData:shoppingList,
      skuData:goodsData
    }
    let renderShopListTpl=template.render(shopListTpl,{data});
    $('main').html(renderShopListTpl);
    $("<a>").addClass("nav-edit").text("编辑").appendTo($("header"))
  }
  init(goodsData);

}

const init=(goodsData) =>{
  $(".quantity .num").each(function(){
    if(Number($(this).text())>=10){
      $(this).next().addClass("disabled")
    }
    if(Number($(this).text())<=1){
      $(this).prev().addClass("disabled")
    }
  })

  //编辑按钮
  $(".nav-edit").click(function(){
    if($(this).text()=="编辑"){
      $(this).text("完成");
      $(".quantity").css("display","flex");
      $(".price .sum").hide();
      $(".sum_info .btn-blue").addClass("edit-red").text("删除所选");
      $(".sum_info .desc").hide();
      $(".select_info i").addClass("color-red");
    }else{
      $(this).text("编辑");
      $(".quantity").css("display","none");
      $(".price .sum").show();
      $(".sum_info .btn-blue").removeClass("edit-red").text("现在结算");
      $(".sum_info .desc").show();
      $(".select_info i").removeClass("color-red");
      //完成事件
      let shoppingListStr=localStorage.getItem("shoppingList");
      let shoppingList=JSON.parse(shoppingListStr);
      let data={
        localData:shoppingList,
        skuData:goodsData
      }
      let renderShopListTpl=template.render(shopListTpl,{data});
      $('main').html(renderShopListTpl);
      init(goodsData);

    }
  })

  //选择按钮
  $(".m-check").click(function(e){
    if($(this).hasClass("check-on")){
      $(this).removeClass("check-on");
    }else{
      $(this).addClass("check-on");
    }

    if($(this).hasClass("all-check")){
      if($(this).hasClass("check-on")){
        $(".m-check").addClass("check-on");
      }else{
        $(".m-check").removeClass("check-on");
      }
    }else{
      let count=0;
      $(".m-check").each(function(){
          if(!($(this).is(".all-check"))&&$(this).is(".check-on")){
              count++;
          }
      })
      if(count==$(".m-check").length-1){
        $(".all-check").addClass("check-on");
      }else{
        $(".all-check").removeClass("check-on");
      }
    }
    bottomChange(goodsData);
  })

  //改变数量
  $(".count-btn").click(function(){
    if($(this).hasClass("disabled"))return;
    if($(this).hasClass("down")){
      $(this).next().text(Number($(this).next().text())-1);
      if(Number($(this).next().text())<=1){
        $(this).addClass("disabled");
      }
      $(this).next().next().removeClass("disabled");
    }else{
      $(this).prev().text(Number($(this).prev().text())+1);
      if(Number($(this).prev().text())>=10){
        $(this).addClass("disabled");
      }
      $(this).prev().prev().removeClass("disabled");
    }

    let data={
      id:$(this).parents(".item").attr("goodsid"),
      num:$(this).parent().children(".num").text()
    }
    changeShoppingList(data,goodsData);
  })

  //删除商品
  $(".btn-blue").click(function(){
    if($(this).hasClass("btn-disabled"))return;
    if(!$(this).hasClass("edit-red"))return;
    let delArr=[];
    $(".check-on:not(.all-check)").each(function(){
      delArr.push($(this).parents(".item").attr("goodsid"));
    })
    let shoppingListStr=localStorage.getItem("shoppingList");
    let shoppingList=JSON.parse(shoppingListStr);
    for(let i=0;i<delArr.length;i++){
      delete shoppingList[delArr[i]];
      $(`[goodsid="${delArr[i]}"]`).remove();
    }
    localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
      $(".toast-tips").addClass("on").children("label").text("删除成功");
      setTimeout(()=>{
          $(".toast-tips").removeClass("on");
      },1000)
      if(JSON.stringify(shoppingList)=="{}"||!JSON.stringify(shoppingList)){
        $('header').html(shopListheaderTpl)
        $('main').html(shopListEmptyTpl)
        if(getCookie("userinfo")){
          $(".login").remove();
        }
      }
      bottomChange(goodsData)
      shoppingListStr=localStorage.getItem("shoppingList")
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
  })
}

const bottomChange= (goodsData) => {
  let shoppingList=JSON.parse(localStorage.getItem("shoppingList"));
  let data={
    localData:shoppingList,
    skuData:goodsData
  }

  let numAll=0;
  let moneyAll=0;
  // let self=this;

  $(".m-check").each(function(){
      if(!($(this).is(".all-check"))&&$(this).is(".check-on")){
          numAll+=data.localData[$(this).parents(".item").attr("goodsid")]["num"];
          for(let i=0;i<data.skuData.length;i++){
              if(data.skuData[i]["id"]==$(this).parents(".item").attr("goodsid")){
                  moneyAll+=data.localData[$(this).parents(".item").attr("goodsid")]["num"]*data.skuData[i]["price"];
              }
          }
      }
  })
  $(".select_info i").text(numAll);
  $(".total-price>span>span").text(moneyAll+".00");
  if(numAll>0){
    $(".btn-blue").removeClass("btn-disabled");
  }else{
    $(".btn-blue").addClass("btn-disabled");
  }
}

const changeShoppingList = (data,goodsData)=>{
  let id=String(data.id);
  let num=Number(data.num);
  let shoppingListStr=localStorage.getItem("shoppingList");
  let shoppingList=JSON.parse(shoppingListStr);
  shoppingList[id]["num"]=num;
  localStorage.setItem("shoppingList",JSON.stringify(shoppingList));
  bottomChange(goodsData);
}



export default {
  render
}