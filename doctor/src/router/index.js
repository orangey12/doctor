import Vue from "vue";
import Router from "vue-router";
import myJsTools from "../utils/myJsTools";
// 初始化
const initPage = () => import("@/components/initPage/index");
//登录
const login = () => import("@/components/login/index");
//注册
const registerDoc = () => import("@/components/login/registerDoc");
//服务协议界面
const protocol = () => import("@/components/login/protocol");
// 设置密码/修改密码
const setPass = () => import("@/components/login/setPass");
// 首页
const mainIndex = () => import("@/components/docList/index");
//处方池
const prePool = () => import("@/components/docList/prePool");
//医助处方
const medicalCf = () => import("@/components/docList/medicalCf");
//图片链接
const imgLink = () => import("@/components/docList/imgLink");
// 系统通知列表
const adminList = () => import("@/components/docList/adminList");
//处方池详情
const prePoolDetail = () => import("@/components/docList/prePoolDetail");
//已响应详情
const orderDetail = () => import("@/components/docList/orderDetail");
// 通知详情
const adminMsgDetail = () => import("@/components/docList/adminMsgDetail");
//搜索页面
const searchIndex = () => import("@/components/docList/searchIndex");
// 邀请用户
const inviteUser = () => import("@/components/docList/inviteUser");
// 我的预约
const appointment = () => import("@/components/appointment/index");
// 预约 问诊详情
const appYy = () => import("@/components/appointment/appYy");
// 本次处方
const thisPrescription = () => import("@/components/appointment/prescription");
// 本次处方待审核及已通过详情
const waitPassPerSetail = () =>
  import("@/components/appointment/waitPassPerSetail");
// 本次处方详情
const prescDetail = () => import("@/components/appointment/prescDetail");
//查看电子处方
const electronicPrescription = () =>
  import("@/components/prescription/electronicPrescription");
// 修改处方
const editCf = () => import("@/components/appointment/editCf");
// 用药理由
const medicationReason = () =>
  import("@/components/appointment/medicationReason");
// 资料服务
const information = () => import("@/components/appointment/information");
//新消息通知
const patientNews = () => import("@/components/appointment/patientNews");
//处方可见患者
const patientCfIsSee = () => import("@/components/appointment/patientCfIsSee");
// 设置黑名单
const setBlacklist = () => import("@/components/appointment/setBlacklist");
//本次检查单
const thisCheckList = () => import("@/components/appointment/thisCheckList");
//本次检验
const thisLis = () => import("@/components/lis/thisLis");
// 基本情况
const basicSituation = () => import("@/components/appointment/basicSituation");
//问诊记录
const patientScaleApp = () =>
  import("@/components/appointment/patientScaleApp");
//历史记录
const historyChat = () => import("../components/chat/historyChat");
// 查看诊疗笔记
const medicalNotes = () => import("@/components/appointment/medicalNotes");
//线下电子病历详情
const offLineRecord = () => import("@/components/appointment/offLineRecord");
// 添加诊疗笔记
const addMedicalNotes = () =>
  import("@/components/appointment/addMedicalNotes");
// 给患者选择分组
const patientGroup = () => import("@/components/group/index");
// 新建患者
const addGroup = () => import("@/components/group/addGroup");
// 聊天
const chatIndex = () => import("@/components/chat/index");
//漫游记录
const roamChat = () => import("@/components/chat/roamChat");
// 咨询小结
const consultationSummary = () =>
  import("@/components/appointment/consultationSummary");
// 预约 线下
const onLineCard = () => import("@/components/chat/onLineCard");
// 预约 线上
const lineCard = () => import("@/components/chat/lineCard");
// 添加处方
const prescription = () => import("@/components/prescription/index");
//处方预览
const prescriptionPreview = () =>
  import("@/components/prescription/prescriptionPreview");
