<template>
    <div class="myFriendIndex">
      <navbar title="我的好友"></navbar>
      <div class="list">
        <li class="lineLi" @click="openMedicalBuddy">
          <u>我的医疗好友</u>
          <u>
            <img src="../../assets/img/my/rightArrow.png" class="rightIcon">
          </u>
        </li>
        <li @click="openTeam">
          <u>我的团队</u>
          <u>
            <img src="../../assets/img/my/rightArrow.png" class="rightIcon">
          </u>
        </li>
      </div>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    export default {
        name: "index",
      components: {Navbar},
      methods:{
          //我的团队
          openTeam(){
            this.$router.push({
              name:"myTeam"
            })
          },
        //我的医疗好友
        openMedicalBuddy(){
          this.$router.push({
            name:"medicalBuddy"
          })
        }

      }
    }
</script>

<style scoped lang="less">
.list{
  color: #333333;
  font-size: 14px;
  padding: 0 16px;
  background: #ffffff;
  li{
    padding: 12px 0;
    display: flex;
    align-items: center;
    u:first-child{
      width: 95%;
    }
    .rightIcon{
      width: 22px;
      height: 22px;
      float: right;
    }
  }
  .lineLi{
    border-bottom: 0.5px solid #EBEBEB;
  }
}
</style>
