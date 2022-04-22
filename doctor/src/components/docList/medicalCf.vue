<template>
  <div>
    <navbar title="医助处方确认"></navbar>

    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
      @click="onRefresh"
    >
      <van-tab title="待确认">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
            v-if="preList.length > 0"
          >
            <div class="prePoolList">
              <div class="card" @click="openPre(item)" v-for="(item,index) in preList" :key="index">
                <li class="patientName">
                  患者：{{ item.patientName }}
                </li>
                <li>
                  性别：{{ item.sex }}
                </li>
                <li>
                  年龄：{{ item.age }}
                </li>
                <li>
                  提交时间：{{ item.addTime }}
                </li>

              </div>
            </div>
          </van-list>
          <div v-else class="emptyDiv">
            <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon">
            <li>
              暂无处方
            </li>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已确认">
        <div class="timeSelect">
          <div class="timeShow">
            <img src="../../assets/img/index/date.png" class="icon-width-height-sm">
            <div class="time">
              <span @click="selectTime('1')">{{ startTime }}</span>
              <span class="labelSpan">至</span>
              <span @click="selectTime('2')">{{ endTime }}</span>
            </div>
          </div>
          <div class="searchBtn font-login-color-blue" @click="onRefresh">
            搜索
          </div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
            v-if="preList.length > 0"
          >
            <div class="prePoolList">
              <div class="card" @click="openPre(item)" v-for="(item,index) in preList" :key="index">
                <li class="patientName display-div">
                  <u>
                    患者：{{ item.patientName }}
                  </u>
                  <u class="font-login-color-blue">
                    <span v-if="item.responseStatus == '1'">待响应</span>
                    <span v-if="item.responseStatus == '2'">已响应</span>
                  </u>
                </li>
                <li>
                  性别：{{ item.sex }}
                </li>
                <li>
                  年龄：{{ item.age }}
                </li>
                <li>
                  提交时间：{{ item.addTime }}
                </li>
                <li class="font-login-color-red font-size-sm" v-if="item.responseStatus == '1'">
                  剩余<van-count-down
                  :time="item.usedTime"
                  format="HH时mm分ss秒"
                  v-if="24 * 3600 * 1000 >= item.usedTime > 0"
                />，处方将重新流转到处方池
                </li>
                <li v-if="item.responseStatus == '2'">
                  响应时间：{{ item.responseTime }}
                </li>
              </div>
            </div>
          </van-list>
          <div v-else class="emptyDiv">
            <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon">
            <li>
              暂无处方
            </li>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <van-popup position="bottom" v-model="showSelectTime">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="showSelectTime = false"
      />
    </van-popup>
  </div>


</template>

<script>
import Navbar from "../../common/navbar";
import {
  getRepurchaseConfirmList,
  queryProPrescriptionPoolListPage,
  queryProPrescriptionPoolReceivingListPage
} from "../../api/cf";
import date from "../../utils/date";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "prePool",
  components: {Navbar},
  data() {
    return {
      isLoading: false,
      finished: false,
      loading: false,
      currentDate: "",//选中的日期
      showSelectTime: false,//选择日期 筛选
      selectTimeType: "",//类型  开始/结束
      listQuery: {
        size: 1,
        page: 1,
        limit: 10
      },
      active: 0,
      preList: [],//处方池列表
      startTime: "",
      endTime: "",
      maxDate: '',
    }
  },
  created() {
    this.onRefresh();
    this.maxDate = this.currentDate = new Date();
    this.endTime = date.getNowDate(new Date().getTime());
    this.startTime = date.dateAdd(new Date().getTime(), 1);
  },
  methods: {
    openPre(item){
        this.$router.push({
          name:"prescription",
          query:{
            type:'prePool',
            status:this.active + 1,
            businessId:item.businessId,
            goPage:-1,
            patientId:item.patientId
          }
        })
    },
    selectTime(type) {
      this.selectTimeType = type;
      this.showSelectTime = true;
    },
    confirmDate(value) {
      if (this.selectTimeType == '1') {
        this.startTime = date.getNowDate(this.currentDate);
      } else {
        this.endTime = date.getNowDate(this.currentDate);
      }
      this.showSelectTime = false;
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.listQuery.page = 1;
      this.loading = true;
      this.preList = [];
      this.onLoaded();
    },
    // 上拉加载
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getList();
    },
    getList() {
      let param = this.listQuery;
      param.docId = myJsTools.getItem("token_info").docId;
      if (this.active == 1){
        param.startTime = this.startTime + " 00:00:00";
        param.endTime = this.endTime + " 23:59:59";
      }
      param.isConfirm = this.active;
      getRepurchaseConfirmList(param).then(res => {
        this.setData(res);
      })
    },
    setData(res) {
      let data = res.data.rows;
      this.total = res.data.total;
      this.loading = false;
      this.listQuery.size = res.data.total / this.listQuery.limit;
      if (this.listQuery.page == 1) {
        this.listQuery.page = 1;
        this.isLoading = false;
        this.preList = data;
      } else {
        this.preList = this.preList.concat(data);
        this.loading = false;
      }
      if (this.listQuery.page >= this.listQuery.size) {
        this.finished = true; // 若数据已全部获取完毕
        return;
      }
      this.listQuery.page++;
    },
  }
}
</script>

<style scoped lang="less">


.prePoolList {
  padding: 0 16px;
}

.card {
  background: @white;
  padding: 16px 12px;
  margin-top: 12px;
  .font-size-md;
  border-radius: 8px;

  .patientName {
    .font-size-md-2;
    .font-blod-2;
  }
  li{
    margin-bottom: 4px;
  }
}

.emptyDiv {
  margin-top: 30%;
}

.timeSelect {
  background: @white;
  display: flex;
  align-items: center;
  padding: 6px 16px;
  .font-size-md;

  .timeShow {
    background: @page-back;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    .black-font;
    border-radius: 4px;
    width: 76%;
  }

  .time {
    margin-left: 13px;
  }

  .labelSpan {
    margin: 0 20px;
  }

  .searchBtn {
    padding: 8px 9px;
    border-radius: 4px;
    margin-left: 12px;
    background: @page-back;
  }
}
/deep/ .van-count-down{
  display:inline-block;
  .font-login-color-red;
  .font-size-sm;
}
</style>
