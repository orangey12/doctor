<template>
  <div class="addDrug">
    <navbar type="defaultPage" title="新增药品"></navbar>
    <div class="drugDetailList">
      <van-checkbox-group v-model="result" ref="checkboxGroups" >

        <van-checkbox :name="item.itemId" v-for="(item,index) in drugList.list" :key="index" @click="selectChange(item)" >
          <div class="drugInfo">
            <li class="name">{{item.drugName || item.itemName}}（{{item.gg}}）</li>
            <li
              class="usage" v-if="prescriptionType == '1' || prescriptionType == '4'"
            >用法：
            <span v-if="item.dduName">{{item.dduName}}</span>
            <span v-if="item.djdName">{{item.djdName}}</span>
            、每次{{item.eachQuan}}{{item.eachUnit}}、{{item.ddufName}}、用药{{item.days}}天</li>
            <li
              class="usage" v-else
            >用法：
              <span v-if="item.dduName">{{item.dduName}}</span>
              <span v-if="item.djdName">{{item.djdName}}</span>
              、每次{{item.eachQuan}}{{item.eachUnit}}、{{drugList.prescription.dduName}}、用药{{drugList.prescription.days}}天</li>
            <li class="priceNum">
              <u>价格：¥{{item.price}}</u>
              <u>x{{item.quan}}</u>
            </li>
            <li class="explanation" v-if="item.memo">说明：{{item.memo}}</li>
          </div>
        </van-checkbox>
      </van-checkbox-group>

      <div class="selectAll">
        <van-checkbox-group v-model="selectAllVal">
          <van-checkbox name="all"  @click="selectAll">
            <div class="allDiv">
              <u>
                <span>全选</span>
              </u>
              <u>
                <span>合计：</span>
                <span class="font-login-color-red">{{totalPrice}}</span>
              </u>
            </div>
          </van-checkbox>
        </van-checkbox-group>
        <button class="pubicBtn-80" @click="saveDrug">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import {
  findPatientPrescriptionHistoryDetail
} from "@/api/cf.js";
import {Toast} from "vant";
export default {
  components: { navbar },
  data() {
    return {
      type: 1,
      dpmpId: "",
      prescriptionId:"",
      result: [],
      selectAllVal: [], //全选
      drugList: [],
      prescriptionType:"",
    };
  },
  computed: {
    totalPrice() {
      var num = 0;
      if(this.drugList && this.drugList.list){
        for (let m = 0; m < this.drugList.list.length; m++) {
          const element = this.drugList.list[m];
          for (let x = 0; x < this.result.length; x++) {
            const drugSelect = this.result[x];
            if (drugSelect == element.itemId) {
              num += element.price * element.quan;
            }
          }
        }
      }
      return num.toFixed(2);
    }
  },
  watch: {
    result() {
      if (this.result.length == this.drugList.list.length) {
        this.selectAllVal.push("all");
      }else{
        this.selectAllVal = []
      }
    }
  },
  created() {
    this.prescriptionType =  this.$route.query.prescriptionType;
    this.prescriptionId = this.$route.query.prescriptionId;
    this.getDetail();
  },

  methods: {
    selectChange(item){
      console.log(item);
    },
    selectAll() {
      if (this.selectAllVal.length == 1) {
        this.$refs.checkboxGroups.toggleAll(true);
      } else {
        this.$refs.checkboxGroups.toggleAll();
      }
    },
    // 获取处方列表药品
    getDetail() {
        let param = {
        prescriptionId: this.prescriptionId
      };
        findPatientPrescriptionHistoryDetail(param).then(res => {
          console.log(res, "历史处方详情");
          this.drugList = res.data;
        });
    },
    // 保存
    saveDrug() {
      let arr=[];
      let type;
      var idx = this.$route.query.idx;
      for (let m = 0; m < this.result.length; m++) {
        const drugSelect = this.result[m];
        for (let x = 0; x < this.drugList.list.length; x++) {
          const element = this.drugList.list[x];
          if (drugSelect == element.itemId) {
            let info = {
              drugId: element.itemId,
              drugName: element.drugName || element.itemName,
              price: element.price,
              pcjf: element.ddufName,
              days: element.days,
              dosage: element.eachQuan,
              unit: element.unit,
              gg: element.gg,
              bzsl: element.bzsl,
              scqy: element.scqy,
              pzwh: element.pzwh,
              isMedical: element.isMedical,
              ybxmbm: element.ybxmbm,
              memo: element.memo,
              jldw: element.eachUnit,
              sendNum: element.quan,
              dduName: element.dduName,
              djdName:element.djdName,
              ddufName:element.ddufName,
              day:element.day,
              times:element.times,
              supplierName:element.supplierName,
              supplierId:element.supplierId,
              shareProportion:element.shareProportion,
              itemType:element.itemType
            };
            console.log(info);
            type = element.itemType;
            if (element.itemType == '1'){
              arr = this.$store.getters.getMedicineList;
            }else if (element.itemType == '4'){
              arr = this.$store.getters.getFoodList;
            }else if (element.itemType == '3'){
              info.pcjf = element.djdName;
              arr = this.$store.getters.getHerbList;
            }
            if (isNaN(idx)) {
              arr.push([info]);
              idx = arr.length -1;
              console.log(idx)
            } else {
              var s = false;
              for (let i = 0; i < arr[idx].length; i++) {
                const element = arr[idx][i];
                if (info.drugName == element.drugName) {
                  Toast("请勿选择重复的药品");
                  s = true;
                  break;
                }
              }
              if (!s) {
                arr[idx].push(info);
              } else {
                return;
              }
            }

          }
        }

      }
      if (type == '1'){
        AppVue.$store.commit("setMedicineList", arr);
      }else if (type == '3'){
        AppVue.$store.commit("setHerbList", arr);
      }else if (type == '4'){
        AppVue.$store.commit("setFoodList", arr);
      }
      this.$router.go(-2);
    }
  }
};
</script>

