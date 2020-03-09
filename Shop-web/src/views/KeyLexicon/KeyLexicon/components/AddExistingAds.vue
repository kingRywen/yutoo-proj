<template>
    <div>
        <!-- 广告系列 -->
        <div class='item' style='margin-top:-10px;' v-if='advertisingSeriesShow'>
            <div class='cont'>
                <div class='label'>
                    广告系列
                </div>
                <div class='value' style='margin-left: 20px;'>
                    <el-select v-model="value" placeholder="请选择" size='small' style='width:300px;' @change='sdvertisingSeriesChange' collapse-tags  clearable>
                        <el-option
                        v-for="item in sdvertisingSeriesOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class='hint'></div>
        </div>
        <!-- 完 -->
        <!--  广告组 -->
        <div class='item' style='margin-top:24px;' v-if='advertisingSeriesShow'>
            <div class='cont'>
                <div class='label'>
                    广告组
                </div>
                <div class='value' style='margin-left: 34px;'>
                    <el-select v-model="value2" placeholder="请先选择广告系列,再作选择" size='small' style='width:300px;' clearable>
                        <el-option
                        v-for="item in adGroupOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class='hint'></div>
        </div>
        <!-- 完 -->
        <!-- 关键词 -->
        <div class='bor-div'>
            <div class='tit '>
                关键词
            </div>
            <div class='cont'>
                <div class='label'><span style='color:red;'>*</span>匹配类型</div>
                <div class='select'>
                    <el-select v-model="keywordMatchingType" placeholder="请选择" size='small' style='width:500px;'>
                        <el-option
                        v-for="item in matchingTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class='inp'>
                    <el-input v-model.trim="keywordInp" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" type='textarea' :rows='12' size='small' style='width:900px;'></el-input>
                </div>
                <div class='word-length'>
                    最多可以输入1000个关键词，已输入<span style='color:red'>{{inpKeywordLength}}</span>个
                </div>
                <div class='add-btn'>
                      <el-button type="primary" size='small' plain @click='addKeyword'>添加关键词</el-button>
                </div>
            </div>
        </div>
        <div class='bor-div'>
            <div class='tit'>已添加{{bigAlreadykeywordTableData.length}}个关键词   <span v-if='keywordHint' class='hint-tit'>请至少添加一项</span></div>
            <div class='cont'>
                <div class='label'>
                    <el-button type="primary" size='mini' plain @click='loadNegativeWord' :disabled="!bigAlreadykeywordTableData.length">加载推荐否定词</el-button>
                    <el-button type="primary" size='mini' plain @click='deleteAlreadyKeyworItem(null)' :disabled="!alreadySelectKeyword.length">删除</el-button>
                    <el-button type="primary" size='mini' plain  @click='deleteAlreadyKeyworItem("all")' :disabled="!alreadykeywordTableData.length">删除全部</el-button>
                    <el-button type="primary" size='mini' plain @click='altermatchingTypeBtn' v-if='!altermatchingTypeShow' :disabled="!alreadySelectKeyword.length">修改匹配类型</el-button>
                    <el-select v-model="alterKeywordType" placeholder="请选择" size='mini' style='width:150px;margin-left:10px;' v-if='altermatchingTypeShow'>
                        <el-option
                        v-for="item in matchingTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size='mini' @click='alterKeywordTypeBtn'  v-if='altermatchingTypeShow'>确认修改</el-button>
                </div>
                <div class='inp'>
                    <yt-table :columns='alreadyColumns' border :data='alreadykeywordTableData' @selectChange='alreadyKeywordselectChange'>
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
                </div>
                <div class='word-length'>
                     <el-pagination
                        background
                        @size-change="alreadyHandleSizeChange"
                        @current-change="alreadyHandleCurrentChange"
                        :current-page="alreadyCurrentPage"
                        :page-sizes="[10,20,30, 50,1000]"
                        :page-size="alreadyPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="bigAlreadykeywordTableData.length">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 关键词完 -->
        <!-- 否定词 -->
        <div class='bor-div'>
            <div class='tit'>否定词</div>
            <div class='cont'>
                <div class='label'> <span style='color:red;'>*</span>匹配类型</div>
                <div class='select'>
                    <el-select v-model="negativeWordType" placeholder="请选择" size='small' style='width:500px;'>
                        <el-option
                        v-for="item in negativeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class='inp'>
                    <el-input v-model="negativeWordInp" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" type='textarea' :rows='12' size='small' style='width:900px;'></el-input>
                </div>
                <div class='word-length'>
                    最多可以输入1000个关键词，已输入{{inpNegativeWordLength}}个
                </div>
                <div class='add-btn'>
                      <el-button type="primary" size='small' plain @click='addNegativeWord'>添加否定词</el-button>
                </div>
            </div>
        </div>
        <div class='bor-div'>
            <div class='tit'>已添加{{bigAlreadyNegativeWordTableData.length}}个否定词</div>
            <div class='cont'>
                <div class='label'>
                    <el-button type="primary" size='mini' plain @click='deleteNegativeWordItem()' :disabled="!negativeWordselect.length">删除</el-button>
                    <el-button type="primary" size='mini' plain @click='deleteNegativeWordItem("all")'  :disabled="!alreadyNegativeWordTableData.length">删除全部</el-button>
                    <el-button type="primary" size='mini' plain @click='alterNegativeWordTypeBtn' v-if='!alterNegativeWordTypeShow' :disabled="!negativeWordselect.length">修改匹配类型</el-button>
                    <el-select v-model="alterNegativeWordType" placeholder="请选择" size='mini' style='width:150px;margin-left:10px;' v-if='alterNegativeWordTypeShow'>
                        <el-option
                        v-for="item in matchingTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size='mini' @click='alterNegativeWordTypeSubmit'  v-if='alterNegativeWordTypeShow'>确认修改</el-button>
                </div>
                <div class='inp'>
                    <yt-table :columns='alreadyNegativeWordColumns' border :data='alreadyNegativeWordTableData'  @selectChange='NegativeWordselectChange'>
                        <template slot="right">
                            <el-table-column label="操作" :width="editWidth" v-if="alreadyNegativeWordEdits.length">
                            <template slot-scope="scope">
                                <template v-for="(item, index) in alreadyNegativeWordEdits">
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
                </div>
                <div class='word-length'>
                     <el-pagination
                        background
                        @size-change="alreadyNegativeWordHandleSizeChange"
                        @current-change="alreadyNegativeWordHandleCurrentChange"
                        :current-page="alreadyNegativeWordCurrentPage"
                        :page-sizes="[10,20,30,50,1000]"
                        :page-size="alreadyNegativeWordPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="bigAlreadyNegativeWordTableData.length">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 完 -->
        
    </div>
