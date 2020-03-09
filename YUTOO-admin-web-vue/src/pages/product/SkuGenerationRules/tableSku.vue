<template lang="html">
    <div class="regulation_list">
        <el-table ref="multipleTable" :data="data" border tooltip-effect="dark" style="width: 100%" @selection-change="userSelect">
            <el-table-column type="selection" width="55" />
            <el-table-column label="规则编号" width="90" type="index"></el-table-column>
            <el-table-column label="是否激活" width="80">
                <template slot-scope="scope">{{ scope.row.activateFlag?'激活':'未激活'}}</template>
            </el-table-column>
            <el-table-column prop="ruleName" label="规则名称"></el-table-column>
            <el-table-column prop="objectName" label="店铺名称" width="100" v-if="ruleType"></el-table-column>
            <el-table-column label="规则公式">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.skuRuleModel" style="margin-right:5px;">
                        {{item.name}} {{item.content}}<span v-if="item.key!==8 && item.auto">位数</span>
                    </span>
                 </template>
            </el-table-column>
            <el-table-column  label="规则说明">
                <template slot-scope="scope">
                    {{scope.row.description || '-'}}
                 </template>
            </el-table-column>
            <el-table-column prop="createTime" label="规则日志"></el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="compile(scope.row.skuRuleId)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteRow(scope.row.skuRuleId)">删除</el-button>
                 </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            default:function() {
                return []
            }
        },
        ruleType:{
            type:Boolean,
            default:true
        }
    },
    methods:{
        //选中的
        userSelect(val) {
            this.$emit('userSelect',val)
        },
        //编辑
        compile(skuRuleId){
            this.$emit('compile',skuRuleId)
        },
        //删除
        deleteRow(skuRuleId){
            this.$emit('deleteRow',skuRuleId)
        }
    }
}
</script>

<style lang="scss">
    .regulation_list {
        min-height: 520px;
        .cell {
            text-align: center;
        }
        .el-table th {
            background: #f3f3f3;
        }
    }

</style>
