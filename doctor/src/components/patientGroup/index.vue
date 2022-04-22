<template>
  <div class="groupIndex" id="groupIndex">
    <div class="fixedDiv" ref="fixedDiv">
      <header class="patientHeader" :style="{ paddingTop: paddingTop }">
        <input
          type="text"
          placeholder="搜索联系人"
          v-model="listQuery.patientName"
          @keyup.enter="getSeatchList"
        />
      </header>

      <div class="groupBody" :style="{ paddingTop: searchDivHeight + 'px' }">
        <div class="operationDiv">
          <div @click="goFsend">
            <img src="../../assets/img/patientGroup/qf.png" class="qfIcon" />
            <li>群发</li>
          </div>
          <div @click="openFollow">
            <img
              src="../../assets/img/patientGroup/sfjh.png"
              class="sfjhIcon"
            />
            <li>随访计划</li>
          </div>
          <div @click="openScale">
            <img src="../../assets/img/patientGroup/wzd.png" class="wzdIcon" />
            <li>量表</li>
          </div>
          <div @click="goMyGroups">
            <img
              src="../../assets/img/patientGroup/myGroup.png"
              class="myGroupIcon"
            />
            <li>我的分组</li>
          </div>
        </div>
        <div class="groupNameList">
          <img
            v-if="scrollLeft > 0"
            src="@/assets/img/my/my_backL.png"
            class="back icon-width-height-sm-16"
          />
          <div
            class="groupNameList_box"
            @scroll.passive="getScroll($event)"
            ref="placescroll"
          >
            <div
              :class="
                selectLi != index
                  ? 'groupNameList_item'
                  : 'groupNameList_item_active'
              "
              v-for="(item, index) in groupNameList"
              :key="index"
              @click="getTab(item, index)"
            >
              <span>
                {{ item.groupName }}
                <u v-if="item.groupId != ''">({{ item.patientCount }})</u>
              </span>
            </div>
          </div>
          <img
            v-if="scrollWidth > clientWidth"
            src="@/assets/img/my/my_back.png"
            class="icon-width-height-sm-16"
          />
        </div>
      </div>
    </div>
    <div class="box" :style="{ 'margin-top': boxMargin }" ref="box">
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(item, key, index) in patientList" :key="index">
          <!--  -->
          <van-index-anchor
            :index="key != '☆' ? key : '☆ 星标用户'"
            style="background:#F5F5F5;"
            >{{ key == "#" ? "#黑名单" : key }}</van-index-anchor
          >
          <!-- <van-index-anchor style="background:#F5F5F5;">
            #黑名单</van-index-anchor
          > -->
          <div class="list" v-for="(val, i) in item" :key="i">
            <div class="item" @click="getDataService(val)">
              <img
                v-zlazy="val.patientImg"
                :key="val.patientId"
                class="img-width-height-sm"
                data-type="headImg"
              />
              <span>{{ val.patientNameMemo }}</span>
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>

    <tabbar></tabbar>
  </div>
</template>

<script>
import $api from "@/utils/api.js";
import tabbar from "@/common/tabbar";
import Pinyin from "@/utils/pinYin.js";
import myJsTools from "@/utils/myJsTools";
import {
  findPatientListByGroup,
  findPatientByGroupId
} from "@/api/patientGroup";
import {
  getImageUrlCanDownLoad,
  getLabFromOssImgByImageName
} from "../../api/oss";
import ossUpDown from "../../utils/ossUpDown";

