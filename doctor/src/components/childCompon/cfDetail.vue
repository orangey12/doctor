<template>
  <div class="prescription" id="prescription">
    <div class="addPre">
      <div class="diagnosis">
        <span>临床诊断</span>
        <div class="selectOpt">
          <li
            v-for="(item, index) in selectOptList"
            :key="index"
            class="selectOptSpan font-size-md"
          >
            <div class="div-overflow">
              <span class="font-login-color">
              {{item.diagNamePrefix}}
            </span>
              <span class="font-login-color-blue">
              {{ item.diagName }}
            </span>
              <span class="font-login-color">
              {{item.diagNameSuffix}}
            </span>
            </div>
            <img
              src="../../assets/img/cf/editZd.png"
              class="editZdIcon"
              @click.stop="editZd(item,index)"
            />
          </li>
          <div class="notSelect" @click="showZdPicker">
            <img src="../../assets/img/cf/addcf.png" class="addCfIcon"/>
            <span>添加诊断</span>
          </div>
        </div>
        <van-popup
          v-model="showPicker"
          position="right"
          style="z-index:999999999999;width:100%;height:100%"
        >
          <div class="fixedDiv">
            <header
              class="defaultHeader"
              :style="{ 'padding-top': paddingTop }"
            >
              <img
                src="../../assets/img/chat/back.png"
                class="backIcon"
                @click="showPicker = false"
              />
              <div class="title">添加诊断</div>
            </header>
            <div
              class="searchDiv"
              :style="{ 'padding-top': headerHeight + 30 + 'px' }"
            >
              <img src="../../assets/img/index/search.png" class="searchIcon"/>
              <div class="searchField">
                <van-field
                  v-model="searchVal"
                  placeholder="请输入想要搜索的内容"
                  :clearable="true"
                />
              </div>
              <span @click="searchDiag">搜索</span>
            </div>
          </div>
          <div
            class="zdList"
            id="zdList"
            :style="{ 'padding-top': headerHeight + 70 + 'px' }"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="getOptList"
            >
              <li
                v-for="(item, index) in diags"
                :key="index"
                class="diagName"
                @click="selectThisZd(item,index)"
              >
                {{ item.diagName }}
              </li>
            </van-list>
          </div>
        </van-popup>
      </div>

      <div class="cfList" v-for="(itemfood, indexFood) in foodList" :key="indexFood + 'indexFood'">
        <li class="title">
          <u class="div-overflow">Rp</u>
          <u class="cfType">食品级</u>
        </li>

        <div class="oneCfCard" v-for="(onceFood, indexFood1) in itemfood" :key="indexFood1 + 'itemfood'">
          <li class="drugName">
            {{ indexFood + 1 }}.{{ onceFood.drugName }}({{ onceFood.gg }})
          </li>
          <li class="dduName">用法：{{ onceFood.dduName }}、{{ onceFood.ddufName }}</li>
          <li class="price">
            <u>价格：￥{{ onceFood.price }}</u>
            <u>x{{ onceFood.sendNum }}</u>
          </li>
          <li class="memo" v-if="onceFood.memo">说明：{{ onceFood.memo }}</li>
          <div class="onceCardBtn">
            <button @click="modification(indexFood, indexFood1, 2)">修改</button>
            <button @click="deleteDrug(indexFood, indexFood1, 2)">删除</button>
          </div>
          <span class="line" v-if="indexFood1 != itemfood.length - 1"></span>
        </div>
        <p class="totalPrice">
          合计：
          <span>￥{{ foodArrlist[indexFood] }}</span>
        </p>
        <button class="conAdd" @click="openDrug(2, indexFood)">
          <img src="../../assets/img/cf/addcf.png" class="addCfIcon"/>
          <span>添加药品</span>
        </button>
      </div>

      <div class="cfList" v-for="(item, index) in medicineList" :key="index">
        <li class="title">
          <u class="rp">Rp</u>
          <u class="cfType">西药处方</u>
        </li>

        <div class="oneCfCard" v-for="(once, index1) in item" :key="index1">
          <li class="drugName">
            {{ index1 + 1 }}.{{ once.drugName }}({{ once.gg }})
          </li>
          <li class="dduName">用法：{{ once.dduName }}、{{ once.ddufName }}</li>
          <li class="price">
            <u>价格：￥{{ once.price }}</u>
            <u>x{{ once.sendNum }}</u>
          </li>
          <li class="memo" v-if="once.memo">说明：{{ once.memo }}</li>
          <div class="onceCardBtn">
            <button @click="modification(index, index1, 0)">修改</button>
            <button @click="deleteDrug(index, index1, 0)">删除</button>
          </div>
          <span class="line" v-if="index1 != item.length - 1"></span>
        </div>
        <p class="totalPrice">
          合计：
          <span style="color:red">￥{{ arrlist[index] }}</span>
        </p>
        <button class="conAdd" @click="openDrug(0, index)">
          <img src="../../assets/img/cf/addcf.png" class="addCfIcon"/>
          <span>添加药品</span>
        </button>
      </div>

      <div
        class="cfList"
        v-for="(items, indexHer) in herbList"
        :key="'her' + indexHer"
      >
        <li class="title">
          <u class="rp">Rp</u>
          <u class="cfType">草药处方</u>
        </li>
        <div
          class="oneCfCard"
          v-for="(onceHer, indexHer1) in items"
          :key="'her' + indexHer1"
        >
          <li class="drugName">
            {{ indexHer1 + 1 }}.{{ onceHer.drugName }}({{ onceHer.jldw }})
          </li>
          <li class="price">特殊煎法：{{ onceHer.pcjf }}</li>
          <li class="price">
            <u>价格：￥{{ onceHer.price }}</u>
            <u>x{{ onceHer.sendNum }}</u>
          </li>
          <li class="memo" v-if="onceHer.memo">说明：{{ onceHer.memo }}</li>
          <div class="onceCardBtn">
            <button @click="modification(indexHer, indexHer1, 1)">修改</button>
            <button @click="deleteDrug(indexHer, indexHer1, 1)">删除</button>
          </div>
          <span class="line"></span>
        </div>
        <p class="totalPrice" v-if="herbArr[indexHer]">
          合计：
          <span style="color:red">￥{{ herbArr[indexHer].total }}</span>
        </p>
        <div class="display-div">
          <button class="conAdd" @click="openDrug(1, index)">
            <img src="../../assets/img/cf/addcf.png" class="addCfIcon"/>
            <span>添加药品</span>
          </button>
          <button v-if="herbArr[indexHer] && herbArr[indexHer].isSet == 0" class="conAdd"
                  @click="openSetUsage(indexHer)">
            <img src="../../assets/img/cf/notSet.png" class="addCfIcon"/>
            <span class="font-login-color-red">设置用法用量</span>
          </button>
          <button v-if="herbArr[indexHer] && herbArr[indexHer].isSet == 1" class="conAdd"
                  @click="openSetUsage(indexHer)">
            <img src="../../assets/img/cf/etCyUse.png" class="addCfIcon"/>
            <span>修改用法用量</span>
          </button>
        </div>
      </div>



      <van-popup v-model="showTobefried" round class="friedPopup">
        <li class="title">是否代煎</li>
        <li class="tipsInfo">您的处方中含有草药，是否需要代煎</li>
        <div class="friedBtns">
          <button @click="commitJudge(true)">否</button>
          <button @click="commitJudge(false)">是</button>
        </div>
      </van-popup>
      <van-popup v-model="usageShow" :close-on-click-overlay="false" round class="friedPopup">
        <li class="title">提示</li>
        <li class="tipsInfo">存在未设置用法用量的处方，请您确认</li>
        <div class="friedBtns">
          <button @click="usageShow=false" class="commitBtn">确定</button>
        </div>
      </van-popup>
      <van-popup v-model="zdAddPopup" class="zdEditPopup" :close-on-click-overlay="false" round>
        <li class="popup-title">临床诊断</li>
        <van-field v-model="diagNamePrefix" maxlength="10" placeholder="请输入前缀"/>
        <li class="font-login-color-blue font-size-md zdName font-blod-2">{{selectDiag.diagName}}</li>
        <van-field v-model="diagNameSuffix" maxlength="10" placeholder="请输入后缀"/>
        <div>
          <button class="publicBtn commitBtn" @click="closeZdAdd">
            确定
          </button>
        </div>
      </van-popup>


      <van-popup v-model="zdEditPopup" class="zdEditPopup" :close-on-click-overlay="false" round>
        <li class="popup-title">临床诊断</li>
        <van-field v-model="selectDiag.diagNamePrefix" maxlength="10" placeholder="请输入前缀"/>
        <li class="font-login-color-blue font-size-md zdName font-blod-2">{{selectDiag.diagName}}</li>
        <van-field v-model="selectDiag.diagNameSuffix" maxlength="10" placeholder="请输入后缀"/>
        <div class="display-div">
          <button class="publicWhiteBtn commitBtn delBtn" @click="delOpt">
            删除
          </button>
          <button class="publicBtn commitBtn" @click="closeZdEdit">
            确定
          </button>
        </div>
      </van-popup>
    </div>
    <div class="bottomBtn">
      <button class="publicWhiteBtn" @click="showAction=true">新增处方</button>
      <button class="publicBtn twoBtn" @click="judgeFried(2)">修改并提审</button>
    </div>
    <van-action-sheet
      v-model="showAction"
      :actions="actions"
      cancel-text="取消"
      @select="openDrug"
      @cancel="showAction = false"
    />
  </div>
