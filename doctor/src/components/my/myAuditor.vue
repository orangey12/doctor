<template>
  <div class="myAuditor">
    <navbar title="我的审方"></navbar>
    <van-tabs
      v-model="active"
      color="#14A0E6"
      @click="onRefresh"
      title-active-color="#14A0E6"
    >
      <van-tab title="待审方" :badge="notCheckNum > 0 ? notCheckNum : ''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoaded"
          >
            <info-card :list="list" :type="active"></info-card>
          </van-list>
        </van-pull-refresh>
        <div class="emptyDiv" v-if="list.length == 0">
          <img src="@/assets/img/my/pitera.png" class="emptyIcon"/>
          <li>暂无待审核处方，点击切换页签查看其它吧</li>
        </div>
      </van-tab>
      <van-tab title="未通过" :badge="notPassNum > 0 ? notPassNum : ''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoaded"
          >
            <info-card :list="list" :type="active"></info-card>
          </van-list>
        </van-pull-refresh>
        <div class="emptyDiv" v-if="list.length == 0">
          <img src="@/assets/img/my/pitera.png" class="emptyIcon"/>
          <li>暂无未通过处方，点击切换页签查看其它吧</li>
        </div>
      </van-tab>
      <van-tab title="已通过">
        <div class="my_box">
          <div class="my_box_time">
            <div class="my_box_time_date">
              <input
                type="text"
                placeholder="开始时间"
                :value="startValue"
                readonly
                @click="getStart"
              />
              <div>~</div>
              <input
                type="text"
                placeholder="结束时间"
                :value="endValue"
                @click="getEnd"
                readonly
              />
              <img src="@/assets/img/my/date.png" alt="" class="time"/>
              <span class="line">|</span>
              <input
                type="text"
                placeholder="请输入搜索词"
                class="sea"
                v-model="searchVal"
                @keyup.enter="onRefresh"
              />
              <img src="@/assets/img/my/sea.png" alt="" class="sea_img"/>
            </div>
          </div>
          <div v-if="list.length > 0">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoaded"
              >
                <info-card :list="list" :type="active"></info-card>
              </van-list>
            </van-pull-refresh>
          </div>
          <div class="emptyDiv" v-else>
            <img src="@/assets/img/my/pitera.png" alt="" class="emptyIcon"/>
            <li>暂无已通过处方，点击切换页签查看其它吧</li>
          </div>
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
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import InfoCard from "./infoCard";
import {
  getCheckPrescriptionList,
  getCheckPrescriptionStatusNum,
  getNotCheckPrescriptionList
} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "myAuditor",
  components: {InfoCard, navbar},
  data() {
    return {
      active: 0,
      //是否有数据
      isOpen: false,
      startValue: "",
      list: [],
      searchVal: "",
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
      docId: "",
      notCheckNum: "", //待审核处方数量
      notPassNum: "", //未通过处方数量
      isLoading: false,
      finished: false,
      loading: false,
      listQuery: {
        page: 1,
        size: 1,
        limit: 10,
        docId: "",
      },
      listQuery_2: {
        page: 1,
        size: 1, limit: 10,
        docId: "",
      },
    };
  },
  created() {
    this.docId = this.listQuery.docId = this.listQuery_2.docId = myJsTools.getItem(
      "token_info"
    ).docId;

    this.onRefresh()
    this.getNum();
  },
  mounted() {
    this.timeFormat(new Date());
    if (this.list.length > 0) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  },
  methods: {
    // 获取头部数字
    getNum() {
      getCheckPrescriptionStatusNum({
        docId: this.docId
      }).then(res => {
        console.log(JSON.stringify(res) + "--------审方数字");
        this.notCheckNum = res.data.notCheckNum;
        if (this.notCheckNum) {
          this.active = 0;
        }
        this.notPassNum = res.data.notPassNum;
        console.log(res.data.notCheckNum != '0' + "---------" + res.data.notPassNum > 0)
        if (res.data.notCheckNum == '0' && res.data.notPassNum > 0) {
          this.active = 1;
        }
      });
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.list = [];
      this.listQuery.page = 1;
      this.listQuery_2.page = 1;
      this.onLoaded();
    },
    // 上拉加载
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      if (this.active == 0) {
        this.getNotCheckPrescriptionList();
      } else {
        this.getCheckPrescriptionList()
      }
    },
    // 待审方列表
    getNotCheckPrescriptionList() {
      getNotCheckPrescriptionList(this.listQuery).then(async res => {
        console.log("待审方列表", res);
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        let data = res.data.rows;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.list = data;
        } else {
          this.list = this.list.concat(data);
          this.loading = false;
        }
        if (this.list.length > 0) {
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
    },
    getCheckPrescriptionList() {
      let param = this.listQuery_2;
      param.docId = myJsTools.getItem("token_info").docId;
      if (this.active == 1) {
        param.status = 2;
      } else {
        param.status = 1;

        if (this.endValue) {
          param.endTime = this.endValue + " 23:59:59";
          param.startTime = this.startValue + " 00:00:00";
        }

        param.searchValue = this.searchVal;
      }
      getCheckPrescriptionList(param).then(async res => {
        console.log("审方列表", res);
        this.searchVal = "";
        this.loading = false;
        this.listQuery_2.size = res.data.total / this.listQuery_2.limit;
        let data = res.data.rows;
        if (this.listQuery_2.page == 1) {
          this.listQuery_2.page = 1;
          this.isLoading = false;
          this.list = data;
        } else {
          this.list = this.list.concat(data);
          this.loading = false;
        }
        if (this.list.length > 0) {
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
        if (this.listQuery_2.page >= this.listQuery_2.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery_2.page++;
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
    confirmS() {
      this.startValue = this.timeFormat(this.startDate);
      this.isStart = false;
    },
    //点击确定(结束)
    confirmE() {
      this.endValue = this.timeFormat(this.endDate);
      this.isEnd = false;
      this.onRefresh();
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
    }
  }
};
</script>
<style scoped lang="less">


.my_box_time {
  text-align: center;
  padding: 0 15px;
  margin-top: 8px;
  border-radius: 4px;

  &_date {
    display: flex;
    align-items: center;
    background: @white;
    padding: 7px 0 7px 11px;

    input {
      width: 20%;
      text-align: center;
      .black-font;
      .font-size-sm;
      line-height: 22px;
    }

    .line {
      width: 5px;
      color: @gray;
    }

    .time {
      width: 14px;
      height: 19px;
      margin-right: 9px;
    }

    .sea {
      width: 50%;
      position: relative;
      margin-left: 9px;
      text-align: left;
    }

    .sea_img {
      width: 19px;
      height: 19px;
      position: absolute;
      right: calc(4% + 11px);
    }
  }
}
</style>
