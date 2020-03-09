<template lang="html">
    <div class="content">
        <!--  -->
        <div class="select flex">
            <p><el-input size="small" v-model.trim="selectName" @change="selectMsgChange" clearable/></p>
            <el-button size="small" type="primary" @click="select">搜 索</el-button>
        </div>
        <!--  -->
        <div class="content-btn">
             <el-button size="small" type="primary" @click="changeName('添加')">添 加</el-button>
            <el-button size="small" type="primary" @click="allDel">批量删除</el-button>
        </div>
        <!--  -->
        <el-table :data="titleContentList" tooltip-effect="dark" style="width: 100%;margin-top: 15px;min-height: 520px;" @selection-change="handleSelectionChange" border>
            <el-table-column type="selection"  width="55" align="center"/>
            <el-table-column  type="index"  label="序号"  width="120" align="center"/>
            <el-table-column  prop="name"  label="名称" width="200" align="center"/>
            <el-table-column  prop="categoryModel.value"  label="添加人员"  align="center"/>
            <el-table-column  prop="createTime"  label="添加时间"   align="center"/>
            <el-table-column label="状态"  align="center">
                <template slot-scope="scope">{{ scope.row.statusModel.value }}</template>
            </el-table-column>
            <el-table-column label="操作"  align="center">
                <template slot-scope="scope">
    <el-button type="text" @click="changeName('编辑',scope.row.titleGroupContentId)">编 辑</el-button>
    <el-button type="text" @click="del(scope.row.titleGroupContentId)">删除</el-button>
</template>
            </el-table-column>
        </el-table>
        <!--  -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginationInfo.currentPage"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="paginationInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="paginationInfo.total"
            class="pagination">
        </el-pagination>
        <!--  -->
        <el-dialog :key="title" :title="title"  :visible.sync="_isClose"  width="507px" center  append-to-body>
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="50px">
                <el-form-item label="名称" prop="text" v-if="title=='添加'">
                    <el-input type="textarea" v-model="form.text" class="textarea" placeholder="提示：以逗号或者回车为一个关键字，最多只能输入30个"/>
                </el-form-item>

                <el-form-item label="名称" prop="text" v-else>
                    <el-input  v-model="form.text"  style="width:100%;"/>
                </el-form-item>
            </el-form>
            <el-button slot="footer" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
//编辑规则
var redact = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入名称'));
    } else {
        callback();
        titleArr = value;
    }
};

var titleArr = null;

//添加规则
var validateName = (rule, value, callback) => {
    var nameKeywords = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '');
    if (value === '') {
        callback(new Error('请输入名称'));
    } else if (nameKeywords.length >= 30) {
        callback(new Error('最多只能输入30个'));
    } else {
        callback();
        titleArr = nameKeywords;
    }
};

export default {
    props: {
        titleContentList: {
            type: Array,
            default: () => []
        },
        isClose: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        isDialogShow: {},
        paginationInfo: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        title(val) {
            if (val == '添加') {
                this.rules.text[0].validator = validateName;
            } else {
                this.rules.text[0].validator = redact;
            }
        },
        name(val) {
            this.form.text = val;
        }
    },
    computed: {
        _isClose: {
            get() {
                return this.isClose;
            },
            set(val) {
                this.$emit('changeisClone', val);
            }
        }
    },
    data() {
        return {
            selectName: '',

            form: {
                text: ''
            },
            rules: {
                text: [{ validator: validateName, trigger: 'change' }]
            },
            selectList: [],
            nameKeywords: []
        };
    },
    methods: {
        //
        selectMsgChange(val) {
            this.$emit('selectMsgChange', val);
        },
        //搜索
        select() {
            this.$emit('select', this.selectName);
        },
        //批量删除
        allDel() {
            if (this.selectList.length) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$emit('del', this.selectList);
                });
            } else {
                this.$message({
                    message: '请先选择您要删除的，在执行此操作!',
                    type: 'warning',
                    center: true
                });
            }
        },
        del(id) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(() => {
                    this.$emit('del', Array.of(id));
                })
                .catch(() => {
                    return false;
                });
        },
        changeName(title, id) {
            this.form.text = '';
            this.$emit('open', title, id);
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$emit('add', titleArr);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleSelectionChange(val) {
            this.selectList = val.map(item => {
                return item.titleGroupContentId;
            });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.$emit('handleSizeChange', val);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit('handleCurrentChange', val);
        }
    }
};
</script>

<style lang="scss">
.flex {
    display: flex;
    p {
        margin-right: 15px;
    }
}
.content-btn {
    margin-top: 15px;
}
.pagination {
    text-align: right;
    margin-top: 15px;
}
.textarea {
    min-height: 203px;
    .el-textarea__inner {
        min-height: 203px !important;
    }
}
</style>
