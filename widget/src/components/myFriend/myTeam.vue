<template>
    <div class="myTeam">
      <navbar title="我的团队"></navbar>
      <div class="emptyDiv" v-if="teamList.length == 0">
        <img src="../../assets/img/my/teamEmpty.png" class="teamEmpty">
        <li>
          您暂无团队，可联系医院管理员为您组建团队
        </li>
      </div>
      <div class="teamList">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoaded"
          >
        <div class="card" v-for="(item,index) in teamList" :key="index" @click="openDetail(item,index)">
          <div class="content">
            <li class="docName">医生：{{item.docName}}</li>
            <li class="assistantName">
              医助：{{item.assitNameStr}}
            </li>
          </div>
          <li class="count">
            共{{item.assitCount}}人
          </li>
        </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import myJsTools from "../../utils/myJsTools";
    import {getMyTeamPage} from "../../api/friend";
    export default {
        name: "myTeam",
      data(){
          return{
            teamList:[],
            listQuery:{
              docId:myJsTools.getItem("token_info").docId,
              limit:20,
              page:1,
              size:1
            },
            isLoading: false,
            finished: false,
            loading: false,
          }
      },
      components: {Navbar},
      created() {
        this.getList();
      },
      methods:{
        // 我的团队详情
        openDetail(item,index){
          this.$router.push({
            name:"friendList",
            query:{
              dtmId:item.dtmId
            }
          })
        },
        // 下拉刷新
        onRefresh() {
          // 清空列表数据
          this.finished = false;
          // 重新加载数据
          // 将 loading 设置为 true，表示处于加载状态
          this.loading = true;
          this.listQuery.page = 1;
          this.teamList = [];
          this.onLoaded();
        },
        // 上拉加载
        onLoaded() {
          if (this.isLoading) {
            this.isLoading = false;
          }
          this.getList();
        },
        getList(){
          getMyTeamPage(this.listQuery).then(res=>{
            console.log(res);
            // this.teamList = res.data.rows;
            if (this.listQuery.size < 2) {
              this.loading = false;
            }
            if (this.listQuery.page == 1) {
              this.listQuery.page = 1;
              this.isLoading = false;
              this.teamList = res.data.rows;
            } else {
              this.teamList = this.teamList.concat(res.data.rows);
              this.loading = false;
            }
            this.listQuery.size = res.data.total / this.listQuery.limit;
            if (this.listQuery.page >= this.listQuery.size) {
              this.finished = true; // 若数据已全部获取完毕
              return;
            }
            this.listQuery.page++;
          })
        }
      }
    }
</script>

<style scoped lang="less">
.card{
  background: #ffffff;
  border-radius: 8px;
  color: #333333;
  font-size: 14px;
  margin: 12px 16px 0px;
  .content{
    padding: 12px 16px;
    .docName{
      font-weight: 600;
      line-height: 22px;
    }
    .assistantName{
      color: #666666;
      margin-top: 10px;
      line-height: 18px;
    }
  }
  .count{
    padding: 12px 16px;
    border-top: 0.5px solid #EBEBEB;
    color: #666666;
    line-height: 20px;
  }
}
  .emptyDiv{
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-weight: 600;
    margin-top: 30%;
    .teamEmpty{
      width: 193px;
      height: 162px;
      margin: 0 auto 20px;
    }
  }
</style>
