<template>
  <div class="topic">
    <navbar :title="title"></navbar>
    <div class="radioDiv" v-if="didtType == '1'">
      <div class="title">
        <li>单选标题</li>
        <van-field
          v-model="didtName"
          placeholder="请输入单选题目标题"
          maxlength="50"
        />
      </div>
      <div class="option">
        <li>选项</li>
        <li class="addOption" v-for="(item, index) in radioOpt" :key="index">
          <img
            src="../../assets/img/scale/delete_1.png"
            class="deleteIcon"
            @click="deleteOpt(index)"
          />
          <van-field
            v-model="item.optionName"
            placeholder="请输入单选题目选项"
            clearable
            maxlength="20"
          />
        </li>
        <li class="addOptionBtn" @click="addRadioOpt">
          <img src="../../assets/img/scale/addTop.png" class="addIcon" />
          <span>添加单选项</span>
        </li>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
        <li class="require">
          <span>切换多选题</span>
          <van-switch
            v-model="changeCheckBox"
            size="24px"
            @change="changeRadioSwitch"
          />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '2'">
      <div class="title">
        <li>多选标题</li>
        <van-field
          v-model="didtName"
          placeholder="请输入多选题目标题"
          maxlength="50"
        />
      </div>
      <div class="option">
        <li>选项</li>
        <li class="addOption" v-for="(item, index) in radioOpt" :key="index">
          <img
            src="../../assets/img/scale/delete_1.png"
            class="deleteIcon"
            @click="deleteOpt(index)"
          />
          <van-field
            v-model="item.optionName"
            placeholder="请输入多选题目选项"
            clearable
            maxlength="20"
          />
        </li>
        <li class="addOptionBtn" @click="addRadioOpt">
          <img src="../../assets/img/scale/addTop.png" class="addIcon" />
          <span>添加多选项</span>
        </li>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
        <li class="require">
          <span>切换单选题</span>
          <van-switch
            v-model="changeRadio"
            size="24px"
            @change="changeCheckSwitch"
          />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '3'">
      <div class="title">
        <li>填空标题</li>
        <van-field
          v-model="didtName"
          placeholder="请输入填空标题"
          maxlength="50"
        />
      </div>
      <div class="setting">
        <li>选项</li>
        <li class="require">
          <span>内容限制</span>
          <span class="contentLimit" @click="actionShow = true"
            >{{ answerLimitName }}
            <img src="../../assets/img/scale/rightIcon.png" class="rightIcon" />
          </span>
          <van-action-sheet
            v-model="actionShow"
            :actions="actions"
            cancel-text="取消"
            close-on-click-action
            @select="selectLimit"
          />
        </li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '4'">
      <div class="title">
        <li>下拉题标题</li>
        <van-field
          v-model="didtName"
          placeholder="请输入下拉题标题"
          maxlength="50"
        />
      </div>
      <div class="option">
        <li>选项</li>
        <li class="addOption" v-for="(item, index) in radioOpt" :key="index">
          <img
            src="../../assets/img/scale/delete_1.png"
            class="deleteIcon"
            @click="deleteOpt(index)"
          />
          <van-field
            v-model="item.optionName"
            placeholder="请输入多选题目选项"
            clearable
            maxlength="20"
          />
        </li>
        <li class="addOptionBtn" @click="addRadioOpt">
          <img src="../../assets/img/scale/addTop.png" class="addIcon" />
          <span>添加选项</span>
        </li>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '5'">
      <div class="title">
        <li>上传标题</li>
        <van-field
          v-model="didtName"
          placeholder="请输入图片上传标题"
          maxlength="50"
        />
      </div>
      <div class="option">
        <li>图片</li>
        <li class="addOptionBtn">
          <img src="../../assets/img/follow/img.png" class="addIcon" />
          <span style="color: #999999">选择图片（2M以内）</span>
        </li>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '6'">
      <div class="title">
        <li>打分标题</li>
        <van-field
          v-model="didtName"
          placeholder="点击编辑评价题目名称"
          maxlength="50"
        />
        <div class="xxIconDiv">
          <img
            src="../../assets/img/scale/xx.png"
            class="xxIcon"
            v-for="(item, index) in 5"
            :key="index"
          />
        </div>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '7'">
      <div class="title">
        <li>时间标题</li>
        <van-field
          v-model="didtName"
          placeholder="点击编辑时间标题"
          maxlength="50"
        />
        <div class="timeDiv">
          <span>请选择时间</span>
          <img src="../../assets/img/scale/down.png" class="downIcon" />
        </div>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="radioDiv" v-if="didtType == '8'">
      <div class="title">
        <li>日期标题</li>
        <van-field
          v-model="didtName"
          placeholder="点击编辑日期标题"
          maxlength="50"
        />
        <div class="timeDiv">
          <span>请选择日期</span>
          <img src="../../assets/img/scale/dateIcon.png" class="downIcon" />
        </div>
      </div>
      <div class="setting">
        <li>设置</li>
        <li class="require">
          <span>此题必答</span>
          <van-switch v-model="requiredCheck" size="24px" />
        </li>
      </div>
    </div>
    <div class="bottomBtn" @click="commitAdd">
      <button class="publicBtn">
        确认
      </button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { getAnswerLimit } from "../../api/scale";
