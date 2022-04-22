<template>
  <div class="indexList"
       id="docList"
       @click="showPress = -1">
    <navbar type="index"></navbar>
    <div class="gradient"
         v-if="showImg">
      <van-swipe :autoplay="3000"
                 class="swiperArea"
                 @change="onChange">
        <van-swipe-item v-for="(image, index) in images"
                        :key="index">
          <img v-zlazy="image.carouselImg"
               @click="openImgDetail(image)" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="cardArea black-font font-size-md-2 font-blod-3">
      <div>
        <img src="../../assets/img/index/wlmz.png"
             class="img-width-height-md img-inline-block"
             @click="openAppoin(1,1)" />
        <li>网络门诊</li>
      </div>
      <div>
        <img src="../../assets/img/index/xxmz.png"
             class="img-width-height-md img-inline-block"
             @click="openAppoin(1,2)" />
        <li>线下门诊</li>
      </div>
      <div>
        <img src="../../assets/img/index/sccf.png"
             class="img-width-height-md img-inline-block"
             @click="openPrePool" />
        <li>商城处方</li>
      </div>
      <div>
        <img src="../../assets/img/index/yzcf.png"
             class="img-width-height-md img-inline-block"
             @click="openMedicalCf" />
        <li>医助处方</li>
      </div>
      <!-- <div>
        <img src="../../assets/img/index/yqhz.png" class="img-width-height-md img-inline-block"
             @click="openInviteUser"/>
        <li>邀请患者</li>
      </div> -->
    </div>
    <div class="emptyDiv font-login-color font-size-md"
         v-if="chatList.length == 0">
      <img src="../../assets/img/index/emptyIndex.png"
           class="emptyIcon" />
      <li>暂无患者沟通记录</li>
    </div>
    <div v-show="chatList.length > 0"
         class="userDiv"
         id="userDiv">
      <van-pull-refresh v-model="isLoading"
                        @refresh="onRefresh"
                        :style="{'min-height':followHeight + 'px'}">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text=""
                  @load="onLoaded">
          <div v-for="(item, index) in chatList"
               :key="index"
               v-if="isRouterAlive"
               :class="item.top? 'userList userListIsTop' : 'userList'">
            <chat-list-child :val="item.dataVal"
                             :index="index"
                             @click.native="openAdminList"
                             @updateLoad="updateLoad(index,item)"
                             v-if="item.id.split(',')[0] == 'admin' && item.dataVal">
            </chat-list-child>
            <chat-list-child :val="item.dataVal"
                             :index="index"
                             v-if="item.dataVal && item.id.split(',')[0] != 'admin'"
                             @click.native="openChat(item.dataVal, index)"
                             @updateList="onRefresh"
                             @updateLoad="updateLoad"
                             @setTop="reload">
            </chat-list-child>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <tabbar id="tabbarTag"></tabbar>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import tabbar from "@/common/tabbar";
import myJsTools from "@/utils/myJsTools";
import date from "@/utils/date";
import chatListChild from "./chatListChild";
import { getDocChatListNew, updateChatOperation } from "@/api/docList.js";
import { queryDicCarouselMapList } from "../../api/set";
import { findVisitAgreement, getDoctorInfoByDocId } from "../../api/my";
import { getDocHavePrescriptionPoolVisible } from "../../api/cf";
import { Toast } from "vant";
import ajPushTools from "@/utils/ajPush"

