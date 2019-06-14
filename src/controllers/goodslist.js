const goodslistheaderTpl=require('../views/headerTpl/goodslistheader.html')
const goodslistTpl = require('../views/goodsList.html')
const quertString=require('query-string')

import fetch from '../models/fetch'

const render = async() => {
    let query=quertString.parse(location.hash.split("?")[1])
    //主页加载的商品列表
    let result = await fetch.get('/home/marketing/mobile/index_a67905b00195f1f0dfeb4157c903a310.json')
    let data=result['floors'][query.id]
    let goodsStr="skus?ids=";
    data["dataList"].forEach(function(t){
    goodsStr+=t+",";
    })
    let skuList = await fetch.get('/goodslist/product/'+goodsStr.substr(0,goodsStr.length-1));
    let goodsData={
        item:data["dataList"],
        sku:skuList["data"]["list"]
      }
    let rendergoodslistheaderTpl=template.render(goodslistheaderTpl,{data})
    $('header').html(rendergoodslistheaderTpl);
    let renderedgoodslistTpl = template.render(goodslistTpl, { goodsData })
    $('main').html(renderedgoodslistTpl)
    $(".nav-back").on("click",function(){
        history.back();
    })
}

export default {
    render
}