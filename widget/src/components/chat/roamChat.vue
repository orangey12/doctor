<template>
  <div>
    <navbar title="找回聊天记录"></navbar>
    <div class="timeSelect">
      <li class="selectOpt" v-for="(item,index) in timeList" :key="index" @click="getMyList(index)">
        <span>{{item.text}}</span>
        <img src="../../assets/img/chat/selected.png" class="selectedIcon" v-if="index==active">
      </li>
    </div>
  </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import{Toast} from "vant";
    import date from "../../utils/date";
    import myJsTools from "../../utils/myJsTools";
    export default {
        name: "roamChat",
      components: {Navbar},
      data(){
          return{
            active:-1,
            timeList:[{
              text:"找回3天",
              type:3 * 24 * 3600 * 1000,
              pagesize:25,
            },{
              text:"找回7天",
              type:7 * 24 * 3600 * 1000,
              pagesize:100,
            },{
              text:"找回30天",
              type:30 * 24 * 3600 * 1000,
              pagesize:200,
            }],
            userId:"",
            patientId:"",
            time:"",//截止时间
            hisList:[],
            docId:"",
            oneList:[],
          }
      },
      created() {
        this.userId = this.$route.query.userId;
        this.patientId = this.$route.query.patientId;
        this.docId = myJsTools.getItem("token_info").docId;
        this.chatId = this.patientId.toLowerCase() + "," + this.docId.toLowerCase();
        let list = this.$store.getters.getOneChatList(this.chatId);
        if(list){
          list.chatRecordList.map(item=>{
            this.oneList.push(item);
          })
        }
      },
      methods:{
         getMyList(index){
          if(index == this.active){
            return ;
          }
          this.hisList = [];
          this.active=index;
           Toast.loading({
             message: '找回中',
             forbidClick: true,
             loadingType: 'spinner',
             duration:0
           });
          this.time = date.dateDif(new Date().getTime(),this.timeList[index].type);
           // 自定义加载图标
          this.getHistoryList('');
        },
        getHistoryList(startMsgId){
          let me = this;
          var easeChat = api.require('easeChat');
          easeChat.fetchHistoryMessagesFromServer({
            conversationId: me.userId.toLowerCase(),
            type: 'chat',
            startMsgId:startMsgId,
            pagesize:50
          },function(ret) {
            console.log(JSON.stringify(ret) + "-----获取历史记录")
            if(ret.messages && ret.messages.length > 0){
              let list = ret.messages;
              let arr = [];
              if(list.length < 50){
                for (let i = list.length - 1; i >= 0; i--) {
                  let item = list[i];
                  if(date.format(item.timestamp) > me.time){
                    me.hisList.unshift(list[i])
                  }else{
                    break;
                  }
                }
                me.resetListData();
                // console.log(JSON.stringify(me.hisList) + "循环之后的历史记录======" + me.hisList.length);
              }else{
                if(date.format(list[0].timestamp) > me.time){
                  for (let i = list.length - 1; i >= 0; i--) {
                    me.hisList.unshift(list[i])
                  }
                  me.getHistoryList(ret.cursor);
                }else{
                  for (let i = list.length - 1; i >= 0; i--) {
                    let item = list[i];
                    if(date.format(item.timestamp) > me.time){
                      me.hisList.unshift(list[i])
                    }else{
                      me.resetListData();
                      // console.log(JSON.stringify(me.hisList) + "循环之后的历史记录----" + me.hisList.length);
                      break;
                    }
                  }
                }
              }

            }else{
              Toast.clear();
              Toast("暂无历史记录")
            }
          });
        },
        async resetListData(){
          let arr = [];
          for (let i = 0; i < this.hisList.length; i++) {
            let item = this.hisList[i];
            let status;
            if(item.direction == 'send'){
              status = "send"
            }else{
              status = "read";
            }
            let msg = {
              type: item.direction,
              messType: item.body.type,
              content: item.body.text,
              from: item.from,
              to: item.to,
              time: item.timestamp,
              duration: item.body.duration,
              status: status,
              ext:item.ext,
              mid: item.messageId,
              conversationId: item.conversationId,
            }
            if(item.body.type == 'image' || item.body.type == 'video' || item.body.type == 'voice'){
              msg.content = item.body.remotePath;
            }
            if (item.body.type == 'image'){
              this.getCatchImg(msg);
            }
            if(item.ext.patientId.toLowerCase() == this.patientId.toLowerCase()){
              arr.push(msg);
            }
          }
          let res = {
            chatRecordList:arr,
            chatId: this.chatId
          }
          this.$store.commit("setOneChatList",res);
          Toast.clear();
          Toast("记录获取完成")
        },
        getCatchImg(item){
          let url;
          let that = this;
          api.imageCache(
            {
              url: item.content,
              thumbnail:false,
            },
            function(ret, err) {
              if (ret) {
                url = ret.url;
                item.content = url;
                console.log("url------缓存环信图片---fasong--------" + url);
                console.log(JSON.stringify(item) + "-----缓存环信图片----fasong---msg")
                that.$store.commit("updateCardStatus",item);
              }
            }
          );
        }
      }
    }
</script>

<style scoped lang="less">
.selectOpt{
  color: #333333;
  font-size: 15px;
  line-height: 21px;
  background: #FFFFFF;
  margin-bottom: 1px;
  padding: 12px 16px;
  position: relative;
  img{
    width: 22px;
    height: 22px;
    position: absolute;
    right: 16px;
    top: 12px;
  }
}
</style>
