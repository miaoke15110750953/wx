// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  jumpComment:function(e){
    var id=e.target.dataset.id;
    //功能：用户点击详情按钮后跳转详情组件

    //关闭并且跳转
    // wx.redirectTo({
    //   url: '/pages/comment/comment',
    // })
    
    //保留并且跳转
    wx.navigateTo({
      url: '/pages/comment/comment?id='+id, 
    })

  },
  loadMore:function(){
     //console.log(123);
     //调用云函数movielist2
     wx.cloud.callFunction({
       name:"movielist2",
       data:{
         start:this.data.list.length,
         count:10
         }
     })
      .then(res=>{
        //console.log(res);
        var obj=JSON.parse(res.result);
        //保留上一页电影列表
        //保存电影列表的数据，
        var rows=obj.subjects;
        //将电影列表的数组拼接操作，
        rows=this.data.list.concat(rows);
        //将拼接后的结果保存起来
        //console.log(obj);
        this.setData({
          list:rows
        });
        //console.log(obj.subjects);

      })
      .catch(err=>{
        console.log(err);
      })
      //将返回结果保存

  },
  onLoad: function (options) {
     this.loadMore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log(123);
    //发送请求下载下一页数据
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})