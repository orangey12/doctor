<template>
  <div class="addMedicalNotes">
    <navbar type="defaultPage" title="添加诊疗笔记"></navbar>
    <div class="noticeDiv">
      <van-field v-model="recordTitle" placeholder="医生自定义标题" label="标题" maxlength="20"/>
      <van-field v-model="recordSymptom" placeholder="感冒、咳嗽" label="主诉" maxlength="20"/>
      <van-field
        v-model="diagnosisRecord"
        label="诊断"
        maxlength="200"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入诊断结果"
        clearable
      />
      <van-field disabled label="处方"/>
      <div>
        <van-field
          v-model="prescriptionRecord"
          rows="1"
          autosize
          label=""
          type="textarea"
          placeholder="请输入描述或上传处方照片"
          clearable
          :border="false"
          maxlength="200"
        />
        <div class="imgDiv">
          <div v-for="(item,index) in cfImgList" :key="index">
            <img :src="item.src" alt="" class="uploadPic" @click="lookImg(1)">
            <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('1',index)">
          </div>
          <div v-if="cfImgList.length < 9">
            <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('1')">
          </div>
        </div>
      </div>
      <li class="title">
        病情照片
        <span class="tips">（上传病历首页、内页、化验/影像报告等）</span>
      </li>
      <div class="imgDiv">
        <div v-for="(item,index) in bqImgList" :key="index">
          <img :src="item.src" alt="" class="uploadPic" @click="lookImg(2)">
          <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('2',index)">
        </div>
        <div v-if="bqImgList.length < 9">
          <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('2')">
        </div>
      </div>
      <li class="title">
        其它照片
        <span class="tips">（上传患者伤病处照片和其它照片）</span>
      </li>
      <div class="imgDiv bottomImgDiv">
        <div v-for="(item,index) in qtImgList" :key="index">
          <img :src="item.src" alt="" class="uploadPic" @click="lookImg(3)">
          <img src="../../assets/img/record/del.png" class="deleteIcon" @click="deleteImg('3',index)">
        </div>
        <div v-if="qtImgList.length < 9">
          <img src="../../assets/img/record/uploadPic.png" class="uploadPic" @click="openSelectPic('3')">
        </div>
      </div>
    </div>
    <div class="heightDiv"></div>
    <div class="bottomBtn" @click="savaZlbj">
      <button class="publicBtn">保存</button>
    </div>
    <img-save
      v-if="showImgPic"
      :showPic="showImgPic"
      :index="index"
      :images="images"
      @changePreview="changePreview"
      @onClose="onClose"
    ></img-save>
    <van-action-sheet
      v-model="showPic"
      :actions="picActions"
      cancel-text="取消"
      close-on-click-action
      style="width:100%"
      @select="getPic"
      close-on-popstate
    />
  </div>
</template>

