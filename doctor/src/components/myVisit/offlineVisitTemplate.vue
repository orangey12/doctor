<template>
  <div class="myVisit">
    <navbar title="我的出诊模板"></navbar>
    <div class="lineVisitDiv ">
      <li class="titleLi titleTips">
        <u>
          <span class="line"></span>
          <span>出诊排班</span>
        </u>
        <u>
          <span class="yuan"></span>
          <span>医院</span>
          <span class="yuan person"></span>
          <span>个人</span>
        </u>
      </li>
      <van-row>
        <van-col
          @click="setSelect(index)"
          span="4"
          v-for="(item, index) in dateLi"
          :key="index"
          :class="getClass(index)"
        >
          <li>{{ item.day }}</li>
          <li class="yuanLi">
            <span class="yuan person" v-if="item.vrTempType == '2' || item.vrTempType == '3'"></span>
            <span class="yuan" v-if="item.vrTempType == '3' || item.vrTempType == '1'"></span>
          </li>
        </van-col>
      </van-row>
    </div>
    <div id="test2"></div>
    <div v-if="visitDate.doc && visitDate.doc.length > 0">
      <div class="lineVisitDiv">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>自定义出诊信息</span>
          </u>
        </li>
      </div>
      <div class="lineVisitDiv">
        <van-swipe-cell
          v-for="(item, index) in visitDate.doc"
          :key="'offline-' + index"
        >
          <van-row>
          <span
            class="fl"
            style="font-size: 16px; font-weight: 700; margin_left:8px"
          >{{ item.startTime }} - {{ item.endTime }}</span
          >
            <div class="fr" style="font-size: 14px">
              <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
            </div>
          </van-row>
          <template #right style="display:flex;">
            <van-button square text="编辑" color="#666666" @click="offlineEditVisit(item)"/>
            <van-button square text="删除" color="#FF5050" @click="offlineDeleteVisit(item)"/>
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <div v-if="visitDate.hos && visitDate.hos.length > 0">
      <div class="lineVisitDiv">
        <li class="titleTips">
          <u>
            <span class="line"></span>
            <span>医院出诊信息</span>
          </u>
        </li>
      </div>
      <div class="lineVisitDiv">
        <van-swipe-cell
          v-for="(item, index) in visitDate.hos"
          :key="'offline-' + index"
        >
          <van-row>
          <span
            class="fl"
            style="font-size: 16px; font-weight: 700; margin_left:8px"
          >{{ item.startTime }} - {{ item.endTime }}</span
          >
            <div class="fr" style="font-size: 14px">
              <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
            </div>
          </van-row>
        </van-swipe-cell>
      </div>
    </div>
    <div v-if="visitDate.hos  && visitDate.doc && visitDate.hos.length == 0 && visitDate.doc.length == 0"
         class="emptyDiv">
      <img src="../../assets/img/index/yyEmpty.png" class="emptyIcon">
      <li>暂无排班</li>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="openOfflineNewShift">添加</button>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import date from "@/utils/date.js";
import {
  selectDocVisitRealTempOfflineListByWeekList,
  deleteDocDicVisitRealTempOffline,
  tempFlag,
  updateAppointDay
} from "@/api/visit";
import myJsTools from "../../utils/myJsTools";
import {Dialog, Toast} from "vant";
import {selectDocVisitRealTempOfflineList} from "../../api/visit";

