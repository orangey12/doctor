<template>
  <div class="myAuditor">
    <navbar title="我的审方" type="tabPage" :active="4">
      <template slot="rightIcon">
        <span class="font-login-color-blue font-size-sm">审方设置</span>
      </template>
    </navbar>
    <van-tabs v-model="active" color="#14A0E6" title-active-color="#14A0E6" title-inactive-color="#333" @change="onRefresh">
      <van-tab title="待审方" :badge="notCheckNum > 0 ? notCheckNum:''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
        <info-card :list="waitlist" :type="active"></info-card>
          </van-list>
        </van-pull-refresh>
        <div class="emptyDiv" v-if="isOpen==false">
          <img src="@/assets/img/my/pitera.png" class="emptyIcon" />
          <li>暂无待审核处方，点击切换页签查看其它吧</li>
        </div>

      </van-tab>
      <van-tab title="未通过" :badge="notPassNum > 0 ? notPassNum:''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
        <info-card :list="notList" :type="active"></info-card>
        </van-list>
        </van-pull-refresh>
        <div class="emptyDiv" v-if="isOpen==false">
          <img src="@/assets/img/my/pitera.png" alt class="emptyIcon" />
          <li class="msg">暂无未通过处方，点击切换页签查看其它吧</li>
        </div>

      </van-tab>
      <van-tab title="已通过">

        <div class="Piteraed">
          <div class="Piteraed_date">
            <input type="text" placeholder="开始时间" :value="startValue" @focus="getStart" readonly/>
            <div>~</div>
            <input type="text" placeholder="结束时间" :value="endValue" @focus="getEnd" readonly/>
            <img src="@/assets/img/my/date.png" alt class="time" />
            <span class="line">|</span>
            <span class="sea">状态</span>
            <van-dropdown-menu>
              <van-dropdown-item v-model="value" :options="option" @change="changeOption" />
            </van-dropdown-menu>
          </div>
        </div>
        <div  v-if="isOpen==true">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoaded"
            >
              <info-card :list="list" :type="active" :checkType="value"></info-card>
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="emptyDiv" v-if="isOpen==false">
          <img src="@/assets/img/my/pitera.png" alt class="emptyIcon" />
          <li class="msg">暂无已通过处方，点击切换页签查看其它吧</li>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="isStart" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        type="date"
        title="选择年月日"
        @confirm="confirmS"
        @cancel="cancelS"
      />
    </van-popup>
    <van-popup v-model="isEnd" position="bottom">
      <van-datetime-picker
        v-model="endDate"
        type="date"
        title="选择年月日"
        @confirm="confirmE"
        @cancel="cancelE"
      />
    </van-popup>
    <tabbar></tabbar>
  </div>
