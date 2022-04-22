<template>
  <div class="checkDetail">
    <navbar title="检验单"></navbar>
    <div class="topDiv">
      <van-steps :active="active" active-color="#1686FF" v-if="active || active == 0">
        <van-step style="width: 23%;" :class="info.addTime?'font-login-color-blue':''">
          <div>待支付</div>
          <div class="time">
            <li>{{ info.addTime.split(" ")[0] }}</li>
            <li>{{ info.addTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.payTime?'font-login-color-blue':''">
          <div>待签到</div>
          <div class="time" v-if="info.payTime">
            <li>{{ info.payTime.split(" ")[0] }}</li>
            <li>{{ info.payTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.signTime?'font-login-color-blue':''" v-if="info.lisType == '2'">
          <div>待取样</div>
          <div class="time" v-if="info.signTime">
            <li>{{ info.signTime.split(" ")[0] }}</li>
            <li>{{ info.signTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.sampleTime?'font-login-color-blue':''" v-if="info.lisType == '2'">
          <div>待配送</div>
          <div class="time" v-if="info.sampleTime">
            <li>{{ info.sampleTime.split(" ")[0] }}</li>
            <li>{{ info.sampleTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.ditributionTime?'font-login-color-blue':''"
                  v-if="info.lisType == '2'">
          <div>待签收</div>
          <div class="time" v-if="info.ditributionTime">
            <li>{{ info.ditributionTime.split(" ")[0] }}</li>
            <li>{{ info.ditributionTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.signTime?'font-login-color-blue':''" v-if="info.lisType == '1'">
          <div>待检验</div>
          <div class="time" v-if="info.signTime">
            <li>{{ info.signTime.split(" ")[0] }}</li>
            <li>{{ info.signTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.receiveTime?'font-login-color-blue':''" v-if="info.lisType == '2'">
          <div>待检验</div>
          <div class="time" v-if="info.receiveTime">
            <li>{{ info.receiveTime.split(" ")[0] }}</li>
            <li>{{ info.receiveTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 23%;" :class="info.verificationTime?'font-login-color-blue':''">
          <div>等待上传</div>
          <div class="time" v-if="info.verificationTime">
            <li>{{ info.verificationTime.split(" ")[0] }}</li>
            <li>{{ info.verificationTime.split(" ")[1] }}</li>
          </div>
        </van-step>
        <van-step style="width: 34%;text-align: left" :class="info.uploadReportTime?'font-login-color-blue':''">
          <div>已出报告</div>
          <div class="time" style="text-align: left" v-if="info.uploadReportTime">
            <li>{{ info.uploadReportTime.split(" ")[0] }}</li>
            <li>{{ info.uploadReportTime.split(" ")[1] }}</li>
          </div>
        </van-step>
      </van-steps>
    </div>
    <div class="infoDiv">
      <div class="checkTopInfo black-font font-size-md-2">
        <li class="display-div">
          <u>检验单号：{{ info.ppiCode }}</u>
          <u class="font-login-color-red" v-if="info.status == 6">已退费</u>
          <u class="font-login-color-red" v-if="info.status == 0">已失效</u>
        </li>
        <li class="hosName">医院名称：{{ info.hosName }}</li>
      </div>
      <div class="checkUserInfo">
        <div class="userInfo">
          <li>{{ info.patientName }}</li>
          <li class="sex">{{ info.sex }}</li>
          <li class="age">{{ info.age }}{{ info.ageUnit }}</li>
        </div>
        <li class="docInfoLi">开单医生：{{ info.docName }}</li>
        <li class="docInfoLi">医生科室：{{ info.deptName }}</li>
        <li class="docInfoLi">临床诊断：{{ info.ppiDiag }}</li>
        <li class="docInfoLi" v-if="info.appointTime">预约时间：{{ info.appointTime }}</li>
      </div>
    </div>
    <div class="infoDiv" v-if="info.status == 6">
      <van-steps direction="vertical" active-color="#1686FF" :active="3">
        <van-step>
          <li class="display-div">
            <u class="font-login-color-blue">{{ info.returnTime }}</u>
            <u>患者退费</u>
          </li>
        </van-step>
        <van-step>
          <li class="display-div">
            <u class="font-login-color-blue">{{ info.payTime }}</u>
            <u>患者支付</u>
          </li>
        </van-step>
        <van-step>
          <li class="display-div">
            <u class="font-login-color-blue">{{ info.addTime }}</u>
            <u>医生开检验单</u>
          </li>
        </van-step>
      </van-steps>
    </div>
    <div class="infoDiv" v-if="info.status == 0">
      <van-steps direction="vertical" active-color="#1686FF" :active="2">
        <van-step>
          <li class="display-div">
            <u class="font-login-color-blue">{{ info.invalidTime }}</u>
            <u>检验单已失效</u>
          </li>
        </van-step>
        <van-step>
          <li class="display-div">
            <u class="font-login-color-blue">{{ info.addTime }}</u>
            <u>医生开检验单</u>
          </li>
        </van-step>
      </van-steps>
    </div>
    <div class="infoDiv">
      <li class="titleTips">
        <u>
          <span class="line"></span>
          <span>检验项目</span>
        </u>
      </li>
      <div class="checkList font-size-md">
        <li class="display-div " v-for="(item,index) in info.lisListDVO" :key="index"
            v-if="info.status != 4 && info.status != 5">
          <u>{{ index + 1 }}.{{ item.lisItemName }}-{{ item.sampleTypeName }}-{{ item.sampleBodyName }}</u>
          <u class="font-login-color-red">￥{{ item.cost }}</u>
        </li>
        <div v-for="(item,index) in info.lisListDVO" :key="index" v-if="info.status == 4 || info.status == 5">
          <li class="display-div ">
            <u>{{ index + 1 }}.{{ item.lisItemName }}-{{ item.sampleTypeName }}-{{ item.sampleBodyName }}</u>
            <u v-if="!item.reportOssUrl" class="font-login-color font-size-md">等待结果</u>
            <u v-else>
              <button class="getCheck" @click="checkResult(item.reportOssUrl)">查看报告</button>
            </u>
          </li>
          <li class="cost">
            <u class="font-login-color-red">￥{{ item.cost }}</u>
          </li>
        </div>
        <li style="text-align: right">合计： <span class="font-login-color-red">￥{{ info.cost }}</span>
          <span v-if="5 > info.status > 1">实际支付：<span class="font-login-color-red">￥{{ info.payCost }}</span></span>
        </li>
      </div>
    </div>
    <div class="infoDiv" v-if="info.lisOrgName && info.lisType == '1'">
      <li class="titleTips">
        <u>
          <span class="line"></span>
          <span>检验中心</span>
        </u>
      </li>
      <li class="pacsOrgName">{{ info.lisOrgName }}</li>
      <li class="address">{{ info.address }}</li>
    </div>
    <div class="infoDiv" v-if="info.lisOrgName && info.lisType == '2'">
      <li class="titleTips">
        <u>
          <span class="line"></span>
          <span>检验信息</span>
        </u>
      </li>
      <div>
        <van-row>
          <van-col span="8">采样地</van-col>
          <van-col span="16">{{ info.samplingOrgName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">采样地地址</van-col>
          <van-col span="16">{{ info.samplingOrgAddress }}</van-col>
        </van-row>
      </div>
      <div>
        <van-row>
          <van-col span="8">检验中心</van-col>
          <van-col span="16">{{ info.lisOrgName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="8">检验中心地址</van-col>
          <van-col span="16">{{ info.address }}</van-col>
        </van-row>
      </div>
    </div>
    <div class="infoDiv" v-if="active > 2  && info.lisType == '2'">
      <li class="titleTips">
        <u>
          <span class="line"></span>
          <span>物流信息</span>
        </u>
      </li>
      <div>
        <li class="display-div wlInfo">
          <u>{{ info.samplingOrgName }}</u>
          <img src="../../assets/img/my/wl.png" class="icon-width-height-sm">
          <u>{{ info.lisOrgName }}</u>
        </li>
      </div>
      <div>
        <van-row>
          <van-col span="6" class="font-blod-2">物流公司</van-col>
          <van-col span="18">{{ info.logisticsName }}</van-col>
        </van-row>
        <van-row>
          <van-col span="6" class="font-blod-2">物流单号</van-col>
          <van-col span="18">{{ info.logisticsCode }} <span @click="copyInfo(info.logisticsCode)"
                                                            class="font-login-color-blue">复制</span></van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {getProPacsInfoByID} from "../../api/check";
import {downLoadFileMany, downMergePDF} from "../../api/oss";
import {getProLisDetailInfoByID} from "../../api/chat";
import {Toast} from "vant";

export default {
  name: "lisDetail",
  components: {Navbar},
  data() {
    return {
      active: '',
      pliId: "",
      status: "",
      info: {}
    }
  },
  created() {
    this.pliId = this.$route.query.pliId;
    this.status = this.$route.query.status;
    this.getDetail();
  },
  methods: {
    getDetail() {
      getProLisDetailInfoByID({
        pliId: this.pliId,
      }).then(res => {
        console.log(res)
        let status = res.data.status;
        if (res.data.lisType == '1') {
          this.active = status - 1;
        } else {
          if (status == '1') {
            this.active = 0;
          } else if (status == '2') {
            this.active = 1;
          } else if (status == '3') {
            this.active = 5;
          } else if (status == '4') {
            this.active = 6;
          } else if (status == '5') {
            this.active = 7;
          } else if (status == '7') {
            this.active = 2;
          } else if (status == '8') {
            this.active = 3;
          } else if (status == '9') {
            this.active = 4;
          }
        }
        this.info = res.data;
      })
    },
    checkResult(name) {
      if (JSON.parse(name).length > 1) {
        Toast.loading({
          message: '下载中...',
          forbidClick: true,
          closeOnClick: false,
          duration: 0
        });
        let list = JSON.parse(name);
        let arr = [];
        for (let i = 0; i < list.length; i++) {
          arr.push({
            fileName: list[i]
          })
        }
        downMergePDF(arr).then(res => {
          let herfUrl = res.data.url.split("-internal").join("");
          let url = herfUrl.split("?")[0];
          if (api.systemType == 'ios') {
            api.openApp({
              iosUrl: url
            });
          } else {
            api.download({
              url: url,
              savePath: '',
              encode: false,
              report: true,
              cache: true,
              allowResume: true
            }, function (ret, err) {
              console.log(JSON.stringify(ret));
              if (ret.state == 1) {
                Toast("下载成功");
                //下载成功
              } else {

              }
            });
          }
        })

      } else {
        this.downLoadPdf(JSON.parse(name)[0]).then(res => {
          if (api.systemType == 'ios') {
            api.openApp({
              iosUrl: res
            });
          } else {
            var pdfReader = api.require('pdfReader');
            pdfReader.open({
              path: res,
              fixed: true
            }, function (ret) {
              console.log(JSON.stringify(ret));
            });
          }
        })
      }

    },
    downLoadPdf(name) {
      console.log(name);
      return new Promise(resolve => {
        downLoadFileMany([{fileName: name}]).then(res => {
          let fileUrl = res.data[0].url;
          let herfUrl = fileUrl.split("-internal").join("");
          let url = herfUrl.split("?")[0];
          resolve(url)
        })
      })
    },
    copyInfo(text) {
      var clipBoard = api.require('clipBoard');
      clipBoard.set({
        value: text
      }, function (ret, err) {
        if (ret) {
          Toast("复制成功")
        } else {
          Toast("复制失敗，請重試");
        }
      });
    },
  }
}
</script>

<style scoped lang="less">


.infoDiv, .topDiv {
  position: relative;
  padding: 12px 0;
  background: #ffffff;
  color: #333333;
}

.topDiv {
  overflow: hidden;
}

.van-row {
  padding: 8px 0px;
}

.infoDiv {
  margin: 12px 12px 0px;
  padding: 12px;

}

.checkList {
  li {
    margin-top: 12px;
  }
}

.checkTopInfo {
  padding-bottom: 12px;
  font-weight: 500;
  line-height: 21px;
  border-bottom: 1px dashed @back-border;
}

.hosName {
  margin-top: 8px;
}

.pacsOrgName {
  .font-size-md;
  .black-font;
  line-height: 20px;
  margin-top: 14px;
}

.address {
  .font-color-2;
  .font-login-sm;
  line-height: 18px;
  margin-top: 8px;
}

.getCheck {
  color: @blue;
  padding: 5px 12px;
  font-size: 14px;
  border: 1px solid @blue;
  background: #EAF8FF;
  border-radius: 15px;
}

/deep/ .van-step--vertical:not(:last-child)::after {
  border: none;
}

.cost {
  padding-left: 12px;
  margin-top: 6px !important;
}

.checkUserInfo {
  .docInfoLi {
    margin-top: 8px;
    .font-color-2;
    .font-size-md;
    line-height: 20px;
  }
}

.userInfo {
  display: flex;
  padding-top: 12px;
  font-weight: 500;
  .black-font;
  .font-size-md-2;
  text-align: left;

  li {
    flex: 1;
  }

  .sex {
    text-align: center;
  }

  .age {
    text-align: right;
  }


}

/deep/ .van-steps--horizontal .van-steps__items {
  position: relative;
  display: flex;
  margin: 0 0 10px;
  padding-bottom: 45px;
}

/deep/ .van-step {
  flex: none;
}

.wlInfo {
  padding: 12px 20px;
}

/deep/ .van-steps {
  overflow: scroll;
  background-color: #fff;
  width: 130vw;
  position: relative;
  box-sizing: border-box;
}


/deep/ .van-steps::-webkit-scrollbar {
  display: none
}

/deep/ .van-step--horizontal .van-step__title {
  font-size: 14px;
}

/deep/ .van-step--horizontal:last-child .van-step__circle-container {
  right: -24px;
  left: 24px;
}

/deep/ .van-step--horizontal:last-child {
  position: relative !important;
  right: 0;
}

.time {
  position: absolute;
  bottom: -50px;
  width: 70px;
  left: -10px;
  text-align: center;
  font-size: 10px !important;
}


</style>
