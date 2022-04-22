<template>
  <div>
    <navbar title="销售明细"></navbar>
    <div>
      <div v-if="list.length > 0">
        <van-collapse v-model="activeNames">
          <van-collapse-item
            :name="index"
            v-for="(item, index) in list"
            :key="index"
          >
            <template #title>
              <div>
                <li>
                  {{ item.settlementMonth.split("-")[0] }}年{{
                    item.settlementMonth.split("-")[1]
                  }}月
                </li>
              </div>
            </template>
            <li class="totlaPrice">
              <span v-if="nowDate == item.settlementMonth"
                >预计合计：{{ item.actualSettlementTotal }}</span
              >
              <span v-if="nowDate != item.settlementMonth"
                >合计：{{ item.actualSettlementTotal }}</span
              >
              <span @click.stop="openDetail(item.settlementMonth)"
                >查看更多
                <img src="../../assets/img/my/rightArrow.png" class="rightArrow"
              /></span>
            </li>
            <div
              v-for="(item1, index1) in item.details"
              :key="index1"
              class="detailLi"
              :style="index1 == 0 ? 'border:none' : ''"
            >
              <div class="detailInfo">
                <li class="bussTypeName">{{ item1.bussTypeName }}</li>
                <li class="time">{{ item1.addTime }}</li>
              </div>
              <div class="price font-login-color-blue">
                +{{ item1.actualSettlement }}
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="emptyDiv" v-if="list.length == 0">
        <img src="../../assets/img/index/emptyIndex.png" class="emptyIcon" />
        <li>暂无明细</li>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getDocMonthProfitDetail } from "../../api/order";
import myJsTools from "../../utils/myJsTools";
import ossUpDown from "../../utils/ossUpDown";
import date from "../../utils/date";
export default {
  name: "myEarningDetail",
  components: { Navbar },
  data() {
    return {
      activeNames: ["1"],
      list: [],
      nowDate: ""
    };
  },
  created() {
    this.getList();
    let nowDate = date.getFormatDate("-").split("-");
    this.nowDate = nowDate[0] + "-" + nowDate[1];
  },
  methods: {
    openDetail(time) {
      this.$router.push({
        name: "myMounthEarning",
        query: {
          time: time
        }
      });
    },
    getList() {
      getDocMonthProfitDetail({
        docId: myJsTools.getItem("token_info").docId,
        limit: 10,
        page: 1
      }).then(res => {
        console.log(res);
        this.list = res.data;
      });
    }
  }
};
</script>

<style scoped lang="less">
.emptyDiv {
  margin-top: 30%;
}
/deep/.van-collapse-item__content {
  padding: 0;
}
/deep/.van-cell {
  background-color: initial;
  .black-font;
}
.totlaPrice {
  .font-color-2;
  .font-size-sm;
  line-height: 22px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: @page-back;
  .rightArrow {
    display: inline-block;
  }
  span {
    display: inline-block;
    width: 80%;
  }
  :first-child {
    text-align: left;
  }
  :last-child {
    width: 20%;
    display: flex;
    align-items: center;
    margin: 0 auto;
  }
}
.detailLi {
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin: 0 16px;
  border-top: 1px solid @back-border;

  .detailInfo {
    width: 70%;
    .bussTypeName {
      .black-font;
      .font-size-md;
      line-height: 22px;
    }
    .time {
      .font-color-2;
      .font-size-sm;
      line-height: 22px;
    }
  }
  .price {
    .font-size-lg-2;
    .font-blod-2;
    line-height: 22px;
    width: 30%;
    text-align: right;
  }
}
</style>
