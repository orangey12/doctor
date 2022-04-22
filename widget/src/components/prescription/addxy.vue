<template>
  <div class="addxy" id="addxy">
    <navbar type="defaultPage" :title="!flag?'新增药品':'修改药品'"></navbar>
    <div class="fromDiv">
      <van-field v-model="info.drugName" label="名称" placeholder="自动带出" readonly />
      <van-form validate-first @failed="onFailed">
        <van-field
          v-model="info.dosage"
          label="每次剂量"
          placeholder="请输入数量"
          @input="getChange"
          type="number"
          maxlength="12"
        >
          <template #button>
            <span class="oneMg">{{info.jldw}}</span>
          </template>
        </van-field>
      </van-form>
      <van-field
        v-model="info.ddufName"
        label="频次"
        placeholder="请选择频次"
        right-icon="arrow-down"

        readonly
        @click="showFrying=true"
      />
      <van-field
        v-model="info.days"
        label="天数"
        placeholder="请输入天数"
        maxlength="3"
        @input="getChange"
        type="digit"
      />
      <van-field v-model="info.sendNum" maxlength="3" @input="getChange" type="digit" label="发药数量" placeholder="自动根据频次、天数、每次剂量计算">
        <template #button>
          <span class="numUnit">{{info.unit}}</span>
        </template>
      </van-field>
      <van-field
        v-model="info.dduName"
        label="服用方法"
        placeholder="请选择服用方法"
        right-icon="arrow-down"
        readonly
        @click="showFyff = true"
      />
      <van-field readonly label="单价">
        <template #button>
          <span class="oneMg">￥{{info.price}}</span>
        </template>
      </van-field>
      <van-field readonly label="总计">
        <template #button>
          <span class="oneMg">￥{{total}}</span>
        </template>
      </van-field>
      <van-field v-model="info.memo" label="说明" placeholder="请输入说明（可忽略）" />
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="addLocalMedicine" v-if="!flag">添加</button>
      <button class="publicBtn" @click="addLocalMedicine" v-else>保存</button>
    </div>
    <van-popup v-model="showFrying" position="bottom">
      <van-picker show-toolbar :columns="columns" :default-index="defaultIndex"
                  @cancel="showFrying = false" @confirm="commitPc" />
    </van-popup>
    <van-popup v-model="showFyff" position="bottom">
      <van-picker
        show-toolbar
        :columns="fyColumns"
        @cancel="showFyff = false"
        :default-index="fyIndex"
        @confirm="commitFyff"
      />
    </van-popup>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api.js";
