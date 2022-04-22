<template>
  <div>
    <navbar title="随访记录"></navbar>
    <div class="listBody" v-if="followList.length > 0">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <div
            class="scaleCard"
            id="card"
            v-for="(item, index) in followList"
            :key="index"
            @click="openDetail(item)"
          >
            <li class="scaleTitle">
              <u style="width: 80%;">{{ item.planName }}</u>
            </li>
            <li class="time" v-if="item.planContent">{{item.planContent}}</li>
            <li class="time">发送时间：{{ item.sendTime }}</li>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="emptyDiv" v-else>
      <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon">
      <li>您暂未给患者发送过随访</li>
    </div>
  </div>
</template>

<script>
import {queryAPatientFollowupPlanList} from "../../api/followUp";
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "patientFollowUp",
  components: {Navbar},
  data() {
    return {
      isLoading: false,
      finished: true,
      loading: false,
      followList:[],
      listQuery: {
        limit: 10,
        page: 1,
        size: 1
      },
    }
  },
  created() {
    this.listQuery.patientId = this.$route.query.patientId;
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
    openDetail(item){
      this.$router.push({
        name:"followUpDetail",
        query:{
          plsId:item.plsId,
          patientId:this.$route.query.patientId
        }
      })
    },
    getList(){
      queryAPatientFollowupPlanList(this.listQuery).then(res=>{
        console.log(res);
        let data = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.followList = data;
        } else {
          this.followList = this.followList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      })
    }
  }
}
</script>

<style scoped lang="less">

.emptyDiv{
  margin-top: 30%;
}
.listBody {
  padding: 12px 16px 0;
  .scaleCard {
    background: @white;
    border-radius: 8px;
    padding: 12px 0px;
    margin-bottom: 12px;
    position: relative;
    .scaleTitle {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 22px;
      padding: 0 16px;
      justify-content: space-between;
      .isfeedback {
        line-height: 22px;
      }
    }
    .time {
      .font-login-color;
      .font-size-md;
      line-height: 18px;
      margin-top: 8px;
      padding: 0 16px;
    }
    .totalNum {
      .display-div;
      padding: 11px 16px 0 16px;
      .font-color-2;
      .font-size-md;
      line-height: 20px;
    }
    .operaDiv {
      /deep/.van-overlay {
        background-color: rgba(0, 0, 0, 0);
      }
    }
    .scalePopup {
      box-sizing: border-box;
      width: 82px;
      padding: 0 9px;
      background: @white;
      right: 20px;
      text-align: center;
      border-radius: 8px;
      position: absolute;
      top: 110px;
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
  }
}
</style>
