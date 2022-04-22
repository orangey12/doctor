<template>
  <div class="my_box">
    <div
      class="my_box_item"
      v-for="(item, index) in list"
      :key="index"
      @click="openDetail(item, index)"
    >
      <img v-zlazy="item.patientImg" class="headImg"/>
      <div>
        <div class="patientInfo">
          <span
          >{{ item.patientName }} {{ item.sex }} {{ item.age
            }}{{ item.ageUnit }}</span
          >
        </div>
        <div>
          <span
          >医生：{{ item.docName }} &nbsp;&nbsp;&nbsp;{{
              item.deptName
            }}</span
          >
        </div>
        <div class="one-txt-cut ">诊断：{{ item.diagName }}</div>
        <div><span v-if="type == 0">开方</span><span v-if="type == 1 || type == 2">审方</span>时间：{{ item.addTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "infoCard",
    props: {
      list: {
        type: Array
      },
      type: {
        type: Number
      }
    },
    created() {
    },
    methods: {
      openDetail(item, index) {
        let title;
        if (this.type == 0) {
          title = "待审核";
        } else if (this.type == 0) {
          title = "未通过";
        } else {
          title = "已通过";
        }
        if (this.type == 0 || this.type == 2) {
          this.$router.push({
            name: "waitPassPerSetail",
            query: {
              businessId: item.businessId,
              sex: item.sex,
              patientImg: item.patientImg,
              patientName: item.patientName,
              age: item.age,
              ageUnit: item.ageUnit,
              businessCode: item.businessCode,
              title: title
            }
          });
        } else {
          this.$router.push({
            name: "prescDetail",
            query: {
              businessId: item.businessId,
              title: title
            }
          });
        }
      }
    }
  };
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
