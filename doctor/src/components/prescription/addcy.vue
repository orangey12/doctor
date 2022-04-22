<template>
  <div class="addcy" id="addcy">
    <navbar
      type="defaultPage"
      :title="!flag ? '新增药品' : '修改药品'"
    ></navbar>
    <div class="fromDiv">
      <van-field
        v-model="info.drugName"
        label="名称"
        placeholder="自动带出"
        readonly
      />
      <van-field
        v-model="info.sendNum"
        label="数量"
        placeholder="请输入数量"
        @change="restrictNum"
        type="number"
        class="sendNum"
      >
        <template #button>
          <span class="oneMg">{{ info.unit }}</span>
        </template>
      </van-field>
      <div class="tipsUnit font-login-color font-size-md">
        <div>
          <span v-for="(item,index) in tipsUnitList" @click="selectTipsNum(item)">{{ item.num }}g</span>
        </div>
      </div>
      <van-field readonly label="单价">
        <template #button>
          <span class="oneMg">￥{{ info.price }}</span>
        </template>
      </van-field>
      <van-field readonly label="金额">
        <template #button>
          <span class="oneMg"
          >￥{{ (info.price * info.sendNum).toFixed(2) }}</span
          >
        </template>
      </van-field>
      <van-field
        v-model="info.pcjf"
        label="特殊煎法"
        placeholder="请选择特殊煎法"
        right-icon="arrow-down"
        readonly
        clearable
        @click="showFrying = true"
      />
      <van-field
        v-model="info.memo"
        label="说明"
        autosize
        placeholder="请输入说明（可忽略）"
        maxlength="100"
        show-word-limit
      />
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="addLocalMedicine" v-if="!flag">
        添加
      </button>
      <button class="publicBtn" @click="addLocalMedicine" v-else>保存</button>
    </div>
    <van-popup v-model="showFrying" position="bottom">
      <li class="fryingTitle display-div font-login-color-blue font-size-md-2">
        <u @click="showFrying = false">取消</u>
        <u @click="selecttsjf">确定</u>
      </li>
      <van-checkbox-group v-model="result" :max="1" icon-size="16">
        <van-checkbox v-for="(item,index) in columns" :key="index" :name="item" @click="changeSelect(item)">{{item}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>

  </div>
</template>

<script>
import navbar from "@/common/navbar";
import $api from "@/utils/api.js";
import {findAll, getDicDrugDecoction} from "@/api/cf.js";
import {Toast} from "vant";

export default {
  props: {},
  data() {
    return {
      info: {},
      pcjf: [],
      result:[],
      flag: 0,
      total: 0,
      usage: [],
      columns: [],
      showFrying: false,
      defaultIndex: 0,
      tipsUnitList: [{
        num: 10
      }, {
        num: 20
      }, {
        num: 30
      }]
    };
  },
  components: {navbar},
  created() {
    this.getRoastingMethod();
    if (this.$route.query.flag) {
      this.flag = this.$route.query.flag;
    }
    var obj = this.$route.query.info;
    console.log(JSON.stringify(obj) + "=-----------草药处方传参")
    this.info = {
      drugId: obj.drugId,
      drugName: obj.drugName,
      itemType: obj.itemType,
      price: obj.price,
      total: "",
      sendNum: "",
      pcjf: "",
      unit: obj.unit,
      gg: obj.gg,
      bzsl: obj.bzsl,
      scqy: obj.scqy,
      pzwh: obj.pzwh,
      isMedical: obj.isMedical,
      ybxmbm: obj.ybxmbm,
      memo: "",
      jldw: obj.jldw,
      jx: obj.jx,
      eachQuan: "",
      supplierName: obj.supplierName,
      supplierId: obj.supplierId,
      shareProportion: obj.shareProportion
    };
    if (this.flag) {
      this.info.pcjf = obj.pcjf;
      this.info.sendNum = obj.sendNum;
      this.info.total = obj.total;
      this.info.memo = obj.memo;
    }
  },
  methods: {
    //特殊煎法选择
    changeSelect(e){
      console.log(JSON.stringify(this.result))
      if(this.result.length == 0){
        this.result = []
      }else{
        this.result = [e];
      }
    },
    //设置特殊煎法
    selecttsjf(){
      if(this.result.length == 0){
        this.info.pcjf = ''
      }else{
        this.info.pcjf = this.result[0];
      }
      this.showFrying = false;
    },
    // 获取草药特殊煎法
    getRoastingMethod() {
      var obj = this.$route.query.info;
      getDicDrugDecoction().then(res => {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          this.columns.push(element.decoctionName);
          if (obj.pcjf) {
            if (obj.pcjf == element.decoctionName) {
              this.info.pcjf = element.decoctionName;
              this.defaultIndex = i;
            }
          }
        }
      });
    },
    selectTipsNum(item) {
      console.log(item);
      this.info.sendNum = parseInt(item.num);
      console.log(this.info)
      this.info = Object.assign({}, this.info)
    },
    // 验证剂量
    restrictNum() {
      if (
        !this.info.sendNum ||
        !/^[0-9]+(\.[0-9]{1})?$/.test(this.info.sendNum)
      ) {
        Toast("请输入正确的剂量,一位小数的正数");
        this.info.sendNum = "";
        return;
      } else {
        this.info.total = this.info.sendNum * this.info.price;
      }
    },
    // 频次煎法
    commitPc(value) {
      this.info.pcjf = value;
      this.showFrying = false;
    },
    // 保存草药
    addLocalMedicine() {
      this.info.cfType = 1;
      if (!this.info.sendNum) {
        alert("请输入数量");
        return;
      } else {
        var arr = this.$store.getters.getHerbList;
        var idx = this.$route.query.idx;
        if (this.flag) {
          var index = this.$route.query.index;
          arr[idx][index] = this.info;
        } else {
          if (isNaN(idx)) {
            arr.push([this.info]);
          } else {
            var m = false;
            console.log("idx", idx);
            console.log("arr", arr);
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
      }
      AppVue.$store.commit("setHerbList", arr);
      this.goback();
    },
    // 返回
    goback() {
      if (this.flag) {
        this.$router.go(-1);
      } else {
        this.$router.go(-2);
      }
    }
  }
};
</script>

<style scoped lang="less">

/deep/ .van-checkbox{
  padding: 12px 16px;
  justify-content: center;
  .font-size-md-2;

}



.fryingTitle{
  padding: 10px 16px;
}
.fromDiv {
  text-align: left;

  /deep/ .van-cell {
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

/deep/ .van-cell::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 16px;
  border-bottom: 1px solid @back-border;
  -webkit-transform: scaleY(.5);
  transform: scaleY(.5);
}

.sendNum:after {
  border: none;
}

.tipsUnit {
  background: @white;
  padding-left: 16px;

  div {
    padding-bottom: 4px;
    padding-left: 70px;
    border-bottom: 1px solid @back-border;
  }

  span {
    display: inline-block;
    border-radius: 13px;
    background: @back-border;
    margin-right: 8px;
    width: 80px;
    text-align: center;
    padding: 3px 0;
  }
}

/deep/ .van-field__label {
  width: 70px;
}
</style>
