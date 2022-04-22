/**
 * 公共方法封装
 */
const date = {};
import myJsTools from "./myJsTools";
/**
 * 默认获取当前年月，并返回该月的1号 00:00
 * 传入formatMonth(日期：2019-03-05,2019/03/05)，返回该时间的月份的第一天
 */
date.setSTime = function(formatMonth) {
  var formatMonth = formatMonth;
  if (formatMonth) {
    formatMonth = new Date(formatMonth);
  } else {
    formatMonth = new Date();
  }
  var year = formatMonth.getFullYear();
  var month = formatMonth.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  return year + "-" + month + "-01 00:00:00";
};

/**
 * 默认获取当前年月，并返回该月的最后一天的 23:59:59
 * 传入formatMonth(日期：2019-03-05,2019/03/05)，返回该时间的月份的最后一天
 */
date.setNTime = function(formatMonth) {
  var formatMonth = formatMonth;
  if (formatMonth) {
    formatMonth = new Date(formatMonth);
  } else {
    formatMonth = new Date();
  }
  var year = formatMonth.getFullYear();
  var month = formatMonth.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  formatMonth.setMonth(formatMonth.getMonth() + 1);
  formatMonth.setDate(0);
  var day = formatMonth.getDate();
  return year + "-" + month + "-" + day + " " + "23:59:59";
};

/**
 * 返回上个月的改时间
 * 默认为当前时间的上个月
 */
date.prevMonth = function(formatMonth) {
  var formatMonth = formatMonth;
  if (formatMonth) {
    formatMonth = new Date(formatMonth);
  } else {
    formatMonth = new Date();
  }
  formatMonth.setMonth(formatMonth.getMonth() - 1);
  var year = formatMonth.getFullYear();
  var month = formatMonth.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = formatMonth.getDate();
  day = day < 10 ? "0" + day : day;
  var hour = formatMonth.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  var minute = formatMonth.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var s = formatMonth.getSeconds();
  s = s < 10 ? "0" + s : s;
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + s;
};

/**
 * 返回去年的改时间
 */
date.prevYear = function(formatMonth) {
  var formatMonth = formatMonth;
  if (formatMonth) {
    formatMonth = new Date(formatMonth);
  } else {
    formatMonth = new Date();
  }
  formatMonth.setFullYear(formatMonth.getFullYear() - 1);
  var year = formatMonth.getFullYear();
  var month = formatMonth.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = formatMonth.getDate();
  day = day < 10 ? "0" + day : day;
  var hour = formatMonth.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  var minute = formatMonth.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var s = formatMonth.getSeconds();
  s = s < 10 ? "0" + s : s;
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + s;
};

/**
 * 获取当前年月日
 * 传参 style: "/" 返回格式为2019/08/09  "-" 返回格式为2019-08-09
 */
date.getFormatDate = function(style) {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = d.getDate();
  day = day < 10 ? "0" + day : day;
  return year + style + month + style + day;
};

/**
 * 获取当前时间
 */
date.getFormatTime = function() {
  var d = new Date();
  var hour = d.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  var minute = d.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  return hour + ":" + minute;
};

/**
 * 时间戳转换为日期格式
 */
date.add0 = function(m) {
  return m < 10 ? "0" + m : m;
};

// 格式化时间
date.format = function(shijianchuo) {
  var time = new Date(parseInt(shijianchuo));
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    date.add0(m) +
    "-" +
    date.add0(d) +
    " " +
    date.add0(h) +
    ":" +
    date.add0(mm) +
    ":" +
    date.add0(s)
  );
};

/**
 * 返回某一时间相差某一时间段的时间
 * 返回完整的时间  2019-11-30 59:00:00
 */
date.dateDif = function(time, difference) {
  time = new Date(time).getTime() - difference;
  time = date.format(time);
  return time;
};
/**
 * 返回某一时间相差某一时间段的时间
 * 返回年月日  2019-11-30
 */
date.dayDif = function(time, difference) {
  time = new Date(time).getTime() - difference;
  time = date.format(time);
  var timeArr = time.split(" ");
  return timeArr[0].slice(0, 10);
};
/**
 * 返回某一时间之后的一天的时间
 * 返回年月日  2019-11-30
 */
date.dayDifAdd = function(time) {
  console.log(time)
  time = new Date(time).getTime() + 1000 * 30 * 60;
  time = date.format(time);
  var timeArr = time.split(" ");
  return timeArr[1].slice(0, 5);
};
/**
 * 返回某一时间相差某一时间段的时间
 * 返回时分秒  59:00:00
 */
