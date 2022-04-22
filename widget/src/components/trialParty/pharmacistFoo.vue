<template>
  <div class="my">
    <div
      class="my_head"
      :style="{ 'padding-top': headerHeight }"
      @click="openCenter"
    >
      <div class="my_head_top">
        <div class="my_head_top_1">
          <img
            class="cacheImg_1 img-width-height-lg"
            v-zlazy="docImg"
          />
        </div>
        <div class="my_head_top_2">
          <span class="docName">{{ info.docName }}</span>
          <div class="my_head_top_2_1">
            <span style="display: flex">
              <span v-if="info.deptName">{{ info.deptName }} |</span>
              <span v-if="info.docProf" style="margin-left: 3px">{{ info.docProf }}</span>
            </span>
            <img src="@/assets/img/my/go.png" alt=""/>
          </div>
          <div class="my_head_top_2_2" v-if="info.docLabelStr">
            <span class="font-login-color-blue" v-for="(item, index) in info.docLabelStr" :key="index">{{
                item
              }}</span>
          </div>
        </div>
      </div>
      <div class="my_head_bootom">
        <div class="my_head_bootom_item">
          <span>待审核处方</span>
          <span>{{ num.pendingReviewCount }}</span>
        </div>
        <div class="my_head_bootom_item">
          <span>审核通过</span>
          <span>{{ num.examinationPassedCount }}</span>
        </div>
        <div class="my_head_bootom_item">
          <span>审核未通过</span>
          <span>{{ num.reviewFailedCount }}</span>
        </div>
      </div>
    </div>
    <div class="my_menu">
      <div class="my_menu_item" @click="goRecordInformation">
        <img src="@/assets/img/my/icon_5.png"/>
        <span> 互联网医院备案</span>
        <img src="@/assets/img/my/my_back.png" alt=""/>
      </div>
      <div class="my_menu_item" @click="goFit">
        <img src="@/assets/img/my/icon_4.png"/>
        <span>设置</span>
        <img src="@/assets/img/my/my_back.png" alt=""/>
      </div>
    </div>
    <tabbar></tabbar>
  </div>
</template>
<script>
import navbar from "@/common/navbar";
import tabbar from "@/common/tabbar";
import myJsTools from "@/utils/myJsTools";
import {findDoctorByID} from "@/api/my";
import {
  getImageUrlCanDownLoad,
  getLabPresentationOssImg
} from "../../api/oss";
import $api from "@/utils/api";
import ossUpDown from "../../utils/ossUpDown";
import {getPharmacistAuditCount, getPharmacistInfo} from "../../api/my";

export default {
  name: "pharmacistFoo",
  components: {navbar, tabbar},
  data() {
    return {
      info: {},
      headerHeight: "",
      docImg: "",
      num: {}
    };
  },
  created() {
    this.getInfo();
    this.getAuditCount();
  },
  mounted() {
    this.headerHeight = parseInt(api.safeArea.top) + 20 + "px";
  },
  methods: {
    //获取医生详细信息
    getInfo() {
      getPharmacistInfo({
        docId: myJsTools.getItem("token_info").docId
      }).then(async res => {
        let data = res.data;
        this.info = data;
        if (res.data.docLabelStr) {
          this.info.docLabelStr = this.info.docLabelStr.split(",");
        }
        if (res.data.docLabelStr !== null) {
          sessionStorage.setItem("docLabelStr", res.data.docLabelStr);
        } else {
          sessionStorage.removeItem("docLabelStr");
          console.log(sessionStorage.getItem("docLabelStr"));
        }
      });
    },
    // 获取药师审核状态数量接口
    getAuditCount() {
      getPharmacistAuditCount({
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        this.num = res.data;
      });
    },
    openCenter() {
      this.$router.push({
        name: "personalCenter",
        query: {docId: this.info.docId, docName: this.info.docName}
      });
    },
    //跳转互联网备案信息
    goRecordInformation() {
      this.$router.push({
        name: "recordInformation",
        query: {
          docId: this.info.docId
        }
      });
    },
    goFit() {
      this.$router.push({
        name: "myFit"
      });
    }
  }
};
</script>
<style scoped lang="less">


.my_head {
  width: 92%;
  padding: 16px 4%;
  background: @blue @linear-gradient-blue;
  border-radius: 0px 0px 8px 8px;
}

.my_head_top {
  display: flex;
  margin-bottom: 21px;
}

.my_head_top_1 {
  .img-width-height-lg;
  margin-right: 10px;

  img {
    padding: 4px;
  }
}

.my_head_top_2 {
  width: calc(96% - 64px);
  .font-size-lg-2;
  .font-blod-2;
  .white-font;

  span {
    display: block;
  }

  .docName {
    line-height: 25px;
  }
}

.my_head_top_2_1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;

  span {
    .font-size-lg;
    .font-blod-2;
    .white-font;
    line-height: 22px;
  }

  img {
    width: 20px;
    height: 20px;
    margin-left: 70%;
  }
}

.my_head_top_2_2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  span {
    padding: 3px 8px;
    background: @white;
    border-radius: 16px;
    .font-size-sm;
    margin-right: 15px;
    margin-bottom: 7px;
  }
}

.my_head_bootom {
  display: flex;
  align-items: center;
  padding: 11px 0;
  background: rgba(255, 255, 255, 0.21);
  border-radius: 4px;
  justify-content: space-around;

  .my_head_bootom_item {
    text-align: center;
  }

  .my_head_bootom_item span {
    display: block;
    .font-size-sm;
    .white-font;
    opacity: 1;
    line-height: 17px;
  }

  .my_head_bootom_item span:last-child {
    .font-size-lg-20;
    .font-blod-2;
    .white-font;
    line-height: 28px;
  }
}

.my_menu {
  width: 92%;
  margin: 12px auto 0px;

  &_item {
    width: 92%;
    background: @white;
    border-radius: 8px;
    padding: 12px 4%;
    display: flex;
    align-items: center;
    .font-size-md-2;
    .black-font;
    line-height: 21px;
    position: relative;
    margin-bottom: 10px;

    img {
      .icon-width-height-sm;
    }

    span {
      margin-left: 10px;
    }
  }

  &_item img:last-child {
    position: absolute;
    right: 4%;
  }
}
</style>