</template>

<script>

export default {
    props:{
        //创建新广告不需要广告系列和广告组
        advertisingSeriesShow:{
            default:true,
            type:Boolean,
        },
        keywords:{
            default:'',
            type:String
        },
        keywordHint:{
            type:Boolean,
            default : false
        },
        productIds :{
            type :Array,
            default : () => []
        }
    },
    data() {
        let vm = this;
        return {
            //广告系列
            sdvertisingSeriesOpt:[
               
            ],
            value:'',
            //广告组
            adGroupOpt:[
               
            ],
            value2:'',

            //匹配类型
            matchingTypeOpt:[
                {label:'精确匹配',value:'exact'},
                {label:'广泛匹配',value:'broad'},
                {label:'词组匹配',value:'phrase'},
            ],

            //关键词
            keywordMatchingType:null,//关键词匹配类型
            //inpKeywordLength:0,//已输入关键词的数量
            keywordInp:'',//输入的关键词
            altermatchingTypeShow:false,
            alterKeywordType:null,//修改关键词匹配类型
            alreadyColumns:[
                {
                    label:"关键词",
                    value:"keyword",
                    showTooltip:true,
                },
                {
                    label:"匹配类型",
                    value:"matchType",
                    enum:{
                        "exact":'精确匹配',
                        "broad":'广泛匹配',
                        "phrase":'词组匹配',
                    }
                },
                {
                    label:"关键词竞价",
                    value:"price",
                    render(h,scope){
                        return(
                            <div>
                                $
                                <el-input
                                    placeholder="请输入"
                                    size='mini'
                                    key={Date.now()}
                                    value={scope.row.bid}
                                    placeholder='请输入'
                                    onBlur={(e)=>{
                                        vm.alreadyKeywordInp(e,scope.$index)
                                    }}
                                    style='width:80%;margin-left:6px;'
                                    v-model="input2">
                                </el-input>
                            </div>
                        )
                    }
                },
            ],
            alreadykeywordTableData:[
            ],//已添加关键词table的数据
            bigAlreadykeywordTableData:[],//添加关键词的大数组
            editWidth:'80px',
            alreadyEdits:[
                {
                    name: "删除",
                    icon: "el-icon-delete",
                    show: scope => {
                        //console.log(scope);
                        return true
                    },
                    fn: (scope) => {
                        return this.deleteAlreadyKeyworItem(scope.row.keyword)
                    }
                },
            ],
            alreadyCurrentPage:1,
            alreadyPageSize:10,
            alreadySelectKeyword:[],


            //否定词
            negativeOpt:[
                {label:'精确否定',value:'negativeExact'},
                {label:'词组否定',value:'negativePhrase'},
            ],
            negativeWordType:null,//否定词匹配类型
            negativeWordInp:"",//否定词输入
            alterNegativeWordType:null,
            alterNegativeWordTypeShow:false,
            alreadyNegativeWordColumns:[
                {
                    label:"关键词",
                    value:"keyword",
                    showTooltip:true,
                },
                {
                    label:"匹配类型",
                    value:"matchType",
                    enum:{
                        "negativeExact":'精确否定',
                        "negativePhrase":'词组否定',
                    }
                },
            ],
            alreadyNegativeWordTableData:[
            ], //否定词table的数据
            //bigAlreadyNegativeWordTableData:[],//否定词数据的大数组
            loadNegativeWordDatas:[],//通过关键词转化为否定词的数组
            manualAlreadyNegativeWordTableData:[],//手动添加的否定词
            alreadyNegativeWordEdits:[
                {
                    name: "删除",
                    icon: "el-icon-delete",
                    show: scope => {
                        //console.log(scope);
                        return true
                    },
                    fn: (scope) => {
                        return this.deleteNegativeWordItem(scope.row.keyword)
                    }
                },
            ],
            alreadyNegativeWordCurrentPage:1,
            alreadyNegativeWordPageSize:10,
            negativeWordselect:[],


        };
    },
    methods: {
        //已添加关键词输入竞价
        alreadyKeywordInp(e,index){
            //console.log(e.target.value);
            let val = e.target.value;
            //console.log(index);
            if( !val){
                return
            };
            if( isNaN(Number(val)) || ( +val < 0.02) ){
                this.$message.warning('请输入大于0.02的数字')
                e.target.value = ''
                return
            };
            e.target.value = + e.target.value;
            let keyword = this.alreadykeywordTableData[index].keyword ;
            this.bigAlreadykeywordTableData.forEach(i=>{
                if( i.keyword === keyword){
                    this.$set(i,'bid',e.target.value )  
                }
            })
    
        },
        //添加关键词
        addKeyword(){
            if( !this.keywordMatchingType){
                this.$message.warning('请选择匹配类型')
                return
            };
            if(!this.keywordInp){
                this.$message.warning('请输入关键词')
                return
            };
            let words = this.keywordInp.split('\n').
                        map(i=>{return i.trim()}).
                        filter(k=>{return k !== ''});
            let wordsArr = [];
            words.forEach(i=>{
                if( !wordsArr.includes(i)){
                    wordsArr.push(i)
                }
            })
            //let type = this.keywordMatchingType ==="exact" ? '精确匹配' : this.keywordMatchingType ==="broad" ? '广告匹配' :'词组匹配';
            let datas = wordsArr.map(i=>{
                return{
                    keyword :i,
                    matchType: this.keywordMatchingType,
                    bid:''
                }
            });
            console.log('当前添加');
            console.log(datas);
          
            if(this.bigAlreadykeywordTableData.length){
                let flag ;
                datas.forEach(i=>{
                    let flag = true;
                    this.bigAlreadykeywordTableData.forEach(k=>{
                        if( i.keyword === k.keyword){
                            flag =false
                        }   
                    })
                    if(flag){
                        this.bigAlreadykeywordTableData.push(i)
                    };
                });
            
            }else{
                this.bigAlreadykeywordTableData = datas;
            };

            this.$message.success('操作成功');
            this.keywordInp = '';
            this.keywordMatchingType = '';

            this.alreadyCurrentPage = 1
            this.getKeywordDatas()
        },
        //关键词,获取表格数据
        getKeywordDatas(){
            let index = this.alreadyCurrentPage === 1 ? 0 : (this.alreadyCurrentPage-1) * this.alreadyPageSize;
            this.alreadykeywordTableData =  JSON.parse(JSON.stringify(this.bigAlreadykeywordTableData)).splice(index,this.alreadyPageSize)
        },
        //关键词,已添加关键词每页总数改变
        alreadyHandleSizeChange(v){
            //console.log(v);
            this.alreadyCurrentPage = 1;
            this.alreadyPageSize = v;
           this.getKeywordDatas()
        },
        //关键词,已添加关键词当前页改变
        alreadyHandleCurrentChange(v){
            //console.log(v);
            this.alreadyCurrentPage = v;
            this.getKeywordDatas()
        },
        //关键词,表格勾选改变
        alreadyKeywordselectChange(v){
            this.alreadySelectKeyword = v.map(i=>i.keyword);
            //console.log(this.alreadySelectKeyword);
        },
        //关键词, 删除
        deleteAlreadyKeyworItem(v){
            //console.log(v);
            if(v==='all'){ //全部删除
                this.$confirm('此操作将删除全部数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message.success('操作成功')
                    this.alreadykeywordTableData = []
                    this.bigAlreadykeywordTableData = []
                }).catch(() => {
                       
                });
               
            }else if( v ){ //点击单个的删除
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.bigAlreadykeywordTableData.forEach( (i,index)=>{
                        if(i.keyword === v){
                            this.bigAlreadykeywordTableData.splice(index,1)
                        }
                    });
                    this.$message.success('操作成功')
                    if( this.alreadykeywordTableData.length === 1 ){
                        if( this.alreadyCurrentPage !==1 ){
                            this.alreadyCurrentPage --
                        }else{
                             this.alreadyCurrentPage = 1
                        }
                    };
                    this.getKeywordDatas()
                }).catch(() => {
                    
                });
            }else{ //勾选删除
                if( !this.alreadySelectKeyword.length){
                    this.$message.warning('请至少选择一项')
                    return
                };
                this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.alreadySelectKeyword.forEach(i=>{
                        this.bigAlreadykeywordTableData.forEach( (k,index)=>{
                            if( i === k.keyword){
                                this.bigAlreadykeywordTableData.splice(index,1)
                            }
                        })   
                    });
                    this.$message.success('操作成功');
                    if( this.alreadySelectKeyword.length === this.alreadykeywordTableData.length ){
                        if( this.alreadyCurrentPage !==1 ){
                            this.alreadyCurrentPage --
                        }else{
                             this.alreadyCurrentPage = 1
                        }
                    };
                    this.getKeywordDatas()
                }).catch(() => {

                });
            }
        },
        //关键词,点击修改匹配类型
        altermatchingTypeBtn(){
            if( !this.alreadySelectKeyword.length){
                this.$message.warning('请至少选择一项')
                return
            };
            this.altermatchingTypeShow = true
        },
        //关键词,确认修改匹配类型
        alterKeywordTypeBtn(){
            if( !this.alreadySelectKeyword.length){
                this.$message.warning('请至少选择一项')
                return
            };
            if( !this.alterKeywordType ){
                this.$message.warning('请选择匹配类型')
                return
            };
            this.alreadySelectKeyword.forEach(i=>{
                this.bigAlreadykeywordTableData.forEach( (k,index)=>{
                    if( i === k.keyword){
                        //let type = this.alterKeywordType ==="exact" ? '精确匹配' : this.alterKeywordType ==="broad" ? '广告匹配' :'词组匹配';
                        k.matchType = this.alterKeywordType
                    }
                })   
            });
            this.altermatchingTypeShow = false ;
            this.alterKeywordType = null
            this.$message.success('操作成功')
            this.getKeywordDatas()
        },


        //添加否定词
        addNegativeWord(){
            if( !this.negativeWordType){
                this.$message.warning('请选择匹配类型')
                return
            };
            if(!this.negativeWordInp){
                this.$message.warning('请输入关键词')
                return
            };
            let words = this.negativeWordInp.split('\n').
                        map(i=>{return i.trim()}).
                        filter(k=>{return k !== ''});
            let wordsArr = [];
            words.forEach(i=>{
                if( !wordsArr.includes(i)){
                    wordsArr.push(i)
                }
            })
            //let type = this.negativeWordType ==="exact" ? '精确匹配' : this.negativeWordType ==="broad" ? '广告匹配' :'词组匹配';
            let datas = wordsArr.map(i=>{
                return{
                    keyword :i,
                    matchType: this.negativeWordType,
                }
            });
            console.log('当前添加');
            console.log(datas);
          
            if(this.bigAlreadyNegativeWordTableData.length){
                let flag ;
                datas.forEach(i=>{
                    let flag = true;
                    this.bigAlreadyNegativeWordTableData.forEach(k=>{
                        if( i.keyword === k.keyword){
                            flag =false
                        }   
                    })
                    if(flag){
                        this.manualAlreadyNegativeWordTableData.push(i)
                    };
                });
            
            }else{
                this.manualAlreadyNegativeWordTableData = datas;
            };

            this.$message.success('操作成功');
            this.negativeWordInp = '';
            this.negativeWordType = '';

            this.alreadyNegativeWordCurrentPage = 1
            this.getNegativeWordDatas()
        },
        //否定词,获取表格数据
        getNegativeWordDatas(){
            let index = this.alreadyNegativeWordCurrentPage === 1 ? 0 : (this.alreadyNegativeWordCurrentPage-1) * this.alreadyNegativeWordPageSize;
            this.alreadyNegativeWordTableData =  JSON.parse(JSON.stringify(this.bigAlreadyNegativeWordTableData)).splice(index,this.alreadyNegativeWordPageSize)
        },
        //否定词,已添加关键词每页总数改变
        alreadyNegativeWordHandleSizeChange(v){
            this.alreadyNegativeWordCurrentPage = 1
            this.alreadyNegativeWordPageSize = v
            this.getNegativeWordDatas()
        },  
        //否定词,已添加关键词当前页改变
        alreadyNegativeWordHandleCurrentChange(v){
            this.alreadyNegativeWordCurrentPage = v
            this.getNegativeWordDatas()
        },
        //否定词,表格勾选改变
        NegativeWordselectChange(v){
            this.negativeWordselect = v.map(i=>i.keyword);
            //console.log( this.negativeWordselect);
        },
        //否定词,删除
        deleteNegativeWordItem(v){
            if(v==='all'){ //全部删除
                this.$confirm('此操作将删除全部数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message.success('操作成功')
                    this.alreadyNegativeWordTableData = []
                    this.bigAlreadyNegativeWordTableData = []
                }).catch(() => {
                       
                });
               
            }else if( v ){ //点击单个的删除
                this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.bigAlreadyNegativeWordTableData.forEach( (i,index)=>{
                        if(i.keyword === v){
                            this.bigAlreadyNegativeWordTableData.splice(index,1)
                        }
                    });
                    this.$message.success('操作成功')
                    if( this.alreadyNegativeWordTableData.length ===1 ){
                        if( this.alreadyNegativeWordCurrentPage !==1 ){
                            this.alreadyNegativeWordCurrentPage --
                        }else{
                             this.alreadyNegativeWordCurrentPage = 1
                        }
                    }; 
                    this.getNegativeWordDatas()
                }).catch(() => {
                    
                });
            }else{ //勾选删除
                if( !this.negativeWordselect.length){
                    this.$message.warning('请至少选择一项')
                    return
                };
                this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.negativeWordselect.forEach(i=>{
                        this.bigAlreadyNegativeWordTableData.forEach( (k,index)=>{
                            if( i === k.keyword){
                                this.bigAlreadyNegativeWordTableData.splice(index,1)
                            }
                        })   
                    });
                    this.$message.success('操作成功')
                    if( this.negativeWordselect.length === this.alreadyNegativeWordTableData.length ){
                        if( this.alreadyNegativeWordCurrentPage !==1 ){
                            this.alreadyNegativeWordCurrentPage --
                        }else{
                             this.alreadyNegativeWordCurrentPage = 1
                        }
                    };
                    this.getNegativeWordDatas()
                }).catch(() => {

                });
            }
        },
        //否定词,点击修改匹配类型
        alterNegativeWordTypeBtn(){
            if( !this.negativeWordselect.length){
                this.$message.warning('请至少选择一项')
                return
            };
            this.alterNegativeWordTypeShow = true
        },
        //否定词,确定修改匹配类型
        alterNegativeWordTypeSubmit(){
            if( !this.negativeWordselect.length){
                this.$message.warning('请至少选择一项')
                return
            };
            if( !this.alterNegativeWordType ){
                this.$message.warning('请选择匹配类型')
                return
            };
            this.negativeWordselect.forEach(i=>{
                this.bigAlreadyNegativeWordTableData.forEach( (k,index)=>{
                    if( i === k.keyword){
                        //let type = this.alterNegativeWordType ==="exact" ? '精确匹配' : this.alterNegativeWordType ==="broad" ? '广告匹配' :'词组匹配';
                        k.matchType = this.alterNegativeWordType
                    }
                })   
            });
            this.alterNegativeWordTypeShow = false ;
            this.alterNegativeWordType = null
            this.$message.success('操作成功')
            this.getNegativeWordDatas()
        },

        //加载加载推荐否定词
        loadNegativeWord(){
            let params = {
                keywords : this.bigAlreadykeywordTableData,
                platformId: this.platformId,
                siteId: this.siteId,
                sellerId: this.sellerId,
            }
            if (this.advertisingSeriesShow) {  
                if(!this.value2 && this.value2 !==0 ){
                    this.$message.warning('请选择广告组')
                    return
                };
                params.adGroupId = this.value2

            } else { //创建新广告传的参数不一样
                //console.log(this.productIds);
                if ( !this.productIds.length) {
                    this.$message.warning('请至少添加一个产品')
                    return 
                }
                 params.productIds = this.productIds

            }
            this.$api['keywordNegativeListByProduct'](params)
            .then(res => {
                this.$message.success('操作成功')
                let {data} = res;
                this.loadNegativeWordDatas = data
                this.getNegativeWordDatas()

            }).catch(() => {})
        },

        //广告系列选择改变获取广告组的下拉
        sdvertisingSeriesChange(v){
            //console.log(v);
            if( v ){
                this.value2 = ''
                this.getOptions({adType:1,campaignIds:[v]},2) ;
            }
        },
        //获取广告组合或广告系列的下拉
        getOptions(v,type){
            let {platformId,siteId,sellerId} = this.sellerData;
            let params = {platformId,siteId,sellerId,...v};
            this.$api['adKeywordQueryAdDataOption1'](
               params
            )
            .then(res => {
                let {data} = res;
                //console.log(data);
                let datas = data.map(i=>{
                    return {
                        label : i.name,
                        value : i.id,
                    }
                });
                switch(type){
                    case 1:
                        this.sdvertisingSeriesOpt = datas 
                        //console.log(this.sdvertisingSeriesOpt);
                    break;
                    case 2:
                        this.adGroupOpt = datas
                        //console.log(this.adGroupOpt);
                    break;
                    default:
                    break;
                }
                
            }).catch(() => {})
        },

        //提交
        submitBtn(v){
            if(!this.value2 && this.value2 !==0 && !v ){
                this.$message.warning('请选择广告组')
                return Promise.reject(false)
            };
            if( !this.bigAlreadykeywordTableData.length){
                this.$message.warning('请添加关键词数据')
                return  Promise.reject(false)
            };
            let {platformId,siteId,sellerId} = this.sellerData
            let params = {platformId,siteId,sellerId}
            params.adGroupId = this.value2
            params.keywords = this.bigAlreadykeywordTableData
            if( this.bigAlreadyNegativeWordTableData && this.bigAlreadyNegativeWordTableData.length){
                params.negativeKeywords = this.bigAlreadyNegativeWordTableData
            };
            //如果参数存在是创建新广告调用的
            if(v){
                return params
            };
            this.$api['adKeywordSave1'](params)
            .then(data => {
                this.$emit('AddExistingAdSuccess')
            }).catch(() => {})


        }

    },
    created() {
        //获取广告系列的下拉
        if(this.advertisingSeriesShow){
            if(this.sellerId && this.siteId){
                this.getOptions({adType:0},1)
            }  
        };
        if( this.keywords){
            this.keywordInp = this.keywords
        }
        let {keywords} = this.$route.query
        if (keywords) {
            this.keywordInp = keywords
        }
    },
    computed:{
        inpKeywordLength(){
            let num =  this.keywordInp ? 
                        this.keywordInp.split('\n').
                        map(i=>{return i.trim()}).
                        filter(k=>{return k !== ''})
                        .length : 0
            return num
        },
        inpNegativeWordLength(){
            let num =  this.negativeWordInp ? 
                        this.negativeWordInp.split('\n').
                        map(i=>{return i.trim()}).
                        filter(k=>{return k !== ''})
                        .length : 0
            return num
        },
        bigAlreadyNegativeWordTableData(){
            return this.manualAlreadyNegativeWordTableData.concat(this.loadNegativeWordDatas) 
        }

    },
    watch:{
        sellerData(){
            if(this.advertisingSeriesShow){
                if(this.sellerId && this.siteId){
                    this.getOptions({adType:0},1)
                }  
            };
        },
    }
};
</script>

<style scoped lang="less">
.bor-div{
    border:1px solid #dcdcdc;
    margin-top: 30px;
    .tit{
        font-size: 18px;
        color:#333;
        padding-left: 4px;
        line-height: 40px;
         border-bottom:1px solid #dcdcdc;
    }
    .cont{
         margin-left: 4px;
         margin-top: 10px;
         position: relative;
         .label{
              margin: 10px 10px;
         }
         .select{
             margin: 10px 10px;
         }
         .inp{
              margin: 10px 10px;
         }
         .word-length{
              margin: 10px 10px;
              padding-bottom: 20px;
         }
         .add-btn{
             position: absolute;
             right: 16px;
             bottom: 0;
         }
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
.hint-tit{
    margin: 0 4px;
    color: #f56c6c;
    font-size: 12px;
}
          
</style>
