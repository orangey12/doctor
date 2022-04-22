<template>
  <div class="calendar" @click="pressIndex=-1">
    <div id="test1"></div>
    <div class="planList">
      <div
        class="planCard"
        v-for="(item, index) in planList"
        :key="index"
        @click="openDetail(item)"
      >
        <div class="time">{{item.time}}</div>
        <div class="planInfo">
          <li class="title">
            <u>{{ item.planName }}({{item.numberOf}}人)</u>
            <u class="status">
              <span style="color: #FFC264" v-if="(item.sendStatus == '0' && item.planStatus == 1) || (item.sendStatus == '0' && item.planStatus == 2)"
              >待执行</span
              >
              <span class="font-login-color-blue" v-if="(item.sendStatus == '1' && item.planStatus == 1) || (item.sendStatus == '1' && item.planStatus == 2)"
                >已执行</span
              >
              <span v-if="(item.sendStatus == '3' && item.planStatus == 1) || (item.sendStatus == '3' && item.planStatus == 2)">已取消</span>
              <img src="../../assets/img/follow/more.png" class="moreIcon" @click.stop="opreatList($event,index,item)"/>
            </u>
          </li>
          <div v-if="index == pressIndex && item.sendStatus != '1'" class="operaDiv">
            <van-popup
              v-model="show"
              position="right"
              :overlay="false"
              class="scalePopup"
              :close-on-click-overlay="false"
              round
              :overlay-style="{ background: 'rgba(0, 0, 0, 0)' }"
            >
              <li v-if="item.sendStatus == '3'"  @click.stop="delShow=true;status=1">
                <img src="../../assets/img/follow/closeThis.png" class="editIcon" />
                <span>打开本次</span>
              </li>
              <li v-if="item.sendStatus == '0'" @click.stop="delShow=true;status=3">
                <img src="../../assets/img/follow/closeThis.png" class="editIcon" />
                <span>关闭本次</span>
              </li>
              <li class="line"></li>
              <li v-if="item.planStatus == '2'"  @click.stop="delShow=true;status=2">
                <img src="../../assets/img/follow/closeAll.png" class="editIcon" />
                <span>打开全部</span>
              </li>
              <li v-if="item.planStatus == '1'"  @click.stop="delShow=true;status=4">
                <img src="../../assets/img/follow/closeAll.png" class="editIcon" />
                <span>关闭全部</span>
              </li>
              <li class="line"></li>
              <li @click.stop="delShow = true">
                <img
                  src="../../assets/img/follow/delete.png"
                  class="deleteIcon"
                />
                <span>删除</span>
              </li>

            </van-popup>

          </div>
          <li class="content">{{item.planContent}}</li>
          <img v-zlazy="item.planImg" class="planImg" v-if="item.planImg" @click.stop="lookImg(item.planImg)"/>
        </div>
      </div>
    </div>
    <van-popup
        class="popup"
        round
        v-model="delShow"
        :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
    >
      <div v-if="status == 0">
        <li class="title">确认删除</li>
        <li class="tips">
          确定要删除随访计划吗？删除后将不再发送随访计划。
        </li>
        <div class="btns">
          <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
          <button class="publicBtn twoBtn" @click.stop="delFollow(item,'0')">确定</button>
        </div>
      </div>
      <div v-if="status == 1">
        <li class="title">本次开启</li>
        <li class="tips">
          确定要开启本次计划吗？开启本次，将开启本次随访计划。
        </li>
        <div class="btns">
          <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
          <button class="publicBtn twoBtn" @click.stop="carriedPlan(item,'1')">确定</button>
        </div>
      </div>
      <div v-if="status == 2">
        <li class="title">全部开启</li>
        <li class="tips">
          确定要开启全部计划吗？开启全部，将开启全部随访计划。
        </li>
        <div class="btns">
          <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
          <button class="publicBtn twoBtn" @click.stop="delFollow(item,'1')">确定</button>
        </div>
      </div>
      <div v-if="status == 3">
        <li class="title">本次关闭</li>
        <li class="tips">
          确定要关闭本次计划吗？关闭本次，将终止本次随访计划。
        </li>
        <div class="btns">
          <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
          <button class="publicBtn twoBtn" @click.stop="carriedPlan(item,'2')">确定</button>
        </div>
      </div>
      <div v-if="status == 4">
        <li class="title">全部关闭</li>
        <li class="tips">
          确定要关闭全部计划吗？关闭全部，将终止全部随访计划。
        </li>
        <div class="btns">
          <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
          <button class="publicBtn twoBtn" @click.stop="delFollow(item,'2')">确定</button>
        </div>
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
import dateFun from "@/utils/date";
import laydate from "layui-laydate";
import "@/assets/css/layDate.css";
import $api from "@/utils/api";
import myJsTools from "../../utils/myJsTools";
import imgSave from "@/common/imgSave";
import {findOfFollowupPlanOneDay, findUponAFollowupPlan, updateAll, updateDateOf} from "../../api/followUp";
import ossUpDown from "../../utils/ossUpDown";
import {Toast} from "vant";
export default {
  name: "calendar",
  data() {
    return {
      selectDate: "",
      planList: [],
      docId: "",
      pressIndex:-1,
      delShow:false,
      show:true,
      showImgPic:false,
      index:0,
      status:"", //0删除 1打开本次 2打开全部 3关闭本次 4关闭全部
      images:[],
      itemInfo:{},
    };
  },
  components: { imgSave },
  mounted() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getOnline();

  },
  methods: {
    // 点击查看图片
    lookImg(imgUrl) {
      this.showImgPic = true;
      this.images = [imgUrl];
    },
    //保存图片到本地
    changePreview(index) {
      this.index = index;
    },
    //关闭图片查看
    onClose() {
      this.showImgPic = false;
    },
    opreatList(e,index,item){
      console.log(e)
      this.pressIndex = index;
      this.itemInfo = item;
      console.log(JSON.stringify(item) + "-------------item")
      let clineHeight = 667;
      console.log(clineHeight - e.clientY )
      let s = setTimeout(()=>{
        console.log(popups)
        let popups = document.getElementsByClassName("scalePopup");
        for (let i = 0; i < popups.length; i++) {
          let pop = popups[i];
          if(clineHeight - e.clientY < 150){
            $api.css(pop,'top: -150px;');
          }else{
            $api.css(pop,'top: 25px;');
          }
          clearTimeout(s);
        }
      },5)
    },
    //开启或者关闭某天的计划
    carriedPlan(item,type){
      let param = {
        docId:this.docId,
        planId:this.itemInfo.planId,
        planTime:this.selectDate,
        status:type
      }
      console.log(JSON.stringify(param) + "----------sdsssss");
      updateDateOf(param).then(res=>{
        if (type == "0") {
          Toast("删除成功");
        } else if (type == "1") {
          Toast("打开随访计划成功");
        } else if (type == "2") {
          Toast("关闭成功");
        }
        this.getNowPlan();
        this.getMounthFlsg();
        this.delShow = false;
        this.pressIndex = -1;
      })
    },
    //删除全部
    delFollow(item, type) {
      console.log(this.itemInfo.planId + "----------planId");
      updateAll({
        planId: this.itemInfo.planId,
        status: type
      }).then(res => {
        if (type == "0") {
          Toast("删除成功");
        } else if (type == "1") {
          Toast("打开随访计划成功");
        } else if (type == "2") {
          Toast("关闭成功");
        }
        this.getMounthFlsg();
        this.getNowPlan();
        this.delShow = false;
        this.pressIndex = -1;
      });
    },
    //获取标志
    getMounthFlsg(){
      findUponAFollowupPlan({
        docId:this.docId,
        day:dateFun.getNowTime(new Date())
      }).then(res=>{
        let data = res.data;
        data.map(item=>{
          // console.log(item,"item")
          let tds = document.getElementsByTagName("td");

          for (let i = 0; i < tds.length; i++) {
            let ele = tds[i];
            let name = $api.attr(ele, "lay-ymd");
            // console.log(dateFun.getNowDate(name.replace(/-/g,'/')))
            if(dateFun.getNowDate(item.day) == dateFun.getNowDate(name.replace(/-/g,'/'))){
              if(item.of == '1'){
                $api.html(
                  ele,
                  "<li style='color:#fff;'>" + name.split("-")[2] + "</li>"
                );
                console.log(item.of)
                $api.addCls(ele, "hasVisit");
              }
            }
          }
        })
        console.log(res);
      })
    },
    // 显示日历
    getOnline() {
      var me = this;
      setTimeout(() => {
        laydate.render({
          elem: "#test1",
          position: "static",
          type: "date",
          show: true,
          showBottom: false,
          theme: this.$store.getters.getThemeColor,
          closeStop: "#test2",
          ready: function(date) {
            console.log(date);
            let d = dateFun.getWeek(
              date.year + "-" + date.month + "-" + date.date
            );
            let el = document.getElementsByClassName("laydate-set-ym");
            for (let i = 0; i < el.length; i++) {
              const element = el[i];
              $api.append(element, "<span class='daySpan'>" + d + "</span>");
            }
            let layDateDom = document.getElementsByClassName(
              ".layui-laydate-range"
            );
            for (let i = 0; i < layDateDom.length; i++) {
              const element = layDateDom[i];
              $api.css(
                element,
                "width:" + document.documentElement.clientWidth + "px"
              );
            }
            let tds = document.getElementsByTagName("td");
            let wid =
              (document.documentElement.clientWidth -
                document.documentElement.clientWidth / 3.7) /
              7;
            for (let i = 0; i < tds.length; i++) {
              const element = tds[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + wid + "px"
              );
            }
            let ths = document.getElementsByTagName("th");
            for (let i = 0; i < ths.length; i++) {
              const element = ths[i];
              $api.css(
                element,
                "width:" + wid + "px;line-height:" + wid + "px"
              );
            }
            me.selectDate =
              date.year + "-" + date.month + "-" + date.date + " 00:00:00";
            me.getNowPlan();
            me.getMounthFlsg();
          },
          change: function(value, date, endDate) {
            console.log(value,date)
            me.selectDate = value + " 00:00:00";
            me.pressIndex = -1;
            me.getNowPlan();
            me.getMounthFlsg();
          }
        });
      }, 300);
    },
    //获取随访计划
    getNowPlan() {
      this.planList = [];
      findOfFollowupPlanOneDay({
        docId: this.docId,
        day: this.selectDate
      }).then(async res => {
        console.log(JSON.stringify(res) + "一天的随访计划");
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.planTime) {
            let time = item.planTime.split(" ");
            let hours = time[1].split(":");
            item.time = hours[0] + ":" + hours[1]
          }
        }
        this.planList = res.data;
      });
    },
    //打开随访计划详情
    openDetail(item) {
      if(this.pressIndex != -1){
        this.pressIndex = -1;
        return;
      }
      if (item.sendStatus == "1") {
        this.$router.push({
          name: "hascarriedPlan",
          query: {
            id: item.planId,
            plsId: item.plsId
          }
        });
      } else {
        this.$router.push({
          name: "hisPlanDetail",
          query: {
            id: item.planId,
            plsId: item.plsId
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">

.planList {
  padding: 0px 16px 60px 16px;
  .planCard {
    background: @white;
    padding: 12px;
    display: flex;
    align-items: center;
    margin-top: 12px;
    border-radius: 4px;
    .black-font;
    .font-size-md;
    .time {
      line-height: 18px;
      margin-right: 12px;
    }
    .planInfo {
      width: 85%;
      position: relative;
      .title {
        line-height: 20px;
        .font-blod-2;
        justify-content: space-between;
        display: flex;
        u:first-child {
          width: 70%;
        }
        .status {
          display: flex;
          img {
            .icon-width-height-sm;
            margin-left: 10px;
          }
        }
      }
      .content {
        .font-login-color;
        .font-size-sm;
        line-height: 17px;
        margin-top: 5px;
      }
      .planImg {
        width: 87px;
        height: 87px;
        margin-top: 8px;
      }
    }
  }
}
.scalePopup {
  box-sizing: border-box;
  width: 112px;
  padding: 0 9px;
  background: @white;
  text-align: center;
  border-radius: 8px;
  right: 0px;
  position: absolute;
  top: 25px;
  border: 0.5px solid @back-border;
  transform: none;

  li {
    align-items: center;
    padding: 12px 0;
    display: flex;
    img {
      .icon-width-height-sm;
      margin-right: 12px;
    }
  }
  .line {
    height: 0.5px;
    background: @back-border;
    width: 100%;
    padding: 0;
  }
}
  /deep/.van-popup{
    max-height: none;
  }
</style>
