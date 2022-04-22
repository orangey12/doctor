<template>
    <div class="checkDetail">
      <navbar title="检查单"></navbar>
      <div class="topDiv">
          <van-steps :active="active" active-color="#1686FF" v-if="active || active == 0">
            <van-step style="width: 23%;" :class="info.addTime?'font-login-color-blue':''">
              <div>待支付</div>
              <div class="time">
                <li>{{info.addTime.split(" ")[0]}}</li>
                <li>{{info.addTime.split(" ")[1]}}</li>
              </div>
            </van-step>
            <van-step style="width: 23%;" :class="info.payTime?'font-login-color-blue':''">
              <div>待签到</div>
              <div class="time" v-if="info.payTime" >
                <li>{{info.payTime.split(" ")[0]}}</li>
                <li>{{info.payTime.split(" ")[1]}}</li>
              </div>
            </van-step>
            <van-step style="width: 23%;" :class="info.signTime?'font-login-color-blue':''">
              <div>待检查</div>
              <div class="time" v-if="info.signTime">
                <li>{{info.signTime.split(" ")[0]}}</li>
                <li>{{info.signTime.split(" ")[1]}}</li>
              </div>
            </van-step>
            <van-step style="width: 30%;" :class="info.verificationTime?'font-login-color-blue':''">
              <div>等待上传</div>
              <div class="time" v-if="info.verificationTime">
                <li>{{info.verificationTime.split(" ")[0]}}</li>
                <li>{{info.verificationTime.split(" ")[1]}}</li>
              </div>
            </van-step>
            <van-step style="width: 24%;text-align: right" :class="info.uploadReportTime?'font-login-color-blue':''">
              <div>已出报告</div>
              <div class="time" style="left: 30px;" v-if="info.uploadReportTime">
                <li>{{info.uploadReportTime.split(" ")[0]}}</li>
                <li>{{info.uploadReportTime.split(" ")[1]}}</li>
              </div>
            </van-step>
          </van-steps>
      </div>
      <div class="infoDiv">
        <div class="checkTopInfo black-font font-size-md-2">
          <li class="display-div">
            <u>检查单号：{{info.ppiCode}}</u>
            <u class="font-login-color-red" v-if="info.status == 6">已退费</u>
            <u class="font-login-color-red" v-if="info.status == 0">已失效</u>
          </li>
          <li class="hosName">医院名称：{{info.hosName}}</li>
        </div>
        <div class="checkUserInfo">
          <div class="userInfo">
            <li>{{info.patientName}}</li>
            <li class="sex">{{info.sex}}</li>
            <li class="age">{{info.age}}{{info.ageUnit}}</li>
          </div>
          <li class="docInfoLi">开单医生：{{info.docName}}</li>
          <li class="docInfoLi">医生科室：{{info.deptName}}</li>
          <li class="docInfoLi">临床诊断：{{info.ppiDiag}}</li>
          <li class="docInfoLi" v-if="info.appointTime">预约时间：{{info.appointTime}}</li>
        </div>
      </div>
      <div class="infoDiv" v-if="info.status == 6">
        <van-steps direction="vertical" active-color="#1686FF" :active="3">
          <van-step>
            <li class="display-div">
              <u class="font-login-color-blue">{{info.returnTime}}</u>
              <u>患者退费</u>
            </li>
          </van-step>
          <van-step>
            <li class="display-div">
              <u class="font-login-color-blue">{{info.payTime}}</u>
              <u>患者支付</u>
            </li>
          </van-step>
          <van-step>
            <li class="display-div">
              <u class="font-login-color-blue">{{info.addTime}}</u>
              <u>医生开检验单</u>
            </li>
          </van-step>
        </van-steps>
      </div>
      <div class="infoDiv" v-if="info.status == 0">
        <van-steps direction="vertical" active-color="#1686FF" :active="2">
          <van-step>
            <li class="display-div">
              <u class="font-login-color-blue">{{info.invalidTime}}</u>
              <u>检查单已失效</u>
            </li>
          </van-step>
          <van-step>
            <li class="display-div">
              <u class="font-login-color-blue">{{info.addTime}}</u>
              <u>医生开检验单</u>
            </li>
          </van-step>
        </van-steps>
      </div>
      <div class="infoDiv">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>检查项目</span>
          </u>
        </li>
        <div class="checkList font-size-md">
          <li class="display-div " v-for="(item,index) in info.pacsListDVO" :key="index" v-if="info.status > 0 && info.status < 4">
            <u>{{index + 1}}.{{item.itemName}}-{{item.positionName}}</u>
            <u class="font-login-color-red">￥{{item.cost}}</u>
          </li>
          <div v-for="(item,index) in info.pacsListDVO" :key="index" v-if="info.status == 4 || info.status == 5">
            <li class="display-div " >
              <u style="width: 70%">{{index + 1}}.{{item.itemName}}-{{item.positionName}}</u>
              <u v-if="!item.reportOssUrl" class="font-login-color font-size-md">等待结果</u>
              <u v-else>
                <button class="getCheck" @click="checkResult(item.reportOssUrl)">查看报告</button>
              </u>
            </li>
            <li class="cost">
              <u class="font-login-color-red">￥{{item.cost}}</u>
            </li>
          </div>
          <li style="text-align: right">合计： <span class="font-login-color-red">￥{{info.cost}}</span>
            <span v-if="5 > info.status > 1">实际支付：<span class="font-login-color-red">￥{{info.payCost}}</span></span>
          </li>
        </div>
      </div>
      <div class="infoDiv" v-if="info.pacsOrgName">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>检查中心</span>
          </u>
        </li>
        <li class="pacsOrgName">{{info.pacsOrgName}}</li>
        <li class="address">{{info.address}}</li>
      </div>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import {getProPacsInfoByID} from "../../api/check";
    import {downLoadFileMany, downMergePDF} from "../../api/oss";
    import {Toast} from "vant";
    export default {
        name: "checkDetail",
      components: {Navbar},
      data(){
          return{
            active:'',
            checkList:[],
            ppiId:"",
            status:"",
            info:{}
          }
      },
      created() {
        this.ppiId = this.$route.query.ppiId;
        this.status = this.$route.query.status;
        this.getDetail();
      },
      methods:{
          getDetail(){
            getProPacsInfoByID({
              ppiId:this.ppiId,
            }).then(res=>{
              console.log(res)
              let status = res.data.status;
              if(status == '1'){
                this.active = 0;
              }else if(status == '2'){
                this.active = 1;
              }else if(status == '3'){
                this.active = 2;
              }else if(status == '4'){
                this.active = 3;
              }else if(status == '5'){
                this.active = 4;
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
                fileName:list[i]
              })
            }
            downMergePDF(arr).then(res=>{
              let herfUrl = res.data.url.split("-internal").join("");
              let url = herfUrl.split("?")[0];
              if(api.systemType == 'ios'){
                api.openApp({
                  iosUrl: url
                });
              }else{
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
            this.downLoadPdf(JSON.parse(name)[0]).then(res=>{
              var pdfReader = api.require('pdfReader');
              pdfReader.open({
                path: res,
                fixed: true
              }, function (ret) {
                console.log(JSON.stringify(ret));
              });
            })

          }

        },
        downLoadPdf(name) {
            console.log(name);
          return new Promise(resolve => {
            downLoadFileMany([{fileName:name}]).then(res => {
              let fileUrl = res.data[0].url;
              let herfUrl = fileUrl.split("-internal").join("");
              let url = herfUrl.split("?")[0];
              resolve(url)
            })
          })
        }
      }
    }
</script>

<style scoped lang="less">

  .infoDiv,.topDiv{
    position: relative;
    padding: 12px 0;
    background: #ffffff;
    color: #333333;
  }
  .infoDiv{
    margin: 12px 12px 0px;
    padding: 12px;

  }

  .checkList{
    li{
      margin-top: 12px;
    }
  }

  .checkTopInfo{
    padding-bottom: 12px;
    font-weight: 500;
    line-height: 21px;
    border-bottom: 1px dashed @back-border;
  }

  .hosName{
    margin-top: 8px;
  }

  .pacsOrgName{
    .font-size-md;
    .black-font;
    line-height: 20px;
    margin-top: 14px;
  }

  .address{
    .font-color-2;
    .font-login-sm;
    line-height: 18px;
    margin-top: 8px;
  }

  .getCheck{
    color: @blue;
    padding: 5px 12px;
    font-size: 14px;
    border: 1px solid @blue;
    background: #EAF8FF;
    border-radius: 15px;
  }

  /deep/ .van-step--vertical:not(:last-child)::after{
    border: none;
  }

  .cost{
    padding-left: 12px;
    margin-top: 6px !important;
  }

  .checkUserInfo{
    .docInfoLi{
      margin-top: 8px;
      .font-color-2;
      .font-size-md;
      line-height: 20px;
    }
  }
  .userInfo{
    display: flex;
    padding-top: 12px;
    font-weight: 500;
    .black-font; .font-size-md-2;
    text-align: left;
   li{
     flex: 1;
   }
    .sex{
      text-align: center;
    }
    .age{
      text-align: right;
    }


  }

  /deep/ .van-steps--horizontal .van-steps__items{
    padding-bottom: 45px;

    .van-step--horizontal .van-step__circle-container{
      left: 0px;
    }
    .van-step--horizontal:last-child .van-step__circle-container{
      right: 5px;
      left: auto;
    }

  }
  /deep/ .van-step{
    flex: none;

  }

  /deep/ .van-step--horizontal .van-step__title{
    font-size: 14px;
  }
  .time{
    position: absolute;
    bottom:-50px;
    width: 70px;
    left: -10px;
    text-align: center;
    font-size: 10px !important;
  }



</style>
