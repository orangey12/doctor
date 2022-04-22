<template>
  <div class="myVisit">
    <navbar title="我的出诊模板"></navbar>
    <div class="lineVisitDiv">
      <van-row class="leftRow">
        <van-col span="20">图文问诊</van-col>
        <van-col span="4" style="text-align: right;">
          <van-switch
            v-model="checked"
            size="30px"
            class="switch"
          />
        </van-col>
      </van-row>
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
            <span
              class="yuan"
              style="margin-top:7px"
              v-if="item.flag == '1'"
            ></span>
            <span
              class="yuan person"
              style="margin-top:7px"
              v-if="item.flag == '2'"
            ></span>
          </li>
          <li class="yuanLi" v-if="item.flag == '1,2'">
            <span class="yuan"></span>
            <span class="yuan person"></span>
          </li>
        </van-col>
      </van-row>
    </div>
    <div id="test2"></div>
    <div class="lineVisitDiv" v-if="amVisitList.length > 0">
      <li class="title titleTips">
        <u>
          <span class="line"></span>
          <span>上午</span>
        </u>
      </li>
      <van-swipe-cell v-for="(item, index) in amVisitList" :key="index">
        <van-row>
          <van-col span="8">
            <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
          </van-col>
          <van-col span="8">
            <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
          </van-col>
          <van-col span="8">
            <li class="fwType">
              <span>{{ item.consultationName }}</span>
            </li>
            <span class="voice-sign" v-if="item.visitTypeCode == 2">{{
              item.visitTypeName
            }}</span>
            <span class="video-sign" v-if="item.visitTypeCode == 4">{{
              item.visitTypeName
            }}</span>
            <span class="tel-sign" v-if="item.visitTypeCode == 3">{{
              item.visitTypeName
            }}</span>
          </van-col>
        </van-row>
        <template #right v-if="item.vrTempType == 2" style="display:flex;">
          <van-button
            square
            text="编辑"
            color="#666666"
            @click="editVisit(item)"
          /><van-button
            square
            text="删除"
            color="#FF5050"
            @click="deleteVisit(item)"
          />
        </template>
      </van-swipe-cell>
    </div>
    <div class="lineVisitDiv " v-if="pmVisitList.length > 0">
      <li class="title titleTips">
        <u>
          <span class="line"></span>
          <span>下午</span>
        </u>
      </li>
      <van-swipe-cell v-for="(item, index) in pmVisitList" :key="index">
        <van-row>
          <van-col span="8">
            <span class="time">{{ item.startTime }}-{{ item.endTime }}</span>
          </van-col>
          <van-col span="8">
            <span class="limit">限制人数：{{ item.appointLimitNum }}</span>
          </van-col>
          <van-col span="8">
            <li class="fwType">
              <span>{{ item.consultationName }}</span>
            </li>
            <span class="voice-sign" v-if="item.visitTypeCode == 2">{{
              item.visitTypeName
            }}</span>
            <span class="video-sign" v-if="item.visitTypeCode == 4">{{
              item.visitTypeName
            }}</span>
            <span class="tel-sign" v-if="item.visitTypeCode == 3">{{
              item.visitTypeName
            }}</span>
          </van-col>
        </van-row>
        <template #right v-if="item.vrTempType == 2" style="display:flex;">
          <van-button
            square
            text="编辑"
            color="#666666"
            @click="editVisit(item)"
          />
          <van-button
            square
            text="删除"
            color="#FF5050"
            @click="deleteVisit(item)"
          />
        </template>
      </van-swipe-cell>
    </div>
    <div v-if="amVisitList.length == 0 && pmVisitList.length == 0" class="emptyDiv">
      <img src="../../assets/img/index/yyEmpty.png" class="emptyIcon">
      <li>暂无排班</li>
    </div>
    <div class="bottomBtn">
      <button class="publicWhiteBtn" @click="openNewShift">添加</button>
      <button class="publicBtn twoBtn" @click="saveParam">保存</button>
    </div>
  </div>
</template>

