<template>
  <div @click.stop="moreBtnShow=false">
    <div class="header" :style="{ paddingTop: paddingTop + 44 + 'px' }">
      <header :style="{ top: paddingTop + 'px' }">
        <img src="../../assets/img/friend/back.png" class="icon-width-height-sm" @click.stop="goBack">
        <div class="title">医生信息</div>

        <img src="../../assets/img/friend/more.png" class="icon-width-height-sm"
             v-if="this.dfrId || (type == 'add'  && addStatus == '2')" @click.stop="showMore">
        <div class="moreIcon" v-else>

        </div>
        <div class="rightBtn" v-if="moreBtnShow">
          <li @click.stop="show=true">
            <img src="../../assets/img/friend/delete.png" class="delIcon">
            <span>删除</span>
          </li>
          <li @click.stop="setReferral">
            <img src="../../assets/img/friend/zz.png" class="delIcon">
            <span>转诊设置</span>
          </li>
          <li @click="setBz">
            <img src="../../assets/img/friend/bz.png" class="delIcon">
            <span>备注</span>
          </li>
        </div>
      </header>
      <div class="docInfo">
        <div class="docBasicInfo">
          <img v-zlazy="docInfo.docImg" class="userHead">
          <div class="info">
            <li class="name">{{docInfo.docName}} <span v-if="docInfo.remarks">（{{docInfo.remarks}}）</span></li>
            <li class="dept">{{docInfo.deptName}} I {{docInfo.docProf}}</li>
            <li class="label" v-if="docInfo.docLabelList">
                <span class="font-login-color-blue" v-for="(item,index) in docInfo.docLabelList">
                  十年经验
                </span>
            </li>
          </div>
        </div>
        <div class="evaVal">
          <div>
            <li class="top">好评度</li>
            <li class="num">{{docInfo.percentage}}%</li>
          </div>
          <div>
            <li class="top">接诊量</li>
            <li class="num">{{docInfo.consultationCount}}</li>
          </div>
          <div>
            <li class="top">平均响应</li>
            <li class="num">{{docInfo.responseTime}}分钟</li>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomInfo">
      <div class="textInfo">
        <div ref="specialties" :class="loadMore?'div-overflow-2':''">
          <span class="label">擅长:</span>
          <span v-if="docInfo.specialties">
            {{docInfo.specialties}}
          </span>
          <span v-else>暂未填写</span>
        </div>
        <div ref="docSynopsis" :class="loadMore?'div-overflow-2':''">
          <span class="label">简介:</span>
          <span v-if="docInfo.docSynopsis">{{docInfo.docSynopsis}}</span>
          <span v-else>暂未填写</span>
        </div>
        <img src="../../assets/img/friend/down.png" class="downIcon" @click="loadMore=false" v-if="btnShow && loadMore">
        <img src="../../assets/img/friend/up.png" class="downIcon" @click="loadMore=true" v-if="btnShow && !loadMore">
      </div>
      <div class="patientEval">
        <li class="title">
          <u>
            <b>患者评价</b> <span class="font-login-color-blue">（{{total}}）</span>
          </u>
          <u>
            <b>好评率 <span>{{docInfo.percentage}}%</span></b>
          </u>
        </li>
        <div class="evalList" v-for="(item,index) in evalList" :key="index">
          <li class="font-color-2">{{item.remark.patientName}}
            <van-rate
              v-model="item.value"
              :size="12"
              color="#FAA900"
              void-icon="star"
              void-color="#eee"
              allow-half
            />
          </li>
          <li class="evalContent black-font">{{item.t1}}</li>
          <li class="imgDiv">
            <img v-zlazy="src" v-for="(src,srcIndex) in item.imgList" @click.stop="getImgView(item.imgList, srcIndex)" :key="srcIndex">
          </li>
          <li class="display-div font-login-color font-size-sm">
            <u style="width: 60%" class="div-overflow">[{{item.remark.visitTypeName}}问诊] <span v-if="item.remark.diagNames">诊断：{{item.remark.diagNames}}</span></u>
            <u>{{item.evaluateTime.split(" ")[0]}}</u>
          </li>
        </div>
        <div>
          <button class="publicWhiteBtn" @click="getMore" v-if="evalList.length > 10 ">查看更多</button>
        </div>
      </div>
    </div>
    <div class="bottomBtn" v-if="type == 'add'  && addStatus == '1'">
      <button class="publicBtn" style="color:#fff;background: #D8D8D8">已发送验证，等待好友同意</button>
    </div>
    <div class="bottomBtn" @click="sendAdd" v-if="type == 'add' && addStatus == '0'">
      <button class="publicBtn">添加好友</button>
    </div>


    <van-popup v-model="show" class="popup">
      <li class="title">删除好友</li>
      <li>确定要删除该医疗好友吗？删除后您将不能将患者转诊到该医生</li>
      <div class="btns">
        <button class="publicWhiteBtn" @click="show = false">取消</button>
        <button class="publicBtn twoBtn" @click="delFriend">确定</button>
      </div>
    </van-popup>

    <img-save v-if="showImg"
              :showPic="showImg"
              :index="index"
              :images="images"
              @changePreview="changePreview"
              @onClose="onClose"></img-save>
  </div>
