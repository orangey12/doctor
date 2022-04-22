<template>
  <div>
    <navbar title="选择检查中心"></navbar>
    <div class="fixedDiv">
      <div class="searchDiv" :style="{ 'padding-top': headerHeight + 'px' }">
        <img src="../../assets/img/index/search.png" class="searchIcon"/>
        <div class="searchField">
          <van-field v-model="listQuery.pacsOrgName" placeholder="请输入想要搜索的内容" :clearable="true"
          />
        </div>
        <span @click="getMechainList" class="font-login-color-blue">搜索</span>
      </div>
    </div>

    <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
                      :style="{ 'padding-top': '44px' }">
      <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoaded">
        <van-radio-group v-model="radio">
          <div @click="radio=item" v-for="(item,index) in mechainList" :key="index" class="card">
            <div class="pacsInfo">
              <img v-zlazy="item.pacsOrgImg" data-type="jg" class="jgImg">
              <div class="info">
                <li>{{ item.pacsOrgName }}</li>
                <li class="address">{{ item.address }}</li>
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
import {getPaceItemPrice, getPacsOrganizationList, saveProPacsInfo} from "../../api/check";
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
        pacsOrgName: "",
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
      getPacsOrganizationList(this.listQuery).then(res => {
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
      let arr = param.saveProPacsDetailDTO.map(item=>{
        return item.pliId
      })
      return new Promise(resolve => {
        getPaceItemPrice({
          dpoId:this.radio.dpoId,
          itemList:arr
        }).then(res=>{
          if(res.data){
            param.saveProPacsDetailDTO.map(item=>{
              res.data.map((el,index)=>{
                if(item.pliId == el.pliId && el.price){
                  item.price = el.price
                }
                if(index == param.saveProPacsDetailDTO.length - 1){
                  resolve(param)
                }
              })
            })
          }
        })
      })
    },
    async save(type) {
      let param = myJsTools.getItem("pacsInfo");
      if(type == 'sure'){
        param = await this.getPrice(param);
        param.pacsOrgName = this.radio.pacsOrgName;
        param.dpoId = this.radio.dpoId;
      }
      Toast.loading({
        message: '发送中...',
        forbidClick: true,
        closeOnClick: false,
        duration: 0
      });
      saveProPacsInfo(param).then(res => {
        this.$store.commit("setAllCheckList", []);
        let ext = {
          ppiId: res.data.ppiId,
          ppiDiag: param.ppiDiag,
          type: "jcd",
          orderStatus:1,
        }
        api.sendEvent({
          name: 'sendCheck',
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
      width: 70%;
    }

    .address {
      .font-color-2;
      .font-size-sm;
      line-height: 17px;
      margin-top: 2px;
      margin-right: 24px;
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
