<template>
    <div>
        <!-- 否定词 -->
		<div class="content">
			<div class="title">否定词</div>
			<div class='cont mainForm'>
				<el-form label-position="top" label-width="80px" :model="formData" ref='formData' :rules="rules">
					<el-form-item label="匹配类型" prop='keywordMatchingType'>
						<div class='select'>
						    <el-select v-model="formData.keywordMatchingType" placeholder="请选择" size='small' style='width:400px;'>
						        <el-option
						        v-for="item in matchingTypeOpt"
						        :key="item.value"
						        :label="item.label"
						        :value="item.value">
						        </el-option>
						    </el-select>
						</div>
					</el-form-item>
					<el-form-item prop='keywordInp'>
						<div class='inp'>
						    <el-input v-model.trim="formData.keywordInp" placeholder="请输入否定词，每行一个" type='textarea' :rows='12' size='small' style='width:900px;'></el-input>
						</div>						
					</el-form-item>
					<div v-if="isShowError" style="color: #f56c6c;font-size: 12px;">否定词只能输入字母、数字、单引号,请重新编辑留下的否定词!</div>
					<div class='word-length' v-if="keywordNum<=1000">
					    最多可以输入1000个否定词,已输入{{keywordNum}}个
					</div>
					<div class='word-length' v-else style="color: red;">
					    您已输入超过1000个否定词!
					</div>
				</el-form>             
			    <div class='add-btn'>
			        <el-button type="primary" size='small' plain @click='addKeywordMethod'>添加否定词</el-button>
			    </div>
			</div>
		</div>
		<div class="content" style="margin-top: 20px;">
			<div class='title'>已添加{{tableData.length}}个否定词</div>
			<div class='cont'>
			    <div class='label'>
			        <el-button type="primary" size='mini' plain @click="tableMethod('more')"  style="margin-left: -10px;">删除</el-button>
			        <el-button type="primary" size='mini' plain @click="tableMethod('all')">删除全部</el-button>
			        <el-button type="primary" size='mini' plain @click="tableMethod('edit')" v-if='!altermatchingTypeShow'>修改匹配类型</el-button>
			        <el-select v-model="alterKeywordType" placeholder="请选择" size='mini' style='width:150px;margin-left:10px;' v-if='altermatchingTypeShow'>
			            <el-option
			            v-for="item in matchingTypeOpt"
			            :key="item.value"
			            :label="item.label"
			            :value="item.value">
			            </el-option>
			        </el-select>
			        <el-button type="primary" size='mini' @click="tableMethod('editSubmit')"  v-if='altermatchingTypeShow'>确认修改</el-button>
			    </div>
			    <div class='inp'>
			        <el-table @selection-change="handleSelectionChange" :data="showTableList" style="width: 100%"  ref="tableRef" >
						<el-table-column type="selection"  width="55">
						</el-table-column>
						<el-table-column prop="keyword" label="否定词" width="250">
						</el-table-column>
						<el-table-column prop="ppType" label="匹配类型" width="250">
						</el-table-column>
						<el-table-column label="操作" >
							<template slot-scope="scope">
								<el-button type="primary" size="small" plain @click="tableMethod('single',scope.$index)" >删除</el-button>
							</template>
						</el-table-column>
					</el-table>
			    </div>
			    <div class='word-length'>
			        <el-pagination 
						align='left' 
						@size-change="handleSizeChange" 
						@current-change="handleCurrentChange" 
						:current-page="currentPage" 
						:page-sizes="[10,20,30,100]" 
						:page-size="pageSize"
						background
						layout="total, sizes, prev, pager, next, jumper" 
						:total="tableData.length">
					</el-pagination>
			    </div>
			</div>
		</div>    
    </div>
</template>

