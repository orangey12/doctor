<template>
  <div>
    <navbar title="查看电子处方"></navbar>
    <div class="emptyDiv" v-if="emptyShow">
      <img src="../../assets/img/cf/cfEmpty.png" class="emptyIcon">
      <li>暂无电子处方</li>
    </div>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import {getPrescriptionPdfName} from "../../api/cf";
import {downLoadFileMany} from "../../api/oss";
export default {
  name: "electronicPrescription",
  components: {Navbar},
  data(){
    return{
      businessId:"",
      emptyShow:false,
    }
  },
  created() {
    this.businessId = this.$route.query.businessId;
    this.getPDF();
  },
  beforeRouteLeave(to, from, next){
    var pdfReader = api.require('pdfReader');
    pdfReader.closePdfView();
    next();
  },
  methods:{
    getPDF(){
      getPrescriptionPdfName({
        businessId:this.businessId
      }).then(res=>{
        console.log(res);
        if(res.data){
          downLoadFileMany(res.data).then(res=>{
            console.log(res);
            let fileUrl = res.data[0].url;
            let herfUrl = fileUrl.split("-internal").join("");
            let url = herfUrl.split("?")[0];
            var pdfReader = api.require('pdfReader');
            pdfReader.openPdfView({
              rect:{
                x:0,
                y:api.safeArea.top + 48,
                w:'auto',
                h:'auto'
              },
              path:url,
              fixed:true
            },function(ret){
              console.log(JSON.stringify(ret));
            });
          })
        }else{
          this.emptyShow = true;
        }
      })
    },
  }
}
</script>

<style scoped>
.emptyDiv{
  padding-top: 30%;
}
</style>
