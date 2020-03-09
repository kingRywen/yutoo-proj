<template>
	<div style="width: 100%;height: auto;border: 1px solid rgb(242, 242, 242);padding: 0 10px;">
		<div style="height: 50px;border-bottom: 1px solid rgb(242, 242, 242);line-height: 50px;font-size: 20px;font-weight: bold;">商品投放</div>
		<div style='min-width:450px;margin-top:20px;padding-bottom:10px;' :style="{width:goodsWidth}">
		    <el-tabs v-model="activeName" type="border-card">
		        <el-tab-pane label="分类" name="1">
		            <el-input placeholder="按分类进行搜索" v-model.trim="searchInp" class="input-with-select" size='small' clearable @clear="searchType = false" ><el-button slot="append" icon="el-icon-search" @click="searchMethod"></el-button>
		            </el-input>
					
		            <div class='GoodsOn' v-loading='loading' v-show="!searchType">
		                <el-tree					
		                    :load="loadNode"
		                    lazy
		                    :props='props'
		                    :expand-on-click-node="false"                     
		                    style='height: 450px;overflow: auto;'
		                    ref='tree'
		                >
		                    <div  slot-scope="{ node, data }" style='width:100%'>
		                        <div style='position:relative;'>
		                            <p>{{ data.name }}</p>
		                            <div style='position:absolute;top:-10px;right:20px;'>
		                                <el-button type="primary" @click='orientationBtn(data)'>定位</el-button>
		                                <el-button type="text" @click='refiningBtn(data)'>细化</el-button>
		                            </div>
		                        </div>
		                    </div>
		                </el-tree>
						
		            </div>
					<div class='GoodsOnSearch' v-loading='searchLoading' v-show="searchType">
					    <el-tree			    	
					        :data="treeData"
					        :props='props'
					        :expand-on-click-node="false"                     
					        style='height: 450px;overflow-y: auto;overflow-x: hidden;'
					        ref='tree'
					    >
					        <div  slot-scope="{ node, data }" style='width:100%;height: 70px;'>
					            <div style='height: 70px;width:100%;'>
					    			<div style="width: 80%;">
										<el-tooltip  v-if="data.parentName" effect="light" :content="data.parentName" placement="top-start">
											<div style="width: 80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-top: 15px;">{{ data.parentName }}</div>
										</el-tooltip>
										<div v-else style="width: 80%;margin-top: 15px;">-</div>
					    				<div  style="width: 80%;font-weight: bold;margin-top: 10px;">{{ data.name }}</div>
					    			</div>				            
					                <div style='position:absolute;top:23px;right:20px;'>
					                    <el-button type="primary" @click='orientationBtn(data)'>定位</el-button>
					                    <el-button type="text" @click='refiningBtn(data)' >细化</el-button>
					                </div>
					            </div>
					        </div>
					    </el-tree>				
					</div>				
		        </el-tab-pane>
		        <el-tab-pane label="输入SKU" name="2">
		            <el-input
		                type="textarea"
		                :rows="25"
		                @change='inpSkuChange'
		                placeholder="多个换行输入"
		                v-model="textarea">
		            </el-input>
		        </el-tab-pane>
		    </el-tabs>  
		    <div style='margin-top:20px;' class='add-data'>
		        <h4>定位数量为{{bidTableData.length}}个 <span v-if='GoodsOnHint' class='hint'>请至少添加一项</span></h4>
		        <el-form :model="ruleForm" ref="ruleForm" size='small' class='table'>
		            <div style='height:28px;margin-bottom:6px;'>
		                <el-button type='primary' size="mini" plain  style='float:right;' :disabled="!bidTableData.length" @click='deleteAll'>删除所有</el-button>
		            </div>
		            <yt-table :data='bidTableData' :columns='columns' :selection='false' border  :height='450'>
		                <template slot="right">
		                        <el-table-column label="操作" :width="editWidth" v-if="alreadyEdits.length">
		                        <template slot-scope="scope">
		                            <template v-for="(item, index) in alreadyEdits">
		                            <template
		                                v-if="item.show == null ? true : typeof item.show === 'boolean' ? item.show : item.show(scope)"
		                            >
		                                <template v-if="!item.childs">
		                                <el-button
		                                    v-if="!item.icon"
		                                    class="right-btns"
		                                    type="text"
		                                    :key="index"
		                                    @click="item.fn(scope, item)"
		                                    :icon="item.icon"
		                                >item.name</el-button>
		                                <el-tooltip v-else :content="item.name" placement="top" effect="light">
		                                    <el-button
		                                    class="right-btns"
		                                    type="text"
		                                    :key="index"
		                                    @click="item.fn(scope, item)"
		                                    :icon="item.icon"
		                                    ></el-button>
		                                </el-tooltip>
		                                </template>
		
		                                <el-button
		                                type="text"
		                                v-else-if="(item.childs(scope)).length === 1"
		                                :key="index"
		                                @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
		                                >{{(item.childs(scope))[0].name}}</el-button>
		
		                                <el-dropdown
		                                v-else-if="(item.childs(scope)).length !== 0"
		                                split-button
		                                type="text"
		                                @click="item.fn(scope, item,item.name)"
		                                @command="c => item.fn(scope, item,c)"
		                                >
		                                {{(item.childs(scope))[0].name}}
		                                <el-dropdown-menu slot="dropdown">
		                                    <template v-for="(i, subIndex) in (item.childs(scope))">
		                                    <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
		                                    </template>
		                                </el-dropdown-menu>
		                                </el-dropdown>
		                            </template>
		                            </template>
		                        </template>
		                        </el-table-column>
		                    </template>
		            </yt-table>
		        </el-form>
				<div v-if="bidTableData.length==0 && isShowTip" style="color: #f56c6c;font-size: 12px;">请定位至少一个商品！</div>
		    </div>
		    <yt-dialog :options='options' :events='events'>
		        <Refining v-if='options.visible' :addName='addName' :nodeId="nodeId" ref='RefiningDialog' />
		    </yt-dialog>
		</div>
	</div>
    
