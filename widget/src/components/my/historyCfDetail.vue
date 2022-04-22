<template>
  <div class="prescription" id="prescription">
    <navbar type="defaultPage" title="历史处方详情"></navbar>
    <div class="addPre">
      <div class="diagnosis">
        <span>临床诊断</span>
        <div class="selectOpt">
          <span v-for="(item,index) in selectOptList" :key="index" class="selectOptSpan">{{item}}</span>
        </div>
      </div>
      <cf-list :info="prescription"></cf-list>
    </div>

  </div>
</template>

  <script>
import navbar from "@/common/navbar";
import { findPatientPrescriptionHistoryDetail } from "@/api/cf.js";
import CfList from "../childCompon/cfList";
export default {
  data() {
    return {
      index: 0,
      selectOptList: [],
      herbArr: [],
      arrlist: [],
      btnDisabled: false,
      item: {},
      medicineList: [],
      herbList: [],
      prescription: []
    };
  },

  components: {CfList, navbar },
  created() {
    this.item = this.$route.query.item;
    console.log(this.$route.query);
    if (this.item && this.item.diagName.indexOf(",") == -1) {
      this.selectOptList.push(this.item.diagName);
    } else {
      this.selectOptList = this.item.diagName.split(",");
    }
    this.getDetail();
  },
  mounted() {},
  methods: {
    getDetail() {
      findPatientPrescriptionHistoryDetail({
        prescriptionId: this.$route.query.prescriptionId
      }).then(res => {
        console.log("历史处方详情", res);
        var data = res.data;
        this.prescription.push(data);
      });
    }
  }
};
</script>

  <style scoped lang="less">
.addPre {
  background: #f5f5f5;
  padding: 12px 11px;
  height: 90vh;
  overflow: scroll;
  .diagnosis {
    background: #fff;
    padding: 9px 16px 21px 16px;
    text-align: left;
    color: #333333;
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    .selectOpt {
      margin-top: 6px;
      .notSelect {
        color: #14a0e6;
        font-size: 14px;
        line-height: 20px;
        margin-top: 10px;
        text-align: center;
        vertical-align: middle;
        font-weight: 700;
        .addZdIcon {
          width: 20px;
          height: 20px;
          margin-left: 6px;
          display: inline-block;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
      .selectOptSpan {
        display: inline-block;
        position: relative;
        margin-right: 0.4rem;
        color: #999999;
        padding: 8px 15px;
        background: #f6f8fb;
      }
      .closeIcon {
        width: 15px;
        height: 15px;
        position: absolute;
        right: -8px;
        top: -5px;
      }
    }
  }

  .cfList {
    background: #fff;
    padding-top: 12px;
    border-radius: 4px;
    margin-top: 12px;
    .cyParams {
      margin-top: 15px;
    }
    .title {
      display: flex;
      line-height: 22px;
      padding: 0 14px;
      justify-content: space-between;
      color: #333;
      .rp {
        font-weight: 700;
        width: 70%;
        text-align: left;
        font-size: 17px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .cfType {
        font-size: 14px;
      }
    }
    .oneCfCard {
      padding: 0 14px;
      font-size: 14px;
      text-align: left;
      line-height: 20px;
      color: #333333;

      .drugName {
        font-weight: 800;
        margin-top: 10px;
      }
      .dduName {
        margin-top: 7px;
        padding-left: 12px;
      }
      .price {
        margin-top: 9px;
        padding-left: 12px;
        justify-content: space-between;
        :nth-child(1) {
          width: 85%;
        }
      }
      .memo {
        padding-left: 12px;
        margin-top: 10px;
      }
      .onceCardBtn button {
        border: none;
        width: 49%;
        line-height: 33px;
        background: #e7e7e7;
        border-radius: 4px;
        padding-left: 3px;
        margin-top: 12px;
      }
      .line {
        display: block;
        height: 1px;
        border-top: 1px dashed #979797;
        margin-top: 12px;
      }
    }
    .conAdd {
      border: none;
      width: 100%;
      line-height: 52px;
      background: #ffffff;
      padding-left: 3px;
      margin-top: 12px;
      color: #14a0e6;
      font-size: 16px;
      vertical-align: middle;
      .addCfIcon {
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
      }
    }
  }
  .friedPopup {
    padding: 20px;
    width: 70%;
    text-align: center;
    .title {
      color: #333333;
      font-size: 16px;
      line-height: 23px;
    }
    .tipsInfo {
      margin-top: 28px;
      color: #333333;
      font-size: 12px;
      line-height: 17px;
    }
    .friedBtns {
      margin-top: 36px;
      display: flex;
      text-align: center;
      button {
        width: 45%;
        font-size: 16px;
        line-height: 34px;
        border: 1px solid #14a0e6;
        border-radius: 23px;
        display: inline-block;
      }
      :nth-child(1) {
        background: #ffffff;
        color: #14a0e6;
      }
      :nth-child(2) {
        background: #14a0e6;
        color: #ffffff;
        margin-left: 10px;
      }
    }
  }
}
.btns {
  position: fixed;
  bottom: 0px;
  width: 100%;
  display: flex;
  font-size: 14px;
  line-height: 52px;
  padding-left: 13px;
  background: #f5f5f5;
  padding-bottom: 16px;
  // margin-top: 12px;

  button {
    width: 30%;
    border-radius: 4px;
    border-radius: 25px;
    font-weight: bold;
  }
  .addBtn {
    border: 1px solid #14a0e6;
    color: #14a0e6;
    background: #ffffff;
  }
  .saveBtn {
    border: none;
    color: #fff;
    background: #14a0e6;
  }
  .onlySaveBtn {
    background: #f5f5f5;
    border: 1px solid #14a0e6;
    color: #14a0e6;
    margin: 0 9px;
  }
}
.practice {
  width: 92%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 16px;
  .van-row {
    width: 100%;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    margin-bottom: 18px;
    .van-cell {
      padding: 0px;
      background: #f2f2f2;
      text-align: center;
      width: 75%;
      margin-left: 20px;
    }
    /deep/.van-field__control {
      text-align: center;
    }
  }
}

.practice li {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  box-sizing: border-box;
  padding-top: 5px;
  padding-bottom: 5px;
}

.overstriking {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
}

.practice li input,
.practice li select {
  width: 60px;
  line-height: 20px;
  font-size: 14px;
}

.practice p {
  padding: 5px 0;
}

.totalPrice {
  text-align: right;
  padding: 10px 25px;
  font-size: 14px;
  font-weight: 700;
}
.paramMs {
  display: flex;
  flex-wrap: nowrap;
}
/deep/.van-cell {
  width: 45%;
  font-size: 12px;
}
.oneCfCard /deep/.van-cell {
  width: 45%;
  font-size: 12px;
}

.diagnosis /deep/.van-cell {
  padding: 10px 0px;
}

.van-stepper {
  margin-top: 4px;
}

/deep/.van-stepper--round .van-stepper__minus {
  color: #d8d8d8;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  opacity: 1;
  margin-right: 5px;
}

/deep/.van-stepper--round .van-stepper__plus {
  color: #fff;
  background-color: #14a0e6;
  margin-left: 5px;
}

/deep/.van-stepper--round .van-stepper__input {
  background: #f2f2f2;
  width: 75%;
  padding: 12px 0;
}
.selectIcon {
  width: 14px;
  height: 14px;
  margin-top: 5px;
  margin-left: 5px;
}
</style>
