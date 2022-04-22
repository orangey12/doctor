<template>
  <div class="user">
    <van-index-bar :index-list="indexList">
      <div v-for="(item,key,index) in patientList" :key="index">
        <van-index-anchor :index="key!='☆'? key : '☆ 星标用户'" style="background:#F5F5F5;"></van-index-anchor>
        <div class="list" v-for="(val,i) in item" :key="i">
          <van-checkbox-group v-model="result">
            <van-checkbox :name="val.patientId">
              <template>
                <div class="item">
                  <img v-zlazy="val.patientImg" class="img-width-height-spe"/>
                  <span>{{ val.patientName }}</span>
                </div>
              </template>
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
    </van-index-bar>
  </div>
</template>

<script>
export default {
  name: "patientSelect",
  props: {
    indexList: {
      default: function () {
        return [];
      },
      type: Array,
    },
    patientList: {
      default: {},
    }
  },
  data() {
    return {
      result:[],
    }
  },
  created() {
    let list = this.$store.getters.getGroupsList;
    for (let i = 0; i < list.length; i++) {
      this.result.push(list[i].patientId);
    }
  },
  methods:{

  }
}
</script>

<style scoped lang="less">
@import '../../assets/css/overall';
.user {
  height: calc(100vh - 135px);
  overflow-y: scroll;
}
.list {
  background: @white;
  padding: 0 4%;

  .item {
    display: flex;
    align-items: center;

    img {
      margin: 0 16px;
      padding: 14px 0;
    }

    span {
      .black-font;
      .font-size-md;
      line-height: 20px;
    }
  }
}
</style>