</template>

<script>
  import {
    askAddDocFriendRelation, deleteFriend,
    findDocEvaluateListPage, getTwoDocFriendStatus,
    searchDocInfoEvaluation
  } from "../../api/friend";
  import myJsTools from "../../utils/myJsTools";
  import {Dialog, Toast} from "vant";
  import ossUpDown from "../../utils/ossUpDown";
  import ImgSave from "../../common/imgSave";

  export default {
    name: "docInfo",
    components: {ImgSave},
    data() {
      return {
        docInfo: {},
        docId: "",
        paddingTop: "",
        listQuery: {
          limit: 20,
          page: 1,
          docId: "",
        },
        dfrId: "",
        type: "",
        moreBtnShow: false,
        addStatus: "",//好友添加状态：0,不是好友 1,待验证 2,已添加
        loadMore: false,//是否超过两行
        btnShow: false,//是否显示箭头按钮
        show: false,//是否删除好友弹框
        total: 0,
        evalList: [],
        showImg: false,
        images: [],
        index: 0,
      }
    },
    created() {
      this.docId = this.listQuery.docId = this.$route.query.docId;
      this.dfrId = this.$route.query.dfrId;
      this.type = this.$route.query.type; //'add'为添加好友发送界面
      // this.getDocInfo();
      this.getEvalList();
      this.paddingTop = parseInt(api.safeArea.top) + 5;
      this.getFriendStatus();
    },
    mounted() {
      this.getDocInfo();
    },
    methods: {
      // 预览图片
      getImgView(item, index) {
        this.images = item;
        this.index = index;
        this.showImg = true;
      },
      changePreview(index) {
        this.index = index;
      },
      onClose() {
        this.show = false;
      },
      // 不是好友的情况下不允许进行更多操作
      showMore() {
        if (this.dfrId) {
          this.moreBtnShow = true;
        }
      },
      getFriendStatus() {
        getTwoDocFriendStatus({
          myDocId: myJsTools.getItem("token_info").docId,
          targetDocId: this.docId
        }).then(res => {
          console.log(JSON.stringify(res));
          if (!res.data) {
            this.addStatus = '0'
          } else {
            this.addStatus = res.data.addStatus;
          }
        })
      },
      // 获取医生信息
      getDocInfo() {
        searchDocInfoEvaluation({
          docId: this.docId,
          nowDocId: myJsTools.getItem("token_info").docId
        }).then(async res => {
          console.log(JSON.stringify(res))
          this.docInfo = Object.assign({}, res.data);
          this.$nextTick(() => {
            //如果超过两行 则显示下拉按钮
            if (this.$refs.specialties.clientHeight > 50 || this.$refs.docSynopsis.offsetHeight > 50) {
              this.loadMore = true;
              this.btnShow = true;
            } else {
              this.loadMore = false;
              this.btnShow = false;
            }
            console.log(this.$refs.specialties.clientHeight, this.$refs.docSynopsis.clientHeight)
          })
        })
      },
      // 转诊设置
      setReferral() {
        this.$router.push({
          name: "setReferral",
          query: {
            docId: this.docId,
            isReferral: this.docInfo.isReferral
          }
        })
      },
      getMore(){
        if(this.listQuery.limit * this.listQuery > this.total){
          return;
        }
        this.listQuery.page ++;
        this.getEvalList();
      },
      //获取患者评价列表
      getEvalList() {
        findDocEvaluateListPage(this.listQuery).then(async res => {
          console.log(res);
          this.total = res.data.total;
          let data = res.data.rows;
          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            item.remark = JSON.parse(item.remark);
            item.value = (parseInt(item.t3) + parseInt(item.t4) + parseInt(item.t5)) / 3;
            item.imgList = [];
            if(item.t2){
              item.t2 = JSON.parse(item.t2);
            }
            console.log(item.t2.length)
            if(item.t2.length > 0){
              for (let m = 0; m < item.t2.length; m++) {
                item.imgList.push(item.t2[m])
              }
            }
          }
          if(this.listQuery.page == 1){
            this.evalList = res.data.rows;
          }else{
            this.evalList = this.evalList.concat(res.data.rows);
          }

        })
      },
      //删除好友
      delFriend() {
        deleteFriend({
          dfrId: this.dfrId
        }).then(res => {
          console.log(res);
          Toast("删除好友成功");
          this.$router.go(-1);
        })
      },
      goBack() {
        this.$router.go(-1);
      },
      //跳转设置备注页面
      setBz() {
        this.$router.push({
          name: "friendRequests",
          query: {
            docId: this.docId,
            type: "bz"
          }
        })
      },
      // 加好友请求发送
      sendAdd() {
        askAddDocFriendRelation({
          passiveDocId: this.docId,
          activeDocId: myJsTools.getItem("token_info").docId
        }).then(res => {
          console.log(JSON.stringify(res) + "-=----------------------------请求好友结果");
          Toast("请求发送成功");
        })
      },
    },
  }
