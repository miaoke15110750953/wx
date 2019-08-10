// pages/mymovie/mymovie.js
const db=wx.cloud.database({
  env:"web-miaoke-0953-yk2x8"
})
Page({


  data: {
    content:"", //用户输入的文字内容
    file:{}     //选中的图片
  },
  myupload:function(){
    //选择一张图片
    //console.log(12);
    wx.chooseImage({
      count:1,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success:res=>{
        //获取选中图片
        var file=res.tempFilePaths[0];
        //将选中图片保存data中
        //1.在data添加属性file表示选中文件
        //2.将选中图片保存
        this.setData({
          file:file
        })
      },
    })
  },
  mysubmit:function(){
    //上传图片并且将图片保存云函数
    //console.log(444);
    //1.获取上传图片
    var f=this.data.file;
    //2.截取文件后缀名称
    var suffix=/\.\w+$/.exec(f)[0];
    //3.创建新文件名称
    var  newFile=new Date().getTime()+suffix;
    //4.获取用户评论内容
    var c=this.data.content;
    console.log(newFile);
    console.log(c);
    //5.上传文件操作
      //5.1如果上传文件成功
      wx.cloud.uploadFile({     //上传
        cloudPath:"newFile",   //新文件名
        filePath:f,            //选中文件
        success:res=>{         //上传成功
          console.log(res.fileID);
      //5.2获取fileID
      var fId=this.fileID
      //5.3将fileID评论内容添加去数据库中
      //5.4提示发表成功提示框
      db.collection("mymovie")
      .add({
        data:{fileId:fId,content:c}
      })
      .then(res=>{
        console.log(res);
        wx.showToast({
          title: '发表成功',
        })
      })
      .catch(err=>{
        console.log(err);
        wx.showToast({
          title: '发表失败',
        })
      })
        },
        fail:err=>{             //上传失败

        }
      })




  },
  onContentChange:function(e) {
    //获取用户输入的留言内容
    this.setData({
      content:e.detail
    })
  },
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})