<template>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="选择字段来源：" prop="source">
            <el-select v-model="form.source" style="width:400px" size="small" @change="changeSource">
                <el-option :value="i.basePropertyType" :label="i.value" v-for="(i,j) in sourceList" :key="j"></el-option>
            </el-select>
        </el-form-item>

        <transition name="el-zoom-in-top">
            <div v-if="form.source">
                <el-form-item label-width="0px">
                    <el-input v-model="form.name" style="width:300px" size="mini" placeholder="字段名称" />
                    <el-button type="primary" style="margin-left:10px;" size="mini">搜索</el-button>
                </el-form-item>
                <el-form-item label-width="0px" prop="currentRow">
                    <el-table ref="table" border :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
                        <el-table-column label="序号" align="center">
                            <template slot-scope="scope">{{scope.$index+1}}</template>
                        </el-table-column>
                        <el-table-column property="basePropertyName" label="字段名称" align="center"></el-table-column>
                        <el-table-column align="center">
                            <template slot-scope="scope">
                                <el-radio v-model="form.currentRow" :label="scope.row">
                                    <i />
                                </el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </div>
        </transition>
    </el-form>
</template>
<script>
export default {
    data() {
        return {
            form: {
                source: '',
                currentRow: null
            },
            rules: {
                source: [
                    { required: true, message: '请选择来源', trigger: 'change' }
                ],
                currentRow: [
                    {
                        required: true,
                        message: '请选择关联字段',
                        trigger: 'change'
                    }
                ]
            },
            sourceList: [],
            tableData: [],
            sysPropertys: [],
            propertyId: null
        };
    },
    methods: {
        changeSource(v) {
            try {
                this.tableData = this.sysPropertys.filter(
                    i => i.basePropertyType == v
                )[0].items;
            } catch (error) {
                console.log(error);
                this.tableData = [];
            }
        },
        handleCurrentChange(val) {
            this.form.currentRow = val;
        },
        submitForm(cb) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    cb && cb(this.form.currentRow, this.propertyId);
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.form.resetFields();
        },
        init(propertyId, platCategorySign) {
            this.propertyId = propertyId;
            this.$api['product/tempPropertyRelation']({
                platCategorySign,
                propertyId
            }).then(({rows:res}) => {
                console.log(res);
                
                this.sourceList = res.basePropertys;
                this.sysPropertys = res.sysPropertys;
            });
        }
    }
};
</script>