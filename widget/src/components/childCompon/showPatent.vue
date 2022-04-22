<template>
  <div class="cfList">
    <div class="patent" v-for="(drugItem,drugIndex) in orderCfList" :key="drugIndex">
      <van-row class="optTitle">
        <van-col span="24" class="black-font font-blod-3 font-size-lg">
          <span v-if="drugItem.prescriptionType == '1'">成药方</span>
          <span v-if="drugItem.prescriptionType == '4'">食品级</span>
        </van-col>
      </van-row>

      <div class="drugList">
        <div class="drugDiv">
          <div v-for="(item,index) in drugItem.details" :key="index">
            <li class="drugNameLi display-div">
              <u class="font-login-color-blue">{{ item.drugName }}</u>
              <u class="display-div">
                <span class="font-login-color quanNum">x{{ item.quan }} {{ item.unit }}</span>
              </u>
            </li>
            <li class="useMethod font-login-color">
              <u>用法: {{ item.dduName }}、每次{{ item.eachQuan }}{{ item.eachUnit }}、{{ item.ddufName }}、用药{{
                  item.days
                }}天</u>
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "showPatent",
  props:{
    orderCfList:{
      default: function () {
        return [];
      },
      type: Array,
    }
  }
}
</script>

<style scoped lang="less">

.patent {
  background: @white;
  margin-top: 8px;
  padding: 14px 8px;
  border-radius: 4px;

  .optTitle {
    display: flex;
    align-items: flex-end;
  }

  .rightBtn {
    justify-content: flex-end;

    .icon-width-height-sm-16 {
      display: inline-block;
    }
  }

  .van-col {
    text-align: center;
  }

  .leftBtn, .rightBtn {
    display: flex;
    align-items: center;
  }

}
.drugDiv {
  .font-size-md;

  .drugNameLi {
    background: #EAF8FF;
    padding: 8px;
    margin-top: 8px;
  }

  .quanNum {
    margin-right: 8px;
  }

  .useMethod {
    padding: 8px 6px;
    display: flex;
    align-items: center;

    .editIcon {
      padding-left: 13px;
    }
  }
}

</style>
