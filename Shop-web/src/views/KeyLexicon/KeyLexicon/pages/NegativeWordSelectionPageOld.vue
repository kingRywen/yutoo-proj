<template>
	<div class="box" v-loading="loading">
		<el-row class="handle-template">
			<el-col :span="24">
				<el-popover placement="right" width="270" v-model="setImgNum" @hide="handleShowImgNum">
					<div class="flex">
						<el-input size="mini" placeholder="请输入1~30的数字" v-model.number="imgNum" style="margin-right:6px; flex:1">
							<template slot="append">张</template>
						</el-input>
						<el-button size="mini" type="primary" @click="setNum" :loading="$store.state.isloading || $store.state.loading">确认</el-button>
					</div>
					<div slot="reference">
						<el-button type="text" icon="el-icon-setting" style="margin-right:10px;">图片缓存设置</el-button>
					</div>
				</el-popover>
				<a v-show="false" ref="exportExcel"></a>
			</el-col>
		</el-row>

		<div v-if="!noData" class="wrapper">
			<el-row type="flex">
				<el-col :span="6">
					{{resData.data.keywordText}}
				</el-col>
				<el-col :span="18">

					<el-button type="primary" plain size="mini" @click="copyText">复制关键词</el-button>
					<el-button type="primary" plain size="mini" @click="changeVal(btnTxt2)">{{btnTxt2}}</el-button>
					<el-button type="primary" plain size="mini" v-if="btnTxt2==='忽略（Q）'" @click="changeVal('类目词组否定(W)')">类目词组否定(W)</el-button>
					<el-button type="primary" plain size="mini" v-if="btnTxt2==='忽略（Q）'" @click="changeVal('类目精确否定(A)')">类目精确否定(A)</el-button>
					<el-button type="primary" plain size="mini" v-if="btnTxt2==='忽略（Q）'" @click="changeVal('产品词组否定(S)')">产品词组否定(S)</el-button>
					<el-button type="primary" plain size="mini" v-if="btnTxt2==='忽略（Q）'" @click="changeVal('产品精确否定(E)')">产品精确否定(E)</el-button>

					<el-button type="primary" plain size="mini" @click="revokeScreen" :disabled="!revokeKeywords.length">撤销筛选(DEL)</el-button>

				</el-col>
			</el-row>

			<div class="key-row-1">
				<div class="column-1">有效词根</div>
				<div class="column-2">{{resData.valid.join('; ')}}</div>
			</div>
			<div class="key-row-2">
				<div class="column-1">无效词根</div>
				<div class="column-2">{{resData.invalid.join('; ')}}</div>
			</div>
			<div style="display:flex;justify-content:flex-end;margin-top:10px;">{{revokeSelfKeywords.length}}/{{total}}</div>
			<div>
				<div>
					<div :key="resData.data.keywordId">
						<div v-if="showImgUrls.length>0" class='img-flex-comnt'>
							<div v-for="item in showImgUrls" :key="item.sku" class='img-flex-item'>
								<div class='img-div'>
									<img :key="item.imageUrl" class='item-img  loadingImg' v-lazy="item.imageUrl">
								</div>
								<el-tooltip :content="item.title" placement="top" effect="light">
									<p class='p1'>{{item.title}}</p>
								</el-tooltip>
							</div>
						</div>
						<div v-if="!(showImgUrls.length>0)" style="width:100%;text-align: center;color: #909399;font-size: 14px;">暂无缓存图片</div>
					</div>
				</div>
			</div>

		</div>

		<div v-else="noData" class="no-data" style="height: 100vh;margin-right:10px;font-size:18px;">
			<div style="margin-bottom: 10px;" v-if="revokeKeywords.length">
				<el-button type="primary" plain size="mini" @click="revokeScreen" :disabled="!revokeKeywords.length">撤销筛选(DEL)</el-button>
			</div>
			<div style='line-height:60vh'>
				暂无数据
			</div>
		</div>
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	import storage from 'Utils/saver'
	import {debounce} from 'throttle-debounce'
	import _ from 'lodash'
	import {CONST_PORT_CONFIG,host} from 'Config'
	const {BASE_URL} = CONST_PORT_CONFIG
	export default {
		components: {
			draggable
		},
		props: ['pParams'],
		data() {
			return {
				// 已经筛选过的图片集合,有效无效筛选都会进入这个对象， 如果撤销筛选，则把对应的图片推到未筛选图片中
				hasSelectImg: {

				},
				setImgNum: false,
				imgNum: 10,
				settedImgNums: 10,
				currentWidth: null,
				loading: false,
				noData: false,
				popoverImgCache: false,
				filePopover: false,

				revokeKeywords: [],

				listQuery: {
					// sortOrder: "asc",
					sellerId: null,
					siteId: null,
					cusCateId: null, //92
					productId: null, //6887
					keywordType: null
				},
				resData: {
					data: null,
					imageUrls: [],
					invalid: [],
					valid: []
				},
				draggableList: [],
				sourceList: [],
				fileList: [],

				btnTxt2: '开始筛选',
				btnTxt3: null,
				revokeScreenIds: [],
				revokeScreenBtn: true,


				total: null, //后台返回的未筛选的数量

				imgLoaded: false,
				imgLoadedLoading: false,
			}
		},
		watch: {
			currentWidth(val) {
				// console.log(val)
				if (val <= 1280) {
					this.$emit('setMenuClose', false)
				} else {
					this.$emit('setMenuClose', true)
				}
			},
			'pParams.type'(newP, oldP) {
				this.listQuery.cusCateId = this.pParams.cusCateId
				if (newP === 'category') {
					this.listQuery.productId = null
				} else {
					this.listQuery.productId = this.pParams.productId
				}
				this.getList(1)
				this.revokeScreenIds = []
			},
			'pParams.treeId'(newP, oldP) {

				// sessionStorage.removeItem("revokeScreenIds");
				(this.btnTxt2 = '开始筛选'),
				(this.btnTxt3 = null),
				(this.listQuery.cusCateId = this.pParams.cusCateId)
				let type = this.pParams.type
				if (type === 'category') {
					this.listQuery.productId = null
				} else {
					this.listQuery.productId = this.pParams.productId
				}

				if (newP == 18) {
					//上架
					this.listQuery.keywordType = 'PUBLISH';

					// this.filePopover = true;
				} else if (newP == 40) {

					//广告

					let type = this.pParams.type
					if (type === 'category') {
						this.listQuery.keywordType = 'ADVERT'
					} else {
						this.listQuery.keywordType = 'PRODUCT'
					}
					// this.filePopover = false;
				}
				this.getList(1)
				this.revokeScreenIds = []
			},
			'pParams.cusCateId'(newP, oldP) {
				let type = this.pParams.type
				this.listQuery.cusCateId = newP
				if (type === 'category') {
					this.listQuery.productId = null
				} else {
					this.listQuery.productId = this.pParams.productId
				}
				this.getList(1)
				this.revokeScreenIds = []
			},
			'pParams.productId'(newP, oldP) {
				let type = this.pParams.type
				this.listQuery.cusCateId = this.pParams.cusCateId
				if (type === 'category') {
					this.listQuery.productId = null
				} else {
					this.listQuery.productId = newP
				}
				this.getList(1)
				this.revokeScreenIds = []
			},
			revokeScreenIds(newP, oldP) {
				if (newP.length === 0) {
					this.revokeScreenBtn = true
				} else {
					this.revokeScreenBtn = false
				}
			},
			sellerData() {
				this.listQuery.siteId = this.siteId
				this.listQuery.sellerId = this.sellerId
			}

		},
		created() {
			if (this.sellerId && this.siteId) {
				this.listQuery.siteId = this.siteId
				this.listQuery.sellerId = this.sellerId
			}
			let imgNum = storage.get('local', 'imgNum')
			if (imgNum) {
				this.imgNum = this.settedImgNums = +imgNum
			}
			this.currentWidth = document.body.clientWidth || document.documentElement.clientWidth
			this.handleResize = debounce(300, () => {
				this.currentWidth = document.body.clientWidth || document.documentElement.clientWidth
			})
			window.onresize = this.handleResize
			this.listQuery.cusCateId = this.pParams.cusCateId
			if (this.pParams.type === 'category') {
				this.listQuery.productId = null
			} else {
				let productId = this.pParams.productId
				this.listQuery.productId = productId
			}
			let treeId = this.pParams.treeId
			let type = this.pParams.type
			if (treeId == 18) {
				this.listQuery.keywordType = 'PUBLISH'
			} else if (treeId == 40) {
				if (type === 'category') {
					this.listQuery.keywordType = 'ADVERT'
				} else {
					this.listQuery.keywordType = 'PRODUCT'
				}
			}
			if (type === 'category') {
				if (this.pParams.treeId === 18) {
					this.filePopover = true
				} else {
					this.filePopover = false
				}
			} else {
				this.filePopover = true
			}
			this.getList(1)
			this.getSource()
		},
		mounted() {
			this.__event = event => this.bindKey(event)
			document.addEventListener('keydown', this.__event)
		},
		beforeDestroy() {
			document.removeEventListener('keydown', this.__event)
			this.__event = null
			window.onresize = null
			this.handleResize = null
		},
		computed: {
			showImgUrls() {
				let keyword = this.resData.data && this.resData.data.keywordText
				return this.resData.imageUrls
					.filter(el => el.keyword === keyword)
					.slice(0, this.settedImgNums)
			},
			//得到已筛选的
			revokeSelfKeywords() {
				return this.revokeKeywords.filter(
					el =>
					el.siteId === this.pParams.siteId &&
					el.cusCateId === this.pParams.cusCateId &&
					el.productId === this.pParams.productId &&
					el.keywordType === this.listQuery.keywordType
				)
			},
		},
		methods: {
			//关键词的操作按钮
			changeVal(btnTxt) {
				switch (btnTxt) {
					case '开始筛选':
						this.btnTxt2 = '忽略（Q）'
						break
					case '忽略（Q）':
						this.updateKeywordStatus(1)
						break
					case '类目词组否定(W)':
						this.updateKeywordStatus(5)
						break
					case '类目精确否定(A)':
						this.updateKeywordStatus(4)
						break
					case '产品词组否定(S)':
						this.updateKeywordStatus(3)
						break
					case '产品精确否定(E)':
						this.updateKeywordStatus(2)
						break
					case '撤销筛选':
						this.revokeScreen()
						break
				}
			},
			//保存设置缓存图片的数量
			handleShowImgNum() {
				this.imgNum = storage.get('local', 'imgNum')
			},
			//设置缓存图片的数量
			setNum() {
				if (
					Number.isInteger(this.imgNum) &&
					this.imgNum >= 1 &&
					this.imgNum <= 30
				) {
					storage.set('local', 'imgNum', this.imgNum)
					this.settedImgNums = this.imgNum
					this.$message.success('设置成功')
					this.setImgNum = false
				} else {
					this.$message.warning('请输入1-30之间的正整数')
				}
			},
			getSource() {
				this.$api['categoryKeywordGetSource']().then(res => {
					let {code,data} = res
					if (code === 0) {
						this.sourceList = data
					}
				})
			},
			//获取数据
			getList(flag) {
				this.noData = true
				this.loading = true
				this.$api['categoryKeywordGetFilterKeywordNegative']({
						...this.listQuery,
						flag,
						index:0
					})
					.then(res => {
						this.loading = false
						let {code,msg,data} = res
						let {keywordList,imageUrls,total} = data
						if (code === 0) {
							if (msg === '暂无数据') {
								this.noData = true
							} else {
								//total 是后台返回的未筛选的数量
								this.total = total
								this.noData = false
								let {invalid,valid} = keywordList[0]
								this.resData.data = keywordList[0]
								this.resData.invalid = invalid
								this.resData.valid = valid

								if (imageUrls) {
									if (this.resData.imageUrls.length > 1000) {
										this.resData.imageUrls = imageUrls
									} else {
										this.resData.imageUrls = [...new Set(this.resData.imageUrls.concat(...imageUrls))]
									}
								}

								let keywords = imageUrls ?
									keywordList.map(el => el.keywordText) :
									[keywordList.pop().keywordText]

								let preLoads = []; //找出关键词对应的图片
								keywords.forEach(word => {
									// debugger
									let arr = this.resData.imageUrls
										.filter(el => word === el.keyword)
										.slice(0, this.imgNum)
									preLoads = preLoads.concat(arr)
								})

								//加载图片
								this.imgLoadedLoading = true;
								let vm = this;
								this.$nextTick(function() {

									let promiseAll = preLoads.slice(0, this.settedImgNums).map(el => (new Promise((resolve, reject) => {
										let _img = new Image()
										_img.onload = () => {
											resolve()
										}
										_img.onerror = () => {
											resolve()
										}
										_img.src = el.imageUrl
									})))
									Promise.all(promiseAll).then(img => {
										vm.imgLoaded = true;
										vm.imgLoadedLoading = false
									}).catch(() => {
										vm.imgLoaded = true;
										vm.imgLoadedLoading = false
									})
								})
							}
						} else {
							this.loading = false
							this.noData = true
						}
					})
					.catch(res => {
						console.log(res);
						this.loading = false
						this.noData = true
					})
			},
			updateKeywordStatus(negativeStatus, title) {
				let params = {
					ids: [this.resData.data.keywordId],
					negativeStatus
				}

				this.$api['categoryKeywordNegativeFilter'](params).then(res => {
					let {
						code
					} = res
					if (code === 0) {
						this.total--
						this.draggableList = []
						// 后台返回175张图片，如果剩 90张时，去请求图片，并塞到imgUrls中
						// console.log((this.resData.imageUrls && this.resData.imageUrls.length < 90) ? 1 : 0);

						//保存当前筛选的图片
						let currentImgs = []
						currentImgs = this.resData.imageUrls.filter(el => el.keyword === this.resData.data.keywordText);
						this.hasSelectImg[this.resData.data.keywordId] = currentImgs
						console.log(this.hasSelectImg);
						//保存筛选过图片的id
						this.revokeScreenIds.unshift(this.resData.data.keywordId)

						//保存筛选过图片的数据
						this.revokeKeywords.push({
							siteId: this.pParams.siteId,
							cusCateId: this.pParams.cusCateId,
							productId: this.pParams.productId,
							keywordType: this.listQuery.keywordType,
							keywordId: this.resData.data.keywordId,
							resData: this.resData.data,
						})

						storage.set('session', this.pParams.treeId === 40 ? "revokeKeywords_next" : 'revokeKeywords', this.revokeKeywords)

						//过滤筛选过的图片
						this.resData.imageUrls = this.resData.imageUrls.filter(el => el.keyword !== this.resData.data.keywordText);

						this.getList((this.total > 4 && this.resData.imageUrls && this.resData.imageUrls.length < 100) ? 1 : 0)


					}
				})
			},
			//撤销筛选
			revokeScreen() {
				// debugger
				let revokeKeywords = this.revokeKeywords
				let params = revokeKeywords.pop()
				//console.log(params);
				this.$api['categoryKeywordRevokeNegativeFilter'](params).then(res => {
					let {
						code
					} = res
					if (code === 0) {
						// this.draggableList = []
						// // 撤销后把图片还原
						// // this.hasSelectImg[params.keywordId]

						this.resData.imageUrls.unshift(...this.hasSelectImg[params.keywordId]);

						// // 设置撤销之后的选择词为当前
						// this.resData.data = params.resData
						// this.resData.invalid = params.resData.invalid
						// this.resData.valid = params.resData.valid

						delete this.hasSelectImg[params.keywordId]
						// storage.set('session', this.pParams.treeId === 40 ? "revokeKeywords_next" : 'revokeKeywords', revokeKeywords)
						// this.revokeKeywords = revokeKeywords

						// console.log(this.revokeKeywords );
						this.getList((this.total > 4 && this.resData.imageUrls && this.resData.imageUrls.length < 100) ? 1 : 0)

					}
				})
			},

			// 绑定快捷键
			bindKey(event) {
				// 弹出输入框 禁止
				if (
					this.noData ||
					this.setImgNum ||
					this.popoverImgCache
				) {
					return
				}
				let actions1 = {
					81: {
						action: 'updateKeywordStatus',
						query: 1
					}, // 忽略（Q）
					87: {
						action: 'updateKeywordStatus',
						query: 5
					}, // 类目词组否定(W)
					65: {
						action: 'updateKeywordStatus',
						query: 4
					}, // 类目精确否定(A)
					83: {
						action: 'updateKeywordStatus',
						query: 3
					}, // 产品词组否定(S)
					69: {
						action: 'updateKeywordStatus',
						query: 2
					}, // 产品精确否定(E)


					// 撤销
					46: {
						action: 'revokeScreen'
					}
				}
				console.log(event)
				let key1 = Object.keys(actions1)
				let index1 = Object.keys(actions1).indexOf(event.keyCode + '')
				let action_el = null
				if (index1 > -1) {
					action_el = actions1[key1[index1]]
				}

				if (action_el) {
					let {
						action,
						query
					} = action_el
					// 快捷键
					this[action](query)
				}
			},
			copyText() {
				this.$copyText(this.resData.data.keywordText).then(
					() => {
						this.$message.success('复制成功')
					},
					() => {
						this.$message.error('复制失败了')
					}
				)
			}
		}
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
