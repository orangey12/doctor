<template>
  <div>
    <navbar title="药品销售汇总"></navbar>
    <div class="allSale">
      <van-tabs
        v-model="active"
        title-inactive-color="#666666"
        title-active-color="#14A0E6"
        color="#14A0E6"
        @click="onRefresh"
      >
        <van-tab title="药品销售汇总">
          <div class="searchDiv">
            <div class="timeDate">
              <img src="@/assets/img/my/date.png" alt="" class="time" />
              <input
                type="text"
                placeholder="开始时间"
                :value="listQuery.startTime"
                readonly
                @click="getStart(1)"
              />
              <div>至</div>
              <input
                type="text"
                placeholder="结束时间"
                :value="listQuery.endTime"
                @click="getStart(2)"
                readonly
              />
            </div>
            <van-popup v-model="selectDatePicker" position="bottom">
              <van-datetime-picker
                v-model="selectDate"
                type="date"
                title="选择年月日"
                @confirm="confirmS"
                @cancel="selectDatePicker = false"
              />
            </van-popup>
            <div>
              <button @click="onRefresh('search')">搜索</button>
            </div>
          </div>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="allList.length > 0">

            <van-list
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoaded"
            >
            <div v-for="(item,index) in allList" :key="index" class="allList">
              <li class="drugName"><span class="line"></span>{{item.drugName}}</li>
              <div class="deatilInfo display-div">
                <div>
                  <li class="black-font">药品类型</li>
                  <li class="font-login-color">{{item.drugType}}</li>
                </div>
                <div>
                  <li class="black-font">规格</li>
                  <li class="font-login-color">{{item.gg}}</li>
                </div>
                <div>
                  <li class="black-font">平均售价</li>
                  <li class="font-login-color">{{item.price}}</li>
                </div>
                <div>
                  <li class="black-font">数量</li>
                  <li class="font-login-color">{{item.quan}}</li>
                </div>
              </div>
              <li class="totalPrice">
                合计金额： <span class="font-login-color">{{item.drugTotal}}</span>
              </li>
              <li class="totalPrice">生产厂家： <span class="font-login-color">{{item.scqy}}</span></li>
            </div>

            </van-list>
          </van-pull-refresh>
          <div class="emptyDiv" v-if="allList.length == 0">
            <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon" />
            <li>暂无数据，您可以换个时间查询哦</li>
          </div>
        </van-tab>
        <van-tab title="药品销售明细">
          <div class="searchDiv">
            <div class="timeDate">
              <img src="@/assets/img/my/date.png" alt="" class="time" />
              <input
                type="text"
                placeholder="开始时间"
                :value="listQuery.startTime"
                readonly
                @click="getStart(1)"
              />
              <div>至</div>
              <input
                type="text"
                placeholder="结束时间"
                :value="listQuery.endTime"
                @click="getStart(2)"
                readonly
              />
            </div>
            <van-popup v-model="selectDatePicker" position="bottom">
              <van-datetime-picker
                v-model="selectDate"
                type="date"
                title="选择年月日"
                @confirm="confirmS"
                @cancel="selectDatePicker = false"
              />
            </van-popup>
            <div>
              <button @click="onRefresh('search')">搜索</button>
            </div>
          </div>
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text=""
              @load="onLoaded"
            >
              <div v-for="(item,index) in detailList" :key="index" class="allList" v-if="detailList.length > 0">
                <li class="drugName"><span class="line"></span>订单编号{{item.orderNo}}</li>
                <li class="display-div">
                  <u>{{item.drugName}}</u>
                  <u>{{item.payTime}}</u>
                </li>
                <div class="deatilInfo display-div">
                  <div>
                    <li class="black-font">药品类型</li>
                    <li class="font-login-color">{{item.drugType}}</li>
                  </div>
                  <div>
                    <li class="black-font">规格</li>
                    <li class="font-login-color">{{item.gg}}</li>
                  </div>
                  <div>
                    <li class="black-font">单价</li>
                    <li class="font-login-color">{{item.price}}</li>
                  </div>
                  <div>
                    <li class="black-font">数量</li>
                    <li class="font-login-color">{{item.quan}}</li>
                  </div>
                </div>
                <li class="totalPrice">
                  合计金额： <span class="font-login-color">{{item.drugTotal}}</span>
                </li>
                <li class="totalPrice">生产厂家： <span class="font-login-color">{{item.scqy}}</span></li>
              </div>
            </van-list>
          </van-pull-refresh>
          <div class="emptyDiv" v-if="detailList.length == 0">
            <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon" />
            <li>暂无数据，您可以换个时间查询哦</li>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {getDocDrugSalesDetail, getDocDrugSalesSummary} from "../../api/cf";