date.timeDif = function(time, difference) {
  time = new Date(time).getTime() - difference;
  time = date.format(time);
  var timeArr = time.split(" ");
  return timeArr[1].slice(0, 5);
};

// 格式化时间
date.getNowTime = function(date) {
  date = new Date(date);
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1;
  let mounth = this.month;
  mounth = mounth<10?("0"+mounth):mounth
  this.date = date.getDate()<10?'0' + date.getDate():date.getDate();
  this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  this.minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  this.second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  this.milliSeconds = date.getMilliseconds();
  var currentTime =
    this.year +
    "-" +
    mounth +
    "-" +
    this.date +
    " " +
    this.hour +
    ":" +
    this.minute +
    ":" +
    this.second;
  return currentTime;
};

// 格式化日期 返回2020-09-08
date.getNowDate = function(date) {
  date = new Date(date);
  this.year = date.getFullYear();
  this.month = date.getMonth() + 1;
  let mounth = this.month;
  mounth = mounth<10?("0"+mounth):mounth
  this.date = date.getDate()<10?'0' + date.getDate():date.getDate();
  this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  this.minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  this.second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  this.milliSeconds = date.getMilliseconds();
  // console.log(mounth);
  var currentTime = this.year + "-" + mounth + "-" + this.date;
  return currentTime;
};

//
date.dateAdd = function(startDate, num) {
  startDate = new Date(startDate);
  startDate = +startDate - 1000 * 60 * 60 * (num * 24);
  startDate = new Date(startDate);
  return (
    startDate.getFullYear() +
    "-" +
    ((startDate.getMonth() + 1) <10?("0" + (startDate.getMonth() + 1)):(startDate.getMonth() + 1)) +
    "-" +
    (startDate.getDate() < 10?("0" + startDate.getDate()):startDate.getDate())
  );
};

// 计算两个时间之间的差，并且与24小时相差多少时间 剩余时间计算，倒计时
date.DateDifference = function(faultDate, endTime,inquiry_duration) {
  console.log(faultDate,endTime);
  var stime = new Date(faultDate).getTime();
  var etime = new Date(endTime).getTime();
  console.log(stime + "------------ " + etime)
  let config = myJsTools.getItem("global_config");
  if(!inquiry_duration){
    if (config) {
      inquiry_duration = config.inquiry_duration;
    } else {
      inquiry_duration = 48;
    }
  }

  var usedTime = parseInt(inquiry_duration) * 3600 * 1000 - (etime - stime); //两个时间戳相差的毫秒数
  // console.log(usedTime,stime,etime)
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  // var time = days + "天" + hours + "时" + minutes + "分";
  var time = {
    days: days,
    hours: hours,
    minutes: minutes,
    usedTime: usedTime
  };
  console.log(JSON.stringify(time) + "--------时间差")
  return time;
};

// 计算两个时间之间的相差分钟数
date.DateDifferenceMinutes = function(faultDate, endTime) {
  var stime = faultDate;
  var etime = new Date().getTime();
  var usedTime = etime - stime; //两个时间戳相差的毫秒数
  console.log(stime, etime, usedTime);
  var minutes = Math.floor(usedTime / (60 * 1000));
  // var time = days + "天" + hours + "时" + minutes + "分";
  return minutes;
};

// 计算消息多长时间发送的
date.DateDifferenceMsgTime = function(faultDate) {
  var stime = faultDate;
  var etime = new Date().getTime();
  var usedTime = etime - stime; //两个时间戳相差的毫秒数
  console.log(stime, etime, usedTime);
  var days = Math.floor(usedTime / (24 * 3600 * 1000)); //天数
  //计算出小时数
  var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)); //小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  var time = days + "天" + hours + "时" + minutes + "分";
  console.log(time);
  let times = {
    minutes: minutes,
    hours: hours,
    days: days
  };
  return times;
};

// 获取周几
function getMonthWeek(a, b, c) {
  var date = new Date(a, parseInt(b) - 1, c),
    w = date.getDay(),
    d = date.getDate();
  return Math.ceil((d + 6 - w) / 7);
}
/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2020-05-02）
 * @returns {String}
 */
