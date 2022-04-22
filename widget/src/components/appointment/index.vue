<template>
  <div class="appointment" id="appointment">
    <navbar :title="title" type="defaultPage"></navbar>
    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
      @click="getList"
    >
      <van-tab title="已预约" :badge="appointNum > 0 ? appointNum : ''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <card :list="yy_list" type="0" v-if="active == '0'"></card>
            <template slot="finished">
              <span v-if="yy_list.length > 0">已全部加载</span>
              <span v-if="yy_list.length == 0"></span>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待接诊" :badge="notReceiveNum > 0 ? notReceiveNum : ''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <card :list="djz_list" type="1" v-if="active == '1'"></card>
            <template slot="finished">
              <span v-if="djz_list.length == 0"></span>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="接诊中">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <card :list="jzz_list" type="2" v-if="active == '2'"></card>
            <template slot="finished">
              <span v-if="jzz_list.length == 0"></span>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已结束">
        <van-dropdown-menu :active-color="downColor">
          <van-dropdown-item
            v-model="fw_id"
            :title="fw_text"
            :options="fw_list"
            @change="selectVal"
          />
          <van-dropdown-item
            v-model="wz_id"
            :title="wz_text"
            :options="wz_list"

            @change="selectWzVal"
          />
          <van-dropdown-item
            :title="startTime.split(' ')[0] + '-' + endTime.split(' ')[0]"
            ref="item"
          >
            <van-calendar
              type="range"
              :show-title="false"
              :min-date="minDate"
              :show-confirm="false"
              :show-subtitle="false"
              @confirm="onConfirm"
              :color="downColor"
              row-height="45"
              :formatter="formatter"
              :poppable="false"
              :style="{ height: '320px' }"
            />
          </van-dropdown-item>
        </van-dropdown-menu>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <card :list="end_list" type="3" v-if="active == '3'"></card>
            <template slot="finished">
              <span v-if="end_list.length == 0"></span>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import {
  getPatientAppointByDocPage,
  getNotReceiveByDocPage,
  getReceiveByDocPage,
  getAppointAndNotReceiveNum
} from "@/api/docList.js";
import card from "./card";
import date from "@/utils/date.js";
import myJsTools from "@/utils/myJsTools";
import ossUpDown from "../../utils/ossUpDown";

