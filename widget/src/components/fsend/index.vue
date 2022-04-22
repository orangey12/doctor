<template>
  <div class="fendIndex">
    <navbar type="defaultPage" title="群发"></navbar>
    <ul class="sendList_box" id="scrolldIV" v-if="sendList.length > 0">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
      <li v-for="item in sendList" :key="item.flockId" class="sendList">
        <div class="sendList_time">{{ item.sendTime }}</div>
        <div class="sendList_cont">
          <div class="title">
            <p>{{ item.patientIdCount }}位患者:</p>
            <p class="one-txt-cut">{{ item.patientNameStr }}</p>
          </div>
          <div class="content">
            <p class="one-txt-cut">{{ item.sendContent }}</p>
            <img v-if="item.sendImg" v-zlazy="item.sendImg" alt />
          </div>
          <div class="again font-login-color-blue" @click="goAgain(item)">再发一条</div>
        </div>
      </li>
        </van-list>
      </van-pull-refresh>
    </ul>
    <div class="emptyDiv" v-if="sendList.length <= 0">
      <div class="box_empty_center">
        <img src="../../assets/img/fsend/fsend_empty.png" class="emptyIcon"/>
        <li>
          暂无群发消息，点击新建群发 发送消息吧
        </li>
      </div>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="AddPage">新建群发</button>
    </div>
  </div>
</template>

<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import { findDocBulkList } from "@/api/fsend";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";
export default {
  name: "indexFsend",
  components: { navbar },
  data() {
    return {
      sendList: [],
      listQuery:{
        limit:10,
        page:1,
        size:1,
        docId:"",
      },
      isLoading: false,
      finished: true,
      loading: false
    };
  },
  created() {
    this.listQuery.docId = myJsTools.getItem("token_info").docId;
  },
  mounted() {
    this.onRefresh();
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
      this.getList();
    },
    getList(){
      findDocBulkList(this.listQuery).then(async res => {
        let data = res.data.rows;
        this.total = res.data.total;
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        for (let i = 0; i < data.length; i++) {
          let element = data[i];
          let addTime = new Date(element.addTime).getTime();
          if (new Date(addTime).toDateString() === new Date().toDateString()) {
            element.addTime = element.addTime.substring(10);
          }
        }
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.sendList = data;
        } else {
          this.sendList = this.sendList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
        if (this.sendList.length > 0) {
          this.scrollToBottom();
        }
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        var container = this.$el.querySelector("#scrolldIV");
        document.documentElement.scrollTop = container.scrollHeight;
      });
    },
    AddPage() {
      this.$router.push({
        name: "newsFsend"
      });
    },
    goAgain(item) {
      this.$router.push({
        name: "newsFsend",
        query: {
          sendId:item.sendId,
        }
      });
      /*this.$router.push({
        name: "fsendLook",
        query: {
          sendId:item.sendId,
        }
      });*/
    }
  }
};
</script>
<style scoped lang="less">

.fendIndex {
  padding-top: 10px;
  background: @page-back;
  box-sizing: border-box;
}
.emptyDiv{
  margin-top: 30%;
}
.sendList_box {
  padding: 0 16px 72px 16px;
  .sendList {
    //padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
    .sendList_time {
      padding: 8px 0px;
      .font-login-color;
      .font-size-sm;
      text-align: center;
    }
    .sendList_cont {
      background-color: @white;
      border-radius: 8px;
      padding: 16px 0;
      .font-size-md;
      .title {
        .font-color-2;
        padding: 0 16px 14px;
        border-bottom: 1px solid @back-border;
      }
      .content {
        padding: 12px 16px;
        .black-font;
        border-bottom: 1px solid @back-border;
        p {
          line-height: 29px;
        }
        img {
          width: 100%;
          height: 185px;
          border-radius: 8px;
        }
      }
      .again {
        .font-size-sm;
        padding-top: 16px;
        text-align: center;
      }
    }
  }
}

.box_empty {
  height: calc(100% - 63px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 70px;
  .box_empty_center {
    width: 200px;
    text-align: center;
    font-size: 14px;
    color: #999999;
    img {
      width: 193px;
      height: 162px;
      margin-bottom: 20px;
    }
  }
}
.btn_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px 16px 16px;
  background-color: #f5f5f5;
  .addUsedCf {
    height: 45px;
    color: #ffffff;
    font-size: 18px;
    width: 100%;
    background: #14a0e6;
    border-radius: 25px;
  }
}
</style>
