<template>
    <!-- 模板编辑 -->
    <div class="tempEdit">
        <!--  -->
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" v-loading="loading" element-loading-text="加载中...">
            <el-form-item label="模板名称：" prop="nickName">
                <el-input v-model="form.nickName"></el-input>
            </el-form-item>
            <el-form-item label="站点：">{{form.siteName}}</el-form-item>
            <el-form-item label="类目：">{{form.category}}</el-form-item>
            <el-form-item label-width="0">
                <!--  -->

                <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabs" style="min-height: 520px;">
                    <el-tab-pane :label="i.propertyGroupKey" :name="i.propertyGroupKey" v-for="(i,j) in form.templatePropertys" :key="j">
                        <template v-if="activeName==i.propertyGroupKey">
                            <!-- ebay  -->
                            <div style="margin: 0 0 15px " v-if="platId==2">
                                <el-button type="primary" size="small" @click="ebayAddField">添加字段</el-button>
                                <el-button type="primary" size="small" :disabled="isRemove()" @click="remove">删除</el-button>
                            </div>
                            <!--  -->
                            <el-table :data="i.propertys" border style="width: 100%" :key="tableKey" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55" align="center" v-if="platId==2"></el-table-column>
                                <el-table-column type="index" label="序号" align="center" width="55"></el-table-column>
                                <el-table-column prop="propertyNameEn" label="模板字段" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="propertyNameCn" label="中文翻译" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div class="animated" :class="scope.row.propertyNameCnAnimated">{{scope.row.propertyNameCn || '-'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="fieldTypeName" label="字段类型" align="center"></el-table-column>
                                <!--  ebay  -->
                                <el-table-column prop="dataMaxLength" label="字段长度" align="center" v-if="platId==2">
                                    <template slot-scope="scope">{{scope.row.dataMaxLength || '-'}}</template>
                                </el-table-column>
                                <el-table-column label="选项值" align="center" show-overflow-tooltip v-if="platId==2">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.controlValue.length">{{scope.row.controlValue.join("，")}}</span>
                                        <span v-else>-</span>
                                    </template>
                                </el-table-column>
                                <!--  -->
                                <el-table-column label="是否店铺差异" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" title="点击更改" @click="changeDiff(1,scope.row)" :disabled="disabled(scope.row.editStoreFlag)">
                                            <i :class="renderIcon(scope.row.storeFlag)" />
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否变体差异" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" title="点击更改" @click="changeDiff(2,scope.row)" :disabled="disabled(scope.row.editVariantsDifferenceFlag)">
                                            <i :class="renderIcon(scope.row.variantsDifferenceFlag)" />
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否必填" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" title="点击更改" @click="changeDiff(3,scope.row)" :disabled="disabled(scope.row.editMustFlag)">
                                            <i :class="renderIcon(scope.row.mustFlag)" />
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column label="是否需要填写" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="text" title="点击更改" @click="changeDiff(4,scope.row)" disabled>
                                            <i :class="renderIcon(scope.row.writeFlag)" />
                                        </el-button>
                                    </template>
                                </el-table-column> -->
                                <el-table-column prop="basePropertyName" label="关联对应字段" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <div class="animated" :class="scope.row.basePropertyAnimated">{{scope.row.basePropertyName || '-'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="defaultValue" label="默认值" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span class="animated" :class="scope.row.defaultValueAnimated" v-if="Array.isArray(scope.row.defaultValue)">{{scope.row.defaultValue.join("，")}}</span>
                                        <span class="animated" :class="scope.row.defaultValueAnimated" v-else>{{scope.row.defaultValue || '-'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="180px">
                                    <!--  -->
                                    <template slot-scope="scope">
                                        <el-dropdown split-button type="primary" @click="handleRelationField(scope.row)" @command="handleAggregate" size="small">
                                            设置关联字段
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item :command="{row:scope.row,
                                                type:1}">设置默认值</el-dropdown-item>
                                                <el-dropdown-item :command="{row:scope.row,
                                                type:2,}">设置中文翻译</el-dropdown-item>
                                                <el-dropdown-item v-if="platId==2 && scope.row.propertyType" :command="{row:scope.row,
                                                type:3}">编辑</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template>
                                    <!--  -->
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-tab-pane>
                </el-tabs>

                <!--  -->
            </el-form-item>
            <el-form-item label-width="0">
                <div style="text-align: center;">
                    <el-button @click="$router.back(-1)">返回</el-button>
                    <el-button type="primary" @click="saveTemp">保存模板</el-button>
                </div>
            </el-form-item>
        </el-form>
        <!--  -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width" :fullscreen="dialog.fullscreen">
            <div class="dialog_container">
                <component :is="dialog.component" ref="dialogcomponent"></component>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submit(dialog.type)">确 定</el-button>
            </span>
        </el-dialog>
        <!--  -->
    </div>
</template>

<script>
import AssociatedFields from './associatedFields';
import TempEbayAddField from './tempEbayAddField';
import SetDefault from './setDefault';
export default {
    components: { AssociatedFields, TempEbayAddField, SetDefault },
    data() {
        return {
            settedPropKey: null,
            dialog: {
                title: '',
                visible: false,
                width: '100%',
                component: '',
                fullscreen: true,
                type: null
            },
            form: {
                propertyGroups: [],
                templatePropertys: []
            },
            rules: {
                nickName: [
                    {
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'blur'
                    }
                ]
            },
            activeName: '',
            tableKey: 1,
            selectRemovefiled: [],
            loading: true
        };
    },
    methods: {
        isRemove() {
            return this.selectRemovefiled.length &&
                this.selectRemovefiled.every(i => i.propertyType == 1)
                ? false
                : true;
        },
        handleSelectionChange(v) {
            this.selectRemovefiled = v;
        },
        // ebay
        ebayAddField() {
            this.dialog.type = 5;
            this.dialog.visible = true;
            this.dialog.title = '添加字段';
            this.dialog.component = 'TempEbayAddField';
            this.$nextTick(() => {
                this.$refs.dialogcomponent.resetForm();
            });
        },
        remove() {
            this.$confirm('此操作将永久删除该字段, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    const curtable = this.currentTabsTable();
                    const names = this.selectRemovefiled.map(
                        i => i.propertyNameEn
                    );
                    const arr = [];
                    curtable.propertys.forEach(item => {
                        if (names.find(j => j == item.propertyNameEn)) {
                            return;
                        } else {
                            arr.push(item);
                        }
                    });
                    curtable.propertys = arr;
                })
                .catch(() => {
                    return false;
                });
        },
        //提交
        submit(type) {
            switch (type) {
                case 4:
                    this.$refs.dialogcomponent.submitForm((val, propertyId) => {
                        this.dialog.visible = false;
                        const curTabs = this.currentTabsTable();
                        if (curTabs && curTabs.propertys.length) {
                            let result = curTabs.propertys.find(
                                i => i.propertyId == propertyId
                            );
                            if (result) {
                                result.basePropertyId = val.basePropertyId;
                                result.basePropertyName = val.basePropertyName;
                                this.promptUsers(
                                    result,
                                    'basePropertyAnimated'
                                );
                            }
                        }
                    });
                    break;
                case 5:
                    this.$refs.dialogcomponent.submitForm(data => {
                        try {
                            const curTabs = this.currentTabsTable();
                            const arr = curTabs.propertys.length
                                ? Object.keys(curTabs.propertys[0])
                                : [];
                            const obj = arr.reduce((obj, key, index) => {
                                if (
                                    key == 'editStoreFlag' ||
                                    key == 'editVariantsDifferenceFlag' ||
                                    key == 'editMustFlag'
                                ) {
                                    obj[key] = 1;
                                } else {
                                    obj[key] = null;
                                }
                                if (key == 'writeFlag') {
                                    obj[key] = data.mustFlag;
                                }
                                if (key == 'propertyId') {
                                    obj[key] = 'customId' + index;
                                }
                                return Object.assign(obj, data);
                            }, {});
                            if (
                                curTabs.propertys.find(
                                    i => i.propertyNameEn == data.propertyNameEn
                                )
                            ) {
                                return this.$message.warning('字段名称重复');
                            }
                            if (Object.keys(obj).length) {
                                curTabs.propertys.push(obj);
                                this.dialog.visible = false;
                            } else {
                                this.$message.error(
                                    '当前模板字段列表为空，未获取到对应的key,无法添加'
                                );
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });
                    break;
                case 3:
                    this.$refs.dialogcomponent.submitForm(data => {
                        const curTabs = this.currentTabsTable();
                        let index = curTabs.propertys.findIndex(
                            i => i.propertyId == data.propertyId
                        );
                        data['editStoreFlag'] = 1;
                        data['editVariantsDifferenceFlag'] = 1;
                        data['editMustFlag'] = 1;
                        curTabs.propertys[index] = { ...data };
                        this.dialog.visible = false;
                        this.tableKey++;
                    });
                    break;
                case 1:
                    this.$refs.dialogcomponent.submitForm((val, propertyId) => {
                        console.log(val, propertyId);
                        const curTabs = this.currentTabsTable();
                        let result = curTabs.propertys.find(
                            i => i.propertyId == propertyId
                        );
                        result.defaultValue = val.item;
                        this.dialog.visible = false;
                        this.promptUsers(result, 'defaultValueAnimated');
                        this.tableKey++;
                    });
                    break;
                default:
                    break;
            }
        },

        //设置关联字段
        handleRelationField(row) {
            this.dialog.visible = true;
            this.dialog.type = 4;
            this.dialog.title = `设置关联字段 - ${row.propertyNameEn}`;
            this.dialog.component = 'AssociatedFields';
            this.$nextTick(() => {
                this.$refs.dialogcomponent.resetForm();
                this.$refs.dialogcomponent.init(
                    row.propertyId,
                    this.form.platCategorySign
                );
            });
        },
        handleAggregate({ row, type }) {
            // 1.设置默认值 2.设置中文翻译 3.编辑 4.设置关联字段,5.ebay添加编辑字段
            this.dialog.type = type;
            switch (type) {
                case 1:
                    this.dialog.visible = true;
                    this.dialog.title = '设置默认值';
                    this.dialog.component = 'SetDefault';
                    this.settedPropKey = row.propertyId
                    this.$nextTick(() => {
                        this.$refs.dialogcomponent.init(row);
                    });
                    break;
                case 2:
                    this.$prompt(null, '设置中文翻译', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnClickModal: false,
                        inputPattern: /\S/,
                        inputErrorMessage: '不能为空'
                    })
                        .then(({ value }) => {
                            row.propertyNameCn = value;
                            this.promptUsers(row, 'propertyNameCnAnimated');
                        })
                        .catch(() => {
                            return false;
                        });
                    break;
                case 3:
                    this.dialog.visible = true;
                    this.dialog.title = '编辑字段';
                    this.dialog.component = 'TempEbayAddField';
                    this.$nextTick(() => {
                        this.$refs.dialogcomponent.resetForm();
                        this.$refs.dialogcomponent.edit(row);
                    });
                    break;
                default:
                    break;
            }
        },
        currentTabsTable() {
            const curTable = this.form.templatePropertys.find(
                i => i.propertyGroupKey == this.activeName
            );
            return curTable;
        },
        promptUsers(row, key) {
            row[key] = 'flash';
            setTimeout(() => {
                delete row[key];
                this.tableKey++;
            }, 1000);
        },
        //更改差异
        changeDiff(type, item) {
            // 1.店铺差异  2.变体差异  3.是否必填  4.是否需要填写
            switch (type) {
                case 1:
                    item.storeFlag = item.storeFlag ? 0 : 1;
                    break;
                case 2:
                    item.variantsDifferenceFlag = item.variantsDifferenceFlag
                        ? 0
                        : 1;
                    break;
                case 3:
                    item.mustFlag = item.mustFlag ? 0 : 1;
                    item.writeFlag = item.mustFlag ? 1 : 0;
                    break;
                case 4:
                    // item.writeFlag = !item.writeFlag;
                    break;
                default:
                    break;
            }
        },

        handleTabs(tab, event) {
            console.log(tab, event);
        },
        saveTemp() {
            this.$refs.form.validate(valid => {
                const {
                    templateId,
                    type,
                    submitType,
                    systemCategoryId
                } = this.$route.query;
                if (valid) {
                    this.$api['product/categoryTemplatetUpdate']({
                        templateId: templateId * 1,
                        type: type * 1,
                        submitType: submitType * 1,
                        systemCategoryId: systemCategoryId * 1,
                        templateName: this.form.nickName,
                        templatePropertys: this.form.templatePropertys
                    }).then(() => {
                        this.$router.push({
                            path: '/product/common/setup/temp',
                            query: {
                                systemCategoryId
                            }
                        });
                    });
                } else {
                    return false;
                }
            });
        },
        init() {
            const { templateId, type } = this.$route.query;
            this.$api['product/categoryTemplatetInfo']({
                templateId,
                type
            }).then(res => {
                this.form = { ...res.rows };
                if (this.activeName == '0') {
                    this.activeName =
                        res.rows.templatePropertys[0].propertyGroupKey;
                }
                this.loading = false;
            });
        },
        disabled(boole) {
            return boole ? false : true;
        },
        renderIcon(boole) {
            return boole ? 'el-icon-check check' : 'el-icon-close close';
        }
    },
    computed: {
        platId() {
            return this.$route.query.platId;
        }
    },
    mounted() {
        this.init();
    }
};
</script>

<style lang="scss">
.tempEdit {
    .el-tabs--border-card {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0), 0 0 6px 0 rgba(0, 0, 0, 0) !important;
    }
    .check,
    .close {
        font-size: 24px;
    }
    .check {
        color: #4ba92b;
    }
    .close {
        color: #ed0233;
    }
    .el-dialog__body {
        height: calc(100% - 55px - 60px - 91px);
    }
}
</style>