//正在问诊中的患者
const nowPatient = () => import("@/components/prescription/nowPatient");
//设置草药用法用量
const setDrugUsage = () => import("@/components/prescription/setDrugUsage");
// 药品列表
const drugList = () => import("@/components/prescription/drugList");
//模板开方
const templatePre = () => import("@/components/prescription/templatePre");
// 添加西药
const addxy = () => import("@/components/prescription/addxy");
// 添加草药
const addcy = () => import("@/components/prescription/addcy");
// 历史处方新增药品
const addDrug = () => import("@/components/prescription/addDrug");
//常用处方新增药品
const addUsedDrug = () => import("@/components/prescription/addUsedDrug");
// 我的（首页）
const myIndex = () => import("@/components/my/index");
//我的 个人中心
const personalCenter = () => import("@/components/my/personalCenter");
// 设置标签
const setLabel = () => import("@/components/my/setLabel");
//修改密码
const editPhone = () => import("@/components/my/editPhone");
// 互联网医院备案
const recordInformation = () => import("@/components/my/recordInformation");
// 我的审方
const myAuditor = () => import("@/components/my/myAuditor");
// 我的处方
const myRecipel = () => import("@/components/my/myRecipel");
//我的药品
const myDrug = () => import("@/components/my/myDrug");
//药品说明书
const myDrugInstruction = () => import("@/components/my/myDrugInstruction");
//我的历史处方
const myHisRecipel = () => import("@/components/my/myHisRecipel");
//药品销售汇总
const drugSales = () => import("@/components/my/drugSales");
//历史处方待支付详情
const waitPay = () => import("@/components/prescription/waitPay");
//自主线下购药详情
const offLinepay = () => import("@/components/prescription/offlinepay");
//历史处方已支付和已退费详情
const payPre = () => import("@/components/prescription/payPre");
// 新增常用处方
const addUsedCf = () => import("@/components/my/addUsedCf");
// 我的历史处方详情页面
const historyCfDetail = () => import("@/components/my/historyCfDetail");
// 设置（我的）
const myFit = () => import("@/components/my/myFit");
//我的检验l
const myLis = () => import("@/components/my/myLis");
//我的检查
const myCheck = () => import("@/components/my/myCheck");
// 新消息通知（设置）
const myFitNews = () => import("@/components/my/myFitNews");
// 修改密码（设置）
const myFitPass = () => import("@/components/my/myFitPass");
//意见反馈
const feedback = () => import("@/components/mySet/feedback");
//意见反馈完成
const feedbackFinish = () => import("@/components/mySet/feedbackFinish");
//注销申请
const cancellation = () => import("@/components/mySet/cancellation");
//我的收益
const myEarnings = () => import("@/components/my/myEarnings");
//我的收益明细
const myEarningDetail = () => import("@/components/my/myEarningDetail");
//我的月收益明细
const myMounthEarning = () => import("@/components/my/myMounthEarning");
// 我的患者
const patientIndex = () => import("@/components/patientGroup/index");
// 我的出诊
const myVisit = () => import("@/components/myVisit/index");
// 新增排班
const newShift = () => import("@/components/myVisit/newShift");
// 新增线下排班
const offlineNewShift = () => import("@/components/myVisit/offlineNewShift");
// 编辑排班
const editVisit = () => import("@/components/myVisit/editVisit");
// 我的出诊模板
const visitTemplate = () => import("@/components/myVisit/visitTemplate");
// 我的线下出诊模板
const offlineVisitTemplate = () =>
  import("@/components/myVisit/offlineVisitTemplate");
