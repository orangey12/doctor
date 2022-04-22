<template>
  <div class="thisCheckList">
    <navbar title="本次检验"></navbar>
    <div class="infoDiv">
      <div class="patientInfo">
        <img
          v-zlazy="info.docImg"
          class="img-width-height-lg"
          @click="openInfoMa"
        />
        <div class="userBasic">
          <li class="userName">{{ info.docName }}</li>
          <li>{{info.deptName}} &nbsp;&nbsp; {{info.docProf}}</li>
          <li>{{ info.hosName }}</li>
        </div>
      </div>
      <div class="orderInfo">
        <van-row>
          <van-col span="6">就诊人</van-col>
          <van-col span="18">{{ info.patientName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">主诉</van-col>
          <van-col span="18">{{ info.recordsTitle || '-' }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6">问诊时间</van-col>
          <van-col span="18">{{ info.signTime }}</van-col>
        </van-row>
      </div>
      <div v-if="info.lisListMVO && info.lisListMVO.length > 0">
        <div class="checkList font-size-md" v-for="(item,index) in info.lisListMVO" :key="index" @click="openDetail(item)">
          <li class="display-div">
            <u class="font-blod">检验编号：{{ item.ppiCode}}</u>
            <u class="font-login-color-red" v-if="item.status == '1' || item.status == '2' || item.status == '3' || item.status == '7' || item.status == '8' || item.status == '9'">{{item.statusName}}</u>
            <u class="font-login-color-blue" v-if="item.status == '4' || item.status == '5'">{{item.statusName}}</u>
            <u class="black-font" v-if="item.status == '0' || item.status == '6'">{{item.statusName}}</u>
          </li>
          <li class="diag">医生诊断：{{item.ppiDiag}}</li>
          <li class="font-blod">检查项</li>
          <li class="display-div " v-for="(pascItem,pascIndex) in item.lisListDVO" :key="pascIndex">
            <u>{{pascIndex + 1}}.{{pascItem.lisItemName}}-{{pascItem.sampleTypeName}}-{{pascItem.sampleBodyName}}</u>
            <u class="font-login-color-red">￥{{pascItem.cost}}</u>
          </li>
          <li style="text-align: right">合计： <span class="font-login-color-red">￥{{item.cost}}</span>
          </li>
        </div>
      </div>
      <div v-else class="emptyDiv">
        <img src="../../assets/img/cf/zdkfEmpty.png" class="emptyIcon">
        <li>暂无检验单</li>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {getProPacsList} from "../../api/check";
import {getProLisList} from "../../api/chat";

export default {
  name: "thisCheckList",
  components: {Navbar},
  data() {
    return {
      info: {},
      regId: "",
      list: [],
    }
  },
  created() {
    this.regId = this.$route.query.regId;
    this.getList();
  },
  methods: {
    openDetail(item) {
      this.$router.push({
        name: "lisDetail",
        query: {
          pliId: item.pliId
        }
      })
    },
    // 资料服务页面
    openInfoMa() {
      this.$router.push({
        name: "information",
        query: {
          patientId: this.info.patientId,
          docId: this.info.docId
        }
      });
    },
    getList() {
      getProLisList({
        regId: this.regId
      }).then(res => {
        this.info = Object.assign({}, res.data)
      })
    }
  }
}
</script>

<style scoped lang="less">


.orderCard {
  background: #ffffff;
  margin-top: 12px;
  border-radius: 4px;
  position: relative;

  .vipIcon {
    width: 27px;
    height: 27px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .van-row {
    border-bottom: 0.5px solid #EBEBEB;
    margin: 0 16px;
    padding: 13px 0;
    color: #333333;
    font-size: 14px;
  }
}

.infoDiv {
  padding: 0 16px;
}

.diag{
  padding: 12px 0;
  margin: 12px 0;
  border-top: 1px solid @back-border;
  border-bottom: 1px solid @back-border;
}

.checkList{
  background: @white;
  padding: 12px 16px;
  border-radius: 4px;
  line-height: 20px;
  margin-bottom: 12px;
  li{
    margin-top: 12px;
  }
}

.patientInfo {
  margin-top: 12px;
  background: @white;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.patientInfo {
  padding: 14px 12px;
  display: flex;
  align-items: center;

  .userBasic {
    margin-left: 12px;

    .userName {
      line-height: 22px;
      .font-blod-2;
      .font-size-lg;
    }

    .sexAge {
      display: flex;
      align-items: center;
      line-height: 16px;
      margin-top: 4px;

      span {
        .font-color-2;
        .font-size-sm;
        line-height: 16px;
      }
    }
  }
}

.checkUserInfo, .orderInfo {
  padding: 12px;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 12px;

  .van-row {
    margin-bottom: 16px;
  }

  :last-child {
    margin-bottom: 0;
  }
}

.checkObject {
  background: #ffffff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;

  .totalPrice {
    text-align: right;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
  }

  .ctDiv {
    border-bottom: 2px dashed #979797;
    padding-bottom: 12px;

    .title {
      font-weight: 500;
      color: #999999;
      font-size: 12px;
      background: #EFEFEF;
      width: 32px;
      text-align: center;
      line-height: 15px;
      border-radius: 8px;
      margin-top: 12px;
    }

    .object {
      color: #666666;
      position: relative;
      display: flex;
      line-height: 20px;
      margin-top: 12px;

      .name {
        width: 50%;
      }

      .price {
        width: 50%;
        text-align: right;
        position: relative;

        img {
          width: 16px;
          height: 16px;
          position: absolute;
          right: 0px;
          top: -8px;
        }
      }
    }
  }

  .listDiv {
    :last-child {
      border: none;
    }
  }

}
</style>
