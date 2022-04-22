<template>
  <div id="myDrugInstruction">
    <navbar title="药品详情"></navbar>
    <div class="drugCart">
      <img
        v-zlazy="durginfo.drugImg"
        class="img-width-height-lg"
        :data-type="durginfo.drugType == '3' ? 'cyImg' : 'xyImg'"
        v-if="durginfo.drugType"
      />
      <div class="info">
        <li
          class="name"
          :style="{ height: durginfo.drugName.length > 9 ? '40px' : '35px' }"
        >
          {{ durginfo.drugName }}
        </li>
        <li>
          <van-tag round v-if="durginfo.otc == 0" color="#14A0E6"
            >处方药</van-tag
          >
          <van-tag round v-else color="#14A0E6">非处方药</van-tag>
        </li>
      </div>
      <div class="save-btn">
        <button
          :class="
            flag == '0' ? 'publicWhiteBtn-80 grayBtn' : 'publicWhiteBtn-80'
          "
          @click="colleCttDrug()"
        >
          <span v-if="flag == '0'">收藏</span>
          <span v-else>已收藏</span>
        </button>
      </div>
    </div>
    <div class="drugInfo">
      <p class="druginfo-title">药品信息</p>
      <div class="infoCard" v-if="durginfo.memo">
        <p class="effect-title">【功能主治】</p>
        <p class="effect-detail">{{ durginfo.memo }}</p>
      </div>
      <div class="infoCard" v-if="durginfo.dduName">
        <p class="effect-title">【用法用量】</p>
        <p class="effect-detail" v-if="drugType != 3">
          {{ durginfo.dduName }}，每次{{ durginfo.eachQuan
          }}{{ durginfo.jldw }}，{{ durginfo.ddufName }}
        </p>
        <p class="effect-detail" v-else>
          单包{{ durginfo.eachQuan }}{{ durginfo.jldw }}
        </p>
      </div>
      <div class="infoCard">
        <p class="effect-title" v-if="durginfo.genericName">【通用名称】</p>
        <p class="effect-detail" v-if="durginfo.genericName">
          {{ durginfo.genericName }}
        </p>
        <p class="effect-title" v-if="durginfo.chemistryName">【化学名称】</p>
        <p class="effect-detail" v-if="durginfo.chemistryName">
          {{ durginfo.chemistryName }}
        </p>
        <p class="effect-title" v-if="durginfo.component">【成分】</p>
        <p class="effect-detail" v-if="durginfo.component">
          {{ durginfo.component }}
        </p>
        <p class="effect-title" v-if="durginfo.adverseReaction">【不良反应】</p>
        <p class="effect-detail" v-if="durginfo.adverseReaction">
          {{ durginfo.adverseReaction }}
        </p>
        <p class="effect-title" v-if="durginfo.taboo">【禁忌】</p>
        <p class="effect-detail" v-if="durginfo.taboo">{{ durginfo.taboo }}</p>
        <p class="effect-title" v-if="durginfo.storage">【贮藏】</p>
        <p class="effect-detail" v-if="durginfo.storage">
          {{ durginfo.storage }}
        </p>
        <p class="effect-title" v-if="durginfo.gg">【规格】</p>
        <p class="effect-detail" v-if="durginfo.gg">{{ durginfo.gg }}</p>
        <p class="effect-title" v-if="durginfo.jx">【剂型】</p>
        <p class="effect-detail" v-if="durginfo.jx">{{ durginfo.jx }}</p>
        <p class="effect-title" v-if="durginfo.termOfValidity">【有效期】</p>
        <p class="effect-detail" v-if="durginfo.termOfValidity">
          {{ durginfo.termOfValidity }}
        </p>
        <p class="effect-title" v-if="durginfo.pzwh">【批准文号】</p>
        <p class="effect-detail" v-if="durginfo.pzwh">{{ durginfo.pzwh }}</p>
        <p class="effect-title" v-if="durginfo.scqy">【生产企业】</p>
        <p class="effect-detail" v-if="durginfo.scqy">{{ durginfo.scqy }}</p>
        <p class="effect-title" v-if="durginfo.reminder">【温馨提示】</p>
        <p class="effect-detail" v-if="durginfo.reminder">
          {{ durginfo.reminder }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  findDrugById,
  addDoccommondrug,
  cancelDoccommondrug
} from "../../api/cf";
import myJsTools from "@/utils/myJsTools";

export default {
  name: "myDrugInstruction",
  components: { Navbar },
  data() {
    return {
      drugImg: "",
      drugId: "",
      durginfo: [],
      flag: "",
      docName: "",
      docId: "",
      drugType: ""
    };
  },
  created() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.docName = myJsTools.getItem("token_info").docName;
    this.drugId = this.$route.query.drugId;
    this.flag = this.$route.query.flag;
    this.drugType = this.$route.query.drugType;
    this.getDurgdeatil();
  },

  methods: {
    getDurgdeatil() {
      findDrugById({ drugId: this.drugId }).then(res => {
        this.durginfo = res.data;
      });
    },
    colleCttDrug() {
      if (this.flag == "0") {
        let param = {
          docId: this.docId,
          drugId: this.drugId,
          docName: myJsTools.getItem("token_info").docName
        };
        addDoccommondrug(param).then(res => {
          this.flag = "1";
        });
      } else {
        let param = {
          docId: this.docId,
          drugId: this.drugId
        };
        cancelDoccommondrug(param).then(res => {
          this.flag = "0";
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
#myDrugInstruction {
  background: @page-back;
  overflow: hidden;
  .drugCart {
    display: flex;
    height: 75px;
    background: white;

    padding: 12px;

    .info {
      padding-left: 12px;
      flex: 2;

      li {
        text-align: left;
        height: 35px;
      }

      .name {
        .black-font;
        .font-size-md;
        .font-blod-2;
      }

      .specification {
        .font-login-color;
        .font-login-sm;
        margin-top: 2px;
      }

      .price {
        .font-login-color-red;
        .font-size-md;
        margin-top: 4px;
        .font-blod-2;
      }
    }
    .save-btn {
      flex: 1;
      padding: 30px 30px 10px;
    }
  }
  .drugInfo {
    background: @white;
    width: 92%;
    margin: 4%;
    border-radius: 5px;
    padding-bottom: 5px;
    .druginfo-title {
      font-size: @font-size-lg;
      height: 22px;
      line-height: 22px;
      padding: 12px 12px 0;
      font-weight: @font-weight-bold-2;
    }
    .infoCard {
      margin: 10px;
      background: @page-back;
      padding: 5px;
      border-radius: 5px;
    }
    .effect-title {
      font-weight: @font-weight-bold-2;
      font-size: @font-size-md;
      color: @font-color-1;
    }
    .effect-detail {
      font-size: @font-size-md;
      color: @font-color-2;
      padding: 8px;
    }
  }
  .save-btn .grayBtn {
    color: @font-color-2!important;
    background: @white;
    border: 1px solid @font-color-2;
  }
}
</style>
