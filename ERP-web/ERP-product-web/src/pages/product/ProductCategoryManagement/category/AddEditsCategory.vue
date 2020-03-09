<template lang="html">
    <div class="formContainer">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="125px" size="small">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="父级类目：">
                        <el-cascader
                            class="width100"
                            :props='categoryProps'
                            :options='categoryList'
                            v-model="form.parentId"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类目中文名称：" prop="nameCn">
                        <el-input v-model.trim='form.nameCn'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="类目英文名称：" prop="nameEn">
                        <el-input v-model.trim='form.nameEn'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="海关编码：">
                        <el-input v-model.trim='form.customsCode'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row :gutter="10">
                <!-- <el-col :span="12">
                    <el-form-item label="相关类目：">
                        <el-cascader
                            class="width100"
                            :props='categoryProps'
                            :options='categoryList'
                            v-model="form.relatedCateId"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-col> -->
                <el-col :span="12">
                    <el-form-item label="类目状态：" prop="name">
                        <el-radio-group v-model="form.lockFlag">
                            <el-radio-button label="0">正常显示</el-radio-button>
                            <el-radio-button label="1">锁定不显示</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="排序：" prop='sortNumber'>
                        <el-input v-model.number='form.sortNumber'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要开发负责人：">
                        <el-select class="width100" v-model.number='form.developPicId' @focus="getRelevant(27)" clearable>
                            <el-option v-for="item in roleInfo.developResponsible" :label="item.nickName" :value="item.userId"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要图片负责人：">
                        <el-select class="width100" v-model.number='form.imgPicId' @focus="getRelevant(25)" clearable>
                            <el-option v-for="item in roleInfo.imgResponsible" :label="item.nickName" :value="item.userId"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要编辑负责人：" >
                       <el-select class="width100" v-model.number='form.editPicId' @focus="getRelevant(27)" clearable>
                           <el-option v-for="item in roleInfo.developResponsible" :label="item.nickName" :value="item.userId"/>
                       </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要采购人：">
                        <el-select class="width100" v-model.number='form.purchasePicId' @focus="getRelevant(21)" clearable>
                            <el-option v-for="item in roleInfo.procurementRsponsible" :label="item.nickName" :value="item.userId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要财务负责人：">
                        <el-select class="width100" v-model.number='form.financePicId' @focus="getRelevant(30)" clearable>
                            <el-option v-for="item in roleInfo.financeRsponsible" :label="item.nickName" :value="item.userId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="类目描述：">
                        <el-input type="textarea" class="height" v-model='form.cateDesc'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="SEO标题：">
                        <el-input type="textarea" class="height" v-model='form.seoTitle'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="SEO关键字：">
                        <el-input type="textarea" class="height" v-model='form.seoKeyword'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item label="选择映射平台：" prop="userPlatform">
                        <div class="mapbox">
                            <el-checkbox-group v-model="form.userPlatform" >
                                <template v-for="item in platformLsit">
                                    <el-checkbox-button :label="item" class="mapItem">
                                        <img :src="item.logo"  width="100" height="80">
                                    </el-checkbox-button>
                                </template>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                {{homologousSiteList}}
                <el-col :span="12" :key="index" v-for="(platform,index) in homologousSiteList">
                    {{index}}
                    <el-form-item
                        :label="platform.platformName + '类目映射'"
                        v-if="platform.siteList.length"
                        :prop="'site.' + index"
                        :rules="{required: true, message: '请选择站点', trigger: 'change'}"
                        >
                        <el-checkbox-group v-model="form.site[index].site">
                            <el-checkbox-button :label="site" v-for="site in platform.siteList">{{site.siteNameZh}}</el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                {{form.site}}


                 <div v-for="(item,jindex) in form.site">
                     <p v-for="c in item">{{c.platformName}}</p>   
                </div>       



                <el-table
                    v-for="(item,index) in form.site"
                    :data="item.site"
                    border
                    style="width: 100%;margin-bottom:10px;"
                    v-if="item.site.length"
                    :key="index"
                >
                    <el-table-column prop="siteNameZh" label="国家" width="100" align="center"/>
                    <el-table-column prop="type" :label="item.platformName+'类型'" align="center">
                        <template slot-scope="scope">
  <p>{{scope.row.type}}</p>
  <p style="color: #f56c6c;font-size: 12px;" v-if="!scope.row.type && scope.row.flag">请选择{{scope.row.platformName}}类型</p>
