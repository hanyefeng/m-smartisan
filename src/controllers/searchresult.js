const searchheaderTpl = require('../views/headerTpl/searchheaderTpl.html')
const goodslistTpl=require('../views/goodsList.html')
const queryString = require('query-string');

import Router from '../router/'

import fetch from '../models/fetch'

const gotoDetails = id=>{
    let router = new Router({mode: 'hash'})
    router.push('/index/details?id=' + id)
}

const render= async()=>{
    $('#index').html(searchheaderTpl)
    let query = queryString.parse(location.hash.split('?')[1]);
    $("input").attr("placeholder",query.value)
    $("input").one("click",function(){
        $("input").val(query.value)
    })
    //获取当前对应的id
    let _goodsList=await fetch.get("/goodslist/v1/search/result?keyword="+query.value)
    let goodsList=_goodsList.data.spu;
    for(let i=0;i<goodsList.length;i++){
        goodsList[i]+="01";
    }
    let goodsListStr=goodsList.join(',');

    let _searchResult=await fetch.get('/goodslist/product/skus?ids='+goodsListStr);
    let searchResult=_searchResult.data.list;
   
    let goodsData={
        item:goodsList,
        sku:searchResult
    }  
    let rendergoodslistTpl=template.render(goodslistTpl,{goodsData});
    $("main").html(rendergoodslistTpl)

    $("[sku_id]").on("click",function(){
        let skuid=$(this).attr('sku_id');
        gotoDetails(skuid);
    })

    $(".cancel").unbind("click").click(function(){
        let router = new Router({mode: 'hash'})
        router.push('/index/search?from='+query.from)
    })
}

export default {
    render
}