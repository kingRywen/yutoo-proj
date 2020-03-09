<template lang="html">
  <!-- 模板字段 -->
    <section class="uploading">
        <!-- <div style="padding:10px">
            <el-form :inline="true" :model="uploadingForm" class="demo-form-inline uploadingForm" size="medium">
                <el-form-item label="名称：">
                      <el-input v-model.trim='uploadingForm.name'/>
                </el-form-item>
                <el-form-item label="站点：">
                    <el-select v-model="uploadingForm.site">
                        <el-option v-for='item in siteLists' :label="item.siteNameZh" :value="item.siteId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目：">
                        <el-select v-model="uploadingForm.category">
                          <el-option label="区域一" value="shanghai"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item>
                      <el-upload class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :file-list="fileList"
                          list-type="picture">
                          <el-button size="medium" type="primary">上传模板</el-button>
                        </el-upload>
                </el-form-item>
            </el-form>
        </div> -->
           
            <el-tabs type="border-card" v-model="activeAttribute" @tab-click="changeAttribute" class="tabs">
                <el-tab-pane :name="item.nameCn" v-for="item in attributeList" :key="item.nameCn">
                     
                    <el-tooltip slot="label" effect="dark" :content="item.descCn" placement="top-start">
                        <span>{{item.nameCn}}</span>
                    </el-tooltip>                       
                        <fieldsTable
                            v-if="item.nameCn==activeAttribute"
                            :isLook="operate"
                            :fieldsData="fieldsData"
                            @del="ebayDel"
                            @add="ebayAdd"
                            @edit="ebayEdit"
                            @setfields="setfields"
                            @changeDifference="isChangeDifference"/>

                </el-tab-pane>
            </el-tabs>

        <el-dialog :title="dialogTitle" :visible.sync="fieldsDialog" v-if="fieldsDialog" center width="480px">
            <template v-if="defType">
           
                <PurchaseInputs :dateRange="defItem.dataRanges" :list="getSelectList" :item="{...defItem, controlType: defItem.propertyType}" :siteId="$route.params.siteId" :remoteMethod="remoteMethod" :platformId="$route.params.platformId" v-model="defValue" :bindField="bindField" sel-type="upload" />
            </template>
            <template v-else>
                <div class="demo-input-suffix" style="text-align: center;">
                选择字段来源：
                <el-select v-model="selectFields" @change="fieldsChange" size="medium">
                    <el-option v-for="(value,key) in fieldsInfo" :label="key"  :value="value"/>
                </el-select>
            </div>
            <!--  -->
            <template v-for="(item,index) in selectFields">
                <div class="sourceTable">
                    <h1 class="sourceTitle">
                        <span>{{item.categoryPath}}</span>
                        <!-- sourceInput -->
                        <span style="line-height:32px;">
                            <el-input
                                style="width:120px;"
                                size="mini"
                                prefix-icon="el-icon-search"
                                v-model.trim="item.searchName"
                                @input="sourceChange(item,index)">
                            </el-input>
                        </span>
                    </h1>
                    <el-table
                        height="350"
                        ref="sourceTable"
                        :data="item.searchName?item.arr:item.entities"
                        highlight-current-row
                        @row-click="handleRowClick"
                        @current-change="handleCurrentChange"
                        border style="width: 100%">
                        <el-table-column  type="index"  label="序号" align="center" width="80"></el-table-column>
                        <el-table-column  prop="propertyName" label="字段名称" align="center"></el-table-column>
                        <el-table-column  align="center" width="80" label="操作">
                            <template slot-scope="scope">
                                <input type="radio" :value="scope.$index" v-model="item.radio"></input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            </template>
            
            <!--  -->
            <span slot="footer">
                <el-button size="small" type="primary" @click="submitFields()">确 认{{defType ? null : ` 关 联`}}</el-button>
                <el-button size="small" v-if="$route.params.platformId!==2" type="primary" @click="submitFields(true)">应用到子类</el-button>
            </span>
        </el-dialog>
        <el-dialog
          title="提示"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>
          <div style="text-align:center">确定改变<span style="color:red">{{str}}</span>吗, 是否继续?</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="handleChange()" size="mini">确 定</el-button>
            <el-button type="primary" @click="handleChange(1)" size="mini">应用到子类</el-button>
          </span>
        </el-dialog>
        <!--  -->
        <el-dialog :title="ebayFields.title" :visible.sync="ebayFields.visible" top="8vh" center width="580px">
            <el-form :model="ebayForm" :rules="ebayRules" ref="ebayForm" label-width="100px" size="small" >
              <el-form-item label="中文名称：" prop="propertyNameZh">
                  <el-input v-model="ebayForm.propertyNameZh"></el-input>
              </el-form-item>
              <el-form-item label="英文名称：" prop="propertyName">
                  <el-input v-model="ebayForm.propertyName"></el-input>
              </el-form-item>
              <el-form-item label="关联字段：" prop="relMap">
                  <div :style="ebayForm.relMap.length?'border-color: #67c23a;':''" class="guanlzd"> 
                    <span v-for="i in ebayForm.relMap" style="padding-right:5px;">{{i.propertyName}}</span>
                    <el-button type="primary" plain size="small" style="position: absolute;top: -1px;right: -1px;" @click="ebaySetfields">选择关联字段</el-button>
                  </div>
              </el-form-item>
              <el-form-item label="字段类型：" prop="propertyType">
                  <el-select v-model.number="ebayForm.propertyType" placeholder="请选择字段类型" style="width:100%;" @change="changePropertyType">
                    <el-option :label="i.label" :value="i.value" v-for="i in propertyTypeList" :key="i.value"></el-option>                    
                  </el-select>
              </el-form-item>
              <!--  -->
              <transition name="el-zoom-in-top">
                <!--  -->
                <el-form-item v-if="ebayForm.propertyType==2 || ebayForm.propertyType==3 || ebayForm.propertyType==10 ||ebayForm.propertyType==11" label="字段长度：" prop="propertyLength">
                   <el-input v-model.number="ebayForm.propertyLength" type="number"></el-input>
                </el-form-item>
                <!--  -->
                <div v-if="ebayForm.propertyType==1" style="display: flex;">
                  <el-form-item label="yes自定义名称：" label-width="130px" prop="yesValue" style="flex:1">
                   <el-input v-model.trim="ebayForm.yesValue"></el-input>
                  </el-form-item>
                  <el-form-item  label="no自定义名称：" label-width="130px" prop="noValue" style="flex:1">
                    <el-input v-model.trim="ebayForm.noValue"></el-input>
                  </el-form-item>
                </div>


                <!-- 有选项时 -->
                <el-form-item v-if="ebayForm.propertyType==6 ||ebayForm.propertyType==7|| ebayForm.propertyType==8 ||ebayForm.propertyType==9 ||ebayForm.propertyType==12" label="选项值：" prop="propertyItem">
                    <el-tag                     
                      :key="option.itemValue"                      
                      v-for="(option,index) in propertyTypeOption"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(index)">
                      {{option.itemValue}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 点击添加</el-button>
                </el-form-item>  
              </transition>
              <!--  -->
              <el-form-item label="是否必填：" label-width="120px">                
                  <el-switch                    
                    v-model="ebayForm.mustFlag"   
                    active-value="1"
                    inactive-value="0"                
                    inactive-color="#ccc">
                  </el-switch>
              </el-form-item>
              <el-form-item label="是否店铺差异：" label-width="120px">                 
                  <el-switch                    
                    v-model="ebayForm.storeDisparityFlag"   
                    active-value="1"
                    inactive-value="0"                
                    inactive-color="#ccc">
                  </el-switch>
              </el-form-item>
              <el-form-item label="是否变体差异：" label-width="120px">                
                  <el-switch                    
                    v-model="ebayForm.variantsDisparityFlag"   
                    active-value="1"
                    inactive-value="0"                
                    inactive-color="#ccc">
                  </el-switch>
              </el-form-item>
              <el-form-item label="字段描述：" prop="propertyDesc">                
                  <el-input type="textarea" v-model="ebayForm.propertyDesc"></el-input>
              </el-form-item>
            
            </el-form>            
            <!--  -->
            <span slot="footer">
                <el-button size="small"  @click="ebayFields.visible=false">取 消</el-button>
                <el-button size="small" type="primary" @click="ebayFieldsSave">确认添加</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import { getData } from '@/common/http.js'
import FieldsTable from './fieldsTable.vue'
import PurchaseInputs from '@/pages/product/platformList/ebayEditLists/components/FormInputs.vue';
export default {
  data() {
    return {
      defValue: null,
      fileList: [],
      // sourceInput:null,
      // sourceList:[],
      uploadingForm: {
        name: '',
        site: '',
        category: ''
      },
      str: '',
      changeItem: {},
      centerDialogVisible: false,
      changeType: undefined,
      bindField:{
        label: 'propertyName',
        value: 'value',
        bindval: 'propertyName',
        type: 'dataType',
        inputType: 'propertyType',
        required: 'mustFlag'
      },
      dataList: [],
      defType:false,
      defItem: {},
      attributeList: [],
      activeAttribute: '必填项',
      fieldsData: [],
      fieldsDialog: false,

      dialogTitle: '',
      fieldsInfo: {},
      selectFields: null,
      radio: '',
      currentRow: null,
      tempPropRelId: null,
      relMap: [],
      operate: this.$route.params.operate,
      code: 0,
      propertyTypeList:[],
      propertyTypeOption:[],
      inputVisible: false,
      inputValue: '',
      ebayFields:{
          title:'',         
          visible:false,          
      },
      ebayForm:{
        propertyNameZh:'',
        propertyName:'',
        relMap:[],
        propertyType:'',
        propertyLength:null,
        propertyItem:[],
        mustFlag:0,
        storeDisparityFlag:0,
        variantsDisparityFlag:0,
        propertyDesc:null,
        yesValue:null,
        noValue:null
      },
      ebayRules:{
          propertyNameZh: [
            { required: true, message: '请输入中文名称', trigger: 'blur', },            
          ],
          propertyName: [
            { required: true, message: '请输入英文名称', trigger: 'blur',},            
          ],
          // relMap: [
          //   { required: true, message: '请选择关联字段', trigger: 'change',},            
          // ],
          propertyType: [
            { required: true, message: '请选择字段类型', trigger: 'change' },            
          ],
          propertyLength: [
            { required: true, message: '请输入字段长度', trigger: 'blur' },
          ],
          propertyItem: [
            { required: true, message: '请输入选项值', trigger: 'blur' },
          ],
          yesValue: [
            { required: true, message: '请输入yes自定义值', trigger: 'blur' },
          ],
          noValue: [
            { required: true, message: '请输入no自定义值', trigger: 'blur' },
          ],
          // propertyDesc: [
          //   { required: true, message: '请输入字段描述', trigger: 'blur'},     
          //   { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }       
          // ],
      },
      catePfPropertyMId:null,
      modelPropertyType:null
    }
  },
  watch:{
      // attributeList(val){        
      //   this.activeAttribute = this.activeAttribute?this.activeAttribute:(val[0].nameCn && val[0].nameCn)
      // }
      propertyTypeOption(val){
        this.ebayForm.propertyItem = val
        this.$nextTick(()=>{
          this.$refs.ebayForm.validateField(['propertyItem'])
        })
      }
  },
  mounted() {
    this.getTemplateAttribute({
      catePltTemplateId: this.$route.params.catePltTemplateId
    },true)
  },
  methods: {
    remoteMethod(searchKey, { catePltTempPropId:propertyId, modelPropertyType }) {
      let params = {searchKey, propertyId, modelPropertyType}
      let initial = [{
        itemValue: searchKey
      }]
     return getData('CatePfPropItemM/getPropItem', params).then(res => {
       if (res.data.code === 0) {
         return initial.push(...res.data.data)
       } else {
         return initial
       }
      })
    },
      changePropertyType(val){
        this.ebayForm.propertyItem = []
        this.propertyTypeOption = []
        this.ebayForm.propertyLength = null
        this.ebayForm.yesValue = null
        this.ebayForm.noValue = null
        
      },
      showInput() {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {          
          if(!this.propertyTypeOption.find(i=>i.inputValue)){
            this.propertyTypeOption.push({
              catePfPropItemId:null,
              itemDesc:null,
              itemKey:null,
              itemValue:inputValue,
              propertyName:null
            });
          }else{
            this.$message.warning('选项值请不要重复')             
          }          
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClose(index) {
        this.propertyTypeOption.splice(index, 1);
      },
      //选择关联字段
      ebaySetfields(){
        console.log(this.$route)
        this.fieldsDialog = true
        this.dialogTitle = "选择关联字段"
        let params = {
          templateId:this.$route.params.catePltTemplateId,
          tempPropRelId:12426,
          browseNode: this.$route.params.banner
        }     
        getData('BaseProductProp/listForIdAndName', params).then(res => {
          if (res.data.code == 0) {
            let obj = Object.assign({}, res.data.list)
            for (let key in obj) {
              if (obj[key] instanceof Array && obj[key].length) {
                obj[key].forEach(item => {
                  item['searchName'] = ''
                  item['arr'] = []
                  item['radio'] = ''
                })
              }
            }
            console.log(obj)
            this.fieldsInfo = obj
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      //确认添加字段
      ebayFieldsSave(){
        const vm = this
         this.$refs.ebayForm.validate((valid) => {
          if (valid) {             
              let params = Object.assign({},this.ebayForm,{
                templateId:this.$route.params.catePltTemplateId
              })
              params.mustFlag = Number(params.mustFlag)
              params.storeDisparityFlag = Number(params.storeDisparityFlag)
              params.variantsDisparityFlag = Number(params.variantsDisparityFlag)
              //是否                  
              let [yesValue,noValue] = [{
                  catePfPropItemId:null,
                  itemDesc:null,
                  itemKey:null,
                  itemValue:vm.ebayForm.yesValue,
                  propertyName:null
                },{                 
                  catePfPropItemId:null,
                  itemDesc:null,
                  itemKey:null,
                  itemValue: vm.ebayForm.noValue,
                  propertyName:null
                }]
              if(params.propertyType==1 && vm.ebayFields.title == "添加字段"){               
                params.propertyItem = [yesValue,noValue]                
              }else if(params.propertyType==1 && vm.ebayFields.title == "编辑字段"){               
                if(!params.propertyItem.length){
                  params.propertyItem = [yesValue,noValue]    
                }
              }
              if(vm.ebayFields.title == "添加字段"){
                vm.isAddOrEdit('CatePfPropertyM/Customize/property/save',params)
              }else{
                
                params = Object.assign({},params,{catePfPropertyMId:vm.catePfPropertyMId})
                vm.isAddOrEdit('CatePfPropertyM/Customize/property/update',params)
              }
          } else {           
            return false;
          }
        });
      },
      isAddOrEdit(url,params) {
        getData(url, params).then(res => {
          if(res.data.code==0){
            this.$message.success(res.data.msg)   
            this.ebayFields.visible = false              
            this.getTemplateAttribute({
                catePltTemplateId: this.$route.params.catePltTemplateId
            })                               
          }else{
            this.$message.error(res.data.msg)
          }              
        })       
      },
      ebayAdd(){
          this.ebayFields.title = "添加字段"
          this.ebayFields.visible = true       
          this.defType = false   
          this.$nextTick(()=>{
            this.$refs.ebayForm.resetFields();
          })
          this.getEabyPropertyType()
      },
      ebayEdit(info){        
        this.ebayFields.title = "编辑字段"
        this.ebayFields.visible = true
          this.defType = false
        
        this.catePfPropertyMId = info.catePltTempPropId
        this.getEabyPropertyType()
        const vm = this

        getData('CatePfPropertyM/Customize/property/find', {catePfPropertyMId:info.catePltTempPropId}).then(res => {
          if(res.data.code==0){           
            const {displayName,propertyName,controlType,storeDisparityFlag,variantsDisparityFlag,dataMaxLength,mustFlag,propertyDesc } = res.data.baseData
            
            vm.ebayForm.propertyNameZh = displayName
            vm.ebayForm.propertyName = propertyName
            vm.ebayForm.relMap = res.data.relData.map(i=>{
              return {
                propertyCategory:i.categoryId,
                propertyId: i.relevanceFieldsId,
                propertyName: i.relevanceFieldsName,
                propertyType: i.relevanceFieldsType
              }
            })
            vm.ebayForm.propertyType = Number(controlType)
            switch (controlType) {
              //是否
              case 1:
                vm.ebayForm.yesValue = res.data.itemData[0].itemValue
                vm.ebayForm.noValue = res.data.itemData[1].itemValue
                vm.ebayForm.propertyItem  = [...res.data.itemData]
                break;
              case 6:
                this.propertyTypeOption = [...res.data.itemData]
                break;
              case 7 :
                this.propertyTypeOption = [...res.data.itemData]
                break;
              case 8 :
                this.propertyTypeOption = [...res.data.itemData]
                break;
              case 9 :
                this.propertyTypeOption = [...res.data.itemData]
                break;
              case 12:
                break;
                this.propertyTypeOption = [...res.data.itemData]
                break;
              default:
                 this.propertyTypeOption = []
                break;
            }
               vm.ebayForm.propertyLength = dataMaxLength
               vm.ebayForm.mustFlag = mustFlag+''
               vm.ebayForm.storeDisparityFlag = storeDisparityFlag+''
               vm.ebayForm.variantsDisparityFlag = variantsDisparityFlag+''
               vm.ebayForm.propertyDesc =  propertyDesc                                     
          }else{
            this.$message.error(res.data.msg)
          }                    
        })
        
      },
      //ebay添加获取字段类型列表
      getEabyPropertyType(){         
          if(!this.propertyTypeList.length){
            getData('CatePfPropertyM/getPropertyType', {}).then(res => {
              if(res.data.code==0){
                this.propertyTypeList = res.data.data.map(i=>{
                  return {
                    label:i.name,
                    value:i.id
                  }
                })                
              }              
            })
          }
      },
      // 
      ebayDel(catePltTempPropIds){       
        getData('CatePfPropertyM/Customize/property/delete',{catePltTempPropIds}).then(res=>{
           if (res.data.code == 0) {
             this.$message.success(res.data.msg)
              this.getTemplateAttribute({
                catePltTemplateId: this.$route.params.catePltTemplateId
              })    
           }else{
             this.$message.error(res.data.msg)
           }
        })
      },
      getSelectList() {
          let {
              catePltTempPropId,propertyType,dataType
          } = this.defItem
          if (propertyType === 2) {
              return getData('CatePltTempPropSet/getPropItem', {"propertyId":catePltTempPropId}).then(res => res.data.list)
          } else if (dataType === 3) {
            //   日期
            if (this.dataList.length) {
                return Promise.resolve(this.dataList)
            } else {
                return getData('CatePltTempPropSet/getTimeTypeList', {}).then(res => res.data.list)
            }
          } else if (propertyType === 12) {
            return  Promise.resolve([])
          }  else if (propertyType === 18) {             
             return Promise.resolve([])
          } else{
              return null
          }
      },
    sourceChange(item, index) {
      item.arr = item.entities.filter(i => {
        return i.propertyName.indexOf(item.searchName) != -1
      })
    },
    //改变店铺差异和变体差异
    changeDifference(type, salePfTempPropRelId, flag, applicationAll) {
      let params = {
        templateId: this.$route.params.catePltTemplateId,
        salePfTempPropRelId: salePfTempPropRelId,
        propDiversity: type,
        flag: flag ? 0 : 1,
        applicationAll,
        modelPropertyType: this.changeItem.modelPropertyType
      }
      getData('CatePltTempPropSet/setTempPropDiversity', params).then(res => {
        if (res.data.code == 0) {
          this.centerDialogVisible = false
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
          this.getTemplateAttribute({
            catePltTemplateId: this.$route.params.catePltTemplateId
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //是否改变店铺差异和变体差异
    isChangeDifference(type, item) {
      if (!type) {
        type = 0
      }
      let _TYPE = ['店铺差异', '变体差异', '必填属性', '需要填写设置']
      // console.log(type,item)
      let str = _TYPE[type]
      this.changeType = type
      this.str = str
      this.changeItem = item
      this.centerDialogVisible = true
      // this.$confirm(`确定改变${str}吗, 是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true
      // })
      //   .then(() => {
      //     if (type == 1) {
      //       //2为变体差异
      //       this.changeDifference(
      //         2,
      //         item.catePltTempPropId,
      //         item.variantsDisparityFlag
      //       )
      //     } else if (type == 0) {
      //       //1为店铺差异
      //       this.changeDifference(
      //         1,
      //         item.catePltTempPropId,
      //         item.storeDisparityFlag
      //       )
      //     }  else if (type == 3) {
      //       // 是否需要填写
      //       this.changeDifference(
      //         6,
      //         item.catePltTempPropId,
      //         item.writeFlag
      //       )
      //     }else {
      //       this.changeDifference(4, item.catePltTempPropId, item.mustFlag)
      //     }
      //   })
      //   .catch(() => {})
    },
    handleChange(type) {
      if (this.changeType == 1) {
            //2为变体差异
            this.changeDifference(
              2,
              this.changeItem.catePltTempPropId,
              this.changeItem.variantsDisparityFlag,
              !!type
            )
          } else if (this.changeType == 0) {
            //1为店铺差异
            this.changeDifference(
              1,
              this.changeItem.catePltTempPropId,
              this.changeItem.storeDisparityFlag,!!type
            )
          }  else if (this.changeType == 3) {
            // 是否需要填写
            this.changeDifference(
              6,
              this.changeItem.catePltTempPropId,
              this.changeItem.writeFlag,!!type
            )
          }else {
            this.changeDifference(4, this.changeItem.catePltTempPropId, this.changeItem.mustFlag,!!type)
          }
    },
    //字段来源改变时
    fieldsChange(val) {
      console.log('字段来源改变时', val)
      val.forEach((item, index) => {
        let curindex = item.entities.findIndex(
          curitem => curitem.select == true
        )
        item.radio = curindex
        // this.currentRow = val[curindex];
      })
    },
    //确认关联字段
    submitFields(applicationAll) {
        if (this.defType) {
            let {catePltTempPropId} = this.defItem
             // 设置默认值
            getData('CatePltTempPropSet/setTempPropDiversity', { 
                templateId: this.$route.params.catePltTemplateId,
                salePfTempPropRelId: catePltTempPropId,
                applicationAll,
                 modelPropertyType: this.modelPropertyType,
                propDiversity: 5, "value" : this.defValue === '' ? null : this.defValue }).then(res => {
             if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })                
                this.getTemplateAttribute({
                  catePltTemplateId: this.$route.params.catePltTemplateId
                })
                this.fieldsDialog = false
              } else {
                this.$message.error(res.data.msg)
              }
            })
            return            
        }
        //是否选择字段来源    //设置关联字段
      if (this.selectFields) {
        // if (this.relMap.length) {
          
          let params =  {
            templateId: this.$route.params.catePltTemplateId,
            applicationAll,
            salePfTempPropRelId: this.tempPropRelId,
            relMap: this.relMap.length ? this.relMap : [],
            modelPropertyType: this.modelPropertyType
          } 
          //如果是ebay添加字段  
          if(this.$route.params.platformId==2 && this.ebayFields.visible){             
              this.ebayForm.relMap = [...this.relMap]
              this.fieldsDialog = false
              return
          }         
          getData('CatePltTempPropSet/setRelationProperty', params).then(
            res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.fieldsDialog = false
                this.getTemplateAttribute({
                  catePltTemplateId: this.$route.params.catePltTemplateId
                })
              } else {
                
                this.$message.error(res.data.msg)
              }
            }
          )
        // } else {
        //   this.$message.error('请选择需要关联的字段名称')
        // }
      } else {
        this.$message.error('请选择字段来源')
      }
    },
    //设置关联字段 //设置默认值
    setfields(templateId, tempPropRelId, name, type, row) {
        this.modelPropertyType = row.modelPropertyType
        let _TYPE = ['关联字段', '默认值']
        if (!type) {
            type = 0
            this.defType = false
            this.defItem = {}
        } else {
            this.defValue =  row.defValue || null
            this.defType = true
            this.defItem = row
        }
        
      this.dialogTitle = `设置${_TYPE[type]}-${name}`
      
      this.tempPropRelId = tempPropRelId
      this.selectFields = null
      this.relMap = []
      let params = {
        templateId,
        tempPropRelId,
        browseNode: this.$route.params.banner
      }
      this.fieldsDialog = true
      //获取关联字段
      getData('BaseProductProp/listForIdAndName', params).then(res => {
        if (res.data.code == 0) {
          let obj = Object.assign({}, res.data.list)
          for (let key in obj) {
            if (obj[key] instanceof Array && obj[key].length) {
              obj[key].forEach(item => {
                item['searchName'] = ''
                item['arr'] = []
                item['radio'] = ''
              })
            }
          }         
          this.fieldsInfo = obj
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleRowClick(val, event, column) {
      console.log(val, event, column);
      console.log(this.selectFields)
      let vm = this
      // this.selectFields.forEach((item, index) => {
      //   item.entities.forEach((curitem, curIndex) => {
      //     if (val.propertyId == curitem.propertyId) {
      //       if (item.radio === curIndex) {
      //         vm.$refs.sourceTable[0].setCurrentRow(val)
      //         vm.relMap = []
      //         item.radio = curIndex
      //       }
      //     } else {
      //       item.radio = curIndex
      //       vm.$refs.sourceTable[0].setCurrentRow(val)
      //     }
      //   })
      // })
      this.selectFields.forEach((item, index) => {
        item.entities.forEach((curitem, curIndex) => {
          if (val.propertyId == curitem.propertyId) {
            if (item.radio === curIndex) {
              vm.$refs.sourceTable[index].setCurrentRow()
              vm.relMap = []
              item.radio = null
              return
            }
            this.relMap = []            
            this.relMap.push({
              propertyCategory: item.categoryId,
              propertyId: curitem.propertyId,
              propertyType: curitem.relationProductPropType,
              propertyName:curitem.propertyName
            })
            item.radio = curIndex
          }
        })
      })
    },
    handleCurrentChange(val) {
      return
      console.log('当前项', val)
      console.log(this.selectFields)
      if (!val) {
        return
      }
      let vm = this
      // setCurrentRow
      this.selectFields.forEach((item, index) => {
        item.entities.forEach((curitem, curIndex) => {
          if (val.propertyId == curitem.propertyId) {
            // if (item.radio === curIndex) {
            //   debugger
            //   vm.$refs.sourceTable.setCurrentRow()
            //   vm.relMap = []
            //   item.radio = null
            //   return
            // }
            this.relMap = []
            this.relMap.push({
              propertyCategory: item.categoryId,
              propertyId: curitem.propertyId,
              propertyType: curitem.relationProductPropType
            })
            item.radio = curIndex
          }
        })
      })
      // this.currentRow = val;
    },
    //切换属性标签
    changeAttribute(tab) {
      this.attributeList.forEach((item, index) => {
        if (tab.name == item.nameCn) {
          this.code = index
          this.fieldsData = item.objects
        }
      })
    },
    //获取模板属性列表
    getTemplateAttribute(catePltTemplateId,isStart) {
      const vm = this
      getData(
        'CatePltTempPropSet/getTemplatePropertys',
        catePltTemplateId
      ).then(res => {
        if (res.data.code == 0) {          
          vm.attributeList = res.data.propertyList          
          vm.activeAttribute = isStart?vm.attributeList[0].nameCn: vm.activeAttribute
          
          vm.fieldsData = vm.attributeList[vm.code].objects
        } else {
          vm.$message.error(res.data.msg)
        }
      })
      return vm
    }
  },
  components: {
    FieldsTable,
    PurchaseInputs,
  }
}
</script>

<style lang="scss">
.uploadingForm {
  padding: 10px;
  border-radius: 5px;
  background-color: #f2f2f2;
  .el-form-item {
    margin: 0;
  }
  .upload-demo {
    position: relative;
    .el-upload__input {
      display: none;
    }
    .el-upload-list {
      position: absolute;
      left: 120px;
      top: -15px;
      z-index: 10;
      display: flex;
      li {
        height: 50px;
        width: 110px;
        padding: 10px;
        img {
          height: 34px;
          width: 34px;
          margin-left: 0;
        }
        a {
          width: 48px;
          height: 16px;
          line-height: 16px !important;
        }
      }
    }
  }
}
.guanlzd{
  border: 1px solid #dcdfe6;height:32px;border-radius: 4px;cursor: pointer;position: relative;padding-left:15px;
}
.sourceTable {
  margin-top: 15px;
  // height: 380px;
  // overflow-y: auto;
  .sourceTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    background: rgba(242, 242, 242, 1);
    height: 35px;
    line-height: 34px;
    padding: 0 10px;
    color: #333;
  }
}
.el-table__body tr.current-row > td {
  background: #108ee9;
  color: #333;
}
.tabs {
  box-shadow: 0 0 0 0;
}
.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
.button-new-tag {    
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;    
    vertical-align: bottom;
  }
</style>
