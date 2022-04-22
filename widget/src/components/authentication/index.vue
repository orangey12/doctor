<template>
  <div class="authentication">
    <navbar title="医生认证"></navbar>
    <div class="reasonDiv" v-if="pageType == 'edit'">
      <li class="font-login-color-red">{{info.docAuditStatusText}}</li>
      <li class="time">{{info.auditTime}}</li>
      <li class="title">不通过理由</li>
      <div class="notPassDiv">
        <li>{{info.notPassReason?info.notPassReason:info.notPassReasonDescription}}</li>
        <div class="imgDiv">
          <img v-zlazy="item" alt="" v-for="(item,index) in info.descriptionImgList" :key="index" class="notPassImg" @click="getImgView(info.descriptionImgList,index)">
        </div>
      </div>
    </div>
    <div class="authDoc">
      <van-field
        v-model="info.docName"
        label="姓名"
        placeholder="请输入姓名"
        maxlength="20"
        :readonly="pageType == 'edit'"
      />
      <van-field
        v-model="info.idNo"
        label="身份证号"
        placeholder="请输入证件号码"
        type="text"
        :readonly="pageType == 'edit'"
      />
      <div class="rightPlac">
        <van-field
          v-model="info.area"
          label="地区"
          :placeholder="info.area"
          right-icon="arrow"
          readonly
          @click="selectArea = true"
        >
        </van-field>
      </div>
      <van-popup v-model="selectArea" position="bottom">
        <van-area
          title="请选择地址"
          :area-list="areaList"
          @confirm="confirmArea"
        />
      </van-popup>
      <div class="uploadSfz">
        <li>身份证照片</li>
        <div class="imgDiv display-div">
          <div>
            <img src="../../assets/img/my/sfz1.png" class="sfzDefault" @click="selectImg(1)"
                 v-if="!info.papersFrontImgUp">
            <img v-zlazy="info.papersFrontImgUp" :key="info.papersFrontImgUp" class="sfzDefault" @click="selectImg(1)" v-else>
            <li>请上传身份证正面</li>
          </div>
          <div>
            <img src="../../assets/img/my/sfz2.png" class="sfzDefault" @click="selectImg(2)"
                 v-if="!info.papersReverseImgUp">
            <img v-zlazy="info.papersReverseImgUp" :key="info.papersReverseImgUp" class="sfzDefault" @click="selectImg(2)" v-else>
            <li>请上传身份证正反面</li>
          </div>
        </div>
      </div>
      <van-field
        v-model="info.workHosName"
        label="医院"
        placeholder="请输入医院"
        maxlength="20"
      />
      <van-field
        v-model="info.deptName"
        label="科室"
        placeholder=""
        right-icon="arrow"
        readonly
        @click="selectDept = true"
      >
      </van-field>
      <van-popup v-model="selectDept" round position="bottom">
        <van-picker
          show-toolbar
          :columns="deptNameList"
          @cancel="selectDept = false"
          @confirm="confirmDept"
        />
      </van-popup>
      <van-field
        v-model="info.docProf"
        label="职称"
        placeholder=""
        right-icon="arrow"
        readonly
        @click="selecrDocProf = true"
      >
      </van-field>
      <van-popup v-model="selecrDocProf" round position="bottom">
        <van-picker
          show-toolbar
          :columns="docProfList"
          @cancel="selecrDocProf = false"
          @confirm="confirmDocProf"
        />
      </van-popup>
    </div>
    <div class="tipsSfz">
      <div>我们需要您提供身份证信息用于核实您的真实身份</div>
      <div>在确保身份真实的情况下您才可以使用APP中的在线沟通等功能</div>
    </div>
    <div class="bottomBtn">
      <button class="publicBtn" @click="goNext">下一步</button>
    </div>
    <van-action-sheet
      v-model="showPic"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="onSelect"
    />
    <img-save
      v-if="show"
      :showPic="show"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
  </div>
</template>

