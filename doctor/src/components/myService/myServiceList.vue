<template>
  <div class="myServiceList">
    <navbar title="我的自定义服务"></navbar>
    <div class="serList" v-if="isSwitch == '1'">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <van-swipe-cell v-for="(item,index) in serviceList" :key="index">
            <div class="serviceCard" @click="openDetail(item)">
              <div>
                <div class="price">
                  <span>¥</span><span class="num">{{item.customBussPrice}}</span>
                </div>
                <div class="titleContent">
                  <li class="title">{{item.customBussTitle}}</li>
                  <li style="width: 95%;word-wrap:break-word">{{item.customBussMemo}}</li>
                </div>
              </div>
              <div>
                <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
              </div>
            </div>
            <template #right>
              <button class="editBtn" @click="editService(item)">编辑</button><button class="delBtn" @click="delService(item)">删除</button>
              <div style="width: 46x"></div>
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="bottomBtn" @click="openAdd" v-if="isSwitch == '1'">
      <button class="publicBtn">添加自定义服务</button>
    </div>
    <div v-if="isSwitch == '0'" class="emptyDiv">
      <img src="../../assets/img/my/qx.png" class="noneQx">
      <li>暂无设置权限</li>
    </div>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {deleteDicCustomBusiness, getDocSwitch, getListDicCustomBusiness} from "../../api/myService";
  import {Dialog} from "vant";
  import myJsTools from "../../utils/myJsTools";

  export default {
    name: "myServiceList",
    components: {Navbar},
    data() {
      return {
        listQuery: {
          page: 1,
          size: 1,
          limit: 10
        },
        isLoading: false,
        finished: true,
        loading: false,
        serviceList: [],
        isSwitch: false,
      }
    },
    created() {
      this.listQuery.docId = myJsTools.getItem("token_info").docId;
      this.getSwitch();
    },
    methods: {
      getSwitch() {
        getDocSwitch({
          bussType: "3",
          docId: myJsTools.getItem("token_info").docId
        }).then(res => {
          console.log(res);
          this.isSwitch = res.data.isSwitch
          if (res.data.isSwitch == '1') {
            this.onRefresh();
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
      getList() {
        getListDicCustomBusiness(this.listQuery).then(res => {
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
      //  打开添加自定义服务页面
      openAdd() {
        this.$router.push({
          name: "addService"
        })
      },
      // 编辑自定义服务
      editService(item) {
        this.$router.push({
          name: "addService",
          query: {
            customId: item.customId
          }
        })
      },
      //打开详情
      openDetail(item) {
        this.$router.push({
          name: "serviceDetail",
          query: {
            customId: item.customId
          }
        })
      },
      //删除自定义服务
      delService(item) {
        Dialog.confirm({
          title: '删除自定义服务',
          message: '是否确定删除该自定义服务',
        })
          .then(() => {
            // on confirm
            deleteDicCustomBusiness({
              customId: item.customId
            }).then(res => {
              console.log(res);
              this.onRefresh();
            })
          })
          .catch(() => {
            // on cancel
          });
      },
    }
  }
</script>

<style scoped lang="less">


  .serList {
    padding: 0 15px 70px;

    .serviceCard {
      position: relative;
      margin-top: 12px;
      background: url("../../assets/img/my/serviseBak.png") no-repeat;
      background-size: 100% 100%;
      padding: 29px 30px;
      .black-font;
      .display-div;
      :nth-child(1){
        display: flex;
        align-items: center;
      }
      .price {
        font-size: 18px;

        .num {
          font-size: 30px;
          .font-blod-2;
        }
      }

      .titleContent {
        margin-left: 20px;
        .font-size-md;

        .title {
          .font-size-lg-2;
          margin-bottom: 10px;
          line-height: 18px;
        }
      }

      .rightArrow {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 30px;
        top: 43%;
      }
    }
  }

  .addCommit {
    position: fixed;
    bottom: 0px;
    background: #14A0E6;
    color: #ffffff;
    font-size: 18px;
    line-height: 49px;
    text-align: center;
    width: 100%;
  }

  .editBtn {
    height: 100%;
    width: 80px;
    text-align: center;
    color: #ffffff;
    background: #666666;
    border-radius: 8px 0px 0px 8px;
  }

  .delBtn {
    height: 100%;
    width: 56px;
    text-align: center;
    color: #ffffff;
    background: #FF5050;
    border-radius: 0px 8px 8px 0px;
  }

  .emptyDiv {
    margin: 0 auto;
    text-align: center;
    color: #999999;
    font-size: 14px;
    margin-top: 20px;

    .noneQx {
      width: 193px;
      height: 162px;
      display: inline-block;
      margin-top: 100px;
    }
  }
</style>