// 我的患者(我的分组)
const myGroupsIndex = () => import("@/components/myGroups/index");
// 我的患者(我的分组-编辑分组)
const editGroups = () => import("@/components/myGroups/editGroups");
// 我的患者(我的分组-编辑分组-添加患者)
const editGroupsAdd = () => import("@/components/myGroups/editGroupsAdd");
// 我的患者(我的分组-新建分组)
const myGroupCreate = () => import("@/components/myGroups/myGroupCreate");
// 我的患者(我的分组-新建分组-添加患者)
const myAddPatient = () => import("@/components/myGroups/myAddPatient");
// 群发
const fsendIndex = () => import("@/components/fsend/index");
// 新建群发
const newsFsend = () => import("@/components/fsend/newsFsend");
// 选择患者
const selectFsend = () => import("@/components/fsend/selectFsend");
// 预览内容
const fsendLook = () => import("@/components/fsend/fsendLook");
// 图文转发
const pictureIndex = () => import("@/components/picture/index");
// 图文转发(创建新的聊天)
const newsConnect = () => import("@/components/picture/newsConnect");
// 图文转发(选择分组)
const selectSort = () => import("@/components/picture/selectSort");
// 图文转发(点击查看发送列表)
const lookHead = () => import("@/components/picture/lookHead");
// 量表
const scaleIndex = () => import("@/components/scale/index");
// 新建量表
const newScale = () => import("@/components/scale/newScale");
// 创建量表  添加题目
const newScaleContent = () => import("@/components/scale/newScaleContent");
//新增题目
const topic = () => import("@/components/scale/topic");
//选择已有模板列表
const scaleList = () => import("@/components/scale/scaleList");
// 量表详情
const scaleDetail = () => import("@/components/scale/scaleDetail");
//历史详情
const historyDetail = () => import("@/components/scale/historyDetail");
// 未反馈已反馈
const patientScale = () => import("@/components/scale/patientScale");
// 发送量表
const sendScale = () => import("@/components/chat/sendScale");
// 发送量表详情
const sendScaleDetail = () => import("@/components/chat/sendScaleDetail");
// 问诊单详情患者量表详情
const patientScaleList = () => import("@/components/scale/patientScaleList");

//随访计划
const followUpIndex = () => import("@/components/followUp/index");
//新增随访计划
const addFollowUp = () => import("@/components/followUp/addFollowUp");
//预览随访计划
const previewFollow = () => import("@/components/followUp/previewFollow");
//随访计划详情
const followDetail = () => import("@/components/followUp/followDetail");
// 随访详情
const followPatientList = () =>
  import("@/components/followUp/followPatientList");
//随访计划待执行详情
const hisPlanDetail = () => import("@/components/followUp/hisPlanDetail");
//随访计划已执行详情
const hascarriedPlan = () => import("@/components/followUp/hascarriedPlan");
//审方首页
const trialPartyIndex = () => import("@/components/trialParty/index");
//自动审方
const preAuto = () => import("@/components/trialParty/preAuto");
//审方我的
const pharmacistFoo = () => import("@/components/trialParty/pharmacistFoo");
//审方待审核详情
const pharmWait = () => import("@/components/trialParty/pharmWait");
//审核通过详情
const pharmDetail = () => import("@/components/trialParty/pharmDetail");
//审方不通过
const noPass = () => import("@/components/trialParty/noPass");
//不通过理由选择
const noPassChoose = () => import("@/components/trialParty/noPassChoose");
//诊疗记录详情
const recordDetail = () => import("@/components/trialParty/recordDetail");
//审核通过详情
// const passDetail = () => import("@/components/trialParty/passDetail");
//转诊
const referral = () => import("@/components/chat/referral");
//转诊设置
const zzSet = () => import("@/components/my/zzSet");
//隐私设置
const qxPage = () => import("@/components/my/qxPage");
//签到
const signIn = () => import("@/components/my/signIn");
//我的服务
const serviceIndex = () => import("@/components/myService/index");
//我的自定义服务
const myServiceList = () => import("@/components/myService/myServiceList");
//添加自定义服务
const addService = () => import("@/components/myService/addService");
//发送自定义服
const sendService = () => import("@/components/chat/sendService");
//我的咨询
const myAdvisory = () => import("@/components/myService/myAdvisory");
//自定义服务详情
const serviceDetail = () => import("@/components/myService/serviceDetail");
//处方可见设置
const cfIsSee = () => import("@/components/myService/cfIsSee");
//诊断开方设置
const setDiagnosis = () => import("@/components/myService/setDiagnosis");
//自定义服务历史记录
const serviceHistory = () => import("@/components/appointment/serviceHistory");
//个性化服务设置
const personalService = () =>
  import("@/components/appointment/personalService");
