<template>
  <div class="friendList">
    <navbar title="我的好友"></navbar>
    <div>
      <div>
        <van-form action="/">
          <van-search
            v-model="searchValue"
            background="#FFFFFF"
            :left-icon="searchIcon"
            placeholder="输入组名，快速查找"
            @search="getFriendDetail"
            @clear="getFriendDetail"
          />
        </van-form>
      </div>
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(item, key, index) in friendList" :key="index">
          <van-index-anchor
            :index="key"
            style="background:#F5F5F5;"
          ></van-index-anchor>
          <div class="list" v-for="(val, i) in item" :key="i" @click="openDocInfo(val,i)">
            <div class="item">
              <img v-zlazy="val.docImg" class="list_img"/>
              <span>{{ val.patientName }}</span>
              <div>
                <img src="../../assets/img/my/flag.png" class="flagIcon" v-if="val.docAssistantType == '1'">
              </div>
            </div>
          </div>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {getMyTeamInfo} from "../../api/friend";
import ossUpDown from "../../utils/ossUpDown";

export default {
  name: "friendList",
  components: {Navbar},
  data() {
    return {
      indexList: [],
      friendList: [],
      searchIcon: require("../../assets/img/index/search.png"),
      searchValue: "",
      dtmId: "",
    };
  },
  created() {
    this.dtmId = this.$route.query.dtmId;
    this.getFriendDetail();
  },
  methods: {
    // 查看医生或医助主页面信息
    openDocInfo(item, index) {
      this.$router.push({
        name: "docInfo",
        query: {
          docId: item.docId || item.assistId
        }
      })
    },
    //获取团队信息
    getFriendDetail() {
      getMyTeamInfo({
        dtmId: this.dtmId,
        docAssistantName: this.searchValue
      }).then(async res => {
        let defaultImg = require("../../assets/img/my/default.png");
        let arr = []
        let data = res.data.assistList;
        for (let i = 0; i < data.length; i++) {
          arr.push({
            asterisk: '0',
            patientName: data[i].assistName,
            assistId: data[i].assistId,
            docAssistantType: data[i].docAssistantType,
            docImg: data[i].docImg
          })
        }
        let arr_1 = myJsTools.data_letter_sort(arr, "py");
        this.friendList = arr_1;
        this.indexList = Object.keys(this.friendList);
      })
    },
  }
}
</script>

<style scoped lang="less">


.list {
  background: @white;
  padding: 0 4%;

  .item {
    display: flex;
    align-items: center;

    .list_img {
      .img-width-height-sm;
      margin-right: 16px;
      padding: 14px 0;
    }

    span {
      .black-font;
      .font-size-md;
      line-height: 20px;
    }

    .flagIcon {
      width: 22px;
      height: 14px;
      margin-left: 4px;
    }
  }
}

/deep/ .van-icon {
  margin-top: 3px;
}

/deep/ .van-search {
  box-shadow: 0 0 0 4px @page-back;
}
</style>
