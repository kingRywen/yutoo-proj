<template>
	<div class="box" v-loading="maxLoading">
		<el-row class="handle-template">
			<el-col :span="24">
				<el-popover placement="right" width="270" trigger="click">
					<div class="flex">
						<el-input size="mini" placeholder="请输入1~30的数字" v-model.trim.number="imgNum" style="margin-right:6px; flex:1">
							<template slot="append">张</template>
						</el-input>
						<el-button size="mini" type="primary" @click="setPicMethod" :loading="$store.state.isloading || $store.state.loading">确认</el-button>
					</div>
					<div slot="reference">
						<el-button type="text" icon="el-icon-setting" style="margin-right:10px;">图片缓存设置</el-button>
					</div>
				</el-popover>
			</el-col>
		</el-row>

		<div v-if="!noData" class="wrapper">
			<el-row type="flex">
				<el-col :span="4" style="display: flex;align-items: center;">
					{{showData.keywordTextEN}}
				</el-col>
				<el-col :span="20">
					<el-button type="primary" plain size="mini" @click="buttonEvent('copy')">复制关键词</el-button>
					<el-button type="primary" plain size="mini" @click="buttonEvent('translate')">翻译</el-button>
					<el-button type="primary" plain size="mini" @click="buttonEvent('start')" v-if="!isShowBtn">开始筛选</el-button>
					<el-button type="primary" plain size="mini" @click="buttonEvent('submit')" v-else style="color: red;">待提交已筛选关键词({{finishIndex}})</el-button>
				</el-col>
			</el-row>
			
			<el-row type="flex" style="margin-top: 12px;">
				<el-col :span="4" style="display: flex;align-items: center;">
					<span v-if="isShowText">{{showData.keywordTextCN}}</span>					
				</el-col>
				<el-col :span="20">
					<div v-if="isShowBtn && finishBtn">
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',0)" :loading="btnLoading">忽略(Q)</el-button>
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',1)" :loading="btnLoading">产品精确否定(W)</el-button>
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',2)" :loading="btnLoading">产品词组否定(A)</el-button>
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',3)" :loading="btnLoading">产品系列精确否定(S)</el-button>
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',4)" :loading="btnLoading">产品系列词组否定(E)</el-button>
						<el-button type="primary" plain size="mini" @click="buttonEvent('filterMethod',5)" :loading="btnLoading">所有系列精确否定(D)</el-button>
						<el-button type="primary" plain size="mini" @click="('filterMethod',6)" :loading="btnLoading">所有系列词组否定(V)</el-button>
					</div>					
				</el-col>
			</el-row>

			<div class="key-row-1">
				<div class="column-1">有效词根</div>
				<div class="column-2">{{showData.valid && showData.valid.length ? showData.valid.join(',') : ''}}</div>
			</div>
			<div class="key-row-2">
				<div class="column-1">无效词根</div>
				<div class="column-2">{{showData.invalid && showData.invalid.length ? showData.invalid.join(',') : ''}}</div>
			</div>
			<div style="display:flex;justify-content:flex-end;margin-top:10px;">{{finishIndex}}/{{viewTotal}}</div>
			<div>
				<div>
					<div>
						<div v-if="showData.showImgUrls.length>0" class='img-flex-comnt'>
							<div v-for="item in showData.showImgUrls" :key="item.imageUrl" class='img-flex-item'>
								<div class='img-div'>
									<img :key="item.imageUrl" class='item-img  loadingImg' v-lazy="item.imageUrl">
								</div>
								<el-tooltip :content="item.title" placement="top" effect="light">
									<p class='p1'>{{item.title}}</p>
								</el-tooltip>
							</div>
						</div>
						<div v-if="!(showData.showImgUrls.length>0)" style="width:100%;text-align: center;color: #909399;font-size: 14px;">暂无缓存图片</div>
					</div>
				</div>
			</div>

		</div>

		<div v-else="noData" class="no-data" style="height: 100vh;margin-right:10px;font-size:18px;">
			<div style='line-height:60vh'>
				暂无数据
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:['pParams'],
		data(){
			return {
				maxLoading:false,
				imgNum:10,
				noData:true,
				showData:{
					keywordTextEN:null,
					keywordTextCN:null,
					valid:[],
					invalid:[],
					showImgUrls:[],
				},			
				isShowText:false,
				isShowBtn:false,
				finishBtn:true,
				finishIndex:0,
				getIndex:0,
				viewTotal:0,
				finishList:[],
				btnLoading:false,
			}
		},
		methods:{
			parentFn(){
				console.log('提交成功')
				this.finishIndex = 0
				this.getIndex = 0
				this.finishList = []
				this.getData()
			},
			setPicMethod(){
				if(this.imgNum < 1 || this.imgNum > 30) return this.$message.warning('只能输入1-30的数字')
				this.setSingleData()
			},
			buttonEvent(type,num){
				let vm = this
				switch(type){
					case 'copy':
						if(!vm.showData.keywordTextEN) return vm.$message.error('暂无要复制的关键词')
						vm.$copyText(vm.showData.keywordTextEN).then(()=>{
							vm.$message.success('复制成功')
						}).catch(()=>{vm.$message.error('复制失败')})							
					break;
					case 'translate':
						if(!vm.showData.keywordTextEN) return vm.$message.error('暂无要翻译的关键词')
						vm.$api['categoryKeywordTranslateToChines']({keywordText:vm.showData.keywordTextEN}).then((res)=>{
							vm.showData.keywordTextCN = res.data
							vm.isShowText = true
						}).catch(()=>{vm.$message.error('翻译失败')})
					break;
					case 'start':
						vm.isShowBtn = !vm.isShowBtn
					break;
					case 'submit':
						vm._openDialog({
							title:'待提交已筛选关键词',
							width: '800px',
							params: {
								params:{
									finishList:vm.finishList,
									outerParams:vm.outerParams,
									fn:vm.parentFn,
								}
							},
							component: () => import('Views/KeyLexicon/KeyLexicon/dialog/submitKeyword.vue'),
							okBtnText:'提交',
							cancelBtnText:'取消'
						})
					break;
					case 'filterMethod':
						vm.finishList.push({
							keyword:vm.showData.keywordTextEN,
							negativeStatus:num,
						})
						vm.finishIndex = vm.finishIndex + 1
						vm.getIndex = vm.getIndex + 1
						vm.$message.success('操作成功')
						vm.$nextTick(function(){
							if(vm.finishIndex === vm.viewTotal){
								vm.setSingleData('clear')
								vm.finishBtn = false
							}else{
								vm.setSingleData()	
							}
							if(vm.viewTotal > 30 && vm.getIndex > 24){
								vm.getIndex = 0
								vm.getData()
							}						
						})						
					break;
				}
			},
			getData(){
				let params = { ...this.outerParams, index:this.finishIndex }
				this.maxLoading = true
				this.$api['categoryKeywordGetFilterKeywordNegative'](params).then((res)=>{
					let data = this.deepCopyGlobal(res.data)				
					if(data.total && data.total > 0){
						this.noData = false
						this.allData = data
						if(this.finishIndex == 0){
							this.setSingleData()						
						}
						this.viewTotal = data.total
						//预加载图片
						//先预加载要展示的图片,等完成后,再预加载后面的图片
						let preLoads = data.imageUrls.filter(e=>e.keyword === data.keywordList[this.getIndex].keywordText).slice(0, this.imgNum)
						let promiseAll = preLoads.map(el => (new Promise((resolve, reject) => {
							let _img = new Image()
							_img.onload = () => { resolve() }
							_img.onerror = () => { resolve() }
							_img.src = el.imageUrl
						})))
						Promise.all(promiseAll).then(img => {
							this.preLoadsMethod(data.imageUrls.map(e=>e.imageUrl))
						}).catch(() => {
							this.preLoadsMethod(data.imageUrls.map(e=>e.imageUrl))
						})					
					}else{
						this.noData = true
					}
					this.maxLoading = false
				}).catch(()=>{					
					this.maxLoading = false					
				})
			},
			setSingleData(type){
				let data = this.deepCopyGlobal(this.allData)
				if(type === 'clear'){
					this.showData = {
						keywordTextEN:null,
						keywordTextCN:null,
						valid:[],
						invalid:[],
						showImgUrls:[],
					}
					return
				}
				this.showData = {
					keywordTextEN:data.keywordList[this.getIndex].keywordText,
					keywordTextCN:null,
					valid:data.keywordList[this.getIndex].valid,
					invalid:data.keywordList[this.getIndex].invalid,
					showImgUrls:data.imageUrls.filter(e=>e.keyword === data.keywordList[this.getIndex].keywordText).slice(0, this.imgNum),
				}
				console.log(this.showData.showImgUrls)
			},
			preLoadsMethod(arr){
				arr.forEach(img => {
					let _img = new Image()
					_img.src = img
				})
			},
			bindKey(event){
				let vm = this
				if (vm.isShowBtn && vm.finishBtn) {
					let key = event.keyCode;
					switch(key){
						case 81:
							vm.buttonEvent('filterMethod',0)
						break;
						case 87:
							vm.buttonEvent('filterMethod',1)
						break;
						case 65:
							vm.buttonEvent('filterMethod',2)
						break;
						case 83:
							vm.buttonEvent('filterMethod',3)
						break;
						case 69:
							vm.buttonEvent('filterMethod',4)
						break;
						case 68:
							vm.buttonEvent('filterMethod',5)
						break;
						case 86:
							vm.buttonEvent('filterMethod',6)
						break;
					}
				}
			}
			
		},
		computed:{
			outerParams(){
				return {
					siteId:this.siteId,
					cusCateId:this.pParams.cusCateId,
					productId:this.pParams.productId,
					sellerId:this.sellerId
				}
			}
		},
		mounted(){
			this.getData()
			window.onbeforeunload = function (e) {
				e = e || window.event;
				if (e) {
				e.returnValue = '关闭提示';
				}
				return '关闭提示';
			}
		},
		created() {		
			this.__event = event => this.bindKey(event)
			document.addEventListener('keydown', this.__event)
		},
		beforeDestroy(){
			document.removeEventListener('keydown', this.__event)
			this.__event = null
			window.onbeforeunload = null
		},
	}
