<template>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="海关编码：">
            <el-input v-model="form.customsCode" />
        </el-form-item>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-form-item label="主要开发负责人：" prop="region">
                    <el-select v-model.number="form.developUserId" placeholder="请选择开发负责人" class="w100">
                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in personInCharge.Develop" :key="index" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10" v-if="!childFlag">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="18">
                        <el-form-item label-width="0">
                            <el-checkbox v-model="checked[0]" :true-label="1" :false-label="0">是否更新它的下级目录</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0">
                            <el-button type="info" @click="updateCatalog(1)" :disabled="(checked[0] && form.developUserId)?false:true" class="w100">确认操作</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-form-item label="主要图片负责人：" prop="region">
                    <el-select v-model.number="form.imgUserId" placeholder="请选择图片负责人" class="w100">
                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in personInCharge.Image" :key="index" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10" v-if="!childFlag">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="18">
                        <el-form-item label-width="0">
                            <el-checkbox v-model="checked[1]" :true-label="1" :false-label="0">是否更新它的下级目录</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0">
                            <el-button type="info" @click="updateCatalog(2)" :disabled="(checked[1] &&form.imgUserId) ?false:true" class="w100">确认操作</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-form-item label="主要编辑负责人：" prop="region">
                    <el-select v-model.number="form.editUserId" placeholder="请选择编辑负责人" class="w100">
                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in personInCharge.Edit" :key="index" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10" v-if="!childFlag">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="18">
                        <el-form-item label-width="0">
                            <el-checkbox v-model="checked[2]" :true-label="1" :false-label="0">是否更新它的下级目录</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0">
                            <el-button type="info" @click="updateCatalog(3)" class="w100" :disabled="checked[2]&& form.editUserId?false:true">确认操作</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-form-item label="主要采购负责人：" prop="region">
                    <el-select v-model.number="form.purchaseUserId" placeholder="请选择采购负责人" class="w100">
                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in personInCharge.Purchase" :key="index" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10" v-if="!childFlag">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="18">
                        <el-form-item label-width="0">
                            <el-checkbox v-model="checked[3]" :true-label="1" :false-label="0">是否更新它的下级目录</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0">
                            <el-button type="info" @click="updateCatalog(4)" class="w100" :disabled="(checked[3]&& form.purchaseUserId)?false:true">确认操作</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="14">
                <el-form-item label="主要财务负责人：" prop="region">
                    <el-select v-model.number="form.financeUserId" placeholder="请选择开发负责人" class="w100">
                        <el-option :label="item.label" :value="item.value" v-for="(item,index) in personInCharge.Finance" :key="index" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="10" v-if="!childFlag">
                <el-row type="flex" class="row-bg" justify="space-between">
                    <el-col :span="18">
                        <el-form-item label-width="0">
                            <el-checkbox v-model="checked[4]" :true-label="1" :false-label="0">是否更新它的下级目录</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0">
                            <el-button type="info" @click="updateCatalog(5)" :disabled="(checked[4] && form.financeUserId)?false:true" class="w100">确认操作</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--  -->
        <el-form-item label="类目映射：">
            <el-radio-group v-model="platform" @change="changePlatform">
                <el-radio-button :label="item.platName" v-for="(item,index) in form.systemCategoryMapArray" :key="index"></el-radio-button>
            </el-radio-group>
        </el-form-item>
        <!--  -->
        <el-form-item>
            <yt-table :data="countriesList" :columns="columns" border :selection="false" />
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    props: ['id', 'childFlag'],
    data() {
        return {
            checked: [false, false, false, false, false],
            personInCharge: {
                Develop: [],
                Image: [],
                Edit: [],
                Purchase: [],
                Finance: []
            },
            platform: null,
            form: {
                customsCode: '',
                developUserId: null,
                imgUserId: null,
                editUserId: null,
                purchaseUserId: null,
                financeUserId: null,
                systemCategoryMapArray: []
            },
            rules: {},
            countriesList: []
        };
    },
    computed: {
        columns() {
            const _this = this;
            return [
                {
                    label: '国家',
                    value: 'country',
                    width: 250,
                    align: 'center'
                },
                {
                    renderHeader() {
                        return <span>{_this.platform + '类型'}</span>;
                    },
                    value: 'path',
                    align: 'center'
                }
            ];
        }
    },
    watch: {
        form: {
            handler(val) {
                if (val.systemCategoryMapArray.length) {
                    this.platform = val.systemCategoryMapArray[0].platName;
                    this.countriesList =
                        val.systemCategoryMapArray[0].platMapArray;
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        _submit() {
            return this.$api['product/categorytEditupdate']({
                ...this.form
            });
        },
        updateCatalog(userType) {
            const {
                developUserId,
                imgUserId,
                editUserId,
                purchaseUserId,
                financeUserId,
                cateSystemCategoryId
            } = this.form;
            const obj = {
                1: developUserId,
                2: imgUserId,
                3: editUserId,
                4: purchaseUserId,
                5: financeUserId
            };
            this.$api['product/categorytEditupdateUser']({
                userType,
                cateSystemCategoryId: cateSystemCategoryId,
                userId: obj[userType]
            }).then(res => {
                this.$message.success(res.msg);
            });
        },
        changePlatform(v) {
            const result = this.form.systemCategoryMapArray.filter(
                i => i.platName == v
            );
            console.log(result);

            if (result.length) this.countriesList = result[0].platMapArray;
        },
        async init() {
            await this.getPersonInCharge();
            this.$api['product/interestedCategorytInfo']({
                id: this.id
            }).then(res => {
                this.form = { ...res.rows };
            });
        },
        getPersonInCharge() {
            this.$api['product/permissionList']({
                types: Object.keys(this.personInCharge)
            }).then(res => {
                res.rows.forEach(item => {
                    this.personInCharge[item.type] = item.users.map(i => {
                        return {
                            label: i.userName,
                            value: i.userId * 1
                        };
                    });
                });
            });
        }
    },
    mounted() {
        this.init();
    }
};
</script>
<style lang="scss" scoped>
.w100 {
    width: 100%;
}
</style>