</template>

<script>
export default {
    components:{
        Refining :()=>import('Views/SuDemo/createAd/item/refining.vue')
    },
    props:{
        GoodsOnHint:{
            type:Boolean,
            default:false
        },
		goodsWidth:{
			default:'50%'
		}
    },
    data() {
        let vm = this
        return {
            activeName:"1",

            props:{
                label:'name',
                children:'ggg',
                isLeaf: 'leaf'
            },
            loading:true,

            textarea:'',
            searchInp:'',

            ruleForm:{
                categorys:[],
                asins:[],
            },
			searchLoading:false,
            columns:[
                {
                    label:"分类和商品",
                    value:'asin',
                    align:'left',
                    render(h,scope){
                        let {asin , name ,brand,priceMin,priceMax,primeEligible } = scope.row
                        //名字
                        let nameC = name ? (
                                        <span> <b>分类 :</b>{scope.row.name}</span>
                                    ) : (
                                         <span> <b>ASIN :</b>{scope.row.asin}</span>
                                    )
                        //品牌
						let  brands =  (<span></span>)
						if(brand){			
							brands = ( <span> &nbsp; <b>品牌 :</b>{brand}</span> )
						}
                        
                        //价格
                        let minPrice = priceMin ?  ( <span> &nbsp; <b>商品价格 :</b>{priceMin}</span> ) : (<span></span>)
                        let maxPrice = priceMax ?   ( <span>~ {priceMax}</span> ) : (<span></span>)
                        //评分                 
						let revie = (<span></span>)
						if( 'reviewMin' in scope.row && 'reviewMax' in scope.row ){
							let reviewMin = scope.row.reviewMin ? scope.row.reviewMin : 0
							let reviewMax = scope.row.reviewMax ? scope.row.reviewMax : 5
							revie = (<span> &nbsp; <b>评分 :</b>{reviewMin + '-' + reviewMax}</span>)
						}
                        //配送
                        let delivery = primeEligible != null ? (<span> &nbsp; <b>配送 :</b>{primeEligible ? '具备Prime资格' : '不具备Prime资格'}</span> ) : (<span></span>)

                        return(
                           <div> {nameC}  {brands} &nbsp; {minPrice} {maxPrice} &nbsp; {revie} &nbsp; {delivery}</div>
                        )
                    }
                },
                {
                    label:"竞价",
                    value:'asin',
                    align:'left',
                    render(h,scope){
                        return(
                            <el-form-item label="" prop="bid" rules={vm.getRules(scope.$index)} style='margin-bottom:14px;margin-top:14px;width:70%;'>
                                <el-input vModel={scope.row.bid} size='mini' onBlur = {(e)=>{vm.inputBlur(e,scope.$index)}}>
                                    <template slot="prepend">$</template>
                                </el-input>
                            </el-form-item>
                        )
                    }
					//123/
                },
            ],
            editWidth:'100px',
            alreadyEdits:[
                {
                    name: "删除",
                    icon: "el-icon-delete",
                    show: scope => {
                        return true
                    },
                    fn: (scope) => {
						
                        return this.deleteItem(scope.row.pcid)
                    }
                },
            ],
            getRules(index){
                var checkAge = (rule, value, callback) => {
                    let val = this.bidTableData[index].bid
					if(!val){
						return callback()
					}
                    if( (isNaN(Number(val))) && val!==0 ){
                        return callback(new Error('请输入数字'));
                    }
                    if( !(/^0\.\d+$|^[1-9]+(\.\d+)?$/.test(val)) ){
                        return callback(new Error('请输入正实数'));
                    }
                    callback()
                }
                return {  validator: checkAge, trigger: ['blur','change'] }
            },

            options:{
                visible:false,
                title:'细化分类',
                width:'700px',
				appendToBody:true

            },
            events:{
                handleOkClick:()=>{
                    this.$refs.RefiningDialog.saveBtn().then(res => {
                        this.options.visible = false						
						//添加的时候判断
						let [...res1] = res
						res1.forEach((e,index)=>{
							if(e.brandId){
								if(this.ruleForm.categorys.filter(i=>i.brandId ===e.brandId).length === 0){
									this.ruleForm.categorys.push(e)
								}else{
									let index1 = this.ruleForm.categorys.findIndex(i=>i.brandId ===e.brandId)
									this.ruleForm.categorys.splice(index1,1,e)
								}
							}else{
								if(this.ruleForm.categorys.filter(i=>i.pcid ===e.pcid).length === 0){
									this.ruleForm.categorys.push(e)
								}else{
									let index1 = this.ruleForm.categorys.findIndex(i=>i.pcid ===e.pcid)
									this.ruleForm.categorys.splice(index1,1,e)
								}
							}
						})

                    }).catch(() => {
                        
                    })
                }
            },
            addName:"",
			treeData:[],
			searchType:false,
			isShowTip:false,
			nodeId:null,
        };
    },
    methods: {
		validateFn(){
		    if (this.bidTableData && this.bidTableData.length) {
				this.isShowTip = false
		        return Promise.resolve(this.ruleForm)
		    } else {
		        this.isShowTip = true
				return Promise.reject()
		    }
		},
		searchMethod(){
			if(this.searchInp && this.searchInp.length>2){
				this.searchType = true
				return this.$api['GetCateList']({
				   	siteId: this.siteId,
				    platformId: this.platformId,
				    parentPcid:0,
					name:this.searchInp
				})
				.then(data => {
					this.treeData = data.data
				}).catch(() => {
				    
				})
			}else{
				this.$message.warning('请输入大于等于3的字符!')
			}
		},
        inputBlur(e,index){  
            this.$set(this.bidTableData[index],'bid', e.target.value)
        },
        inpSkuChange(){
            let arr = this.textarea.split('\n')
                        .map( i=> {
                            return i.trim()
                        })
                        .filter(i => {
                            return i!==''
                        })
            arr.forEach( i => {
                let addAsin =  this.ruleForm.asins.map( k => k.asin )
                if ( !addAsin.includes(i) ) {
                    this.ruleForm.asins.push({
                        asin:i
                    })
                }
            })

        },
        //定位
        orientationBtn(data){
			//添加的时候判断		
            let { name,pcid } = data
			if(this.ruleForm.categorys.filter(e => e.pcid === pcid).length === 0 ){
				this.ruleForm.categorys.push({
				    name,
				    pcid,
				    bid:null
				})
			}else{
				let index = this.ruleForm.categorys.findIndex(e=>e.pcid === pcid)
				this.ruleForm.categorys.splice(index,1,{name,pcid,bid:null})
			}        
        },
        //细化
        refiningBtn(data){
            let { name ,nodeId,pcid }  = data
            this.addName = {name,pcid}
			this.nodeId = nodeId
            this.options.visible = true
        },	
        getData(id){
            return this.$api['GetCateList']({
               	siteId: this.siteId,
                platformId: this.platformId,
                parentPcid:id,
            })
            .then(data => {
                this.loading = false
                return data.data 
            }).catch(() => {
                return []
            })
        },
        async loadNode(node, resolve) {
            let data = []
            if (node.level === 0) {
                data = await this.getData(0)
            }
            if (node.level >= 1){
                let { pcid } = node.data
                data = await this.getData(pcid)
            };
            data.forEach(i => {
                if(i.haveChildren){
                    i.leaf = false
                }else{
                     i.leaf = true
                }
            })
            resolve(data);
        },
        deleteItem(id){
			let flag = true
            this.ruleForm.categorys.forEach( (i,index) => {
                if(i.pcid === id && flag){
					flag = false
                    this.ruleForm.categorys.splice(index,1)
                }
            })
            this.ruleForm.asins.forEach( (i,index) => {
                if(i.pcid === id && flag){
					flag = false
                    this.ruleForm.asins.splice(index,1)
                }
            })
        },
        deleteAll(){
            this.ruleForm.categorys = []
            this.ruleForm.asins = []
        },
        saveBtn(){
            if (!this.bidTableData.length) {
                return false
            } else {
                return this.$refs.ruleForm.validate().then( () => {
                    return Promise.resolve(this.ruleForm)
                })
            }
        },

    },
    created() {
    },
    computed:{
        bidTableData(){
            return this.ruleForm.categorys.concat(this.ruleForm.asins)
        }
    }

};
</script>

<style scoped lang="scss">
.GoodsOn {
    margin-top: 10px;
  
    /deep/{
        .el-tree-node{
            border-top: 1px solid #dcdcdc;
        }
        .el-tree-node:first-child{
            border-top: 1px solid #dcdcdc;
            .el-tree-node__children{
                    border-bottom: none;
            }
        }
        .el-button{
            padding: 4px 10px;
            margin-top: 7px;
        }
        
    }
}
.GoodsOnSearch {
    margin-top: 10px;
  
    /deep/{
        .el-tree-node{
            border-top: 1px solid #dcdcdc;
			height: 70px;
			position: relative;
			.el-tree-node__content{
				height: 70px;
				
			}
        }
        .el-tree-node:first-child{
            border-top: 1px solid #dcdcdc;
            .el-tree-node__children{
                    border-bottom: none;
            }
        }
        .el-button{
            padding: 4px 10px;
        }       
    }
}
.hint{
        margin: 0 4px;
        color: #f56c6c;
        font-size: 12px;
    }
</style>
