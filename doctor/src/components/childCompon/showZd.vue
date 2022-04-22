<template>
  <div>
    <div class="zdDiv">
      <li class="titleTips">
        <span class="line"></span>
        <span>临床诊断</span>
      </li>
      <div class="addZd">
        <div class="selectedDiag" v-if="beforeZdList.length > 0">
          <div v-for="(item,index) in beforeZdList" :key="index"
               :class="item.diagType == '3'?'':'diagsName'">
                <span v-if="item.diagType == '1'">
                  <span>{{ item.diagNamePrefix }}</span>
                  <span class="font-login-color-blue">{{ item.diagName }}</span>
                  <span>{{ item.diagNameSuffix }}</span>
                </span>
            <span v-if="item.diagType == '3'">
                  <span class="font-login-color-blue" v-if="!item.editZdShow">{{ item.diagName }} - {{
                      item.symptomaticName
                    }}</span>
                </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";
import myJsTools from "../../utils/myJsTools";

let timeOut, timerId;
export default {
  name: "showZd",
  props: {
    beforeZdList: Array,
  },
  data() {
    return {

    }
  },
}
</script>

<style scoped lang="less">


.zdListPopup {
  background: @white;
  height: 50%;
  overflow: scroll;
  width: 100%;
  text-align: center;
  padding: 11px 0;
  border-top: 1px solid @back-border;

  li {
    padding: 11px 0;
    .black-font;
    .font-size-lg;
  }
}

.zdDiv {
  background: @white;
  padding: 8px;
  margin-top: 8px;
  border-radius: 4px;
  .font-size-md;
}

.addDiv {
  background: @page-back;
  .font-login-color;
  display: flex;
  .font-size-md;
  align-items: center;
  padding: 8px;

  .editZd {
    margin-right: 4px;
  }
}

/deep/ .van-field {
  padding: 8px;
  .font-size-md;
  background: @page-back;
}

.diagList {
  position: fixed;
  padding-right: 70px;
  bottom: 0px;
  z-index: 99999999;
  width: 100%;
  height: 56px;
  line-height: 56px;
  .display-div;
  background: @white;
  left: 0;
  .black-font;
  .font-size-lg-2;

  span {
    margin-left: 16px;
  }

  .imgDiv {
    padding: 0 9px;
  }

  .downImg {
    width: 42px;
    height: 15px;
  }

  .zdList {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-y: hidden;
    white-space: nowrap;
  }
}

.herbalZd {
  background: @page-back;
  display: flex;
  align-items: center;
  position: relative;

  .delIcon {
    position: absolute;
    right: -4px;
    top: -4px;
  }

  /deep/ .van-field__control {
    background: @white;
    padding-left: 2px;
  }

  .herbalLine {
    margin: 0 22px;
  }
}

.zdEditPopup {
  width: 80%;
  background: @white;
  padding: 16px;
  text-align: center;

  .btns {
    padding-top: 12px;
    display: flex;
    align-items: center;

    button {
      line-height: 34px !important;
    }
  }

  .popup-title {
    margin-bottom: 24px;
  }

  .zdName {
    padding: 12px 0;
  }

  .van-cell {
    line-height: 18px;
    padding: 8px;
    font-size: @font-size-sm-2;
    background: @field-back;
    border-radius: 4px;
    border: none;
    width: 100%;
    height: 52px;
  }

  .commitBtn {
    margin: 24px auto 0;
    line-height: 34px !important;
  }
}

.diagsName {
  background: #EAF8FF;
  padding: 8px;
  .font-size-md;
  margin-top: 8px;
  margin-right: 8px;
}

.addZdDiv {
  margin-top: 8px;
}

.editHerbalZd {
  margin-top: 8px;

  .bzName {
    padding-left: 8px;
    .font-login-color;
  }
}


.selectedDiag {
  display: flex;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;

    .editZd {
      margin-left: 6px;
    }
  }
}

</style>
