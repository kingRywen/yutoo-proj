<template lang="html">
    <el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="form">     
            <div class="flex">
                <el-form-item label="品牌英文名称：" 
                    prop="brandNameEn"
                    :rules="[
                        {
                        required: true,
                        message: '请输入英文名称',
                        trigger: 'change'
                        }   
                    ]">
                  <el-input size="small" v-model="ruleForm.brandNameEn"/>
                </el-form-item>
                <el-form-item label="品牌中文名称：" prop="brandNameZh"
                    :rules="[
                        {
                        required: true,
                        message: '请输入中文名称',
                        trigger: 'change'
                        }
                    ]">
                  <el-input size="small" v-model="ruleForm.brandNameZh"/>
                </el-form-item>
            </div>

            <div class="flex border">
                <el-form-item label="品牌负责人：" prop="brandResponsible" :rules="[
                         {
                        required: true,
                        message: '请输入品牌负责人',
                        trigger: 'change'
                        }
                    ]">
                    <el-select size="small" v-model="ruleForm.brandResponsible">
                      <el-option v-for="list in userList" :label="list.nickName" :value="list.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌类型：" prop="brandType"
                    :rules="[
                         {
                        required: true,
                        message: '请输入品牌类型',
                        trigger: 'change'
                    }
                    ]">
                    <el-select size="small" v-model="ruleForm.brandType" >
                      <el-option label="第三方品牌" :value="1"></el-option>
                      <el-option label="自主品牌" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </div>            
            <el-form-item label="品牌logo：" class="upload-form-item border" required>              
                <el-upload class="upload"
                  ref="upload"
                  accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :multiple="false"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  list-type="picture"
                  :limit="1">
                  <el-button size="small" type="primary">选择图片</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="类别链接地址：" class="border">
                <el-input size="small" v-model="ruleForm.categoryLinkAddress"/>
            </el-form-item>
            <el-form-item label="页面标题：" class="border">
                <el-input size="small" v-model="ruleForm.pageTitle"/>
            </el-form-item>
            <el-form-item label="页面mate关键词：" class="pageTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.pageMateKeyword"/>
            </el-form-item>
            <el-form-item label="页面mate描述：" class="pageTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.pageMateDesc"/>
            </el-form-item>
            <el-form-item label="类别使用的页面模板：" class="border">
                <el-input size="small" v-model="ruleForm.pageModel"/>
            </el-form-item>
            <el-form-item label="品牌详细描述：" class="formTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.brandDetailDesc"/>
            </el-form-item>
            <el-form-item label="备注：" class="formTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.remark"/>
            </el-form-item>
            <div class="flex border">
                <el-form-item label="排序：" 
                    prop="ranking"
                    :rules="[
                        { required:ruleForm.ranking?true:false, message: '须为数字',type: 'number',trigger: 'change'}                  
                    ]">
                    <el-input size="small" v-model.number="ruleForm.ranking"  min="1" max="11"/>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.activationFlag" :true-label="1" :false-label="0">是否激活</el-checkbox>
                </el-form-item>
            </div>
        </el-form>
</template>

<script>
import { fetchData, handlerCode, showToast, showConfirm } from 'common/common'
import { isObj } from 'common/util'
import apis from 'apis'

