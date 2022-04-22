<template>
  <div class="followUpIndex" @click="pressIndex = -1">
    <navbar title="随访计划"></navbar>
    <van-tabs
      v-model="active"
      title-inactive-color="#666666"
      title-active-color="#14A0E6"
      color="#14A0E6"
      @change="changeTabs"
    >
      <van-tab title="日历">
        <calendar ref="calendar"></calendar>
        <div class="bottomBtn" @click.stop="openAdd">
          <button class="publicBtn">新增随访计划</button>
        </div>
      </van-tab>
      <van-tab title="清单" >
        <div class="followList" id="followList" >
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              @load="onLoaded"
            >
          <div
            class="card"
            @click.stop="openDetail(item)"
            v-for="(item, index) in followList"
            :key="index"
          >
            <li class="title">
              <u>{{ item.planName }}</u>
            </li>
            <li class="content">
              {{ item.planContent }}
            </li>
            <div class="time">
              <li>发送人数：{{ item.numberOf }}</li>
              <li>创建时间：{{ item.addTime }}</li>
              <img
                src="../../assets/img/follow/more.png"
                class="moreIcon"
                @click.stop="opreatList($event,index)"
              />
            </div>
            <div v-if="index == pressIndex" class="operaDiv">
              <van-popup
                v-model="show"
                position="right"
                :overlay="false"
                class="followPopup"
                :close-on-click-overlay="false"
                round
                :overlay-style="{ background: 'rgba(0, 0, 0, 0)' }"
              >
                <li
                  @click.stop="closeShow = true"
                  v-if="item.planStatus == '1'"
                >
                  <img
                    src="../../assets/img/follow/closeAll.png"
                    class="closeAll"
                  />
                  <span>关闭全部</span>
                </li>
                <li
                  @click.stop="delFollow(item, '1')"
                  v-if="item.planStatus == '2'"
                >
                  <img
                    src="../../assets/img/follow/closeAll.png"
                    class="closeAll"
                  />
                  <span>打开全部</span>
                </li>
                <li class="line"></li>
                <li @click.stop="delShow = true">
                  <img
                    src="../../assets/img/follow/delete.png"
                    class="delete"
                  />
                  <span>删除</span>
                </li>
              </van-popup>
              <van-popup
                class="popup"
                round
                v-model="closeShow"
                :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
              >
                <li class="title">全部关闭</li>
                <li class="tips">
                  确定要关闭全部计划吗？关闭全部，将终止全部随访计划。
                </li>
                <div class="btns">
                  <button class="publicWhiteBtn" @click.stop="closeShow = false">取消</button>
                  <button class="publicBtn twoBtn" @click.stop="delFollow(item, '2')">确定</button>
                </div>
              </van-popup>

              <van-popup
                class="popup"
                round
                v-model="delShow"
                :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
              >
                <li class="title">确认删除</li>
                <li class="tips">
                  确定要删除随访计划吗？删除后将终止该随访计划，
                </li>
                <div class="btns">
                  <button class="publicWhiteBtn" @click.stop="delShow = false">取消</button>
                  <button class="publicBtn twoBtn" @click.stop="delFollow(item, '0')">确定</button>
                </div>
              </van-popup>
            </div>
          </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { followupQueryPlanList, updateAll } from "../../api/followUp";
import myJsTools from "../../utils/myJsTools";
import $api from "../../utils/api";
import { Toast } from "vant";
import Calendar from "./calendar";
import {getInquiringDiagnosisList} from "../../api/scale";
export default {
  name: "followUpIndex",
  components: { Calendar, Navbar },
  data() {
    return {
      active: 0,
      listQuery: {
        page: 1,
        limit: 10,
        docId: "",
        size: 1
      },
      followList: [],
      pressIndex: -1,
      show: true,
      delShow: false,
      closeShow: false,
      isLoading: false,
      finished: true,
      loading: false,
      followHeight:"",//清单列表高度
    };
  },
  created() {
    this.listQuery.docId = myJsTools.getItem("token_info").docId;
    this.getFollowList();
  },
  methods: {
    openAdd() {
      this.$router.push({
        name: "addFollowUp"
      });
    },
    changeTabs(){
      if(this.active == 1){
        this.onRefresh();
      }else{
        this.$refs.calendar.getNowPlan()
      }
    },
    opreatList(e,index){
      console.log(e)
      this.pressIndex = index
      let clineHeight = 667
      console.log(clineHeight - e.clientY )
      let s = setTimeout(()=>{
          console.log(popups)
          let popups = document.getElementsByClassName("followPopup");
          for (let i = 0; i < popups.length; i++) {
            let pop = popups[i];
            if(clineHeight - e.clientY < 100){
            $api.css(pop,'top: 10px;bottom: 35px;');
          }else{
              $api.css(pop,'top: 130px;');
            }
            clearTimeout(s);
        }
      },10)
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
      this.getFollowList();
    },
    getFollowList() {
      followupQueryPlanList(this.listQuery).then(res => {
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
        // this.scaleList = res.data.rows;
      });
    },
    //删除全部
    delFollow(item, type) {
      updateAll({
        planId: item.planId,
        status: type
      }).then(res => {
        if (type == "0") {
          Toast("删除成功");
        } else if (type == "1") {
          Toast("打开随访计划成功");
        } else if (type == "2") {
          Toast("关闭成功");
        }
        this.getFollowList();
        this.closeShow = false;
        this.pressIndex = -1;
      });
    },
    //打开随访计划详情
    openDetail(item) {
      if(this.pressIndex != -1){
        this.pressIndex = -1;
        return;
      }
      this.$router.push({
        name: "followDetail",
        query: {
          id: item.planId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">

/deep/.van-pull-refresh {
  height: 100%;
}
.followList {
  padding:0px 15px 15px 15px;
  position: relative;
  .card {
    background: @white;
    border-radius: 8px;
    padding: 12px;
    position: relative;
    margin-top: 12px;
    .black-font;
    .font-size-md;
    .title {
      .font-blod-2;
      justify-content: space-between;
    }
    u:first-child {
      width: 80%;
    }
    .content {
      margin-top: 8px;
      line-height: 21px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
    .time {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid @back-border;
      font-size: 14px;
      position: relative;
      .moreIcon {
        position: absolute;
        .icon-width-height-sm;
        right: 12px;
        bottom: 0px;
      }
    }
  }
}
.operaDiv {
  /deep/.van-overlay {
    background-color: rgba(0, 0, 0, 0);
  }
}
.followPopup {
  box-sizing: border-box;
  width: 130px;
  padding: 0 9px;
  background: @white;
  right: 10px;
  text-align: center;
  border-radius: 8px;
  position: absolute;
  top: 130px;
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
</style>
