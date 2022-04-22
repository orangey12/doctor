<template>
  <div class="chat" id="chat">
    <header ref="headerRef" :style="{ paddingTop: paddingTop }">
      <div class="chatHeader">
        <img
          src="../../assets/img/chat/back.png"
          class="icon-width-height-sm-24"
          @click="goBack"
        />
        <div class="title" v-if="userInfo">
          <li class="name" v-if="userInfo.patientMemo">
            {{ userInfo.patientMemo }}({{ userInfo.patientName }})
          </li>
          <li class="name" v-else-if="userInfo.memo">
            {{ userInfo.memo }}({{ userInfo.patientName }})
          </li>
          <li class="name" v-else>{{ userInfo.patientName }}</li>
          <li class="money">
            <span>{{ userInfo.isSubsequent == "0" ? "咨询" : "复诊" }}</span>
            <span v-if="userInfo.cost">服务费{{ userInfo.cost }}元/次</span>
          </li>
        </div>
        <img
          src="../../assets/img/index/more.png"
          class="icon-width-height-sm"
          @click="clickImg"
        />
        <ul
          class="dropDownList"
          v-if="dropDownList"
          :style="{ top: headerHeight }"
        >
          <li @click="endInterrogation">
            <img src="@/assets/img/chat/endInterrogation.png" alt/>
            <span>结束问诊</span>
          </li>
          <li @click="withdrawal">
            <img src="@/assets/img/chat/withdrawal.png" alt/>
            <span>退诊</span>
          </li>
          <li @click="complaint">
            <img src="@/assets/img/chat/complaint.png" alt/>
            <span>投诉</span>
          </li>
          <li @click="consultationSummary(2)">
            <img src="@/assets/img/chat/consultationSummary .png" alt/>
            <span>咨询小结</span>
          </li>
          <li @click="openChatAppYy" class="bottomLi">
            <img src="@/assets/img/chat/wzxq.png" alt/>
            <span>问诊详情</span>
          </li>
        </ul>
      </div>
      <div class="interview" ref="interview" v-if="docCloseTime == 0">
        <img src="../../assets/img/chat/wzz.png" class="wzzIcon"/>
        <div>
          距离问诊结束还有
          <van-count-down
            :time="usedTime"
            format="HH时mm分ss秒"
            v-if="24 * 3600 * 1000 >= usedTime > 0"
          />
          <van-count-down
            :time="usedTime"
            format="DD天HH时mm分ss秒"
            v-if="usedTime > 24 * 3600 * 1000"
          />
        </div>
        <img
          src="../../assets/img/chat/closeWz.png"
          class="closeWz"
          @click="closeWzzTime"
        />
      </div>
    </header>
    <div>
      <div style="display: none">{{ chatList }}</div>
      <div
        id="msgDiv"
        ref="msgDiv"
        @click.stop="changePanel"
        :style="{ marginTop: interviewTop + 'px' }"
      >
        <div v-for="(item, index) in list" :key="index">
          <div class="chat-center" v-if="item.type == 'time'">
            <span class="tipsText">{{ item.time }}</span>
          </div>
          <div
            class="chat-receiver"
            v-if="item.type == 'receive' && item.content"
          >
            <span class="menuList menuLeftList" v-if="index == pressIndex">
              <span class="chatMenu">
                <span
                  @click="forwardPatient(item)"
                  v-if="item.messType == 'text' || item.messType == 'image'"
                >转发</span
                >
                <span v-if="item.messType == 'audio'">扬声器播放</span>
                <span @click="deleteChat(item, index)">删除</span>
              </span>
              <span class="brageTag"></span>
            </span>
            <div @click="openImp">
              <img v-zlazy="userInfo.patientImg" class="userImg"/>
            </div>
            <div></div>
            <div class="messageDiv" @touchstart="showmenu($event, index, item)" @touchend="emptyTime"
                 @touchmove="gotouchmove">
              <span class="textSpan textSpanSender" @dblclick="showBigText(item.content)"
                    v-if="item.messType == 'text' && !item.ext.businessId && item.ext.type != 'jcdsq'"
                    v-html="renderTxt(item.content)"></span>
              <span class="textSpan" @click="continuedCf(item)" v-if="item.messType == 'text' && item.ext.businessId">
                  <div class="cfSuggestSpan">
                    <li class="title">慢病续方</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/mbxf.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li class="tips">患者给您发送了慢病续方申请，点击查看</li>
                      </div>
                    </div>
                  </div>
                </span>
              <span class="textSpan" v-if="item.messType == 'text' && item.ext.type == 'jcdsq' && item.ext.status == '1'">
                  <div class="cfSuggestSpan">
                    <li class="title">受访者{{userInfo.patientName}}同意了您的红外检测单查看授权</li>
                    <div class="cfSuggest">
                      <div>
                        <li class="zdText2">查看地址：{{ item.ext.authUrl }}</li>
                        <li class="zdText2">授权码：{{ item.ext.authCode }}</li>
                        <li class="zdText2">手机号：{{ item.ext.authTelNo }}</li>
                      </div>
                    </div>
                  </div>
                </span>
              <van-image width="140" :src="item.content" v-if="item.messType == 'image'"
                         @click="lookImg(item.content)"/>
              <div class="audio" @click="audioPlay(item, item.mid, index)" v-if="item.messType == 'voice'">
                <audio class="audioPlay" :id="item.mid" :src="item.content"></audio>
                <button class="playAudioBtn">
                  <img
                    src="../../assets/img/chat/right.gif"
                    class="audioGif"
                    v-if="item.playStatus"
                  />
                  <img
                    src="../../assets/img/chat/right.png"
                    class="audioGif"
                    v-else
                  />
                  {{ item.duration }}s
                </button>
              </div>
              <div class="video" v-if="item.messType == 'video'">
                <video
                  :src="item.content"
                  :id="item.mid"
                  :playsinline="true"
                  :poster="item.thumbnailLocalPath"
                  controls
                ></video>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="chat-sender" v-if="item.type == 'send' && item.content">
            <span class="menuList" v-if="index == pressIndex">
              <span class="chatMenu">
                <span
                  v-if="(item.messType == 'text' &&
                      !item.ext.czbType  &&
                      !item.ext.groupInfoId &&
                      !item.ext.regId  &&
                      !item.ext.sendId  &&
                      !item.ext.plmId  &&
                      !item.ext.plsId && !item.ext.pliId &&
                      !item.ext.cfbusinessCode  &&
                      !item.ext.customBussinessId &&
                      item.ext.type != 'jcdsq' &&
                      !item.ext.ppiId) ||
                      item.messType == 'image'"
                  @click="forwardPatient(item)"
                >转发</span>
                <span v-if="item.messType == 'voice'">扬声器播放</span>
                <span @click="withdrawMsg" v-if="withdraStatus">撤回</span>
                <span @click="deleteChat(item, index)">删除</span>
              </span>
              <span class="brageTag"></span>
            </span>
            <div>
              <img v-zlazy="docImg" class="userImg" :onerror="defaultImg"/>
            </div>
            <div></div>
            <div style="display: flex; position: relative">
              <span class="readSpan" v-if="item.status == 'unread'">未读</span>
              <span class="readSpan" v-if="item.status == 'read'">已读</span>
              <span class="readSpan sendSpan" v-if="item.status == 'failed'">
                <img src="../../assets/img/chat/failed.png" class="sendIng"/>
              </span>
              <span class="readSpan sendSpan" v-if="item.status == 'sending'">
                <img src="../../assets/img/chat/sending.gif" class="sendIng"/>
              </span>
              <div
                class="messageDiv"
                @touchstart="showmenu($event, index, item)"
                @touchend="emptyTime"
                @touchmove="gotouchmove"
              >
                <span
                  class="textSpan textSpanSender"
                  @dblclick="showBigText(item.content)"
                  v-if="
                    item.messType == 'text' &&
                    !item.ext.cfbusinessCode &&
                    !item.ext.czbType &&
                    !item.ext.groupInfoId &&
                    !item.ext.regId &&
                    !item.ext.sendId &&
                    !item.ext.plsId &&
                    !item.ext.plmId &&
                    !item.ext.referralId &&
                    !item.ext.customBussinessId &&
                    !item.ext.authorizeId &&
                    !item.ext.ppiId &&
                    !item.ext.pliId &&
                    !item.ext.type &&
                    !item.ext.businessId
                  "
                  v-html="renderTxt(item.content)"
                ></span>
                <span
                  class="textSpan"
                  @click="getCfDetail(item)"
                  v-if="
                    item.messType == 'text' &&
                    item.ext.cfbusinessCode &&
                    item.ext.isSubsequent == '1'
                  "
                >
                  <div class="cfSuggestSpan">
                    <li class="title">处方</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/rp.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li class="tips">您给患者开具了处方，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.ysStstus == '0'">
                    <span>
                      <img
                        src="../../assets/img/chat/waitPass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '1'">
                    <span>
                      <img
                        src="../../assets/img/chat/pass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '2'">
                    <span>
                      <img
                        src="../../assets/img/chat/notPass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="getCfDetail(item)"
                  v-if="
                    item.messType == 'text' &&
                    item.ext.cfbusinessCode &&
                    item.ext.isSubsequent == '0'
                  "
                >
                  <div class="cfSuggestSpan">
                    <li class="title">处方建议</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/rp.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.diagName }}</li>
                        <li class="tips">您给患者开具了处方，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.ysStstus == '0'">
                    <span>
                      <img
                        src="../../assets/img/chat/waitPass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '1'">
                    <span>
                      <img
                        src="../../assets/img/chat/pass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.ysStstus == '2'">
                    <span>
                      <img
                        src="../../assets/img/chat/notPass.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openCheckDetail(item)"
                  v-if="item.messType == 'text' && item.ext.ppiId"
                >
                  <div class="cfSuggestSpan">
                    <li class="title">检查单</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/jcd.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.ppiDiag }}</li>
                        <li class="tips">您给患者开具了检查单，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay">
                    <span>
                      <img
                        src="../../assets/img/chat/ysx.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '0'"
                      />
                      <img
                        src="../../assets/img/chat/dzf.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '1'"
                      />
                      <img
                        src="../../assets/img/chat/dqd.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '2'"
                      />
                      <img
                        src="../../assets/img/chat/djc.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '3'"
                      />
                      <img
                        src="../../assets/img/chat/ddscbg.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '4'"
                      />
                      <img
                        src="../../assets/img/chat/ycbg.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '5'"
                      />
                      <img
                        src="../../assets/img/chat/ytf.png"
                        class="passImg"
                        v-if="item.ext.orderStatus == '6'"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openLisDetail(item)"
                  v-if="item.messType == 'text' && item.ext.pliId"
                >
                  <div class="cfSuggestSpan">
                    <li class="title">检验单</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/jcd.png" class="rpPng"/>
                      <div>
                        <li class="zdText">诊断：{{ item.ext.ppiDiag }}</li>
                        <li class="tips">您给患者开具了检验单，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay">
                    <span>
                      <img src="../../assets/img/chat/ysx.png" class="passImg" v-if="item.ext.orderStatus == '0'"/>
                      <img src="../../assets/img/chat/dzf.png" class="passImg" v-if="item.ext.orderStatus == '1'"/>
                      <img src="../../assets/img/chat/dqd.png" class="passImg" v-if="item.ext.orderStatus == '2'"/>
                      <img src="../../assets/img/chat/djc.png" class="passImg" v-if="item.ext.orderStatus == '3'"/>
                      <img src="../../assets/img/chat/ddscbg.png" class="passImg" v-if="item.ext.orderStatus == '4'"/>
                      <img src="../../assets/img/chat/ycbg.png" class="passImg" v-if="item.ext.orderStatus == '5'"/>
                      <img src="../../assets/img/chat/ytf.png" class="passImg" v-if="item.ext.orderStatus == '6'"/>
                      <img src="../../assets/img/chat/dqy.png" class="passImg" v-if="item.ext.orderStatus == '7'"/>
                      <img src="../../assets/img/chat/dps.png" class="passImg" v-if="item.ext.orderStatus == '8'"/>
                      <img src="../../assets/img/chat/dqs.png" class="passImg" v-if="item.ext.orderStatus == '9'"/>
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openLineCard(item.ext.czbType, item.ext.vrTempType)"
                  v-if="item.messType == 'text' && item.ext.czbType"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">问诊加号</li>
                    <div class="cfSuggest">
                      <img src="../../assets/img/chat/czb.png" class="rpPng"/>
                      <div>
                        <li class="zdText">医师：{{ docName }}</li>
                        <li class="tips">您给患者发送了出诊表，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  class="textSpan"
                  @click="openFsSend(item.ext.groupInfoId)"
                  v-if="item.messType == 'text' && item.ext.groupInfoId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">群发</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/group.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li class="tips">
                          您给患者发送了一条群发消息，点击查看详情
                        </li>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  class="textSpan"
                  @click="consultationSummary(1)"
                  v-if="item.messType == 'text' && item.ext.type=='zxxj'"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">咨询小结</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zzxj.png" width="40px"/>
                      <div>
                        <li class="zdText">问诊总结</li>
                        <li class="tips">
                          您给患者发送了咨询小结，点击查看详情
                        </li>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  class="textSpan"
                  v-if="item.messType == 'text' && item.ext.type=='call'"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">{{ item.ext.isVideo == '1' ? '视频通话' : '语音通话' }}</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zzxj.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.isVideo == '1' ? '视频通话' : '语音通话' }}</li>
                        <li class="tips">
                          您给患者发送了{{ item.ext.isVideo == '1' ? '视频通话' : '语音通话' }}邀请
                        </li>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  class="textSpan"
                  @click="openOrderDetail(item)"
                  v-if="item.messType == 'text' && item.ext.plmId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">检验单</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/jyd.png" width="40px"/>
                      <div>
                        <li class="zdText">检验单</li>
                        <li class="tips">您给患者开具了检验单，点击查看详情</li>
                      </div>
                    </div>
                  </div>
                </span>
                <span
                  class="textSpan"
                  @click="openAppYy"
                  v-if="item.messType == 'text' && item.ext.referralId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">转诊</li>
                    <div class="cfSuggest groupInfo">
                      <img
                        src="../../assets/img/chat/zhuanzhen.png"
                        width="40px"
                      />
                      <div>
                        <li class="zdText">转诊到{{ item.ext.docName }}</li>
                        <li class="tips">
                          您将患者转诊到了{{
                            item.ext.docName
                          }}，点击查看转诊详情
                        </li>
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
                  @click="openAppYy"
                  v-if="item.messType == 'text' && item.ext.type == 'jcdsq'"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">申请授权</li>
                    <div class="cfSuggest groupInfo jcsq">
                      <img src="../../assets/img/chat/sqsq.png" width="40px"/>
                      <div>
