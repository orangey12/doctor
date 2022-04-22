<template>
    <div>
      <navbar title="用法用量"></navbar>
      <div class="cyParams ">
        <ul class="practice">
          <van-row>
            <van-col span="6">药品付数：</van-col>
            <van-col span="18">
              <van-stepper
                v-model="herbData.pay"
                theme="round"
                button-size="16"
                integer
                min="1"
                max="99"
                @blur.once="getpay()"
              />
            </van-col>
          </van-row>
          <van-row>
            <van-col span="6">用药天数：</van-col>
            <van-col span="18">
              <van-stepper
                integer
                min="1"
                max="99"
                v-model="herbData.day"
                theme="round"
                button-size="16"
              />
            </van-col>
          </van-row>
          <van-row>
            <van-col span="6">处方用法：</van-col>
            <van-col span="18" style="display:flex">
              <van-field
                type="text"
                readonly
                @click="showCfyfFun('cf')"
                v-model="herbData.dduName"
                placeholder="处方用法"
              ></van-field>
              <img
                src="../../assets/img/cf/select.png"
                class="selectIcon"
                @click="showCfyfFun('cf')"
              />
              <van-popup v-model="showCfyf" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="cfyfColumns"
                  @confirm="oncfConfirm"
                  @cancel="showCfyf = false"
                  :default-index="herbData.defaultIndex"
                />
              </van-popup>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="6">每日几次：</van-col>
            <van-col span="18">
              <van-stepper
                integer
                min="1"
                max="9"
                v-model="herbData.rc"
                theme="round"
                button-size="16"
              />
            </van-col>
          </van-row>
          <van-row>
            <van-col span="6">每次几剂：</van-col>
            <van-col span="18">
              <van-stepper
                integer
                min="1"
                max="9"
                v-model="herbData.rj"
                theme="round"
                button-size="16"
              />
            </van-col>
          </van-row>

          <van-row>
            <van-col span="6">是否代煎：</van-col>
            <van-col span="12">
              <van-radio-group
                v-model="herbData.decoct"
                direction="horizontal"
              >
                <van-radio name="是" shape="square">是</van-radio>
                <van-radio name="否" shape="square">否</van-radio>
              </van-radio-group>
            </van-col>
          </van-row>
        </ul>
      </div>
      <div class="bottomBtn">
        <button class="publicBtn" @click="setHerb">确定</button>
      </div>
    </div>
</template>

<script>
    import Navbar from "../../common/navbar";
    import {dicdrugusage} from "../../api/cf";
    import {Toast} from "vant";
    export default {
        name: "setDrugUsage",
      components: {Navbar},
      data(){
          return{
            herbData:{
              defaultIndex:0,
            },
            herIndex:0,
            cfyfColumns: [],
            showCfyf: false,
            showDj: false,
            index:0
          }
      },
      computed: {
        //草药处方用法用量
        herbArr() {
          console.log(this.$store.getters.getHerbArr);
          return this.$store.getters.getHerbArr;
        }
      },
      created() {
          this.herIndex = this.$route.query.index;
          this.herbData = this.herbArr[this.herIndex];
          console.log(this.herbData)
          this.getCfMethod();
      },
      methods:{
        // 显示处方用法选项
        showCfyfFun(type, index) {
          this.index = index;
          if (type == "cf") {
            this.showCfyf = true;
          } else if (type == "dj") {
            this.showDj = true;
          }
        },
        // 获取处方用法
        getCfMethod() {
          dicdrugusage().then(res => {
            console.log(res);
            var data = res.data;
            this.usage = res.data;
            for (let m = 0; m < data.length; m++) {
              const element = data[m];
              this.cfyfColumns.push(element.dduName);
            }
          });
        },
        // 第一次修改付数，天数和付数相同
        getpay(idx) {
          this.herbData.day = this.herbData.pay;
          this.herbData = Object.assign({},this.herbData);
        },
        // 处方用法选择完之后提交
        oncfConfirm(val) {
          console.log(val);
          this.showCfyf = false;
          this.herbData.dduName = val;
        },
        setHerb(){
          if(!this.herbData.decoct){
            Toast("请选择是否代煎");
            return;
          }
          this.herbData.isSet = 1;
          let herbArr = this.$store.getters.getHerbArr;
          console.log(herbArr)
          herbArr[this.herIndex] = this.herbData;
          // console.log(herbArr)
          this.$store.commit("setHerbArr",herbArr);
          this.$router.go(-1);
        },
      }
    }
</script>

<style scoped lang="less">

  .cyParams{
    background: @white;
    margin: 16px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .practice {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 12px 12px 4px;
    box-sizing: border-box;
    .van-row {
      width: 100%;
      font-size: @font-size-md;
      color: @font-color-1;
      font-weight: @font-weight-bold-2;
      margin-bottom: 13px;
      display: flex;
      align-items: center;
      .van-cell {
        padding: 0px;
        background: @page-back;
        text-align: center;
        width: 80%;
        margin-left: 23px;
      }

      /deep/.van-field__control {
        text-align: center;
      }
    }
  }

  .practice li {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .practice li input,
  .practice li select {
    width: 60px;
    line-height: 20px;
    .font-size-md;
  }

  .practice p {
    padding: 5px 0;
  }

  /deep/.van-cell {
    width: 45%;
    .font-login-sm;
  }

  .oneCfCard /deep/.van-cell {
    width: 45%;
    .font-login-sm;
  }

  .diagnosis /deep/.van-cell {
    padding: 10px 0px;
    .font-size-md;
  }

  .van-stepper {
    margin-top: 4px;
  }

  /deep/.van-stepper--round .van-stepper__minus {
    color: @white;
    background-color: @gray;
    border: 1px solid @gray;
    font-weight: @font-weight-bold-2;
    opacity: 1;
    margin-right: 5px;
  }

  /deep/.van-stepper--round .van-stepper__plus {
    color: @white;
    background-color: @blue;
    margin-left: 5px;
    font-weight: @font-weight-bold-2;
  }

  /deep/.van-stepper--round .van-stepper__input {
    background: @page-back;
    width: 80%;
    padding: 12px 0;
  }
  .selectIcon {
    .icon-width-height-sm-16;
    margin-top: 5px;
    margin-left: 6px;
  }
</style>