import myJsTools from "../../utils/myJsTools";
import date from "../../utils/date";
export default {
name: "drugSales",
  components: {Navbar},
  data(){
      return{
        listQuery: {
          page: 1,
          limit: 10,
          size: 1,
          type: 4,
          startTime:"",
          endTime:"",
        },
        isLoading: false,
        finished: false,
        loading: false,
        active:0,
        selectDatePicker:false,
        selectType:1,
        selectDate:new Date(),
        detailList:[],
        allList:[],
      }
  },
  created() {
    this.listQuery.startTime = date.prevMonth().split(" ")[0];
    this.listQuery.endTime = date.getFormatDate("-");
    this.onRefresh();
  },
  methods:{
    onRefresh(type){
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;

      this.detailList = [];
      this.allList = [];
      if(type != 'search'){
        this.listQuery.startTime = date.prevMonth().split(" ")[0];
        this.listQuery.endTime = date.getFormatDate("-");
      }
      this.onLoaded();
    },
    onLoaded(){
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getList();
    },
    //打开时间选择器（开始）
    getStart(type) {
      this.selectDatePicker = true;
      this.selectType = type;
    },
    //点击确定(开始)
    confirmS() {
      if(this.selectType == 1){
        this.listQuery.startTime = this.timeFormat(this.selectDate);
      }else{
        this.listQuery.endTime = this.timeFormat(this.selectDate);
      }
      this.selectDatePicker = false;
    },
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    },
    getList(){
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      let param = Object.assign({},this.listQuery);
      param.startTime = param.startTime + " 00:00:00";
      param.endTime = param.endTime + " 23:59:59";
      if(this.active == 0){
        getDocDrugSalesSummary(param).then(res=>{
          console.log(res);
          this.loading = false;
          this.listQuery.size = res.data.total / this.listQuery.limit;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.allList = res.data.rows;
          } else {
            this.allList = this.allList.concat(res.data.rows);
            this.loading = false;
          }
          if (this.listQuery.page >= this.listQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery.page++;
        })
      }else{
        getDocDrugSalesDetail(param).then(res=>{
          console.log(res);
          this.loading = false;
          this.listQuery.size = res.data.total / this.listQuery.limit;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.detailList = res.data.rows;
          } else {
            this.detailList = this.detailList.concat(res.data.rows);
            this.loading = false;
          }
          if (this.listQuery.page >= this.listQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery.page++;
        })
      }
    },

  }
}
</script>

<style scoped lang="less">

.searchDiv{
  display: flex;
  align-content: center;

  margin: 8px 16px;
  .black-font;
  .font-size-md;

  .timeDate{
    border-radius: 4px;
    background: @white;
    display: flex;
    align-content: center;
    line-height: 22px;
    padding: 12px;
    width: 80%;
    input{
      width: 40%;
    }
    div{
      margin-right: 10px;
      margin-left: 10px;
    }
  }
  .time{
    width: 19px;
    height: 19px;
    margin-right: 8px;
  }
  button{
    background: @white;
    line-height: 100%;
    height: 100%;
    width: 80px;
    text-align: center;
    border-radius: 4px;
    margin-left: 8px;
    .font-login-color-blue;
  }
}
.allList{
  background: @white;
  padding-bottom: 16px;
  margin: 0px 16px 8px;
  .black-font;
  .font-size-md;
  .drugName{
    padding: 15px 8px 12px;
    display: flex;
    align-items: center;
    .line{
      width: 3px;
      height: 14px;
      background: @blue;
      margin-right: 6px;
      display: inline-block;
    }
  }
  .display-div{
    padding: 0 19px 12px;
  }
  .deatilInfo{
    //margin: 0 19px;
    border-bottom: 1px solid @back-border;
    padding-bottom: 16px;
    text-align: center;
    .font-login-sm;
    .font-login-color{
      margin-top: 12px;
    }
  }
  .totalPrice{
    padding-left: 19px;
    margin-top: 12px;
  }
}
</style>
