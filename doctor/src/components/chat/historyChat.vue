<template>
  <div>
    <navbar title="聊天记录" ref="headerRef"></navbar>
    <div :style="{ 'padding-top': headerHeight + 'px;background: #fff;' }">
      <div class="searchDiv">
        <div class="searchField">
          <van-form action="/">
            <van-search
              v-model="searchVal"
              placeholder="请输入想要搜索的内容"
              :clearable="true"
              @search="searchChat"
              :left-icon="searchIcon"
              @clear="clearSearch"
            />
          </van-form>
        </div>
        <img src="../../assets/img/chat/my.png" class="myIcon" @click="openRoamChat">
      </div>
      <van-tabs
        v-model="active"
        title-inactive-color="#666666"
        title-active-color="#14A0E6"
        color="#14A0E6"
        @change="changeTabs"
      >
        <van-tab title="全部" class="historyDiv">
          <div>
            <div id="msgDiv" ref="msgDiv" :style="{ height: msgHeight + 'px'}">
              <div v-for="(item, index) in list" :key="index">
                <div class="chat-sender" v-if="item.type == 'receive' && item.content">
                  <div @click="openImp">
                    <img v-zlazy="userInfo.patientImg" class="userImg" />
                  </div>
                  <div></div>
                  <div
                    class="messageDiv"
                  >
              <span
                class="textSpan textSpanSender"
                v-if="
                    item.messType == 'text' &&
                      !item.ext.businessId
                  "
                v-html="renderTxt(item.content)"
              ></span>
                    <span
                      class="textSpan"
                      @click="disabledClickCard('mbxf',item)"
                      v-if="item.messType == 'text' && item.ext.businessId"
                    >
                  <div class="cfSuggestSpan">
                    <li class="title">慢病续方</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/mbxf.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li>请点击查看</li>
                      </div>
                    </div>
                  </div>
                </span>
                    <van-image
                      width="100"
                      :src="item.content"
                      v-if="item.messType == 'image'"
                      @click="lookImg(item.content)"
                    />
                    <div
                      class="audio"
                      @click="audioPlay(item, item.mid, index)"
                      v-if="item.messType == 'voice'"
                    >
                      <audio class="audioPlay" :id="item.mid" :src="item.content"></audio>
                      <button class="playAudioBtn">
                        <img
                          src="../../assets/img/chat/right.gif"
                          class="audioGif"
                          v-if="item.playStatus"
                        />
                        <img src="../../assets/img/chat/right.png" class="audioGif" v-else/>
                        {{ item.duration }}s
                      </button>
                    </div>
                    <div class="video" v-if="item.messType == 'video'">
                      <video
                        :src="item.content"
                        :id="item.mid"
                        :poster="item.thumbnailLocalPath"
                        width="80%"
                        height="100%"
                        controls
                      ></video>
                    </div>
                  </div>
                </div>

                <!-- Right -->

                <div class="chat-receiver" v-if="item.type == 'send' && item.content">
                  <div>
                    <img v-zlazy="docImg" class="userImg"/>
                  </div>
                  <div></div>
                  <div style="display: flex;position: relative;">
                    <div
                      class="messageDiv"
                    >
                <span
                  class="textSpan textSpanSender"
                  v-if="
                    item.messType == 'text' && !item.ext.cfbusinessCode  &&
                      !item.ext.czbType  &&
                      !item.ext.groupInfoId  &&
                      !item.ext.regId  &&
                      !item.ext.sendId  &&
                      !item.ext.plsId &&
                      !item.ext.plmId  &&
                      !item.ext.referralId &&
                      !item.ext.customBussinessId  &&
                      !item.ext.authorizeId &&
                      !item.ext.ppiId &&
                      !item.ext.type &&
                      !item.ext.businessId
                  "
                  v-html="renderTxt(item.content)"
                ></span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('cf',item)"
                        v-if="item.messType == 'text' && item.ext.cfbusinessCode && item.ext.isSubsequent == '1'"
                      >
                  <div class="cfSuggestSpan">
                    <li class="title">处方</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/rp.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li>处方有效为{{ prescription_indate }}天，请及时购药</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.ysStstus == '0'">
                    <span>
                      <img src="../../assets/img/chat/waitPass.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '1'">
                    <span>
                      <img src="../../assets/img/chat/pass.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '2'">
                    <span>
                      <img src="../../assets/img/chat/notPass.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('cf',item)"
                        v-if="item.messType == 'text' && item.ext.cfbusinessCode && item.ext.isSubsequent == '0'"
                      >
                  <div class="cfSuggestSpan">
                    <li class="title">处方建议</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/rp.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li>开具了处方建议</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('jcd',item)"
                        v-if="item.messType == 'text' && item.ext.ppiId"
                      >
                  <div class="cfSuggestSpan">
                    <li class="title">检查单</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/jcd.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.ppiDiag }}</li>
                        <li>请点击查看检查单</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.status == '1'">
                    <span>
                      <img src="../../assets/img/chat/notPay.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.status == '2'">
                    <span>
                      <img src="../../assets/img/chat/waitHy.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.status == '3'">
                    <span>
                      <img src="../../assets/img/chat/hy.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.status == '4'">
                    <span>
                      <img src="../../assets/img/chat/ysx.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('wzjh',item.ext.czbType)"
                        v-if="item.messType == 'text' && item.ext.czbType"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">问诊加号</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/czb.png" class="rpPng"/>
                      <div>
                        <li class="zdText">医师：{{ docName }}</li>
                        <li>选择您要问诊的时间进行预约</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('qf',item.ext.groupInfoId)"
                        v-if="item.messType == 'text' && item.ext.groupInfoId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">群发</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/group.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li>给该患者发送了一条群发消息，点击查看</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('zxxj',1)"
                        v-if="item.messType == 'text' && item.ext.regId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">咨询小结</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zzxj.png" width="40px"/>
                      <div>
                        <li class="zdText">问诊总结</li>
                        <li>您给{{ userInfo.patientName }}发送了咨询小结</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('jyd',item)"
                        v-if="item.messType == 'text' && item.ext.plmId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">检验单</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/jyd.png" width="40px"/>
                      <div>
                        <li class="zdText">检验单</li>
                        <li>您给{{ userInfo.patientName }}发送了检验单</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('zz',item)"
                        v-if="item.messType == 'text' && item.ext.referralId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">转诊</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zhuanzhen.png" width="40px"/>
                      <div>
                        <li class="zdText">转诊到{{ item.ext.docName }}</li>
                        <li>您给{{ userInfo.patientName }}推荐了{{ item.ext.docName }}</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.referralStatus == '0'">
                    <span>
                      <img src="../../assets/img/chat/notconfirm.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.referralStatus == '1'">
                    <span>
                      <img src="../../assets/img/chat/confirm.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('fw',item)"
                        v-if="item.messType == 'text' && item.ext.customBussinessId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">服务</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zdyfw.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.customBussTitle }}</li>
                        <li>{{ item.ext.customBussMemo }}</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.paystatus == '0'">
                    <span>
                      <img src="../../assets/img/chat/notPay.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.paystatus == '1'">
                    <span>
                      <img src="../../assets/img/chat/paid.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.paystatus == '7'">
                    <span>
                      <img src="../../assets/img/chat/refund.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('blsq',item)"
                        v-if="item.messType == 'text' && item.ext.authorizeId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">授权</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/sq.png" width="40px"/>
                      <div>
                        <li class="zdText">病例授权</li>
                        <li>病例授权申请</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '1'">
                    <span>
                      <img src="../../assets/img/chat/waitSq.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '2'">
                    <span>
                      <img src="../../assets/img/chat/isSq.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '3'">
                    <span>
                      <img src="../../assets/img/chat/notSq.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('lb',item.ext.sendId)"
                        v-if="item.messType == 'text' && item.ext.sendId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">量表</li>
                    <div class="cfSuggest groupInfo">
                        <img src="../../assets/img/chat/lb.png" width="40px"/>
                      <div class="textDiv">
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li>您给{{ userInfo.patientName }}发送了量表</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.isFeedback == '0'">
                    <span>
                      <img src="../../assets/img/chat/notWhite.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.isFeedback == '1'">
                    <span>
                      <img src="../../assets/img/chat/white.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                      <span
                        class="textSpan"
                        @click="disabledClickCard('sf',item)"
                        v-if="item.messType == 'text' && item.ext.plsId"
                      >
                  <div class="wzSuggestSpan">
                    <li class="title">随访</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/sf.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li>您给{{ userInfo.patientName }}发送了随访</li>
                      </div>
                    </div>
                  </div>
                </span>
                      <van-image
                        width="100"
                        :src="item.content"
                        v-if="item.messType == 'image'"
                        @click="lookImg(item.content)"
                      />
                      <div
                        class="audio"
                        @click="audioPlay(item, item.mid, index)"
                        v-if="item.messType == 'voice'"
                      >
                        <audio class="audioPlay" :id="item.mid" :src="item.content"></audio>
                        <button class="playAudioBtn">
                          {{ item.duration }}s
                          <img
                            src="../../assets/img/chat/left.gif"
                            class="audioGif"
                            v-if="item.playStatus"
                          />
                          <img src="../../assets/img/chat/left.png" class="audioGif" v-else/>
                        </button>
                      </div>
                      <div class="video" v-if="item.messType == 'video'">
                        <video
                          :src="item.content"
                          :id="item.mid"
                          :poster="item.thumbnailLocalPath"
                          width="80%"
                          height="100%"
                          controls
                        ></video>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chat-center" v-if="item.ext.type == 'YS_WZ_SF' && item.type == 'defaultMsg'">
                  <span class="tipsText">{{ item.content }}</span>
                  <span class="editMsg" v-if="item.messType == 'text'" @click="getCfDetailSh(item)">查看</span>
                </div>
                <van-popup class="vanPopupVideo" v-model="playVideo" @click="closeVideo(item, index)">
                  <video
                    :src="item.content"
                    :id="item.mid"
                    :poster="item.thumbnailLocalPath"
                    width="80%"
                    height="100%"
                    autoplay
                    controls
                  ></video>
                </van-popup>
                <!-- 撤回消息 -->
                <div class="chat-center" v-if="item.type == 'withdraw'">
                  <span class="tipsText">你撤回了一条消息</span>
                </div>

                <!-- 撤回消息 -->
                <div class="chat-center" v-if="item.type == 'reWithdraw'">
                  <span class="tipsText">{{ name }}撤回了一条消息</span>
                </div>
                <div class="chat-center" v-if="item.ext.type == 'YS_WZ_SF' && item.type == 'defaultMsg'">
                  <span class="tipsText">{{ item.content }}</span>
                  <span class="editMsg" v-if="item.messType == 'text'" @click="disabledClick('cf',item)">查看</span>
                </div>

              </div>
              <!--        </van-pull-refresh>-->
            </div>
          </div>
        </van-tab
        >
        <van-tab title="图片" class="historyDiv">
          <div v-for="(item, index) in imgHisList" :key="index">
            <li class="dateTitle">{{ item.dateTime }}</li>
            <div class="imgDiv">
              <img
                :src="src"
                v-for="(src, srcIndex) in item.imgList"
                class="historyImg"
                @click="showHisImg(item.imgList)"
                :key="srcIndex"
                :style="
                  (srcIndex + 1) % 4 != 0
                    ? 'margin-right:5px'
                    : 'margin-right:0px'
                "
              />
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <img-save
        v-if="showImgPic"
        :showPic="showImgPic"
        :index="index"
        :images="images"
        @changePreview="changePreview"
        @onClose="onClose"
      ></img-save>
    </div>
    <!--禁止点击卡片-->
    <van-popup class="closeTimePopup tipsPopup" v-model="disabledClick" round>
      <li class="content">
        <div>请到聊天界面点击卡片进行查看</div>
      </li>
      <div class="btns">
        <button @click="disabledClick = false">确定</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import imgSave from "../../common/imgSave";
