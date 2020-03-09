<template>
    <div>
        <div>
            <div>
				<div>
				    <el-input v-model.trim="searchKeyword" size="mini" style="width: 200px;" clearable></el-input>
				    <el-button type="primary" size='mini' @click="searchMethod()" style="margin-left: 15px;">搜索</el-button>
				</div>
                <div style="margin-top: 15px;">
                    <el-button type="primary" size='mini' plain @click="tableMethod('edit')" style="margin-left:0px;" v-if='!altermatchingTypeShow' >修改匹配类型</el-button>
                    <el-select v-model="alterKeywordType" placeholder="请选择" size='mini' style='width:150px;margin-left:0px;' v-if='altermatchingTypeShow'>
                        <el-option
                        v-for="item in matchingTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size='mini' @click="tableMethod('editSubmit')"  v-if='altermatchingTypeShow'>确认修改</el-button>
                </div>
                <div style="margin-top: 15px;">
                    <el-table @selection-change="handleSelectionChange" :data="showTableList" style="width: 100%" ref="tableRef" >
						<el-table-column type="selection"  width="55">
						</el-table-column>
						<el-table-column prop="keyword" label="关键词" width="350">
						</el-table-column>
						<el-table-column prop="negativeStatus" label="类型">
							<template slot-scope="scope">
								{{scope.row.negativeStatus | formatDataStatus}}
							</template>
						</el-table-column>
					</el-table>
                </div>
                <div>
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
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页的数据条数

            //匹配类型
            matchingTypeOpt:[
                {label:'忽略',value:0},
                {label:'产品精确否定',value:1},
                {label:'产品词组否定',value:2},
				{label:'产品系列精确否定',value:3},
				{label:'产品系列词组否定',value:4},
				{label:'所有系列精确否定',value:5},
				{label:'所有系列词组否定',value:6}
            ],
            
            altermatchingTypeShow:false,
            alterKeywordType:null,//修改关键词匹配类型
			searchKeyword:'',
        };
    },
    methods: {
		_submit(){
			if(!this.params.finishList.length) return this.$message.warning('请添加至少一项数据')
			let params = {
				...this.params.outerParams,
				filterList:this.params.finishList
			}
			return this.$api['categoryKeywordNegativeFilter'](params).then(()=>{
				this.params.fn()
				return Promise.resolve('close')
			})
		},
		searchMethod(){
			if(this.searchKeyword == '') return this.tableData = this.params.finishList
			this.tableData = this.params.finishList.filter(e=>{
				return e.keyword.includes(this.searchKeyword)
			})
		},
		getData(){
			let [...arr] = this.params.finishList
			this.tableData = arr
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
		//表格操作按钮
		tableMethod(e,scopeIndex){
			let data = this.selectionList
			switch(e){
				case 'edit':
					if(!data.length) return this.$message.warning('请选择至少一项')
					this.$set(this,'altermatchingTypeShow',true)
				break;
				case 'editSubmit':
					if(this.alterKeywordType == null) return this.$message.warning('请选择要修改的类型')
					this.$confirm('此操作将修改类型,是否继续','提示',{type:'warning'}).then(()=>{
						let ppValue = this.matchingTypeOpt.find(e=>e.value===this.alterKeywordType).value
						let list = data.map((e)=>{return e.keyword})
						list.forEach(e=>{
							let editIndex = this.tableData.findIndex((i,index)=>{
								return i.keyword === e
							})
							this.tableData[editIndex].negativeStatus = ppValue	
						})
						this.$message.success('操作成功')
						this.$set(this,'altermatchingTypeShow',false)
						this.alterKeywordType = null
						this.$refs.tableRef.clearSelection()
					}).catch(()=>{})
				break;
			}
		}
    },
    computed:{
		showTableList(){
			return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
		}
    },
	mounted(){
		this.getData()
	},
	filters:{
		formatDataStatus(e){
			return e == 0 ? '忽略' 
				:  e == 1 ? '产品精确否定'
				:  e == 2 ? '产品词组否定'
				:  e == 3 ? '产品系列精确否定'
				:  e == 4 ? '产品系列词组否定'
				:  e == 5 ? '所有系列精确否定'
				:  e == 6 ? '所有系列词组否定'
				:  '-'
		}
	}
};
</script>
