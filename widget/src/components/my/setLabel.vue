<template>
  <div>
    <navbar title="设置标签"></navbar>
    <div class="addPre">
      <div class="diagnosis">
        <span>设置标签</span>
        <div class="selectOpt">
          <span v-for="(item, index) in selectOptList"
                :key="index"
                class="selectOptSpan">
            {{ item }}
            <img src="../../assets/img/cf/deleteZd.png"
                 class="closeIcon"
                 @click.stop="delOpt(index)" />
          </span>
          <div class="notSelect"
               @click="showZdPicker">
            <img src="../../assets/img/cf/addcf.png"
                 class="addZdIcon" />
            <span>自定义标签</span>
          </div>
        </div>

      </div>
      <div><span v-for="(item, index) in labeList"
            :key="index"
            class="labelItem"
            @click="selectLabel(item)">
        {{ item }}
      </span></div>
    </div>
    <div class="bottomBtn"
         @click="commitLabel">
      <button class="publicBtn">保存</button>
    </div>
    <van-popup v-model="showPicker"
               position="bottom"
               class="bottom-popup">
      <li class="title">添加自定义标签</li>
      <van-field v-model="labelName"
                 rows="3"
                 autosize
                 type="textarea"
                 placeholder="请输入标签"
                 maxlength="10"
                 show-word-limit />
      <li class="limitBtn">
        <span>2-10个汉字</span>
        <div>
          <button class="cancelBtn"
                  @click="showPicker = false">取消</button>
          <button class="sureBtn"
                  @click="saveLabel">完成</button>
        </div>
      </li>
    </van-popup>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import { findDocTypeLabelName } from "../../api/myCenter";
import { Toast } from "vant";

export default {
  name: "setLabel",
  components: { Navbar },
  data () {
    return {
      showPicker: false,
      selectOptList: [],
      labelName: "",
      labeList: [],

    };
  },
  created () {
    this.getAllLabel();
    let label = this.$route.query.label;
    if (label && label.indexOf(",") > -1) {
      this.selectOptList = label.split(",");
    } else if (label) {
      this.selectOptList = [label];
    }
  },
  methods: {
    delOpt (index) {
      this.selectOptList.splice(index, 1);
    },
    getAllLabel () {
      findDocTypeLabelName().then(res => {
        console.log(res);
        this.labeList = res.data;
      });
    },
    selectLabel (item) {
      this.labelName = item;
      this.saveLabel();
    },
    saveLabel () {
      if (JSON.stringify(this.selectOptList).indexOf(this.labelName) > -1) {
        Toast("标签已存在");
        return;
      }
      if (this.labelName.length === 1) {
        Toast("标签为2-10个字符");
        return;
      }
      this.selectOptList.push(this.labelName);
      this.labelName = "";
      this.showPicker = false;
    },
    showZdPicker () {
      this.showPicker = true;
    },
    commitLabel () {
      api.sendEvent({
        name: "editLabel",
        extra: {
          label: this.selectOptList
        }
      });
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
.addPre {
  padding: 12px 11px;
  .diagnosis {
    background: @white;
    padding: 9px 16px 21px 16px;
    text-align: left;
    .black-font;
    .font-size-md;
    border-radius: 4px;
    line-height: 20px;

    .selectOpt {
      margin-top: 6px;

      .notSelect {
        .font-login-color-blue;
        .font-blod-2;
        line-height: 20px;
        margin-top: 10px;
        text-align: center;
        vertical-align: middle;

        .addZdIcon {
          .icon-width-height-sm;
          margin-right: 6px;
          display: inline-block;
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .selectOptSpan {
        display: inline-block;
        position: relative;
        margin-right: 0.4rem;
        .font-login-color;
        padding: 8px 15px;
        background: @field-back;
        margin-top: 8px;
      }

      .closeIcon {
        .icon-width-height-sm-16;
        position: absolute;
        right: -8px;
        top: -5px;
      }
    }
  }
}

.labelItem {
  background: @white;
  .font-login-color;
  .font-size-md;
  line-height: 30px;
  display: inline-block;
  padding: 0 15px;
  border-radius: 2px;
  margin-right: 16px;
  margin-top: 12px;
}
</style>
