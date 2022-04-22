<template>
  <div class="noPassChoose">
    <navbar title="不通过理由"></navbar>
    <div style="position: relative">
      <van-field
        readonly
        clickable
        label="不合理类别"
        :value="unReasonType"
        placeholder="请选择类别"
        @click="showPicker = true"
      />
      <img class="img icon-width-height-sm-16" src="@/assets/img/my/down.png" alt />
    </div>
    <van-field
      v-model="remark"
      rows="2"
      autosize
      label="备注"
      type="textarea"
      maxlength="50"
      placeholder="请输入备注"
    />
    <div class="diagnosis" v-if="show">
      <span class="line">选择药品</span>
      <div class="diagsTitle" v-for="(item,index) in info" :key="index">
        <span class="left">Rp</span>
        <span class="fr" v-if="info[index].prescriptionType == 1">西药方</span>
        <span class="fr" v-if="info[index].prescriptionType == 3">草药方</span>
        <span class="fr" v-if="info[index].prescriptionType == 4">食品级</span>
        <van-checkbox-group v-model="xyList" v-if="info[index].prescriptionType == 1 || info[index].prescriptionType == 4">
          <van-checkbox
            class="checkbox"
            v-for="(item,index) in item.checkPreDrugDVOs"
            :key="index"
            @click="hasClick(item)"
            v-model="isChecked"
            :name="item.itemName"
          >
            <li class="groupName">
              {{index + 1}}.{{item.itemName}}
              <span v-if="item.gg !== null">（{{item.gg}}）</span>
            </li>
          </van-checkbox>
        </van-checkbox-group>
        <van-checkbox-group v-model="cyList" v-if="info[index].prescriptionType == 3">
          <van-checkbox
            class="checkbox"
            v-for="(item,index) in item.checkPreDrugDVOs"
            :key="index"
            @click="hasClick(item)"
            v-model="isChecked"
            :name="item.itemName"
          >
            <li class="groupName">
              {{index + 1}}.{{item.itemName}}
              <span v-if="item.gg !== null">（{{item.gg}}）</span>
            </li>
          </van-checkbox>
        </van-checkbox-group>
        <van-divider />
      </div>
    </div>
    <div class="bottomBtn" @click="confirm">
      <button class="publicBtn">确定</button>
    </div>
    <!-- 不合理类别弹框 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  saveNotPassCheckPrescription,
  getUnreasonableType,
  getCheckPreDrugList
} from "@/api/judge";
import myJsTools from "../../utils/myJsTools";
import { Toast } from "vant";
export default {
  components: { Navbar },
  data() {
    return {
      show: false, // 药品展示
      unReasonType: "", // 不合理类别
      unReasonCode: "", // 不合理类别code
      columns: [], // 不合理选项
      duptCode: [],
      showPicker: false,
      remark: "", // 备注
      isChecked: false,
      xyList: [], // 西药
      cyList: [], // 草药
      diagsList: [], // 待煎药
      itemName: [],
      info: [],
      diagsName: ""
    };
  },
  created() {
    this.getType();
    this.getDiagsList();
    console.log(this.$route.query);
  },
  methods: {
    hasClick(item, index) {
      item.isChecked = !item.isChecked;
      if (item.isChecked) {
        this.itemName.push(item.itemName);
        console.log(this.itemName);
      } else {
        if (this.itemName.length > 0) {
          this.itemName.splice(1,0);
          console.log(this.itemName);
        }
      }
    },
    // 类型确定
    onConfirm(item, value) {
      // console.log(item);
      this.unReasonType = item;
      this.unReasonCode = this.duptCode[value];
      this.showPicker = false;
      if (
        this.unReasonType == "" ||
        this.unReasonCode == "01" ||
        this.unReasonCode == "08" ||
        this.unReasonCode == "10"
      ) {
        this.show = false;
      } else {
        this.show = true;
      }
    },
    // 确定
    confirm() {
      if (this.unReasonType !== "") {

          if (this.show == false) {
            this.itemName = [];
          }
        this.itemName = [];
        this.itemName = this.itemName.concat(this.cyList);
        this.itemName = this.itemName.concat(this.xyList);
        console.log(this.itemName)
          let param = {
            checkStatus: 0,
            businessCode: this.$route.query.businessCode,
            businessId: this.$route.query.businessId,
            checkUserId: myJsTools.getItem("token_info").userId,
            checkUserName: myJsTools.getItem("token_info").docName,
            details: [
              {
                duptName: this.unReasonType,
                checkMemo: this.remark,
                duptCode: this.unReasonCode,
                itemName: this.itemName.join(",")
              }
            ]
          };
          if (this.$route.query.list) {
            param.details = param.details.concat(this.$route.query.list);
          } else {
          }
          this.$store.commit("setNoPassList", param);
          api.sendEvent({
            name: "closePass",
            extra: {
              list: param.details,
              show: true
            }
          });
          this.$router.go(-1);
      } else {
        Toast("请选择不合理类别");
        return;
      }
    },
    // 不合理类型
    getType() {
      getUnreasonableType().then(res => {
        // console.log("不合理类型", res);
        for (var i = 0; i < res.data.length; i++) {
          this.columns.push(res.data[i].duptName);
          this.duptCode.push(res.data[i].duptCode);
        }
      });
    },
    // 药品列表
    getDiagsList() {
      getCheckPreDrugList({
        businessId: myJsTools.getItem("patientInfo").businessId
      }).then(res => {
        // console.log("药品列表", res);
        this.info = res.data;
        if (res.data) {
          this.show = true;
        }
        if (this.unReasonType == "") {
          this.show = false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">

.noPassChoose {
  .black-font;
  .img {
    position: absolute;
    top: 11px;
    right: 20px;
  }
  .diagnosis {
    width: 90%;
    margin: 0 10px;
    background: @white;
    padding-top: 16px;
    padding-left: 16px;
    border-radius: 5px;
    .line {
      .font-size-md;
      border-left: 3px solid @blue;
      padding-left: 8px;
    }
    .checkbox {
      margin-top: 15px;
    }
    .van-divider {
      padding-right: 9px;
      color: @back-border;
    }
    .diagsTitle {
      margin-top: 12px;
      .font-size-md;
      .fr {
        margin-right: 16px;
      }
    }
  }
  .van-cell {
    width: 95%;
    margin: 15px auto 12px;
    border-radius: 5px;
  }
}
</style>
