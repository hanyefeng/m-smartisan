export default {
  get(url) {
    return $.ajax({
      url,
      type: 'get',
      success(result) {
        return result
      }
    })
  },
  post(url,data){
    return $.ajax({
      url,
      type:'post',
      data,
      success(result){
        return result
      }
    })
  }
}