<template>
  <div>
     <navbar title="不通过理由"></navbar>
    <div class="addPre">
      <div class="diagnosis">
        <span class="line">不通过理由</span>
        <div class="selectOpt" v-for="(item,index) in list" :key="index">
          <div v-if="show == true">
            <ul>
              <li>
                <u>类型： {{item.duptName}}</u>
              </li>
              <li v-if="item.checkMemo">
                <u>备注： {{item.checkMemo}}</u>
              </li>
              <li class="mb0" v-if="item.itemName">
                <u>药品： {{item.itemName}}</u>
              </li>
            </ul>
          </div>
        </div>
        <div class="notSelect" @click="addReason">
          <img src="../../assets/img/cf/addcf.png" class="addZdIcon icon-width-height-sm" />
          <span>添加理由</span>
        </div>
      </div>
    </div>
    <div class="bottomBtn" @click="save">
      <button class="publicBtn">提交</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { saveNotPassCheckPrescription } from "@/api/judge";
import myJsTools from "../../utils/myJsTools";
import {Toast} from "vant";
export default {
  components: { Navbar },
  name:"noPass",
  data() {
    return {
      list: [],
      query:null,
      show:false,
    };
  },
  created() {
    this.query = this.$route.query;
    this.show = this.query.show;
    this.addEvent();
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "noPass"
    });
  },
  mounted() {},
  methods: {
    addEvent(){
      let me = this;
      api.addEventListener(
        {
          name: "closePass"
        },
        function(ret, err) {
          console.log(JSON.stringify(ret) + "不通过理由");
            me.list = ret.value.list;
            console.log(JSON.stringify(me.list)+"不通过列表")
          me.show = ret.value.show;
        }
      );
    },
    addReason() {
      this.$router.push({
        name: "noPassChoose",
        query: {
          businessId: this.query.businessId,
          businessCode: this.query.businessCode,
          list: this.list
        }
      });
    },
    save() {
      if(this.list.length == 0){
        Toast("请选择不通过理由");
        return;
      }
      let param = {
        checkStatus: 0,
        businessCode: this.query.businessCode,
        businessId: this.query.businessId,
        checkUserId: myJsTools.getItem("token_info").userId,
        checkUserName: myJsTools.getItem("token_info").docName,
        details: this.list
      };
      console.log(param);
      saveNotPassCheckPrescription(param).then(res => {
        console.log("不通过信息", res);
        this.$store.commit("UPDATE_KEEP_ALIVE", {
          keepAlive: "noPass",
          type:1
        });
        this.$router.go(-2);
      });
    }
  }
};
</script>

<style scoped lang="less">

.addPre {
  background: @page-back;
  padding: 12px 11px;
  height: 76vh;
  overflow: scroll;

  .diagnosis {
    background: @white;
    padding: 9px 16px 21px 16px;
    text-align: left;
    .black-font;
    .font-size-md;
    border-radius: 4px;
    line-height: 20px;
    .line {
      border-left: 3px solid @blue;
      padding-left: 8px;
    }

    .notSelect {
      .font-login-color-blue;
      .font-size-md;
      .font-blod-3;
      line-height: 20px;
      margin-top: 10px;
      text-align: center;
      vertical-align: middle;

      .addZdIcon {
        margin-left: 6px;
        display: inline-block;
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
      }
    }
    .selectOpt {
      margin: 12px 0;
      background: @chat-light;
      padding: 12px;
      li {
        margin-bottom: 8px;
      }
      .mb0 {
        margin-bottom: 0;
      }
    }
  }
}
</style>
