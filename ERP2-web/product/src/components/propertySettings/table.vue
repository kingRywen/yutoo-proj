<template>
    <el-table :data="data" border style="width: 100%" v-bind="$attrs" v-on="$listeners" tooltip-effect="dark" ref="table">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" align="center" type="index" width="80"></el-table-column>
        <template v-for="(i,j) in columns">
            <el-table-column v-if="i.type==='switch'" :label="i.label" :width="i.width" align="center" :key="j">
                <template slot-scope="scope">
                    <el-switch :disabled="(scope.row.addType=='系統' && !scope.row.editMustFlag && scope.row.firstMustFlag)?true:false" v-if="i.prop=='mustFlag'" v-model="scope.row.mustFlag" :active-value="1" :inactive-value="0" />

                    <el-switch v-else-if="i.prop=='imgFlag'" v-model="scope.row.imgFlag" :active-value="1" :inactive-value="0" />

                    <el-switch v-else v-model="scope.row.titleSkuFlag" :active-value="1" :inactive-value="0" />
                </template>
            </el-table-column>
            <el-table-column v-else-if="i.type==='select'" :label="i.label" :width="i.width" align="center" :key="j">
                <template slot-scope="scope">
                    <el-select v-if="scope.row.imgFlag" v-model="scope.row.imgFloor" size="small">
                        <el-option v-for="item in list" :label="item.label" :value="item.value" :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column v-else :prop="i.prop" :label="i.label" :width="i.width" align="center" :key="j" />
        </template>
    </el-table>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            default: () => []
        },
        who: String
    },
    data() {
        return {
            list: [{ label: '一级', value: 1 }, { label: '二级', value: 2 }]
        };
    },
    methods: {
        clearSelection() {
            this.$refs.table.clearSelection();
        }
    }
};
</script>