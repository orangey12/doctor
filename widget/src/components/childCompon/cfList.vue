<template>
  <div>
    <div class="cfList">
      <div
        class="cfDetail "
        v-for="(cfItem, cfIndex) in info"
        :key="cfIndex"
      >
        <div v-if="cfItem.prescriptionType == '1' || cfItem.prescriptionType == '4'">
          <li class="cfTitle display-div">
            <u class="betLeft">Rp</u>
            <u class="title">
              <span v-if="cfItem.prescriptionType == '1'">西药处方</span>
              <span v-if="cfItem.prescriptionType == '4'">食品级</span>
            </u>
          </li>
          <div
            v-for="(drugItem, drugIndex) in cfItem.details"
            :key="drugIndex"
          >
            <li class="medicineName">
              <u class="name"
              >{{ drugIndex + 1 }}.{{ drugItem.drugName }}（{{
                  drugItem.gg
                }}）</u
              >
            </li>
            <li class="priceLi display-div font-size-md">
              <u class="price ">价格：{{ drugItem.price }}</u>
              <u class="num">x{{ drugItem.quan }}</u>
            </li>
            <li class="usage">
              用法：{{ drugItem.dduName }}，每次{{
                drugItem.eachQuan
              }}{{ drugItem.eachUnit }}，{{ drugItem.ddufName }}，用药{{
                drugItem.days
              }}天
            </li>
            <li class="explanation" v-if="drugItem.memo">
              说明：{{ drugItem.memo }}
            </li>
            <li class="totalPrice">
              合计：
              <span class="font-login-color-red">{{ (drugItem.price * drugItem.quan).toFixed(2) }}</span>
            </li>
          </div>

        </div>
        <div v-if="cfItem.prescriptionType == '3'">
          <li class="cfTitle display-div">
            <u class="betLeft">Rp</u>
            <u class="title">草药处方</u>
          </li>
          <div
            v-for="(drugItem, drugIndex) in cfItem.details"
            :key="drugIndex"
          >
            <li class="medicineName">
              <u class="name"
              >{{ drugIndex + 1 }}.{{ drugItem.drugName }}（{{
                  drugItem.gg
                }}）</u
              >
            </li>
            <li class="priceLi display-div font-size-md">
              <u class="price ">价格：{{ drugItem.price }}</u>
              <u class="num">x{{ drugItem.quan }}</u>
            </li>
            <li class="priceLi font-size-md">
              特殊煎法：<span v-if="drugItem.dduName">{{drugItem.dduName}}</span><span v-else>煎服</span>
            </li>
            <li class="explanation" v-if="drugItem.memo">
              说明：{{ drugItem.memo }}
            </li>
          </div>
          <div>
            <li class="usage">
              用法：口服,每日{{ cfItem.rj }}剂，每日{{
                cfItem.rc
              }}次，用药{{ cfItem.days }}天
            </li>
            <li class="usage" v-if="cfItem.herbalFormulations">
              发药剂型：{{cfItem.herbalFormulations}}
            </li>
            <li :class="cfItem.isDj == '1'?'totalPrice':'usage'">共{{cfItem.herbalNum}}付</li>
            <li v-if="cfItem.isDj == '1'" class="priceLi"><u>代煎费：￥{{cfItem.djCost}}</u></li>
            <li class="totalPrice">
              合计：
              <span class="font-login-color-red">{{cfItem.cost.toFixed(2)}}</span>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "cfList",
  props:{
    info:{
      default:()=>{}
    }
  },
}
</script>

<style scoped lang="less">

.cfList{
  padding: 12px 16px;
  margin-top: 12px;
  background: @white;
  :nth-child(1){
    border:none;
  }
}
.cfDetail {
  border-top: 1px dashed #ebebeb;
  padding-bottom: 8px;
  .cfStatus {
    font-size: 14px;
    line-height: 20px;
    margin-top: 18px;
    font-weight: 700;
  }

  .totalPrice {
    text-align: right;
    margin-top: 8px;
    .black-font;
    line-height: 20px;
  }

  .priceLi {
    margin-top: 8px;

    .num {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .medicineName,
  .cfTitle {
    justify-content: space-between;
  }

  .cfTitle {
    margin-top: 8px;
    font-weight: 700;

    .betLeft {
      font-size: 17px;
      line-height: 24px;
    }

    .title {
      font-size: 14px;
      line-height: 20px;
    }
  }

  .medicineName {
    margin-top: 8px;

    .name {
      font-weight: 700;
      font-size: 14px;
      width: 90%;
      line-height: 20px;
    }

    .num {
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
    }
  }

  .usage,
  .explanation {
    margin-top: 7px;
    line-height: 20px;
    font-size: 14px;
  }
}
</style>