</template>
                    </el-table-column>
                    <el-table-column width="280" label="操作" align="center">
                    <template slot-scope="scope">
  <el-button
    type="text"
    @click="selectPlatformType(scope.row.siteId,scope.row.platformId)"
  >选择{{scope.row.platformName}}类型</el-button>
  <el-button type="text" @click="emptyType(scope.$index)">清空</el-button>

  <div v-if="scope.row.type">
    <el-select v-model="scope.row.templateId" placeholder="选择模板" size="mini" clearable @focus="getTemplateList">
      <el-option :label="j.templateNameCh" :value="j.salePfTemplateId" v-for="j in templateList"></el-option>
    </el-select>
    <p style="color: #f56c6c;font-size: 12px;" v-if="!scope.row.templateId && !scope.row.flag">请选择模板</p>
  </div>
</template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-form>


        <!-- 选择平台对应的类型弹框 -->
        <el-dialog width="683px" title="选择类目" :visible.sync="treeDialog" class="selectTreeDialog" :modal-append-to-body="false">

            <p style="width:320px;margin:10px 0;display:flex">
              <el-input size="medium" v-model.trim="treeName" clearable>
              </el-input>
              <el-button type="primary" size="medium" @click="selectPlatformtree(1)" style="margin-left:10px;">搜 索</el-button>
            </p>
            
            <SyncCascader v-if="!treeName" ref="platformTree" v-model="userPTList" :props = "platformProps" :load = "loadTree" size="medium"/>

            <template v-if="treeName && platformTreeList.length">
  <el-table :data="platformTreeList" stripe style="width: 100%" :show-header="false">
    <el-table-column width="90">
      <template slot-scope="scope">
        <el-button
          size="mini"
          :disabled="!scope.row.haveTemplate"
          @click="selectTree(scope.row.categoryPath,scope.row.platformCategoryId)"
        >选择</el-button>
      </template>
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <p>{{scope.row.categoryName}}</p>
        <p>{{scope.row.categoryPath}}</p>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="text-align: center;position: absolute;left: 0;right: 0;bottom: 20px;"
    border
    @current-change="handleCurrentChangeTree"
    :current-page="currentPageTree"
    :page-size="20"
    layout="total, prev, pager, next"
    :total="totalTree"
  ></el-pagination>
</template>

            <div slot="footer" v-if="!treeName">
                <el-button style="width:200px;" type="primary" @click="userSelectTree">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getData } from 'common/http'
