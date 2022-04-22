<template>
  <div class="serviceHistory">
    <navbar title="历史设置"></navbar>
    <li class="totalPrice" ref="totalPrice" :style="{'top':headerHeight + 'px'}">
      <u>总金额</u>
      <u>{{totalPrice}}</u>
    </li>
    <div class="hisList">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <div class="hiscard" v-for="(item,index) in hisList" :key="index" @click="openServiceDetail(item)">
            <li class="title display-div div-overflow">
              <u>{{item.customBussTitle}}</u>
              <u class="status font-login-color-red" v-if="item.status == '0'">待支付</u>
              <u class="status font-login-color-blue" v-if="item.status == '1'">待服务</u>
              <u class="status font-login-color-blue" v-if="item.status == '2'">已服务</u>
              <u class="status black-font" v-if="item.status == '7'">已退费</u>
            </li>
            <li class="content">
              <u>{{item.customBussMemo}}</u>
            </li>
            <li class="time display-div">
              <u class="date">{{item.addTime.split(" ")[0]}}</u>
              <u class="price">{{item.customBussPrice}}</u>
            </li>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {getCustomBusinessListByPatientIdAndDocId, getListDicCustomBusiness} from "../../api/myService";
  import myJsTools from "../../utils/myJsTools";
  import $api from "@/utils/api.js";
  export default {
    name: "serviceHistory",
    components: {Navbar},
    data(){
      return{
        listQuery:{
          page:1,
          size:1,
          limit:10
        },
        headerHeight:"",
        isLoading: false,
        finished: true,
        loading: false,
        hisList:[],
        userInfo:{},
        totalPrice:0
      }
    },
    created() {
      this.userInfo = myJsTools.getItem("patientInfo");
      this.headerHeight = myJsTools.getItem("headerHeight");
      this.onRefresh();
    },
    mounted() {
      setTimeout(() => {
        this.topHeight = parseInt(this.$refs.totalPrice.offsetHeight);
        $api.css($api.dom('.hisList'), 'padding-top:' + parseInt(this.topHeight - 5) + "px !important;")
      }, 200)
    },
    methods:{
      //打开服务详情
      openServiceDetail(item) {
        this.$router.push({
          name: "serviceDetail",
          query: {
            customBussinessId: item.customBussinessId,
            status:item.status
          }
        })
      },
      // 下拉刷新
      onRefresh() {
        // 清空列表数据
        this.finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.listQuery.page = 1;
        this.onLoaded();
      },
      // 上拉加载
      onLoaded() {
        if (this.isLoading) {
          this.isLoading = false;
        }
        this.getList();
      },
      getList(){
        this.listQuery.docId = myJsTools.getItem("token_info").docId;
        this.listQuery.patientId = this.userInfo.patientId;
        getCustomBusinessListByPatientIdAndDocId(this.listQuery).then(res=>{
          this.totalPrice = res.data.customBussTotalPrice;
          let data = res.data.pageResult.rows;
          this.loading = false;
          this.listQuery.size = res.data.pageResult.total / this.listQuery.limit;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.hisList = data;
          } else {
            this.hisList = this.hisList.concat(data);
            this.loading = false;
          }
          if (this.listQuery.page >= this.listQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery.page++;
        })
      },
    }
  }
</script>

<style scoped lang="less">

  .totalPrice{
    background: @white;
    .black-font;
    .font-size-md-2;
    .font-blod-3;
    justify-content: space-between;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    z-index: 9;
    u:last-child{
      .font-size-lg-2;
    }
  }
  .hisList{
    margin-top: 12px;
    background: @white;
    padding: 0px 16px;
  }
  .title{
    .black-font;
    .font-size-md-2;
    line-height: 22px;
    padding-top: 12px;
  }
  .content{
    .font-color-2;
    .font-login-sm;
    line-height: 22px;
    margin: 3px 0;

  }
  .time{
    .font-size-sm;
    .font-color-2;
    line-height: 22px;
    padding-bottom: 12px;
    border-bottom: 0.5px solid @back-border;
    .price{
      .black-font;
      .font-size-md-2;
      .font-blod-2;
    }
  }
</style>
