
<template lang="html">
    <div>        
        <div v-if="$route.params.platformId==2" style="padding-bottom:15px;">
          <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="add">添 加</el-button>           
          <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="(catePltTempPropIds.length && isDel)?false:true" @click="del">删 除</el-button>
        </div>
        <el-table :data="fieldsData" border style="width: 100%" height="680px" @selection-change="selectFieldChange">
            
            <el-table-column v-if="$route.params.platformId==2" type="selection"  align="center" width="55"></el-table-column>

            <el-table-column  type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column  prop="displayName"  label="模板字段" align="left"></el-table-column>
            <el-table-column  label="字段类型" align="center">
                <template slot-scope="scope">
                    <!-- {{scope.row.propertyType | homologousType}} -->
                    {{scope.row.propertyTypeString}}
                </template>
            </el-table-column>
            <el-table-column  prop="maxLength"  v-if="$route.params.platformId==2" label="字段长度" align="center"></el-table-column>
            <!-- <el-table-column  prop=""  v-if="$route.params.platformId==2" label="选项值" align="center"></el-table-column> -->


            <el-table-column label="是否店铺差异" align="center" width="120px">
                <template slot-scope="scope">
    <div @click="changeDifference(0,scope.row)" :style="islookstyle">
        <template v-if="isLook">
            <el-tooltip effect="dark" content="点击更改" placement="right">
                <img v-if="scope.row.storeDisparityFlag" src="../../icon/u91267.png" alt width="23" height="23">
                <img v-else src="../../icon/u91275.png" alt width="23" height="23">
            </el-tooltip>
        </template>
        <template v-else>
            <img v-if="scope.row.storeDisparityFlag" src="../../icon/u91267.png" alt width="23" height="23">
            <img v-else src="../../icon/u91275.png" alt width="23" height="23">
        </template>
    </div>
</template>
            </el-table-column>
            <el-table-column  label="是否变体差异" align="center" width="120px">
                <template slot-scope="scope">
    <div @click="changeDifference(1,scope.row)" :style="islookstyle">
        <template v-if="isLook">
            <el-tooltip effect="dark" content="点击更改" placement="right">
                <img v-if="scope.row.variantsDisparityFlag" src="../../icon/u91267.png" alt width="23" height="23">
                <img v-else src="../../icon/u91275.png" alt width="23" height="23">
            </el-tooltip>
        </template>
        <template v-else>
            <img v-if="scope.row.variantsDisparityFlag" src="../../icon/u91267.png" alt width="28" height="28">
            <img v-else src="../../icon/u91275.png" alt width="23" height="23">
        </template>
    </div>
</template>
            </el-table-column>

            <el-table-column  label="是否必填字段" align="center" width="120px"> 
												<template slot-scope="scope">
    <div @click="changeDifference(2,scope.row)" :style="islookstyle">
        <template v-if="isLook">
            <el-tooltip effect="dark" content="点击更改" placement="right">
                <img v-if="scope.row.mustFlag" src="../../icon/u91267.png" alt width="23" height="23">
                <img v-else src="../../icon/u91275.png" alt width="23" height="23">
            </el-tooltip>
        </template>
        <template v-else>
            <img v-if="scope.row.mustFlag" src="../../icon/u91267.png" alt width="23" height="23">
            <img v-else src="../../icon/u91275.png" alt width="23" height="23">
        </template>
    </div>
</template>
            </el-table-column>

            <el-table-column  label="是否需要填写" align="center" width="120px">
												<template slot-scope="scope">
    <div @click="changeDifference(3,scope.row)" :style="islookstyle">
        <template v-if="isLook">
            <el-tooltip effect="dark" content="点击更改" placement="right">
                <img v-if="scope.row.writeFlag" src="../../icon/u91267.png" alt width="23" height="23">
                <img v-else src="../../icon/u91275.png" alt width="23" height="23">
            </el-tooltip>
        </template>
        <template v-else>
            <img v-if="scope.row.writeFlag" src="../../icon/u91267.png" alt width="23" height="23">
            <img v-else src="../../icon/u91275.png" alt width="23" height="23">
        </template>
    </div>
</template>
            </el-table-column>

            <el-table-column  label="默认值" prop="defValue" align="center"></el-table-column>
            <el-table-column label="关联对应字段" align="center">
                <template slot-scope="scope">
    <p v-for="item in scope.row.relevancePropInfoList">{{item.relevanceFieldsName}}</p>
</template>
            </el-table-column>
            <el-table-column  label="操作" align="center" v-if="isLook">
                <template slot-scope="scope">
    <el-button type="text" @click="setfields(scope.row.catePltTemplateId,scope.row.catePltTempPropId,scope.row.displayName,0, scope.row)">设置关联字段</el-button>
    <el-button v-if="$route.params.platformId==2 && scope.row.modelPropertyType==1" type="text" @click="edit(scope.row)">编 辑</el-button>

    <el-button type="text" @click="setfields(scope.row.catePltTemplateId,scope.row.catePltTempPropId,scope.row.displayName,1, scope.row)">设置默认值</el-button>
</template>
            </el-table-column>
        </el-table>
        <!--  -->



        <!--  -->
    </div>
</template>

<script>
export default {
    props: {
        fieldsData: {
            type: Array,
            default: () => []
        },
        isLook: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            islookstyle: this.isLook ? 'cursor: pointer;' : ' ',
            catePltTempPropIds: [],
            isDel: true
        };
    },
    methods: {
        add() {
            this.$emit('add');
        },
        edit(row) {
            this.$emit('edit', row);
        },
        del() {
            this.$confirm('确定删除所选字段吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(() => {
                    this.$emit('del', this.catePltTempPropIds);
                })
                .catch(() => {
                    return false;
                });
        },
        selectFieldChange(val) {
            this.catePltTempPropIds = val.map(i => i.catePltTempPropId);
            this.isDel = val.map(i => i.modelPropertyType).every(i => i == 1);
        },
        setfields(tempId, propId, name, type, row) {
            if (this.isLook) {
                this.$emit('setfields', tempId, propId, name, type, row);
            }
        },
        changeDifference(type, item) {
            if (this.isLook) {
                this.$emit('changeDifference', type, item);
            }
        }
    },
    filters: {
        homologousType(val) {
            switch (val) {
                case 1:
                    return '输入框';
                    break;
                case 2:
                    return '单选框';
                    break;
                case 3:
                    return '多选框';
                    break;
                case 4:
                    return '多行文本输入框';
                    break;
                case 5:
                    return '单选按钮';
                    break;
                case 6:
                    return '日期';
                    break;
                case 7:
                    return '富文本';
                    break;
                case 9:
                    return '颜色类型';
                    break;
                case 10:
                    return '产品类目';
                    break;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