</script>

<style scoped lang="less">


  .header {
    background: @blue;
    .white-font;
    padding: 60px 16px 16px;

    header {
      position: fixed;
      top: 25px;
      display: flex;
      background: transparent;
      .font-size-lg-2;
      line-height: 30px;
      align-items: center;
      padding: 0 15px;

      .title {
        width: 80%;
        text-align: center;
      }
    }

    .docInfo {
      .docBasicInfo {
        display: flex;

        .userHead {
          .img-width-height-lg;
          margin-right: 10px;
        }

        .name {
          .font-size-lg-2;
          .font-blod-2;
          line-height: 25px;
        }

        .dept {
          .font-blod-2;
          .font-size-lg;
          line-height: 22px;
        }

        .label {
          margin-top: 7px;

          span {
            display: inline-block;
            background: @white;
            .font-size-sm;
            padding: 3px 8px;
            margin-right: 12px;
            border-radius: 8px;
          }
        }
      }

      .evaVal {
        margin-top: 21px;
        background: rgba(255, 255, 255, 0.21);
        display: flex;
        border-radius: 4px;
        padding: 11px 0;

        div {
          width: 33%;
          text-align: center;

          .top {
            .font-size-sm;
            line-height: 17px;
          }

          .num {
            .font-size-lg-20;
            line-height: 28px;
          }
        }
      }
    }
  }

  .bottomInfo {
    background: @white;
    padding: 0 16px 12px;

    .textInfo {
      font-size: 14px;
      .font-login-color;
      line-height: 18px;
      background: @white;

      .label {
        .black-font;
        .font-blod-2;
      }

      div {
        padding-top: 12px;
      }

      .downIcon {
        width: 18px;
        height: 10px;
        margin: 12px auto 0;
      }
    }

    .patientEval {
      margin-top: 12px;
      border-top: 0.5px solid @back-border;
      padding-top: 16px;

      .title {
        .black-font;
        .font-size-md;
        line-height: 17px;
        .display-div;

        :first-child {
          span {
            .font-login-color;
            .font-size-sm;
            line-height: 17px;
          }
        }

        :last-child {
          .font-color-2;
          .font-size-sm;
          line-height: 17px;
        }
      }
    }
  }

  .rightBtn {
    position: absolute;
    right: 40px;
    top: 28px;
    background: url("../../assets/img/chat/top_back.png") no-repeat;
    background-size: 100% 100%;
    padding: 0 10px 10px;
    width: 22%;
    border-radius: 8px;

    li {
      display: flex;
      .black-font;
      .font-size-md;
      align-items: center;
      line-height: 22px;
      padding-top: 13px;
    }

    img {
      .icon-width-height-sm;
      margin-right: 5px;
    }
  }

  /deep/ .van-field__label {
    width: 70px;
  }

  .evalList{
    .font-login-sm;
    padding-top: 18px;
    margin-bottom: 20px;
    background: @white;
    .evalContent{
      margin: 8px 0;
    }

    .imgDiv{
      display: flex;
      flex-wrap: wrap;
      padding-top: 7px;
      img{
        width: 30%;
        border-radius: 4px;
        object-fit: cover;
        margin-bottom: 8px;
        margin-right: 10px;
      }
      :nth-child(3),:nth-child(6),:nth-child(9){
        margin-right: 0px;
      }
    }
    /deep/ .van-rate{
      margin-left: 8px;
    }

    .publicWhiteBtn{
      margin-top: 12px;
    }
  }
</style>