export default {
  name: "patientIndex",
  components: { tabbar },
  data() {
    return {
      selectLi: "",
      listQuery: {
        patientName: "", //搜索
        groupId: "",
        groupName: ""
      },
      indexList: [],
      patientList: [],
      scrollLeft: "",
      scrollWidth: "",
      clientWidth: "",
      groupNameList: [],
      headerHeight: "196px",
      paddingTop: "",
      searchDivHeight: "",
      boxMargin: ""
    };
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "patientIndex"
    });
  },
  mounted() {
    this.getPatientList();
    setTimeout(() => {
      this.paddingTop = parseInt(api.safeArea.top) + 10 + "px";
      if (myJsTools.getItem("headerHeight")) {
        this.headerHeight = myJsTools.getItem("headerHeight") + "px";
        this.searchDivHeight =
          parseInt(
            $api.cssVal($api.dom("header"), "height").replace("px", "")
          ) +
          parseInt(api.safeArea.top) +
          10;
        let groupNameHeight = $api
          .cssVal($api.dom(".groupNameList_box"), "height")
          .replace("px", "");
        let groupBodyHeight = $api
          .cssVal($api.dom(".groupBody"), "height")
          .replace("px", "");
        this.boxMargin =
          parseInt(this.searchDivHeight) +
          parseInt(groupNameHeight) +
          parseInt(groupBodyHeight) +
          50 +
          "px";
      }
    }, 1);
  },
  activated() {
    let scroll = myJsTools.getItem("scrollLeft");
    this.$refs.placescroll.scrollLeft = scroll;
    this.getPatientList();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "information") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    next();
  },
  methods: {
    // 跳转到群发
    goFsend() {
      this.$router.push({
        name: "fsendIndex"
      });
    },
    //随访计划
    openFollow() {
      this.$router.push({
        name: "followUpIndex"
      });
    },
    // 打开量表列表
    openScale() {
      this.$router.push({
        name: "scaleIndex"
      });
    },
    // 跳转到资料服务页面
    getDataService(item) {
      let left = 0;
      if (this.$refs.placescroll) {
        left = this.$refs.placescroll.scrollLeft;
      }
      myJsTools.setItem("scrollLeft", left);
      myJsTools.setItem("patientInfo", item);
      this.$router.push({
        name: "information",
        query: {
          patientId: item.patientId
        }
      });
    },
    // 解决异步问题
    asynchronization(key, obj) {
      let proList = [];
      let promises = obj[key].map(async element => {
        if (element.raw) {
          let imgBody = await verifyPicAndReadUrlAndBody(element);
          return {
            fileName: key,
            folderType: "6",
            imgBody: imgBody[0]
          };
        } else {
          proList.push(element.name);
        }
      });
      return Promise.all(promises).then(async data => {
        let survival = data.filter(item => item);
        if (survival.length == 0) {
          this.imgObj[key] = proList.join("|");
        } else {
          let response = await uploadOssImgMany(survival);
          let urlList = response.data.map(element => {
            return element.url;
          });
          let arr = proList.concat(urlList);
          this.imgObj[key] = arr.join("|");
        }
      });
    },
    //初始化获取患者列表
    getPatientList() {
      this.blackList = [];
      findPatientListByGroup({
        patientName: "",
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        let arrList = [];
        let data = res.data.proPatientList;
        // One定义一个新的黑名单数组blackList
        this.blackList = [];
        for (let i = 0; i < data.length; i++) {
          // Two根据是否是黑名单字段将患者加入黑名单数组中
          let val = data[i];
          val.patientNameMemo = val.memo || val.patientName;
          if (val.isPullBlack == "1") {
            this.blackList.push(val);
          } else {
            arrList.push(val);
          }
        }
        let arr = myJsTools.data_letter_sort(arrList, "py");
        this.patientList = arr;
        if (this.blackList.length != 0) {
          this.patientList["#"] = this.blackList;
        }

        this.indexList = Object.keys(this.patientList);
        // this.indexList.push("#黑名单");
        res.data.groupList.unshift({
          groupName: "全部",
          groupId: ""
        });
        this.groupNameList = res.data.groupList;
      });
    },
    // 搜索获取列表
    getSeatchList() {
      this.blackList = [];
      findPatientByGroupId(this.listQuery).then(async res => {
        let arrList = [];
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          let val = data[i];
          val.patientNameMemo = val.memo || val.patientName;
          // arrList.push(val);
          if (val.isPullBlack == "1") {
            this.blackList.push(val);
          } else {
            arrList.push(val);
          }
        }
        let arr = myJsTools.data_letter_sort(arrList, "py");
        this.patientList = arr;
        // this.patientList["#"] = {};
        if (this.blackList.length != 0) {
          this.patientList["#"] = this.blackList;
        }
        this.indexList = Object.keys(this.patientList);
      });
    },
    getTab(item, index) {
      this.selectLi = index;
      this.listQuery.groupId = item.groupId;
      this.listQuery.groupName = item.groupName;
      if (item.groupId != "") {
        this.getSeatchList();
      } else {
        this.getPatientList();
      }
    },
    //我的分组
    goMyGroups() {
      this.$router.push({
        name: "myGroupsIndex"
      });
    },
    //获取滚动条滚动的距离
    getScroll($event) {
      this.scrollLeft = $event.target.scrollLeft;
      this.scrollWidth = $event.target.scrollWidth;
      this.clientWidth = $event.target.clientWidth;
    }
  }
};
</script>
<style scoped lang="less">
.groupIndex {
  box-sizing: border-box;
}