export default {
  components: {navbar, card},
  data() {
    return {
      active: 0,
      show: false,
      conditionShow: true,
      seleActive: -1,
      title: "我的预约",
      fw_text: "服务类型",
      fw_id: "",
      fw_list: [
        {value: "", text: "全部"},
        {value: 1, text: "在线复诊"},
        {value: 0, text: "在线咨询"}
      ],
      wz_text: "问诊方式",
      wz_id: "",
      wz_list: [
        {value: "", text: "全部"},
        {value: 1, text: "图文"},
        {value: 2, text: "语音"},
        {value: 3, text: "电话"},
        {value: 4, text: "视频"}
      ],
      yy_query: {page: 1, limit: 10, docId: "1",internetVisit:""},
      end_query: {page: 1, limit: 10, docId: "1", isEnd: "0",internetVisit:""},
      yy_list: [],
      djz_list: [],
      jzz_list: [],
      end_list: [],
      startTime: "",
      endTime: "",
      fwShow: false,
      wzShow: false,
      minDate: null,
      dzz_total: 0,
      yy_total: 0,
      value: 0,
      switch1: false,
      switch2: false,
      isLoading: false,
      finished: false,
      loading: false,
      appointNum: 0,
      notReceiveNum: 0,
      headerHeight: 0,
      downColor: "#1677FF",
    };
  },
  created() {
    this.active = parseInt(myJsTools.getItem("active"));
    this.downColor = myJsTools.getItem("downColor");
    this.yy_query.docId = this.end_query.docId = myJsTools.getItem(
      "token_info"
    ).docId;
    this.yy_query.internetVisit = this.end_query.internetVisit = this.$route.query.internetVisit
    this.getList();
    this.minDate = new Date("1970-01-01");
  },
  mounted() {
    this.startTime = date.dayDif(new Date(), 7 * 24 * 3600 * 1000);
    this.endTime = date.format(new Date().getTime())
    this.getBadgeNum();
    this.$nextTick(() => {
      this.headerHeight = myJsTools.getItem("headerHeight") || 40;
      $api.css($api.dom('.van-tabs .van-hairline--top-bottom'), 'top:' + this.headerHeight + "px !important;")
    })
  },
  methods: {
    // 获取已预约数量.待接诊数量
    getBadgeNum() {
      getAppointAndNotReceiveNum(this.yy_query).then(res => {
        this.appointNum = res.data.appointNum;
        this.notReceiveNum = res.data.notReceiveNum;
      });
    },
    // 日历格式化
    formatter(day) {
      if (day.type === "start") {
        day.bottomInfo = "";
      } else if (day.type === "end") {
        day.bottomInfo = "";
      }
      return day;
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.yy_query.page = 1;
      this.end_query.page = 1;
      this.yy_list = [];
      this.djz_list = [];
      this.onLoaded();
    },
    // 上拉加载
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getList();
    },
    // 获取所有的列表
    getList() {
      myJsTools.setItem("active", this.active);
      if (this.active == 0) {
        this.title = "我的预约";

        this.getYyList();
      } else if (this.active == 1) {
        this.title = "我的待接诊";
        this.getWait();
      } else {
        if (this.active == 2) {
          this.title = "我的接诊";
        } else {
          this.title = "我的历史";
        }

        this.getEnd();
      }
    },
    // 获取我的预约列表
    getYyList() {
      getPatientAppointByDocPage(this.yy_query).then(res => {
        if (this.yy_query.size < 2) {
          this.loading = false;
        }
        this.appointNum = res.data.total;
        this.yy_query.size = res.data.total / this.yy_query.limit;
        this.dataSetFun(res);
        if (this.yy_query.page >= this.yy_query.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.yy_query.page++;
      });
    },
    // 获取待接诊列表
    getWait() {
      getNotReceiveByDocPage(this.yy_query).then(res => {
        if (this.yy_query.size < 2) {
          this.loading = false;
        }
        console.log(JSON.stringify(res) + "待-------------------接诊列表")
        this.yy_query.size = res.data.total / this.yy_query.limit;
        this.dataSetFun(res);
        this.notReceiveNum = res.data.total;
        if (this.yy_query.page >= this.yy_query.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.yy_query.page++;
      });
    },
    // 获取已结束、接诊中列表
    getEnd() {
      this.conditionShow = true;
      if (this.active == 3) {
        this.end_query.isEnd = "1";
        this.end_query.isSubsequent = this.fw_id;
        this.end_query.visitTypeCode = this.wz_id;
        if (this.startTime && this.endTime && this.active == 3) {
          if (this.startTime.indexOf(" ") != -1) {
            this.end_query.startTime = this.startTime;
          } else {
            this.end_query.startTime = this.startTime + " 00:00:00";
          }
          this.end_query.endTime = this.endTime.split(" ")[0] + " 23:59:59";
        }
      } else {
        this.end_query.isEnd = "0";
        this.end_query.startTime = "";
        this.end_query.endTime = "";
      }
      getReceiveByDocPage(this.end_query).then(res => {
        if (this.end_query.size < 2) {
          this.loading = false;
        }
        console.log(JSON.stringify(res) + "-------------------接诊中或已结束列表")
        //console.log(this.end_query, this.end_query.page >= this.end_query.size);
        this.end_query.size = res.data.total / this.end_query.limit;
        this.dataSetFun(res);
        if (this.end_query.page >= this.end_query.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        } else {
          this.end_query.page++;
        }
      });
    },
    // 数据处理
    dataSetFun(res) {
      this.loading = false;
      let data = res.data.rows;
      if (this.active == 0) {
        if (this.yy_query.page == 1) {
          this.yy_query.page = 1;
          this.isLoading = false;
          this.yy_list = res.data.rows;
        } else {
          this.yy_list = this.yy_list.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 1) {
        //console.log(JSON.stringify(res.data.rows) + "列表")
        if (this.yy_query.page == 1) {
          this.yy_query.page = 1;
          this.isLoading = false;
          this.djz_list = res.data.rows;
        } else {
          this.djz_list = this.djz_list.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 2) {
        if (this.end_query.page == 1) {
          this.end_query.page = 1;
          this.isLoading = false;
          this.jzz_list = res.data.rows;
        } else {
          this.jzz_list = this.jzz_list.concat(res.data.rows);
          this.loading = false;
        }
      } else if (this.active == 3) {
        if (this.end_query.page == 1) {
          this.end_query.page = 1;
          this.isLoading = false;
          this.end_list = res.data.rows;
        } else {
          this.end_list = this.end_list.concat(res.data.rows);
          this.loading = false;
        }
      }
    },
    // 筛选条件选择
    selectVal(value) {
      this.fw_id = value;
      for (let x = 0; x < this.fw_list.length; x++) {
        const element = this.fw_list[x];
        //console.log(element);
        if (element.value == value) {
          this.fw_text = element.text;
        }
      }
      this.onRefresh();
    },
    // 选择问诊方式
    selectWzVal(value) {
      this.wz_id = value;
      for (let x = 0; x < this.wz_list.length; x++) {
        const element = this.wz_list[x];
        if (element.value == value) {
          this.wz_text = element.text;
        }
      }
      this.onRefresh();
    },
    // 日期选择事件
    onConfirm(val) {
      this.$refs.item.toggle();
      this.startTime = date.getNowTime(val[0]);
      if (val[1]) {
        let time = date.getNowTime(val[1]);
        this.endTime = time.split(" ")[0] + " 23:59:59";
      }
      //console.log(this.endTime);
      this.onRefresh();
    }
  }
};
</script>

<style scoped lang="less">


/deep/ .van-tabs .van-hairline--top-bottom {
  position: fixed;
  z-index: 3;
  width: 100%;
}
/deep/.van-pull-refresh {
  height: 100%;
}
.appointment {
  background: @page-back;
}

/deep/ .van-info {
  position: absolute;
  top: 10px;
  right: -30%;
  background-color: #ff5050;
  font-size: 11px;
  line-height: 12px;
}

/deep/ .van-dropdown-item__content {
  position: absolute;
  max-height: 80%;
  width: 100%;
  left: 0;
  border-radius: 0px 0px 8px 8px;
  border: 1px solid rgba(221, 221, 221, 1);
}

/deep/ .van-dropdown-menu__bar {
  :nth-child(1),
  :nth-child(2) {
    flex: 0.4;
  }
}
</style>
