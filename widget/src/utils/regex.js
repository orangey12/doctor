/*****表单验证*****/
import {Toast} from "vant";

var regex = {
    /*手机号验证*/
    telBlur: function (val) {
        if (val.length != 11) {
            if (val == "") {
                Toast("手机号码不能为空");
                return false;
            } else {
                Toast("手机号码输入不正确，请重新输入")
                return false;
            }
        } else {
            return true;
        }
    },
    /*姓名的验证*/
    nameBlur: function (val) {
        var reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
        if (val == "") {
           Toast("姓名不能为空");
            return false;
        }
        else if (reg.test(val) == false) {
            Toast("您输入的姓名格式不正确");
            return false;
        } else {
            return true;
        }
    },
    /*身份证号验证*/
    idNoBlur: function (val) {
        if (val == "") {
            Toast("身份证号不能为空");
            return false;
        } else if (!regex.checkCard(val)) {
            Toast("您输入的身份证格式不正确");
            return false;
        } else {
            return true;
        }
    },
    /*通过身份证获取男女，年龄*/
    disCriCard: function (val,type) {
        var UUserCard = val;
         //获取出生年月日2017-10-22格式
         var birthYear = UUserCard.substring(6, 10);
         var birthMonth = UUserCard.substring(10, 12);
         var birthDay = UUserCard.substring(12, 14);
         var strBirthday = birthYear + "-" + birthMonth + "-" + birthDay;
        if(type == 'bir'){
        return strBirthday;
        }else if(type == "sex"){
            if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
                return "1";
             } else if (parseInt(UUserCard.substr(16, 1)) % 2 == 0) {
                 return "2";
             }
        }else{
                 //获取年龄
        var date = new Date(),startDate = new Date(strBirthday);
        var newDate = date.getTime() - startDate.getTime();

        // 向下取整  例如 10岁 20天 会计算成 10岁
        var returnAge = Math.floor(newDate / 1000 / 60 / 60 / 24 / 365);
        return returnAge
        }


    },
    city: {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
        21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
        33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
        42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
        51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
        63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    },
    checkCard: function (obj) {
        //校验长度，类型
        if (regex.isCardNo(obj) === false) {
            return false;
        }
        //检查省份
        if (regex.checkProvince(obj) === false) {
            return false;
        }
        //校验生日
        if (regex.checkBirthday(obj) === false) {
            return false;
        }
        //检验位的检测
        if (regex.checkParity(obj) === false) {
            return false;
        }
        return true;
    },
    //检查号码是否符合规范，包括长度，类型
    isCardNo: function (obj) {
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        if (reg.test(obj) === false) {
            return false;
        }
        return true;
    },
    //取身份证前两位,校验省份
    checkProvince: function (obj) {
        var province = obj.substr(0, 2);
        if (regex.city[province] == undefined) {
            return false;
        }
        return true;
    },
    //检查生日是否正确
    checkBirthday: function (obj) {
        var len = obj.length;
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if (len == '15') {
            var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arr_data1 = obj.match(re_fifteen);
            var year1 = arr_data1[2];
            var month1 = arr_data1[3];
            var day1 = arr_data1[4];
            var birthday1 = new Date('19' + year1 + '/' + month1 + '/' + day1);
            return regex.verifyBirthday('19' + year1, month1, day1, birthday1);
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if (len == '18') {
            var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arr_data = obj.match(re_eighteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year + '/' + month + '/' + day);
            return regex.verifyBirthday(year, month, day, birthday);
        }
        return false;
    },
    //校验日期
    verifyBirthday: function (year, month, day, birthday) {
        var now = new Date();
        var now_year = now.getFullYear();
        //年月日是否合理
        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
            //判断年份的范围（3岁到100岁之间)
            var time = now_year - year;
            if (time >= 0 && time <= 130) {
                return true;
            }
            return false;
        }
        return false;
    },
    //校验位的检测
    checkParity: function (obj) {
        //15位转18位
        obj = regex.changeFivteenToEighteen(obj);
        var len = obj.length;
        if (len == '18') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i, valnum;
            for (i = 0; i < 17; i++) {
                cardTemp += obj.substr(i, 1) * arrInt[i];
            }
            var valNum = arrCh[cardTemp % 11];
            if (valNum == obj.substr(17, 1)) {
                return true;
            }
            return false;
        }
        return false;
    },
    //15位转18位身份证号
    changeFivteenToEighteen: function (obj) {
        if (obj.length == '15') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i;
            obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6);
            for (i = 0; i < 17; i++) {
                cardTemp += obj.substr(i, 1) * arrInt[i];
            }
            obj += arrCh[cardTemp % 11];
            return obj;
        }
        return obj;
    },
    codeBlur: function (val) {
        if (val == "") {
            Toast("请输入手机验证码");
            return false;
        }
        else if (val.length<6) {
            Toast("您输入的验证码格式不正确，请重新输入");
            return false;
        } else {
            return true;
        }
    },




}

export default regex;