<!--                        <li class="zdText"></li>-->
                        <li class="zdTextInfo">您向患者{{ userInfo.patientName }}申请了红外检测单查看授权</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.status == '0'">
                    <span>
                      <img src="../../assets/img/chat/dqr.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.status == '1' || item.ext.status == '3'">
                    <span>
                      <img src="../../assets/img/chat/yty.png" class="passImg"/>
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.status == '2'">
                    <span>
                      <img src="../../assets/img/chat/ybh.png" class="passImg"/>
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openServiceDetail(item)"
                  v-if="item.messType == 'text' && item.ext.customBussinessId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">服务</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/zdyfw.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.customBussTitle }}</li>
                        <li class="tips">{{ item.ext.customBussMemo }}</li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.paystatus == '0'">
                    <span>
                      <img
                        src="../../assets/img/chat/notPay.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.paystatus == '1'">
                    <span>
                      <img
                        src="../../assets/img/chat/dfw.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.paystatus == '2'">
                    <span>
                      <img
                        src="../../assets/img/chat/yfw.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.paystatus == '7'">
                    <span>
                      <img
                        src="../../assets/img/chat/refund.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openBlDetail(item)"
                  v-if="item.messType == 'text' && item.ext.authorizeId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">授权</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/sq.png" width="40px"/>
                      <div>
                        <li class="zdText">病例授权</li>
                        <li class="tips">
                          您给患者发送了病例授权申请，请等待患者授权
                        </li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '1'">
                    <span>
                      <img
                        src="../../assets/img/chat/waitSq.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '2'">
                    <span>
                      <img
                        src="../../assets/img/chat/isSq.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.authorizeStatus == '3'">
                    <span>
                      <img
                        src="../../assets/img/chat/notSq.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openScaleDetail(item.ext.sendId)"
                  v-if="item.messType == 'text' && item.ext.sendId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">量表</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/lb.png" width="40px"/>
                      <div class="textDiv">
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li class="tips">
                          您给患者发送了量表，点击查看患者反馈结果吧
                        </li>
                      </div>
                    </div>
                  </div>
                  <span class="overLay" v-if="item.ext.isFeedback == '0'">
                    <span>
                      <img
                        src="../../assets/img/chat/notWhite.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                  <span class="overLay" v-if="item.ext.isFeedback == '1'">
                    <span>
                      <img
                        src="../../assets/img/chat/white.png"
                        class="passImg"
                      />
                    </span>
                  </span>
                </span>
                <span
                  class="textSpan"
                  @click="openFollowDetail(item)"
                  v-if="item.messType == 'text' && item.ext.plsId"
                >
                  <div class="wzSuggestSpan">
                    <li class="title">随访</li>
                    <div class="cfSuggest groupInfo">
                      <img src="../../assets/img/chat/sf.png" width="40px"/>
                      <div>
                        <li class="zdText">{{ item.ext.title }}</li>
                        <li class="tips">
                          您给患者发送了一条随访消息，点击查看详情
                        </li>
                      </div>
                    </div>
                  </div>
                </span>
                <van-image
                  width="140"
                  :src="item.content"
                  v-if="item.messType == 'image'"
                  @click="lookImg(item.content)"
                />
                <div
                  class="audio"
                  @click="audioPlay(item, item.mid, index)"
                  v-if="item.messType == 'voice'"
                >
                  <audio
                    class="audioPlay"
                    :id="item.mid"
                    :src="item.content"
                  ></audio>
                  <button class="playAudioBtn">
                    {{ item.duration }}s
                    <img
                      src="../../assets/img/chat/left.gif"
                      class="audioGif"
                      v-if="item.playStatus"
                    />
                    <img
                      src="../../assets/img/chat/left.png"
                      class="audioGif"
                      v-else
                    />
                  </button>
                </div>
                <div class="video" v-if="item.messType == 'video'">
                  <video
                    :src="item.content"
                    :id="item.mid"
                    :poster="item.thumbnailLocalPath"
                    :playsinline="true"
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
          <!-- 撤回消息 -->
          <div class="chat-center" v-if="item.type == 'withdraw'">
            <span class="tipsText">你撤回了一条消息</span>
            <span class="editMsg" v-if="item.messType == 'text'" @click="editMsg(item)">重新编辑</span>
          </div>

          <!--红外授权提示信息-->
          <div class="chat-center2" v-if="item.type == 'jcdsqAgree' && item.messType == 'jcdsqAgree'">
            <span class="tipsText">{{item.content}}</span>
          </div>

          <!-- 撤回消息 -->
          <div class="chat-center" v-if="item.type == 'reWithdraw'">
            <span class="tipsText">{{ name }}撤回了一条消息</span>
          </div>

          <div class="chat-center" v-if="item.status == 'failed'">
            <span class="tipsText">该患者为无效患者，消息无法送达</span>
          </div>

          <div
            class="newInfoTips"
            v-if="newInfoTips"
            :style="{ bottom: bottomHeight + 'px' }"
          >
            <img
              src="../../assets/img/chat/down.png"
              class="icon-width-height-sm-16"
              @click="scrollBottom"
            />
            <div>{{ newChatNum }}条新消息 <span>|</span></div>
            <img
              src="../../assets/img/chat/close_tip.png"
              class="icon-width-height-sm-16"
              @click="newInfoTips = false"
            />
          </div>

          <div id="wrapper"></div>
        </div>
      </div>
    </div>
    <!-- 结束问诊 -->
    <van-popup v-model="closeInterrogation" round class="popup">
      <li class="title">结束问诊</li>
      <li class="tipsInfo">结束后，患者与您不能继续沟通</li>
      <div class="btns">
        <button class="publicWhiteBtn" @click="commitJudge(true)">取消</button>
        <button class="publicBtn" @click="commitJudge(false)">确定</button>
      </div>
    </van-popup>
    <!-- 退诊 -->
    <van-popup v-model="showRetreatRe" round class="popup">
      <div class="tipsInfo">
        <li class="title">退诊原因</li>
        <van-radio-group
          v-model="retreatResult"
          icon-size="18"
          @change="changeResult"
        >
          <van-radio
            :name="item.optionCode"
            v-for="(item, index) in retreatList"
            :key="index"
            class="raiodList"
          >{{ item.optionName }}
          </van-radio>
          <van-radio name="qt" class="raiodList">其他原因</van-radio>
          <van-field
            v-model="resultMessage"
            rows="2"
            autosize
            maxlength="50"
            type="textarea"
            placeholder="请输入原因"
          />
        </van-radio-group>
        <div class="btns">
          <button class="publicWhiteBtn" @click="showRetreatRe = false">
            取消
          </button>
          <button class="publicBtn" @click="refundInquiry">确定</button>
        </div>
      </div>
    </van-popup>
    <!-- 投诉 -->
    <van-popup v-model="complaintPopup" round class="popup">
      <div class="tipsInfo">
        <li class="title">投诉原因</li>
        <van-radio-group
          v-model="complaintResult"
          icon-size="18"
          @change="changeComplaintResult"
        >
          <van-radio
            :name="item.optionCode"
            v-for="(item, index) in complaintList"
            :key="index"
            class="raiodList"
          >
            {{ item.optionName }}
          </van-radio>
          <van-radio name="qt" class="raiodList">其他原因</van-radio>
          <van-field
            v-model="complaintMessage"
            rows="2"
            autosize
            maxlength="50"
            type="textarea"
            placeholder="请输入原因"
            show-word-limit
          />
        </van-radio-group>
        <div class="btns">
          <button class="publicWhiteBtn" @click="complaintPopup = false">
            取消
          </button>
          <button class="publicBtn" @click="complaintInquiry">确定</button>
        </div>
      </div>
    </van-popup>
    <div v-show="show" class="recordDiv">
      <img src="../../assets/img/chat/recordBtn.png" class="recordBtn"/>
      <img src="../../assets/img/chat/1.gif" alt/>
    </div>
    <footer ref="footerRef">
      <div class="chatDiv">
        <img
          src="../../assets/img/chat/voice.png"
          class="voiceIcon"
          @click="changeInputToRe"
          v-if="!recoredBtn"
        />
        <div
          contenteditable
          class="chatInput"
          :style="!sendVal ? { width: '70%' } : { width: '60%' }"
          v-if="!recoredBtn"
          ref="area"
          @input="changeTxt"
          @click="changePanel"
        ></div>
        <img
          src="../../assets/img/chat/keyboard.png"
          class="voiceIcon"
          @click="changeInputToRe"
          v-if="recoredBtn"
        />
        <p
          class="mouthTok"
          v-if="recoredBtn"
          id="parentObj"
          ref="parentObj"
          @touchstart="startRecord($event)"
          @touchend="stopRecord('audio')"
          @touchmove="gotouchmove"
        >
          按住说话
        </p>
        <img
          src="../../assets/img/chat/expression.png"
          class="expressionIcon"
          @click.stop="changeEmoj"
        />
        <img
          src="../../assets/img/chat/add.png"
          class="addIcon"
          v-if="!sendVal"
          @click="showFunctionPanel"
        />
        <button
          v-else
          @click="sendTimes(1)"
          :style="
            !sendVal ? { padding: ' 0 0.24rem' } : { padding: ' 0 0.38rem' }
          "
        >
          发送
        </button>
      </div>
      <div class="emojDiv" v-show="emojShow">
        <img
          :src="require(`@/assets/img/emotion/${item.name}.png`)"
          alt
          v-for="(item, index) in emoList"
          :key="index"
          class="emoPng"
          @click="addEmoji(item)"
        />
      </div>
      <div v-if="panelShow" ref="panelDiv">
        <van-swipe class="my-swipe" :loop="false" indicator-color="#676D75">
          <van-swipe-item>
            <div class="panel">
              <div @click="sendTimes(2)">
                <img src="../../assets/img/chat/sj_zp.png" alt/>
                <li>相册</li>
              </div>
              <div @click="sendTimes(3)">
                <img src="../../assets/img/chat/ps.png" alt/>
                <li>拍摄</li>
              </div>
              <van-action-sheet
                v-model="showPic"
                :actions="actions"
                cancel-text="取消"
                close-on-click-action
                style="width: 100%"
              />
              <div @click="callPatient">
                <img src="../../assets/img/chat/videoCall.png" alt/>
                <li>视频通话</li>
              </div>
              <div @click="sendTimes(5)">
                <img src="../../assets/img/chat/sj_kjhf.png" alt/>
                <li>快捷回复</li>
              </div>
              <div @click="openAddCf('', 'add')">
                <img src="../../assets/img/chat/sj_cfzd.png" alt/>
                <li>诊断开方</li>
              </div>
              <div @click="getSwitch(7)">
                <img src="../../assets/img/chat/jcdsq.png" alt/>
                <li>
                  检测单授权</li>
              </div>
              <div @click="getSwitch(6)">
                <img src="../../assets/img/chat/kjyd.png" alt/>
                <li>开检验单</li>
              </div>
              <div @click="getSwitch(5)">
                <img src="../../assets/img/chat/kjyd.png" alt/>
                <li>开特检单</li>
              </div>

            </div>
          </van-swipe-item>
          <van-swipe-item>
            <div class="panel">
              <div @click="getSwitch(4)">
                <img src="../../assets/img/chat/kjcd.png" alt/>
                <li>开检查单</li>
              </div>
              <div @click="getSwitch(2)">
                <img src="../../assets/img/chat/zz.png" alt/>
                <li>转诊</li>
              </div>
              <div @click="sendScale">
                <img src="../../assets/img/chat/sj_wzb.png" alt/>
                <li>发送量表</li>
              </div>
              <div @click="sendTimes(6)">
                <img src="../../assets/img/chat/sj_yyjz.png" alt/>
                <li>出诊表</li>
              </div>
              <div @click="notOpenTips = true">
                <img src="../../assets/img/chat/tjjy.png" alt/>
                <li>体检建议</li>
              </div>
              <div @click="sendTimes(7)">
                <img src="../../assets/img/chat/fwtj.png" alt/>
                <li>服务推荐</li>
              </div>
              <div @click="notOpenTips = true">
                <img src="../../assets/img/chat/hjzx.png" alt/>
                <li>患教中心</li>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>
        <van-action-sheet
          v-model="showLineCard"
          :actions="lineActions"
          cancel-text="取消"
          close-on-click-action
          style="width: 100%"
          @select="onSelect"
        />
      </div>
      <div class="words" v-if="comWords">
        <div class="addComWords font-login-color-blue" @click="addComWords">
          + 添加常用语
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          @load="onLoad"
        >
          <div class="swiper_comWords">
            <van-swipe-cell
              class="vanSwiper"
              v-for="(item, index) in commonWords"
              :key="index"
            >
              <van-row @click="swiperWords(item)">
                <div>{{ item.quickInputName }}</div>
              </van-row>
              <template #right style="display: flex" v-if="item.docId !== null">
                <button class="edit" @click="edit(index, item)">编辑</button>
                <button class="del" @click="dele(index, item)">删除</button>
              </template>
            </van-swipe-cell>
          </div>
        </van-list>
      </div>
    </footer>
    <van-popup v-model="showDialog" position="bottom" class="bottom-popup">
      <div class="title">添加常用语</div>
      <van-field
        v-model="addMessage"
        type="textarea"
        maxlength="30"
        placeholder="请输入常用语"
        show-word-limit
        class="textarea"
      />
      <div class="limitBtn">
        <span>最多30个汉字</span>
        <div>
          <button class="cancelBtn" @click="cancel">取消</button>
          <button class="sureBtn" @click="confirm">添加</button>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="showEditDialog"
      position="bottom"
      :style="{ height: '200px' }"
    >
      <div class="addDiv">修改常用语</div>
      <van-field
        v-model="editMessage"
        type="textarea"
        maxlength="30"
        placeholder="请输入常用语"
        show-word-limit
        class="textarea"
      />
      <span style="margin-left: 18px; color: #999999; font-size: 12px"
      >最多30个汉字</span
      >
      <div class="fr">
        <van-button round color="#D1D1D1" @click="editCancel">取消</van-button>
        <van-button round color="#14A0E6" @click="editConfirm">添加</van-button>
      </div>
    </van-popup>
    <van-popup class="popup" v-model="verificationShow" round>
      <li class="title">结束提醒</li>
      <li class="content">
        <div>患者已结束问诊，不可回复消息</div>
        <div>是否增送5次回复次数</div>
      </li>
      <div class="btns">
        <button class="publicWhiteBtn" @click="verificationShow = false">
          取消
        </button>
        <button class="publicBtn" @click="giveAway">赠送</button>
      </div>
    </van-popup>
    <van-popup class="popup" v-model="notOpenTips" round>
      <li class="title">暂未开通</li>
      <li class="content">
        <div>暂未开通，敬请期待</div>
      </li>
      <div class="btns">
        <button class="publicBtn commitBtn" @click="notOpenTips = false">
          确定
        </button>
      </div>
    </van-popup>
    <van-popup class="popup" v-model="notQxTips" round>
      <li class="title">暂无权限</li>
      <li class="content">
        <div>暂无权限，请联系医院开通权限</div>
      </li>
      <div class="btns">
        <button class="publicBtn commitBtn" @click="notQxTips = false">
          确定
        </button>
      </div>
    </van-popup>
    <!--regId不存在时的提醒-->
    <van-popup class="popup" v-model="businessTips" round>
      <li class="title">暂未挂号</li>
      <li class="content">
        <div>患者尚未挂号，无法进行诊断开方等操作</div>
      </li>
      <div class="btns">
        <button class="publicBtn commitBtn" @click="businessTips = false">
          确定
        </button>
      </div>
    </van-popup>
    <!--结束问诊提醒-->
    <van-popup class="popup" v-model="notRegIdTips" round>
      <li class="title">
        <span v-if="bunissType == '1'">结束问诊</span>
        <span v-if="bunissType == '2'">退诊</span>
      </li>
      <li class="content">
        <div v-if="patientJzStatus == '0'">暂无进行中的问诊</div>
      </li>
      <div class="btns">
        <button class="publicBtn commitBtn" @click="notRegIdTips = false">
          确定
        </button>
      </div>
    </van-popup>
    <!--暂无权限提示-->
    <van-popup class="popup" v-model="notVideoQx" round>
      <li class="title">提示</li>
      <li class="content">
        <div>该次问诊，暂无权限为患者提供该功能</div>
      </li>
      <div class="btns">
        <button class="publicBtn commitBtn" @click="notVideoQx = false">
          确定
        </button>
      </div>
    </van-popup>

    <van-popup @click="showText = false" v-model="showText" class="allPopup">
      <div>
        <span v-html="renderTxt(spanText)"></span>
      </div>
    </van-popup>

    <img-save
      v-if="showImgPic"
      :showPic="showImgPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import apiFun from "@/utils/api.js";