import { findAll, dicdrugusage } from "@/api/cf.js";
import { Toast } from "vant";
export default {
  props: {},
  data() {
    return {
      info: {},
      pcjf: [],
      flag: 0,
      total: 0,
      usage: [],
      columns: [],
      pcList: [],
      fyColumns: [],
      fyList: [],
      showFrying: false,
      showFyff: false,
      pattern: /\d{1}/,
      defaultIndex:0,
      fyIndex:0,
    };
  },
  components: { navbar },
  created() {
    if (this.$route.query.flag) {
      this.flag = this.$route.query.flag;
    }

    this.getpcList();
    var obj = this.$route.query.info;
    console.log(obj)
    this.info = {
      drugId: obj.drugId,
      drugName: obj.drugName,
      itemType:obj.itemType,
      price: obj.price,
      pcjf: "0",
      days: "",
      dosage: obj.eachQuan,
      unit: obj.unit,
      gg: obj.gg,
      bzsl: obj.bzsl,
      scqy: obj.scqy,
      pzwh: obj.pzwh,
      isMedical: obj.isMedical,
      ybxmbm: obj.ybxmbm,
      memo: "",
      jldw: obj.jldw,
      sendNum: "",
      dduName: obj.dduName,
      supplierName:obj.supplierName,
      supplierId:obj.supplierId,
      shareProportion:obj.shareProportion,
      ddufName:obj.ddufName,
      ddufCode:obj.ddufCode,
    };
    if (this.flag) {
      this.info.pcjf = obj.pcjf;
      this.info.sendNum = obj.sendNum;
      this.info.dosage = obj.dosage;
      this.info.days = obj.days;
      this.info.memo = obj.memo;
      this.total = (this.info.sendNum * this.info.price).toFixed(2);
    }
    console.log(obj)
  },
  mounted() {
    var that = this;
    // $api.css(
    //   $api.byId("addxy"),
    //   "padding-top:" + parseInt(api.safeArea.top) + "px"
    // );
  },
  methods: {

    // 获取频次
    getpcList() {
      let obj = this.$route.query.info;
      findAll().then(res => {
        console.log(res);
        var data = res.data;
        this.pcList = data;
        this.info.ddufName = data[0].ddufName;
        this.info.ddufCode = data[0].ddufCode;
        this.info.day = data[0].day;
        this.info.times = data[0].times;
        for (let m = 0; m < data.length; m++) {
          const element = data[m];
          this.columns.push(element.ddufName);

          if(obj.ddufName){
              if(obj.ddufName == element.ddufName){
                this.info.ddufName = element.ddufName;
                this.info.ddufCode =element.ddufCode;
                this.info.day = element.day;
                this.info.times = element.times;
                this.defaultIndex = m;
              }
          }
        }
      });
      dicdrugusage().then(res => {
        console.log(res);
        var data = res.data;
        this.fyList = data;
        this.info.dduName = data[0].dduName;
        for (let m = 0; m < data.length; m++) {
          const element = data[m].dduName;
          this.fyColumns.push(element);
          if(obj.dduName){
            if(obj.dduName == element){
              this.info.dduName = element;
              this.fyIndex = m;
            }
          }
        }
      });
    },
    // 频次选择之后保存
    commitPc(value) {
      var index = this.columns.indexOf(value);
      this.info.ddufName = value;
      this.info.ddufCode = this.pcList[index].ddufCode;
      this.info.day = this.pcList[index].day;
      this.info.times = this.pcList[index].times;
      this.showFrying = false;
      this.getChange();
    },
    // 提交服用方法选择
    commitFyff(value) {
      var index = this.fyColumns.indexOf(value);
      this.info.dduName = value;
      this.showFyff = false;
    },
    // 剂量改变 change事件
    getChange() {
      var reg = /^[1-9]\d*$/;
      if (this.info.dosage && !reg.test(this.info.dosage)) {
        this.info.dosage = "";
        Toast("每次剂量请输入正整数");
        return;
      }
      if (this.info.days && !reg.test(this.info.days)) {
        this.info.days = "";
        Toast("天数请输入正整数");
        return;
      }
      if (this.info.sendNum && !reg.test(this.info.sendNum)) {
        this.info.sendNum = "";
        Toast("发药数量请输入正整数");
        return;
      }
      if (this.info.days && this.info.dosage) {
        this.info.pcjf = parseInt(this.info.pcjf);
        this.info.sendNum = Math.ceil(
          (((this.info.dosage * this.info.times) / this.info.day) *
            this.info.days) /
            this.info.bzsl
        );
        this.total = (this.info.sendNum * this.info.price).toFixed(2);
      }
    },
    // 保存西药
    addLocalMedicine() {
      if (this.info.jldw == "" || this.info.days == "") {
        Toast("请输入内容");
        return;
      }
      if(!this.info.dosage){
        Toast("每次剂量");
        return;
      }
      var arr;
      if(this.$route.query.type == 0){
        arr = this.$store.getters.getMedicineList;
      }else{
        arr = this.$store.getters.getFoodList;
      }
      var idx = this.$route.query.idx;
      console.log(arr, idx);
      if (this.flag) {
        var index = this.$route.query.index;
        arr[idx][index] = this.info;
      } else {
        if (isNaN(idx)) {
          arr.push([this.info]);
        } else {
          var m = false;
          for (let i = 0; i < arr[idx].length; i++) {
            const element = arr[idx][i];
            if (this.info.drugName == element.drugName) {
              Toast("请勿选择重复的药品");
              m = true;
              break;
            }
          }
          if (!m) {
            arr[idx].push(this.info);
          } else {
            return;
          }
        }
      }
      console.log(arr);
      if(this.$route.query.type == 0){
        AppVue.$store.commit("setMedicineList", arr);
      }else{
        AppVue.$store.commit("setFoodList", arr);
      }

      this.goback();
    },
    // 返回
    goback() {
      if (this.flag) {
        this.$router.go(-1);
      } else {
        this.$router.go(-2);
      }
    },
    onFailed(errorInfo) {
      console.log("failed", errorInfo);
    }
  }
};
</script>

<style scoped lang="less">

.fromDiv {
  text-align: left;
  /deep/.van-cell {
    .font-color-2;
    .font-size-md;
    line-height: 20px;
    padding: 13px 16px;
    width: 100%;
  }
  .oneMg {
    color: #ff0000;
    line-height: 20px;
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
