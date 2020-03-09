<template lang="html">
    <div class="regulation_select">
        <div class="select_item">
            <span>规则名称:</span>
            <el-input placeholder="请输入名称" v-model="selectInfo.ruleName" size="medium"/>
        </div>
        <div class="select_item">
            <el-select v-model="selectInfo.activateFlag" placeholder="规则状态" clearable size="medium">
                <el-option v-for="item in regulation_select" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </div>
        <div class="select_item">
            <span class="text">添加时间:</span>
            <el-date-picker size="medium" v-model="selectInfo.timeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
        </div>
        <div class="select_item">
            <el-button type="primary" @click='select' size="medium">搜 索</el-button>
        </div>
    </div>
</template>

<script>
// import mixins from './mixins'

export default {
    // mixins: [mixins],

    data() {
        return {
            selectInfo: { //搜索信息
                ruleName: '',
                activateFlag: '',
                timeArr:[],
            },
            regulation_select: [{
                value: '1',
                label: '激活'
            }, {
                value: '0',
                label: '未激活'
            }],
        };
    },
    methods:{
        select(){
            this.$emit('select',this.selectInfo)
        }
    }


}
</script>

<style lang="scss" >
    .text {
        display: block;
        height: 36px;
        line-height: 36px;
        margin-right: 10px;
        text-align: center;
    }
    .regulation_select {
        display: flex;
        flex-direction: row;
        padding: 10px 0 10px 10px;
        border-radius: 5px;
        background-color: #f2f2f2;
        .select_item {
            display: flex;
            flex-direction: row;
            margin-right: 10px;
            &:first-child {
                span {
                    @extend .text;
                    width: 100px;
                }
            }
        }
    }
</style>
