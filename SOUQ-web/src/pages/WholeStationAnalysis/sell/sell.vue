<template lang="html">
    <div class="chart">
        <layout>
            <template slot="title">SOUQ全站销售趋势</template>
            <template slot="time">
                <selectTime :show="false" @pieTime="getTime"/>
            </template>
            <template slot="content">
                <div class="myecharts" v-loading="loading"  element-loading-text="拼命加载中...">
                    <chart :options="option" auto-resize style="width:100%"></chart>
                </div>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from '../base/layout'
import selectTime from '../base/selectTime'
import echarts from 'echarts';

export default {
	props:{
        option:{
           type:Object,
           default:function() {
               return {}
           }
        },
        loading:{
            type:Boolean,
            default:true
        }

    },
    methods:{
        getTime(time){
            this.$emit('sellTime',time)
        },
    },
	components: {
		layout,
		selectTime
	}
}
</script>
<style lang="scss">
    .myecharts {
        height: 420px;
        width: 100%;
    }
</style>