</script>

<style lang="less" scoped>
	.img-flex-comnt {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;

		.img-flex-item {
			width: 16%;
			height: 300px;

			.img-div {
				width: 100%;
				overflow: hidden;
				height: 60%;

				.item-img {
					display: block;
					width: 100%;
					height: 100%;
					object-fit: contain
				}
			}

			p {
				width: 90%;
				margin: 0 auto;
				text-align: center;
				margin-top: 10px;
			}

			.p1 {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
		}
	}

	.box {
		/deep/.addkeywordBtn {
			i {
				font-size: 16px;
			}
		}
		min-height: 800px;
		height: auto;

		.handle-template {
			.el-col {
				display: flex;
				justify-content: flex-end;
			}

			/deep/.el-icon-setting,
			/deep/.el-icon-upload {
				font-size: 16px;
			}
		}

		.wrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.key-row-1 {
			margin-top: 10px;
		}

		.key-row-1,
		.key-row-2 {
			display: flex;
			font-size: 12px;
			color: #606266;

			.column-1 {
				text-align: center;
				width: 150px;
				padding: 8px;
				font-weight: bold;
			}

			.column-2 {
				width: 100%;
				padding: 8px;
				border-left: 1px solid @borderColor;
			}
		}

		.key-row-1 {
			border: 1px solid @borderColor;
		}

		.key-row-2 {
			border-left: 1px solid @borderColor;
			border-right: 1px solid @borderColor;
			border-bottom: 1px solid @borderColor;
		}

		.no-data {
			text-align: center;
			color: #909399;
			font-size: 14px;
		}

		.Key-words-dialog {
			/deep/.el-dialog__header {
				border-bottom: 1px solid @borderColor;
			}

			/deep/.el-dialog__title {
				font-size: 18px;
			}

			.el-select {
				width: 360px;
			}

			.dialog-footer {
				display: flex;
				justify-content: center;
			}
		}
	}

	.flex {
		display: flex;
		justify-content: center;
	}

	.upload-dialog {
		/deep/.el-upload {
			display: flex;
			justify-content: center;
			margin-bottom: 20px;
		}

		.el-upload__tip {
			display: flex;
			justify-content: center;
			margin-bottom: 10px;
		}
	}

	.keyword-textbtn {
		user-select: auto;
	}

	img.loadingImg[lazy='loaded'] {
		background: none !important;
	}
</style>