export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        brandList: {
            type: Array,
            default: () => []
        },
        brandTypeList: {
            type: Array,
            default: () => []
        },
        openDialog: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        info: {
            handler(val) {
                if (!val) {
                    return
                }
                console.log(Object.keys(val).length)
                if (Object.keys(val).length) {
                    for (let k in this.ruleForm) {
                        for (let j in val) {
                            if (k === j) {
                                if (k == 'brandLogoImg') {
                                    this.fileList = [
                                        {
                                            name: 'logo',
                                            url: val.brandLogo
                                        }
                                    ]
                                    this.ruleForm.brandLogoImg = [] //val.brandLogo
                                    continue
                                }
                                this.ruleForm[k] = val[j]
                            }
                        }
                    }
                }
            },
            immediate: true
        }
    },
    created() {
        this.getUserList()
    },
    computed: {
        _openDialog: {
            get() {
                this.$nextTick(() => {
                    if (this.$refs.ruleForm.hasOwnProperty('resetFields')) {
                        this.$refs.ruleForm.resetFields()
                    }
                })
                return this.openDialog
            },
            set(val) {
                this.$emit('dialogCallback', val)
            }
        }
    },
    data() {
        return {
            userList: [],
            keywords: [],
            fileList: [],
            ruleForm: {
                brandNameEn: null,
                brandNameZh: null,
                brandResponsible: null,
                brandType: null,
                categoryLinkAddress: null,
                pageTitle: null,
                pageMateKeyword: null,
                pageMateDesc: null,
                pageModel: null,
                brandDetailDesc: null,
                remark: null,
                ranking: null,
                brandLogoImg: [],
                activationFlag: 1
            }
            // rules: {
            //     brandNameEn: [],
            //     brandNameZh: [],
            //     brandResponsible: [

            //     ],
            //     brandType: [

            //     ],
            //     logo: [
            //         {
            //             type: 'array',
            //             required: true,
            //             message: '请上传logo',
            //             trigger: 'change'
            //         }
            //     ]
            // }
        }
    },

    methods: {
        clearForm() {
            this.$refs.ruleForm.resetFields()
            this.$refs.upload.clearFiles()
            this.fileList = []
            this.ruleForm.brandLogoImg = []
        },
        // 验证敏感关键词
        setKeywords(data) {
            let vm = this
            // let arr = [];
            vm.keywords = []
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key]
                    if (isObj(element)) {
                        vm.setKeywords(element)
                    } else {
                        if (
                            key === 'brandNameEn' ||
                            key === 'brandNameZh' ||
                            key === 'pageMateKeyword' ||
                            key === 'pageMateDesc' ||
                            key === 'brandDetailDesc' ||
                            key === 'remark' ||
                            key === 'pageTitle'
                        ) {
                            vm.keywords.push(element)
                        }
                    }
                }
            }
        },

        async validKeyword(data) {
            this.setKeywords(data)
            let valis = await fetchData({
                ...apis.PRODUCT_KEY_WORD_VERIFY_1,
                data: { word: this.keywords.join(';') }
            })

            if (Object.keys(valis.data).length > 1) {
                let str = ``
                for (const key in valis.data) {
                    if (valis.data.hasOwnProperty(key)) {
                        const element = valis.data[key]
                        if (key === 'code') {
                            continue
                        }
                        str += '<p>' + key + ': ' + element + '</p>'
                    }
                }
                return str
            } else {
                return null
            }
        },

        async ok(productBrandId, done) {
            let vm = this

            if (productBrandId) {
                if (vm.fileList.length == 0) {
                    showToast('error', '请上传品牌logo')
                    return
                }
            } else {
                if (vm.ruleForm.brandLogoImg.length == 0) {
                    showToast('error', '请上传品牌logo')
                    return
                }
            }

            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    let res = await vm.validKeyword(vm.ruleForm)
                    if (res) {
                        showConfirm({
                            content: `您提交的表单信息中包含 <div class="text-error">${res}</div>是否继续？`,
                            title: '警告',
                            onOk() {
                                vm.save(productBrandId, done)
                            }
                        })
                        return
                    }

                    this.save(productBrandId, done)
                }
            })
        },
        save(productBrandId, done) {
            let vm = this
            vm.$root.$children[0].asyncConfirmLoading = true
            let data = new FormData()
            const {
                brandNameEn,
                brandNameZh,
                brandResponsible,
                brandType,
                brandLogoImg,
                categoryLinkAddress,
                pageTitle,
                pageMateKeyword,
                pageMateDesc,
                pageModel,
                brandDetailDesc,
                remark,
                ranking,
                activationFlag
            } = this.ruleForm

            data.append('brandNameEn', brandNameEn || null)
            data.append('brandNameZh', brandNameZh || null)

            if (brandResponsible) {
                data.append('brandResponsible', brandResponsible)
            }
            if (brandType) {
                data.append('brandType', brandType)
            }

            if (
                vm.ruleForm.brandLogoImg.length &&
                vm.ruleForm.brandLogoImg[0].raw
            ) {
                try {
                    data.append(
                        'brandLogoImg',
                        vm.ruleForm.brandLogoImg[0].raw || null
                    )
                } catch (error) {
                    data.append('brandLogoImg', null)
                }
            }
            data.append('categoryLinkAddress', categoryLinkAddress || null)
            data.append('pageTitle', pageTitle || null)
            data.append('pageMateKeyword', pageMateKeyword || null)
            data.append('pageMateDesc', pageMateDesc || null)
            data.append('pageModel', pageModel || null)
            data.append('brandDetailDesc', brandDetailDesc || null)
            data.append('remark', remark || null)
            data.append('ranking', ranking || 0)
            data.append('activationFlag', activationFlag)

            let url = { ...apis.PRODUCT_BRAND_SAVE }

            if (productBrandId) {
                data.append('productBrandId', productBrandId)
                // url = { ...apis.PRODUCT_BRAND_UPDATE }
            }

            fetchData({ ...url, data }).then(res => {
                vm.$root.$children[0].asyncConfirmLoading = false
                if (res.data.code == 0 && done) {
                    done(res)
                }
                handlerCode(res, () => {
                    vm.cancel()
                    vm.$listeners.set && vm.$listeners.set()
                })
            })
        },
        cancel() {
            this.$root.$children[0].asyncModalVisible = false
        },
        getUserList() {
            fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
                if (res.data.code === 0) {
                    res.data.rows.map(el => {
                        el.label = el.nickName || el.username
                        el.value = el.userId
                    })
                }
                this.userList = res.data.rows
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log(this.ruleForm)
                    // this.$emit('submitDialogForm', this.ruleForm)
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList, 123456)
            this.fileList = []
            this.ruleForm.brandLogoImg.length = 0
        },
        handleChange(file, fileList) {
            this.ruleForm.brandLogoImg = [file]
            this.fileList = fileList
        },
        handlePreview(file) {
            console.log(file)
        }
    }
}
</script>

<style lang="scss">
.form {
    height: 500px;
    overflow-y: auto;
    padding: 15px 10px 0 0;
}
.flex {
    display: flex;
    flex-direction: row;
    .el-form-item {
        flex: 1;
        .el-select {
            width: 100%;
        }
    }
}
.pageTextarea {
    .el-textarea__inner {
        height: 60px;
        resize: none;
        overflow-y: auto;
    }
}
.formTextarea {
    .el-textarea__inner {
        height: 130px;
        resize: none;
        overflow-y: auto;
    }
}
.upload-form-item {
    display: flex;
    align-items: center;
    .el-form-item__content {
        margin-left: 0 !important;
        line-height: 100px;
    }
}
.upload {
    display: flex;
    .el-upload {
        margin-right: 10px;
    }
    .el-upload__input {
        display: none;
    }
}
.border {
    border-top: 1px dashed #ccc;
    padding-top: 22px;
}
</style>
