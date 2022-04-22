<template>
  <div>
    <navbar title="处方预览"></navbar>
    <div class="preDiv">
      <div v-for="(item,index) in medicineList" class="cfList" :key="index">
        <li class="title">
          <u class="rp">Rp</u>
          <u class="cfType">西药处方</u>
        </li>
        <div class="oneCfCard" v-for="(once, index1) in item" :key="index1">
          <li class="drugName display-div">
            <u>{{ index1 + 1 }}.{{ once.drugName }}({{ once.gg }})</u>
            <u class="font-blod">x{{once.sendNum}}</u>
          </li>
          <li class="dduName">用法：{{ once.dduName }}、{{ once.ddufName }}</li>
        </div>
      </div>
      <div v-for="(itemFood,indexFood) in foodList" class="cfList" :key="indexFood + 'indexFood'">
        <li class="title">
          <u class="rp">Rp</u>
          <u class="cfType">食品级</u>
        </li>
        <div class="oneCfCard" v-for="(onceFood, index1Food) in itemFood" :key="index1Food + 'index1Food'">
          <li class="drugName display-div">
            <u>{{ index1Food + 1 }}.{{ onceFood.drugName }}({{ onceFood.gg }})</u>
            <u class="font-blod">x{{onceFood.sendNum}}</u>
          </li>
          <li class="dduName">用法：{{ onceFood.dduName }}、{{ onceFood.ddufName }}</li>
        </div>
      </div>

      <div v-for="(itemHre,indexHre) in herbList" class="cfList" :key="indexHre + 'indexHre'">
        <li class="title">
          <u class="rp">Rp</u>
          <u class="cfType">草药处方</u>
        </li>
        <div
          class="oneCfCard"
          v-for="(onceHer, indexHer1) in itemHre"
          :key="'her' + indexHer1"
        >
          <li class="drugName display-div">
            <u>{{ indexHer1 + 1 }}.{{ onceHer.drugName }}({{ onceHer.jldw }})</u>
            <u class="font-blod">x{{onceHer.sendNum}}</u>
          </li>

        </div>
        <li class="dduName">用法：{{ herbArr[indexHre].dduName }}，日{{
          herbArr[indexHre].rj
          }}剂，日{{ herbArr[indexHre].rc }}次，用药{{
          herbArr[indexHre].day
          }}天</li>
        <li style="text-align: right;margin-top: 14px;">共{{herbArr[indexHre].pay}}付</li>
      </div>
      <div
        class="emptyDiv"
        v-if="medicineList.length == 0 && herbList.length == 0"
      >
        <img src="../../assets/img/cf/zdkfEmpty.png" class="zdkfEmpty" />
        <li>您暂未添加信息，赶快添加吧</li>
      </div>
    </div>

  </div>
</template>

<script>
  import Navbar from "../../common/navbar";

  export default {
    name: "prescriptionPreview",
    components: {Navbar},
    data() {
      return {}
    },
    computed: {
      //西药处方
      medicineList() {
        return this.$store.getters.getMedicineList;
      },
      //草药处方
      herbList() {
        return this.$store.getters.getHerbList;
      },
      //草药处方
      foodList() {
        return this.$store.getters.getFoodList;
      },
      //草药处方
      herbArr() {
        return this.$store.getters.getHerbArr;
      }
    },
    created() {

    },
    methods: {}
  }
</script>

<style scoped lang="less">


  .preDiv {
    padding: 16px;
  }

  .cfList {
    background: @white;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;

    .title {
      display: flex;
      line-height: 22px;
      padding: 0 14px;
      justify-content: space-between;
      color: #333;
      font-weight: 600;

      .rp {
        width: 70%;
        text-align: left;
        .font-size-md;
        .div-overflow;
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
      .black-font;

      .drugName {
        font-weight: 600;
        margin-top: 10px;
      }

    }
    .dduName {
      margin-top: 7px;
      padding-left: 12px;
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
  .emptyDiv {
    text-align: center;
    font-size: 13px;
    color: #999999;
    margin-top: 40px;
    img {
      display: inline-block;
      margin-bottom: 17px;
      width: 193px;
      height: 162px;
    }
  }
</style>
