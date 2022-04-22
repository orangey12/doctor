<template>
  <div class="newsConnect" style="min-height: calc(100vh -35px);">
    <navbar title="添加患者"></navbar>
    <div class="head">
      <van-form action="/">
        <van-search v-model="value" placeholder="输入组名，快速查找" @search="getPatientList" maxlength="10"/>
      </van-form>
      <div class="head_by" @click="showPopup">
        <img src="@/assets/img/group/by.png" alt/>
        <span>筛选</span>
      </div>
    </div>
    <div class="user">
      <van-index-bar :index-list="indexList">
        <div v-for="(item,key,index) in patientList" :key="index">
          <van-index-anchor :index="key!='☆'? key : '☆ 星标用户'" style="background:#F5F5F5;"></van-index-anchor>
          <div class="list" v-for="(val,i) in item" :key="i">
            <van-checkbox-group v-model="result">
              <van-checkbox :name="val">
                <template>
                  <div class="item">
                    <img v-zlazy="val.patientImg" alt/>
                    <span>{{ val.patientName }}</span>
                  </div>
                </template>
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </van-index-bar>
    </div>
    <div :class="result.length>0 ? 'foot' : 'foot_1'">
      <span v-if="result.length>0">已选（{{ result.length }}）</span>
      <div @click="addPatient">添加</div>
    </div>
    <!-- 筛选 -->
    <van-popup
      v-model="show"
      position="right"
      :style="{ height: 'calc(100vh - 32px)' , padding: '16px 15px',paddingTop:paddTop}"
    >
      <div class="popup">
        <div class="popup_list">
          <div class="popup_item">
            <p>自身条件</p>
            <div class="box">
              <span class="label">性别</span>
              <div class="radio" v-for="(val,i) in sex" :key="i">
                <span :class="i==sexLi ? 'sexActive' : 'sex'" @click="clickSex(val,i)">{{ val }}</span>
              </div>
            </div>
          </div>
          <div class="popup_item">
            <p>年龄</p>
            <div class="box">
              <div class="age">
                <span>{{ sliderMin }}</span>
                <div>
                  <slider :value-fun="sliderVal" :min="0" :max="100"></slider>
                </div>
                <span>{{ sliderMax }}</span>
              </div>
            </div>
          </div>
          <div class="popup_item">
            <p>问诊信息</p>
            <div class="box">
              <input type="text" v-model="message" placeholder="请输入特定诊断"/>
            </div>
          </div>
          <div class="popup_item">
            <p>特定药物</p>
            <div class="box">
              <input type="text" v-model="drug" placeholder="请输入特定药物"/>
            </div>
          </div>
          <div class="popup_item">
            <p>线下门诊</p>
            <div class="box_1">
              <span class="label" v-html="checked==true ? '已开启' : '已关闭'"></span>
              <van-switch v-model="checked"/>
            </div>
          </div>
          <div class="popup_item">
            <p>问诊时间</p>
            <div class="box_2">
              <p>
                开始
                <span @click="getStart">{{ startValue }}</span>
              </p>
              <p>
                结束
                <span @click="getEnd">{{ endValue }}</span>
              </p>
            </div>
          </div>
          <div class="popup_item">
            <p>分组</p>
            <div class="box_3" ref="box">
              <p
                :class="val.isChecked==true ? 'checkActive' : 'check'"
                v-for="(val,i) in groups"
                :key="i"
                @click="checkedBox(i,val)"
              >
                {{ val.groupName }}
                <span>({{ val.patientCount }})</span>
              </p>
            </div>
            <div class="expend" v-if="isExpend">
              <img src="@/assets/img/expend.png" alt/>
              <span @click="expendGroups">展开分组</span>
            </div>
          </div>

          <div class="popup_item">
            <p>其他</p>
            <div class="box_4">
              <p
                :class="val.isChecked==true ? 'checkActive' : 'check'"
                v-for="(val,i) in others"
                :key="i"
                @click="otherBox(i,val)"
              >
                {{ val.groupName }}
                <span>({{ val.patientCount }})</span>
              </p>
            </div>
          </div>
        </div>
        <div class="btn_wrap">
          <div class="btn" @click="reset">重置</div>
          <div class="btn_1" @click="sxSure">确定</div>
        </div>
      </div>
    </van-popup>
    <!-- 选择开始时间 -->
    <van-popup v-model="isStart" position="bottom">
      <van-datetime-picker
        v-model="startDate"
        type="date"
        title="选择年月日"
        @confirm="confirmS"
        @cancel="cancelS"
      />
    </van-popup>
    <!-- 选择结束时间 -->
    <van-popup v-model="isEnd" position="bottom">
      <van-datetime-picker
        v-model="endDate"
        type="date"
        title="选择年月日"
        @confirm="confirmE"
        @cancel="cancelE"
      />
    </van-popup>
  </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import slider from "@/common/slider";