<script>
import { unique } from 'Utils/tools'
import { adKeywordsValidate } from 'Utils/customValid'
export default {
	props:['params'],
    data() {		
        return {
			tableData: [],
			selectionList:[],
			rules:{
				keywordInp:[
					{required:true,message:'请输入否定词名称',trigger:'blur'}
				],
				keywordMatchingType:[
					{required:true,message:'请选择匹配类型',trigger:'blur'}
				]
			},
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数

            //匹配类型
            matchingTypeOpt:[
                {label:'精确匹配',value:'negativeExact'},
                {label:'词组匹配',value:'negativePhrase'},
            ],
			formData:{
				keywordMatchingType:null,//否定词匹配类型
				keywordInp:'',//输入的否定词
			},
            
            altermatchingTypeShow:false,
            alterKeywordType:null,//修改否定词匹配类型
			isShowError:false,
        };
    },
    methods: {
		validateFn(){
			if(this.tableData && this.tableData.length){
				let keywords = []
				this.tableData.forEach((e)=>{
					keywords.push({
						keyword:e.keyword,
						matchType:e.matchType,
					})
				})
				return Promise.resolve(keywords)
			}else{
				return Promise.resolve(null)
			}
		},
		getOuterData(data){
			for (let i = this.tableData.length - 1; i >= 0; i--) {
				if (this.tableData[i].isOuter) {
					this.tableData.splice(i, 1);
				}
			}
			data.forEach(e=>{
				this.tableData.push({
					ppType:this.matchingTypeOpt.find(i=>i.value===e.matchType).label,
					...e
				})
			})
		},
        handleSizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
		handleSelectionChange(e){		
			this.selectionList = e
		},
		addKeywordMethod(){
			this.$refs.formData.validate().then(()=>{
				let form = this.formData
				//添加进来的新数据
				let newList = unique(form.keywordInp.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== ''))
				
				//验证每一条
				let reg = /^[ A-Za-z0-9\'-]*$/
				let successList = []
				let failList = []
				newList.forEach((e)=>{
					if(reg.test(e)){
						successList.push(e)
					}else{
						failList.push(e)
					}
				})
				
				
				//判断添加进来的否定词是否与表格的否定词相同
				let oldTableList = this.tableData.map((e)=>{return e.keyword})
				let filterNewList = successList.filter((e)=>{
					if(oldTableList.indexOf(e) === -1) return e
				})

				//添加进表格
				filterNewList.forEach(e=>{
					this.tableData.push({
						keyword:e,
						ppType:this.matchingTypeOpt.find(e=>e.value===form.keywordMatchingType).label,
						matchType:form.keywordMatchingType,
					})
				})
				filterNewList && filterNewList.length ? this.$message.success('添加成功') : failList.length ? this.idid = 1 : this.$message.warning('存在相同的否定词')
				
				//判断是否存在失败的否定词
				if(failList.length){
					form.keywordInp = failList.join('\n')
					this.isShowError = true
				}else{
					form.keywordInp = ''
					this.isShowError = false
				}

			}).catch(()=>{})
		},
		//表格操作按钮
		tableMethod(e,scopeIndex){
			let data = this.selectionList
			switch(e){
				case 'more':
					if(!data.length) return this.$message.warning('请选择至少一项')
					this.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
						let list = data.map((e)=>{return e.keyword})
						list.forEach(e=>{
							let delIndex = this.tableData.findIndex((i,index)=>{
								return i.keyword === e
							})
							this.tableData.splice(delIndex,1)
						})
						this.$message.success('删除成功')
					}).catch(()=>{})					
				break;
				case 'all':
					if(!this.tableData) return this.$message.warning('暂无可删除的数据')
					this.$confirm('此操作将删除全部,是否继续','提示',{type:'warning'}).then(()=>{
						this.tableData = []
						this.$message.success('删除成功')
					}).catch(()=>{})
				break;
				case 'edit':
					if(!data.length) return this.$message.warning('请选择至少一项')
					this.$set(this,'altermatchingTypeShow',true)
				break;
				case 'editSubmit':
					if(!this.alterKeywordType) return this.$message.warning('请选择要修改的匹配类型')
					this.$confirm('此操作将修改匹配类型,是否继续','提示',{type:'warning'}).then(()=>{
						let ppType = this.matchingTypeOpt.find(e=>e.value===this.alterKeywordType).label
						let ppValue = this.matchingTypeOpt.find(e=>e.value===this.alterKeywordType).value
						let list = data.map((e)=>{return e.keyword})
						list.forEach(e=>{
							let editIndex = this.tableData.findIndex((i,index)=>{
								return i.keyword === e
							})
							this.tableData[editIndex].ppType = ppType
							this.tableData[editIndex].matchType = ppValue	
						})
						this.$message.success('操作成功')
						this.$set(this,'altermatchingTypeShow',false)
						this.alterKeywordType = null
						this.$refs.tableRef.clearSelection()
					}).catch(()=>{})
				break;
				case 'single':
					this.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
						this.tableData.splice(scopeIndex,1)
						this.$message.success('删除成功')
					}).catch(()=>{})
				break;
			}
		}
    },
    computed:{
    	keywordNum(){
    		return this.formData.keywordInp.split(/[\n|\r\n|\,|\，]/)
    		.map(el => el.trim())
    		.filter(el => el !== '').length;
    	},
		showTableList(){
			return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
		}
    }
};
</script>

<style scoped lang="less">
@import '../css/common.less';
.tit{
	font-size: 18px;
	color:#333;
	padding-left: 4px;
	line-height: 40px;
	 border-bottom:1px solid #dcdcdc;
}
.cont{
	 margin-left: 4px;
	 position: relative;
	 .label{
		  margin: 10px 10px;
	 }
	 .select{
		 margin: 0 0;
	 }
	 .inp{
		  margin: 0 0;
	 }
	 .word-length{
		  margin: 0 0;
		  padding-bottom: 20px;
	 }
	 .add-btn{
		 position: absolute;
		 right: 16px;
		 bottom: 10px;
	 }
}
.item{
    position: relative;
    .cont{
        & > div{
            display: inline-block;
        }
    }
    .hint{
        position: absolute;
        left: 78px;
        top: 34px;
    }
}
</style>
