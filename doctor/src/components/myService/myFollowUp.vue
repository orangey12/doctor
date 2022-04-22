<template>
  <div class="myFollowUp">
    <navbar title="我的复诊"></navbar>
    <div class="settingDiv" v-if="hosToDocSwitch == '1'">
      <li class="switchService">
        <u>是否开启自定义</u>
        <u>
          <van-switch v-model="checked" size="30px" @change="changeSwitch"/>
        </u>
      </li>
      <div v-if="checked">
        <div class="picText">
          <li class="titleTips">
            <span class="line"></span><span>图文</span>
          </li>
          <li class="priceSer">
            <u> 服务价格</u>
            <u @click="selectPrice('0')" class="font-login-color-blue">
              <span>{{priceInfo.twPrice}}
              <span v-if="priceInfo.twPrice !='免费'">元</span></span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
          <li class="timeSer">
            <u> 服务时间上限</u>
            <u @click="selectTime('0')" class="font-login-color-blue">
              <span>{{priceInfo.twTimeUpper}}</span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
        </div>
        <div class="picText">
          <li class="titleTips">
            <span class="line"></span><span>语音</span>
          </li>
          <li class="priceSer">
            <u> 服务价格</u>
            <u @click="selectPrice('1')" class="font-login-color-blue">
              <span>{{priceInfo.yyPrice}} <span v-if="priceInfo.yyPrice !='免费'">元</span></span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
          <li class="timeSer ">
            <u> 服务时间上限</u>
            <u @click="selectTime('1')" class="font-login-color-blue">
              <span>{{priceInfo.yyTimeUpper}}</span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
        </div>
        <div class="picText">
          <li class="titleTips">
            <span class="line"></span><span>视频</span>
          </li>
          <li class="priceSer">
            <u> 服务价格</u>
            <u @click="selectPrice('2')" class="font-login-color-blue">
              <span >{{priceInfo.spPrice}} <span v-if="priceInfo.spPrice !='免费'">元</span></span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
          <li class="timeSer">
            <u> 服务时间上限</u>
            <u @click="selectTime('2')" class="font-login-color-blue">
              <span>{{priceInfo.spTimeUpper}}</span>
              <span><img src="../../assets/img/my/down_1.png" class="downIcon"></span>
            </u>
          </li>
        </div>
        <div class="picText">
          <li class="titleTips">
            <span class="line"></span><span>提示</span>
          </li>
          <div class="tips">
            您可自定义您关于复诊问诊相关服务的信息，自定义后，将以您的自定义信息为准，医院修改，对您的自定义信息不产生影响
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBtn" @click="saveAdvisory" v-if="hosToDocSwitch == '1'">
      <button class="publicBtn">保存</button>
    </div>
    <div v-if="hosToDocSwitch == '0'" class="emptyDiv">
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
    <van-popup v-model="showSelectTime" position="bottom">
      <van-picker
        show-toolbar
        :columns="twTime"
        @confirm="onTimeConfirm"
        @cancel="showSelectTime = false"
      />
    </van-popup>
    <van-popup v-model="showSelectTwTime" position="bottom">
      <van-picker
        show-toolbar
        :columns="ysTime"
        @confirm="onTimeConfirm"
        @cancel="showSelectTwTime = false"
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
    <van-popup v-model="showOnerTime" position="bottom" class="bottom-popup">
      <li class="title">自定义时长</li>
      <van-field
        v-model="time"
        type="number"
        placeholder="请输入时长"
        maxlength="6"
        show-word-limit
      />
      <li class="limitBtn">
        <span>2-6个数字  单位：<span v-if="type == '0'">小时</span><span v-else>分钟</span></span>
        <div>
          <button class="cancelBtn" @click="showOnerTime = false">取消</button>
          <button class="sureBtn" @click="saveTime">完成</button>
        </div>
      </li>
    </van-popup>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {changeDocSwitch, getTwoSwitchAndPrice, saveDicCustomBusiness} from "../../api/set";
  import myJsTools from "../../utils/myJsTools";
  import {getSysCodeByType} from "../../api/scale";
  import {Toast} from "vant";

  export default {
    name: "myFollowUp",
    components: {Navbar},
    data() {
      return {
        checked: false,
        docId: "",
        price: "",
        time: "",
        hosToDocSwitch: '0',
        docSwitch: "0",
        priceInfo: {},
        priceList: [],
        timeList: [],
        showSelectPrice: false,
        showSelectTwTime: false,
        showSelectTime: false,
        twPrice: [],
        twTime: [],//图文时长
        ysTime: [],//语音视频时长
        type: 0,
        showOnerInfo: false,
        showOnerTime: false,
      }
    },
    created() {
      this.docId = myJsTools.getItem("token_info").docId;
      this.getInfo();
      this.getTopType();
    },
    methods: {
      //  保存自定义复诊设置
      saveAdvisory() {
        if (this.checked) {
          let param = this.priceInfo;
          if (param.twPrice == "免费") {
            param.twPrice = 0;
          }
          if (param.yyPrice == "免费") {
            param.yyPrice = 0;
          }
          if (param.spPrice == "免费") {
            param.spPrice = 0;
          }
          param.docId = this.docId;
          param.bussType = '1'
          saveDicCustomBusiness(param).then(res => {
            Toast("保存成功");
            this.$router.go(-1);
          })
        }

      },
      //选择价格
      selectPrice(type) {
        this.showSelectPrice = true;
        this.type = type;
      },
      selectTime(type) {
        if (type == '1' || type == '2') {
          this.showSelectTwTime = true;
        } else {
          this.showSelectTime = true;
        }
        this.type = type;
      },
      //选择时间
      onTimeConfirm(val) {
        this.showSelectTwTime = false;
        this.showSelectTime = false;
        if (val != "自定义输入") {
          if (this.type == '0') {
            this.priceInfo.twTimeUpper = val;
          }
          if (this.type == '1') {
            this.priceInfo.yyTimeUpper = val;
          }
          if (this.type == '2') {
            this.priceInfo.spTimeUpper = val;
          }
          this.priceInfo = Object.assign({}, this.priceInfo)
        } else {
          this.showOnerTime = true;
        }
      },
      //保存自定义价格
      savePrice() {
        if (this.price < 0) {
          Toast("请输入正确的价格");
          return
        } else {
          let reg = /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
          if (!reg.test(this.price)) {
            Toast("请输入两位小数的价格");
            return
          }
        }
        if (this.type == '0') {
          this.priceInfo.twPrice = this.price;
        }
        if (this.type == '1') {
          this.priceInfo.yyPrice = this.price;
        }
        if (this.type == '2') {
          this.priceInfo.spPrice = this.price;
        }

        this.priceInfo = Object.assign({}, this.priceInfo)
        this.showOnerInfo = false;
        this.price = '';
      },
      //保存自定义时长
      saveTime() {
        if (this.time) {
          let reg = /^[1-9]\d*$/;
          if (!reg.test(this.time)) {
            Toast("请输入大于0的整数");
            return;
          }
        } else {
          Toast("请输入时常");
          return;
        }
        if (this.type == '0') {
          this.priceInfo.twTimeUpper = this.time + "小时";
        }
        if (this.type == '1') {
          this.priceInfo.yyTimeUpper = this.time + "分钟";
        }
        if (this.type == '2') {
          this.priceInfo.spTimeUpper = this.time + "分钟";
        }
        this.priceInfo = Object.assign({}, this.priceInfo)
        this.showOnerTime = false;
        this.time = '';
      },
      //选择价格
      onPriceConfirm(val) {
        this.showSelectPrice = false;
        if (val != "自定义输入") {
          if (this.type == '0') {
            this.priceInfo.twPrice = val;
          }
          if (this.type == '1') {
            this.priceInfo.yyPrice = val;
          }
          if (this.type == '2') {
            this.priceInfo.spPrice = val;
          }
          this.priceInfo = Object.assign({}, this.priceInfo)
        } else {
          this.showOnerInfo = true;
        }
      },
      //修改开关
      changeSwitch(val) {
        let param = {
          bussType: '1',
          docId: this.docId,
          docSwitch: 1,
        }
        if (JSON.stringify(this.priceInfo) != '{}') {
          param.dataVo = this.priceInfo;
          if (param.dataVo.twPrice == "免费") {
            param.dataVo.twPrice = 0;
          }
          if (param.dataVo.yyPrice == "免费") {
            param.dataVo.yyPrice = 0;
          }
          if (param.dataVo.spPrice == "免费") {
            param.dataVo.spPrice = 0;
          }
        }
        if (val) {
          changeDocSwitch(param).then(res => {
            this.getInfo();
          })
        } else {
          changeDocSwitch({
            bussType: '1',
            docId: this.docId,
            docSwitch: 0
          }).then(res => {
            console.log(res);
          })
        }
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
        //时间上限 图文
        getSysCodeByType({
          codeType: "006"
        }).then(res => {
          this.timeList = res.data;
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            this.twTime.push(ele.meaning);
          }
        });
        //时间上限  语音视频
        getSysCodeByType({
          codeType: "007"
        }).then(res => {
          this.timeList = res.data;
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            this.ysTime.push(ele.meaning);
          }
        });
      },
      getInfo() {
        getTwoSwitchAndPrice({
          bussType: "1",
          docId: this.docId,
        }).then(res => {
          console.log(res);
          this.hosToDocSwitch = res.data.hosToDocSwitch;
          this.docSwitch = res.data.docSwitch;
          let data = res.data.dataVo;
          if (data.twPrice == 0) {
            data.twPrice = "免费";
          }
          if (data.yyPrice == 0) {
            data.yyPrice = "免费";
          }
          if (data.spPrice == 0) {
            data.spPrice = "免费";
          }
          this.priceInfo = data;
          if (res.data.docSwitch == '1') {
            this.checked = true;
          } else {
            this.checked = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">


  .settingDiv {
    padding: 12px 16px 60px 16px;

    .downIcon {
      .icon-width-height-sm;
      margin-left: 10px;
    }

    .switchService {
      .display-div;
      padding: 12px 15px;
      .black-font;
      .font-size-md;
      background: @white;
      line-height: 20px;
      border-radius: 8px;
    }

    .picText {
      background: @white;
      padding: 15px 15px 0px 15px;
      margin-top: 12px;
      border-radius: 8px;

      .priceSer, .timeSer {
        .display-div;
        padding: 15px 0;
        .font-size-md-2;

        u:last-child {
          display: flex;
          align-items: center;
        }
      }

      .priceSer {
        border-bottom: 0.5px solid @back-border;
      }

      .tips {
        padding: 15px 0;
      }
    }
  }
</style>