<style scoped lang="less">

  .drugDetailList {
    margin: 19px 11px;
    background: @white;
    border-radius: 4px;
    .font-size-md;
    .black-font;

    /deep/ .van-checkbox__icon .van-icon{
      border: 1px solid @font-color-3;
    }
    /deep/.van-checkbox__label {
      margin-left: 8px;
      .black-font;
      line-height: 20px;
      width: 85%;
    }
    .van-checkbox {
      padding: 22px 12px 12px;
      .drugInfo {
        margin-left: 10px;
        :nth-child(2),
        :nth-child(4) {
          line-height: 20px;
          .div-overflow;
        }
        .name {
          .font-blod-2;
        }
        .priceNum {
          justify-content: space-between;
          display: flex;
          width: 100%;
          :nth-child(1) {
            width: 90%;
            .div-overflow;
          }
        }
        .usage {
          margin-top: 7px;
          margin-bottom: 9px;
        }
        .explanation {
          margin-top: 12px;
        }
      }
    }
    .selectAll {
      position: fixed;
      align-items: center;
      bottom: 0px;
      width: 100%;
      background: @white;
      .font-size-md;
      .black-font;
      display: flex;
      left: 0;
      padding: 10px 0;
      .van-checkbox {
        padding: 0px;
      }
      /deep/.van-checkbox-group {
        width: 70%;
        padding-left: 15px;
      }
      /deep/.van-checkbox__label {
        width: 90%;
      }
      /deep/.van-checkbox__icon .van-icon {
        border: 3px solid @blue;
      }
      .allDiv {
        justify-content: space-between;
        width: 100%;
        :nth-child(1) {
          width: 50%;
        }
      }

    }
  }

  /deep/ .van-checkbox{
    align-items: flex-start;
  }
</style>
