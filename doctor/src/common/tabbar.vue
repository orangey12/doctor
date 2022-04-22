

<template>
  <div class="tabbar">
    <van-tabbar v-model="active" inactive-color="#666660" route active-color="#14A0E6" fixed placeholder >
      <van-tabbar-item v-for="(item, index) in tabbars" :key="index" :to="item.path">
        <span>{{ item.title }}</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? item.active : item.normal" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import myJsTools from "../utils/myJsTools";
import {getUserIdentityInfo} from "../api/login";

export default {
  props: {},
  data() {
    return {
      active: 0,
      icon: {
        active: 'https://img.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img.yzcdn.cn/vant/user-inactive.png',
      },
      tabbars: [],
    };
  },
  created() {
    let docInfo = myJsTools.getItem("docInfo");
    console.log(docInfo)
    if(!docInfo){
      this.getUserInfo();
    }else{
      this.setTabbar();
    }

  },
  methods:{
    setTabbar(){
      let docInfo = myJsTools.getItem("docInfo");
      if(docInfo == "all"){
        this.tabbars = [
          {
            path: "/mainIndex",
            title: "沟通",
            name:"mainIndex",
            normal: require("@/assets/img/index.png"),
            active: require("@/assets/img/index_active.png")
          },
          {
            path: "/patientIndex",
            name:"patientIndex",
            title: "患者",
            normal: require("@/assets/img/patient.png"),
            active: require("@/assets/img/patient_active.png")
          },
          {
            path: "/trialPartyIndex",
            name:"trialPartyIndex",
            title: "审方",
            normal: require("@/assets/img/sf.png"),
            active: require("@/assets/img/sf_active.png")
          },
          {
            path: "/myIndex",
            name:"myIndex",
            title: "我的",
            normal: require("@/assets/img/foo.png"),
            active: require("@/assets/img/foo_active.png")
          }
        ]
      }else if(docInfo == 'drugDoc'){
        this.tabbars = [
          {
            path: "/trialPartyIndex",
            name:"trialPartyIndex",
            title: "审方",
            normal: require("@/assets/img/sf.png"),
            active: require("@/assets/img/sf_active.png")
          },
          {
            path: "/pharmacistFoo",
            name:"pharmacistFoo",
            title: "我的",
            normal: require("@/assets/img/foo.png"),
            active: require("@/assets/img/foo_active.png")
          }
        ]
      }else if(docInfo == 'doc'){
        this.tabbars = [
          {
            path: "/mainIndex",
            title: "沟通",
            name:"mainIndex",
            normal: require("@/assets/img/index.png"),
            active: require("@/assets/img/index_active.png")
          },
          {
            path: "/patientIndex",
            name:"patientIndex",
            title: "患者",
            normal: require("@/assets/img/patient.png"),
            active: require("@/assets/img/patient_active.png")
          },
          {
            path: "/myIndex",
            name:"myIndex",
            title: "我的",
            normal: require("@/assets/img/foo.png"),
            active: require("@/assets/img/foo_active.png")
          }
        ]
      }
      this.active = 0;
    },
    getUserInfo(){
      getUserIdentityInfo().then(res=>{
        console.log(res.data.identityIds);

        this.setTabbar();
        let docInfo;
        if(res.data.identityIds == "docIdentityLulutong,drugDocIdentityLulutong"){
          docInfo = "all"
          this.$router.push({
            name: "mainIndex"
          });
          console.log(res.data.identityIds == "docIdentityLulutong,drugDocIdentityLulutong")
        }else if(res.data.identityIds == "docIdentityLulutong"){
          docInfo = "doc"
          this.$router.push({
            name: "mainIndex"
          });
        }else if(res.data.identityIds == "drugDocIdentityLulutong"){
          docInfo = "drugDoc"
          this.$router.push({
            name: "trialPartyIndex"
          });
        }
        myJsTools.setItem("docInfo",docInfo);
      })
    },
  }
};
</script>

<style scoped lang="less">
.tabbar {
  img {
    width: 32px;
    height: 32px;
  }
}
  /deep/.van-tabbar{
    height: 60px;
  }
</style>
