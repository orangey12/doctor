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
  name: "index",
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
        name: "newScaleContent",
        query: {
          isEdit: true,
          didId: item.didId,
          didOnlyId: item.didOnlyId,
          title: item.didName,
          isTemplate: true
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
    color: #666666;
    font-size: 11px;
    line-height: 16px;
  }
  .scaleCard {
    background: #ffffff;
    border-radius: 8px;
    padding: 12px 0px;
    margin-bottom: 12px;
    position: relative;
    .scaleTitle {
      color: #333333;
      font-size: 14px;
      line-height: 22px;
      font-weight: 600;
      padding: 0 16px;
    }
    .time {
      color: #666666;
      font-size: 14px;
      line-height: 18px;
      margin-top: 10px;
      padding: 0 16px;
      padding-bottom: 12px;
      border-bottom: 0.5px solid #ebebeb;
    }
    .totalNum {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 16px 0 16px;
      color: #666666;
      font-size: 14px;
      line-height: 20px;
      img {
        width: 22px;
        height: 22px;
      }
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
      background: #ffffff;
      right: 20px;
      text-align: center;
      border-radius: 8px;
      right: 0px;
      position: absolute;
      top: 110px;
      border: 0.5px solid #e5e5e5;
      transform: none;

      li {
        align-items: center;
        padding: 12px 0;
        display: flex;
        img {
          width: 22px;
          height: 22px;
          margin-right: 12px;
        }
      }
      .line {
        height: 0.5px;
        background: #eeeeee;
        width: 100%;
        padding: 0;
      }
    }
  }
}
.addBtn {
  background: #14a0e6;
  color: #ffffff;
  font-size: 16px;
  line-height: 45px;
  position: fixed;
  bottom: 16px;
  margin: 0 16px;
  width: 91%;
  text-align: center;
  border-radius: 25px;
}
.deletePopup {
  width: 70%;
  padding: 20px;
  color: #333333;
  text-align: center;
  .title {
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
  }
  .tips {
    font-size: 12px;
    line-height: 17px;
    margin-top: 28px;
    padding: 0 10px;
    font-weight: 600;
  }
  .btns {
    display: flex;
    margin-top: 19px;

    button {
      width: 48%;
      font-size: 16px;
      line-height: 34px;
      border-radius: 23px;
    }
    :nth-child(1) {
      border: 1px solid #14a0e6;
      color: #14a0e6;
      background: #ffffff;
    }
    :nth-child(2) {
      color: #ffffff;
      background: #14a0e6;
      margin-left: 20px;
    }
  }
}
</style>