//随访计划
const patientFollowUp = () =>
  import("@/components/appointment/patientFollowUp");
//随访计划详情
const followUpDetail = () => import("@/components/appointment/followUpDetail");
//我的复诊
const myFollowUp = () => import("@/components/myService/myFollowUp");
//关于
const appAbout = () => import("@/components/my/appAbout");
//开检查单
const addCheck = () => import("@/components/checklist/index");
//机构名称
const mechanism = () => import("@/components/checklist/mechanism");
//开检验单
const addLis = () => import("@/components/lis/index");
//机构名称
const mechanismLis = () => import("@/components/lis/mechanismLis");
//检查单详情
const checkDetail = () => import("@/components/checklist/checkDetail");
//检验单详情
const lisDetail = () => import("@/components/lis/lisDetail");
//我的好友-首页
const myFriendIndex = () => import("@/components/myFriend/index");
//我的团队
const myTeam = () => import("@/components/myFriend/myTeam");
//我的团队-我的好友
const friendList = () => import("@/components/myFriend/friendList");
//我的团队-我的医疗好友
const medicalBuddy = () => import("@/components/myFriend/medicalBuddy");
//新加好友-待验证
const verifiedFriend = () => import("@/components/myFriend/verifiedFriend");
//好友申请
const friendRequests = () => import("@/components/myFriend/friendRequests");
//医生详细信息
const docInfo = () => import("@/components/myFriend/docInfo");
//转诊设置
const setReferral = () => import("@/components/myFriend/setReferral");
//电子病历
const electronicRecord = () => import("@/components/electronicRecord/index");
//电子病历记录详情
const eleRecordDetail = () =>
  import("@/components/electronicRecord/eleRecordDetail");
