<template>
  <div class="navbar">
    <div :style="{ height: headerHeight + 'px' }"></div>
    <header
      v-show="type == 'index'"
      class="indexHeader"
      :style="{ 'padding-top': paddingTop + 'px' }"
    >
      <div @click="openSearch">
        <input
          type="text"
          class="searchInput"
          placeholder="请输入想要搜索的内容"
          disabled
        />
      </div>
    </header>
    <header
      v-show="type == 'defaultPage'"
      class="defaultHeader"
      :style="{ 'padding-top': paddingTop + 'px' }"
    >
      <img
        src="../assets/img/chat/back.png"
        class="backIcon"
        @click="goBack"
        v-show="showLeft"
        :style="{ top: parseInt(paddingTop + 12) + 'px' }"
      />
      <div class="title">{{ title }}</div>
      <div
        @click="openTemplate"
        class="rightIcon"
        :style="{ top: parseInt(paddingTop + 8) + 'px' }"
      >
        <slot name="rightIcon"> </slot>
      </div>
    </header>
    <header
      v-show="type == 'tabPage' || type == 'MytabPage'"
      :class="type == 'MytabPage' ? 'tabHeader mytabHeader' : 'tabHeader'"
      :style="{ 'padding-top': paddingTop + 'px' }"
    >
      <div class="title">{{ title }}</div>
      <div
        @click="openTemplate"
        class="rightIcon"
        :style="{ top: parseInt(paddingTop + 8) + 'px' }"
      >
        <slot name="rightIcon"> </slot>
      </div>
    </header>
  </div>
</template>