.groupBody {
  overflow: hidden;
}

.fixedDiv {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 999;
}

/deep/ .van-index-anchor--sticky {
  position: relative;
  .font-login-color;
  transform: translate3d(0px, 0px, 0px);
  background-color: @white;
}

/deep/ .van-index-bar__index--active {
  .font-login-color;
}

/deep/ .van-index-bar__index {
  padding: 0 4px 0 16px;
  .font-size-sm;
  .font-login-color;
  line-height: 17px;
}

/deep/ .van-index-anchor {
  z-index: 0;
  box-sizing: border-box;
  padding: 0 16px;
  .font-login-color;
  .font-blod;
  .font-size-sm;
  line-height: 32px;
  background-color: transparent;
}

.patientHeader {
  width: calc(100% - 32px);
  background: @white;
  display: flex;
  padding: 11px 16px;
  height: 38px;

  img {
    .icon-width-height-sm;
  }

  input {
    line-height: 18px;
    width: 80%;
    padding-left: 47px;
    background: @white url("../../assets/img/index/search.png") no-repeat;
    background-size: @icon-width-height-sm @icon-width-height-sm;
    background-position-y: 8px;
    background-position-x: 10px;
  }
}

.operationDiv {
  display: flex;
  padding: 8px 0px;
  background: @white;
  margin-top: 8px;
  .black-font;
  .font-size-md-2;

  img {
    .icon-width-height-patient;
    margin: 0 auto;
  }

  div {
    width: 25%;
    text-align: center;
  }

  :nth-child(4) {
    margin-right: 0px;
  }

  li {
    margin-top: 8px;
  }
}

.groupNameList {
  width: calc(100% - 32px);
  .display-div;
  padding: 0 16px;
  position: relative;
  z-index: 2;
  background: @white;

  .groupNameList_box {
    width: calc(100% - 22px);
    overflow-x: scroll;
    display: flex;
    align-items: center;

    .groupNameList_item,
    .groupNameList_item_active {
      padding: 11px 0;
      margin-right: 20px;
      white-space: nowrap;

      span {
        .font-size-md;
        .font-color-2;
        line-height: 20px;
      }
    }

    .groupNameList_item_active {
      border-bottom: 3px solid @blue;

      span {
        .font-blod-2;
        .font-login-color-blue;
        margin-top: 3px;
        display: block;
      }
    }

    .groupNameList_item:last-child {
      margin-right: 0;
    }
  }

  .groupNameList_box::-webkit-scrollbar {
    display: none;
  }
}

.box {
  /*height: calc(100vh - 235px);*/
  overflow-y: scroll;
}

.list {
  background: @white;
  padding: 0 16px;

  .item {
    display: flex;
    align-items: center;

    img {
      margin-right: 8px;
      padding: 12px 0;
    }

    span {
      .black-font;
      .font-size-md-2;
      line-height: 20px;
    }
  }
}
</style>