import {Toast} from "vant";
import {
  updateCloseChatTime,
  getIsCloseChatTime,
  updateReturnReceive,
} from "@/api/docList";
import {getPrescriptionCardInfo, updateBussStatus} from "@/api/cf";
import {
  saveQuickInput,
  updateQuickInput,
  getSysOptionConfig,
} from "@/api/docList";
import myJsTools from "../../utils/myJsTools";
import date from "@/utils/date";
import imgSave from "@/common/imgSave";
import {
  cancelMessage,
  findAppidAndOpenidAndUseridByPatientId,
  getGiveTimesById,
  getLabInfo,
  getMedicalAuthorizeStatus,
  getReferralRecord,
  getRegAndPatientInfoByPatient,
  saveGiveTimes,
  saveProComplain,
  saveProLab,
  saveReferralRecord,
  hangUpVideo,
  queryVideoTimeRemaining,
  getProLisStatus,
  getAgoraToken,
  getVisitingPersonInfo,


} from "../../api/chat";
import {getQuickInputInfo, updateEndReceive} from "../../api/docList";
import avatar from "@/assets/img/my/default.png";
import {
  getPatientFeedback,
  getSysCodeByType,
  saveProFlockSend,
} from "../../api/scale";
import eschatUnit from "../../utils/eschat";
import {
  findCustomServicePayStatus,
  getDocSwitch,
  saveCustomServiceInfo,
} from "../../api/myService";
import {getProPacsStatus} from "../../api/check";
import ajPushTools from "../../utils/ajPush";
import {getDiagPrescriptionIsNoUseDrug} from "../../api/cf";
// import {getSysPlatformConfigBykey} from "../../api/login";


// 使用浏览器内置api fetch 请求
const Fetch = async (url, body) => {
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      version: '1.3.7',
      clientType: 'W',
      firmId: 'dev',
    },
    body: JSON.stringify(body),
  });
  res = await res.json();
  return res;
};

// 开始录制
const getAgoraVideoRecordingStart = async (body) => {
  const url =
    'https://dev.llootong.net/his/chat/tools/getAgoraVideoRecordingStart';
  return await Fetch(url, body);
};

// 结束录制
const getAgoraVideoRecordingStop = async (body) => {
  const url =
    'https://dev.llootong.net/his/chat/tools/getAgoraVideoRecordingStop';
  return await Fetch(url, body);
};