date.getWeek = function(dateString) {
  var dateArray = dateString.split("-");
  var day = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
  return "星期" + "日一二三四五六".charAt(day.getDay());
};
// 获取今天所在的一周的 周日及周一的日期
date.getNowDateAndNowWeek = function(time) {
  //选中的时间戳
  var timestamp = time;
  var serverDate = new Date(time);

  //本周周日的的时间
  var sundayTiem = timestamp + (7 - serverDate.getDay()) * 24 * 60 * 60 * 1000;
  var SundayData = new Date(sundayTiem);
  //年
  var tomorrowY = SundayData.getFullYear();
  //月
  var tomorrowM =
    SundayData.getMonth() + 1 < 10
      ? "0" + (SundayData.getMonth() + 1)
      : SundayData.getMonth() + 1;
  //日
  var tomorrowD =
    SundayData.getDate() < 10
      ? "0" + SundayData.getDate()
      : SundayData.getDate();

  // 本周周一的时间
  var mondayTime = timestamp - (serverDate.getDay() - 1) * 24 * 60 * 60 * 1000;
  var mondayData = new Date(mondayTime);
  //年
  var mondayY = mondayData.getFullYear();
  //月
  var mondayM =
    mondayData.getMonth() + 1 < 10
      ? "0" + (mondayData.getMonth() + 1)
      : mondayData.getMonth() + 1;
  //日
  var mondayD =
    mondayData.getDate() < 10
      ? "0" + mondayData.getDate()
      : mondayData.getDate();
  var nowWeek = getMonthWeek(tomorrowY, tomorrowM, tomorrowD);
  //输出值
  var config = {
    SunDay: tomorrowY + "/" + tomorrowM + "/" + tomorrowD,
    Monday: mondayY + "/" + mondayM + "/" + mondayD,
    nowWeek: nowWeek
  };
  return config;
};

//获取某段时间内的所有月份
date.getMounth = function (start, end) {
  var result = [];
  var starts = start.split('-');
  var ends = end.split('-');
  var staYear = parseInt(starts[0]);
  var staMon = parseInt(starts[1]);
  var endYear = parseInt(ends[0]);
  var endMon = parseInt(ends[1]);
  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon < endMon) {
        staMon++;
        staMon = staMon < 10 ? '0' + staMon : staMon;
        result.push(staYear + "-" + staMon);
      }
      staYear++;
    } else {
      staMon++;
      if (staMon > 12) {
        staMon = 1;
        staYear++;
      }
      staMon = staMon < 10 ? '0' + staMon : staMon;
      result.push(staYear + "-" + staMon);
    }
  }
  console.log(result);
  return result;
}


//获取一段时间内的每天的日期
date.getDays = function (stime, etime) {
  //初始化日期列表，数组
  var diffdate = new Array();
  var i=0;
  //开始日期小于等于结束日期,并循环
  while(stime<=etime){
    diffdate[i] = stime;

    //获取开始日期时间戳
    var stime_ts = new Date(stime).getTime();
    console.log('当前日期：'+stime   +'当前时间戳：'+stime_ts);

    //增加一天时间戳后的日期
    var next_date = stime_ts + (24*60*60*1000);

    //拼接年月日，这里的月份会返回（0-11），所以要+1
    var next_dates_y = new Date(next_date).getFullYear()+'-';
    var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
    var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();

    stime = next_dates_y+next_dates_m+next_dates_d;

    //增加数组key
    i++;
  }
  console.log(diffdate);
  return diffdate
}


date.getPastHalfYear = function(type) {
  // 先获取当前时间
  var nowdate = new Date();

  // 将半年的时间单位换算成毫秒
  var halfYear;
  if(type == 1){
    halfYear = 6;
  }else if(type == 2){
    halfYear = 3
  }else if(type == 3){
    halfYear = 1;
  }
  nowdate.setMonth(nowdate.getMonth() - halfYear);
  var y = nowdate.getFullYear();
  var m = nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : (nowdate.getMonth() + 1);
  var retrundate = y + '-' + m;
  console.log(retrundate);
  return retrundate;
}

date.getLastMouth = function () {
  var nowdays = new Date();
  var year = nowdays.getFullYear();
  var month = nowdays.getMonth() + 1;
  if(month==0){
    month = 12;
    year = year-1;
  }
  if(month<10){
    month = '0'+month;
  }
  return year + "-" + month
}


date.mounthDif = function(time, difference) {
  time = new Date(time).getTime() + difference;
  time = date.format(time);
  var timeArr = time.split(" ");
  return timeArr[0].slice(0, 7);
};


/**
 * 返回某一时间相差某一时间段的时间
 * 返回年月日  2019-11-30
 */
date.mounthDayDif = function(time, difference) {
  time = new Date(time).getTime() - difference;
  time = date.format(time);
  var timeArr = time.split(" ");
  return timeArr[0].slice(5, 10);
};

export default date;
