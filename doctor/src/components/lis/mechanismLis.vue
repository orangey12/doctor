<template>
  <div>
    <navbar title="选择检查中心"></navbar>
    <div class="fixedDiv">
      <div class="searchDiv" :style="{ 'padding-top': headerHeight + 'px' }">
        <img src="../../assets/img/index/search.png" class="searchIcon"/>
        <div class="searchField">
          <van-field v-model="listQuery.lisOrgName" placeholder="请输入想要搜索的内容" :clearable="true"
          />
        </div>
        <span @click="getMechainList" class="font-login-color-blue">搜索</span>
      </div>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
                      :style="{ 'padding-top': 44  + 'px' }">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoaded">
        <van-radio-group v-model="radio">
          <div v-for="(item,index) in mechainList" :key="index" class="card">
            <div class="pacsInfo">
              <img v-zlazy="item.lisOrgImg" data-type="jg" class="jgImg">
              <div class="info" v-if="item.lisType == '1'">
                <li>{{ item.lisOrgName }}</li>
                <li class="address">{{ item.address }}</li>
              </div>
              <div class="info" v-if="item.lisType == '2'">
                <li>{{ item.samplingOrgName }}</li>
                <li class="address">{{ item.lisOrgName }}</li>
              </div>
              <div class="lisType">
                {{item.lisType == '1'?'到检':'送检'}}
              </div>
              <van-radio :name="item"/>
            </div>
          </div>
        </van-radio-group>
      </van-list>
    </van-pull-refresh>

    <div class="bottomBtn">
      <button class="publicWhiteBtn" @click="save('pass')">跳过</button>
      <button class="publicBtn twoBtn" @click="save('sure')">确定</button>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import myJsTools from "../../utils/myJsTools";
import {getLisItemPrice, getLisOrganizationList, saveProLisInfo} from "../../api/chat";
import {Toast} from "vant";

export default {
  name: "mechanism",
  components: {Navbar},
  data() {
    return {
      headerHeight: 50,
      mechainList: [],
      listQuery: {
        limit: 10,
        page: 1,
        size: 1,
        lisOrgName: "",
        organList: [],
      },
      isLoading: false,
      finished: true,
      loading: false,
      radio: {},
    }
  },
  created() {
    this.listQuery.organList = JSON.parse(this.$route.query.organList)
    if (myJsTools.getItem("headerHeight")) {
      this.headerHeight = parseInt(myJsTools.getItem("headerHeight"));
    }
    this.onRefresh();
  },
  methods: {
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
      this.getMechainList();
    },
    //获取机构列表
    getMechainList() {
      getLisOrganizationList(this.listQuery).then(res => {
        this.loading = false;
        this.listQuery.size = res.data.total / this.listQuery.limit;
        let data = res.data.rows;
        if (this.listQuery.page == 1) {
          this.listQuery.page = 1;
          this.isLoading = false;
          this.mechainList = data;
          this.radio = data[0];
        } else {
          this.mechainList = this.mechainList.concat(data);
          this.loading = false;
        }
        if (this.listQuery.page >= this.listQuery.size) {
          this.finished = true; // 若数据已全部获取完毕
          return;
        }
        this.listQuery.page++;
      })
    },
    getPrice(param){
      let arr = param.saveProLisDetailDTO.map(item=>{
        return item.dliId
      })
      return new Promise(resolve => {
        getLisItemPrice({
          dloId:this.radio.dloId,
          itemList:arr
        }).then(res=>{
          if(res.data){
            param.saveProLisDetailDTO.map(item=>{
              res.data.map((el,index)=>{
                if(item.dliId == el.dliId && el.price){
                  item.price = el.price
                }
                if(index == param.saveProLisDetailDTO.length - 1){
                  resolve(param)
                }
              })
            })
          }
        })
      })
    },
    async save(type) {
      let param = myJsTools.getItem("lisInfo");
      if(type == 'sure'){
        param = await this.getPrice(param);
        param.lisOrgName = this.radio.lisOrgName;
        param.dloId = this.radio.dloId;
        param.dsoId = this.radio.dsoId || '';
        param.samplingOrgName = this.radio.samplingOrgName || '';
        param.lisType = this.radio.lisType || '';
      }
      Toast.loading({
        message: '发送中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      saveProLisInfo(param).then(res => {
        this.$store.commit("setAllLisList", []);
        let ext = {
          pliId: res.data.pliId,
          ppiDiag: param.ppiDiag,
          type: "jyd",
          orderStatus:1,
        }
        api.sendEvent({
          name: 'sendLis',
          extra: {
            ext: ext
          }
        });
        this.$router.go(-2);
      });
    },
  }
}
</script>

<style scoped lang="less">


.searchDiv {
  display: flex;
  width: 100%;
  background: #ffffff;
  font-size: 14px;

  .searchIcon {
    width: 22px;
    height: 22px;
    padding: 10px 16px;
  }

  span {
    font-size: 12px;
    line-height: 18px;
    padding: 12px 0 12px 11px;
  }

  .searchField {
    width: 70%;

    .van-field {
      width: 100%;
    }
  }

  div {
    input {
      width: 100%;
    }
  }
}

.fixedDiv {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
}

.card {
  background: #FFFFFF;
  padding: 12px 16px;
  border-bottom: 1px solid #EBEBEB;

  .pacsInfo {
    display: flex;
    align-items: center;
    color: @black;
    .font-size-md;
    line-height: 20px;

    .info {
      width: 60%;
    }

    .address {
      .font-color-2;
      .font-size-sm;
      line-height: 17px;
      margin-top: 2px;
      margin-right: 24px;
    }

    .lisType{
      padding-top: 8px;
      padding-right: 8px;
      .black-font;
      font-size: 14px;
    }
  }

  img {
    width: 53px;
    height: 53px;
    border-radius: 4px;
    margin-right: 12px;
  }
}

/deep/ .van-radio__icon .van-icon {
  border: none;

}

/deep/ .van-radio__icon--checked .van-icon {
  background: @white;
  color: @blue;
  font-size: 22px;
}
</style>