export default {
  name: "indexList",
  components: { navbar, tabbar, chatListChild },//
  data () {
    return {
      userList: [],
      token: "",
      images: [],
      listQuery: { page: 1, limit: 10 },
      isLoading: false,
      finished: true,
      loading: false,
      Loop: null,
      showPress: -1,
      pressIndex: "",
      readStatus: "标为已读",
      topStatus: "置顶",
      pressTop: "",
      pressLeft: "",
      current: 0,
      patientIds: [],//获取业务数据--聊天页面
      listShow: false,
      followHeight: "",
      isRouterAlive: true,
      getType: 1,
      name: "",
      showImg: false,
    };
  },
  created () {
    myJsTools.readFile();
    if (process.env.NODE_ENV != 'development') {
      api.setAppIconBadge({
        badge: 0
      });
    }
  },
  computed: {
    //实时获取聊天消息
    chatList () {
      let list = this.$store.getters.getChatList;
      let arr = [], arr_2 = [];
      list.map((item, index) => {
        if (item.id.split(",")[1] == myJsTools.getItem("token_info").docId.toLowerCase()) {
          if (item.top) {
            arr.push(item);
          } else {
            arr_2.push(item)
          }
          let patientImg = myJsTools.getItem("patientImg");
          if (item.id.split(",")[0] == 'admin') {
            let adminInfo = {
              patientImg: patientImg,
              patientName: "系统消息",
              type: "text",
              content: "暂无系统消息",
              msgtype: "admin",
              patientId: "admin",
              time: new Date(),
              docId: myJsTools.getItem("token_info").docId
            }
            item.dataVal = adminInfo;
          }
        }
      })
      arr.sort(function (a, b) {
        return b.time - a.time;//时间正序
      });
      arr_2.sort(function (a, b) {
        return b.time - a.time;//时间正序
      });
      arr = arr.concat(arr_2);
      return arr;
    }
  },
  mounted () {
    this.onLoaded();
    this.getDocInfo();
    this.getImgsList();

    this.$nextTick(() => {
      var dom = document.getElementById('userDiv');
      if (dom) {
        var tabbar = document.getElementById('tabbarTag');
        if (tabbar) {
          let followHeight = parseInt(api.winHeight - dom.offsetTop) - parseInt(tabbar.offsetHeight);
          this.followHeight = followHeight;
        }
      }
    })
    if (process.env.NODE_ENV != 'development') {
      this.addEvent();
    }
  },
  methods: {
    getDocInfo () {
      getDoctorInfoByDocId({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        myJsTools.setItem("docAllInfo", res.data)
      });
    },
    //获取轮播图列表
    getImgsList () {
      queryDicCarouselMapList().then(res => {
        if (res.data.length > 0) {
          this.images = res.data;
        } else {
          this.images = [{
            carouselImg: require("../../assets/img/swiper.png"),
          }, {
            carouselImg: require("../../assets/img/swiper2.png")
          }];
        }
        this.showImg = true;
      })
    },
    openImgDetail (item) {
      if (item.carouselId) {
        this.$router.push({
          name: "imgLink",
          query: {
            carouselId: item.carouselId,
            carouselType: item.carouselType
          }
        })
      }
    },
    addEvent () {
      let _this = this;
      api.addEventListener(
        {
          name: "jzPatient",
        },
        function (ret, err) {
          _this.getPatiList();
        }
      );
    },
    updateLoad (item) {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true))
    },
    openAdminList () {
      this.$router.push({
        name: "adminList"
      });
    },
    onChange (index) {
      this.current = index;
    },
    // 下拉刷新
    onRefresh () {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      this.patientIds = [];
      this.onLoaded();
    },
    // 上拉加载
    onLoaded () {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getPatiList();
    },
    // 获取聊天列表
    getPatiList () {
      let me = this;
      let list = this.chatList;
      if (list.length > 0) {
        list.map((item, index) => {
          if (index <= this.listQuery.page * this.listQuery.limit) {
            this.patientIds.push(item.id.split(",")[0])
          }
        })
      }
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.listQuery.patientIds = this.patientIds;
      if (this.patientIds.length == 0) {
        return;
      }
      getDocChatListNew(this.listQuery).then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          var element = data[i];
          element.docId = myJsTools.getItem("token_info").docId;
        }
        this.loading = false;
        this.listQuery.size = this.chatList.length / this.listQuery.limit;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (element.receiveTime) {
            var time = date.DateDifference(
              element.receiveTime.replace(/-/g, "/"),
              element.presentTime.replace(/-/g, "/")
            );
            if (time.days > 0) {
              element.remaining =
                time.days + "天" + time.hours + "时" + time.minutes + "分";
            } else {
              element.remaining = time.hours + "时" + time.minutes + "分";
            }
            element.usedTime = time.usedTime;
          }
          element.brage = 0;
          if (element.isUnread == "1") {
            element.brage = 1;
          }
          let id = element.patientId.toLowerCase() + "," + element.docId.toLowerCase();
          let list = this.$store.getters.getChatList;
          list.map(item => {
            if (item.id == id) {
              item.dataVal = element;
            }
          })
          if (list.length > 0) {
            this.$store.commit("setAllChatList", list)
          }
        }
        // if (this.listQuery.page == 1) {
        //   this.listQuery.page = 1;
        //   this.isLoading = false;
        //   this.userList = data;
        // } else {
        //   this.userList = this.userList.concat(data);
        //   this.loading = false;
        // }
        // this.resetData();
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      });
      this.listShow = true;
    },

    // 删除按钮展示
    showDeleteButton: function (e, index) {
      let me = this;
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(
        function () {
          me.pressIndex = index;
          if (me.userList[index].isUnread == 1) {
            me.readStatus = "标为已读";
          } else {
            me.readStatus = "标为未读";
          }
          if (me.userList[index].isTopping == 1) {
            me.topStatus = "取消置顶";
          } else {
            me.topStatus = "置顶";
          }
          if (document.body.clientWidth - e.targetTouches[0].clientX < 104) {
            me.pressTop = "30px";
            me.pressLeft = e.targetTouches[0].clientX + "px";
          } else if (
            document.body.clientHeight - e.targetTouches[0].clientY <
            140
          ) {
            me.pressTop = "30px";
            me.pressLeft = e.targetTouches[0].clientX + "px";
          } else {
            me.pressTop = "30px";
            me.pressLeft = e.targetTouches[0].clientX + "px";
          }
          me.showPress = index;
        }.bind(this),
        1000
      );
    },

    emptyTime () {
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop);
    },
    gotouchmove () {
      clearTimeout(this.Loop); //清除定时器
      this.Loop = null;
      this.showPress = -1;
    },

    // 重置数据
    resetData () {
      for (let m = 0; m < this.userList.length; m++) {
        const element = this.userList[m];
        var time = date.DateDifference(
          element.receiveTime.replace(/-/g, "/"),
          element.presentTime.replace(/-/g, "/")
        );
        if (time.days > 0) {
          element.remaining =
            time.days + "天" + time.hours + "时" + time.minutes + "分";
        } else {
          element.remaining = time.hours + "时" + time.minutes + "分";
        }
        element.usedTime = time.usedTime;
        element.brage = 0;
        if (element.isUnread == "1") {
          element.brage = 1;
        }
      }
    },
    // 我的预约页面
    openAppoin (type, internetVisit) {
      myJsTools.setItem("active", type);
      this.$router.push({
        name: "appointment",
        query: {
          internetVisit: internetVisit
        }
      });
    },
    //打开审方
    openSf () {
      this.$router.push({
        name: "myAuditor",
      });
    },
    //处方池
    openPrePool () {
      getDocHavePrescriptionPoolVisible({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        if (res.data.prescriptionPoolVisible == '1') {
          this.$router.push({
            name: "prePool",
          });
        } else {
          Toast("您暂无权限进入");
        }
      })

    },
    openMedicalCf () {
      this.$router.push({
        name: "medicalCf",
      });
    },
    // 打开邀请用户界面
    // openInviteUser() {
    //   this.$router.push({
    //     name: "inviteUser"
    //   });
    // },
    // 打开聊天界面
    openChat (item, index) {
      let docId = myJsTools.getItem("token_info").docId;
      this.pressIndex = index;
      // 将患者信息缓存
      if (item.isUnread == 1) {
        this.unreadRemark("chat");
      }
      myJsTools.setItem("patientInfo", item);
      if (this.showPress > -1) {
        this.showPress = -1;
        return;
      }
      this.$router.push({
        name: "chatIndex", //prescription chatIndex
        query: {
          name: item.patientName,
          id: item.patientId,
          userId: item.userId
        }
      });
    },
    // 标为未读
    unreadRemark (type) {
      this.showPress = -1;
      var item = this.userList[this.pressIndex];
      var isUnread;
      if (item.isUnread == 1) {
        isUnread = 0;
      } else {
        isUnread = 1;
      }
      var param = {
        docId: item.docId,
        patientId: item.patientId,
        pcoType: 2,
        isUnread: isUnread
      };
      updateChatOperation(param).then(res => {
        if (isUnread == 0) {
          item.brage = 0;
        } else {
          item.brage = 1;
        }
        if (!type) {
          this.getPatiList();
        }
        // this.$set(this.userList, this.pressIndex, item);
      });
    },

    // 置顶
    toTop () {
      var item = this.userList[this.pressIndex];
      var isTopping;
      if (item.isTopping == 1) {
        isTopping = 0;
      } else {
        isTopping = 1;
      }
      this.showPress = -1;
      var param = {
        docId: item.docId,
        patientId: item.patientId,
        pcoType: 2,
        isTopping: isTopping
      };
      updateChatOperation(param).then(res => {
        this.getPatiList();
      });
    }
  }
};
</script>
<style scoped lang="less">
.flip-list-move {
  transition: transform 1s;
}

