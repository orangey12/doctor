<template>
  <div class="my_box">
    <div class="my_box_item" v-for="(item,index) in list" :key="index" @click="openDetail(item,index)">
      <img v-zlazy="item.patientImg" class="headImg"/>
      <div>
        <div class="patientInfo">
          <span>{{item.patientName}}</span>
          <span style="margin: 0 10px">{{item.sex}}</span>
          <span>{{item.age}}{{item.ageUnit}}</span>
        </div>
        <div>
          <span>医生：{{item.docName}}</span>
          <span style="margin-left: 10px">{{item.deptName}}</span>
        </div>
        <div class="one-txt-cut ">诊断：{{item.diagName}}</div>
        <div>提交时间：{{item.addTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import myJsTools from '../../utils/myJsTools';

  export default {
    name: "infoCard",
    props: {
      list: {
        type: Array
      },
      type: {
        type: Number
      },
      checkType: {
        default: -1,
        type: Number
      }
    },
    created() {

    },
    methods: {
      openDetail(item, index) {
        myJsTools.setItem("patientInfo", item);
        this.$router.push({
          name: 'pharmWait',
          query: {
            businessId: item.businessId,
            businessCode: item.businessCode,
            regId: item.regId,
            patientId: item.patientId,
            diagName: item.diagName,
            addTime: item.addTime,
            type: this.type,
            checkType: this.checkType
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">


  .my_box {
    width: 90%;
    margin: 0 auto;
    padding: 0 16px;

    &_item {
      padding: 12px;
      margin-top: 12px;
      background: @white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      .black-font;
      .font-size-md;
      line-height: 20px;

      .headImg {
        .img-width-height-md;
        margin-right: 12px;
      }

      div{
        .font-size-md;
        line-height: 20px;
        margin-top: 4px;
        .div-overflow;
        .font-blod;
        width: 95%;
      }

      .patientInfo {
        .font-size-md-2;
        .font-blod-2;
        line-height: 21px;
        margin-top: 0px;
      }
    }
  }
</style>
