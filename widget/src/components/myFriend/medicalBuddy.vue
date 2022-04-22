<template>
  <div class="medicalBuddy">
    <navbar title="我的好友"></navbar>
    <div>
      <van-form action="/">
        <van-search
          v-model="searchValue"
          background="#FFFFFF"
          :left-icon="searchIcon"
          placeholder="输入组名，快速查找"
          @search="getFriendList"
          @clear="getFriendList"
        />
      </van-form>
    </div>
    <div class="btnIconDiv">
      <div class="scanDiv" @click="openVerifiedFriend">
        <img src="../../assets/img/my/newFriend.png" class="scanIcon">
        <div>
          新的好友
        </div>
        <span class="badge" v-if="waitAgreeNum > 0">{{ waitAgreeNum }}</span>
      </div>
      <div class="scanDiv" @click="openScan">
        <img src="../../assets/img/my/scanIcon.png" class="scanIcon">
        <div>
          扫一扫添加
        </div>
      </div>
    </div>

    <van-index-bar :index-list="indexList" :sticky="false">
      <div v-for="(item, key, index) in friendList" :key="index">
        <van-index-anchor
          :index="key != '☆' ? key : '☆ 星标用户'"
          style="background:#F5F5F5;"
        ></van-index-anchor>
        <div class="list" v-for="(val, i) in item" :key="i" @click="openDocInfo(val,i)">
          <div class="item">
            <img v-zlazy="val.docImg" class="list_img"/>
            <div>
              <span class="docName">{{ val.patientName }}</span>
              <li class="remarks" v-if="val.remarks">{{ val.remarks }}</li>
            </div>
            <div class="allowReferral" v-if="val.isReferral == '1'">
              允许转诊
            </div>
          </div>
        </div>
      </div>
    </van-index-bar>
    <div class="emptyDiv" v-if="friendList.length == 0">
      <img src="../../assets/img/my/qx.png" class="emptyImg">
      <li>
        您暂无医疗好友，扫描别人的二维码或者别人扫描你的二维码，添加医疗好友吧
      </li>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {findMyBuddyPage, getToBeVerifiedList} from "../../api/friend";
import ossUpDown from "../../utils/ossUpDown";
import {Toast} from "vant";

export default {
  name: "medicalBuddy",
  components: {Navbar},
  data() {
    return {
      searchValue: "",
      friendList: [],
      indexList: [],
      waitAgreeNum: "",//待同意数量
      searchIcon: require("../../assets/img/index/search.png"),
    }
  },
  created() {
    this.getFriendList();
    this.getNum();
  },
  methods: {
    //获取待验证数量
    getNum() {
      getToBeVerifiedList({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        console.log(res);
        this.waitAgreeNum = res.data.count;
      })
    },
    //  扫一扫添加好友
    openScan() {
      let _this = this;
      var FNScanner = api.require('FNScanner');
      FNScanner.openScanner({
        autorotation: true
      }, function (ret, err) {
        if (ret) {
          if (ret.eventType == 'success') {
            let content = ret.content;
            if (content.indexOf("docId") != -1) {
              _this.$router.push({
                name: "docInfo",
                query: {
                  docId: content.split("=")[1],
                  type: "add"
                }
              })
            } else {
              Toast("该二维码非医生二维码，请扫描医生二维码");
            }
          } else {
            // Toast("请扫描医生二维码");
          }
        } else {
          Toast("请扫描医生二维码");
        }
      });
    },
    // 查看医生或医助主页面信息
    openDocInfo(item, index) {
      this.$router.push({
        name: "docInfo",
        query: {
          docId: item.docId || item.assistId,
          dfrId: item.dfrId,
        }
      })
    },
    //好友添加消息通知，待验证列表
    openVerifiedFriend() {
      this.$router.push({
        name: "verifiedFriend"
      })
    },
    //获取好友列表
    getFriendList() {
      findMyBuddyPage({
        docId: myJsTools.getItem("token_info").docId,
        docAssistantName: this.searchValue
      }).then(async res => {
        console.log(JSON.stringify(res) + "----好友列表");
        let data = res.data, arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({
            dfrId: data[i].dfrId,
            docId: data[i].docId,
            docImg: data[i].docImg,
            patientName: data[i].docName,
            remarks: data[i].remarks,
            isReferral: data[i].isReferral
          })
        }
        console.log(arr)
        let arr_1 = myJsTools.data_letter_sort(arr, "py");
        this.friendList = arr_1 || [];
        this.indexList = Object.keys(this.friendList);
      })
    },
  }
}
</script>

<style scoped lang="less">


/deep/ .van-icon {
  margin-top: 3px;
}

/deep/ .van-search {
  box-shadow: 0 0 0 4px @page-back;
}

.btnIconDiv {
  margin-top: 17px;
}

.scanDiv {
  display: flex;
  align-items: center;
  background: @white;
  .black-font;
  .font-size-md-2;
  padding: 14px 16px;
  position: relative;

  img {
    .img-width-height-sm;
    margin-right: 16px;
  }
}

.badge {
  background: @red;
  .white-font;
  .font-size-sm;
  border-radius: 7px;
  line-height: 12px;
  padding: 1px 4px;
  position: absolute;
  right: 28px;
}

.list {
  background: @white;
  padding: 0 4%;
  .black-font;
  .font-size-md-2;

  .item {
    display: flex;
    align-items: center;
    position: relative;

    .list_img {
      .img-width-height-sm;
      margin-right: 16px;
      padding: 14px 0;
    }

    span {
      line-height: 20px;
    }
  }
}

.allowReferral {
  position: absolute;
  right: 20px;
  line-height: 20px;
}

.remarks {
  .font-size-sm;
  line-height: 17px;
  margin-top: 2px;
}

.emptyDiv {
  width: 57%;
  margin: 0 auto;
}
</style>
