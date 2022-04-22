<template>
  <div class="myServiceList">
    <navbar title="我的自定义服务"></navbar>
    <div class="serList">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
            <div class="serviceCard"v-for="(item,index) in serviceList" :key="index" >
              <div class="price">
                <span>¥</span><span class="num">{{item.customBussPrice}}</span>
              </div>
              <div class="titleContent">
                <li class="title">{{item.customBussTitle}}</li>
                <li style="width: 75%;word-wrap:break-word">{{item.customBussMemo}}</li>
              </div>
              <div class="sendBtn" @click="sendService(item)">
                <button>发送</button>
              </div>
            </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import { getListDicCustomBusiness} from "../../api/myService";
  import myJsTools from "../../utils/myJsTools";
  export default {
    name: "myServiceList",
    components: {Navbar},
    data(){
      return{
        listQuery:{
          page:1,
          size:1,
          limit:10
        },
        isLoading: false,
        finished: true,
        loading: false,
        serviceList:[],
      }
    },
    created() {
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.onRefresh();
    },
    methods:{
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
        getListDicCustomBusiness(this.listQuery).then(res=>{
          let data = res.data.rows;
          this.loading = false;
          this.listQuery.size = res.data.total / this.listQuery.limit;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.serviceList = data;
          } else {
            this.serviceList = this.serviceList.concat(data);
            this.loading = false;
          }
          if (this.listQuery.page >= this.listQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.listQuery.page++;
        })
      },
      sendService(item){
        let ext = {
          type: "zdyfw",
          customId:item.customId,
          customBussTitle:item.customBussTitle,
          customBussMemo:item.customBussMemo,
          customBussPrice:item.customBussPrice
        };
        api.sendEvent({
          name: "sendService",
          extra: {
            ext: ext
          }
        });
        this.$router.go(-1);
      },
    }
  }
</script>

<style scoped lang="less">
  .serList{
    padding:0 15px;
    .serviceCard{
      position: relative;
      margin-top: 12px;
      display: flex;
      background: url("../../assets/img/my/serviseBak.png") no-repeat;
      background-size: 100% 100%;
      padding: 29px 30px;
      align-items: center;
      .price{
        font-size: 18px;
        color: #333333;
        .num{
          font-size: 30px;
          font-weight: 600;
        }
      }
      .titleContent{
        margin-left: 20px;
        color: #333333;
        font-size: 14px;
        .title{
          font-size: 18px;
          margin-bottom: 10px;
          line-height: 18px;
        }
      }
      .rightArrow{
        width: 20px;
        height: 20px;
        position: absolute;
        right: 30px;
        top: 43%;
      }
    }
  }
  .addCommit{
    position: fixed;
    bottom: 0px;
    background: #14A0E6;
    color: #ffffff;
    font-size: 18px;
    line-height: 49px;
    text-align: center;
    width: 100%;
  }
  .editBtn{
    height: 100%;
    width: 80px;
    text-align: center;
    color: #ffffff;
    background: #666666;
    border-radius: 8px 0px 0px 8px;
  }
  .delBtn{
    height: 100%;
    width: 56px;
    text-align: center;
    color: #ffffff;
    background: #FF5050;
    border-radius: 0px 8px 8px 0px;
  }
  .sendBtn{
    width: 59px;
    line-height: 30px;
    position: absolute;
    right: 24px;
    top: 37%;
    button{
      background: #14A0E6;
      color: #ffffff;
      font-size: 14px;
      text-align: center;
      width: 100%;
      border-radius: 5px;
      font-weight: 600;
    }
  }
</style>