import { showToast, fetchData } from 'common/common'
import apis from 'apis'
import { BASE_URL, PERMS_URL } from 'common/config'
import SyncCascader from '@/components/base/SyncCascader.vue'
export default {
    data() {
        let vm = this
        return {
            treeName: null,
            userCategorylist: [],
            platformTreeList: [],
            totalTree: 0,
            currentPageTree: 1,
            treeDialog: false,
            userPTList: [],
            platformProps: {
                value: 'platformCategoryId',
                label: 'categoryName',
                children: 'childs',
                enabled: 'haveTemplate'
            },
            siteId: '',
            platformId: '',
            templateList: [],
            loadTree(id) {
                id = id ? id[id.length - 1] : -1
                return getData('CategoryPlatform/listChild', {
                    cateId: id,
                    siteId: vm.siteId
                }).then(res => {
                    if (res.data.code == 0) {
                        return res.data.cates.map(el => ({
                            ...el,
                            childs: el.childCount > 0 ? [] : null
                        }))
                    } else {
                        vm.$message.error(res.data.msg)
                    }
                })
            },

            form: {
                parentId: [],
                nameEn: null,
                nameCn: null,
                relatedCateId: [],
                customsCode: null,
                sortNumber: null,
                developPicId: null,
                imgPicId: null,
                editPicId: null,
                purchasePicId: null,
                financePicId: null,
                cateDesc: null,
                seoTitle: null,
                seoKeyword: null,
                lockFlag: 0,
                sourceType: 'Merchant',
                platformCategoryList: [1, 2, 3],
                userPlatform: [],
                site: []
            },

            rules: {
                nameCn: [
                    {
                        required: true,
                        message: '请输入中文名称',
                        trigger: 'blur'
                    }
                ],
                nameEn: [
                    {
                        required: true,
                        message: '请输入英文名称',
                        trigger: 'blur'
                    }
                ],
                sortNumber: [
                    { required: true, message: '序号不能为空' },
                    { type: 'number', message: '序号必须为数字值' }
                ],
                userPlatform: [
                    {
                        required: true,
                        message: '请选择平台',
                        trigger: ['blur', 'change']
                    }
                ]
            },
            categoryList: [],
            platformLsit: [],
            homologousSiteList: [],
            categoryProps: {
                value: 'categoryId',
                label: 'nameCn',
                children: 'childs'
            },
            roleInfo: {
                developResponsible: [],
                imgResponsible: [],
                procurementRsponsible: [],
                financeRsponsible: []
            }
        }
    },
    watch: {
        //选择映射平台变化时
        'form.userPlatform'(platform) {
            this.homologousSiteList = platform.map(item => {
                return {
                    platformName: item.platformName,
                    platformId: item.platformId,
                    siteList: item.siteList.map(citem => {
                        return {
                            siteId: citem.siteId,
                            siteNameZh: citem.siteNameZh,
                            type: '',
                            typeId: '',
                            flag: false,
                            templateId: '',
                            platformName: item.platformName,
                            platformId: item.platformId
                        }
                    })
                }
            })
            this.form.site = platform.map(item => {
                return {
                    platformName: item.platformName,
                    site: []
                }
            })
        }
    },
    methods: {
        handleCurrentChangeTree(val) {
            this.currentPageTree = val
            this.selectPlatformtree(0)
        },
        //平台类目搜索
        selectPlatformtree(val) {
            let params = {
                siteId: this.siteId,
                name: this.treeName,
                platformId: this.platformId,
                pageSize: 20,
                pageNumber: val ? 1 : this.currentPageTree
            }
            fetchData({ ...apis.CategoryPlatform, data: params }).then(res => {
                if (res.data.code == 0) {
                    this.totalTree = res.data.list.total
                    this.currentPageTree = res.data.list.pageNo
                    let data = res.data.list.rows
                    data.forEach(item => {
                        item.categoryPath = item.categoryPath.replace(
                            /:/g,
                            ' >> '
                        )
                    })
                    this.platformTreeList = data
                } else {
                    showToast('error', res.data.msg)
                }
            })
        },

        selectTree(name, id) {
            this.homologousSiteList.forEach(i => {
                i.forEach((j, index) => {
                    if (this.siteId == j.siteId) {
                        this.$set(j, 'type', name)
                        this.$set(j, 'typeId', id)
                    }
                })
            })
            this.treeDialog = false
        },
        //选择类目确定
        userSelectTree() {
            var typeArr = this.$refs.platformTree.getName()
            var type = typeArr.join(' >> ')
            var typeId = this.userPTList[this.userPTList.length - 1]
            let _this = this
            let userTemplate = null
            this.form.site.forEach(item => {
                item.forEach(citem => {
                    if (
                        _this.siteId == citem.siteId &&
                        citem.platformId == _this.platformId
                    ) {
                        console.log(citem)
                        if (typeId) {
                            citem.type = type
                            citem.typeId = typeId
                            citem.flag = false
                            citem.templateId = ''
                        } else {
                            citem.flag = true
                            citem.type = type
                            citem.typeId = typeId
                            citem.templateId = ''
                        }
                    }
                })
            })
            this.templateList = []
            this.treeDialog = false
            console.log(this.form.site)
        },
        //清空
        emptyType(index) {
            let _this = this
            this.form.site.forEach(item => {
                item.forEach(citem => {
                    if (
                        _this.siteId == citem.siteId &&
                        citem.platformId == _this.platformId
                    ) {
                        citem.type = ''
                        citem.typeId = ''
                        citem.templateId = ''
                        citem.flag = false
                    }
                })
            })
        },
        //选择类型
        selectPlatformType(siteId, platformId) {
            console.log(siteId, platformId)
            this.treeDialog = true
            this.siteId = siteId
            this.platformId = platformId
            this.userPTList = []
        },
        //提交后台
        submitServe(callback) {
            let parentId = this.form.parentId.length
                ? this.form.parentId[this.form.parentId.length - 1]
                : 1
            let platformCategoryList
            this.form.site.forEach(item => {
                platformCategoryList = item.map(citem => citem.typeId)
            })
            let params = {
                categoryM: {
                    parentId: parentId,
                    nameEn: this.form.nameEn,
                    nameCn: this.form.nameCn,
                    relatedCateId: this.form.relatedCateId.length
                        ? this.form.relatedCateId[
                              this.form.relatedCateId.length - 1
                          ]
                        : null,
                    customsCode: this.form.customsCode,
                    sortNumber: this.form.sortNumber,
                    developPicId: this.form.developPicId,
                    imgPicId: this.form.imgPicId,
                    editPicId: this.form.editPicId,
                    purchasePicId: this.form.purchasePicId,
                    financePicId: this.form.financePicId,
                    cateDesc: this.form.cateDesc,
                    seoTitle: this.form.seoTitle,
                    seoKeyword: this.form.seoKeyword,
                    lockFlag: this.form.lockFlag
                },
                sourceType: 'Merchant',
                platformCategoryList: platformCategoryList
            }

            this.http('CategoryM/save', params, res => {
                callback && callback(res)
            })
        },
        //验证表单
        submit(callback) {
            let _this = this
            this.$refs.ruleForm.validate(valid => {
                let arr = []
                //是否填写完整
                _this.form.site.forEach(item => {
                    item.forEach(citem => {
                        //有类型
                        if (citem.typeId) {
                            //有模板
                            // if(citem.templateId){
                            //     arr.push(true)
                            // }else{
                            //     arr.push(false)
                            // }
                            //无类型
                        } else {
                            citem.flag = true
                            arr.push(false)
                        }
                    })
                })
                let status = arr.every(item => item == true)
                if (valid && status) {
                    this.submitServe(data => {
                        callback && callback(data)
                    })
                } else {
                    this.$message.error('请填写完整在保存')
                    return false
                }
            })
        },
        //获取平台列表 =>站点列表
        getPlatformLsit() {
            this.http('platform/list/platform/site', {}, res => {
                // console.log(res.rows)
                this.platformLsit = res.rows
            })
        },
        //获取开发人员列表
        getRelevant(roleId) {
            //开发和编辑27 图片25 采购21 财务30
            let a = this.roleInfo.developResponsible.length
            let b = this.roleInfo.imgResponsible.length
            let c = this.roleInfo.procurementRsponsible.length
            let d = this.roleInfo.financeRsponsible.length
            switch (roleId) {
                case 27:
                    if (a) return
                    result(roleId, data => {
                        this.roleInfo.developResponsible = data
                    })
                    break
                case 25:
                    if (b) return
                    result(roleId, data => {
                        this.roleInfo.imgResponsible = data
                    })
                    break
                case 21:
                    if (c) return
                    result(roleId, data => {
                        this.roleInfo.procurementRsponsible = data
                    })
                    break
                case 30:
                    if (d) return
                    result(roleId, data => {
                        this.roleInfo.financeRsponsible = data
                    })
                    break
            }
            function result(roleId, callback) {
                getData(
                    'merchant/user/list/by/role',
                    { roleId },
                    PERMS_URL
                ).then(res => {
                    if (res.data.code == 0) {
                        callback && callback(res.data.rows)
                    }
                })
            }
        },
        //获取基础类目列表
        getCategoryList(keyword = '') {
            this.http('CategoryM/list', { keyword }, res => {
                // console.log(res)
                let data = res.category.childs
                function loop(arr) {
                    arr.forEach(el => {
                        if (0 === el.childs.length) {
                            delete el.childs
                        } else {
                            loop(el.childs)
                        }
                    })
                }

                loop(data)

                this.categoryList = data
            })
        },

        //获取模板
        getTemplateList() {
            if (this.templateList.length) return
            this.http(
                'product/plt/detail/module',
                {
                    siteCategoryId: this.userPTList[this.userPTList.length - 1]
                },
                res => {
                    this.templateList = res.categoryList
                }
            )
        },
        http(url, params, callback) {
            getData(url, params).then(res => {
                if (res.data.code == 0) {
                    callback && callback(res.data)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    },
    mounted() {
        this.getCategoryList()
        this.getPlatformLsit()
    },
    components: {
        SyncCascader
    }
}
</script>

<style lang="scss">
.formContainer {
    height: 584px;
    overflow-y: auto;
    padding-right: 10px;
    padding-bottom: 20px;
    .width100 {
        width: 100%;
    }
    .height {
        textarea {
            height: 80px;
        }
    }
    .mapbox {
        border: 1px solid #dcdfe6;
        padding: 10px;
        border-radius: 3px;
        label {
            margin-right: 15px !important;
        }
        .mapItem {
            span {
                padding: 0 !important;
                border: 0 solid #fff;
                img {
                    display: block;
                }
            }
        }
        .is-checked {
            padding: 0;
            border: 0 solid #fff;
            position: relative;
            &::after {
                content: url('../icon/check.png');
                position: absolute;
                left: 0;
                top: 0;
                width: 100px;
                height: 80px;
                background-color: rgba(0, 0, 0, 0.46);
            }
        }
    }
}
</style>
