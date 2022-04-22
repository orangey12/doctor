<template>
  <div class="scaleIndex">
    <navbar title="量表"></navbar>
    <div class="listBody">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <li class="title">共{{ total }}个量表</li>
          <div
            class="scaleCard"
            id="card"
            v-for="(item, index) in scaleList"
            :key="index"
            @click="openEditTemplate(item)"
          >
            <li class="scaleTitle">{{ item.didName }}</li>
            <li class="time">创建时间：{{ item.updateTime }}</li>
            <li class="totalNum">
              <u>共{{ item.topicNum }}题</u>
            </li>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getInquiringDiagnosisList } from "../../api/scale";
import myJsTools from "../../utils/myJsTools";
export default {
  name: "sendScale",
  components: { Navbar },
  data() {
    return {
      listQuery: {
        limit: 10,
        page: 1,
        size: 1
      },
      total: 0,
      scaleList: [],
      isLoading: false,
      finished: true,
      loading: false
    };
  },
  created() {
    this.getScaleList();
    this.listQuery.docId = myJsTools.getItem("token_info").docId;
  },
  methods: {
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
      this.getScaleList();
    },
    //获取问诊单列表
    getScaleList() {
      getInquiringDiagnosisList(this.listQuery).then(res => {
        console.log(res);
        let data = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.scaleList = data;
        } else {
          this.scaleList = this.scaleList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
        // this.scaleList = res.data.rows;
      });
    },
    //  选择已有模板
    openEditTemplate(item) {
      this.$router.push({
        name: "sendScaleDetail",
        query: {
          didId: item.didId,
          title: item.didName,
          didOnlyId: item.didOnlyId,
          type: this.$route.query.type
        }
      });
    }
  }
};
</script>

<style scoped lang="less">

.listBody {
  padding: 0 16px;
  .title {
    padding: 12px 0;
    .font-color-2;
    .font-size-sm;
    line-height: 16px;
  }
  .scaleCard {
    background: @white;
    border-radius: 8px;
    padding: 12px 0px;
    margin-bottom: 12px;
    position: relative;
    .font-color-2;
    .font-size-md;
    .scaleTitle {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 22px;
      padding: 0 16px;
    }
    .time {
      line-height: 18px;
      margin-top: 10px;
      padding: 0 16px 12px;
      border-bottom: 0.5px solid @back-border;
    }
    .totalNum {
      .display-div;
      padding: 11px 16px 0 16px;
      line-height: 20px;
    }
  }
}
</style>