var agoraRtc, easeChat, recMp3;
var imgs = [];
export default {
  props: {},
  components: {imgSave},
  data() {
    return {
      patientJzStatus: "0", //接诊状态 1 接诊中 其他都为未接诊状态
      showText: false, //双击放大文字显示
      spanText: "",
      lisUserInfo: {}, //lis 送检信息
      radio: "", // 覆盖保存选择
      dropDownList: false, // 右侧-点
      closeInterrogation: false, // 结束问诊弹框
      showRetreatRe: false, // 退诊弹框
      retreatResult: [],
      retreatList: [],
      complaintPopup: false, // 投诉弹框
      complaintResult: [],
      complaintList: [],
      resultMessage: "", //退诊替他原因
      complaintMessage: "", // 投诉其他原因
      showRefundMessage: false,
      showComplaintMessage: false,
      name: "",
      msgHeight: "",
      duration: "",
      inputDisabled: false,
      amr: null,
      AgoraVideoTab: '', //1data不为空，0data为空
      sendVal: "",
      docCloseTime: 1,
      prescription_indate: "",
      AgoraVideoQuery: {},
      emoList: [
        {
          name: "ee_1",
          text: "[):]",
        },
        {
          name: "ee_2",
          text: "[:D]",
        },
        {
          name: "ee_3",
          text: "[;)]",
        },
        {
          name: "ee_4",
          text: "[:-o]",
        },
        {
          name: "ee_5",
          text: "[:p]",
        },
        {
          name: "ee_6",
          text: "[(H)]",
        },
        {
          name: "ee_7",
          text: "[:@]",
        },
        {
          name: "ee_8",
          text: "[:s]",
        },
        {
          name: "ee_9",
          text: "[:$]",
        },
        {
          name: "ee_10",
          text: "[:(]",
        },
        {
          name: "ee_11",
          text: "[:'(]",
        },
        {
          name: "ee_12",
          text: "[<o)]",
        },
        {
          name: "ee_13",
          text: "[(a)]",
        },
        {
          name: "ee_14",
          text: "[8o|]",
        },
        {
          name: "ee_15",
          text: "[8-|]",
        },
      ],
      userInfo: {},
      recoredBtn: false,
      emojShow: false,
      panelShow: false,
      showDialog: false,
      showEditDialog: false,
      comWords: false,
      verificationShow: false, //赠送次数框
      addMessage: "",
      editIndex: "",
      editMessage: "",
      innerText: "",
      Loop: null,
      showPress: false,
      pressIndex: -1,
      showImgPic: false, //保存图片组件
      images: [],
      index: 0,
      actions: [{name: "拍照"}, {name: "相册"}],
      showPic: false,
      withdraStatus: true, //是否可撤回
      commonWord: false,
      commonWords: [],
      loadData: {
        limit: 10,
        page: 1,
        size: 1,
      }, //诊断请求参数
      loading: false, // 是否处在加载状态
      finished: false, // 是否已加载完成
      paddingTop: "",
      headerHeight: "",
      usedTime: "",
      isSubsequent: 0, //咨询或者复诊，只有复诊可开方
      id: "",
      defaultImg: 'this.src="' + avatar + '"',
      show: false, //显示遮罩层
      docId: "",
      playVideo: false,
      userId: "", //患者用户id
      docName: "",
      showLineCard: false,
      lineActions: [],
      auth_timetimer: null,
      chatId: "", //聊天标识id
      ipath: [],
      docImg: "",
      notOpenTips: false,//暂未开放的功能提醒
      notRegIdTips: false,//暂未挂号提醒
      businessTips: false,//业务 regId不存在时 显示业务提示
      bunissType: "",//1结束问诊，2退诊，3 投诉
      notQxTips: false,//暂无权限提示
      lisBtnQx: "1",//lis开检验单按钮权限
      checkBtnQx: "1",//检查单按钮权限
      jcdsqBtnQx:"",//检测单授权按钮
      oneList: [],//单人聊天记录
      list: [],
      listQuery: {
        page: 1,
        limit: 20,
        size: 1,
        total: 0,
      },
      scrollHeight: 0,
      newInfoTips: true, //新消息提示
      bottomHeight: "", //消息提示高度
      newChatNum: "", //新消息条数
      interviewTop: 0, //倒计时高度
      lastScrollHeight: "", //上一次的滚动高度
      groupId: "", //患者和医生创建的群组id
      confId: "", //会议id
      streamId: "",
      agoraAppID: "", //声网的appid
      agoraToken: "",
      receiveStatus: "0",
      swUid: "", //声网需要的uid
      otheruid: "", //患者视频的uid
      vioceindex: 0,
      surplusDuration: "",
      notVideoQx: false, //暂无权限拨打视频
      visitTypeCode: "", //挂号类型  1图文 2语音  3 电话  4视频
    };
  },
  computed: {
    chatList() {
      // 聊天自动滚动到底部
      let chatList = this.$store.getters.getChatList;
      let list = [];
      chatList.map((item) => {
        if (item.id == this.chatId) {
          list = item.chatRecordList;
        }
      });
      //有新消息时 判断  消息滚动到底部
      if (this.list.length >= 0 && this.oneList.length >= 0) {
        if (this.oneList.length < list.length) {
          if (list[this.oneList.length].type == "receive") {
            this.newChatNum++;
          } else {
            this.$nextTick(() => {
              var container = this.$refs.msgDiv;
              if (container) {
                this.scrollHeight = container.scrollHeight;
                container.scrollTo(0, this.scrollHeight);
              }
            });
          }
          let msg = Object.assign({}, list[this.oneList.length]);
          msg.type = "time";
          msg.status = "normal";
          let time = date.format(msg.time);
          let nowTime = date.format(new Date().getTime());
          if (time.split(" ")[0] == nowTime.split(" ")[0]) {
            time = time.split(" ")[1].slice(0, 5);
          } else {
            time = time.split(" ")[1].slice(0, 15);
          }
          msg.time = time;
          if (list.length == 1) {
            this.list.push(msg);
          } else if (
            list[this.oneList.length].time -
            list[this.oneList.length - 1].time >
            5 * 60 * 1000
          ) {
            this.list.push(msg);
          }

          this.list.push(list[this.oneList.length]);
          this.oneList.push(list[this.oneList.length]);
        }
      }
      return list;
    },
  },
  watch: {
    panelShow: function (val) {
      this.panelShow = val;
      this.$nextTick(() => {
        this.setHeight();
      });
    },
    emojShow: function (val) {
      this.emojShow = val;
      this.$nextTick(() => {
        this.setHeight();
      });
    },
    list: function (val) {
      this.$nextTick(() => {
        var container = this.$refs.msgDiv;
        setTimeout(() => {
          let height = parseInt(myJsTools.getItem("headerHeight"));
          if (
            parseInt(container.scrollTop) +
            parseInt(container.clientHeight) +
            height >=
            container.scrollHeight
          ) {
            setTimeout(() => {
              this.scrollHeight = container.scrollHeight;
              container.scrollTo(0, this.scrollHeight);
            }, 10);
            this.newChatNum = 0;
            this.newInfoTips = false;
          } else if (this.newChatNum > 0) {
            this.newInfoTips = true;
          }
        }, 10);
      });
    },
    docCloseTime: function (val) {
      this.$nextTick(() => {
        this.interviewTop = this.$refs.headerRef.clientHeight;
      });
    },
  },
  created() {
    let that = this;
    // 获取一些用户信息及接口所需参数
    this.agoraAppID = process.env.agoraAppID;

    this.userInfo = myJsTools.getItem("patientInfo");
    this.docName = myJsTools.getItem("token_info").docName;
    this.docImg = myJsTools.getItem("token_info").docImg;
    this.prescription_indate =
      myJsTools.getItem("global_config").prescription_indate;
    this.docId = myJsTools.getItem("token_info").docId;
    this.id = this.$route.query.id || this.userInfo.patientId; //患者id
    this.chatId = this.id.toLowerCase() + "," + this.docId.toLowerCase(); //聊天id  由患者id和医生id 小写拼接
    this.$nextTick(() => {
      // 禁用选择
      document.getElementById("msgDiv").onselectstart = new Function(
        "event.returnValue=false"
      );
    });
    //聊天列表获取
    let list = this.$store.getters.getOneChatList(this.chatId);
    if (list) {
      list.chatRecordList.map((item) => {
        this.oneList.push(item);
      });
      this.listQuery.total = this.listQuery.minNum = this.oneList.length;
      this.listQuery.size = this.oneList.length / this.listQuery.limit;
    }
    //头部padding
    if (myJsTools.getItem("headerHeight")) {
      this.headerHeight =
        parseInt(myJsTools.getItem("headerHeight")) - 25 + "px";
    }
    recMp3 = api.require("recMp3");
    if (process.env.NODE_ENV != "development") {
      agoraRtc = api.require("agoraRtc");
      easeChat = api.require("easeChat");
      this.paddingTop = parseInt(api.safeArea.top) + "px";
    }
    //获取出诊表的类型 线上  线下
    this.getSelectOptions();
    //获取用户信息
    this.getUserId();
    // 初始化调用接口
    this.getUserInfo();
    // 获取权限
    this.getSwitchOpen(4);
    this.getSwitchOpen(5);
    this.getSwitchOpen(6);
    // this.getConfig();
    this.getPatientImg();
    myJsTools.setPromiss();
  },

  mounted() {
    let _this = this;
    //获取挂号信息
    this.getRegInfo();
    if (process.env.NODE_ENV != "development") {
      // if (myJsTools.getItem("token_info").docId) {
      //   // this.loginHx();
      // }
      //监听事件
      this.eventLis();
      this.$nextTick(() => {
        //设置高度
        this.setHeight();
      });
      //进入聊天页面 将该聊天加入到聊天列表
      this.$store.commit("setEmptyList", {
        patientId: this.id,
        docId: this.docId,
      });
    }
    //初始化加载数据
    this.initData();
    this.$nextTick(() => {
      var container = this.$refs.msgDiv;
      this.interviewTop = this.$refs.headerRef.clientHeight;
      //滚动到底部
      setTimeout(() => {
        this.scrollHeight = container.scrollHeight;
        container.scrollTo(0, this.scrollHeight);
      }, 10);
      container.addEventListener("scroll", (e) => {
        //这里的2秒钟定时是为了避免滑动频繁，节流
        setTimeout(() => {
          let height = parseInt(myJsTools.getItem("headerHeight"));
          if (
            parseInt(container.scrollTop) +
            parseInt(container.clientHeight) +
            height >=
            container.scrollHeight
          ) {
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
              await this.initData();
              this.$nextTick(() => {
                e.target.scrollTo(0, this.scrollHeight - 30); //-30是为了露出最新加载的一行数据
              });
            }, 200);
          }
        }, 2000);
      });
    });
  },
  beforeDestroy() {
    //清除录音计时器
    clearInterval(this.auth_timetimer);
    this.auth_timetimer = null;
  },
  methods: {
    getPatientImg() {
      getVisitingPersonInfo({
        patientId: this.id,
      }).then((res) => {
        if (res.data.patientImg) {
          myJsTools.getUrl(res.data.patientImg).then((url) => {
            myJsTools.setItem("patientImg", url);
          });
        }
      });
    },
    //获取出诊表类型 线上 线下
    getSelectOptions() {
      getSysCodeByType({
        codeType: "055",
      }).then((res) => {
        res.data.map((item) => {
          item.name = item.meaning;
        });
        this.lineActions = res.data;
      });
    },
    //给患者拨打电话
    callPatient() {
      let me = this;
      if (this.patientJzStatus == "0") {
        this.notRegIdTips = true;
        return false;
      }
      if (this.visitTypeCode == "1" || this.visitTypeCode == "3") {
        this.notVideoQx = true;
        return;
      }
      //查询剩余时间
      queryVideoTimeRemaining({
        regId: me.regId,
      }).then((res) => {
        if (res.data.surplusDuration > 0) {
          me.surplusDuration = res.data.surplusDuration;
          // 打开界面
          if (me.visitTypeCode == "4") {
            me.trunOnFrame(
              "myVideo",
              0,
              api.safeArea.top,
              api.winWidth,
              api.winHeight
            );
            me.trunOnFrame("otherVideo", 0, 0, 0, 0);
            me.trunOnFrame("bottomBtn", 0, api.winHeight - 150, "auto", 200);
            me.trunOnFrame("topdiv", 16, api.safeArea.top + 34, "auto", 100);
            me.trunOnFrame("firstframe", api.winWidth - 130, 50, 120, 200);
          } else {
            me.trunOnFrame(
              "vioce",
              0,
              api.safeArea.top,
              api.winWidth,
              api.winHeight
            );
          }
          // 判断是否是声网
          // if (me.isAgoraSwitch == 1) {
          getAgoraToken({
            channelName: me.regId,
            userId: this.userId,
          }).then((res) => {
            me.agoraToken = res.data;
            // 发送邀请视频邀请
            me.sendSWcard();
            // 调用声网接口连接视频
            me.callSWVideo();
          });
          // }
        } else {
          Toast("您的通话分钟已达上限不可再进行通话");
        }
      });
    },
    getAgoraVideoApi(num) {
      if (num == 1) {
        getAgoraVideoRecordingStart({
          channelName: this.regId,
          fromUser: this.docId,
          initiatorType: 'doc',
          toUserType: '2',
          touser: this.userId,
          fromUserType: '1'
        }).then(res => {
          if (res.data) {
            console.log('getAgoraVideoRecordingStart向后台发送此次视频基本信息成功', JSON.stringify(res))
            this.AgoraVideoQuery.sid = res.data.sid
            this.AgoraVideoQuery.uid = res.data.uid
            this.AgoraVideoQuery.resourceid = res.data.resourceid
            this.AgoraVideoTab = 1
          } else {
            //第一次调用返回的data可能为空，不需要调用结束的方法，此字段是做标识用的
            this.AgoraVideoTab = 0
          }
        })
      } else {
        if (this.AgoraVideoTab != 0) {
          getAgoraVideoRecordingStop({
            channelName: this.regId,
            resourceid: this.AgoraVideoQuery.resourceid, //资源id
            uid: this.AgoraVideoQuery.uid,//录制用户Id
            sid: this.AgoraVideoQuery.sid,//用户Id
          }).then(res => {
            console.log('getAgoraVideoRecordingStop想后台发送此次视频信息关闭', JSON.stringify(res))

          })

        }
      }

    },
    //声网拨打视频
    callSWVideo() {
      this.AgoraVideoQuery = {}
      // 请求接口医生创建房间
      this.getAgoraVideoApi(1)
      let me = this;
      let s = me.visitTypeCode == "4" ? "视频通话" : "语音通话";
      // var agoraRtc = api.require("agoraRtc");
      // 初始化
      agoraRtc.init({appId: me.agoraAppID});
      agoraRtc.enableAudio(function (ret) {
        if (ret.code == 0) {
          //success
        }
      });
      // agoraRtc.leaveChannel(function(ret) {
      //   if (ret.code == 0) {
      //     //success
      //   }
      // });
      // 该回调方法表示该客户端成功加入了指定的频道。
      agoraRtc.joinChannelSuccessListener(function (ret) {
        me.swUid = ret.uid;
      });
      agoraRtc.remoteUserOfflineListener(function (ret) {
        api.sendEvent({
          name: "closeVideo",
        });
        me.closeFrames();
        //agoraRtc.setupRemoteVideo({uid: ret.uid});
      });
      agoraRtc.remoteUserJoinedListener(function (ret) {
        console.log("用户加入", JSON.stringify(ret));
        // var agoraRtc = api.require("agoraRtc");
        if (me.visitTypeCode == "4") {
          me.setFrame(
            "otherVideo",
            0,
            api.safeArea.top,
            api.winWidth,
            api.winHeight
          );
          me.otheruid = ret.uid;
          // 修改远程视频
          agoraRtc.setupRemoteVideo(
            {
              uid: ret.uid,
              rect: {
                x: 0,
                y: 0,
                w: api.winWidth,
                h: api.winHeight,
              },
              fixedOn: "otherVideo",
              renderMode: 1,
            },
            function (ret) {
              console.log(JSON.stringify(ret) + "sdffdfsdfdsfds");
              if (ret.code == 0) {
                api.sendEvent({
                  name: "videoConnect",
                });
                //success
                // apiFun.setStorage("bigFrame", "otherVideo");
                me.setFrame("myVideo", api.winWidth - 130, 50, 120, 200);
                me.setLocalVideo(0, 0, 120, 200);
                if (api.systemType == "ios") {
                  api.bringFrameToFront({
                    from: "myVideo",
                    to: "otherVideo",
                  });
                }
                myJsTools.setItem("bigFrame", "other");
                me.trunOnFrame("firstframe", api.winWidth - 130, 50, 120, 200);

              }
            }
          );
        } else {
          api.sendEvent({
            name: "videoConnect",
          });
        }
      });
      if (me.visitTypeCode == "4") {
        // 打开视频模式
        agoraRtc.enableVideo(function (ret) {
          if (ret.code == 0) {
            agoraRtc.enableLocalVideo(
              {
                enabled: true,
              },
              function (ret) {
                if (ret.code == 0) {
                  //success
                }
              }
            );
            agoraRtc.muteLocalAudioStream(
              {
                mute: false,
              },
              function (ret) {
                if (ret.code == 0) {
                  //success
                }
              }
            );
            console.log(JSON.stringify(ret), "打开视频模式");
            agoraRtc.setVideoProfile(
              {
                width: 360,
                height: 360,
                frameRate: 15,
                bitrate: 800,
              },
              function (ret) {
                if (ret.code == 0) {
                  //success
                }
              }
            );
          }
        });
      }
      // 让用户加入通话频道
      agoraRtc.joinChannel(
        {
          channel: me.regId,
          token: me.agoraToken,
        },
        function (ret) {
          console.log(JSON.stringify(ret), "加入通话频道");
          if (ret.code == 0) {
            if (me.visitTypeCode == "4") {
              //success
              me.trunOnFrame("bottomBtn", 0, api.winHeight - 150, "auto", 200);
              // 设置本地视频显示信息
              agoraRtc.setupLocalVideo(
                {
                  rect: {
                    x: 0,
                    y: 0,
                    w: api.winWidth,
                    h: api.winHeight,
                  },
                  fixedOn: "myVideo",
                  renderMode: 1,
                },
                function (ret) {
                  if (ret.code == 0) {
                    console.log(JSON.stringify(ret), "设置本地视频显示信息");
                  }
                }
              );
            } else {
            }
          }
        }
      );
    },
    // 打开frame
    trunOnFrame(name, x, y, w, h, time) {
      api.openFrame({
        name: name,
        url: api.wgtRootDir + "/html/Android/" + name + ".html",
        rect: {
          x: x,
          y: y,
          w: w,
          h: h,
        },
        pageParam: {
          time: this.surplusDuration,
          // isAgoraSwitch: this.isAgoraSwitch,
        },
      });
    },
    setLocalVideo(x, y, w, h) {
      agoraRtc.setupLocalVideo(
        {
          rect: {
            x: x,
            y: y,
            w: w,
            h: h,
          },
          fixedOn: "myVideo",
          renderMode: 1,
        },
        function (ret) {
          if (ret.code == 0) {
            console.log(JSON.stringify(ret), "setupLocalVideo");
          }
        }
      );
    },
    // 设置本地视频
    setUpRemoteVideo(x, y, w, h, uid) {
      agoraRtc.setupRemoteVideo(
        {
          rect: {
            x: x,
            y: y,
            w: w,
            h: h,
          },
          fixedOn: "otherVideo",
          renderMode: 1,
          uid: uid,
        },
        function (ret) {
          if (ret.code == 0) {
            console.log(JSON.stringify(ret), "setupRemoteVideo");
          }
        }
      );
    },
    // setHxVideo(streamId, fixedOn) {
    //   console.log("订阅别人的流sssssssetHxVideo" + streamId);
    //   let fixed = "";
    //   if (api.systemType == "ios") {
    //     fixed = false;
    //   }
    //   // var easeChat = api.require("easeChat");
    //   easeChat.subscribeConference(
    //     {
    //       streamId: streamId,
    //       rect: {
    //         x: 0,
    //         y: 0,
    //         w: "auto",
    //         h: "auto",
    //       },
    //       fixedOn: fixedOn,
    //       fixed: fixed,
    //     },
    //     function (ret, err) {
    //       console.log(JSON.stringify(ret) + "------------订阅视频流-------");
    //       if (ret.status) {
    //         // myJsTools.setItem("bigFrame", "other");
    //         // me.otherBig();
    //         console.log(JSON.stringify(ret) + "------------订阅视频流");
    //       } else {
    //         console.log(JSON.stringify(ret) + "------------订阅视频流失败");
    //       }
    //     }
    //   );
    // },
    // 设置frame属性
    setFrame(name, x, y, w, h) {
      console.log("dddddddddddddddddddddddddddddddddddddd");
      api.setFrameAttr({
        name: name,
        rect: {
          x: x,
          y: y,
          w: w,
          h: h,
        },
      });
    },
    //发送声网的卡片
    sendSWcard() {
      let ext = {
        regId: this.regId,
        appid: this.agoraAppID,
        channel: this.regId,
        type: 'call',
        isVideo: this.visitTypeCode == "4" ? "1" : "0",
      };
      let visitTypeCode = ext.isVideo == 1 ? "视频通话" : "语音通话";
      eschatUnit.sendMsg(
        `${this.docName}医生正在邀请您进行${visitTypeCode}，请点击接听`,
        this.docId,
        this.id,
        this.userId,
        ext
      );
    },
    //给患者拨打电话并创建视频流
    // callVideo() {
    //   let me = this;
    //   // var easeChat = api.require("easeChat");
    //   easeChat.starConferenceCall(
    //     {
    //       type: 10,
    //     },
    //     function (ret, err) {
    //       if (ret.status) {
    //         me.confId = ret.conference.confId;
    //         myJsTools.setItem("videoCallSratus", false);
    //         let s = me.visitTypeCode == "4" ? "视频通话" : "语音通话";
    //         // 医生正在邀请您进行${visitTypeCode}，请点击接听
    //         // text: me.docName + "邀请你进行" + s,
    //         easeChat.sendText(
    //           {
    //             conversationId: "",
    //             chatType: "chat",
    //             text: me.docName + "医生正在邀请您进行" + s + "，请点击接听",
    //             from: me.docId,
    //             to: me.userId,
    //             ext: {
    //               patientId: me.id,
    //               regId: me.regId,
    //               conferenceId: ret.conference.confId,
    //               isVideo: me.visitTypeCode == "4" ? "1" : "0",
    //               msg_extension: JSON.stringify({
    //                 inviter: me.docName,
    //                 group_id: me.groupId,
    //                 password: "123",
    //               }),
    //             },
    //           },
    //           function (res, err) {
    //             if (res.status) {
    //               let fixed = "";
    //               if (api.systemType == "ios") {
    //                 fixed = false;
    //               }
    //               eschatUnit.setData(
    //                 res,
    //                 "",
    //                 me.id,
    //                 "video",
    //                 me.userId,
    //                 me.regId,
    //                 ret.conference.confId
    //               );
    //               // 环信视频
    //               if (me.visitTypeCode == "4") {
    //                 easeChat.publishConference(
    //                   {
    //                     streamName: "ddd",
    //                     enableVideo: true,
    //                     videoResolution: 0,
    //                     rect: {
    //                       x: 0,
    //                       y: 0,
    //                       w: "auto",
    //                       h: "auto",
    //                     },
    //                     fixedOn: "myVideo",
    //                     fixed: fixed,
    //                   },
    //                   function (ret, err) {
    //                     if (ret.status) {
    //                       console.log(
    //                         JSON.stringify(ret) + "------------发布视频流"
    //                       );
    //                     } else if (err) {
    //                       console.log(JSON.stringify(err));
    //                     }
    //                   }
    //                 );
    //               } else {
    //                 // 环信语音
    //                 easeChat.publishConference(
    //                   {
    //                     streamName: "ddd",
    //                     enableVideo: false,
    //                     rect: {
    //                       x: 0,
    //                       y: 0,
    //                       w: 0,
    //                       h: 0,
    //                     },
    //                     fixedOn: "vioce",
    //                   },
    //                   function (ret, err) {
    //                     if (ret.status) {
    //                       console.log(
    //                         JSON.stringify(ret) + "------------发布音频流"
    //                       );
    //                     } else if (err) {
    //                       console.log(JSON.stringify(err));
    //                     }
    //                   }
    //                 );
    //               }
    //             } else if (err) {
    //               console.log(JSON.stringify(err));
    //             }
    //           }
    //         );
    //       } else if (err) {
    //         console.log(JSON.stringify(err));
    //       }
    //     }
    //   );
    // },
    //初始化聊天信息  分页  分时间
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
          let msg = Object.assign({}, this.oneList[i - 1]);
          msg.type = "time";
          let time = date.format(msg.time);
          let nowTime = date.format(new Date().getTime());
          if (time.split(" ")[0] == nowTime.split(" ")[0]) {
            time = time.split(" ")[1].slice(0, 5);
          } else {
            time = time.split(" ")[1].slice(0, 15);
          }
          msg.time = time;
          if (i - 2 > minNum) {
            if (
              this.oneList[i - 1].time - this.oneList[i - 2].time >
              5 * 60 * 1000
            ) {
              this.list.unshift(msg);
            }
          } else if (i == minNum + 1) {
            this.list.unshift(msg);
          }
        }
      }
      this.listQuery.minNum = minNum;
      this.listQuery.page++;
    },
    //查询检查 检验开关
    getSwitchOpen(type) {
      getDocSwitch({
        bussType: type,
        docId: myJsTools.getItem("token_info").docId
      }).then(res => {
        if (type == 5) {
          this.lisBtnQx = res.data.isSwitch
        } else if (type == 4) {
          this.checkBtnQx = res.data.isSwitch
        }else if (type == 6) {
          this.jcdsqBtnQx = res.data.isSwitch
        }
      })
    },
    //跳转问诊详情
    openChatAppYy() {
      //如果不为接诊中状态  1时，不能跳问诊详情
      if (this.patientJzStatus == "0") {
        this.notRegIdTips = true;
        return false;
      }
      this.$router.push({
        name: "appYy",
        query: {
          pageType: "chat", //处方跳转不显示按钮
          regId: this.regId,
        },
      });
    },
    //设置已读以及调取接口获取数据信息 获取卡片状态
    getCardStatus(element, index) {
      element.showPress = false;
      if (element.type == "receive") {
        if (element.status != "read") {
          this.readMsg(element, index);
        }
        element.status = "read";
      }
      if (element.type == "time") {
        return;
      }
      console.log(JSON.stringify(element) + "element");
      if (element.ext.cfbusinessCode || element.ext.businessCode) {
        let code = element.ext.cfbusinessCode || element.ext.businessCode;
        getPrescriptionCardInfo({
          businessCode: code,
        }).then((res) => {
          element.ext.ysStstus = res.data.ysStstus;
          element.ext.diagName = res.data.diagName;
          element.ext.businessId = res.data.businessId;
          element.ext.payStatus = res.data.payStatus;
          element.ext.isOfflineSelfBuyMedicine = res.data.isOfflineSelfBuyMedicine;
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
          element.ext.referralStatus = res.data.referralStatus;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.customBussinessId) {
        findCustomServicePayStatus({
          customBussinessId: element.ext.customBussinessId,
        }).then((res) => {
          element.ext.paystatus = res.data.status;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.authorizeId) {
        getMedicalAuthorizeStatus({
          authorizeId: element.ext.authorizeId,
        }).then((res) => {
          element.ext.authorizeStatus = res.data.authorizeStatus;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.ppiId) {
        getProPacsStatus({
          ppiId: element.ext.ppiId,
        }).then((res) => {
          console.log(JSON.stringify(res) + "检查状态");
          element.ext.orderStatus = res.data.status;
          this.$set(this.oneList, index, element);
        });
      } else if (element.ext.pliId) {
        getProLisStatus({
          pliId: element.ext.pliId,
        }).then((res) => {
          console.log(JSON.stringify(res) + "检验状态");
          element.ext.orderStatus = res.data.status;
          this.$set(this.oneList, index, element);
        });
      }
    },
    //环信登录
    // loginHx() {
    //   var that = this;
    //   ajPushTools.bindDoc(myJsTools.getItem("token_info").docId);
    //   easeChat.login(
    //     {
    //       username: myJsTools.getItem("token_info").docId,
    //       password: myJsTools.getItem("token_info").docId,
    //       autoLogin: true,
    //     },
    //     function (ret, err) {
    //       if (ret.status) {
    //         console.log("环信登录成功" + JSON.stringify(ret));
    //       } else {
    //         console.log("环信登录失败" + JSON.stringify(err));
    //       }
    //     }
    //   );
    // },
    goBack() {
      this.$router.go(-1);
    },
    //发送检测单
    sendJcd() {
      eschatUnit.sendMsg(
        "[申请授权]",
        this.docId,
        this.id,
        this.userId,
        {
          type: "jcdsq",
          status:'0'
        }
      );
    },
    //获取权限  检查4 检验5 处方3 转诊2 （转诊、处方不验证权限）  返回结果  1是有权限 0是无权限
    getSwitch(type) {
      if (type == 2) {
        if (!this.regId) {
          this.businessTips = true;
          return;
        }
        this.openZz();
      } else if (type == 5) {
        if (this.lisBtnQx == '1') {
          this.openLis();
        } else {
          this.notQxTips = true;
        }
      } else if (type == 4) {
        if (this.checkBtnQx == "1") {
          this.openCheck();
        } else {
          this.notQxTips = true;
        }
      } else if (type == 6) {
        this.$router.push({
          name: "addLis",
          query: {
            patientId: this.id
          }
        })
      }else if (type == 7) {
        if (this.jcdsqBtnQx == '1') {
          this.sendJcd();
        } else {
          this.notQxTips = true;
        }
      }
    },
    //根据患者id查询患者userID
    getUserId() {
      findAppidAndOpenidAndUseridByPatientId({
        patientId: this.id,
      }).then((res) => {
        this.userId = res.data.userId;
      });
    },
    //打开服务推荐
    openService() {
      this.$router.push({
        name: "sendService",
      });
    },
    //打开服务详情
    openServiceDetail(item) {
      this.$router.push({
        name: "serviceDetail",
        query: {
          customBussinessId: item.ext.customBussinessId,
          status: item.ext.paystatus,
        },
      });
    },
    //获取用户信息
    getUserInfo() {
      getLabInfo({
        docId: this.docId,
        patientId: this.id,
      }).then((res) => {
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
          deptName: docInfo.defaultDeptName,
        };
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
    //打开转诊列表
    openZz() {
      this.$router.push({
        name: "referral",
      });
    },
    //慢病需方
    continuedCf(item) {
      getDiagPrescriptionIsNoUseDrug({
        businessId: item.ext.businessId,
        docId: this.docId,
      }).then((res) => {
        this.$router.push({
          name: "prescription",
          query: {
            businessId: item.ext.businessId,
            pageType: "continutredCf", //慢病续方
            userId: this.userId,
            patientId: this.id,
            isSubsequent: this.isSubsequent,
            regId: this.regId,
          },
        });
      });
    },
    //发送量表
    sendScale() {
      this.$router.push({
        name: "sendScale",
      });
    },
    //开检验单
    openLis() {
      myJsTools.writrFile("lis跳转开检验单页面", this.lisUserInfo);
      api.openFrame({
        name: "page2",
        url:
          myJsTools.getItem("pageUrl") +
          "cloud/lisHos/index.html#/appCreateOrder", //https://llootong.net/cloud/cloudLis/official-accounts/index.html#/appCreateOrder
        pageParam: {
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
    //开检查单
    openCheck() {
      this.$router.push({
        name: "addCheck",
        query: {
          patientId: this.id,
        },
      });
    },
    //打开检验单详情
    openOrderDetail(item) {
      api.openFrame({
        name: "orderDetail",
        url:
          myJsTools.getItem("pageUrl") +
          "cloud/lisHos/index.html#/appOrderList", //https://llootong.net/cloud/cloudLis/official-accounts/index.html#/appCreateOrder
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
            userId: this.userId,
          },
        });
      });
    },

    // 获取用户挂号id
    getRegInfo() {
      getRegAndPatientInfoByPatient({
        patientId: this.id,
        docId: this.docId,
      }).then((res) => {
        console.log(JSON.stringify(res) + "--------挂号信息");
        if (res.data) {
          this.regId = res.data.regId;
          this.id = res.data.patientId;
          this.name = res.data.patientName;
          this.visitTypeCode = res.data.visitTypeCode;
          myJsTools.setItem("visitTypeCode", res.data.visitTypeCode);
          this.userInfo = Object.assign({}, res.data);
          //如果有挂号信息获取时间倒计时
          if (res.data.regId) {
            this.lisUserInfo.deptName = res.data.deptName;
            this.receiveStatus = "1";
            this.patientJzStatus = "1";
            myJsTools.setItem("patientInfo", this.userInfo);
            this.getTimeTag();
          } else {
            this.patientJzStatus = "0";
          }
        }
      });
    },
    //进页面进行消息已读回执
    readMsg(message, index) {
      //消息已读
      let me = this;
      // var easeChat = api.require("easeChat");
      easeChat.sendMessageReadAck(
        {
          conversationId: message.conversationId,
          type: "chat",
          messageId: message.mid,
        },
        function (ret, err) {
          if (ret.status) {
            message.status = "read";
            me.$store.commit("updateMessageStatus", message);
          } else {
            console.log("失败");
          }
        }
      );
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
    closeFrames() {
      let me = this;
      myJsTools.setItem("videoCallSratus", false);
      hangUpVideo({
        regId: me.regId,
        confrId: me.confId,
      }).then((res) => {
        console.log("挂断------" + JSON.stringify(res));
        api.closeFrame({
          name: "vioce",
        });
        api.closeFrame({
          name: "bottomBtn",
        });
        api.closeFrame({
          name: "myVideo",
        });
        api.closeFrame({
          name: "otherVideo",
        });
        api.closeFrame({
          name: "topdiv",
        });
        api.closeFrame({
          name: "video",
        });
        api.closeFrame({
          name: "firstframe",
        });
      });
    },
    // 事件监听
    eventLis() {
      let me = this;
      let fixed = "";
      if (api.systemType == "ios") {
        fixed = false;
      }

      api.addEventListener(
        {
          name: "keyback",
        },
        function (ret, err) {
          if (!me.showText) {
            me.$router.go(-1);
          } else {
            me.showText = false;
          }
        }
      );
      api.addEventListener(
        {
          name: "pause",
        },
        function (ret, err) {
          clearInterval(me.auth_timetimer);
          clearInterval(me.Loop);
          this.auth_timetimer = 0;
          var recMp3 = api.require("recMp3");
          recMp3.stop();
        }
      );
      // 环信监听用户加入
      // var easeChat = api.require("easeChat");
      // easeChat.addConferenceListener(function (ret) {
      //   console.log(JSON.stringify(ret) + "-----------监听订阅流成功");
      //   if (ret.eventType == "addStream" && me.visitTypeCode == "4") {
      //     myJsTools.setItem("videoCallSratus", true);
      //     api.sendEvent({
      //       name: "videoConnect",
      //     });
      //     me.trunOnFrame(
      //       "otherVideo",
      //       0,
      //       api.safeArea.top,
      //       api.winWidth,
      //       api.winHeight
      //     );
      //     easeChat.subscribeConference(
      //       {
      //         streamId: ret.stream.streamId,
      //         rect: {
      //           x: 0,
      //           y: 0,
      //           w: "auto",
      //           h: "auto",
      //         },
      //         fixedOn: "otherVideo",
      //         // fixed: fixed
      //       },
      //       function (ret, err) {
      //         console.log(JSON.stringify(ret) + "------------订阅视频流");
      //         if (ret.status) {
      //           myJsTools.setItem("bigFrame", "other");
      //           me.otherBig();
      //           console.log(JSON.stringify(ret) + "------------订阅视频流");
      //         } else {
      //           console.log(JSON.stringify(ret) + "------------订阅视频流失败");
      //         }
      //       }
      //     );
      //   }
      //   if (
      //     ret.eventType == "removeStream" ||
      //     ret.eventType == "memberDidLeave" ||
      //     ret.eventType == "conferenceDidEnd"
      //   ) {
      //     easeChat.leaveConference(function (ret, err) {
      //       console.log(JSON.stringify(ret) + "leaveConference");
      //       me.closeFrames();
      //     });
      //   }
      // });
      // 挂断
      api.addEventListener(
        {
          name: "closeVideo",
        },
        function (ret, err) {
          // if (me.isAgoraSwitch == 1) {
          //挂断请求接口房间被注销
          me.getAgoraVideoApi(2);
          // 声网关闭视频与语音
          var agoraRtc = api.require("agoraRtc");
          agoraRtc.leaveChannel(function (ret) {
            if (ret.code == 0) {
              //success
              agoraRtc.destroy();
              console.log("关闭视频通话-----------");
            }
          });
          // }
          // else {
          //   // var easeChat = api.require('easeChat');
          //   easeChat.leaveConference(function (ret, err) {
          //     console.log(JSON.stringify(ret) + "leaveConference");
          //   });
          // }
          console.log("关闭视频通话-----------");
          me.closeFrames();
        }
      );
      // 缩小画面
      api.addEventListener(
        {
          name: "smallFrame",
        },
        function (ret, err) {
          myJsTools.setItem("smallFrame", 1);
          me.setFrame("otherVideo", api.winWidth - 130, 50, 120, 200);
          me.setUpRemoteVideo(0, 0, 120, 200, me.otheruid);
          me.setFrame("myVideo", 0, 0, 0, 0);
          me.setLocalVideo(0, 0, 0, 0);
          me.setFrame("bottomBtn", 0, 0, 0, 0);
          me.setFrame("topdiv", 0, 0, 0, 0);
          api.sendEvent({
            name: "samllshowtime",
          });
        }
      );
      // 切换前后摄像头
      api.addEventListener(
        {
          name: "changeVideo",
        },
        function (ret, err) {
          // if (me.isAgoraSwitch == 1) {
          // 声网关闭视频与语音
          var agoraRtc = api.require("agoraRtc");
          agoraRtc.switchCamera(function (ret) {
            if (ret.code == 0) {
              //success
              console.log("切换摄像头成功");
            }
          });
          // } else {
          //   // var easeChat = api.require("easeChat");
          //   // easeChat.updateConferenceWithSwitchCamera();
          // }
        }
      );
      // 切换视频大小
      api.addEventListener(
        {
          name: "switchFrame",
        },
        function (ret, err) {
          // if (me.isAgoraSwitch == 1) {
          var frameName = myJsTools.getItem("bigFrame");
          if (myJsTools.getItem("smallFrame") == 1) {
            api.sendEvent({
              name: "samllhidetime",
            });
            me.setFrame("bottomBtn", 0, api.winHeight - 150, "auto", 200);
            me.setFrame("topdiv", 16, api.safeArea.top + 34, "auto", 100);
            myJsTools.setItem("smallFrame", 0);
            me.setFrame(
              "otherVideo",
              0,
              api.safeArea.top,
              api.winWidth,
              api.winHeight
            );
            me.setUpRemoteVideo(
              0,
              0,
              api.winWidth,
              api.winHeight,
              me.otheruid
            );
            me.setFrame("myVideo", api.winWidth - 130, 50, 120, 200);
            me.setLocalVideo(0, 0, 120, 200);
          } else {
            if (frameName == "other") {
              me.setFrame(
                "myVideo",
                0,
                api.safeArea.top,
                api.winWidth,
                api.winHeight
              );
              me.setLocalVideo(0, 0, api.winWidth, api.winHeight);
              me.setFrame("otherVideo", api.winWidth - 130, 50, 120, 200);
              me.setUpRemoteVideo(0, 0, 120, 200, me.otheruid);
              myJsTools.setItem("bigFrame", "myVideo");
              if (api.systemType == "ios") {
                api.bringFrameToFront({
                  from: "otherVideo",
                  to: "myVideo",
                });
              }
            } else {
              me.setFrame(
                "otherVideo",
                0,
                api.safeArea.top,
                api.winWidth,
                api.winHeight
              );
              me.setUpRemoteVideo(
                0,
                0,
                api.winWidth,
                api.winHeight,
                me.otheruid
              );
              me.setFrame("myVideo", api.winWidth - 130, 50, 120, 200);
              me.setLocalVideo(0, 0, 120, 200);
              if (api.systemType == "ios") {
                api.bringFrameToFront({
                  from: "myVideo",
                  to: "otherVideo",
                });
              }
              myJsTools.setItem("bigFrame", "other");
            }
          }
          // }
        }
      );
      // 静音
      api.addEventListener(
        {
          name: "closeVoice",
        },
        function (ret, err) {
          var agoraRtc = api.require("agoraRtc");
          agoraRtc.muteLocalAudioStream(
            {
              mute: ret.value.isMute,
            },
            function (ret) {
              if (ret.code == 0) {
                //success
              }
            }
          );

        }
      );

      api.addEventListener(
        {
          name: "sendLisOrder",
        },
        function (ret, err) {
          let ext = {
            plmId: ret.value.plmId,
            businessCode: ret.value.businessCode,
            type: "lisOrder",
          };
          saveProLab({
            patientId: me.id,
            plmId: ret.value.plmId,
            regId: me.regId,
            patientName: me.name,
            businessCode: ret.value.businessCode,
          }).then((res) => {
            eschatUnit.sendMsg("[检验单]", me.docId, me.id, me.userId, ext);
            api.closeFrame({
              name: "page2",
            });
          });
        }
      );

      api.addEventListener(
        {
          name: "sendCard",
        },
        function (ret, err) {
          let patientList = [
            {
              patientId: me.id,
            },
          ];
          let param = {
            docId: me.docId,
            patientList: patientList,
            visitRealType: ret.value.ext.czbType,
            sendType: "1",
            visitDocId: me.docId,
          };
          if (me.regId) {
            param.regId = me.regId;
          }
          saveProFlockSend(param).then((res) => {
            eschatUnit.sendMsg(
              "[出诊表]",
              me.docId,
              me.id,
              me.userId,
              ret.value.ext
            );
          });
        }
      );
      api.addEventListener(
        {
          name: "sendScaleMsg",
        },
        function (ret, err) {
          let patientList = [
            {
              patientId: me.id,
            },
          ];
          let param = {
            didId: ret.value.didId,
            docId: me.docId,
            patientList: patientList,
            sendType: "1",
          };
          if (me.regId) {
            param.regId = me.regId;
          }
          saveProFlockSend(param).then((res) => {
            me.sendScaleMsg(res.data.sendId, ret.value.title);
          });
        }
      );
      api.addEventListener(
        {
          name: "sendDoc",
        },
        function (ret, err) {
          me.sendDoc(ret.value);
        }
      );
      api.addEventListener(
        {
          name: "sendService",
        },
        function (ret, err) {
          saveCustomServiceInfo({
            docId: me.docId,
            patientId: me.id,
            customId: ret.value.ext.customId,
            customBussTitle: ret.value.ext.customBussTitle,
            customBussPrice: ret.value.ext.customBussPrice,
            customBussMemo: ret.value.ext.customBussMemo,
          }).then((res) => {
            //console.log(JSON.stringify(res) + "自定义服务发送");
            ret.value.ext.customBussinessId = res.data.customBussinessId;
            ret.value.ext.paystatus = "0";
            eschatUnit.sendMsg(
              "[自定义服务]",
              me.docId,
              me.id,
              me.userId,
              ret.value.ext
            );
          });
        }
      );
      //发送检查单
      api.addEventListener(
        {
          name: "sendCheck",
        },
        function (ret, err) {
          ret.value.ext.status = "0";
          eschatUnit.sendMsg(
            "[检查单]",
            me.docId,
            me.id,
            me.userId,
            ret.value.ext
          );
        }
      );

      //发送病历授权
      api.addEventListener(
        {
          name: "sendBlsq",
        },
        function (ret, err) {
          eschatUnit.sendMsg(
            "[病历授权]",
            me.docId,
            me.id,
            me.userId,
            ret.value.ext
          );
        }
      );

      //发送检验单
      api.addEventListener(
        {
          name: "sendLis",
        },
        function (ret, err) {
          ret.value.ext.status = "0";
          eschatUnit.sendMsg(
            "[检验单]",
            me.docId,
            me.id,
            me.userId,
            ret.value.ext
          );
        }
      );
    },

    otherBig() {
      let me = this;
      me.setFrame(
        "otherVideo",
        0,
        api.safeArea.top,
        api.winWidth,
        api.winHeight
      );
      me.setFrame("myVideo", api.winWidth - 130, 50, 120, 200);
      api.bringFrameToFront({
        from: "myVideo",
        to: "otherVideo",
      });
      setTimeout(async () => {
        await api.bringFrameToFront({
          from: "bottomBtn",
          to: "myVideo",
        });
        await api.bringFrameToFront({
          from: "topdiv",
          to: "bottomBtn",
        });
        await api.bringFrameToFront({
          from: "firstframe",
          to: "",
        });
      }, 200);
      api.sendEvent({
        name: "samllhidetime",
      });
    },

    //发送转诊医生
    sendDoc(val) {
      saveReferralRecord({
        oldRegId: this.regId,
        receivingDocId: val.receivingDocId,
        receivingDocName: val.receivingDocName,
        sponsorDocId: this.docId,
        sponsorDocName: this.docName,
        deptId: val.deptId,
        deptName: val.deptName,
      }).then((res) => {
        //console.log(JSON.stringify(res));
        let ext = {
          docId: val.receivingDocId,
          docName: val.receivingDocName,
          referralId: res.data.referralId,
          deptId: val.deptId,
          type: "zz",
          referralStatus: "0",
        };
        eschatUnit.sendMsg(
          "[转诊到" + val.receivingDocName + "]",
          this.docId,
          this.id,
          this.userId,
          ext
        );
      });
    },
    //发送量表表消息
    sendScaleMsg(sendId, title) {
      let ext = {
        sendId: sendId,
        title: title,
        type: "lb",
        isFeedback: "0",
      };
      eschatUnit.sendMsg("[量表]", this.docId, this.id, this.userId, ext);
    },
    // 发送出诊表
    openLineCard(type, vrTempType) {
      let query = {
        type: "chat",
        code: vrTempType,
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
    //选择发送线上还是线下排班
    onSelect(val) {
      this.showLineCard = false;
      let param = {
        docId: this.docId,
        docName: this.docName,
        patientId: this.id,
        patientName: this.userInfo.patientName,
        visitDocId: this.docId,
        type: "chat",
        code: val.code,
      };
      if (this.regId) {
        param.regId = this.regId;
        param.regCode = this.userInfo.regCode;
      }
      if (val.name == "线上") {
        param.visitRealType = "1";
        this.$router.push({
          name: "lineCard",
          query: param,
        });
      } else {
        param.visitRealType = "2";
        this.$router.push({
          name: "onLineCard",
          query: param,
        });
      }
    },

    //赠送次数接口
    giveAway() {
      saveGiveTimes({
        docId: this.docId,
        docName: this.docName,
        patientId: this.id,
        patientName: this.userInfo.patientName,
        giveTimes: 5,
        surplusTimes: 5,
      }).then((res) => {
        this.verificationShow = false;
      });
    },
    //关闭播放的视频
    closeVideo(item, index) {
      var video = document.getElementById(item.mid);
      video.pause();
      this.playVideo = false;
    },
    // 头部底部适配 // 键盘事件
    setHeight(type) {
      let me = this;
      var header = this.$refs.headerRef;
      var headerHeight = header.offsetHeight;
      let footerDom = this.$refs.footerRef;
      var footerHeight = footerDom.offsetHeight;
      this.bottomHeight = parseInt(footerHeight) + 20;
      var clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      console.log(
        api.winHeight +
        "----------------" +
        document.body.clientHeight +
        "----------" +
        footerHeight +
        "----------footerHeight---------" +
        headerHeight
      );
      let s = 0;
      this.msgHeight =
        document.documentElement.clientHeight -
        parseFloat(footerHeight) -
        parseFloat(headerHeight);
      this.$refs.msgDiv.style.height = this.msgHeight + "px";
      let st = setTimeout(() => {
        if (type != "close") {
          this.scrollBottom();
        }
        clearTimeout(st);
      }, 200);
      // 键盘事件
      window.onresize = function () {
        var nowClientHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let header = me.$refs.headerRef;
        let headerHeight = header.offsetHeight;
        let footerDom = me.$refs.footerRef;
        let footerHeight = footerDom.offsetHeight;
        me.msgHeight =
          document.documentElement.clientHeight -
          parseFloat(footerHeight) -
          parseFloat(headerHeight);
        me.$refs.msgDiv.style.height = me.msgHeight + "px";
        setTimeout(() => {
          me.scrollBottom();
        }, 200);
        if (clientHeight - nowClientHeight > 60) {
          //因为ios有自带的底部高度
          //键盘弹出的事件处理
          apiFun.addCls(apiFun.dom("footer"), "focusState");
        } else {
          //键盘收起的事件处理
          apiFun.removeCls(apiFun.dom("footer"), "focusState");
        }
      };
    },
    //转发
    forwardPatient(item) {
      this.$router.push({
        name: "pictureIndex",
        query: {
          itemType: item.messType,
          content: item.content,
        },
      });
    },
    //上拉加载聊天记录
    onRefresh() {
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    //关闭图片查看
    onClose() {
      this.showImgPic = false;
    },
    // 删除聊天内容
    deleteChat(item, index) {
      let list = this.$store.getters.getChatList;
      list.map((ele, index) => {
        if (ele.id == this.chatId) {
          ele.chatRecordList.map((val, valIndex) => {
            if (val.mid == item.mid) {
              ele.chatRecordList.splice(valIndex, 1);
            }
          });
        }
      });
      this.list.forEach((val, i) => {
        if (item.mid == val.mid) {
          this.list.splice(i, 1);
        }
      });
      this.$store.commit("setAllChatList", list);
    },
    // 长按事件 弹出菜单
    showmenu: function (e, index, item) {
      console.log(".....");
      let me = this;
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(function () {
        if (item.type == "send") {
          let time = item.time;
          let min = date.DateDifferenceMinutes(time);
          if (min > 10) {
            me.withdraStatus = false;
          } else {
            if (!item.ext.businessId) {
              me.withdraStatus = true;
            }
            if (item.ext.businessId && item.ext.ysStstus == "0") {
              me.withdraStatus = true;
            } else if (item.ext.businessId && item.ext.ysStstus != "0") {
              me.withdraStatus = false;
            }
          }
        }
        me.pressIndex = index;
      }, 800);
    },
    // 发送文本消息和表情
    sendMsg() {
      this.sendTimes();
      var me = this;
      let s = this.sendVal.replace(/\s+/g, ""); //替换所有空格！
      if (!s) {
        Toast("请输入内容");
        return;
      }
      var result = eschatUnit.sendMsg(
        this.sendVal,
        this.docId,
        this.id,
        this.userId
      );
      me.sendVal = "";
      me.$refs.area.innerText = "";
    },
    //次数验证
    sendTimes(type) {
      //如果患者从未挂号则不能进行任何操作 消息也不允许发
      if (this.patientJzStatus == "0" && this.userId) {
        if (this.receiveStatus == "0") {
          // 获取赠送次数 然后看需不需要进行次数赠送
          getGiveTimesById({
            patientId: this.id,
            docId: this.docId,
          }).then((res) => {
            if ((res.data && res.data.surplusTimes == 0) || !res.data) {
              this.verificationShow = true;
              return;
            }
          });
        } else {
          this.verificationShow = false;
        }
      }
      if (type == 1) {
        //发送文字消息
        this.sendMsg();
      } else if (type == 2) {
        //发送图片或者视频
        this.selectPic();
      } else if (type == 3) {
        // if (this.isVideoBtn) {
        //拍照或者拍视频
        this.setHeadImage();
        // } else {
        //   Toast('不可连续点击')
        // }
        // setTimeout(() => {
        //   this.isVideoBtn = true
        // })
      } else if (type == 5) {
        // 快捷回复
        this.quickReply();
      } else if (type == 6) {
        //出诊表
        this.showLineCard = true;
      } else if (type == 7) {
        //自定义服务
        this.openService();
      }
    },
    // 撤回消息
    withdrawMsg() {
      let index = this.pressIndex;
      let list = this.list;
      let item = list[this.pressIndex];
      console.log(JSON.stringify(item) + "----------item--------" + index);
      let me = this;
      // var easeChat = api.require("easeChat");
      easeChat.recallMessage(
        {
          conversationId: item.conversationId,
          messageId: item.mid,
        },
        function (ret, err) {
          cancelMessage({
            msgId: item.mid,
          }).then((res) => {
            if (item.ext.businessId && item.ext.ysStstus == "0") {
              updateBussStatus({
                businessId: item.ext.businessId,
                status: 5,
              }).then((res) => {
                //console.log("处方撤回成功", res);
              });
            }
            item.type = "withdraw";
            let val = {
              item: item,
              chatId: this.chatId,
              index: index,
            };
            me.$store.commit("setIndexChatList", item);
          });
        }
      );
    },
    // 撤回重新编辑
    editMsg(item) {
      if (item.messType == "text" && !item.ext.businessId) {
        this.$refs.area.innerText += item.content;
        this.sendVal += item.content;
      } else {
        this.openAddCf(item.ext.businessId, "withdraw");
      }
    },
    //清空定时器
    emptyTime() {
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop);
    },
    gotouchmove() {
      clearTimeout(this.Loop); //清除定时器
    },
    // 获取时间标志 和医生科室
    getTimeTag() {
      getIsCloseChatTime({
        regId: this.regId,
      }).then((res) => {
        var time = date.DateDifference(
          res.data.receiveTime.replace(/-/g, "/"),
          res.data.presentTime.replace(/-/g, "/")
        );
        this.docCloseTime = res.data.docCloseTime;
        if (this.docCloseTime == "0") {
          setTimeout(() => {
            this.setHeight();
          }, 10);
        }
        this.usedTime = time.usedTime;
        this.isSubsequent = res.data.isSubsequent;
        if (!this.lisUserInfo.deptName) {
          this.lisUserInfo.deptName = res.data.deptName;
        }
      });
    },
    // 表情及文字
    addEmoji(item) {
      let area = this.$refs.area;
      let path = require("@/assets/img/emotion/" + item.name + ".png");
      let Img = `<img class='text-emoji' style='display:inline-block;padding-top: 2px;width:22px;height:22px;display: inline-block;vertical-align: middle;' name='${item.name}' src='${path}'/>`; // img是要插入的图片表情
      if (document.selection) {
        // area.focus();
        const sel = document.selection.createRange();
        sel.text = Img;
        // sel.select();
        this.sendVal = item.text;
      } else if (area && (area.selectionStart || area.selectionStart === "0")) {
        // Mozilla/NETSCAPE support
        const startPos = area.selectionStart,
          endPos = area.selectionEnd,
          // save scrollTop before insert
          restoreTop = area.scrollTop;
        area.innerHTML =
          area.innerText.substring(0, startPos) +
          Img +
          area.innerText.substring(endPos, area.innerText.length);
        this.sendVal =
          this.sendVal.substring(0, startPos) +
          item.text +
          this.sendVal.substring(endPos, this.sendVal.length);
        if (restoreTop > 0) {
          area.scrollTop = restoreTop;
        }
        area.selectionStart = startPos + str.length;
        area.selectionEnd = startPos + str.length;
        area.blur();
      } else {
        const selection = window.getSelection();

        // .nodeName === '#text'
        if (
          selection.anchorNode &&
          selection.anchorNode.nodeType === 3 &&
          selection.anchorNode.parentNode === area
        ) {
          // 光标选中
          const range = selection.getRangeAt(0),
            rangeStartOffset = range.startOffset, // 获取光标位置
            textNode = range.startContainer;

          if (!range.collapsed) {
            // 不是同一位置 代表选择了内容 则先删除选择的内容
            range.deleteContents();
          }

          textNode.insertData(rangeStartOffset, Img); // 文本节点在光标位置处插入新的表情内容

          range.setStart(selection.anchorNode, rangeStartOffset + Img.length); // 光标移动到表情的后面, 1个emoji的长度并不固定
          range.collapse(true); // 光标开始和光标结束重叠
          selection.removeAllRanges(); // 清除选定对象的所有光标对象
          selection.addRange(range); // 插入新的光标对象
          area.innerHTML = area.innerText;
          this.sendVal += item.text;
        } else {
          // 未出现光标 直接点击表情 默认插入最后位置
          area.innerHTML += Img;
          selection.selectAllChildren(area); // 选择编辑器
          selection.collapseToEnd(); // 光标移动至最后
          this.sendVal += item.text;
        }
        area.blur();
      }
    },
    // 打开处方详情
    getCfDetail(item) {
      if (item.ext.ysStstus == "0") {
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.ext.businessId,
            title: "待审方",
          },
        });
      } else if (item.ext.ysStstus == "1") {
        if (item.ext.isOfflineSelfBuyMedicine == '1') {
          this.$router.push({
            name: "offLinepay",
            query: {
              businessId: item.ext.businessId,
            }
          });
        } else {
          if (item.ext.payStatus == "1") {
            this.$router.push({
              name: "payPre",
              query: {
                businessId: item.ext.businessId,
              },
            });
          } else {
            this.$router.push({
              name: "waitPay",
              query: {
                businessId: item.ext.businessId,
              },
            });
          }
        }
      } else if (item.ext.ysStstus == "2") {
        this.$router.push({
          name: "prescDetail",
          query: {
            businessId: item.ext.businessId,
          },
        });
      }
    },
    // 打开处方详情审方
    getCfDetailSh(item) {
      let title;
      if (item.ext.ysStstus == "0") {
        this.$router.push({
          name: "waitPassPerSetail",
          query: {
            businessId: item.ext.businessId,
            title: "待审方",
          },
        });
      } else if (item.ext.ysStstus == "1") {
        if (item.ext.payStatus == "1") {
          this.$router.push({
            name: "payPre",
            query: {
              businessId: item.ext.businessId,
            },
          });
        } else {
          this.$router.push({
            name: "waitPay",
            query: {
              businessId: item.ext.businessId,
            },
          });
        }
      } else if (item.ext.ysStstus == "2") {
        this.$router.push({
          name: "prescDetail",
          query: {
            businessId: item.ext.businessId,
          },
        });
      }
    },
    //检查单详情
    openCheckDetail(item) {
      this.$router.push({
        name: "checkDetail",
        query: item.ext,
      });
    },
    //检验单详情
    openLisDetail(item) {
      this.$router.push({
        name: "lisDetail",
        query: {
          pliId: item.ext.pliId,
        },
      });
    },
    changePanel() {
      this.panelShow = false;
      this.emojShow = false;
      this.dropDownList = false;
      this.comWords = false;
      this.pressIndex = -1;
    },
    changeEmoj() {
      this.emojShow = !this.emojShow;
      this.panelShow = false;
      this.recoredBtn = false;
      let area = this.$refs.area;
      area.blur();
    },
    // 获取文本内容
    changeTxt() {
      let area = this.$refs.area;
      if (area.innerText.indexOf("[") == -1) {
        this.sendVal = area.innerText;
      }
    },

    // 点击播放语音
    audioPlay(item, url, index) {
      let me = this;
      // 点击播放/暂停图片时，控制音乐的播放与暂停
      if (!item.playStatus) {
        if (item.content.indexOf("fs://") == -1) {
          api.download(
            {
              url: item.content,
              savePath: "fs://" + item.mid + ".amr",
              report: false,
              cache: true,
              allowResume: false
            },
            function (ret, err) {
              if (ret.state == 1) {
                // 只打开点击的录音，其他的都关闭
                for (var i = 0; i < me.list.length; i++) {
                  console.log(i + "------------" + index);
                  if (i == index) {
                    item.playStatus = true;
                    me.$set(me.list, index, item);
                    // // 播放语音
                    api.startPlay(
                      {
                        path: ret.savePath
                      },
                      function (ret, err) {
                        if (ret) {
                          item.playStatus = false;
                          me.$set(me.list, index, item);
                          //播放完以后自动停止
                          api.stopPlay();
                        } else {
                          Toast("APICloud环信DEMO：" + JSON.stringify(err));
                        }
                      }
                    );
                  } else {
                    me.list[i].playStatus = false;
                    me.$set(me.list, i, me.list[i]);
                  }
                }
              } else {
                Toast("APICloud环信DEMO：" + JSON.stringify(ret));
              }
            }
          );
        } else {
          item.playStatus = true;
          me.$set(me.list, index, item);
          api.startPlay(
            {
              path: item.content
            },
            function (ret, err) {
              if (ret) {
                console.log(JSON.stringify(ret) + "点击播放");
                item.playStatus = false;
                me.$set(me.list, index, item);
                api.stopPlay();
              } else {
                alert(JSON.stringify(err));
              }
            }
          );
        }
      } else {
        item.playStatus = false;
        me.$set(me.list, index, item);
        api.stopPlay();
      }
    },
    // 打开处方诊断
    openAddCf(businessId, type) {
      let regId = this.regId || "";
      let query = {
        userId: this.userId,
        patientId: this.id,
        regId: this.regId,
        isSubsequent: this.isSubsequent, //1为复诊 0为咨询
      };
      if (businessId) {
        query.businessId = businessId;
        query.type = type;
      } else {
        query.businessId = "";
        query.type = "add";
      }
      this.$router.push({
        name: "prescription",
        query: query,
      });
    },
    // 快捷回复
    quickReply(index) {
      this.commonWords = [];
      this.panelShow = false;
      this.comWords = true;
      this.loadData.page = 1;
      this.getQuickList();
    },
    // 常用语列表展示
    getQuickList() {
      let param = {
        page: this.loadData.page,
        limit: this.loadData.limit,
        quickType: "2",
        docId: this.docId,
      };
      getQuickInputInfo(param).then((res) => {
        let data = res.data.rows;
        this.loadData.size = res.data.total / this.loadData.limit;
        this.loading = false;
        if (this.loadData.page == 1) {
          this.loadData.page = 1;
          this.loading = false;
          this.commonWords = data;
        } else {
          this.commonWords = this.commonWords.concat(data);
          this.loading = false;
        }
        if (this.loadData.page >= this.loadData.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.loadData.page++;
      });
    },

    getScroll(event) {
      // 滚动条距离底部的距离scrollBottom
      var scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight;
      if (this.finished == false && scrollBottom < 10) {
        this.getQuickList();
      }
    },
    onLoad() {
      this.getQuickList();
    },
    //将常用语的内容转入到输入框
    swiperWords(item) {
      let area = this.$refs.area;
      area.innerText = item.quickInputName;
      this.sendVal = area.innerText;
    },
    // 添加常用语弹框
    addComWords() {
      this.showDialog = true;
      this.addMessage = "";
    },
    // 常用语弹框-取消
    cancel() {
      this.showDialog = false;
    },
    editCancel() {
      this.showEditDialog = false;
    },
    // 常用语弹框-确认
    confirm() {
      let param = {
        docId: this.docId,
        quickType: "2",
        isEnabled: 1,
        quickInputName: this.addMessage,
      };
      saveQuickInput(param).then((res) => {
        this.quickReply();
        this.showDialog = false;
        Toast(res.message);
      });
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
    //修改常用语
    editConfirm() {
      let param = {
        docId: this.docId,
        quickType: "2",
        isEnabled: 1,
        quickInputId: this.commonWords[this.editIndex].quickInputId,
        quickInputName: this.editMessage,
      };
      updateQuickInput(param).then((res) => {
        this.quickReply();
        this.showEditDialog = false;
        Toast(res.message);
      });
    },
    // 编辑
    edit(index, item) {
      this.editIndex = index;
      this.showEditDialog = true;
      this.editMessage = item.quickInputName;
    },
    // 删除
    dele(index) {
      let param = {
        docId: this.docId,
        quickType: "2",
        isEnabled: 0,
        quickInputId: this.commonWords[index].quickInputId,
        quickInputName: this.commonWords[index].quickInputName,
      };
      updateQuickInput(param).then((res) => {
        this.quickReply();
      });
    },

    // 录音按钮修改样式
    changeInputToRe() {
      this.recoredBtn = !this.recoredBtn;
      this.emojShow = false;
      this.inputDisabled = false;
      this.panelShow = false;
      this.comWords = false;
    },

    // 打开功能面板
    showFunctionPanel() {
      this.panelShow = true;
      this.emojShow = false;
      this.comWords = false;
    },

    //聊天记录滚动到最底部
    scrollBottom() {
      console.log("scroll--------------------------");
      setTimeout(() => {
        var container = this.$refs.msgDiv;
        if (container) {
          this.scrollHeight = container.scrollHeight;
          container.scrollTo(0, this.scrollHeight);
          this.newInfoTips = false;
        }
      }, 10);
    },

    // 选择照片或者拍照
    setHeadImage() {
      // this.isVideoBtn = false
      let me = this;
      var zySmallVideo = api.require("zySmallVideo");
      api.requestPermission(
        {
          list: ["camera", "microphone", "storage"],
        },
        function (ret, err) {
        }
      );
      var fileUrl = "";
      zySmallVideo.close();
      zySmallVideo.openNew(
        {
          rect: {
            //模块 附于一个frame之上
            x: 0,
            y: 0,
            w: api.frameWidth,
            h: api.frameHeight,
          },
          fixedOn: api.frameName,
          fixed: true,
          videoInfo: {
            //视频高级设置 不懂请勿修改
            //videoSize_w:720,//视频分辨率 宽 默认720
            //videoSize_h:1280,//视频分辨率 高 默认1280
            setOutputFormat: 2, //录制格式 默认2 mp4  0（DEFAULT） 1（THREE_GPP） 2（MPEG_4默认） 3（RAW_AMR） 4（AMR_WB） 5（AAC_ADIF） 6（AAC_ADTS） 7（OUTPUT_FORMAT_RTP_AVP） 8（OUTPUT_FORMAT_MPEG2TS） 9（WEBM）
            setVideoEncoder: 2, //编码格式 默认2 h264 0（DEFAULT） 1（H263） 2（H264默认） 3（MPEG_4_SP） 4（VP8） 5（HEVC）
            setAudioEncoder: 3, //音频格式应该是 默认3 aac  0（DEFAULT） 1（AMR_NB） 2（AMR_WB） 3（AAC默认） 4（HE_AAC） 5（AAC_ELD） 6（VORBIS）
          },
          MaxRecordTime: 15, //最大录制时间 单位秒 默认10
          MinRecordTime: 2, //最短录制时间  单位s
          MinTimeText: "还没到时间呢", //最短时间提示词
          setFeatures: 1003, //设置拍照和录像   1001只拍照   1002只录像   1003两者都可以  默认1003
          setTip: "长按录制，点击拍摄", //设置按钮上的提示词   长按拍摄等 默认空
          // isVideoBtn: true,//不允许拍摄连续点击的标识
          setBackIcon: "", //自定义返回图标 默认向下键头  支持widget  fs 等路径图片
          setBackShow: 1, //设置返回图标是否显示 1是 0否  默认1
          setCameraIcon: "", //自定义切换摄像头图标  支持widget  fs 等路径图片
          setCameraShow: 1, //右上角切换摄像头是否显示 1是 0否 默认1
          cameraInfo: {
            //摄像头 设置样式
            fit_xy: false, //图片是否拉伸占满宽高  默认false
            //w:120,// 摄像头宽度 默认 120
            //h:92,// 摄像头高度 默认 92
            margin_l: 0, //距左 默认都是0
            margin_r: 35, //距右
            margin_t: 65, //距上
            margin_b: 0, //距下
          },
          foucsInfo: {
            //点击的对焦框 样式
            color: "#cd0000", //线条颜色 默认16AE16
            width: 4, //线条宽度 默认4
          },
          recordInfo: {
            //录制时的参数
            //button_radius:120,//外圆半径 默认120
            //button_inside_radius:90,//内圆半径 默认90
            progress_color: "#cd0000", //进度条颜色 默认16AE16
            outside_color: "#DCDCDC", //外圆背景色 默认DCDCDC
            inside_color: "#FFFFFF", //内圆背景色 默认FFFFFF
            //strokeWidth:15,//进度条宽度 默认15
            //outside_add_size:48,//长按外圆半径变大的Size 默认48
            //inside_reduce_size:30,//长按内圆缩小的Size 默认30
          },
          confirmInfo: {
            //确认框参数
            fit_xy: false, //图片是否拉伸占满宽高  默认false
            img: "", //设置自定义图片
            w: 100, //宽 默认200
            h: 100, //高 默认200
            //margin_r:170, //确认按距右
          },
          cancelInfo: {
            //取消框参数
            fit_xy: false, //图片是否拉伸占满宽高  默认false
            img: "", //设置自定义图片
            //w:220,//宽 默认200
            //h:220,//高 默认200
            //margin_l:170,//确认按距左
          },
        },
        function (ret, err) {
          console.log('8888888888', JSON.stringify(ret))
          if (ret.status) {
            if (ret.type == "captureSuccess") {
              eschatUnit.sendImg(ret.result, me.docId, me.id, me.userId);
            } else {
              eschatUnit.sendVideo(ret.url, me.docId, me.id, me.userId);
            }
          }
        }
      );
    },

    transPath: function (element) {
      var me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      UIAlbumBrowser.transPath(
        {
          path: element.path,
        },
        function (ret, err) {
          if (ret) {
            var iospath = ret.path;
            element.path = iospath;
            me.sendImgMsg(element);
          } else {
            console.log(JSON.stringify(err));
          }
        }
      );
    },
    sendImgMsg(element) {
      let me = this;
      if (element.size > 2 * 1024 * 1024) {
        var imageFilter = api.require("imageFilter");
        let fileName =
          element.path.split("/")[element.path.split("/").length - 1];
        imageFilter.compress(
          {
            img: element.path,
            quality: 0.5,
            save: {
              album: true,
              imgPath: "fs://test",
              imgName: fileName,
            },
          },
          function (ret, err) {
            if (ret.status) {
              var imageFilter = api.require("imageFilter");
              imageFilter.getAttr(
                {
                  path: api.fsDir + "/" + "test" + "/" + fileName,
                },
                function (ret, err) {
                  if (ret.status) {
                  } else {
                  }
                }
              );
              for (var i = 0; i < imgs.length; i++) {
                me.ipath.push(imgs[i].path);
              }
              if (api.systemType == "ios") {
                me.transPath();
              } else {
                eschatUnit.sendImg(
                  api.fsDir + "/" + "test" + "/" + fileName,
                  me.docId,
                  me.id,
                  me.userId
                );
              }
            } else {
              alert(JSON.stringify(err));
            }
          }
        );
      } else {
        eschatUnit.sendImg(element.path, me.docId, me.id, me.userId);
      }
    },
    //选择图片
    async selectPic() {
      if (api.systemType != "ios") {
        let s = await myJsTools.getPromise("camera");
        if (!s) {
          Toast("请开启相机权限");
          return;
        }
      }
      let me = this;
      var UIAlbumBrowser = api.require("UIAlbumBrowser");
      UIAlbumBrowser.open(
        {
          max: 9,
          type: "all",
          videoTimeFilter: 30,
          selectedAll: false,
          styles: {
            bg: "#fff",
            mark: {
              icon: "",
              position: "bottom_left",
              size: 20,
            },
            nav: {
              bg: "rgba(0,0,0,0.6)",
              titleColor: "#fff",
              titleSize: 18,
              cancelColor: "#fff",
              cancelSize: 16,
              finishColor: "#fff",
              finishSize: 16,
            },
          },
          rotation: true,
        },
        function (ret, err) {
          if (ret) {
            for (let i = 0; i < ret.list.length; i++) {
              const element = ret.list[i];
              if (api.systemType == "ios") {
                if (element.mediaType == "image") {
                  me.transPath(element);
                } else {
                  UIAlbumBrowser.transVideoPath(
                    {
                      path: ret.list[0].path,
                    },
                    function (ret, err) {
                      if (ret) {
                        var videoPath = ret.albumVideoPath;
                        eschatUnit.sendVideo(
                          videoPath,
                          me.docId,
                          me.id,
                          me.userId
                        );
                      } else {
                        console.log(JSON.stringify(err));
                      }
                    }
                  );
                }
              } else {
                if (element.suffix == "mp4") {
                  eschatUnit.sendVideo(
                    element.path,
                    me.docId,
                    me.id,
                    me.userId
                  );
                } else {
                  me.sendImgMsg(element);
                }
              }
            }
          }
        }
      );
    },
    zipPic(path) {
      var img = new Image();
      img.src = path;
      var base64;
      img.onload = function () {
        var that = this;
        //生成比例
        var w = img.width,
          h = img.height,
          scale = w / h;
        w = w / 10;
        h = w / scale;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(that, 0, 0, w, h);
        base64 = canvas.toDataURL("image/png", 0.5);
        let fileName =
          Number(Math.random().toString().substr(3, 18) + Date.now()).toString(
            36
          ) + ".png";
        var trans = api.require("trans");
        trans.saveImage(
          {
            base64Str: base64.split(",")[1],
            imgPath: api.fsDir + "/img/",
            imgName: fileName,
          },
          function (ret, err) {
            if (ret.status) {
              eschatUnit.sendImg(
                api.fsDir + "/" + "img" + "/" + fileName,
                me.docId,
                me.id,
                me.userId
              );
            }
          }
        );
      };
    },
    // 点击查看图片
    lookImg(imgUrl) {
      this.showImgPic = true;
      this.images = [imgUrl];
    },
    // 关闭问诊时间提示
    closeWzzTime() {
      updateCloseChatTime({
        docCloseTime: "1",
        regId: this.regId,
      }).then((res) => {
        this.docCloseTime = "1";
        this.$nextTick(() => {
          this.setHeight("close");
        });
      });
    },
    //文字双击放大
    showBigText(content) {
      this.spanText = content;
      this.showText = true;
    },
    // 转换图片表情
    customEmoji(value) {
      return `<img src="https://llootong.cn/cloud/hisImg/static/faces/${value}" style="width:15px;height:15px"/>`;
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
    // 打开资料服务页面
    openImp() {
      this.$router.push({
        name: "information",
        query: {
          patientImg: this.userInfo.patientImg,
          patientName: this.userInfo.patientName,
          patientId: this.userInfo.patientId,
        },
      });
    },
    // 开始录音
    async startRecord(e) {
      console.log('111111我点击录音了')
      //再次清空定时器，防止重复注册定时器
      // e.preventDefault();
      if (api.systemType != "ios") {
        let s = await myJsTools.getPromise("microphone");
        if (!s) {
          Toast("请开启录音权限");
          return;
        }
      }
      console.log('222222我点击录音了')
      let me = this;
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      console.log('this.inputDisabled', this.inputDisabled)
      this.inputDisabled = true;
      clearTimeout(this.Loop);
      console.log('333333我点击录音了', JSON.stringify(this.Loop))
      this.Loop = setTimeout(() => {
        console.log('长按开始录音')
        this.vioceindex = 1
        recMp3.start(function (ret, err) {
          if (ret) {
            console.log(JSON.stringify(ret));
            if (ret.db != undefined) {
              // 在这里做ui 处理
              me.show = true;
            } else {
              //打开成功，开始录音
              me.show = true;
            }
          } else {
            alert(err.message);
          }
        });
        console.log('111111auth_time', auth_time)
        let auth_time = 60;
        this.auth_timetimer = setInterval(() => {
          auth_time--;
          console.log('auth_time--', auth_time)
          if (auth_time < 0) {
            Toast("录音限制时长60秒");
            let type = "";
            // if (api.systemType == "ios") {
            //   type = "end";
            // }
            // this.stopRecord(type);
            clearTimeout(me.Loop); //清除定时器
            clearInterval(me.auth_timetimer);
            me.auth_timetimer = 0;
            recMp3.stop(function (ret, err) {
              console.log(JSON.stringify(ret) + "-----------录音结束");
              if (ret) {
                var duration = ret.duration;
                var path = ret.path;
                me.show = false;
                me.vioceindex = 0
                if (type != "end" && duration != 0) {
                  console.log('结束录音发送音频成功')
                  eschatUnit.sendAudio(path, me.docId, me.id, duration, me.userId);
                }
              }
            });
          }
        }, 1000);
      }, 1000);
    },
    // 结束录音
    stopRecord(type) {
      console.log('触发结束录音', this.vioceindex)
      clearTimeout(this.Loop); //清除定时器
      let me = this;
      clearInterval(this.auth_timetimer);
      if (this.vioceindex == 1) {
        this.auth_timetimer = 0;
        recMp3.stop(function (ret, err) {
          console.log(JSON.stringify(ret) + "-----------录音结束");
          if (ret) {
            var duration = ret.duration;
            var path = ret.path;
            me.show = false;
            me.vioceindex = 0
            if (type != "end" && duration != 0) {
              console.log('结束录音发送音频成功')
              eschatUnit.sendAudio(path, me.docId, me.id, duration, me.userId);
            }
          }
        });
      }
    },
    // 右上角弹框
    clickImg() {
      this.dropDownList = !this.dropDownList;
      this.complaintList = [];
      this.retreatList = [];
      this.retreatResult = [];
      this.complaintResult = [];
      this.resultMessage = "";
      this.complaintMessage = "";
    },
    // 打开咨询小结
    consultationSummary(type) {
      if (!this.regId) {
        this.businessTips = true;
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
      if (item.ext.authorizeStatus == "2") {
        this.$router.push({
          name: "appYy",
          query: {
            type: item.ext.ppbType,
            regId: item.ext.regIdSq,
            sponsorDocName: item.ext.sponsorDocName,
            subsequent: subsequent,
            hosId: item.ext.hosId,
          },
        });
      }
    },
    // 打开投诉
    complaint() {
      this.complaintPopup = true;
      this.dropDownList = false;
      getSysOptionConfig({
        optionType: 2,
      }).then((res) => {
        this.complaintResult = res.data[0].optionCode;
        this.complaintMessage = res.data[0].optionName;
        for (var i = 0; i < res.data.length; i++) {
          this.complaintList.push({
            optionName: res.data[i].optionName,
            optionCode: res.data[i].optionCode,
          });
        }
      });
    },
    // 打开退诊
    withdrawal() {
      this.bunissType = 2;
      //如果不为接诊中状态  1时，结束问诊弹出不能结束提示框
      if (this.patientJzStatus == "0") {
        this.notRegIdTips = true;
        return false;
      }
      this.showRetreatRe = true;
      this.dropDownList = false;
      getSysOptionConfig({
        optionType: 4,
      }).then((res) => {
        this.retreatResult = res.data[0].optionCode;
        this.backCause = res.data[0].optionName;
        for (var i = 0; i < res.data.length; i++) {
          this.retreatList.push({
            optionName: res.data[i].optionName,
            optionCode: res.data[i].optionCode,
          });
        }
      });
    },
    // 打开结束问诊
    endInterrogation() {
      this.bunissType = 1;
      //如果不为接诊中状态  1时，结束问诊弹出不能结束提示框
      if (this.patientJzStatus == "0") {
        this.notRegIdTips = true;
        return false;
      }
      this.closeInterrogation = true;
      this.dropDownList = false;
    },
    // 结束问诊-确定
    commitJudge(type) {
      if (!type) {
        updateEndReceive({
          receiveStatus: "3",
          regId: this.regId,
        }).then((res) => {
          this.$router.go(-1);
        });
      }
      this.closeInterrogation = false;
      this.getTimeTag();
    },
    // 退诊
    refundInquiry() {
      var backCause = "";
      var backCauseCode;
      if (this.retreatResult == "qt") {
        if (!this.resultMessage) {
          Toast("请填写退诊原因");
          return;
        }
        backCause = this.resultMessage;
        backCauseCode = "";
      } else {
        backCause = this.backCause;
        backCauseCode = this.retreatResult;
      }
      var param = {
        backCause: backCause,
        backCauseCode: backCauseCode,
        backUserId: this.userInfo.docId,
        backUserName: this.docName,
        receiveStatus: 2,
        regId: this.regId,
        patientId: this.id,
      };
      updateReturnReceive(param).then((res) => {
        console.log("退诊" + JSON.stringify(res));
        if (res.data) {
          this.showRetreatRe = false;
          if (res.data.isCanReturnReceive == "0") {
            Toast("该挂号已开过处方，不可退诊,请结束问诊");
            return;
          } else {
            this.$router.go(-1);
          }
        }
      });
    },
    // 退诊原因选择
    changeResult(name) {
      if (name == "qt") {
        this.showRefundMessage = true;
      } else {
        this.showRefundMessage = false;
        for (let m = 0; m < this.retreatList.length; m++) {
          const element = this.retreatList[m];
          if (element.optionCode == name) {
            this.backCause = element.optionName;
          }
        }
      }
    },
    // 投诉
    complaintInquiry() {
      this.bunissType = 3;
      if (this.patientJzStatus == "0") {
        this.notRegIdTips = true;
        return false;
      }
      var complainCause = "";
      var complainCauseCode;
      if (this.complaintResult == "qt") {
        if (!this.complaintMessage) {
          Toast("请填写投诉原因");
          return;
        }
        complainCause = this.complaintMessage;
        complainCauseCode = "";
      } else {
        complainCause = this.backCause;
        complainCauseCode = this.complaintResult;
      }
      var param = {
        complainCause: complainCause,
        complainCauseCode: complainCauseCode,
        docId: this.docId,
        docName: this.docName,
        patientId: this.id,
        patientName: this.userInfo.patientName,
        regId: this.regId,
        complainType: 1,
      };
      saveProComplain(param).then((res) => {
        this.complaintPopup = false;
        Toast("投诉成功");
      });
    },
    // 投诉原因选择
    changeComplaintResult(name) {
      if (name == "qt") {
        this.showComplaintMessage = true;
      } else {
        this.showComplaintMessage = false;
        for (let m = 0; m < this.complaintList.length; m++) {
          const element = this.complaintList[m];
          if (element.optionCode == name) {
            this.backCause = element.optionName;
          }
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.allPopup {
  background: @white;
  text-align: center;
  width: 100%;
  height: 100vh;
  font-size: 18px;
  .black-font;

  div {
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(-50%);
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

  .chatMenu {
    background: @black;
    .white-font;
    .font-size-sm;
    line-height: 33px;
    text-align: center;
    border-radius: 7px;
    display: inline-block;

    span {
      border-left: 1px solid @font-color-2;
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
    border-top-color: @black; //只有尖相对的方向border有颜色
    position: absolute;
    right: 10px;
    top: 30px;
    display: inline-block;
  }
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

header {
  position: fixed;
  z-index: 1;
  top: 0;
  background: @white;
  border-bottom: 1px solid @back-border;

  .chatHeader {
    display: flex;
    padding-bottom: 15px;
    align-items: center;

    img {
      padding: 0 15px;
      margin-top: 8px;
    }
  }

  .dropDownList {
    position: fixed;
    padding: 12px 16px 2px;
    width: 83px;
    top: 30px;
    right: 12px;
    background: url("../../assets/img/chat/top_back.png") no-repeat center;
    background-size: 100% 100%;
    .font-size-md;
    .black-font;

    li {
      line-height: 15px;
      padding: 9px 0px;
      border-bottom: 0.5px solid @back-border;

      img {
        display: inline-block;
        margin: 0;
        padding: 0;
        vertical-align: middle;
        .icon-width-height-sm;
      }

      span {
        vertical-align: middle;
      }
    }

    .bottomLi {
      border: none;
    }
  }

  .title {
    padding: 4px 0;
    width: 80%;
    text-align: center;

    .name {
      .black-font;
      .font-size-lg-2;
      line-height: 20px;
    }

    .money {
      .font-color-2;
      .font-size-sm;
      line-height: 17px;
    }
  }
}

.overLay {
  .passImg {
    width: 25px;
    height: 41px;
    position: absolute;
    right: 40px;
    top: -5px;
  }
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background: @chat-bottom;
  width: 100%;
  z-index: 999;

  .emojDiv {
    padding-bottom: 8px;

    .emoPng {
      .img-width-height-spe;
      display: inline-block;
      margin: 8px 0 0 8px;
    }
  }

  .chatDiv {
    display: flex;
    padding: 10px 8px;
    align-items: flex-end;

    img {
      .img-width-height-spe;
      padding-top: 4px;
    }

    .mouthTok {
      width: 70%;
      background: @white;
      .font-size-md;
      line-height: 32px;
      text-align: center;
      margin: 0 4px;
      border-radius: 19px;
      //css新增特性，用户不能选中文字
      user-select: none;
    }

    .chatInput {
      -webkit-user-select: text;
      width: 63%;
      box-sizing: border-box;
      outline: 0px;
      margin: 0 4px;
      line-height: 22px;
      padding: 2px 10px;
      min-height: 32px;
      max-height: 78px;
      border-radius: 19px;
      border: 1px solid @back-border;
      .font-size-md;
      background: @white;
      display: flex;
      flex-wrap: wrap;
      overflow: scroll;

      .text-emoji {
        .icon-width-height-sm-24;
        padding-top: 2px;
        display: inline-block;
        vertical-align: middle;
      }
    }

    .addIcon {
      margin-left: 4px;
    }

    button {
      line-height: 28px;
      background: @blue;
      .font-size-md;
      .white-font;
      padding: 0 10px;
      border-radius: 2px;
      margin-left: 4px;
      max-height: 30px;
    }
  }

  .van-swipe {
    padding-bottom: 12px;

    .van-swipe__indicator {
      background-color: @gray !important;
    }
  }

  .panel {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 14px;

    div {
      width: 25%;
      text-align: center;
      .font-color-2;
      .font-size-sm;
      line-height: 17px;
      margin-bottom: 10px;
    }

    img {
      .img-width-height-lg;
      display: inline-block;
    }
  }

  .words {
    height: 212px;
    overflow: scroll;
    box-sizing: border-box;

    .addComWords {
      padding: 14px 0;
      text-align: center;
      border-top: 0.5px solid @gray;
      .font-size-md;
      .font-blod-2;
    }
  }

  .swiper_comWords {
    margin-bottom: 11px;

    .van-row {
      .font-size-md;
      .black-font;
      .font-blod-2;
      padding: 14px 16px;
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

.interview {
  background: @down-color;
  padding: 10px 0px;
  .black-font;
  .font-size-md;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding-left: 15%;

  .van-count-down {
    .black-font;
    .font-size-md;
    line-height: 20px;
    display: inline-block;
  }

  .wzzIcon {
    .icon-width-height-sm-16;
    margin-right: 8px;
    margin-top: 0px;
  }

  .closeWz {
    width: 20px;
    height: 20px;
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
  overflow: scroll;
  padding: 0px 16px;
  position: relative;
  box-sizing: border-box;
  font-family: "-apple-system", "Helvetica Neue", "Roboto", "Segoe UI",
  sans-serif;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.messageDiv {
  position: relative;
}

.chat-receiver {
  clear: both;
  font-size: 80%;
  position: relative;

  .playAudioBtn {
    background: inherit;
    float: left;
    padding-left: 15px;
  }

  div:nth-of-type(1) {
    float: left;
  }

  div:nth-of-type(2) {
    margin: 0 50px 2px 50px;
    padding: 0px;
    color: #848484;
    font-size: 80%;
    text-align: left;
  }

  div:nth-of-type(3) {
    float: left;
    max-width: 70%;
    margin: 10px 0 0.266667rem 0.266667rem;
    border-radius: 4px 16px 16px 16px;
    background: @chat-light;
    .font-size-md;
    line-height: 22px;

    .audio {
      width: 82px;
      line-height: 41px;

      .audioGif {
        width: 15px;
        height: 15px;
        display: inline-block;
        vertical-align: middle;
      }

      img {
        position: relative;
        top: -1px;
      }
    }
  }
}

.chat-sender {
  .playAudioBtn {
    background: @white;
    float: right;
    padding-right: 15px;
  }

  .readSpan {
    .font-login-color;
    .font-size-sm;
    display: inline-block;
    width: 45px;
    position: absolute;
    left: -35px;
    bottom: 0;
  }

  .sendSpan {
    left: -20px;
  }
}

.chat-sender,
.chat-receiver {
  clear: both;
  .font-size-md;
  position: relative;
  line-height: 21px;

  .userImg {
    .img-width-height-sm;
  }

  .cfSuggestSpan,
  .wzSuggestSpan {
    .black-font;
    .font-size-md;
    text-align: left;
    display: block;
    width: 100%;

    .title,
    .zdText {
      .font-blod-3;
    }

    .cfSuggest {
      display: flex;
      width: 100%;
      align-items: center;

      div {
        width: 80%;
      }

      img {
        .icon-width-height-chat;
        margin: 12px 12px 0 0;
      }

      .textDiv {
        width: 60%;
      }

      .zdText {
        .div-overflow;
        width: 76%;
        margin-top: 13px;
      }

      .tips {
        .font-login-color;
        .font-size-sm;
        .div-overflow;
        width: 76%;
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
  .font-login-sm;
  padding: 15px 0;

  .tipsText {
    .white-font;
    background: rgba(0, 0, 0, 0.16);
    border-radius: 10px;
    padding: 0 9px;
    line-height: 18px;
  }

  .editMsg {
    .font-login-color-blue;
    margin-left: 8px;
  }
}

/deep/ .van-image__img {
  border: 8px;
}

.chat-sender div:nth-of-type(1) {
  float: right;
}

.chat-sender div:nth-of-type(2) {
  margin: 0px 55px 2px 55px;
  padding: 0px;
  color: #848484;
  font-size: 70%;
  text-align: right;
}

.chat-sender div:nth-of-type(3) {
  float: right;
  max-width: 70%;
  text-align: left;
  background-color: @white;
  margin: 3px 8px 10px 5px;
  border-radius: 16px 4px 16px 16px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  .font-size-md;

  .audio {
    width: 82px;
    line-height: 41px;

    img {
      position: relative;
      top: -1px;
    }
  }
}

.textSpan {
  display: flex;
  position: relative;
  max-width: 258px;
  width: 258px;
  padding: 10px 10px 10px 17px;
  box-sizing: border-box;
}

.textSpanSender {
  max-width: 258px;
  width: auto;
  padding: 10px;
}

.msgDiv button {
  padding: 20px;
}

.sendIng {
  width: 15px;
  height: 15px;
}

video {
  display: inline-block;
  width: 90%;
  z-index: 0;
  height: 140px;
  margin-left: 5%;
}

.newInfoTips {
  .font-login-color-blue;
  .font-login-sm;
  position: fixed;
  bottom: 40px;
  width: auto;
  right: 16px;
  display: flex;
  background: @white;
  padding: 8px 14px;
  border-radius: 17px;
  align-items: center;
  border: 0.5px solid rgba(0, 0, 0, 0.08);

  span {
    color: @back-border;
    margin: 0 8px 0 4px;
  }
}
</style>