</template>

<script>
  import navbar from "@/common/navbar";
  import myJsTools from "@/utils/myJsTools";
  import {
    findByName,
    dicdrugusage,
    savePrescription,
    getPrescriptionInfoById
  } from "@/api/cf.js";
  import {
    doctorToPatientSendMessageToMq,
    findAppidAndOpenidAndUseridByPatientId
  } from "@/api/fsend";
  import {Toast} from "vant";

  export default {
    props: {
      businessIdProp: {
        type: String
      },
    },
    name: "cfDetail",
    data() {
      return {
        businessId:"",
        index: 0,
        searchVal: "",
        selectOptList: [],
        actions: [
          {
            name: "西成药"
          },
          {
            name: "草药方"
          },
          {
            name: "食品级"
          }
        ],
        zdQuery: {
          limit: 20,
          page: 1,
          size: 1
        }, //诊断请求参数
        showPicker: false,
        showAction: false,
        showCfyf: false,
        showDj: false,
        columns: [],
        herbArr: [],
        usage: [],
        cfyfColumns: [],
        djColumns: ["是", "否"],
        arrlist: [],
        diags: [],
        showTobefried: false, //是否待煎提示框
        herbArrIndex: 0,
        btnDisabled: false,
        userInfo: {},
        type: 1, //保存、保存并发送类型
        cyParamList: [], //草药参数
        defaultIndex: 1, //默认显示处方用法第一个
        finished: false,
        loading: false,
        headerHeight: 35,
        paddingTop: "",
        proBusinessInfo: {},
        zdAddPopup: false,//编辑诊断
        zdEditPopup: false,//添加诊断前后缀
        diagNamePrefix: "",
        diagNameSuffix: "",
        selectDiag: {},//当前选择的诊断
        selectIndex: "",//点击选择的诊断index
        usageShow: false,//存在未设置用法用量的提示
        foodArrlist:[],
      };
    },
    computed: {
      medicineList() {
        console.log(this.$store.getters.getMedicineList);
        return this.$store.getters.getMedicineList;
      },
      herbList() {
        return this.$store.getters.getHerbList;
      },
      foodList(){
        console.log("ssss");
        return this.$store.getters.getFoodList;
      }
    },
    components: {
      navbar
    },

    created() {
      this.businessId = this.businessIdProp;
      this.getCfMethod();
      this.userInfo = myJsTools.getItem("patientInfo");
      this.getBeforeCf();
    },
    activated() {
      this.showAction = false;
      this.$nextTick(() => {
        if (this.medicineList.length > 0) {
          this.setTotal();
        }
        if (this.foodList.length > 0) {
          this.setFoodTotal();
        }
        if (this.herbList.length > 0) {
          console.log(this.herbList);
          this.setHerbTotal();
        }
      });
    },
    mounted() {
      if (myJsTools.getItem("headerHeight")) {
        this.paddingTop = parseInt(api.safeArea.top) + "px";
      }
    },
    methods: {
      // 打开诊断选择弹窗
      showZdPicker() {
        this.showPicker = true;
      },
      //跳转设置用法用量
      openSetUsage(index) {
        this.$router.push({
          name: "setDrugUsage",
          query: {
            index: index
          }
        })
      },
      // 获取之前保存的处方信息
      getBeforeCf() {
        let param;
        if (this.businessId) {
          param = {
            businessId: this.businessId
          };
        } else {
          param = {
            regId: this.userInfo.regId
          };
        }
        getPrescriptionInfoById(param).then(res => {
          console.log("上次保存的处方详情" + JSON.stringify(res));
          this.proBusinessInfo = res.data;
          if (res.data.diags) {
            this.selectOptList = res.data.diags;
          }
          var arr = [],
            meArr = [],
            i = 0,
            n = 0,
            arrb = [],
            herArr = [],foodArr=[];
          // 在不为重新编辑处方的情况下给businessId赋值
          if (res.data && this.$route.query.type != "withdraw") {
            this.businessId = res.data.businessId;
            this.businessCode = res.data.businessCode;
          } else {
            this.businessId = "";
          }
          if (res.data.checkPreMVOs) {
            for (let m = 0; m < res.data.checkPreMVOs.length; m++) {
              const element = res.data.checkPreMVOs[m];
              if (element.prescriptionType == "1") {
                for (let x = 0; x < element.details.length; x++) {
                  const drugDetail = element.details[x];
                  console.log("", drugDetail.itemName);
                  drugDetail.sendNum = drugDetail.quan;
                  drugDetail.days = drugDetail.days;
                  drugDetail.jldw = drugDetail.eachUnit;
                  drugDetail.drugName = drugDetail.itemName;
                  drugDetail.drugId = drugDetail.itemId;
                  drugDetail.dosage = drugDetail.eachQuan
                  arr.push(drugDetail);
                }
                meArr[i] = arr;
                i++;
              } else if (element.prescriptionType == "4") {
                for (let x = 0; x < element.details.length; x++) {
                  const drugDetail = element.details[x];
                  console.log("", drugDetail.itemName);
                  drugDetail.sendNum = drugDetail.quan;
                  drugDetail.days = drugDetail.days;
                  drugDetail.jldw = drugDetail.eachUnit;
                  drugDetail.drugName = drugDetail.itemName;
                  drugDetail.drugId = drugDetail.itemId;
                  drugDetail.dosage = drugDetail.eachQuan;
                  arr.push(drugDetail);
                }
                foodArr[i] = arr;
                i++;
              }  else {
                for (let x = 0; x < element.details.length; x++) {
                  const drugDetail = element.details[x];
                  drugDetail.sendNum = drugDetail.quan;
                  drugDetail.days = drugDetail.eachQuan;
                  drugDetail.jldw = drugDetail.gg;
                  drugDetail.drugName = drugDetail.itemName;
                  drugDetail.drugId = drugDetail.itemId;
                  drugDetail.pcjf = drugDetail.dduName;
                  arrb.push(drugDetail);
                }
                herArr[n] = arrb;
                n++;
                var obj = element;
                obj.pay = obj.herbalNum;
                obj.dose = obj.danjiNum;
                obj.decoct = obj.isDj == "1" ? "是" : "否";
                obj.day = obj.days;
                obj.dduName = obj.dduName;
                obj.rc = obj.rc;
                obj.rj = obj.rj;
                obj.total = obj.cost;
                obj.isSet = 1;
                this.cyParamList.push(obj);
              }
              this.$store.commit("setMedicineList", meArr);
              this.$store.commit("setHerbList", herArr);
              this.$store.commit("setHerbArr", this.cyParamList);
              this.$store.commit("setFoodList", foodArr);
              this.setTotal();
              this.setFoodTotal();
              this.setHerbTotal();
            }
          }
        });
      },
      // 计算药方总价
      setHerbTotal() {
        this.herbArr = this.$store.getters.getHerbArr;
        let arr = this.$store.getters.getHerbList;
        if (arr.length != 0) {
          var params;
          for (var j = 0; j < arr.length; j++) {
            console.log(arr.length == this.herbArr.length)
            if (arr.length == this.herbArr.length) {
              params = this.herbArr[j];
              let dose = 0;
              let total = 0;
              for (var i = 0; i < arr[j].length; i++) {
                arr[j][i].sendNum = parseFloat(arr[j][i].sendNum);
                total += arr[j][i].price * arr[j][i].sendNum;
                dose += arr[j][i].sendNum;
              }
              total = total * params.pay
              params.dose = dose;
              params.total = total.toFixed(2);
              params.defaultIndex = this.cfyfColumns.indexOf(
                this.herbArr[j].dduName
              );
              this.$set(this.herbArr, j, params);
            } else {
              params = {
                total: 0,
                pay: 1,
                describe: "",
                dose: 0,
                decoct: "",
                day: 1,
                dduName: "口服",
                rc: "1",
                rj: "1",
                defaultIndex: 1,
                isSet: 0,//是否设置过用法用量
              };
              this.herbArr.push(params);
            }
            this.$store.commit("setHerbArr", this.herbArr);
          }
        }
      },
      // 设置总价格
      setTotal() {
        if (this.medicineList.length != 0) {
          this.arrlist = [];
          for (var j = 0; j < this.medicineList.length; j++) {
            this.arrlist.push(0);
            for (var i = 0; i < this.medicineList[j].length; i++) {
              this.arrlist[j] =
                parseFloat(this.arrlist[j]) +
                this.medicineList[j][i].price * this.medicineList[j][i].sendNum;
            }
            this.arrlist[j] = this.arrlist[j].toFixed(2);
          }
        }
      },
      setFoodTotal(){
        if (this.foodList.length != 0) {
          this.foodArrlist = [];
          for (var k = 0; k < this.foodList.length; k++) {
            this.foodArrlist.push(0);
            for (var m = 0; m < this.foodList[k].length; m++) {
              this.foodArrlist[k] =
                parseFloat(this.foodArrlist[k]) +
                this.foodList[k][m].price * this.foodList[k][m].sendNum;
            }
            this.foodArrlist[k] = this.foodArrlist[k].toFixed(2);
          }
        }
      },
      // 第一次修改付数，天数和付数相同
      getpay(idx) {
        this.herbArr[idx].day = this.herbArr[idx].pay;
      },
      // 选择是否待煎提示框弹出
      judgeFried(type) {
        this.type = type;
        let herbArr = this.herbArr, saveNum = 0;
        for (let i = 0; i < herbArr.length; i++) {
          if (herbArr[i].isSet == 0) {
            saveNum = 1
          }
        }
        if (saveNum > 0) {
          this.usageShow = true;
          return;
        }
        this.savePre();
      },
      // 提交代煎修改
      commitJudge(type) {
        if (!type) {
          this.herbArr[this.herbArrIndex].decoct = "是";
        }
        this.showTobefried = false;
        this.savePre();
      },
      //   修改药
      modification(idx, index, flag) {
        //flag 为0 修改西药 为1 修改草药
        if (flag == 0) {
          var obj = this.medicineList[idx][index];
          this.$router.push({
            name: "addxy",
            query: {
              info: obj,
              flag: 1,
              idx: idx,
              index: index,
              type:flag
            }
          });
        } else if (flag == 1){
          var obj = this.herbList[idx][index];
          console.log(obj);
          this.$router.push({
            name: "addcy",
            query: {
              info: obj,
              flag: 1,
              idx: idx,
              index: index
            }
          });
        }else if (flag == 2) {
          var obj = this.foodList[idx][index];
          this.$router.push({
            name: "addxy",
            query: {
              info: obj,
              flag: 1,
              idx: idx,
              index: index,
              type:flag
            }
          });
        }
      },
      //删除药
      deleteDrug(idx, index, flag) {
        if (flag == 0) {
          this.medicineList[idx].splice(index, 1);
          if (this.medicineList[idx].length == 0) {
            this.medicineList.splice(idx, 1);
          }
          AppVue.$store.commit("setMedicineList", this.medicineList);
        } else if (flag == 1) {
          this.herbList[idx].splice(index, 1);
          if (this.herbList[idx].length == 0) {
            this.herbList.splice(idx, 1);
            this.herbArr.splice(idx, 1);
          }
          AppVue.$store.commit("setHerbList", this.herbList);
          AppVue.$store.commit("setHerbArr", this.herbArr);
        }else if (flag == 2) {
          this.foodList[idx].splice(index, 1);
          if (this.foodList[idx].length == 0) {
            this.foodList.splice(idx, 1);
          }
          AppVue.$store.commit("setFoodList", this.foodList);
        }
      },
      //编辑诊断关闭
      closeZdAdd() {
        this.selectOptList.push({
          diagCode: this.selectDiag.diagCode,
          diagId: this.selectDiag.diagId,
          diagName: this.selectDiag.diagName,
          diagNameSuffix: this.diagNameSuffix,
          diagNamePrefix: this.diagNamePrefix
        });
        this.diagNameSuffix = "";
        this.diagNamePrefix = "";
        this.zdAddPopup = false;

        console.log(this.selectOptList)
      },
      closeZdEdit() {
        for (let i = 0; i < this.selectOptList.length; i++) {
          let item = this.selectOptList[i];
          if (item.diagId == this.selectDiag.diagId) {
            this.$set(this.selectOptList, i, this.selectDiag);
          }
        }
        this.selectDiag = {};
        this.zdEditPopup = false;
      },
      //编辑诊断
      editZd(item, index) {
        this.zdEditPopup = true;
        this.selectDiag = item;
        this.selectIndex = index;
      },
      // 选择诊断
      selectThisZd(item) {
        console.log(item);
        var arr = [],
          arr1 = [];
        var x = -1;
        if (this.selectOptList.length > 0) {
          for (let m = 0; m < this.selectOptList.length; m++) {
            const element = this.selectOptList[m].diagName;
            arr1.push(element);
          }
          x = arr1.indexOf(item.diagName);
        }
        console.log(x)
        if (x > -1) {
          Toast("已存在该诊断，请勿重复添加");
          return;
        } else {
          this.showPicker = false;
          setTimeout(() => {
            this.zdAddPopup = true;
            this.selectDiag = item;
          }, 500)
        }
      },
      searchDiag() {
        this.zdQuery.page = 1;
        this.finished = false;
        this.getOptList();
      },
      // 获取诊断开方
      getOptList() {
        if (this.searchVal) {
          this.zdQuery.diagName = this.searchVal;
        } else {
          this.zdQuery.diagName = "";
        }
        findByName(this.zdQuery).then(res => {
          var data = res.data;
          this.zdQuery.size = res.data.total / this.zdQuery.limit;
          this.loading = false;
          if (this.zdQuery.page == 1) {
            this.zdQuery.page = 1;
            this.diags = res.data.rows;
            console.log(this.diags)
          } else {
            this.diags = this.diags.concat(res.data.rows);
            this.loading = false;
          }
          console.log(this.zdQuery.page, this.zdQuery.size);
          if (this.zdQuery.page >= this.zdQuery.size) {
            this.finished = true; // 若数据已全部获取完毕
            return;
          }
          this.zdQuery.page++;
        });
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
      // 显示处方用法选项
      showCfyfFun(type, index) {
        this.index = index;
        if (type == "cf") {
          this.showCfyf = true;
        } else if (type == "dj") {
          this.showDj = true;
        }
      },
      // 处方用法选择完之后提交
      oncfConfirm(val) {
        this.showCfyf = false;
        this.herbArr[this.index].dduName = val;
      },
      // 删除选择的诊断
      delOpt(index) {
        this.selectOptList.splice(index, 1);
      },
      // 打开药品列表
      openDrug(index, idx) {
        this.showAction = false;
        if (index.name) {
          var name = index.name;
          index = idx;
          idx = name;
        }
        this.$router.push({
          name: "drugList",
          query: {
            index: index,
            idx: idx,
            type: 0 //0为处方诊断，1 添加常用处方
          }
        });
      },
      // 保存处方
      savePre() {
        if (this.selectOptList.length == 0) {
          Toast("请输入临床诊断");
          return;
        }
        if (this.medicineList.length == 0 && this.herbList.length == 0 && this.foodList.length == 0) {
          Toast("至少添加一个西药或者中药的处方");
          return;
        }
        for (var i = 0; i < this.herbList.length; i++) {
          if (this.herbArr[i].pay == "" || this.herbArr[i].day == "") {
            Toast("草药的付数和天数不能为空");
            return;
          }
          for (var j = 0; j < this.herbList[i].length; j++) {
            this.herbList[i][j].quan = this.herbList[i][j].sendNum + "";
            this.herbList[i][j].eachQuan = this.herbList[i][j].sendNum + "";
            this.herbList[i][j].eachUnit = this.herbList[i][j].jldw;
            this.herbList[i][j].genericName = this.herbList[i][j].drugName;
            this.herbList[i][j].itemName = this.herbList[i][j].drugName;
            this.herbList[i][j].itemId = this.herbList[i][j].drugId;
            this.herbList[i][j].price = this.herbList[i][j].price + "";
            this.herbList[i][j].dduName = this.herbList[i][j].pcjf;
          }
        }
        let arr = [];
        let diags = this.selectOptList;
        let arrb = [];
        for (var i = 0; i < this.medicineList.length; i++) {
          for (var j = 0; j < this.medicineList[i].length; j++) {
            this.medicineList[i][j].quan = this.medicineList[i][j].sendNum + "";
            this.medicineList[i][j].eachQuan = this.medicineList[i][j].dosage;
            this.medicineList[i][j].eachUnit = this.medicineList[i][j].jldw;
            this.medicineList[i][j].genericName = this.medicineList[i][
              j
              ].drugName;
            this.medicineList[i][j].itemName = this.medicineList[i][j].drugName;
            this.medicineList[i][j].itemId = this.medicineList[i][j].drugId;
            this.medicineList[i][j].price = this.medicineList[i][j].price + "";
            // delete this.medicineList[i][j].sendNum
            delete this.medicineList[i][j].jldw;
            delete this.medicineList[i][j].drugName;
            delete this.medicineList[i][j].drugId;
            delete this.medicineList[i][j].dosage;
          }
        }

        for (var i = 0; i < this.foodList.length; i++) {
          for (var j = 0; j < this.foodList[i].length; j++) {
            this.foodList[i][j].quan = this.foodList[i][j].sendNum + "";
            this.foodList[i][j].eachQuan = this.foodList[i][j].dosage;
            this.foodList[i][j].eachUnit = this.foodList[i][j].jldw;
            this.foodList[i][j].genericName = this.foodList[i][
              j
              ].drugName;
            this.foodList[i][j].itemName = this.foodList[i][j].drugName;
            this.foodList[i][j].itemId = this.foodList[i][j].drugId;
            this.foodList[i][j].price = this.foodList[i][j].price + "";

            delete this.foodList[i][j].jldw;
            delete this.foodList[i][j].drugName;
            delete this.foodList[i][j].drugId;
            delete this.foodList[i][j].dosage;
          }
        }

        for (var i = 0; i < this.medicineList.length; i++) {
          arr.push({
            details: this.medicineList[i],
            proPrescriptionMaster: {
              copyPre: "0",
              prescriptionType: "1"
            }
          });
        }

        for (var i = 0; i < this.foodList.length; i++) {
          arr.push({
            details: this.foodList[i],
            proPrescriptionMaster: {
              copyPre: "0",
              prescriptionType: "4"
            }
          });
        }

        for (var i = 0; i < this.herbList.length; i++) {
          var isDj = 0;
          if (this.herbArr[i].decoct == "是") {
            isDj = 1;
          } else if (this.herbArr[i].decoct == "否") {
            isDj = 0;
          }
          arrb.push({
            details: this.herbList[i],
            proPrescriptionMaster: {
              copyPre: "0",
              danjiNum: this.herbArr[i].dose,
              days: this.herbArr[i].day,
              dduName: this.herbArr[i].dduName,
              dodeptId: null,
              dodeptName: null,
              herbalNum: this.herbArr[i].pay,
              isDj: isDj,
              prescriptionType: "3",
              rc: this.herbArr[i].rc,
              rj: this.herbArr[i].rj,
              status: "0"
            }
          });
        }
        var prescriptions = arr.concat(arrb);
        var pro = this.proBusinessInfo;
        if (this.type == 2) {
          let is_check_prescription = myJsTools.getItem("global_config")
            .is_check_prescription;
          if (is_check_prescription == 0) {
            pro.status = "3";
          } else {
            pro.status = "2";
          }
        }
        if (this.businessCode) {
          pro.businessId = this.businessId;
          pro.businessCode = this.businessCode;
        }

        var data = {
          proBusinessInfo: pro,
          diags: diags,
          prescriptions: prescriptions
        };
        savePrescription(data).then(res => {
          this.$store.commit("setMedicineList", []);
          this.$store.commit("setHerbList", []);
          this.$store.commit("setFoodList", []);
          this.$store.commit("setHerbArr", []);
          this.$store.commit("UPDATE_KEEP_ALIVE", {
            keepAlive: "editCf",
            type: 1
          });
          this.$router.go(-2);
        });
      },
    }
  };
</script>

<style lang="less" scoped>


  .fixedDiv {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
  }

  /deep/ .van-popup--right {
    top: 0;
    right: 0;
    -webkit-transform: none;
    transform: none;
  }

  .defaultHeader {
    display: flex;
    width: 100%;
    background: #ffffff;
    line-height: 30px;

    .title {
      color: #333333;
      font-weight: 700;
      font-size: 18px;
      padding: 7px 0;
      text-align: center;
      width: 90%;
    }

    .backIcon {
      width: 24px;
      height: 24px;
      padding: 10px 0px 10px 15px;
    }

    img {
      width: 22px;
      height: 22px;
      padding: 14px 16px;
    }
  }

  .searchDiv {
    display: flex;
    width: 100%;
    background: #ffffff;
    font-size: 14px;

    .searchIcon {
      width: 22px;
      height: 22px;
      padding: 10px 16px;
    }

    span {
      color: #14a0e6;
      font-size: 12px;
      line-height: 18px;
      padding: 12px 0 12px 11px;
    }

    .searchField {
      width: 70%;

      .van-field {
        width: 100%;
      }
    }

    div {
      input {
        width: 100%;
      }
    }
  }

  .diagName {
    padding: 14px 0;
    margin: 0 31px;
    border-bottom: 0.5px solid #eeeeee;
    color: #333333;
    font-size: 16px;
    line-height: 22px;
  }

  .addPre {
    background: #f5f5f5;
    padding: 12px 11px;
    height: 70vh;
    overflow: scroll;

    .diagnosis {
      background: #fff;
      padding: 9px 16px 21px 16px;
      text-align: left;
      color: #333333;
      border-radius: 4px;
      font-size: 14px;
      line-height: 20px;

      .selectOpt {
        margin-top: 13px;

        .notSelect {
          line-height: 20px;
          margin-top: 24px;
          text-align: center;
          vertical-align: middle;
          font-weight: 700;

          .addZdIcon {
            width: 20px;
            height: 20px;
            margin-left: 6px;
            display: inline-block;
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .selectOptSpan {
          display: flex;
          position: relative;
          align-items: center;
          border-radius: 2px;
          color: #999999;
          padding: 8px;
          background: #f6f8fb;
          margin-bottom: 12px;

          div {
            width: 90%;
          }
        }

        .editZdIcon {
          width: 20px;
          height: 20px;
        }
      }
    }

    .cfList {
      background: @white;
      padding: 12px;
      border-radius: 4px;
      margin-top: 12px;
      .black-font;
      .font-size-md;

      .title {
        display: flex;
        line-height: 22px;
        justify-content: space-between;
        .font-blod-2;
      }

      .oneCfCard {
        .drugName {
          .font-blod-2;
          margin-top: 12px;
        }

        .dduName {
          margin-top: 15px;
          padding-left: 12px;
        }

        .price {
          margin-top: 15px;
          padding-left: 12px;
          .display-div;
        }

        .memo {
          padding-left: 12px;
          margin-top: 15px;
        }

        .onceCardBtn button {
          border: none;
          width: 49%;
          line-height: 33px;
          background: @gray;
          border-radius: 4px;
          margin-top: 15px;
        }

        .line {
          display: block;
          height: 1px;
          border-top: 1px dashed @gray;
          margin-top: 12px;
        }
      }

      .conAdd {
        border: none;
        width: 100%;
        line-height: 52px;
        background: @white;
        padding-left: 5px;
        margin-top: 9px;
        .font-login-color-blue;
        .font-size-lg;
        .font-blod;
        vertical-align: middle;

        span {
          vertical-align: middle;
        }
      }
    }

    .addCfIcon {
      .icon-width-height-sm;
      display: inline-block;
      vertical-align: middle;
    }

    .friedPopup {
      padding: 20px;
      width: 70%;
      text-align: center;

      .title {
        color: #333333;
        font-size: 16px;
        line-height: 23px;
      }

      .tipsInfo {
        margin-top: 28px;
        color: #333333;
        font-size: 12px;
        line-height: 17px;
      }

      .friedBtns {
        margin-top: 36px;
        display: flex;
        text-align: center;

        button {
          width: 45%;
          font-size: 16px;
          line-height: 34px;
          border: 1px solid #14a0e6;
          border-radius: 23px;
          display: inline-block;
        }

        :nth-child(1) {
          background: #ffffff;
          color: #14a0e6;
        }

        :nth-child(2) {
          background: #14a0e6;
          color: #ffffff;
          margin-left: 10px;
        }
      }
    }
  }

  .btns {
    position: fixed;
    bottom: 0px;
    width: 100%;
    display: flex;
    font-size: 14px;
    line-height: 49px;
    padding-left: 13px;
    background: #f5f5f5;
    padding: 16px;
    // margin-top: 12px;

    button {
      width: 45%;
      border-radius: 4px;
      border-radius: 25px;
      font-weight: bold;
    }

    .addBtn {
      border: 1px solid #14a0e6;
      color: #14a0e6;
    }

    .saveBtn {
      border: none;
      color: #fff;
      background: #14a0e6;
      margin: 0 9px;
    }
  }

  .practice {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 11px;

    .van-row {
      width: 100%;
      font-size: 14px;
      color: #333333;
      font-weight: 600;
      margin-bottom: 18px;

      .van-cell {
        padding: 0px;
        background: #f2f2f2;
        text-align: center;
        width: 75%;
        margin-left: 20px;
      }

      /deep/ .van-field__control {
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

  .overstriking {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
  }

  .practice li input,
  .practice li select {
    width: 60px;
    line-height: 20px;
    font-size: 14px;
  }

  .practice p {
    padding: 5px 0;
  }

  .totalPrice {
    text-align: right;
    padding: 10px 25px;
    font-size: 14px;
    font-weight: 700;
    .font-login-color-red;
  }

  .paramMs {
    display: flex;
    flex-wrap: nowrap;
  }

  /deep/ .van-cell {
    width: 45%;
    font-size: 12px;
  }

  .oneCfCard /deep/ .van-cell {
    width: 45%;
    font-size: 12px;
  }

  .diagnosis /deep/ .van-cell {
    padding: 10px 0px;
    font-size: 14px;
  }

  .van-stepper {
    margin-top: 4px;
  }

  /deep/ .van-stepper--round .van-stepper__minus {
    color: #d8d8d8;
    background-color: #fff;
    border: 1px solid #d8d8d8;
    opacity: 1;
    margin-right: 5px;
  }

  /deep/ .van-stepper--round .van-stepper__plus {
    color: #fff;
    background-color: #14a0e6;
    margin-left: 5px;
  }

  /deep/ .van-stepper--round .van-stepper__input {
    background: #f2f2f2;
    width: 75%;
    padding: 12px 0;
  }

  .selectIcon {
    width: 14px;
    height: 14px;
    margin-top: 5px;
    margin-left: 5px;
  }

  .zdEditPopup {
    width: 80%;
    background: @white;
    padding: 16px;
    text-align: center;

    .popup-title {
      margin-bottom: 24px;
    }

    .zdName {
      padding: 12px 0;
    }

    .van-cell {
      line-height: 18px;
      padding: 8px;
      font-size: @font-size-sm-2;
      background: @field-back;
      border-radius: 4px;
      border: none;
      width: 100%;
      height: 52px;
    }

    .commitBtn {
      margin: 24px auto 0;
    }
  }
</style>
