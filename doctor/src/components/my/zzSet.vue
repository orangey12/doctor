<template>
  <div class="zzSet">
    <navbar title="转诊设置"></navbar>
    <div class="setDiv" v-if="hosSwitch == '1'">
      <li class="openLi">
        <u>
          <span>转诊接收</span>
          <span class="tips">开启转诊将允许其他医生将患者转诊给你</span>
        </u>
        <u><van-switch v-model="checked" size="24px" @change="changeSwitch"/></u>
      </li>
      <li v-if="checked">
        <van-field v-model="referralPrice" disabled @click="showSelectPrice=true" type="number" label="转诊金额" placeholder="请设置金额"/>
      </li>
    </div>
    <div class="bottomBtn" @click="confirm" v-if="hosSwitch == '1'">
      <button class="publicBtn">保存</button>
    </div>
    <div v-if="hosSwitch == '0'" class="emptyDiv">
      <img src="../../assets/img/my/qx.png" class="noneQx emptyIcon">
      <li>暂无设置权限</li>
    </div>
    <van-popup v-model="showSelectPrice" position="bottom">
      <van-picker
        show-toolbar
        :columns="twPrice"
        @confirm="onPriceConfirm"
        @cancel="showSelectPrice = false"
      />
    </van-popup>
    <van-popup v-model="showOnerInfo" position="bottom" class="bottom-popup">
      <li class="title">自定义价格</li>
      <van-field
        v-model="price"
        type="number"
        placeholder="请输入自定义价格（0~99999.99）"
      />
      <li class="limitBtn">
        <span>2-6个数字</span>
        <div>
          <button class="cancelBtn" @click="showOnerInfo = false">取消</button>
          <button class="sureBtn" @click="savePrice">完成</button>
        </div>
      </li>
    </van-popup>
  </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import myJsTools from "../../utils/myJsTools";
    import {
      getReferralInfo,
      saveReferralSwitchInfo,
      updateReferralPriceInfo,
      updateReferralSwitchInfo
    } from "../../api/set";
    import {getSysCodeByType} from "../../api/scale";
    import {Toast} from "vant";
    export default {
        name: "zzSet",
      components: {Navbar},
      data(){
          return{
            checked:false,
            referralPrice:"",
            hosSwitch:"0",
            docSwitch:'0',
            twPrice:[],
            priceList:[],
            price:"",
            showOnerInfo:false,
            showSelectPrice:false,
          }
      },
      created() {
          this.getzzInfo();
          this.getTopType();
      },
      methods:{
          getzzInfo(){
            getReferralInfo({
              docId:myJsTools.getItem("token_info").docId
            }).then(res=>{
              console.log(res);
              this.hosSwitch = res.data.hosSwitch;
              this.docSwitch = res.data.docSwitch;
              this.referralPrice = res.data.referralPrice;
              if(res.data.docSwitch == '1'){
                this.checked = true;
              }else{
                this.checked = false;
              }
            })
          },
        //获取时间价格
        getTopType() {
          //服务价格
          getSysCodeByType({
            codeType: "005"
          }).then(res => {
            this.priceList = res.data;
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              const ele = data[i];
              this.twPrice.push(ele.meaning);
            }
          });
          },
        //保存自定义价格
        savePrice(){
          if(this.price < 0){
            Toast("请输入正确的价格");
            return
          }else{
            let reg = /(^[0-9]{1,5}$)|(^[0-9]{1,5}[\.]{1}[0-9]{1,2}$)/
          if (!reg.test(this.price)) {
            Toast("请输入0~99999.99内的数字");
            return
          }
          }
          if(this.price == 0){
            this.referralPrice = "免费"
          }
            this.referralPrice = this.price;
          this.showOnerInfo = false;
          this.price = '';
        },
        //选择价格
        onPriceConfirm(val){
          this.showSelectPrice = false;
          if(val != "自定义输入"){
            if(val == '免费'){
              this.referralPrice = 0;
            }else {
              this.referralPrice = val;
            }
          }else{
            this.showOnerInfo = true;
          }
        },
        //转诊开关
        changeSwitch(val){
            if(val){
              saveReferralSwitchInfo({
                docId: myJsTools.getItem("token_info").docId
              }) .then(res=>{
                console.log(res);
              })
            }
            if(!val){
            updateReferralSwitchInfo({
              docId: myJsTools.getItem("token_info").docId
            }).then(res=>{
              console.log(res);
            })
          }
        },
        confirm(){
            if(this.referralPrice == "免费"){
              this.referralPrice = 0
            }
          updateReferralPriceInfo({
            referralPrice:this.referralPrice,
            docId: myJsTools.getItem("token_info").docId
          }).then(res=>{
            console.log(res);
            this.$router.go(-1);
          })
        },
      }
    }
</script>

<style scoped lang="less">

.openLi{
  padding: 12px 16px;
  background: @white;
  border-bottom: 0.5px solid @back-border;
  .display-div;
  .font-size-md;
  .black-font;
  line-height: 22px;
  .tips{
    .font-color-2;
    margin-top: 3px;
  }
  span{
    display: block;
  }
}
  .setDiv{
    /deep/.van-field__control {
      text-align: right;
    }
  }
/deep/ .van-field__label{
  .font-color-2;
}
</style>
