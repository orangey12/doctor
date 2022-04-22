<template>
    <div class="lookHead">
        <navbar title="发送列表"></navbar>
        <div class="list" v-for="(item,index) in result" :key="index">
            <img v-zlazy="item.patientImg" alt="" class="img-width-height-sm">
            <span>{{item.patientName}}</span>
        </div>
    </div>
</template>
<script>
import $api from "@/utils/api.js";
import navbar from "@/common/navbar";
import { Popup } from 'vant';
export default {
    name: "lookHead",
    components: { navbar },
    data(){
        return{
            result:[],
        }
    },

    mounted(){
        this.result=this.$route.query.result
    },
    methods:{

    }
}
</script>
<style scoped lang="less">
.lookHead{
    min-height: 100vh;
    background: #ffffff;
}
.list{
    padding: 14px 16px;
    background: #ffffff;
    display: flex;
    align-items: center;
    img{
        width: 32px;
        height: 32px;
        margin-right: 16px;
    }
}
</style>
