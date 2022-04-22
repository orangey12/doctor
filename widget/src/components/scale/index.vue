<template>
  <div class="scaleIndex">
    <navbar title="量表"></navbar>
    <div class="listBody" @click="pressIndex = -1" v-if="scaleList.length > 0">
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
            @click="openDetail(item)"
          >
            <li class="scaleTitle">{{ item.didName }}</li>
            <li class="time">创建时间：{{ item.updateTime }}</li>
            <li class="totalNum">
              <u>共{{ item.topicNum }}题</u>
              <u
                @click.stop="
                  show = true;
                  pressIndex = index;
                "
              >
                <img src="../../assets/img/scale/more.png" class="icon-width-height-sm-16" />
              </u>
            </li>
            <div v-if="index == pressIndex" class="operaDiv">
              <van-popup
                v-model="show"
                position="right"
                :overlay="false"
                class="scalePopup"
                :close-on-click-overlay="false"
                round
                :overlay-style="{ background: 'rgba(0, 0, 0, 0)' }"
              >
                <li @click.stop="openEditPage(item)">
                  <img src="../../assets/img/scale/edit.png" class="editIcon" />
                  <span>编辑</span>
                </li>
                <li class="line"></li>
                <li @click.stop="delShow = true">
                  <img
                    src="../../assets/img/scale/delete.png"
                    class="deleteIcon"
                  />
                  <span>删除</span>
                </li>
              </van-popup>
              <van-popup
                class="popup"
                round
                v-model="delShow"
                :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
              >
                <li class="title">确认删除</li>
                <li class="tips">
                  是否确认删除该量表？
                </li>
                <div class="btns">
                  <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
                  <button class="publicBtn twoBtn" @click.stop="delScale(item)">确定</button>
                </div>
              </van-popup>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-else class="emptyDiv">
      <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon">
      <li>暂无量表</li>
    </div>
    <div class="bottomBtn" @click="actionShow = true">
      <button class="publicBtn">新建量表</button>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="openNewScale"
    />
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {
  deleteInquiringDiagnosisById,
  getInquiringDiagnosisList
} from "../../api/scale";
import myJsTools from "../../utils/myJsTools";
import ossUpDown from "../../utils/ossUpDown";
export default {
  name: "index",
  components: { Navbar },
  data() {
    return {
      show: true,
      actionShow: false,
      pressIndex: -1,
      delShow: false,
      actions: [
        { name: "新建空白模板", index: 0 },
        { name: "选择已有模板创建", index: 1 }
      ],
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
    //删除问诊单
    delScale(item) {
      this.pressIndex = -1;
      this.delShow = false;
      deleteInquiringDiagnosisById({
        didId: item.didId
      }).then(res => {
        console.log(res);
        this.getScaleList();
      });
    },
    //编辑问诊单
    openEditPage(item) {
      this.$router.push({
        name: "newScaleContent",
        query: {
          isEdit: true,
          didId: item.didId,
          didOnlyId: item.didOnlyId,
          title: item.didName
        }
      });
    },
    //新建量表
    openNewScale(val) {
      console.log(val);
      if (val.index == 0) {
        this.$router.push({
          name: "newScale"
        });
      } else {
        this.$router.push({
          name: "scaleList"
        });
      }
    },
    //  打开详情
    openDetail(item) {
      this.$router.push({
        name: "scaleDetail",
        query: {
          title: item.didName,
          didId: item.didId,
          didOnlyId: item.didOnlyId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">

.emptyDiv{
  margin-top: 30%;
}
.listBody {
  padding: 0 16px 60px 16px;
  height: calc(100vh - 44px - 80px);
  /deep/.van-pull-refresh {
    overflow: hidden;
    user-select: none;
    height: 100%;
  }
  .title {
    padding: 12px 0;
    .font-size-sm;
    .font-login-color;
    line-height: 16px;
  }
  .scaleCard {
    background: @white;
    border-radius: 8px;
    padding: 12px 0px;
    margin-bottom: 12px;
    position: relative;
    /deep/.van-overlay {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .scaleTitle {
      .black-font;
      .font-size-md;
      .font-blod-2;
      line-height: 22px;
      padding: 0 16px;
    }
    .time {
      .font-color-2;
      .font-size-md;
      line-height: 18px;
      margin-top: 10px;
      padding: 0 16px 12px;
      border-bottom: 0.5px solid @back-border;
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
