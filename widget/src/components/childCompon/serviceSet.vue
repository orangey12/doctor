<template>
    <div class="serviceSet">
      <div class="settingDiv" v-if="docSwitch =='1'">
        <li class="switchService">
          <u>是否开启自定义</u>
          <u><van-switch v-model="checked" size="30px" @change="changeSwitch"/></u>
        </li>
        <div v-if="checked">
          <div class="picText">
            <li class="title titleTips">
              <span class="line"></span><span>图文</span>
            </li>
            <li class="priceSer">
              <u> 服务价格</u>
              <u @click="selectPrice('0')" class="font-login-color-blue">
                <span>{{imgTextPrice}}<span v-if="imgTextPrice !='免费'">元</span></span>
                <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
              </u>
            </li>
          </div>
          <div class="picText">
            <li class="title titleTips">
              <span class="line"></span><span>语音</span>
            </li>
            <li class="priceSer">
              <u> 服务价格</u>
              <u @click="selectPrice('1')" class="font-login-color-blue">
                <span>{{voicePrice}}<span v-if="voicePrice !='免费'">元</span></span>
                <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
              </u>
            </li>
          </div>
          <div class="picText">
            <li class="title titleTips">
              <span class="line"></span><span>视频</span>
            </li>
            <li class="priceSer">
              <u> 服务价格</u>
              <u @click="selectPrice('2')" class="font-login-color-blue">
                <span>{{videoPrice}}<span v-if="videoPrice !='免费'">元</span></span>
                <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
              </u>
            </li>
          </div>
          <div class="picText">
            <li class="title titleTips">
              <span class="line"></span><span>提示</span>
            </li>
            <div class="tips" v-if="active == 0">
              您可自定义您关于咨询问诊相关服务的信息，自定义后，将以您的自定义信息为准，医院修改，对您的自定义信息不产生影响
            </div>
            <div class="tips" v-if="active == 1">
              您可自定义您关于复诊问诊相关服务的信息，自定义后，将以您的自定义信息为准，医院修改，对您的自定义信息不产生影响
            </div>
          </div>
        </div>
        </div>
      <div class="bottomBtn" @click="saveAdvisory" v-if="docSwitch == '1'">
        <button class="publicBtn">保存</button>
      </div>
      <div v-if="docSwitch == '0'" class="emptyDiv">
        <img src="../../assets/img/my/qx.png" class="noneQx">
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
    import myJsTools from "../../utils/myJsTools";
    import {
      getPersonalityInfo,
      savePersonalitySwitchInfo,
      updatePersonalityPriceInfo,
      updatePersonalitySwitchInfo
    } from "../../api/set";
    import {getSysCodeByType} from "../../api/scale";
    import {Toast} from "vant";

    export default {
      props:{
        active:{
          default:0
        }
      },
        name: "serviceSet",
      data(){
        return{
          checked:false,
          personalitySwitch:"0",
          docSwitch:"0",
          imgTextPrice:0,
          videoPrice:0,
          voicePrice:0,
          showSelectPrice:false,
          showOnerInfo:false,
          twPrice:[],
          price:"",

        }
      },
      created() {
        this.docId = myJsTools.getItem("token_info").docId;
        this.patientId = myJsTools.getItem("patientInfo").patientId;
        this.getPriceInfo();
        this.getTopType();
      },
      methods:{
        //  保存自定义咨询设置
        saveAdvisory(){
          let bussType;
          if(this.active == 0){
            bussType = "0"
          }else{
            bussType = '1'
          }
          if(this.imgTextPrice == '免费'){
            this.imgTextPrice = 0
          }
          if(this.videoPrice == '免费'){
            this.videoPrice = 0
          }
          if(this.voicePrice == '免费'){
            this.voicePrice = 0
          }
          updatePersonalityPriceInfo({
            patientId:this.patientId,
            docId:this.docId,
            bussType:bussType,
            imgTextPrice:this.imgTextPrice,
            videoPrice:this.videoPrice,
            voicePrice:this.voicePrice
          }).then(res=>{
            console.log(res);
            this.$router.go(-1);
          })
        },
        //选择价格
        selectPrice(type){
          this.showSelectPrice = true;
          this.type = type;
        },
        //获取价格列表字典
        getTopType(){
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
        //选择价格
        onPriceConfirm(val){
          this.showSelectPrice = false;
          if(val != "自定义输入"){
            if(this.type == '0'){
              this.imgTextPrice = val;
            }
            if(this.type == '1'){
              this.voicePrice = val;
            }
            if(this.type == '2'){
              this.videoPrice = val;
            }
          }else{
            this.showOnerInfo = true;
          }
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
          if (this.type == '0') {
            this.imgTextPrice = this.price;
          }
          if (this.type == '1') {
            this.voicePrice = this.price;
          }
          if (this.type == '2') {
            this.videoPrice = this.price;
          }
          this.showOnerInfo = false;
          this.price = '';
        },
       // 获取咨询复诊信息
       getPriceInfo(){
          let bussType;
          if(this.active == 0){
           bussType = "0"
         }else{
           bussType = '1'
         }
         getPersonalityInfo({
           patientId:this.patientId,
           docId:this.docId,
           bussType:bussType
         }).then(res=>{
           console.log(res);
           let data = res.data;
           this.docSwitch = data.docSwitch;
           this.personalitySwitch = data.personalitySwitch;
           if(data.imgTextPrice == 0){
             this.imgTextPrice = "免费"
           }else{
             this.imgTextPrice = data.imgTextPrice;
           }
           if(data.videoPrice == 0){
             this.videoPrice = "免费"
           }else{
             this.videoPrice = data.videoPrice;
           }
           if(data.voicePrice == 0){
             this.voicePrice = "免费"
           }else{
             this.voicePrice = data.voicePrice;
           }
           if(data.personalitySwitch == '1'){
             this.checked = true;
           }else{
             this.checked = false;
           }
         })
       },
        changeSwitch(){
          let bussType;
          if(this.active == 0){
            bussType = "0"
          }else{
            bussType = '1'
          }
          if(this.checked){
            savePersonalitySwitchInfo({
              patientId:this.patientId,
              docId:this.docId,
              bussType:bussType,
              isEnabled:'1'
            }).then(res=>{
              console.log(res);
              let data = res.data;
              if(data.imgTextPrice == 0){
                this.imgTextPrice = "免费"
              }else{
                this.imgTextPrice = data.imgTextPrice;
              }
              if(data.videoPrice == 0){
                this.videoPrice = "免费"
              }else{
                this.videoPrice = data.videoPrice;
              }
              if(data.voicePrice == 0){
                this.voicePrice = "免费"
              }else{
                this.voicePrice = data.voicePrice;
              }
            })
          }
          if(!this.checked){
            updatePersonalitySwitchInfo({
              patientId:this.patientId,
              docId:this.docId,
              bussType:bussType,
              isEnabled:'0'
            }).then(res=>{
              console.log(res);
            })
          }
        }
      }
    }
</script>

<style scoped lang="less">

  .settingDiv{
    padding: 12px 16px 60px 16px;
    .downIcon{
     .icon-width-height-sm;
      margin-left: 10px;
    }
    .switchService{
      .display-div;
      .black-font;
      .font-size-md;
      padding: 12px 15px;
      background: @white;
      line-height: 20px;
      border-radius: 8px;
      align-items: center;
    }
    .picText{
      background: @white;
      padding: 15px 15px 0px 15px;
      margin-top: 12px;
      border-radius: 8px;
      .title{
        .black-font;
        .font-size-md-2;
        .font-blod-2;
        display: flex;
        align-items: center;
        .line{
          display: inline-block;
          background: @blue;
          width: 3px;
          height: 14px;
          border-radius: 1px;
          margin-right: 10px;
        }
      }
      .priceSer,.timeSer{
        .display-div;
        .font-size-md;
        padding: 15px 0;
        u:first-child{
          .black-font;
          width: 70%;
        }
        u:last-child{
          display: flex;
          align-items: center;
        }
      }
      .tips{
        padding: 15px 0;
      }
    }
  }
  .emptyDiv{
    margin: 20px auto 0;
    text-align: center;
    .font-login-color;
    .font-size-md;
    .noneQx{
      .emptyIcon;
      margin-top: 100px;
    }
  }
</style>
