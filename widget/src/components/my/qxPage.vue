<template>
    <div>
      <Navbar title="隐私设置"></Navbar>
      <div class="qxDiv">
        <div class="display-div topQxTips" @click="reqPermission('camera')">
          <div>摄像头权限提示</div>
          <div class="rightDiv">{{resultList[0].granted ? '已开启':'去设置'}}
            <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
          </div>
        </div>
        <div class="bottomQxTips">
          用于拍摄照片上传头像或与聊天沟通发送照片
        </div>
      </div>
      <div class="qxDiv">
        <div class="display-div topQxTips" @click="reqPermission('microphone')">
          <div>录音权限提示</div>
          <div class="rightDiv">
            {{resultList[1].granted ? '已开启':'去设置'}}
            <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
          </div>
        </div>
        <div class="bottomQxTips">
          用于聊天沟通发送音频信息
        </div>
      </div>
      <div class="qxDiv">
        <div class="display-div topQxTips" @click="reqPermission('storage')">
          <div>本地相册权限提示</div>
          <div class="rightDiv">{{resultList[2].granted ? '已开启':'去设置'}}
            <img src="../../assets/img/my/rightArrow.png" class="rightArrow">
          </div>
        </div>
        <div class="bottomQxTips">
          用于选择图片上传头像或与聊天沟通发送图片
        </div>
      </div>
    </div>
</template>

<script>
import Navbar from "../../common/navbar";
export default {
  name: "qxPage",
  components: {Navbar},
  data(){
    return{
      resultList:[],
    }
  },
  created() {
    this.getPromise();
  },
  methods:{
    getPromise(){
       this.resultList = api.hasPermission({
        list:['camera', "microphone", "storage"]
      });
    },
    reqPermission(type) {
      let me = this;
      let perms = [type];
      api.requestPermission(
        {
          list: perms,
        },
        function (ret, err) {
          me.getPromise();
        }
      );
    },
  }
}
</script>

<style scoped lang="less">

.rightDiv{
  display: flex;
  align-items: center;
}

.topQxTips{
  background: #fff;
  padding: 12px 16px;
  .font-size-md-2;
  line-height: 22px;
}

.bottomQxTips{
  padding: 4px 16px;
  .font-size-sm;
  .font-color-2;
}
</style>