<script>
import $api from "@/utils/api";
import myJsTools from "../utils/myJsTools";
import { updateBussStatus } from "../api/cf";
export default {
  props: {
    type: {
      default: "defaultPage"
    },
    title: {
      type: String
    },
    deptId: {
      type: String
    },
    showLeft: {
      default: true
    },
    active: {
      default: -1
    },
    businessId: {
      default: ""
    },
    updateType: {
      default: false
    },
    isPopup: {
      default: false
    }
  },
  data() {
    return {
      value: "",
      titleWidth: "",
      paddingTop: "",
      headerHeight: ""
    };
  },

  mounted() {
    if (this.showLeft) {
      this.titleWidth = 90;
    } else {
      this.titleWidth = 100;
    }
    let top = 0;
    if (process.env.NODE_ENV != "development") {
      if (api) {
        top = api.safeArea.top;
      }
      this.paddingTop = top;
      this.addEvent();
    }
    this.$nextTick(() => {
      var headers = $api.domAll("header"),
        header;
      console.log(headers, "headerHeight");
      if (this.type == "index") {
        header = headers[0];
      } else if (this.type == "defaultPage") {
        header = headers[1];
      } else if (this.type == "tabPage" || this.type == "MytabPage") {
        header = headers[2];
      }
      var headerHeight = $api.cssVal(header, "height").replace("px", "");
      console.log("headerHeight" + headerHeight);
      this.headerHeight = top + parseInt(headerHeight);
      if (headerHeight) {
        myJsTools.setItem("headerHeight", top + parseInt(headerHeight));
      }
    });
  },
  methods: {
    addEvent() {
      let me = this;
      let hisUrl = this.$route.name;
      api.addEventListener(
        {
          name: "keyback"
        },
        function(ret, err) {
          console.log("sssssssss");
          api.addEventListener(
            {
              name: "closeFrame"
            },
            function(ret, err) {
              api.closeFrame({
                name: ret.value.pageName
              });
            }
          );
          me.goBack();
        }
      );
    },
    emitPara() {
      this.$emit("prevPage");
    },
    goBack() {
      let hisUrl = this.$route.name;
      console.log(hisUrl + "-------");
      //如果有弹窗关闭弹窗
      if (this.isPopup) {
        this.$emit("quit");
        return false;
      }
      //关闭pdf
      if (hisUrl == "electronicPrescription") {
        var pdfReader = api.require("pdfReader");
        pdfReader.closePdfView();
      }
      //关闭图片
      if (this.$route.name == "imgLink") {
        api.closeFrame({
          name: "imgLink"
        });
      }
      //关闭触发计算方法
      if (hisUrl == "prescription") {
        this.$emit("quit");
        return false;
      }
      if (hisUrl == "addUsedCf" || hisUrl == "nowPatient") {
        this.$store.commit("setAllCfList", []);
      }
      if (hisUrl == "addCheck") {
        this.$store.commit("setAllCheckList", []);
      }
      if (hisUrl == "newScaleContent" || hisUrl == "scaleDetail") {
        this.$store.commit("setAllTopic", []);
      }
      //添加缓存
      if (hisUrl != "authentication" && hisUrl != "docAuthImg") {
        this.$store.commit("UPDATE_KEEP_ALIVE", {
          keepAlive: hisUrl,
          type: 1
        });
      }

      if (hisUrl == "pharmWait") {
        myJsTools.setItem("pharmActive", 0);
        if (this.updateType) {
          updateBussStatus({
            businessId: this.businessId,
            status: "2"
          }).then(res => {
            console.log("审核状态改为审核中");
          });
        }
      }
      if (hisUrl != "mainIndex") {
        this.$router.go(-1);
      }
    },
    // 打开搜索页面
    openSearch() {
      this.$router.push({
        name: "searchIndex"
      });
    },
    openTemplate() {
      console.log(this.active);
      if (this.active == 0) {
        //线上排版模板
        this.$router.push({
          name: "visitTemplate"
        });
      } else if (this.active == 1) {
        //线下排版模板
        this.$router.push({
          name: "offlineVisitTemplate",
          query: {
            active: 1
          }
        });
      } else if (this.active == 3) {
        //处方预览
        this.$router.push({
          name: "prescriptionPreview"
        });
      } else if (this.active == 4) {
        //自动审方
        this.$router.push({
          name: "preAuto"
        });
      } else {
        return;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../assets/css/overall";
input::-webkit-input-placeholder {
  line-height: normal;
}
.indexHeader {
  display: flex;
  width: 100%;
  background-image: @linear-gradient-blue-2;
  .searchInput {
    width: 100%;
    position: relative;
    left: 18px;
    padding-left: 36px;
    line-height: 34px;
    font-size: 16px;
    border-radius: 22pt;
    background: url("../assets/img/index/search.png") no-repeat;
    background-color: #fff;
    background-size: 22px 22px;
    background-position-x: 10px;
    background-position-y: 6px;
  }

  ::placeholder {
    color: #c1c1c1;
    font-size: 16px;
    line-height: 22px;
  }
  ::-webkit-input-placeholder {
    color: #c1c1c1;
    font-size: 16px;
    line-height: 33px;
  }
  .searchIcon {
    width: 22px;
    height: 22px;
    position: absolute;
    left: 26px;
    z-index: 999;
  }
  div {
    width: 80%;
    padding: 11px 0;
    input {
      width: 100%;
    }
  }
}
.defaultHeader {
  width: 100%;
  background: #ffffff;
  line-height: 30px;
  height: 44px;
  align-items: flex-end;
  font-weight: @font-weight-bold;
  .title {
    color: #333333;
    font-size: 18px;
    padding: 7px 0;
    text-align: center;
  }
  .backIcon {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 16px;
  }
  .rightIcon {
    position: absolute;
    right: 16px;
  }
}
.tabHeader {
  width: 100%;
  background: @white;
  line-height: 30px;
  .rightIcon {
    position: absolute;
    right: 16px;
  }
  .title {
    .black-font;
    .font-blod;
    .font-size-lg-2;
    padding: 7px 0;
    text-align: center;
    width: 100%;
  }
}
</style>