import Pinyin from "@/utils/pinYin.js";
import {Toast} from "vant";
import {getLabPresentationOssImg} from "@/api/oss";
import {
  findAllUserIdAndNameAndHead,
  findPatientList,
  findGroupNameAndPatientCountByGroupIdNotGroup
} from "@/api/myGroups";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "newsConnect",
  components: {navbar, slider},
  data() {
    return {
      sliderMin: "",
      sliderMax: "",
      value: "",
      indexList: [],
      result: [],
      patientList: [],
      show: false,
      sex: ["男", "女"],
      sexLi: -1,
      sexValue: "",
      message: "",
      drug: "",
      checked: false,
      //是否打开时间选择器（开始）
      isStart: false,
      //是否打开时间选择器（结束）
      isEnd: false,
      //开始时间
      startDate: new Date(),
      startValue: "开始时间",
      //结束时间
      endDate: new Date(),
      endValue: "结束时间",
      isExpend: true,
      //分组
      groups: [],
      groupIdArray: [],
      //其他
      others: [],
      paddTop: "",
    };
  },
  mounted() {
    this.timeFormat(new Date());
    // this.startValue=this.timeFormat(new Date())
    // this.endValue=this.timeFormat(new Date())
    this.getPatientList();
    this.getGroups();
    this.paddTop = (parseInt(api.safeArea.top) + 12) + 'px';
  },

  methods: {
    //初始化获取患者列表
    getPatientList() {
      findAllUserIdAndNameAndHead({patientName: this.value}).then(async res => {
        let arr = myJsTools.data_letter_sort(data, "py");
        this.patientList = arr;
        this.indexList = Object.keys(this.patientList);
      });
    },
    //初始化获取筛选的分组
    getGroups() {
      findGroupNameAndPatientCountByGroupIdNotGroup({}).then(res => {
        res.data.map(item => {
          return (item.isChecked = false);
        });
        this.groups = res.data.filter(item => item.groupId != "");
        this.others = res.data.filter(item => item.groupId == "");
        console.log(this.others);
        this.others.push({
          patientId: "",
          groupName: "关注患者",
          patientCount: "90",
          isChecked: false
        });
        this.others.map(item => {
          return (item.other = false);
        });
        console.log(this.others);
      });
    },
    //添加患者
    addPatient() {
      this.$store.commit("setGroupsList", this.result);
      this.$router.go(-1);
    },
    //点击筛选
    showPopup() {
      this.show = true;
    },
    //点击选择性别
    clickSex(val, i) {
      if (this.sexLi == i) {
        this.sexValue = "";
        this.sexLi = -1;
      } else {
        this.sexValue = val;
        this.sexLi = i;
      }
    },
    //打开时间选择器（开始）
    getStart() {
      this.isStart = true;
    },
    //打开时间选择器（结束）
    getEnd() {
      this.isEnd = true;
    },
    //点击确定(开始)
    confirmS() {
      this.startValue = this.timeFormat(this.startDate);
      this.isStart = false;
    },
    //点击确定(结束)
    confirmE() {
      this.endValue = this.timeFormat(this.endDate);
      this.isEnd = false;
    },
    //点击取消(开始)
    cancelS() {
      this.isStart = false;
    },
    //点击取消(结束)
    cancelE() {
      this.isEnd = false;
    },
    //转换时间格式
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return year + "-" + month + "-" + day;
    },
    //展开分组
    expendGroups() {
      this.$refs.box.style = "overflow:visible;height:auto";
      this.isExpend = false;
    },
    //点击多选(分组)
    checkedBox(i, val) {
      val.isChecked = !val.isChecked;
    },
    //点击多选(其他)
    otherBox(i, val) {
      val.isChecked = !val.isChecked;
      this.others.map(item => {
        if (item.isChecked == true) {
          item.other = "1";
        } else {
          item.other = "0";
        }
      });
    },
    //确定(筛选)
    sxSure() {
      this.groupIdArray = []
      this.groups.map(item => {
        if (item.isChecked == true) {
          this.groupIdArray.push(item.groupId);
        }
      });
      console.log(this.groupIdArray)
      let sexCode = "";
      let start = "";
      let end = "";
      if (this.sexValue == "") {
        sexCode = "";
      } else if (this.sexValue == "男") {
        sexCode = "1";
      } else if (this.sexValue == "女") {
        sexCode = "2";
      }
      if (this.startValue == "开始时间") {
        start = "";
      } else {
        start = this.startValue + " " + "00:00:00";
      }
      if (this.endValue == "结束时间") {
        end = "";
      } else {
        end = this.endValue + " " + "23:59:59";
      }
      console.log(start);
      console.log(end);
      let dataForm = {
        ageBegin: String(this.sliderMin),
        ageEnd: String(this.sliderMax),
        // attention:this.others[1].other,
        diagName: this.message,
        drugName: this.drug,
        groupIdArray: this.groupIdArray,
        guahaoTimeBegin: start,
        guahaoTimeEnd: end,
        // noGroup:this.others[0].other,
        sexCode: sexCode
      };
      findPatientList(dataForm).then(res => {
        if (res.data != null) {
          res.data.map((val, i) => {
            if (val.patientImg != null) {
              getLabPresentationOssImg({
                bucket: "2",
                Img_name: val.patientImg
              }).then(res => {
                val.patientImg = res.data.url.split("-internal").join("");
              });
            } else {
              getLabPresentationOssImg({
                bucket: "2",
                Img_name: "IMG20200421162515.jpg"
              }).then(res => {
                val.patientImg = res.data.url.split("-internal").join("");
              });
            }
          });
          let arr = myJsTools.data_letter_sort(res.data, "py");
          this.patientList = arr;
          this.indexList = Object.keys(this.patientList);
        } else {
          this.patientList = [];
          this.indexList = [];
        }
        this.show = false;
      });
    },
    //重置(筛选)
    reset() {
      this.startValue = "开始时间";
      this.endValue = "结束时间";
      this.sliderMin = "0";
      this.sliderMax = "100";
      this.others[0].other = "0";
      this.others[1].other = "0";
      this.message = "";
      this.drug = "";
      this.sexLi = -1;
      this.groups.map(item => {
        item.isChecked = false;
      });
      this.others.map(item => {
        item.isChecked = false;
      });
      this.show = false;
      this.getPatientList();
    },
    sliderVal(min, max, total) {
      this.sliderMin = min;
      this.sliderMax = max;
    }
  }
};
</script>
<style scoped lang="less">
.newsConnect {
  background: rgb(245, 245, 245);
  box-sizing: border-box;

  .head {
    position: relative;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    z-index: 2;

    .search {
      background: url("../../assets/img/picture/sea.png") no-repeat;
      background-color: #ffffff;
      background-size: 22px 22px;
      background-position: 5% 11px;
      padding-left: 45px;
      /*/deep/.van-cell{*/
      /*  padding-left: 0px;*/
      /*}*/
    }

    .head_by {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      right: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 23px;
        height: 20px;
        margin-bottom: 2px;
      }

      span {
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 12px;
      }
    }
  }

  .title {
    background: #f5f5f5;
    padding: 4px 4%;
    font-size: 11px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
  }

  .user {
    height: calc(100vh - 150px);
    overflow-y: scroll;
  }

  .list {
    background: #ffffff;
    padding: 0 4%;

    .item {
      display: flex;
      align-items: center;

      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
        padding: 14px 0;
        border-radius: 50%;
      }

      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
      }
    }
  }

  .foot,
  .foot_1 {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(235, 235, 235, 1);
    padding: 7px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div {
      width: 80px;
      padding: 7px 0;
      text-align: center;
      background: rgba(20, 160, 230, 1);
      border-radius: 18px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 22px;
      float: right;
      margin-right: 16px;
    }

    span {
      margin-left: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 22px;
    }
  }

  .foot_1 {
    display: block;
  }

  .popup {
    width: 266px;
    border-radius: 8px 0px 0px 8px;

    .popup_list {
      height: calc(100vh - 95px);
      overflow-y: scroll;
    }

    &_item {
      margin-bottom: 12px;

      p {
        margin-bottom: 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
      }

      .box,
      .box_1,
      .box_2,
      .box_3 {
        background: rgba(243, 243, 243, 1);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: center;

        .label {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
          display: block;
          width: 30%;
        }

        input {
          width: 100%;
          height: 20px;
          background: none;
        }

        .radio {
          width: 70%;
          display: flex;
          align-items: center;
          justify-content: space-around;

          .sex,
          .sexActive {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
            background: #ffffff;
            border-radius: 4px;
            width: 58px;
            text-align: center;
          }

          .sexActive {
            color: rgba(255, 255, 255, 1);
            background: rgba(20, 160, 230, 1);
          }
        }

        .age {
          width: 100%;
          display: flex;
          align-items: center;

          div {
            width: 94%;
            margin: 0 auto;
          }

          span {
            display: block;
            width: 10%;
            text-align: center;
          }
        }
      }

      .box_1,
      .box_2 {
        justify-content: space-between;
      }

      .box_2 {
        p {
          width: 49%;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          margin-bottom: 0;

          span {
            min-width: 10px;
            margin-left: 4px;
            color: rgba(20, 160, 230, 1);
          }
        }
      }

      .box_3,
      .box_4 {
        height: 40px;
        background: #ffffff;
        flex-wrap: wrap;
        padding: 0;
        overflow: hidden;

        .check,
        .checkActive {
          padding: 6px 12px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          margin-right: 8px;
          background: rgba(243, 243, 243, 1);
          border-radius: 8px;
        }

        .checkActive {
          background: rgba(20, 160, 230, 1);
          color: rgba(255, 255, 255, 1);
        }
      }

      .box_4 {
        display: flex;
        height: auto;
        overflow: visible;
      }
    }
  }

  .btn_wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 16px;
    width: 266px;

    .btn,
    .btn_1 {
      width: 48%;
      border-radius: 22px;
      border: 1px solid rgba(20, 160, 230, 1);
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(20, 160, 230, 1);
      line-height: 22px;
      text-align: center;
      padding: 11px 0;
    }

    .btn_1 {
      background: rgba(20, 160, 230, 1);
      color: rgba(255, 255, 255, 1);
    }
  }

  .expend {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30%;
    margin: 0 auto;

    img {
      width: 14px;
      height: 14px;
      margin-right: 3px;
    }

    span {
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(20, 160, 230, 1);
      line-height: 14px;
    }
  }
}
</style>
