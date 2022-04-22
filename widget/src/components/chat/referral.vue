<template>
  <div class="referral">
    <navbar title="转诊到"></navbar>
    <div class="docList">
      <van-dropdown-menu>
        <van-dropdown-item :title="deptName" ref="item">
          <van-cell @click="selectDept(item)" center :title="item.deptName" v-for="(item,index) in deptList"
                    :key="index">
          </van-cell>
        </van-dropdown-item>
      </van-dropdown-menu>
      <div class="allDocList">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text=""
            @load="onLoaded"
          >
            <div v-for="(item,index) in docList" :key="index">
              <div class="card" @click="sendDoc(index,item)" v-if="item.docId != docId">
                <img src="../../assets/img/my/default.png" class="headImg">
                <div class="docInfo">
                  <li class="name">
                    <u>{{item.docName}}</u>
                    <u>
                      <span class="font-login-color-red">¥{{item.referralPrice}}</span>
                    </u>
                  </li>
                  <li class="hbList">
                    {{item.docProf}}
                  </li>
                  <li class="hosList">
                    <span>{{item.hosName}}</span><span style="margin-left: 12px">{{item.deptName}}</span>
                  </li>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <van-popup
      class="popup"
      round
      v-model="zzShow"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.6)' }"
    >
      <li class="title">转诊提示</li>
      <li class="tips">
        确定该患者转诊给{{docName}}？
      </li>
      <div class="btns">
        <button class="publicWhiteBtn" @click.stop="zzShow = false">取消</button>
        <button class="publicBtn twoBtn" @click.stop="sendDocEvent">转诊</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Navbar from "../../common/navbar";
  import {findAllDept, findAllVisitType, findDoctorProfType} from "../../api/docList";
  import {getInquiringDiagnosisList} from "../../api/scale";
  import {queriesCanBeReferralDoctorsList} from "../../api/chat";
  import myJsTools from "../../utils/myJsTools";

  export default {
    name: "referral",
    components: {Navbar},
    data() {
      return {
        value: 0,
        deptItem: 0,
        deptName:"科室",
        zzShow: false,
        deptId: "",
        docName: "",//转诊到医生姓名
        deptList: [],
        isLoading: false,
        finished: true,
        loading: false,
        listQuery: {
          limit: 10,
          page: 1,
          size: 1,
          docId: "",
        },
        docId: "",
        docList: [],
        selectItem: {},
      }
    },
    created() {
      this.listQuery.docId = this.docId = myJsTools.getItem("token_info").docId;
      this.getDeptList();
      this.onRefresh();
    },
    methods: {
      //  选择科室
      selectDept(item) {
        console.log(item)
        this.deptId = item.deptId;
        this.deptName = item.deptName;
        this.$refs.item.toggle();
        this.onRefresh();
      },
      sendDoc(index, item) {
        this.docName = item.docName;
        this.zzShow = true;
        this.selectItem = item;
      },
      sendDocEvent() {
        api.sendEvent({
          name: 'sendDoc',
          extra: {
            receivingDocId: this.selectItem.docId,
            receivingDocName: this.selectItem.docName,
            deptId: this.selectItem.deptId,
            deptName: this.selectItem.deptName
          }
        });
        this.$router.go(-1);
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
        this.getDocList();
      },
      //获取转诊医生列表
      getDocList() {
        if (this.deptId) {
          this.listQuery.deptId = this.deptId;
        }
        queriesCanBeReferralDoctorsList(this.listQuery).then(res => {
          console.log(res);
          let data = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
          this.listQuery.size = res.data.total / this.listQuery.limit;
          if (this.listQuery.page == 1) {
            this.listQuery.page = 1;
            this.isLoading = false;
            this.docList = data;
          } else {
            this.docList = this.docList.concat(data);
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
      onConfirm() {
        this.$refs.item.toggle();
      },
      //获取科室列表
      getDeptList() {
        findAllDept({
          deptName: "",
          page: 1,
          limit: 100,
        }).then(res => {
          this.deptList = res.data.rows;
          console.log(res);
        })
      }
    }
  }
</script>

<style scoped lang="less">


  .allDocList {
    padding: 8px 16px;

    .card {
      margin-bottom: 8px;
      background: @white;
      border-radius: 8px;
      padding: 12px;
      .black-font;
      .font-size-md-2;
      display: flex;
      align-items: center;
      line-height: 16px;

      .headImg {
        .img-width-height-lg;
        margin-right: 12px;
      }

      .docInfo {
        width: 85%;
      }

      .name {
        margin-bottom: 10px;
        .display-div;
      }

      .hbList {
        margin-bottom: 10px;
        .font-size-md;
      }

      .hosList {
        .font-login-sm;
        .font-login-color;
      }
    }
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
