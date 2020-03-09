<template lang="html">
    <div class="chart">
        <layout>
            <template slot="title">{{title}}</template>
            <template slot="time">
                <selectTime :show="true" @setTitle="getTitle" @pieTime="getTime"/>
            </template>
            <template slot="content">
                <div class="pie_warp" v-loading="loading"  element-loading-text="拼命加载中...">
                    <div class="pie">
                         <chart :options="option" v-if='option.tooltip' auto-size style="width:100%"/>
                    </div>
                    <lookList :dataList="CareaList" :tag="'(件)'"/>
                </div>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from "../base/layout";
import selectTime from "../base/selectTime";
import echarts from "echarts";
import lookList from "../base/look-list";
export default {
    props:{
        option:{
            type:Object,
            default:function() {
                return {}
            }
        },
        CareaList:{
            type:Array,
            default:function() {
                return []
            }
        },
        loading:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            title:"商品销量分布-近7天",
        }
    },


    methods:{
        getTitle(title){
            this.title = title;
        },
        getTime(time) {
            let params = {
                minDate:time.minDate,
                maxDate:time.maxDate
            }
            this.$emit('commodityDistributionTime',params)
        }
    },
	components: {
		layout,
		selectTime,
        lookList
	}
}

</script>

<style lang="scss" scoped>
.pie_warp {
  display: flex;
  min-height: 420px;
  flex-direction: row;
  .pie {
    width: 650px;
  }
}
</style>
