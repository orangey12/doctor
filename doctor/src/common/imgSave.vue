<template>
  <div>
    <div @touchstart="showmenu" @touchend="emptyTime" @touchmove="gotouchmove">
      <van-image-preview
        v-model="showPic2"
        @close="onClose"
        @closed="onClose"
        :start-position="index"
        @change="changePreview"
        :images="imgList"
      >
        <template v-slot:index>第{{ index + 1 }}张</template>
      </van-image-preview
      >
    </div>
    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>

<script>
import myJsTools from "../utils/myJsTools";

export default {
  props: {
    showPic: {
      type: Boolean
    },
    images: {
      type: Array
    },
    index: {
      type: Number
    }
  },
  created() {
    this.getImgUrl();
    this.showPic1;
  },
  data() {
    return {
      // index: 0, //当前是第几张图片
      actions: [{name: "保存图片"}],
      showAction: false,
      Loop: null,
      showPic2: false, imgList: [],

    };
  },
  computed: {
    showPic1: {
      get() {
        this.showPic2 = this.showPic;
        return this.showPic;
      },
      set(val) {
        this.showPic2 = val;
        return val;
      }
    }
  },

  methods: {
    getImgUrl() {
      let imgList = [];
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i].indexOf(".png") != -1 && this.images[i].indexOf(",") != -1) {
          let s = myJsTools.getUrl(this.images[i], 'yuantu').then(url => {
            imgList.push(url);
            console.log(url + "========++图片预览")
          });
        } else {
          imgList.push(this.images[i]);
        }
      }
      this.imgList = imgList;
    },
    showmenu() {
      let me = this;
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(
        function () {
          me.showAction = true;
        }.bind(this),
        1000
      );
    },
    changePreview(index) {
      this.$emit("changePreview", index);
    },
    onClose() {
      this.$emit("onClose");
      return;
    },
    emptyTime() {
      try {
        e.stopPropagation(); //非IE浏览器
      } catch (e) {
        window.event.cancelBubble = true; //IE浏览器
      }
      clearTimeout(this.Loop);
    },
    gotouchmove() {
      clearTimeout(this.Loop); //清除定时器
    },
    savePicture(url) {
      var timestamp = new Date().getTime();
      api.download(
        {
          url: url,
          savePath: "fs://test" + timestamp + ".jpeg",
          report: true,
          cache: true,
          allowResume: true
        },
        function (ret, err) {
          if (ret) {
            api.toast({
              msg: "图片已保存到本地"
            });
          }
          api.saveMediaToAlbum(
            {
              path: "fs://test" + timestamp + ".jpeg"
            },
            function (ret, err) {
            }
          );
        }
      );
    },
    onSelect(obj) {
      this.showAction = false;
      let url = this.images[this.index].split("?")[0];
      var timestamp = new Date().getTime();
      api.download(
        {
          url: url,
          savePath: "fs://test" + timestamp + ".jpeg",
          report: false,
          cache: true,
          allowResume: true
        },
        function (ret, err) {
          if (ret) {
            api.toast({
              msg: "图片已保存到本地"
            });
          }
          api.saveMediaToAlbum(
            {
              path: "fs://test" + timestamp + ".jpeg"
            },
            function (ret, err) {
            }
          );
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .van-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
