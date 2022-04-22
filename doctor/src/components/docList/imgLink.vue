<template>
  <div>
    <navbar :title="title"></navbar>
    <div class="htmlData" v-html="data">

    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {queryDicCarouselMapbyId} from "../../api/set";
import myJsTools from "../../utils/myJsTools";

export default {
  name: "imgLink",
  components: {Navbar},
  data() {
    return {
      data: '',
      title: "",
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {

        queryDicCarouselMapbyId({
          carouselId: this.$route.query.carouselId
        }).then(res => {
          //链接
          this.title = res.data.title;
          if (this.$route.query.carouselType == '3') {
            api.openFrame({
              name: 'imgLink',
              url: res.data.contentInfo,
              rect: {
                x: 0,
                y: myJsTools.getItem("headerHeight"),
                w: 'auto',
                h: 'auto'
              },
            });
          } else if (this.$route.query.carouselType == '1') {//富文本
            let imgName, me = this;
            this.data = res.data.contentInfo;
            var imgLst =  res.data.contentInfo.match(/<img\s*src=\"([^\"]*?)\"[^>]*>/gi);
            for (let i = 0; i < imgLst.length; i++) {
              console.log(imgLst[i]);
              imgLst[i].replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
                myJsTools.getUrl(capture).then(url => {
                  console.log(capture,url);
                  let result = me.data.replace(capture, url);
                  me.data = result;
                })
              });
            }
          }
        })


    },

  },
}
</script>

<style scoped>
.htmlData{
  padding: 8px;
}
</style>