<script>
import navbar from "@/common/navbar";
import date from "@/utils/date.js";
import {
  findVisitTemp,
  deleteTemplate,
  tempFlag,
  updateAppointDay,
  isOpenTuWen,
  tuWenFlag
} from "../../api/visit";
import myJsTools from "../../utils/myJsTools";
import {Dialog, Toast} from "vant";
import {getDoctorInfoByDocId, modifyDoctorBySwitch} from "../../api/my";
export default {
  data() {
    return {
      active: 0,
      checked: true,
      amVisitList: [],
      pmVisitList: [],
      visitDate: [],
      selectIndex: 0,
      num: "", // 可预约天数
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
      docId: "",
      flag: "",
      ysId:"",
    };
  },
  components: { navbar },
  created() {
    this.docId = myJsTools.getItem("token_info").docId;
    this.getDetail();
    this.getDocFlag();
    this.getDocInfo();
    let days = date.getNowDateAndNowWeek(new Date().getTime());
    if (this.flag == 0) {
      this.checked = false;
    } else {
      this.checked = true;
    }
    if (!this.$route.query.num) {
      this.num = "";
    } else {
      this.num = this.$route.query.num;
    }
  },
  mounted() {},
  methods: {
    change(val) {
      this.num = val;
    },
    getDocInfo(){
      getDoctorInfoByDocId({
        docId:this.docId
      }).then(res=>{
        console.log(res);
        if(res.data){
          if(res.data.isImageText == '1'){
            this.checked = true;
          }else{
            this.checked = false;
          }
        }
      })
    },
    // 设置class
    getClass(index) {
      let className =
        this.dateLi[index].flag != "" ? "hasFlag modelDay" : "modelDay";
      if(index == this.selectIndex){
        className = "selectRow modelDay";
      }
      console.log(className)
      return className;
    },
    // 获取医生排班模板标志
    getDocFlag() {
      tempFlag({ docId: this.docId }).then(res => {
        console.log("模板flg", res);
        let data = res.data;
        this.flagData = res.data;
        for (let m = 0; m < data.length; m++) {
          const element = data[m];
          let item = this.dateLi[m];
          // console.log("dateLi", item)
          item.flag = element.flag ? element.flag : "";
          this.$set(this.dateLi, m, item);
        }
        console.log(this.dateLi);
      });
    },
    getDetail() {
      this.amVisitList = this.visitDate = [];
      this.pmVisitList = [];
      findVisitTemp({
        docId: this.docId,
        week: this.selectIndex + 1
      }).then(res => {
        console.log("模板信息", res);
        if (res.data) {
          var data = res.data.detail;
          // console.log("detail", data)
          this.visitDate = data;
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.appointDay) {
              this.num = element.appointDay;
            }
            if (element.apw == "a") {
              this.amVisitList.push(element);
            } else {
              this.pmVisitList.push(element);
            }
          }
        } else {
          this.num = "";
          this.amVisitList = this.pmVisitList = [];
        }
      });
    },
    openNewShift() {
      this.$router.push({
        name: "newShift",
        query: {
          week: this.selectIndex + 1,
          list: this.visitDate,
          deptId: sessionStorage.getItem("deptId"),
          type: "2",
          num: this.num
        }
      });
    },
    setSelect(index) {
      this.amVisitList = [];
      this.pmVisitList = [];
      this.selectIndex = index;
      this.getDetail();
    },
    // 编辑自由排班
    editVisit(item) {
      this.$router.push({
        name: "editVisit",
        query: {
          item: item,
          type: "2",
          deptId: sessionStorage.getItem("deptId")
        }
      });
    },
    // 删除自由排班
    deleteVisit(item) {
      let me = this;
      Dialog.confirm({
        title: '删除排班',
        message: '是否确认删除该模板信息',
      })
        .then(() => {
          deleteTemplate({ dvrtId: item.dvrtId }).then(res => {
            console.log("删除自由排班结果", res);
            me.getDetail();
            me.getDocFlag();
          });
        })
        .catch(() => {
          // on cancel
        });

    },
    // 保存
    saveParam() {
      let isImageText;
      if(this.checked){
        isImageText = '1'
      }else{
        isImageText = '0'
      }
      var param = {
        isImageText:isImageText,
        docId:this.docId
      };
      modifyDoctorBySwitch(param).then(res => {
        this.$router.go(-1);
      });
    },
  }
};
</script>

<style scoped lang="less">

.lineVisitDiv {
  padding: 13px 16px;
  .black-font;
  .font-size-md;
  line-height: 20px;
  .titleLi {
    padding: 13px 0;
    width: 100%;
    .display-div;
    u:nth-child(2){
      display: flex;
      align-items: center;
    }
    .person{
      margin-left: 8px;
    }
  }
  li {
    span {
      display: inline-block;
    }
    .line {
      width: 3px;
      height: 14px;
      background: @blue;
      margin-right: 8px;
    }
    .yuan {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: 1px solid @back-border;
      background: @white;
      margin-right: 3px;
    }
    .person {
      background: @black;
      border: none;
    }
  }
}

/deep/.van-cell {
  line-height: 46px;
}
.lineVisitDiv {
  .title {
    margin-bottom: 13px;
  }
  .van-row {
    text-align: center;
    padding: 13px 0;
    border-bottom: 1px solid @back-border;
    display: flex;
    align-items: center;
  }
  .time {
    .black-font;
    .font-size-lg;
    line-height: 18px;
    display: inline-block;
  }

  .limit {
    .font-size-md;
    .font-login-color;
    line-height: 20px;
  }

  .remaining {
    .font-size-md;
    .black-font;
    line-height: 20px;
  }

  .fwType {
    .font-color-orange;
    .font-size-md;
    line-height: 20px;
    margin-bottom: 7px;
    display: block;
    text-align: center;
  }
}

.van-button {
  display: inline-block;
}
.leftRow {
  text-align: left !important;
}
.modelDay {
  width: 13.866667%;
  padding: 10px 0;
  li {
    text-align: center;
    box-sizing: border-box;
    display: block;
  }
}

.hasFlag {
  background: @blue;
  .white-font;
  height: 50px;
}
/deep/.van-field__label {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  box-sizing: border-box;
  width: 100px;
}
/deep/.van-field__control {
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
  display: flex;
  align-items: center;
}
.van-button {
  height: 100%;
}
/deep/.van-field__label {
  width: 3.6rem;
}
.emptyDiv {
  padding-bottom:70px;
}
</style>