<script>
import Navbar from "../../common/navbar";
import areaList from '../../utils/area'
import {Toast} from "vant";
import regex from "../../utils/regex";
import {getSysCodeByType} from "../../api/scale";
import {findDocFillInAttestInfo, getAllDept} from "../../api/my";
import myJsTools from "../../utils/myJsTools";
import imgSave from "../../common/imgSave";
export default {
  name: "authentication",
  components: {Navbar,imgSave},
  data() {
    return {
      info: {
        docName: "",
        idNo: "",
        provinceName: "",
        cityName: "",
        areaName: "",
        workHosName: "",
        area: "",
        deptIdArray: "",
        deptName: "",
        docProf: "",
        papersFrontImg: "",
        papersFrontImgUp: "",
        papersReverseImg: "",
        papersReverseImgUp: "",
      },
      selectArea: false,
      selecrDocProf: false,
      selectDept: false,
      areaList: {},
      docProfList: [],
      deptList: [],
      deptNameList: [],
      actions: [{name: "从相册选择"}, {name: "拍照"}],
      showPic: false,
      selectType: "",//1为正面 2为反面
      pageType:"",// edit 为编辑 不通过修改
      docAuditStatus:"",
      docAuditStatusText:"",
      show: false,
      images: [],
      index: 0,
    }
  },
  beforeCreate() {
    this.$store.commit("UPDATE_KEEP_ALIVE", {
      keepAlive: "authentication"
    });
  },
  created() {
    console.log(areaList);
    this.areaList = areaList;
    this.pageType = this.$route.query.pageType;
    if(this.pageType == 'edit'){
      this.getShInfo();
    }
    this.getdocProf();
    this.getDept();
  },
  methods: {
    changePreview(index) {
      this.index = index;
    },
    onClose() {
      this.show = false;
    },
    // 预览图片
    getImgView(item, index) {
      this.images = item;
      this.index = index;
      this.show = true;
    },
    getShInfo(){
      findDocFillInAttestInfo({
        docId: myJsTools.getItem("token_info").docId
      }).then(async res=>{
        console.log(JSON.stringify(res) + "--------审核信息");
        let data = res.data;
        this.docAuditStatus = data.docAuditStatus;
        data.deptName = data.deptNameStr;
        data.area = data.provinceName + data.cityName + data.areaName;
        data.papersReverseImgUp = data.papersReverseImg;
        data.papersFrontImgUp = data.papersFrontImg;
        this.info = Object.assign({},data);
        this.getAllImg(data);
      })
    },
    async getAllImg(data){
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中',
      });
      data.descriptionImgList = [];
      data.docProfList = [];
      data.qualificationList = [];
      data.professionalList = [];
      data.qtList = [];
      if(data.descriptionImg){
        data.descriptionImgList = data.descriptionImg.split("|");
      }
      let professionalImgList = data.professionalImg.split("|");
      for (let i = 0; i < professionalImgList.length; i++) {
        data.docProfList.push({
          imgUrl:professionalImgList[i],
          src:professionalImgList[i]
        });
      }
      let qualificationImgList = data.qualificationImg.split("|");
      for (let i = 0; i < qualificationImgList.length; i++) {
        data.qualificationList.push({
          imgUrl:qualificationImgList[i],
          src:qualificationImgList[i]
        });
      }
      let employmentImgList = data.employmentImg.split("|");
      for (let i = 0; i < employmentImgList.length; i++) {
        data.professionalList.push({
          imgUrl:employmentImgList[i],
          src:employmentImgList[i]
        });
      }
      if(data.otherImg){
        let otherImgList = data.otherImg.split("|");
        for (let i = 0; i < otherImgList.length; i++) {
          data.qtList.push({
            imgUrl:otherImgList[i],
            src:employmentImgList[i]
          });
        }
      }
      this.info = Object.assign({},data);
      Toast.clear();
    },
    //  更换头像
    selectImg(type) {
      this.selectType = type;
      this.showPic = true;
    },
    //选择拍照还是相册
    async onSelect(item) {
      if (api.systemType != 'ios') {
        let s = await myJsTools.getPromise("camera");
        if(!s){
          Toast("请开启相机权限")
          return;
        }
      }
      this.show = false;
      let sourceType,
        filename,
        me = this;
      if (item.name == "拍照") {
        sourceType = "camera";
      } else {
        sourceType = "album";
      }
      filename =
        Number(
          Math.random()
            .toString()
            .substr(3, 18) + Date.now()
        ).toString(36) + ".png";
      api.getPicture(
        {
          sourceType: sourceType,
          encodingType: "png",
          mediaValue: "pic",
          destinationType: "base64",
          allowEdit: true,
          quality: 100,
          saveToPhotoAlbum: false
        },
        function (ret, err) {
          console.log(JSON.stringify(ret));
          if (ret && ret.data != '' && ret.base64Data != '') {
            myJsTools.appendFile(
              "5",
              ret.base64Data,
              "123.png",
              ret.base64Data.length
            );
            api.addEventListener(
              {
                name: "upImg"
              },
              function (ret, err) {
                if (me.selectType == 1) {
                  me.info.papersFrontImg = ret.value.url;
                } else {
                  me.info.papersReverseImg = ret.value.url;
                }
              }
            );
            if (me.selectType == 1) {
              me.info.papersFrontImgUp = ret.data;
            } else {
              me.info.papersReverseImgUp = ret.data;
            }
          } else if(err){
            console.log(JSON.stringify(err));
          }
        }
      );
    },
    //获取题目类型
    getdocProf() {
      getSysCodeByType({
        codeType: "001"
      }).then(res => {
        this.docProfList = res.data.map(item => {
          return item.meaning
        });
      });
    },
    //获取所有科室
    getDept() {
      getAllDept().then(res => {
        console.log(res);
        this.deptList = res.data;
        this.deptNameList = res.data.map(item => {
          return item.deptName
        });
      })
    },
    //选择职称
    confirmDocProf(val) {
      console.log(val);
      this.info.docProf = val;
      this.selecrDocProf = false;
    },
    //选择科室
    confirmDept(val) {
      this.info.deptName = val;
      for (let i = 0; i < this.deptList.length; i++) {
        let el = this.deptList[i];
        if (el.deptName == val) {
          this.info.deptIdArray = [el.deptId];
          break;
        }
      }
      this.selectDept = false;
    },
    //地区选择确认
    confirmArea(val) {
      console.log(val)
      this.info.provinceName = val[0].name;
      this.info.cityName = val[1].name;
      this.info.areaName = val[2].name;
      this.info.area = val[0].name + val[1].name + val[2].name;
      this.selectArea = false;
    },
    goNext() {
      let info = this.info
      if (regex.nameBlur(info.docName) && regex.idNoBlur(info.idNo)) {
        if(!info.area){
          Toast("请选择地区");
          return false;
        }
        if(!info.papersFrontImg){
          Toast("请上传身份证正面图");
          return false;
        }
        if(!info.papersReverseImg){
          Toast("请上传身份证反面图");
          return false;
        }
        if (!info.workHosName) {
          Toast("请输入医院名称");
          return false;
        }
        if (!info.deptName) {
          Toast("请选择科室");
          return false;
        }
        if (!info.docProf) {
          Toast("请选择职称");
          return false;
        }

        let infoQuery = Object.assign({},this.info);
        infoQuery.pageType = this.pageType;
        if(this.pageType != 'edit'){
          infoQuery.docAuditStatus = this.$store.getters.getDocShStatus;
        }else {
          if(!infoQuery.papersFrontImgUp){
            return ;
          }
        }
        infoQuery.papersFrontImgUp = '';
        infoQuery.papersReverseImgUp = '';
        this.$router.push({
          name: "docAuthImg",
          query:{
            info: JSON.stringify(infoQuery)
          }
        })
      }
    },
  }
}
</script>

<style scoped lang="less">

.authentication{
  padding-bottom: 60px;
}
.uploadSfz {
  background: @white;
  padding: 12px 16px;
  margin-bottom: 8px;
  .black-font;

  .imgDiv {
    text-align: center;
    .font-size-sm;
    .font-login-color;

    div {
      flex: 1;
      margin-top: 10px;

      .sfzDefault {
        width: 95%;
        height: 101px;
        object-fit: cover;
        display: inline-block;
      }

      li {
        line-height: 22px;
        margin-top: 8px;
      }
    }
  }
}
.reasonDiv{
  background: @white;
  padding: 12px 16px 16px;
  .font-size-sm;
  .black-font;
  line-height: 20px;
  .time{
    padding: 10px 0 12px;
    border-bottom: 0.5px solid @back-border;
  }
  .title{
    margin: 13px 0 11px;
  }
  .notPassDiv{
    background: @span-back;
    padding: 12px;
  }
  .imgDiv{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    img{
      width: 30%;
      margin-right: 2%;
      height: 100px;
      object-fit: cover;
    }

  }
}

.tipsSfz{
  .font-color-2;
  .font-size-sm;
  padding: 18px;
  line-height: 16px;
  text-align: center;
}
</style>
