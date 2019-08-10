// pages/homewok/homework.js
//初始化数据库实例对象
const db=wx.cloud.database();
Page({

  data: {
    list:[] //云储存图片fileID
  },
  showpic:function(){
    //此函数负责获取myphoto集合所有记录并且显示模板中
    //获取集合 myphoto所有集合
    db.collection("myphoto")
    .get()
    .then(res=>{
      var list=res.data;
      this.setData({
        list:list
      })
    })
    .catch(err=>{
      console.log(err);
    })
    //将返回数据保存list
    //
  },
  myupload:function(){
    //函数:此函数负责选中图片并且上传至云储存
    //上传成功后将图片按fileID保存myphoth集合中
    //选择一张图片
      //选择图片成功后将图片上传云储存
        //上传成功将fileID保存到myphoto集合中
        wx.chooseImage({
          count:1,
          sizeType:["original","compressed"],
          sourceType:["album","camera"],
          success:function(res){
            //console.log(res);
            //上传图片
            //获取选中图片
            var file=res.tempFilePaths[0];
            //给图片起一个新名字
            var newFile=new Date().getTime()+".jpg"
            console.log(file);
            console.log(newFile);
            //上传图片
            wx.cloud.uploadFile({
              cloudPath:newFile,
              filePath:file,
              success:(res)=>{
                //console.log(res);
                //创建变量保存fileID
                var fId=res.fileID;
                //向集合myphoto添加一行记录
                db.collection("myphoto")
                .add({
                  data:{fileID:fId}
                })
                .then(res=>{
                  console.log(res);
                })
                .catch(err=>{
                  console.log(err);
                })
                //成功 失败
                //
              },
              fail:(err)=>{
                console.log(err);
              }
            })

          },fail:function(err){
            console.log(err);
          }
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