import {getPrescriptionCardInfo} from "../../api/cf";
import {getPatientFeedback} from "../../api/scale";
import {getLabInfo, getMedicalAuthorizeStatus, getReferralRecord} from "../../api/chat";
import {findCustomServicePayStatus} from "../../api/myService";
import {getProPacsStatus} from "../../api/check";
import date from "../../utils/date";

export default {
  name: "historyChat",
  components: {navbar, imgSave},
  data() {
    return {
      searchVal: "",
      headerHeight: 25,
      active: 0,
      index: 0,
      showImgPic: false,
      isLoading: false,
      playVideo: false,
      id: "",
      page: 1,
      size: 1,
      userInfo: {},
      images: [],
      imgHistory: [],
      finished: false,
      prescription_indate: "",
      docId: "",
      userId: "",
      oneList: [],//单人聊天记录
      list: [],
      listQuery: {
        page: 1,
        limit: 20,
        size: 1,
        total: 0,
      },
      docImg: "",
      scrollHeight: 0,
      msgHeight: "",
      lisUserInfo: {},
      searchIcon: require("../../assets/img/index/search.png"),
      imgHisList: [],
      disabledClick: false,
    };
  },
  computed: {
    chatList() {
      // 聊天自动滚动到底部
      let chatList = this.$store.getters.getChatList;
      let list = [];
      chatList.map(item => {
        if (item.id == this.chatId) {
          list = item.chatRecordList
        }
      })
      if (this.list.length > 0 && this.oneList.length > 0) {
        if (this.oneList.length < list.length) {
          this.list.push(list[this.oneList.length])
          this.oneList.push(list[this.oneList.length])
        }
      }
      return list;
    },
  },
  watch: {
    scrollHeight(val) {
      console.log(val + "-------ddddd-----this.scrollHeight");
    },
  },
  created() {
    this.userInfo = myJsTools.getItem("patientInfo");
    this.id = this.userInfo.patientId;
    this.userId = this.userInfo.userId;
    this.docId = myJsTools.getItem("token_info").docId;
    this.docImg = myJsTools.getItem("token_info").docImg;
    this.chatId = this.id.toLowerCase() + "," + this.docId.toLowerCase();
    this.clearSearch();
  },
  mounted() {
    this.prescription_indate = myJsTools.getItem(
      "global_config"
    ).prescription_indate;
    //初始化加载数据
    this.setHeight();
    this.$nextTick(() => {
      var container = this.$refs.msgDiv;
      //滚动到底部
      setTimeout(() => {
        this.scrollHeight = container.scrollHeight;
        container.scrollTo(0, this.scrollHeight);
      }, 10);
      container.addEventListener('scroll', (e) => {
        //这里的2秒钟定时是为了避免滑动频繁，节流
        setTimeout(() => {
          let height = parseInt(myJsTools.getItem("headerHeight"));
          if (parseInt(container.scrollTop) + parseInt(container.clientHeight) + height >= container.scrollHeight) {
            if (this.newInfoTips) {
              this.newChatNum = 0;
              this.newInfoTips = false;
            }
          }
          if (this.listQuery.minNum == 0) {
            return;
          }
          //滑到顶部时触发下次数据加载
          if (e.target.scrollTop == 0) {
            //将scrollTop置为10以便下次滑到顶部
            e.target.scrollTop = 10;
            //这里的定时是为了在列表渲染之后才使用scrollTo。
            setTimeout(async () => {
              //加载数据
              await this.initData();
              e.target.scrollTo(0, this.scrollHeight - 30);//-30是为了露出最新加载的一行数据
            }, 100);
          }
        }, 2000);
      });
    })
  },
  methods: {
    //漫游记录
    openRoamChat() {
      this.$router.push({
        name: "roamChat",
        query: {
          userId: this.userInfo.userId,
          patientId: this.id
        }
      })
    },
    // 禁止点击卡片
    disabledClickCard(type, item) {
      this.disabledClick = true;
      return;
      if (type == 'cf') {
        this.getCfDetail(item)
      } else if (type == 'wzjh') {
        this.openLineCard(item)
      } else if (type == 'qf') {
        this.openFsSend(item)
      } else if (type == 'zxxj') {
        this.consultationSummary(item)
      } else if (type == 'jyd') {
        this.openOrderDetail(item)
      } else if (type == 'zz') {
        this.openAppYy(item)
      } else if (type == 'fw') {
        this.openServiceDetail(item)
      } else if (type == 'blsq') {
        this.openBlDetail(item)
      } else if (type == 'jcd') {
        this.openCheckDetail(item)
      } else if (type == 'lb') {
        this.openScaleDetail(item)
      } else if (type == 'sf') {
        this.openFollowDetail(item)
      } else if (type == 'mbxf') {
        this.continuedCf(item)
      }

    },
    //慢病需方
    continuedCf(item) {
      this.$router.push({
        name: "prescription",
        query: {
          businessId: item.ext.businessId,
          pageType: "continutredCf",//慢病续方
          userId: this.userId,
          isSubsequent: this.isSubsequent
        }
      });
    },
    //检查单详情
    openCheckDetail(item) {
      this.$router.push({
        name: "checkDetail",
        query: item.ext
      })
    },
    // 打开群发详情接口
    openFsSend(groupInfoId) {
      this.$router.push({
        name: "fsendLook",
        query: {
          sendId: groupInfoId,
          type: "look", //只查看
        },
      });
    },
    // 打开咨询小结
    consultationSummary(type) {
      if (!this.regId) {
        this.disabledClick = true;
        return;
      }
      //type 1为聊天窗口已发送的点击  2为右上角去填写咨询小结
      this.$router.push({
        name: "consultationSummary",
        query: {
          regId: this.regId,
          userId: this.userId,
          id: this.id,
          type: type,
        },
      });
    },
    //获取用户信息
    getUserInfo() {
      getLabInfo({
        docId: this.docId,
        patientId: this.id,
      }).then((res) => {
        //console.log(res);
        let patientInfo = res.data.labPatientVO;
        let docInfo = res.data.labdocVO;
        this.lisUserInfo = {
          age: patientInfo.age,
          ageUnit: patientInfo.ageUnit,
          birthDate: patientInfo.birthDate,
          idNo: patientInfo.idNo,
          patientName: patientInfo.patientName,
          sex: patientInfo.sex,
          sexCode: patientInfo.sexCode,
          telNo: patientInfo.telNo,
          hosName: docInfo.hosName,
          docIdNo: docInfo.idNo,
          docName: docInfo.docName,
          docTelNo: docInfo.telNo,
          deptName: this.userInfo.deptName,
        };
        this.userInfo.sexCode = patientInfo.sexCode;
        this.userInfo.birthDate = patientInfo.birthDate;
        this.userInfo.docId = this.docId;
        this.userInfo.idNo = docInfo.idNo;
        this.userInfo.docName = docInfo.docName;
        this.userInfo.telNo = docInfo.telNo;
        myJsTools.setItem("patientInfo", this.userInfo);
      });
    },
    //打开检验单详情
    openOrderDetail(item) {
      api.openFrame({
        name: "orderDetail",
        url: myJsTools.getItem("pageUrl") + "cloud/lisHos/index.html#/appOrderList", //https://llootong.net/cloud/cloudLis/official-accounts/index.html#/appCreateOrder
        pageParam: {
          plm_id: item.ext.plmId,
          lisUserInfo: this.lisUserInfo,
        },
        rect: {
          x: 0,
          y: api.safeArea.top,
          w: "auto",
          h: "auto",
        },
      });
    },
    //打开问诊详情
    openAppYy(item) {
      let query = {
        regId: this.regId,
        subsequent: "复诊",
        visitTypeName: "图文",
      };
      if (item.ext.referralStatus == "1") {
        query.docName = item.ext.docName;
      }
      this.$router.push({
        name: "appYy",
        query: query,
      });
    },
    //病例授权 打开问诊详情
    openBlDetail(item) {
      let subsequent;
      if (item.ext.subsequent == "0") {
        subsequent = "咨询";
      } else if (item.ext.subsequent == "1") {
        subsequent = "复诊";
      } else if (item.ext.subsequent == "2") {
        subsequent = "转诊";
      }
      if (item.ext.authorizeStatus == '2') {
        this.$router.push({
          name: "appYy",
          query: {
            type: item.ext.ppbType,
            regId: item.ext.regIdSq,
            sponsorDocName: item.ext.sponsorDocName,
            subsequent: subsequent,
            hosId: item.ext.hosId
          }
        })
      }
    },
    //关闭播放的视频
    closeVideo(item, index) {
      //console.log("关闭视频播放，暂停视频");
      var video = document.getElementById(item.mid);
      video.pause();
      this.playVideo = false;
    },
    // 打开处方详情审方
    getCfDetailSh(item) {
      let title;
      if (item.ext.status == "1") {
        title = "已通过";
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.ext.businessId,
            title: title,
          },
        });
      } else if (item.ext.status == "0") {
        title = "未通过";
        this.$router.push({
          name: "prescDetail",
          query: {
            status: title,
            businessId: item.ext.businessId,
          },
        });
      }
    },
    // 打开随访计划详情
    openFollowDetail(item) {
      this.$router.push({
        name: "hascarriedPlan",
        query: {
          plsId: item.ext.plsId,
        },
      });
    },
    //问诊单详情
    openScaleDetail(sendId) {
      getPatientFeedback({
        sendId: sendId,
        patientId: this.id,
      }).then((res) => {
        // isFeedback 0为未反馈，1 已反馈
        this.$router.push({
          name: "patientScale",
          query: {
            sendId: sendId,
            isFeedback: res.data.isFeedback,
            patientId: this.id,
          },
        });
      });
    },
    //打开服务详情
    openServiceDetail(item) {
      this.$router.push({
        name: "serviceDetail",
        query: {
          customBussinessId: item.ext.customBussinessId
        }
      })
    },
    // 出诊表
    openLineCard(type) {
      let query = {
        type: "chat",
      };
      if (type == 1) {
        this.$router.push({
          name: "lineCard",
          query: query,
        });
      } else {
        this.$router.push({
          name: "onLineCard",
          query: query,
        });
      }
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.showImgPic = false;
    },
    showHisImg(list) {
      this.showImgPic = true;
      this.images = list;
    },
    // 打开资料服务页面
    openImp() {
      this.$router.go(-1);
    },
    // 头部底部适配 // 键盘事件
    setHeight() {
      this.$nextTick(() => {
        var container = this.$refs.msgDiv;
        if (container) {
          this.msgHeight =
            api.winHeight -
            parseFloat(container.getBoundingClientRect().top) - 35;
        }
      });

      let st = setTimeout(() => {
        this.scrollBottom();
        clearTimeout(st);
      }, 100);
    },
    //聊天记录滚动到最底部
    scrollBottom() {
      this.$nextTick(() => {
        var container = this.$refs.msgDiv;
        if (container) {
          this.scrollHeight = container.scrollHeight;
          container.scrollTo(0, this.scrollHeight);
        }
      });
    },
    initData() {
      let minNum = this.listQuery.minNum - this.listQuery.limit;
      if (minNum < 0) {
        minNum = 0;
      }
      for (var i = this.listQuery.minNum; i > minNum; i--) {
        if (i < 0) {
          break;
        } else {
          this.getCardStatus(this.oneList[i - 1], i - 1);
          this.list.unshift(this.oneList[i - 1]);
        }
      }
      this.listQuery.minNum = minNum;
      this.listQuery.page++;
    },
    //图片获取
    changeTabs() {
      if (this.active == 1) {
        this.getImgList();
      } else {
        setTimeout(() => {
          this.scrollBottom();
        }, 200);
      }
    },
    getImgList() {
      let list = this.oneList;
      let arr = [];
      let temp = new myJsTools.HashMap();
      console.log(JSON.stringify(temp));
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.messType == 'image') {
          let time = date.format(item.time).split(" ")[0];
          if (temp.containsKey(time)) {
            let temp_item = temp.get(time);
            temp_item.imgList.unshift(item.content);
            temp.put(time, temp_item);
          } else {
            let temp_item = {};
            temp_item.dateTime = time;
            temp_item.imgList = [item.content];
            temp.put(time, temp_item);
          }
        }
      }
      var allImgList = temp.keySet();
      for (var k = 0; k < allImgList.length; k++) {
        var tem_item = temp.get(allImgList[k])
        arr.push(tem_item);
      }
      arr.sort(function (a, b) {
        return a.dateTime - b.dateTime; //时间反序
      });
      this.imgHisList = arr;
      console.log(JSON.stringify(arr) + "----------图片列表");
    },
    //设置已读以及调取接口获取数据信息
    getCardStatus(element, index) {
      if (element.ext.cfbusinessCode) {
        getPrescriptionCardInfo({
          businessCode: element.ext.cfbusinessCode,
        }).then((res) => {
          element.ext.ysStstus = res.data.ysStstus;
          element.ext.diagName = res.data.diagName;
          element.ext.businessId = res.data.businessId;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.sendId) {
        getPatientFeedback({
          patientId: this.id,
          sendId: element.ext.sendId,
        }).then((res) => {
          element.ext.isFeedback = res.data.isFeedback;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.referralId) {
        getReferralRecord({
          referralId: element.ext.referralId,
        }).then((res) => {
          //console.log(JSON.stringify(res) + "-----------------是否已挂号");
          element.ext.referralStatus = res.data.referralStatus;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.customBussinessId) {
        findCustomServicePayStatus({
          customBussinessId: element.ext.customBussinessId
        }).then(res => {
          //console.log(JSON.stringify(res) + "-----------------自定义服务支付状态");
          element.ext.paystatus = res.data.status;
          this.$set(this.oneList, index, element);
        })
      } else if (element.ext.authorizeId) {
        getMedicalAuthorizeStatus({
          authorizeId: element.ext.authorizeId
        }).then(res => {
          //console.log(JSON.stringify(res) + "-----------------病例授权");
          element.ext.authorizeStatus = res.data.authorizeStatus;
          this.$set(this.oneList, index, element);
        })
      } else if (element.ext.ppiId) {
        getProPacsStatus({
          ppiId: element.ext.ppiId
        }).then(res => {
          // console.log(JSON.stringify(res) + "-----------------检查单");
          element.ext.status = res.data.status;
          this.$set(this.oneList, index, element);
        })
      }
    },
    // 搜索历史记录
    searchChat() {
      this.list = [];
      let list = this.oneList;
      var len = this.oneList.length;
      var arr = [];
      for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (JSON.stringify(list[i]).indexOf(this.searchVal) >= 0) {
          arr.push(list[i]);
        }
      }
      this.oneList = arr;
      this.listQuery.total = this.listQuery.minNum = this.oneList.length;
      this.listQuery.size = this.oneList.length / this.listQuery.limit;
      this.initData();
    },
    clearSearch() {
      this.list = [];
      let list = this.$store.getters.getOneChatList(this.chatId);
      console.log(JSON.stringify(list) + "--------sssssssss-----------------list");
      if (list) {
        list.chatRecordList.map(item => {
          this.oneList.push(item);
        })
      }
      this.listQuery.total = this.listQuery.minNum = this.oneList.length;
      this.listQuery.size = this.oneList.length / this.listQuery.limit;
      this.initData();
      var container = this.$refs.msgDiv;
      //滚动到底部
      setTimeout(() => {
        this.scrollHeight = container.scrollHeight;
        container.scrollTo(0, this.scrollHeight);
      }, 10);
    },
    // 打开处方详情
    // 打开处方详情
    getCfDetail(item) {
      let title;
      if (item.ext.isSubsequent == '0') {
        title = "处方建议详情";
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.ext.businessId,
            title: title,
          },
        });
      } else if (item.ext.isSubsequent == '1') {
        if (item.ext.ysStstus == "0") {
          title = "待审方";
        } else if (item.ext.ysStstus == "1") {
          title = "已通过";
        } else if (item.ext.ysStstus == "2") {
          title = "未通过";
          this.$router.push({
            name: "prescDetail",
            query: {
              status: title,
              businessId: item.ext.businessId,
            },
          });
        }
        if (item.ext.ysStstus == "0" || item.ext.ysStstus == "1") {
          this.$router.push({
            name: "waitPassPerSetail",
            query: {
              businessId: item.ext.businessId,
              title: title,
            },
          });
        }
      }
    },
    // 点击播放语音
    audioPlay(item, url, index) {
      // 点击播放/暂停图片时，控制音乐的播放与暂停
      var audio = document.getElementById(url);
      let me = this;
      // 改变播放/暂停图片
      if (audio.paused) {
        audio.play();
        item.playStatus = true;
        audio.onended = function () {
          console.log("播放结束");
          item.playStatus = false;
          me.$set(me.chatList[me.id.toLowerCase()], index, item);
        };
        console.log("播放");
      } else {
        console.log("暂停");
        audio.pause();
        item.playStatus = false;
      }
      this.$set(this.chatList[this.id.toLowerCase()], index, item);
    },
    // 点击查看图片
    lookImg(imgUrl) {
      console.log(imgUrl);
      this.showImgPic = true;
      this.images = [imgUrl];
    },
    // 转换图片表情
    customEmoji(value) {
      return `<img src="https://llootong.net/cloud/hisImg/static/faces/${value}" style="width:15px;height:15px"/>`;
    },
    // 收到的消息处理之后进行显示，文字和表情
    renderTxt(txt = "") {
      let rnTxt = [];
      let match = null;
      const regex = /(\[.*?\])/g;
      let start = 0;
      let index = 0;
      while ((match = regex.exec(txt))) {
        index = match.index;
        if (index > start) {
          rnTxt.push(txt.substring(start, index));
        }
        if (match[1] in WebIM.Emoji.obj) {
          const v = WebIM.Emoji.obj[match[1]];
          rnTxt.push(this.customEmoji(v));
        } else {
          rnTxt.push(match[1]);
        }
        start = index + match[1].length;
      }
      rnTxt.push(txt.substring(start, txt.length));
      return rnTxt.toString().replace(/,/g, "");
    },
  }
};
</script>

