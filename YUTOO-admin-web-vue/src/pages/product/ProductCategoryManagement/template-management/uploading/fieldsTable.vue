
<template lang="html">
    <div>
        <el-table :data="fieldsData" border style="width: 100%">
            <el-table-column  type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column  prop="displayName"  label="模板字段" width="180" align="center"></el-table-column>
            <el-table-column  label="字段类型" align="center">
                <template slot-scope="scope">
                    {{scope.row.propertyType | homologousType}}
                </template>
            </el-table-column>
            <el-table-column label="是否店铺差异" align="center">
                <template slot-scope="scope">
                    <div  @click="changeDifference(0,scope.row)" :style="islookstyle">
                        <template v-if='isLook'>
                            <el-tooltip effect="dark" content="点击更改" placement="right">
                                <img v-if="scope.row.storeDisparityFlag" src="../../icon/u91267.png" alt="" width="28" height="28">
                                <img v-else src="../../icon/u91275.png" alt="" width="28" height="28">
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <img v-if="scope.row.storeDisparityFlag" src="../../icon/u91267.png" alt="" width="28" height="28">
                            <img v-else src="../../icon/u91275.png" alt="" width="28" height="28">
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="是否变体差异" align="center">
                <template slot-scope="scope">
                    <div @click="changeDifference(1,scope.row)" :style="islookstyle">
                         <template v-if='isLook'>
                           <el-tooltip  effect="dark" content="点击更改" placement="right">
                               <img v-if="scope.row.variantsDisparityFlag" src="../../icon/u91267.png" alt="" width="28" height="28">
                               <img v-else src="../../icon/u91275.png" alt="" width="28" height="28">
                           </el-tooltip>
                        </template>
                        <template v-else>
                            <img v-if="scope.row.variantsDisparityFlag" src="../../icon/u91267.png" alt="" width="28" height="28">
                            <img v-else src="../../icon/u91275.png" alt="" width="28" height="28">
                        </template>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="关联对应字段" align="center">
                <template slot-scope="scope">
                    <p v-for="item in scope.row.relevancePropInfoList">{{item.relevanceFieldsName}}</p>
                </template>
            </el-table-column>
            <el-table-column  label="操作" align="center">
                <template slot-scope="scope">
                    <el-button v-if="isLook" type="text" @click="setfields(scope.row.catePltTemplateId,scope.row.catePltTempPropId,scope.row.displayName,)">设置关联字段</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        fieldsData: {
            type: Array,
            default: () => []
        },
        isLook:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            islookstyle:this.isLook?"cursor: pointer;":" "
        }
    },
    methods: {
        setfields(tempId,propId,name) {
            if(this.isLook){
               this.$emit("setfields",tempId,propId,name)
            }
        },
        changeDifference(type,item){
            if(this.isLook){
                this.$emit("changeDifference",type,item)
            }
        }
    },
    filters: {
        homologousType(val) {
            switch (val) {
                case 1:
                    return "输入框"
                    break;
                case 2:
                    return "单选框"
                    break;
                case 3:
                    return "多选框"
                    break;
                case 4:
                    return "多行文本输入框"
                    break;
                case 5:
                    return "单选按钮"
                    break;
                case 6:
                    return "日期"
                    break;
                case 7:
                    return "富文本"
                    break;
                case 9:
                    return "颜色类型"
                    break;
                case 10:
                    return "产品类目"
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
