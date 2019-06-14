const classifyTpl = require('../views/classify.html')
const classifyheaderTpl=require('../views/headerTpl/classifyheader.html')

import Router from '../router/'

import fetch from '../models/fetch'

const gotoDetails = id=>{
  let router = new Router({mode: 'hash'})
  router.push('/index/details?id=' + id)
}

const render= async ()=> {
  $('header').html(classifyheaderTpl)
  let data = await fetch.get('/home/marketing/mobile/category_a2b204b7ec11fdf54fc472ca30fcff78.json');
  let classifygoodsStr="skus?ids=";
  for(let i=0;i<data.length;i++){
      data[i]["layout"]["dataList"].forEach(function(t){
      classifygoodsStr+=t["sku"]+",";
    })
  }
  let skuList = await fetch.get('/goodslist/product/'+classifygoodsStr.substr(0,classifygoodsStr.length-1));
  let classifyData={
    item:data,
    sku:skuList["data"]["list"]
  }
  let renderclassifyData=template.render(classifyTpl,{classifyData})
  $('main').html(renderclassifyData)

  $("[sku_id]").on("click",function(){
    let skuid=$(this).attr('sku_id');
    gotoDetails(skuid);
  })

  $(".search").unbind("click").on("click",function(){
    let router = new Router({mode: 'hash'})
    router.push('/index/search?from=classify')
  })
}

export default {
  render
}