/deep/ .van-list {
  height: 100%;
}

/deep/ .van-pull-refresh {
  height: 100%;
}

.indexList {
  background: @white;
}

.userList {
  position: relative;
  padding: 0px 16px 0 16px;
  height: 100%;
}

.userListIsTop {
  background: @page-back;

  /deep/ .van-cell {
    background: @page-back;
  }
}

.pressEvent {
  padding: 12px 10px;
  box-sizing: border-box;
  border: 0.5px solid #e5e5e5;
  line-height: 22px;
  position: absolute;
  border-radius: 4px;
  background: #fff;
  top: 30px;
  z-index: 999;

  li {
    display: flex;

    span {
      color: #333333;
      font-size: 14px;
      margin: 0 5px;
    }

    img {
      width: 22px;
      height: 22px;
    }
  }

  li:nth-child(2) {
    padding: 20px 0;
  }
}

.gradient {
  height: 115px;
  background-size: 100% 80%;
  background-repeat: no-repeat;
  background-image: @linear-gradient-blue-2;

  .swiperArea {
    height: 120px;

    img {
      width: 90%;
      height: 100%;
      border-radius: 8px;
      margin: 0 auto;
    }
  }
}

.cardArea {
  display: flex;
  margin-bottom: 20px;
  padding: 40px 0px 0px;

  div {
    width: 25%;
    text-align: center;

    li {
      margin-top: 0px;
    }
  }

  .img_2 {
    margin-left: 8px;
  }
}

.emptyDiv {
  margin-top: 10px;

  li {
    text-align: center;
    margin-top: 20px;
  }
}

/deep/ .van-cell {
  width: 100%;
  padding: 6px 16px;
}

/deep/ .van-cell__title {
  display: flex;
}

/deep/ .van-button {
  height: 100%;
}

.tipsInfo {
  .title {
    position: fixed;
    top: 0;
    background: #fff;
    width: 100%;
    left: 0;
    padding: 20px 0px;
  }
}

.qxTips {
  text-align: left;
  margin-top: 24px;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.positionBtn {
  position: fixed;
  bottom: 0.32rem;
  left: 15px;
  width: 90%;
}
</style>
