const homeTpl = require('../views/home.html')
export default {
  render() {
    $('#index').html(homeTpl)
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
}