</template>
<script>
  import $api from "@/utils/api.js";
  import navbar from "@/common/navbar";
  import tabbar from "@/common/tabbar";
  import InfoCard from "./infoCard";
  import {
    getCheckPrescriptionList,
    getNotCheckPrescriptionList,
    getCheckPrescriptionStatusNum
  } from "@/api/judge";
  import myJsTools from '../../utils/myJsTools';
  export default {
    name: "trialPartyIndex",
    components: { InfoCard, navbar, tabbar },
    data() {
      return {
        active: 0,
        //是否有数据
        isOpen: false,
        startValue: "",
        value: 1, // 默认选一次审核通过
        notCheckNum: "", // 待审核
        notPassNum: "", // 未通过
        // 状态
        option: [
          {
            text: "一次审核通过",
            value: 1
          },
          {
            text: "修改处方通过",
            value: 2
          },
          {
            text: "医师双签通过",
            value: 3
          }
        ],
        waitlist:[],
        notList:[],//未通过列表
        list: [],
        timeValue: "",
        endValue: "",
        //是否打开时间选择器（开始）
        isStart: false,
        //是否打开时间选择器（结束）
        isEnd: false,
        //开始时间
        startDate: new Date(),
        //结束时间
        endDate: new Date(),
        isLoading: false,
        finished: false,
        loading: false,
        listQuery:{
          page:1,
          size:1,limit:10,
        },
        listQuery_2:{
          page:1,
          size:1,limit:10,
        },
        headerHeight:64,
        getType:1,
        name:"",
      };
    },
    mounted() {
      this.getNum();
      this.timeFormat(new Date());
      this.$nextTick(()=>{
        this.headerHeight = myJsTools.getItem("headerHeight") || 40;
        $api.css($api.dom('.van-tabs .van-hairline--top-bottom'), 'top:' + this.headerHeight + "px !important;")
      })
    },
    methods: {
      changeOption(value) {
        this.value = value;
        this.list = [];
        this.getCheckPrescriptionList();
      },
      // 获取审核处方数量
      getNum() {
        getCheckPrescriptionStatusNum({
          checkUserId:myJsTools.getItem("token_info").userId
        }).then(res => {
          console.log("数量", res);
          this.notCheckNum = res.data.notCheckNum;
          this.notPassNum = res.data.notPassNum;
        });
      },
      //待审核，已完成状态
      goD() {
        this.$router.push({
          name: "pharmWait",
          query:{
            patientId:item.patientId
          }
        });
      },
      //未通过状态
      goDetails() {
        this.$router.push({
          name: "pharmDetail"
        });
      },
      //打开时间选择器（开始）
      getStart() {
        this.isStart = true;
      },
      //打开时间选择器（结束）
      getEnd() {
        this.isEnd = true;
      },
      //点击确定(开始)
      confirmS(e) {
        this.startValue = this.timeFormat(this.startDate);
        // console.log(this.startValue);
        this.isStart = false;
      },
      //点击确定(结束)
      confirmE() {
        this.endValue = this.timeFormat(this.endDate);
        this.list = [];
        this.isEnd = false;
        this.getCheckPrescriptionList();
      },
      //点击取消(开始)
      cancelS() {
        this.isStart = false;
      },
      //点击取消(结束)
      cancelE() {
        this.isEnd = false;
      },
      timeFormat(time) {
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        return year + "-" + month + "-" + day;
      },
      // 未通过，已通过列表
      getCheckPrescriptionList() {
        this.listQuery_2.checkUserId = myJsTools.getItem("token_info").userId;
        // 未通过
        if (this.active == 1) {
          this.listQuery_2.status = 2;
          // 已通过
        } else {
          if(this.endValue){
            this.listQuery_2.startTime = this.startValue + " 00:00:00";
            this.listQuery_2.endTime = this.endValue + " 23:59:59";
          }
          this.listQuery_2.status = 1;
          this.listQuery_2.checkType = this.value;
        }
        getCheckPrescriptionList(this.listQuery_2).then(async res => {
          console.log("审方列表--------" + JSON.stringify(res));
          this.loading = false;
          this.listQuery_2.size = res.data.total / this.listQuery_2.limit;
          let data = res.data.rows;
          if (this.listQuery_2.page == 1) {
            this.listQuery_2.page = 1;
            this.isLoading = false;
            if(this.active == 1){
              this.notList = data
            }else{
              this.list = data;
            }
          } else {
            if(this.active == 1){
              this.notList = this.notList.concat(data);
            }else{
              this.list = this.list.concat(data);
            }
            this.loading = false;
          }
          if(this.active == 1){
            if (this.notList.length > 0) {
              this.isOpen = true;
            } else {
              this.isOpen = false;
            }
          }else{
            if (this.list.length > 0) {
              this.isOpen = true;
            } else {
              this.isOpen = false;
            }
          }
          if (this.listQuery_2.page >= this.listQuery_2.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery_2.page++;
        });
      },
      // 下拉刷新
      onRefresh() {
        // 清空列表数据
        this.finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.waitlist = this.notList = this.list = [];
        this.listQuery.page = this.listQuery_2.page = 1;
        this.onLoaded();
        this.getNum();
      },
      // 上拉加载
      onLoaded() {
        if (this.isLoading) {
          this.isLoading = false;
        }
        if(this.active == 0){
          this.getNotCheckPrescriptionList();
        }else{
          this.getCheckPrescriptionList()
        }
      },
      // 待审方列表
      getNotCheckPrescriptionList() {
        getNotCheckPrescriptionList(this.listQuery).then(async res => {
          console.log("待审方列表-----------" +  JSON.stringify(res));
          this.loading = false;
          this.listQuery.size = res.data.total / this.listQuery.limit;
          let data = res.data.rows;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.waitlist = data;
          } else {
            this.waitlist = this.waitlist.concat(data);
            this.loading = false;
          }
          if (this.waitlist.length > 0) {
            this.isOpen = true;
          } else {
            this.isOpen = false;
          }
          if (this.listQuery.page >= this.listQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery.page++;
        });
      }
      // 处方数量
    }
  };
</script>
<style scoped lang="less">

  /deep/ .van-tabs .van-hairline--top-bottom{
    position: fixed;
    z-index: 3;
    width: 100%;
  }

  /deep/.van-info {
    right: -13px;
    top: 10px;
    background: @red;
    font-size: 11px;
  }
  .Piteraed {
    width: 95%;
    text-align: center;
    &_date {
      width: 100%;
      display: flex;
      align-items: center;
      background: @white;
      padding-left: 8px;
      input {
        width: 23%;
        text-align: center;
        .font-size-md;
        .black-font;
        line-height: 22px;
      }
      .line {
        width: 5px;
        .gray-font;
      }
      .time {
        width: 14px;
        height: 12px;
        margin-right: 9px;
      }
      .sea {
        width: 9%;
        position: relative;
        margin-left: 9px;
        text-align: left;
        font-size: 14px;
      }
    }
    .img {
      width: 193px;
      height: 162px;
      margin: 0 auto;
      margin-top: 43px;
    }
    .msg {
      width: 193px;
      margin: 0 auto;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      display: block;
      margin-top: 20px;
    }
  }
  /deep/.van-dropdown-menu {
    width: 43%;
    /deep/.van-dropdown-menu__bar {
      box-shadow: 0 0 0 0;
      .van-ellipsis {
        font-size: 14px;
      }
    }
  }
  .my_box {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    &_item {
      padding: 12px;
      margin-top: 12px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      margin-bottom: 10px;
      display: flex;
      color: #333333;
      font-size: 14px;
      line-height: 20px;
      .headImg {
        width: 52px;
        height: 52px;
        margin-right: 12px;
        margin-top: 25px;
      }
      .patientInfo {
        font-size: 15px;
        font-weight: 600;
        margin-top: 5px;
      }
      div,
      p {
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 15px;
      }
      div {
        margin-bottom: 10px;
      }
      p {
        margin-top: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inherit;
        width: 50%;
      }
    }
    &_item .line {
      display: block;
      height: 1px;
      background: rgba(243, 243, 243, 1);
      margin-top: 10px;
    }
    &_item div span:first-child {
      width: 57%;
    }
  }
  /deep/.van-popup {
    border-radius: 0 0 8px 8px;
  }
  header {
    display: flex;
    background: #ffffff;
    line-height: 30px;
    height: 44px;
    padding-top: 35px;
    height: 44px;
    background: #ffffff;
    color: #333333;
    font-weight: 800;
    font-size: 18px;
    padding-left: 40%;
  }
</style>
