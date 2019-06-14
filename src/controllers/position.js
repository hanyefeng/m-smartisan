const positionheaderTpl=require('../views/headerTpl/positionheader.html')
const positionTpl = require('../views/position.html')
const hotGoodsTpl = require('../views/hotGoods.html')
const brandGoodsTpl=require('../views/brandGoods.html')
const dbGoodsTpl=require('../views/dbGoods.html')
const dbListGoodsTpl=require('../views/dbListGoods.html')
const goodslistTpl=require('../views/goodsList.html')

import Router from '../router/'

import fetch from '../models/fetch'


// const gotoPage = id => {
//   let router = new Router({mode: 'hash'})
//   router.push('/index/details?id=' + id)
// }
const gotoGoodsList = id=>{
  let router = new Router({mode: 'hash'})
  router.push('/index/home/goodslist?id=' + id)
}

const gotoDetails = id=>{
  let router = new Router({mode: 'hash'})
  router.push('/index/details?id=' + id)
}

const render = async() => {
  $('header').html(positionheaderTpl)
  $('main').html(positionTpl)

  //轮播图
  new Swiper('.swiper-container', {
    autoplay: true,//可选选项，自动滑动
    loop:true,
    pagination: {
        el: '.swiper-pagination',
        clickable :true
    },
})
  let result = await fetch.get('/home/marketing/mobile/index_a67905b00195f1f0dfeb4157c903a310.json')
  let goodsStr="skus?ids=";
  for(let i=0;i<result["floors"].length;i++){
    result["floors"][i]["dataList"].forEach(function(t){
      goodsStr+=t+",";
    })
  }
  let skuList = await fetch.get('/goodslist/product/'+goodsStr.substr(0,goodsStr.length-1));
  let data={
    floors:result["floors"],
    sku:skuList["data"]["list"]
  };
  //热门商品
  data.label="0";
  let renderedhotGoodsTpl = template.render(hotGoodsTpl, { data })
  $('.hotGoods').html(renderedhotGoodsTpl)


  //周边品牌 外壳
  data.label="1";
  let renderbrandGoodsTpl=template.render(brandGoodsTpl,{data});
  $('.brandGoods').html(renderbrandGoodsTpl);
  //周边品牌内容为商品列表模式
  let goodsData={
    item:result["floors"][1]["dataList"],
    sku:skuList["data"]["list"]
  }
  let renderedgoodslistTpl = template.render(goodslistTpl, { goodsData })
  $('.brandGoods .content').html(renderedgoodslistTpl)

  //官方配件
  data.label="2";
  let renderdbGoodsTpl=template.render(dbGoodsTpl,{data});
  $('.officeGoods').html(renderdbGoodsTpl);
  let dbData={
    item:result["floors"][2]["dataList"],
    sku:skuList["data"]["list"]
  }
  let renderdbListGoodsTpl = template.render(dbListGoodsTpl, {dbData})
  $('.officeGoods .dbContent').html(renderdbListGoodsTpl)

  //坚果手机
  data.label="3";
  renderdbGoodsTpl=template.render(dbGoodsTpl,{data});
  $('.ttPhone').html(renderdbGoodsTpl);
  dbData.item=result["floors"][3]["dataList"];
  renderdbListGoodsTpl = template.render(dbListGoodsTpl, {dbData})
  $('.ttPhone .dbContent').html(renderdbListGoodsTpl)
  // $('#position-list').on('click', 'li', function() {
  //   let id = $(this).attr('data-id')
  //   gotoPage(id)
  // })

  //对商品价格进行二次渲染
  $(".price span").each((index,item)=>{
    item.textContent=num2money(item.textContent)+".00"
  })

  //根据首页标签进入对应商品列表
  $("div.title").on("click",function(){
    let floor = $(this).attr('data-list-id')
    gotoGoodsList(floor)
  })

  //根据首页商品进入商品详情
  $("[sku_id]").on("click",function(){
    let skuid=$(this).attr('sku_id');
    gotoDetails(skuid);
  })

  //首页搜索进入搜索页面
  $(".search").unbind("click").on("click",function(){
    let router = new Router({mode: 'hash'})
    router.push('/index/search?from=position')
  })
}

export default {
  render
}