<script>
  import navbar from "@/common/navbar";
  import {Toast} from "vant";
  import {saveDocMedicalRecord} from "@/api/cf";
  import myJsTools from "@/utils/myJsTools";
  import axios from "axios";
  import imgSave from "@/common/imgSave";

  export default {
    components: {navbar, imgSave},
    data() {
      return {
        recordTitle: "",
        recordSymptom: "",
        diagnosisRecord: "",
        prescriptionRecord: "",
        cfImgList: [],
        prescriptionImg: [],
        bqImgList: [],
        diseaseImg: [],
        qtImgList: [],
        qtImg: [],
        showPic: false,
        picActions: [
          {name: "拍照", sourceType: "camera"},
          {name: "从相册选择", sourceType: "album"}
        ],
        showImgPic: false, //保存图片组件
        images: [],
        index: 0,
      };
    },
    created() {
    },
    methods: {
      //保存图片到本地
      changePreview(index) {
        this.index = index;
      },
      //关闭图片查看
      onClose() {
        this.showImgPic = false;
      },
      // 点击查看图片
      lookImg(type) {
        let imgUrl = [], data;
        if (type == 1) {
          data = this.cfImgList;
        } else if (type == 2) {
          data = this.bqImgList;
        } else if (type == 3) {
          data = this.qtImgList;
        }
        for (let i = 0; i < data.length; i++) {
          imgUrl.push(data[i].src);
        }
        this.showImgPic = true;
        this.images = imgUrl;
      },
      //  删除图片
      deleteImg(type, index) {
        if (type == '1') {
          this.cfImgList.splice(index, 1);
        } else if (type == '2') {
          this.bqImgList.splice(index, 1);
        } else if (type == '3') {
          this.qtImgList.splice(index, 1);
        }
      },
      // 选择照片或者拍照
      getPic(val) {
        console.log(val);
        if (val.sourceType == "camera") {
          let me = this;
          api.getPicture(
            {
              sourceType: val.sourceType,
              encodingType: "png",
              mediaValue: "pic",
              destinationType: "base64",
              allowEdit: true,
              quality: 80,
              saveToPhotoAlbum: false
            },
            function (ret, err) {
              if (ret) {
                me.saveImg({
                  path: ret.data
                })
                console.log(JSON.stringify(ret));
              } else {
                console.log(JSON.stringify(err));
              }
            }
          );
        } else {
          this.selectPicOpt();
        }
      },
      openSelectPic(type) {
        this.selectType = type;
        this.showPic = true;
      },
      // 选择图片
      async selectPicOpt() {
        if (api.systemType != 'ios') {
          let s = await myJsTools.getPromise("camera");
          if(!s){
            Toast("请开启相机权限")
            return;
          }
        }
        let me = this;
        var UIAlbumBrowser = api.require("UIAlbumBrowser");
        let type = this.selectType,maxNum;
        if (type == '1') {
          maxNum = 9 - me.cfImgList.length;
        } else if (type == '2') {
          maxNum = 9 - me.bqImgList.length;
        } else if (type == '3') {
          maxNum = 9 - me.qtImgList.length;
        }
        UIAlbumBrowser.open(
          {
            max: maxNum,
            type: "image",
            videoTimeFilter: 30,
            selectedAll: false,
            styles: {
              bg: "#fff",
              mark: {
                icon: "",
                position: "bottom_left",
                size: 20,
              },
              nav: {
                bg: "rgba(0,0,0,0.6)",
                titleColor: "#fff",
                titleSize: 18,
                cancelColor: "#fff",
                cancelSize: 16,
                finishColor: "#fff",
                finishSize: 16,
              },
            },
            rotation: true,
          },
          function (ret, err) {
            console.log(JSON.stringify(ret.list) + "获取图片错误");
            if (ret && ret.list && ret.list.length > 0) {
              for (let i = 0; i < ret.list.length; i++) {
                const element = ret.list[i];
                if (api.systemType == 'ios') {
                  me.transPath(element);
                } else {
                  me.saveImg(element)
                }
              }
            } else {
              console.log(JSON.stringify(err) + "ssssssss");
            }
          }
        );
      },
      transPath: function (element, type) {
        var me = this;
        var UIAlbumBrowser = api.require('UIAlbumBrowser');
        UIAlbumBrowser.transPath({
          path: element.path
        }, function (ret, err) {
          if (ret) {
            var iospath = ret.path;
            element.path = iospath;
            me.saveImg(element);
          } else {
            console.log(JSON.stringify(err));
          }
        });
      },
      async saveImg(element) {
        let me = this;
        let type = this.selectType;
        await myJsTools.appendFile(
          "12",
          element.path,
          "333.png",
          element.size,
          me.patientId
        );
        await api.addEventListener(
          {
            name: "upImg"
          },
          function (ret, err) {
            console.log(JSON.stringify(ret.value));
            let m = {};
            m.imgUrl = ret.value.url;
            m.src = ret.value.src;
            if (type == '1') {
              me.cfImgList.push(m)
            } else if (type == '2') {
              me.bqImgList.push(m)
            } else if (type == '3') {
              me.qtImgList.push(m)
            }
          }
        );
      },
      savaZlbj() {
        var userInfo = myJsTools.getItem("patientInfo");
        for (let m = 0; m < this.cfImgList.length; m++) {
          const element = this.cfImgList[m];
          this.prescriptionImg.push(element.imgUrl);
        }
        for (let m = 0; m < this.bqImgList.length; m++) {
          const element = this.bqImgList[m];
          this.diseaseImg.push(element.imgUrl);
        }
        for (let m = 0; m < this.qtImgList.length; m++) {
          const element = this.qtImgList[m];
          this.qtImg.push(element.imgUrl);
        }
        if (
          !this.recordTitle &&
          !this.recordSymptom &&
          !this.diagnosisRecord &&
          !this.prescriptionRecord &&
          this.prescriptionImg.length == 0 &&
          this.diseaseImg.length == 0 &&
          this.qtImg.length == 0
        ) {
          Toast("请至少填写一项");
          return;
        }
        var param = {
          recordTitle: this.recordTitle,
          recordSymptom: this.recordSymptom,
          diagnosisRecord: this.diagnosisRecord,
          prescriptionRecord: this.prescriptionRecord,
          patientName: userInfo.patientName,
          patientId: userInfo.patientId,
          docId: myJsTools.getItem("token_info").docId,
          docName: myJsTools.getItem("token_info").docName,
          dmrType: 1
        };
        if (this.prescriptionImg.length > 0) {
          param.prescriptionImg = JSON.stringify(this.prescriptionImg);
        }
        if (this.diseaseImg.length > 0) {
          param.diseaseImg = JSON.stringify(this.diseaseImg);
        }
        if (this.qtImg.length > 0) {
          param.qtImg = JSON.stringify(this.qtImg);
        }
        saveDocMedicalRecord(param).then(res => {
          console.log(res);
          this.$router.go(-1);
        });
      }
    }
  };
</script>

<style lang="less" scoped>


  .noticeDiv {
    padding: 0 16px;
    background: @white;

    /deep/ .van-cell {
      padding: 12px 0;
      line-height: 20px;
      .font-size-md-2;
      .black-font;

      .van-field__control {
        .black-font;
      }

      .van-field__control:disabled {
        .black-font;
      }
    }

    .title {
      padding: 12px 0 33px;
      .black-font;
      .font-size-md-2;
      line-height: 20px;

      .tips {
        .font-login-color;
        .font-login-sm;
      }
    }
  }

  .imgDiv {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid @back-border;

    .uploadPic {
      margin-right: 14px;
      margin-bottom: 14px;
      object-fit: cover;
    }

    div {
      position: relative;
    }

    .deleteIcon {
     .icon-width-height-sm-16;
      position: absolute;
      right: 16px;
      top: 1px;
    }

    .uploadPic {
      width: 94px;
      height: 94px;
    }
  }

  .bottomImgDiv {
    border: none;
  }
</style>