import { Toast } from "vant";
export default {
  name: "topic",
  components: { Navbar },
  data() {
    return {
      didtName: "", //标题
      radioOpt: [], //单选选项列表
      requiredCheck: false,
      changeCheckBox: false, //切换多选
      didtType: 1,
      isEdit: false,
      answerLimit: "",
      answerLimitName: "不限",
      changeRadio: false, //切换单选
      actionShow: false,
      actions: [
        { name: "不限", index: 0, answerLimit: "" },
        { name: "数字", index: 1, answerLimit: "" }
      ],
      didtId: ""
    };
  },
  computed: {
    title() {
      let title;
      if (this.didtType == "1") {
        title = "单选题";
      } else if (this.didtType == "2") {
        title = "多选题";
      } else if (this.didtType == "3") {
        title = "填空题";
      } else if (this.didtType == "4") {
        title = "下拉题";
      } else if (this.didtType == "5") {
        title = "图片上传";
      } else if (this.didtType == "6") {
        title = "评价题";
      } else if (this.didtType == "7") {
        title = "时间";
      } else if (this.didtType == "8") {
        title = "日期";
      }
      return title;
    }
  },
  created() {
    this.isEdit = this.$route.query.isEdit; //是否是编辑题目
    let item = this.$route.query.item;
    if (this.isEdit) {
      this.didtName = item.didtName;
      this.answerLimitName = item.answerLimitName;
      this.answerLimit = item.answerLimit;
      if (item.didtId) {
        this.didtId = item.didtId;
      }
      if (item.radioOpt) {
        this.radioOpt = item.radioOpt;
      } else {
        this.radioOpt = [];
      }

      this.didtType = item.didtType;
      if (item.isMust == "1") {
        this.requiredCheck = true;
      } else {
        this.requiredCheck = false;
      }
    } else {
      this.didtType = this.$route.query.didtType;
      this.radioOpt = [];
    }
    if (this.didtType == "3") {
      this.getLimitList();
    }
  },
  updated() {
    this.didtId = "";
  },
  methods: {
    // 新增选项
    addRadioOpt() {
      if (
        this.radioOpt &&
        this.radioOpt.length > 1 &&
        !this.radioOpt[this.radioOpt.length - 1].optionName
      ) {
        Toast("请填写上一个选项");
        return;
      }
      this.radioOpt.push({
        optionName: ""
      });
    },
    //获取内容限制列表
    getLimitList() {
      getAnswerLimit().then(res => {
        console.log(res);
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i].name = data[i].answerLimitName;
        }
        this.actions = data;
      });
    },
    //  删除选项
    deleteOpt(index) {
      this.radioOpt.splice(index, 1);
    },
    //确认添加
    commitAdd() {
      let isMust;
      if (this.requiredCheck) {
        isMust = "1";
      } else {
        isMust = "0";
      }
      if (!this.didtName) {
        Toast("请输入题目标题");
        return;
      }
      if (
        this.didtType == "1" ||
        this.didtType == "2" ||
        this.didtType == "4"
      ) {
        if (this.radioOpt.length == 0) {
          Toast("请输入至少一个选项");
          return;
        }
        if (this.radioOpt.length == 1 && this.didtType == "2") {
          Toast("请输入至少两个个选项");
          return;
        }
      }
      if (this.radioOpt.length > 0) {
        for (let i = 0; i < this.radioOpt.length; i++) {
          const el = this.radioOpt[i];
          if (!el.optionName) {
            this.radioOpt.splice(i, 1);
          }
          el.optionCode = i + 1;
        }
      }
      if (
        (this.didtType == "1" && this.changeCheckBox) ||
        (this.didtType == "2" && !this.changeRadio)
      ) {
        this.didtType = "2";
      } else if (
        (this.didtType == "1" && !this.changeCheckBox) ||
        (this.didtType == "2" && this.changeRadio)
      ) {
        this.didtType = "1";
      }
      let value = {
        didtName: this.didtName,
        didtType: this.didtType,
        answerLimit: "", //正则表达式
        answerLimitName: "", //正则表达式名称
        isMust: isMust,
        radioOpt: this.radioOpt
      };
      if (this.didtType == "3") {
        value.answerLimitName = this.answerLimitName;
        value.answerLimit = this.answerLimit;
      }
      if (this.isEdit) {
        value.didtId = this.didtId;
      }
      console.log(value);
      //新增时直接push
      if (!this.isEdit) {
        this.$store.commit("setTopicList", value);
        this.$router.go(-1);
      } else {
        let val = {
          index: this.$route.query.index,
          item: value
        };
        this.$store.commit("setTopicListOne", val);
        this.$router.go(-1);
      }
    },
    //多选切换单选
    changeCheckSwitch(value) {
      this.changeCheckBox = value;
    },
    //单选切换多选
    changeRadioSwitch(value) {
      this.changeRadio = value;
    },
    // 填空题限制选择
    selectLimit(item) {
      this.answerLimitName = item.name;
      this.answerLimit = item.answerLimit;
    }
  }
};
</script>

