<template>
  <div class="drugList" id="drugList">
    <navbar type="defaultPage" title="我的处方"></navbar>
    <div class="searchDiv" id="searchDiv" :style="{ top: headerHeight + 'px' }">
      <div class="searchField">
        <van-form action="/">
          <van-search
            v-model="value"
            placeholder="请输入想要搜索的内容"
            :clearable="true"
            @search="onRefresh"
          />
        </van-form>
      </div>
      <span @click="clearSearch" class="font-login-color-blue">取消</span>
    </div>

    <div class="emptyDiv" v-if="commonlyCfList.length == 0">
      <img src="../../assets/img/cf/cycfEmpty.png" class="emptyIcon" />
      <li>您暂无处方信息，赶快添加吧</li>
    </div>
    <div v-else class="commonlyCfList" :style="{ 'padding-top': 32 + 'px' }">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text=""
          @load="onLoaded"
        >
          <van-swipe-cell v-for="(item, index) in commonlyCfList" :key="index">
            <div class="commonlyCfCard" @click="openAddPage(item)">
              <li class="title font-blod-2">
                <u>Rp</u>
                <u>
                  <span v-if="item.prescriptionType == 1">西药方</span>
                  <span v-if="item.prescriptionType == 3">草药方</span>
                  <span v-if="item.prescriptionType == 4">食品级</span>
                </u>
              </li>
              <li class="font-blod-2 font-size-sm-2">{{ item.dpmpName }}</li>
              <li v-for="(drugItem, drugIndex) in item.drug" :key="drugIndex">
                <u
                  >{{ drugIndex + 1 }}.{{ drugItem.drugName }}&nbsp;&nbsp;{{
                    drugItem.gg
                  }}</u
                >
                <u>x{{ drugItem.quan }}</u>
              </li>
            </div>
            <template #right>
              <van-button
                square
                color="#FF5050"
                @click="deleteCf(item)"
                text="删除"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="openAddPage">新增常用处方</button>
    </div>
  </div>
</template>

<script>
import {
  findAllDrug,
  addDoccommondrug,
  cancelDoccommondrug,
  findDrugByDocId,
  findDocCommonPrescription,
  findDocPrescriptionHistory
} from "@/api/cf.js";
import navbar from "@/common/navbar";
import $api from "@/utils/api.js";
import ossUpDown from "../../utils/ossUpDown";
import myJsTools from "../../utils/myJsTools";
import { Dialog, Toast } from "vant";
import { deleteDoccommonprescription } from "../../api/cf";

export default {
  data() {
    return {
      value: "",
      active: 0,
      drugList: [],
      docId: "",
      docName: "",
      listQuery: {
        page: 1,
        limit: 10,
        size: 1,
        type: 4
      },
      isLoading: false,
      finished: false,
      loading: false,
      commonlyCfList: [], //常用处方列表
      usedDrugList: [], //常用药列表
      headerHeight: ""
    };
  },
  created() {
    this.headerHeight = myJsTools.getItem("headerHeight");
    this.docId = this.$route.query.docId;
    this.docName = this.$route.query.docName;
    this.onRefresh();
  },
  components: { navbar },
  methods: {
    clearSearch() {
      this.value = "";
      this.onRefresh();
    },
    deleteCf(item) {
      var param = {
        dpmpId: item.dpmpId
      };
      Dialog.confirm({
        title: "删除常用处方",
        message: "是否删除该常用处方"
      })
        .then(() => {
          deleteDoccommonprescription(param).then(res => {
            console.log("删除处方", res);
            Toast("删除成功");
            this.onRefresh();
          });
        })
        .catch(() => {});
    },
    openAddPage(item) {
      if (item) {
        var dpmpId = item.dpmpId;
      }
      this.$router.push({
        name: "addUsedCf",
        query: {
          docId: this.docId,
          dpmpId: dpmpId,
          prescriptionType: item.prescriptionType,
          dpmpName: item.dpmpName
        }
      });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.listQuery.page = 1;
      this.onLoaded();
      myJsTools.setItem("myActive", this.active);
    },
    onLoaded() {
      if (this.isLoading) {
        this.isLoading = false;
      }
      this.getDrugList();
    },
    // 获取列表
    getDrugList() {
      var drugType;
      this.listQuery.docId = this.docId;
      this.listQuery.dpmpName = this.value;
      this.listQuery.type = 4;
      findDocCommonPrescription(this.listQuery).then(async res => {
        await this.dataSetFun(res);
      });
    },
    // 数据处理
    async dataSetFun(res) {
      let data = res.data.rows;
      console.log(JSON.stringify(data));
      this.loading = false;
      this.listQuery.size = res.data.total / this.listQuery.limit;
      if (this.listQuery.size < 2) {
        this.loading = false;
      }
      if (this.listQuery.page == 1) {
        this.listQuery.page = 1;
        this.isLoading = false;
        this.commonlyCfList = res.data.rows;
      } else {
        this.commonlyCfList = this.commonlyCfList.concat(data);
        this.loading = false;
      }
      if (this.listQuery.page >= this.listQuery.size) {
        this.finished = true; // 若数据已全部获取完毕
        return;
      }
      this.listQuery.page++;
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .van-button {
  height: 100%;
  display: inline-block;
  border-radius: 4px;
  width: 100%;
}

/deep/ .van-swipe-cell__right {
  padding-left: 8px;
}

.searchDiv {
  position: fixed;
  left: 0;
  display: flex;
  align-items: center;
  background: @white;
  .font-size-md;
  box-sizing: border-box;
  z-index: 3;
  width: 100%;

  /deep/ .van-icon__image {
    .icon-width-height-sm;
    padding: 4px 12px;
  }

  span {
    .font-size-md;
    line-height: 18px;
    padding: 12px 0 12px 11px;
  }

  .searchField {
    width: 85%;

    .van-field {
      width: 100%;
    }

    /deep/ .van-search {
      padding: 0;
    }

    /deep/ .van-search__content {
      padding-left: 0;
    }

    /deep/ .van-cell {
      align-items: center;
      padding-left: 12px;
    }
  }

  div {
    input {
      width: 100%;
    }
  }
}

.drugListInfo {
  padding: 8px 10px;

  .drugCard {
    .star {
      position: absolute;
      left: 0;
      width: 27px;
      height: 27px;
      top: 0;
    }

    position: relative;
    padding: 12px;
    background: @page-back;
    margin-bottom: 8px;
    border-radius: 8px;
  }

  .usedDrug {
    background: @white;
  }

  .drugInfo {
    display: flex;

    .info {
      padding-left: 12px;

      li {
        text-align: left;
      }

      .name {
        .black-font;
        .font-size-md;
        .font-blod-2;
      }

      .specification {
        .font-login-color;
        .font-login-sm;
        margin-top: 2px;
      }

      .price {
        .font-login-color-red;
        .font-size-md;
        margin-top: 4px;
        .font-blod-2;
      }
    }
  }

  .btns {
    text-align: right;
    margin-top: 12px;

    .grayBtn {
      border: 1px solid @font-color-3;
      .font-login-color;
    }
  }
}

.emptyDiv {
  margin-top: 76px;
}

.commonlyCfList {
  padding: 0 16px 80px;
  .black-font;
  .font-size-md;

  .commonlyCfCard {
    margin-top: 12px;
    background: @white;
    padding: 12px;
    border-radius: 4px;
  }

  li {
    margin-top: 12px;
    line-height: 16px;
    .display-div;

    :nth-child(1) {
      .div-overflow;
    }
  }

  .title {
    margin-top: 0px;

    :nth-child(1) {
      width: 85%;
    }
  }
}
</style>