//医生认真
const authentication = () => import("@/components/authentication/index");
//医生认证下一步
const docAuthImg = () => import("@/components/authentication/docAuthImg");
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: to => {
        // 方法接收 目标路由 作为参数
        // return 重定向的 字符串路径/路径对象
        // if (myJsTools.getItem("firstInit") != '2') {
        //   return "initPage"
        // } else {
        if (
          myJsTools.getItem("docInfo") == "doc" ||
          myJsTools.getItem("docInfo") == "all"
        ) {
          return "mainIndex";
        } else {
          return "trialPartyIndex";
        }
        // }
      }
    },
    {
      path: "/initPage",
      name: "initPage",
      component: initPage,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/registerDoc",
      name: "registerDoc",
      component: registerDoc,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/protocol",
      name: "protocol",
      component: protocol,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/setPass",
      name: "setPass",
      component: setPass,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/mainIndex",
      name: "mainIndex",
      component: mainIndex,
      meta: {keepAlive: false, requireAuth: true},
      beforeEnter: (to, from, next) => {
        if (myJsTools.getItem("token_info")) {
          next();
        } else {
          next("/login");
        }
      }
    },
    {
      path: "/imgLink",
      name: "imgLink",
      component: imgLink,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/prePool",
      name: "prePool",
      component: prePool,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/medicalCf",
      name: "medicalCf",
      component: medicalCf,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/prePoolDetail",
      name: "prePoolDetail",
      component: prePoolDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/orderDetail",
      name: "orderDetail",
      component: orderDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/adminList",
      name: "adminList",
      component: adminList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/adminMsgDetail",
      name: "adminMsgDetail",
      component: adminMsgDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/searchIndex",
      name: "searchIndex",
      component: searchIndex,
      meta: {keepAlive: false, requireAuth: true}
    },

    {
      path: "/inviteUser",
      name: "inviteUser",
      component: inviteUser,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/appointment",
      name: "appointment",
      component: appointment,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/information",
      name: "information",
      component: information,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientNews",
      name: "patientNews",
      component: patientNews,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientCfIsSee",
      name: "patientCfIsSee",
      component: patientCfIsSee,
      meta: {keepAlive: false, requireAuth: true}
    },

    {
      path: "/setBlacklist",
      name: "setBlacklist",
      component: setBlacklist,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/basicSituation",
      name: "basicSituation",
      component: basicSituation,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/historyChat",
      name: "historyChat",
      component: historyChat,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/medicalNotes",
      name: "medicalNotes",
      component: medicalNotes,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addMedicalNotes",
      name: "addMedicalNotes",
      component: addMedicalNotes,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/appYy",
      name: "appYy",
      component: appYy,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/thisPrescription",
      name: "thisPrescription",
      component: thisPrescription,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/waitPassPerSetail",
      name: "waitPassPerSetail",
      component: waitPassPerSetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/prescDetail",
      name: "prescDetail",
      component: prescDetail,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/electronicPrescription",
      name: "electronicPrescription",
      component: electronicPrescription,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/editCf",
      name: "editCf",
      component: editCf,

      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/medicationReason",
      name: "medicationReason",
      component: medicationReason,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientGroup",
      name: "patientGroup",
      component: patientGroup,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addGroup",
      name: "addGroup",
      component: addGroup,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/chat",
      name: "chatIndex",
      component: chatIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/roamChat",
      name: "roamChat",
      component: roamChat,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/lineCard",
      name: "lineCard",
      component: lineCard,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/onLineCard",
      name: "onLineCard",
      component: onLineCard,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/prescription",
      name: "prescription",
      component: prescription,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/prescriptionPreview",
      name: "prescriptionPreview",
      component: prescriptionPreview,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/nowPatient",
      name: "nowPatient",
      component: nowPatient,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/setDrugUsage",
      name: "setDrugUsage",
      component: setDrugUsage,
      meta: {keepAlive: false, requireAuth: true}
    },

    {
      path: "/drugList",
      name: "drugList",
      component: drugList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addxy",
      name: "addxy",
      component: addxy,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addcy",
      name: "addcy",
      component: addcy,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addDrug",
      name: "addDrug",
      component: addDrug,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addUsedDrug",
      name: "addUsedDrug",
      component: addUsedDrug,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myIndex",
      name: "myIndex",
      component: myIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/setLabel",
      name: "setLabel",
      component: setLabel,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/editPhone",
      name: "editPhone",
      component: editPhone,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/recordInformation",
      name: "recordInformation",
      component: recordInformation,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/personalCenter",
      name: "personalCenter",
      component: personalCenter,
      meta: {keepAlive: true, requireAuth: true}
    },

    {
      path: "/myAuditor",
      name: "myAuditor",
      component: myAuditor,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myRecipel",
      name: "myRecipel",
      component: myRecipel,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myDrug",
      name: "myDrug",
      component: myDrug,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/myDrugInstruction",
      name: "myDrugInstruction",
      component: myDrugInstruction,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myHisRecipel",
      name: "myHisRecipel",
      component: myHisRecipel,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/drugSales",
      name: "drugSales",
      component: drugSales,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/waitPay",
      name: "waitPay",
      component: waitPay,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/offLinepay",
      name: "offLinepay",
      component: offLinepay,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/payPre",
      name: "payPre",
      component: payPre,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addUsedCf",
      name: "addUsedCf",
      component: addUsedCf,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/historyCfDetail",
      name: "historyCfDetail",
      component: historyCfDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myFit",
      name: "myFit",
      component: myFit,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myLis",
      name: "myLis",
      component: myLis,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myCheck",
      name: "myCheck",
      component: myCheck,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myFitNews",
      name: "myFitNews",
      component: myFitNews,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myFitPass",
      name: "myFitPass",
      component: myFitPass,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myEarnings",
      name: "myEarnings",
      component: myEarnings,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myEarningDetail",
      name: "myEarningDetail",
      component: myEarningDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myMounthEarning",
      name: "myMounthEarning",
      component: myMounthEarning,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientIndex",
      name: "patientIndex",
      component: patientIndex,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/myVisit",
      name: "myVisit",
      component: myVisit,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/newShift",
      name: "newShift",
      component: newShift,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/offlineNewShift",
      name: "offlineNewShift",
      component: offlineNewShift,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/editVisit",
      name: "editVisit",
      component: editVisit,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/visitTemplate",
      name: "visitTemplate",
      component: visitTemplate,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/offlineVisitTemplate",
      name: "offlineVisitTemplate",
      component: offlineVisitTemplate,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/fsendIndex",
      name: "fsendIndex",
      component: fsendIndex,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/newsFsend",
      name: "newsFsend",
      component: newsFsend,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/selectFsend",
      name: "selectFsend",
      component: selectFsend,
      meta: {
        keepAlive: false,
        requireAuth: true
      }
    },
    {
      path: "/fsendLook",
      name: "fsendLook",
      component: fsendLook,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/pictureIndex",
      name: "pictureIndex",
      component: pictureIndex,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/newsConnect",
      name: "newsConnect",
      component: newsConnect,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/selectSort",
      name: "selectSort",
      component: selectSort,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/myGroupsIndex",
      name: "myGroupsIndex",
      component: myGroupsIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/lookHead",
      name: "lookHead",
      component: lookHead,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/editGroups",
      name: "editGroups",
      component: editGroups,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/editGroupsAdd",
      name: "editGroupsAdd",
      component: editGroupsAdd,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myGroupCreate",
      name: "myGroupCreate",
      component: myGroupCreate,
      meta: {
        keepAlive: true,
        requireAuth: true
      }
    },
    {
      path: "/myAddPatient",
      name: "myAddPatient",
      component: myAddPatient,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/consultationSummary",
      name: "consultationSummary",
      component: consultationSummary,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/scaleIndex",
      name: "scaleIndex",
      component: scaleIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/newScale",
      name: "newScale",
      component: newScale,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/newScaleContent",
      name: "newScaleContent",
      component: newScaleContent,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/topic",
      name: "topic",
      component: topic,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/scaleList",
      name: "scaleList",
      component: scaleList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/scaleDetail",
      name: "scaleDetail",
      component: scaleDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/historyDetail",
      name: "historyDetail",
      component: historyDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientScale",
      name: "patientScale",
      component: patientScale,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/sendScale",
      name: "sendScale",
      component: sendScale,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/sendScaleDetail",
      name: "sendScaleDetail",
      component: sendScaleDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientScaleList",
      name: "patientScaleList",
      component: patientScaleList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/followUpIndex",
      name: "followUpIndex",
      component: followUpIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addFollowUp",
      name: "addFollowUp",
      component: addFollowUp,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/previewFollow",
      name: "previewFollow",
      component: previewFollow,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/followDetail",
      name: "followDetail",
      component: followDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/followPatientList",
      name: "followPatientList",
      component: followPatientList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/hisPlanDetail",
      name: "hisPlanDetail",
      component: hisPlanDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/hascarriedPlan",
      name: "hascarriedPlan",
      component: hascarriedPlan,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/trialPartyIndex",
      name: "trialPartyIndex",
      component: trialPartyIndex,
      meta: {keepAlive: false, requireAuth: true},
      beforeEnter: (to, from, next) => {
        if (myJsTools.getItem("token_info")) {
          next();
        } else {
          next("/login");
        }
      }
    },
    {
      path: "/pharmacistFoo",
      name: "pharmacistFoo",
      component: pharmacistFoo,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/preAuto",
      name: "preAuto",
      component: preAuto,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/pharmWait",
      name: "pharmWait",
      component: pharmWait,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/pharmDetail",
      name: "pharmDetail",
      component: pharmDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/noPass",
      name: "noPass",
      component: noPass,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/noPassChoose",
      name: "noPassChoose",
      component: noPassChoose,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/recordDetail",
      name: "recordDetail",
      component: recordDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/referral",
      name: "referral",
      component: referral,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/zzSet",
      name: "zzSet",
      component: zzSet,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/signIn",
      name: "signIn",
      component: signIn,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/qxPage",
      name: "qxPage",
      component: qxPage,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/serviceIndex",
      name: "serviceIndex",
      component: serviceIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myServiceList",
      name: "myServiceList",
      component: myServiceList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addService",
      name: "addService",
      component: addService,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/sendService",
      name: "sendService",
      component: sendService,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myAdvisory",
      name: "myAdvisory",
      component: myAdvisory,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/serviceDetail",
      name: "serviceDetail",
      component: serviceDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/cfIsSee",
      name: "cfIsSee",
      component: cfIsSee,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/setDiagnosis",
      name: "setDiagnosis",
      component: setDiagnosis,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/serviceHistory",
      name: "serviceHistory",
      component: serviceHistory,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/personalService",
      name: "personalService",
      component: personalService,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myFollowUp",
      name: "myFollowUp",
      component: myFollowUp,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/appAbout",
      name: "appAbout",
      component: appAbout,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addCheck",
      name: "addCheck",
      component: addCheck,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/mechanism",
      name: "mechanism",
      component: mechanism,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/addLis",
      name: "addLis",
      component: addLis,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/mechanismLis",
      name: "mechanismLis",
      component: mechanismLis,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/checkDetail",
      name: "checkDetail",
      component: checkDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/lisDetail",
      name: "lisDetail",
      component: lisDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/thisCheckList",
      name: "thisCheckList",
      component: thisCheckList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/thisLis",
      name: "thisLis",
      component: thisLis,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myFriendIndex",
      name: "myFriendIndex",
      component: myFriendIndex,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/myTeam",
      name: "myTeam",
      component: myTeam,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/friendList",
      name: "friendList",
      component: friendList,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/medicalBuddy",
      name: "medicalBuddy",
      component: medicalBuddy,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/verifiedFriend",
      name: "verifiedFriend",
      component: verifiedFriend,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/friendRequests",
      name: "friendRequests",
      component: friendRequests,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/electronicRecord",
      name: "electronicRecord",
      component: electronicRecord,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/docInfo",
      name: "docInfo",
      component: docInfo,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/eleRecordDetail",
      name: "eleRecordDetail",
      component: eleRecordDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/setReferral",
      name: "setReferral",
      component: setReferral,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/offLineRecord",
      name: "offLineRecord",
      component: offLineRecord,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/authentication",
      name: "authentication",
      component: authentication,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/docAuthImg",
      name: "docAuthImg",
      component: docAuthImg,
      meta: {keepAlive: true, requireAuth: true}
    },
    {
      path: "/patientScaleApp",
      name: "patientScaleApp",
      component: patientScaleApp,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/patientFollowUp",
      name: "patientFollowUp",
      component: patientFollowUp,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/followUpDetail",
      name: "followUpDetail",
      component: followUpDetail,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/feedback",
      name: "feedback",
      component: feedback,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/feedbackFinish",
      name: "feedbackFinish",
      component: feedbackFinish,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/cancellation",
      name: "cancellation",
      component: cancellation,
      meta: {keepAlive: false, requireAuth: true}
    },
    {
      path: "/templatePre",
      name: "templatePre",
      component: templatePre,
      meta: {keepAlive: false, requireAuth: true}
    }
  ]
});