export default {
  data() {
    return {
      active: "",
      checked: true,
      amOfflineVisitList: [],
      pmOfflineVisitList: [],
      visitDate: [],
      selectIndex: 0,
      num: "", // 可预约天数
      apw: [], // 上下午
      dateLi: [
        {
          day: "一"
        },
        {
          day: "二"
        },
        {
          day: "三"
        },
        {
          day: "四"
        },
        {
          day: "五"
        },
        {
          day: "六"
        },
        {
          day: "日"
        }
      ],
      docId: ""
    };
  },
  components: {navbar},

  created() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getDocFlag();
    this.getDetail();

  },
  methods: {
    change(val) {
      this.num = val;
    },
    // 设置class
    getClass(index) {
      let className;
      if (this.dateLi[index].vrTempType && index != this.selectIndex) {
        className =
          this.dateLi[index].vrTempType ? "hasFlag modelDay" : "modelDay";
      } else {
        className = index == this.selectIndex ? "selectRow modelDay" : "modelDay";
      }
      return className;
    },
    // 获取医生排班模板标志
    getDocFlag() {
      selectDocVisitRealTempOfflineList({docId: this.docId}).then(res => {
        let data = res.data;
        this.dateLi.map((item, i) => {
          if (data.length > 0) {
            data.forEach(el => {
              this.dateLi[el.week - 1].vrTempType = el.vrTempType;
            })
          } else {
            item.vrTempType = '';
          }
        })
        this.dateLi = Object.assign([],this.dateLi)
      });
    },
    getDetail() {
      selectDocVisitRealTempOfflineListByWeekList({
        docId: this.docId,
        week: this.selectIndex + 1
      }).then(res => {
        console.log("线下模板信息", res);
        if (res.data) {
          var data = res.data;
          this.visitDate = data;

        }
      });
    },
    openOfflineNewShift() {
      let arr = [];
      if(this.visitDate){
        arr = this.visitDate.doc || [];
        if(this.visitDate.hos){
          arr.concat(this.visitDate.hos);
        }
      }
      this.$router.push({
        name: "offlineNewShift",
        query: {
          week: this.selectIndex + 1,
          type: "1",
          active: 1,
          list:arr
        }
      });
    },
    setSelect(index) {
      this.amOfflineVisitList = [];
      this.pmOfflineVisitList = [];
      this.selectIndex = index;
      this.getDetail();
    },
    // 编辑线下自由排班
    offlineEditVisit(item) {
      this.$router.push({
        name: "offlineNewShift",
        query: {
          item: item,
          type: "2",
          week: this.selectIndex + 1,
        }
      });
    },
    // 删除自由排班
    offlineDeleteVisit(item) {
      let me = this;
      Dialog.confirm({
        title: '删除排班',
        message: '是否确认删除该模板信息',
      })
        .then(() => {
          deleteDocDicVisitRealTempOffline({dvrtId: item.dvrtId}).then(res => {
            Toast("删除成功")
            me.getDetail();
            me.getDocFlag();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  }
};
</script>

<style scoped lang="less">
.myVisit {
  background: @white !important;
}

.yuan {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid @back-border;
  background: @white;
  margin-right: 3px;
}

.person {
  background: @black;
  margin-left: 28px;
}

.lineVisitDiv {
  padding: 13px 16px;
  .black-font;
  .font-size-md;
  line-height: 20px;

  li {
    width: 100%;
    .display-div;

    span {
      display: inline-block;
      .font-blod-2;
    }

    .line {
      width: 3px;
      height: 14px;
      background: @blue;
      margin-right: 8px;
    }
  }
}

/deep/ .van-swipe-cell {
  width: 100%;
}


.yuanLi {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .person {
    margin-left: 0;
  }
}

/deep/ .van-cell {
  line-height: 46px;
}

.lineVisitDiv {
  .title {
    margin-bottom: 13px;
  }

  .van-row {
    text-align: center;
    padding: 13px 8px 13px 0;
    border-bottom: 1px solid @back-border;
  }

  .time {
    .black-font;
    .font-size-lg;
    line-height: 18px;
    margin-top: 15px;
    display: inline-block;
  }

  .limit {
    .font-size-md;
    .font-login-color;
    line-height: 20px;
    margin-bottom: 7px;
  }

  .remaining {
    .font-size-md;
    .black-font;
    line-height: 20px;
  }
}

.van-button {
  display: inline-block;
}

.setIcon {
  width: 22px;
  height: 22px;
}

.leftRow {
  text-align: left !important;
}

.modelDay {
  width: 13.866667%;
  padding: 10px 0;

  li {
    padding: 3px 0;
    text-align: center;
    box-sizing: border-box;
    display: block;


  }
}

.hasFlag {
  background: #14a0e6;
  color: #ffffff;
  height: 50px;
}

/deep/ .van-field__label {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  box-sizing: border-box;
  width: 100px;
}

/deep/ .van-field__control {
  text-align: right;
}

.van-cell {
  padding: 10px 0px;
}

.selectRow {
  color: @white;
  background: @red;
  height: 50px;
}

.yuanLi {
  position: relative;
  top: -5px;
}

.van-button {
  height: 100%;
}

/deep/ .van-field__label {
  width: 3.6rem;
}


.emytyDiv {
  padding-bottom: 70px;
}
</style>