<style scoped lang="less">

.radioDiv {
  .title,
  .option,
  .setting {
    li:nth-child(1) {
      padding-left: 16px;
      .font-login-color;
      .font-size-sm;
      line-height: 16px;
      background: @page-back;
    }
  }
  .title {
    /deep/.van-cell {
      padding: 12px 16px;
    }
  }
  .option {
    /deep/.van-cell {
      padding: 0.32rem 14px 0.32rem 0;
      box-sizing: border-box;
    }
    .addOption {
      border-bottom: 0.5px solid @back-border;
    }
    .addOption,
    .addOptionBtn {
      display: flex;
      align-items: center;
      margin-left: 16px;
      background: @white;
    }
    .addOptionBtn {
      .font-login-color-blue;
      .font-size-sm;
      line-height: 16px;
      padding: 12px 0;
    }
  }
  .setting {
    .require {
      margin-left: 16px;
      padding: 12px 0;
      .font-size-md;
      .font-login-color;
      line-height: 22px;
      position: relative;
      border-bottom: 0.5px solid @back-border;
      /deep/.van-switch {
        width: 30px;
        height: 18px;
        position: absolute;
        right: 16px;
      }
      .contentLimit {
        position: absolute;
        right: 16px;
        display: flex;
        align-items: center;
        top: 12px;
        img {
          .icon-width-height-sm-16;
          margin-left: 6px;
        }
      }
    }
  }
  .xxIconDiv {
    display: flex;
    padding: 16px 0 26px 41px;
    .xxIcon {
      .img-width-height-spe;
      margin-right: 33px;
    }
  }

  .timeDiv {
    padding: 10px 12px;
    position: relative;
    border: 1px solid @back-border;
    margin: 6px 16px 12px 16px;
    border-radius: 2px;
    span {
      .font-login-color;
      .font-size-md;
      line-height: 22px;
    }
    .downIcon {
      .icon-width-height-sm-16;
      position: absolute;
      right: 16px;
      top: 10px;
    }
  }
}
.deleteIcon,
.addIcon {
 .icon-width-height-sm-16;
  margin-right: 3px;
}

/deep/input::placeholder {
  .font-login-color;
  .font-size-md;
  line-height: 22px;
}

/deep/.van-cell::after {
  border: none;
}

.bottomBtn{
  box-shadow: none;
}
</style>
