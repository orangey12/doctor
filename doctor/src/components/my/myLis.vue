<template>
<div>
  <navbar title="我的检验"></navbar>
  <div class="list">
    <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="option" @change="onRefresh"/>
    </van-dropdown-menu>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="list.length > 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text=""
        @load="onLoaded"
      >
        <div class="card" v-for="(item,index) in list" :key="index" @click="openDetail(item)">
          <li class="display-div">
            <u class="font-blod">检验编号：{{ item.ppiCode}}</u>
            <u class="font-login-color-red" v-if="item.status == '1' || item.status == '2' || item.status == '3' || item.status == '7' || item.status == '8' || item.status == '9'">{{item.statusName}}</u>
            <u class="font-login-color-blue" v-if="item.status == '4' || item.status == '5'">{{item.statusName}}</u>
            <u class="black-font" v-if="item.status == '0' || item.status == '6'">{{item.statusName}}</u>
          </li>
          <div class="info display-div">
            <div>
              <li class="font-blod">检验项目：{{item.itemName}}</li>
              <li class="cardInfo">医院：{{item.hosName}}</li>
              <li class="cardInfo">就诊人：{{ item.patientName }}</li>
              <li class="cardInfo">医生姓名：{{ item.docName }}</li>
              <li class="cardInfo">医生诊断：{{item.diagName}}</li>
            </div>
            <div>
              <img src="../../assets/img/my/right.png" class="icon-width-height-sm">
            </div>
          </div>
          <li>开单时间：{{item.addTime}}</li>
        </div>
      </van-list>
    </van-pull-refresh>

    <div v-else class="emptyDiv">
      <img src="../../assets/img/cf/zdkfEmpty.png" class="emptyIcon">
      <li>暂无检验单</li>
    </div>

  </div>
</div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {myLisList} from "../../api/chat";
import {getSysCodeByType} from "../../api/scale";
export default {
name: "myLis",
  components: {Navbar},
  data(){
  return{
    option:[],
    value:'',
    listQuery:{
      limit:10,
      page:1,
      size:1,
      caller:'1'
    },
    isLoading: false,
    finished: false,
    loading: false,
    list: [],
  }
  },
  created() {
    this.onRefresh();
    this.getStatus();
  },
  methods:{
    openDetail(item){
      this.$router.push({
        name:'lisDetail',
        query:{
          pliId: item.pliId
        }
      })
    },
    getStatus() {
      getSysCodeByType({
        codeType: "050"
      }).then(res => {
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i].text = data[i].meaning;
          data[i].value = data[i].code;
        }
        data.unshift({
          text:"全部",
          value:''
        })
        this.option = data;
      });
    },
    // 下拉刷新
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      this.list = [];
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
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.listQuery.status = this.value;
      myLisList(this.listQuery).then(res => {
        this.listQuery.size = res.data.total / this.listQuery.limit;
        this.loading = false;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.list = res.data.rows;
        } else {
          this.list = this.list.concat(res.data.rows);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        } else {
          this.listQuery.page++;
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

.list{
  padding: 12px 16px 0;
}
.card{
  padding: 16px;
  background: @white;
  font-size: 14px;
  margin-top: 12px;
  line-height: 20px;
}

.cardInfo{
  .font-color-2;
  margin-top: 8px;
}

.info{
  padding: 12px 0;
  margin: 12px 0;
  border-bottom: 1px solid @back-border;
  border-top: 1px solid @back-border;
}
</style>
