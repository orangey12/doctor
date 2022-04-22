<template>
  <div class="verifiedFriend">
    <navbar title="待验证"></navbar>
    <div class="newFriendList">
      <div v-if="list.length > 0">
        <li class="time">
          今天
        </li>
        <div class="friendList">
          <li class="firendLi" @click="openDetail(item)" v-for="(item,index) in list" :key="index">
            <img v-zlazy="item.src" class="userHead">
            <div>
              {{item.docName}}
            </div>
            <button @click="agreeFriend(item)">验证</button>
          </li>
        </div>
      </div>
      <div v-else class="emptyDiv">
        <img src="../../assets/img/friend/empty.png" class="emptyIcon">
        <li>暂无好友申请</li>
      </div>
    </div>
  </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import {confirmAddDocFriendRelation, getToBeVerifiedList} from "../../api/friend";
    import myJsTools from "../../utils/myJsTools";
    import ossUpDown from "../../utils/ossUpDown";
    import {Toast} from "vant";
    export default {
        name: "verifiedFriend",
      components: {Navbar},
      data(){
        return{
          list:[],
        }
      },
      created() {
        this.getList();
      },
      methods:{
        getList(){
          getToBeVerifiedList({
            docId:myJsTools.getItem("token_info").docId
          }).then(res=>{
            console.log(res);
            let data = res.data.list;
            this.list = data;
          })
        },
        agreeFriend(item){
          confirmAddDocFriendRelation({
            activeDocId:item.docId,
            passiveDocId: myJsTools.getItem("token_info").docId
          }).then(res=>{
            console.log(res);
            Toast("已同意");
            this.$router.go(-1);
          })
        },
        openDetail(item){
          this.$router.push({
            name:"friendRequests",
            query:{
              docId:item.docId,
              type:"agree",
            }
          })
        },
      }
    }
</script>

<style scoped lang="less">

.newFriendList{
  .time{
    color: #999999;
    padding-left: 16px;
    font-size: 11px;
    line-height: 16px;
    padding-bottom: 2px;
  }
  .firendLi{
    background: #ffffff;
    padding: 14px 16px;
    display: flex;
    color: #000000;
    font-size: 14px;
    align-items: center;
    position: relative;
    button{
      background: @blue;
      border-radius: 4px;
      line-height: 25px;
      position: absolute;
      right: 16px;
      .white-font;
      .font-size-sm;
      padding: 0 14px;
    }
  }
  .userHead{
    .img-width-height-sm;
    margin-right: 16px;
  }
}

  .emptyDiv{
    margin-top: 30%;
  }
</style>