<style scoped lang="less">
.historyDiv {
  background: #fff !important;
}

/deep/ .van-search {
  padding: 5px 0px;
}

/deep/ .van-search__content {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.van-cell {
  align-items: center;
}

.searchDiv {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  font-size: 14px;

  .searchIcon {
    width: 22px;
    height: 22px;
    padding: 10px 16px;
  }

  span {
    color: #14a0e6;
    font-size: 12px;
    line-height: 18px;
    padding: 12px 0 12px 11px;
  }

  .searchField {
    width: 85%;
    margin: 0 12px;

    .van-field {
      width: 100%;
    }
  }

  div {
    input {
      width: 100%;
    }
  }
}

.focusState {
  position: absolute;
}

.menuList {
  position: absolute;
  top: -33px;
  right: 40px;
  z-index: 99999;
}

.menuLeftList {
  position: absolute;
  top: -20px;
  z-index: 99999;
  left: 7%;
  right: 0;

  .brageTag {
    left: 10%;
  }
}

.chatMenu {
  background: #050607;
  color: #ffffff;
  font-size: 12px;
  line-height: 33px;
  text-align: center;
  border-radius: 7px;
  // width: 62%;
  display: inline-block;

  span {
    border-left: 1px solid #474747;
    padding: 0 17px;
  }

  :nth-child(1) {
    border: none;
  }
}

.brageTag {
  width: 0;
  height: 0;
  border: 10px solid transparent; //所有border都是透明的，
  border-top-color: black; //只有尖相对的方向border有颜色
  position: absolute;
  left: 85%;
  top: 30px;
  display: inline-block;
}

header {
  position: fixed;
  z-index: 1;
  top: 0;

  background: #ffffff;
  border-bottom: 1px solid #ebebeb;

  .header {
    display: flex;
    padding-bottom: 15px;
    align-items: center;
  }

  .dropDownList {
    position: absolute;
    padding: 15px 10px 5px;
    width: 83px;
    top: 30px;
    right: 12px;
    color: #333333;
    font-size: 14px;
    background: url("../../assets/img/chat/top_back.png") no-repeat center;
    background-size: 100% 100%;

    li {
      line-height: 15px;
      padding-top: 7px;
      padding-bottom: 8px;
      border-bottom: 0.5px solid #EEEEEE;

      img {
        display: inline-block;
        margin: 0;
        padding: 0;
        vertical-align: middle;
      }

      span {
        vertical-align: middle;
      }
    }

    .bottomLi {
      border: none;
    }
  }

  img {
    margin-top: 8px;
    padding: 0 15px;
  }

  .backIcon {
    width: 24px;
    height: 24px;
  }

  .moreIcon {
    width: 22px;
    height: 22px;
  }

  .title {
    padding: 4px 0;
    width: 80%;
    text-align: center;

    .name {
      color: #333333;
      font-size: 18px;
      /*font-weight: 800;*/
      line-height: 20px;
    }

    .money {
      color: #666660;
      font-size: 11px;
      line-height: 16px;
    }
  }
}

.overLay {
  position: relative;

  .passImg {
    width: 25px;
    height: 41px;
    position: absolute;
    right: 12px;
    top: -15px;
  }
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #f0f0f0;
  width: 100%;
  z-index: 999;

  .emoPng {
    width: 20px;
    height: 20px;
    display: inline-block;
    padding: 10px;
  }


  .chatDiv {
    display: flex;
    padding: 10px 12px;
    align-items: flex-end;

    img {
      width: 22px;
      padding-top: 4px;
      height: 22px;
    }

    .mouthTok {
      width: 70%;
      background: #ffffff;
      color: #333333;
      line-height: 32px;
      border-radius: 30px;
      text-align: center;
      margin-left: 10px;
      margin-right: 10px;
    }

    .chatInput {
      -webkit-user-select: text;
      width: 63%;
      box-sizing: border-box;
      outline: 0px;
      margin-left: 10px;
      margin-right: 10px;
      line-height: 22px;
      padding: 2px 10px 0px;
      min-height: 22px;
      max-height: 78px;
      border-radius: 30px;
      border: 1px solid #ebebeb;
      font-size: 14px;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      overflow: scroll;

      .text-emoji {
        width: 22px;
        height: 22px;
        padding-top: 5px;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .addIcon {
      margin-left: 10px;
    }

    button {
      line-height: 28px;
      background: #14a0e6;
      font-size: 14px;
      color: #ffffff;
      padding: 0 10px;
      border-radius: 4px;
      margin-left: 8px;
      max-height: 30px;
    }
  }

  .van-swipe {
    padding-bottom: 39px;

    .van-swipe__indicator {
      background-color: #d8d8d8 !important;
    }
  }

  .panel {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;

    div {
      width: 25%;
      text-align: center;
      color: #676d75;
      font-size: 11px;
      line-height: 16px;
      margin-top: 10px;
    }

    img {
      width: 64px;
      height: 64px;
      margin: 2px;
      display: inline-block;
      border-radius: 25px;
      background: #f7f4f8;
    }

    .zzImg {
      width: 35px;
      height: 35px;
      padding: 15px;
    }
  }

  .addComWords {
    text-decoration: none;
    padding-left: 150px;
    color: #14a0e6;
    font-size: 14px;
  }

  .swiper_comWords {
    margin-bottom: 15px;

    .van-row {
      font-size: 14px;
      color: #333333;
      padding: 10px 16px;
    }
  }

  .van-popup {
    border-radius: 0 !important;

    .addDiv {
      color: #333333;
      text-align: center;
      font-size: 16px;
      margin: 12px 0;
    }

    .textarea {
      border: 1px solid #e0e0e0;
      width: 343px;
      margin-left: 16px;
      padding: 6px 8px !important;
      margin-bottom: 16px;
    }

    .fr {
      .van-button {
        width: 70px;
        height: 28px;
        font-size: 14px;
      }

      .van-button:last-child {
        margin: 0 16px 0 8px;
      }
    }
  }
}

.recordDiv {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  display: flex;
  padding: 42px;
  border-radius: 8px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
}

.header .back_icon {
  padding-left: 10px;
}

.header img {
  width: 22px;
  height: 22px;
}

.interview {
  background: #fdf8db;
  font-size: 14px;
  line-height: 20px;
  padding: 10px 0;
  color: #333333;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;

  .van-count-down {
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    display: inline;
  }

  .wzzIcon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .closeWz {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
}

.user_name {
  flex: 1;
  text-align: center;
  color: #333333;
  font-size: 18px;
}

#msgDiv {
  background-color: #fafafa;
  font-family: -apple-system;
  overflow: auto;
  padding: 10px 16px 20px;
  position: relative;
  /*height: 79.5vh;*/
  font-family: "-apple-system", "Helvetica Neue", "Roboto", "Segoe UI",
  sans-serif;
}

.chat-sender {
  clear: both;
  font-size: 80%;
  position: relative;

  img {
    width: 40px;
    height: 40px;
  }

  .audioGif {
    width: 15px;
    height: 15px;
    display: inline-block;
    vertical-align: middle;
  }

  .playAudioBtn {
    background: #d6f1ff;
  }
}

.chat-sender div:nth-of-type(1) {
  float: left;
}

.chat-sender div:nth-of-type(2) {
  margin: 0 50px 2px 50px;
  padding: 0px;
  color: #848484;
  font-size: 80%;
  text-align: left;
}

.chat-sender div:nth-of-type(3) {
  float: left;
  max-width: 70%;
  margin: 10px 0 0.266667rem 0.266667rem;
  border-top-left-radius: 4px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background: #d6f1ff;
  padding: 10px;
  font-size: 14px;

  .audio {
    width: 62px;
    line-height: 20px;

    img {
      position: relative;
      top: -1px;
    }
  }
}

.chat-receiver {
  .playAudioBtn {
    background: #ffffff;
  }
}

.chat-sender {
  .playAudioBtn {
    background: inherit;
  }
}

.chat-receiver, .chat-sender {
  clear: both;
  font-size: 14px;
  position: relative;
  line-height: 21px;

  img {
    width: 40px;
    height: 40px;
  }

  .cfSuggestSpan,
  .wzSuggestSpan {
    padding: 12px;
    color: #333333;
    font-size: 14px;
    text-align: left;
    display: block;
    width: 100%;

    .title,
    .zdText {
      font-weight: 700;
    }

    .cfSuggest {
      display: flex;

      img {
        width: 40px;
        height: 40px;
        margin-top: 12px;
        margin-right: 12px;
      }

      .textDiv {
        width: 80%;
      }

      .zdText {
        margin-top: 13px;
      }

      .groupInfo {
        img {
          width: 40px;
        }
      }
    }
  }

  .audioGif {
    width: 15px;
    height: 15px;
    display: inline-block;
    vertical-align: middle;
  }


}

.chat-center {
  clear: both;
  line-height: 18px;
  text-align: center;
  font-size: 11px;
  padding: 15px 0;

  .tipsText {
    color: #ffffff;
    background: rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    padding: 0 9px;
    line-height: 18px;
  }

  .editMsg {
    color: #14a0e6;
    margin-left: 8px;
  }
}

.readSpan {
  color: #999999;
  font-size: 12px;
  display: inline-block;
  width: 45px;
  position: absolute;
  left: -1.4rem;
  bottom: 0;
}

.messageDiv {
  background: #ffffff;
  /*border: 0.5px solid rgba(0, 0, 0, 0.08);*/
  border-top-left-radius: 16px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 10px;
}

.chat-receiver div:nth-of-type(1) {
  float: right;
}

.chat-receiver div:nth-of-type(2) {
  margin: 0px 55px 2px 55px;
  padding: 0px;
  color: #848484;
  font-size: 70%;
  text-align: right;
}

.chat-receiver div:nth-of-type(3) {
  float: right;
  max-width: 70%;
  text-align: left;
  background-color: #ffffff;
  margin: 3px 3px 10px 5px;
  border-top-left-radius: 9px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  /*padding: 10px 10px 10px 10px;*/
  // border-radius: 7px;
  .audio {
    width: 62px;
    line-height: 20px;

    img {
      position: relative;
      top: -1px;
    }
  }
}

.chat-receiver div:first-child .userImg,
.chat-sender div:first-child .userImg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /*border-radius: 10%;*/
}

.receicePic {
  width: 40px;
  height: 40px;
}

audio {
  width: 220px;
}

.textSpan {
  display: flex;
  font-size: 14px;
  position: relative;
}

.msgDiv button {
  padding: 20px;
}

.friedPopup {
  padding: 20px;
  width: 70%;
  text-align: center;

  .title {
    color: #333333;
    font-size: 16px;
    line-height: 23px;
  }

  .tipsInfo {
    margin-top: 28px;
    color: #333333;
    font-size: 12px;
    line-height: 17px;
  }

  .friedBtns {
    margin-top: 36px;
    display: flex;
    text-align: center;

    button {
      width: 45%;
      font-size: 16px;
      line-height: 34px;
      border: 1px solid #14a0e6;
      border-radius: 23px;
      display: inline-block;
    }

    :nth-child(1) {
      background: #ffffff;
      color: #14a0e6;
    }

    :nth-child(2) {
      background: #14a0e6;
      color: #ffffff;
      margin-left: 10px;
    }
  }
}

.sendIng {
  width: 5px;
  height: 5px;
}

.words {
  height: 300px;
  overflow: scroll;
}

.popup {
  width: 80%;
  background: rgba(0.5, 0, 0, 0);
  text-align: center;

  .title {
    margin-top: 12px;
  }

  .van-cell {
    padding: 5px 25px;
    border: 1px solid #ebebeb;
  }

  .van-radio__label {
    margin-left: 13px;
    color: #323233;
    line-height: 20px;
  }

  .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: #14a0e6;
    border-color: #14a0e6;
  }

  .raiodList {
    margin-bottom: 10px;
  }

  .loginIcon {
    width: 112px;
    height: 112px;
    position: relative;
    top: -50%;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .tipsInfo {
    background: #ffffff;
    border-radius: 8px;
    padding: 40px 38px 17px 38px;

    .title {
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 17px;
    }

    p {
      color: #666666;
      font-size: 16px;
      line-height: 22px;
    }

    .btns {
      button {
        line-height: 34px;
      }
    }

    .cancel {
      border: none;
      letter-spacing: 2px;
      color: #666666;
      font-size: 14px;
      margin-top: 16px;
      background: #ffffff;
    }
  }

  .draft {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px 20px 14px 20px;

    .title {
      color: #333333;
      font-size: 16px;
      font-family: PingFangSC-Medium, sans-serif;
      margin-top: 0;
      line-height: 22px;
      margin-bottom: 16px;
    }

    .words {
      color: #333333;
      font-size: 12px;
      font-family: PingFangSC-Medium, sans-serif;
      margin-bottom: 36px;
    }

    .btns {
      display: flex;
      text-align: center;
      margin: 18px 0;

      button {
        line-height: 34px;
        text-align: center;
        font-size: 16px;
        border-radius: 25px;
        width: 47%;
      }

      .refund {
        border: 1px solid #14a0e6;
        color: #14a0e6;
        background: #ffffff;
      }

      .commit {
        border: none;
        background: #14a0e6;
        color: #ffffff;
        margin-left: 8px;
      }
    }

    .van-radio {
      margin-left: 10%;
    }
  }

  /deep/ .van-checkbox {
    padding: 6px 15px;
    font-size: 14px;
  }
}

.btns {
  display: flex;
  text-align: center;
  margin: 18px auto;

  button {
    line-height: 49px;
    text-align: center;
    font-size: 16px;
    border-radius: 25px;
    width: 50%;
  }

  .refund {
    border: 1px solid #14a0e6;
    color: #14a0e6;
    background: #ffffff;
  }

  .commit {
    border: none;
    background: #14a0e6;
    color: #ffffff;
    margin-left: 8px;
  }
}

.video {
  position: relative;

  img {
    width: 132px;
    height: 61.45px;
  }

  .playIcon {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.vanPopupVideo {
  text-align: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

video {
  display: inline-block;
  width: 95%;
}

.closeTimePopup {
  width: 81%;
  color: #333333;
  font-size: 16px;
  line-height: 22px;
  padding: 20px;
  text-align: center;
  font-weight: 600;

  .content {
    margin-top: 28px;
    margin-bottom: 19px;

    div {
      font-size: 12px;
      line-height: 17px;
    }
  }

  .btns {
    margin: 0 auto;
    text-align: center;

    button {
      width: 45%;
      background: #fff;
      color: #14a0e6;
      font-size: 16px;
      line-height: 34px;
    }

    :nth-child(1) {
      border: 1px solid #14a0e6;
    }

    :nth-child(2) {
      background: #14a0e6;
      color: #fff;
      margin-left: 20px;
    }
  }
}

.tipsPopup {
  width: 60%;

  button {
    margin: 0 auto;
  }
}

.textSpanSender {
  flex-wrap: wrap;
  word-wrap: break-word;
  word-break: normal;
}

.myIcon {
  width: 22px;
  height: 22px;
}

.imgDiv {
  display: flex;
  flex-wrap: wrap;
}

.dateTitle {
  padding: 11px 16px;
  color: #666666;
  font-size: 11px;
}

.historyImg {
  width: 24%;
  height: 95px;
  margin-top: 5px;
  object-fit: cover;
}

.closeTimePopup {
  width: 81%;
  color: #333333;
  font-size: 16px;
  line-height: 22px;
  padding: 20px;
  text-align: center;
  font-weight: 600;

  .content {
    margin-top: 28px;
    margin-bottom: 19px;

    div {
      font-size: 12px;
      line-height: 17px;
    }
  }

  .btns {
    margin: 0 auto;
    text-align: center;

    button {
      width: 45%;
      background: #fff;
      color: #14a0e6;
      font-size: 16px;
      line-height: 34px;
    }

    :nth-child(1) {
      border: 1px solid #14a0e6;
    }

    :nth-child(2) {
      background: #14a0e6;
      color: #fff;
      margin-left: 20px;
    }
  }
}

.tipsPopup {
  width: 60%;

  button {
    margin: 0 auto;
  }
}
</style>
