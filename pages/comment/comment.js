// pages/comment/comment.js
const db=wx.cloud.database({
  env:"web-miaoke-0953-yk2x8"
})
Page({

  data: {
     value:"",  //输入框中用户输入的内容
     score:5,   //默认打分5分
     movieid:0, //电影id值
     detail:{}, //保存电影信息
     images:[], //保存选中 图片
     fileIDS:[] //上传成功保存fileID
  },
  mysubmit:function(){
    //功能1：将选中图片上传云存储中
    //1.在data添加属性fileIDS:[]
    //2.显示加载动画提示框""正在提交中
    wx.showLoading({
      title: '正在提交中...',
    })
    //3.上传到云储存
      //3.1创建promise数组【保存promise对象】
      var promiseArr=[];
      //3.2创建一个循环遍历选中图片
      for(var i=0;i<this.data.images.length;i++){
      //3.3创建promise对象
      //promise负责完成上传一张图片任务并且将图片fileID保存数组中
        promiseArr.push(new Promise((resolve,reject)=>{
        //3.3.1获取当前图片
          var item=this.data.images[i];
        //3.3.2创建正则表达式拆分文件后缀名 .jpg .gif .png
          var suffix=/\.\w+$/.exec(item)[0];
        //3.3.3上传图片并且将fileID保存到数组中\
        //3.3.4为图片创建新文件名
          //新文件名=时间+随机数+后缀
          var newFile=new Date().getTime()+Math.floor(Math.random()*9999)+suffix;
          wx.cloud.uploadFile({  //上传
            cloudPath:newFile,   //新文件名
            filePath:item,       //选中文件
            success:res=>{       //上传成功
        //3.3.5上传成功后拼接fileID
              var fid=res.fileID;
              var ids=this.data.fileIDS.concat(fid);
              this.setData({
                fileIDS:ids
              })
        //3.3.6将当前promise任务追加任务列表中
              resolve();
        //3.3.7上传失败输出错误消息
            
            },
            fail:err=>{
              console.log(err);   //上传失败
            }
          })
    
        })); //promise结束
      }//for 循环结束


      //功能2：将云存储中fileID一次性存储云数据库集中
      //4.在云数据库中添加集合comment，此集合用于保存评论内容与文件ID
      //5.等待数组中所有promise任务执行结束
      Promise.all(promiseArr).then(then=>{
      //6.回调函数中
      //6.1在程序的最顶端初始化数据库
      //7.将评论内容，分数，电影id 上传图片所有id添加集合中
      db.collection("comment") //指定集合
      .add({                   //添加记录
        data:{                 //数据
          context:this.data.value,             //评论内容
          score:this.data.score,               //评论分数
          movieid:this.data.movieid,           //电影id
          fileIds:this.data.fileIDS            //图片fileID
        }
      })
      .then(res=>{
      //8.隐藏加载框
        wx.hideLoading();
      //9.显示提示框""发表成功"
        wx.showToast({title:"发表成功"})
      })
      .catch(err=>{
      //10.添加集合失败
      //11.隐藏加载提示框
        wx.hideLoading();
      //12.显示提示框"评论失败""
        wx.showToast({
          title: '发表失败',
      })
      })
      })
  },
  selectImge(){
    //功能：请用户选中九张图片并且保存data中
    //1.在data中添加数组属性images
    //2.调用wx.chooseImage选中图片
    wx.chooseImage({
      count:9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res)=>{
        var files=res.tempFilePaths;
    //3.将选中九张图片保存images中
        this.setData({
          images:files
        })
      }
    })

  },
  loadMore(){
    //发送请求获取云函数获取的数据
    //console.log(123);
    //接收电影列表传递参数id
    var id=this.data.movieid;
    console.log(id);
    //显示数据加载提示框
    wx.showLoading({
      title: '加载中...',
    })
    //调用云函数
    wx.cloud.callFunction({
       name: "getDetail3",
       data:{id:id}
     })
     .then(res=>{
      //获取云函数返回结果
      //将云函数返回字符串转js对象
      var obj=JSON.parse(res.result);
      console.log(obj);
      //将js对象保存deail
      this.setData({
        detail:obj
      })
      //隐藏 加载提示框
       //console.log(res);
       wx.hideLoading();
       })
     .catch(err=>{
       console.log(err);
       })
  },

  onContentChange:function(e){
     //输入框对应事件
     //用户输入内容
     console.log(e.detail);
     this.setData({
       value:e.detail   //保存用户评论的内容
     })
  },
  onScoreChange:function(e){
    //用户打分对应的事件处理函数
    //获取用户现在输入的分数
    console.log(e.detail);
    //将用户输入新分数赋值操作
      this.setData({
        score:e.detail
      });
  },




  onLoad: function (options) {
    //将电影列表组件传递参数id保存data中movieid中
    this.setData({
      movieid:options.id
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})