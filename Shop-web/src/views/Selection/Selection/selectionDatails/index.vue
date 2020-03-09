<template>
    <div>
        <!-- 筛选条件 -->
        <el-collapse class="custom-collapse" value="'1'" accordion>
            <el-collapse-item name="1" label-width="80px">
                <div class="collapse-item-title" slot="title">
                    <span>筛选条件</span>
                    <!-- <ElButton @click.stop="handleBack" type="text" icon="el-icon-back">返回</ElButton> -->
                </div>
                <el-form :inline="true" ref="searchRuleForm" :model="listQuery"  :rules="rules" >
                   

                    <el-form-item label="价格区间" prop="minPrice"  v-if='searchIsShow.price'>
                        <el-input v-model.trim="listQuery.minPrice" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxPrice" v-if='searchIsShow.price'>
                        <el-input v-model.trim="listQuery.maxPrice" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="大类BSR" prop="minRank" v-if='searchIsShow.bigBSR'>
                        <el-input v-model.trim="listQuery.minRank" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxRank" v-if='searchIsShow.bigBSR'>
                        <el-input v-model.trim="listQuery.maxRank" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="小类BSR" prop="minSmallBsrCnt" v-if='searchIsShow.smallBSR'>
                        <el-input v-model.trim="listQuery.minSmallBsrCnt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxSmallBsrCnt" v-if='searchIsShow.smallBSR'>
                        <el-input v-model.trim="listQuery.maxSmallBsrCnt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="评分区间" prop="minStarCnt" v-if='searchIsShow.StarCnt'>
                        <el-input v-model.trim="listQuery.minStarCnt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxStarCnt" v-if='searchIsShow.StarCnt'>
                        <el-input v-model.trim="listQuery.maxStarCnt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="销量排名" prop="minSalesRankRt" v-if='searchIsShow.SalesRankRt'>
                        <el-input v-model.trim="listQuery.minSalesRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxSalesRankRt" v-if='searchIsShow.SalesRankRt'>
                        <el-input v-model.trim="listQuery.maxSalesRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="评分排名" prop="minStarRankRt" v-if='searchIsShow.StarRankRt'>
                        <el-input v-model.trim="listQuery.minStarRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxStarRankRt" v-if='searchIsShow.StarRankRt'>
                        <el-input v-model.trim="listQuery.maxStarRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="评价数排名" prop="minReviewRankRt" v-if='searchIsShow.ReviewRankRt'>
                        <el-input v-model.trim="listQuery.minReviewRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxReviewRankRt" v-if='searchIsShow.ReviewRankRt'>
                        <el-input v-model.trim="listQuery.maxReviewRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="同款数排名" prop="minSameRankRt" v-if='searchIsShow.SameRankRt'>
                        <el-input v-model.trim="listQuery.minSameRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxSameRankRt" v-if='searchIsShow.SameRankRt'>
                        <el-input v-model.trim="listQuery.maxSameRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="直评数排名" prop="minDirectRankRt" v-if='searchIsShow.DirectRankRt'>
                        <el-input v-model.trim="listQuery.minDirectRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxDirectRankRt" v-if='searchIsShow.DirectRankRt'>
                        <el-input v-model.trim="listQuery.maxDirectRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="月新增评价数" prop="minAvgNewReviewCnt" v-if='searchIsShow.AvgNewReviewCnt'>
                        <el-input v-model.trim="listQuery.minAvgNewReviewCnt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxAvgNewReviewCnt" v-if='searchIsShow.AvgNewReviewCnt'>
                        <el-input v-model.trim="listQuery.maxAvgNewReviewCnt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>
                
                    <!-- <el-form-item label="店铺产品月新增评价数排名: " prop="minShopNewReviewRankRt" v-if='searchIsShow.ShopNewReviewRankRt'>
                        <el-input v-model="listQuery.minShopNewReviewRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxShopNewReviewRankRt" v-if='searchIsShow.ShopNewReviewRankRt'>
                        <el-input v-model="listQuery.maxShopNewReviewRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item> -->

                    <el-form-item prop="startReleaseDate" label="上架时间" v-if='searchIsShow.joinDate'>
                        <el-date-picker
                            size='mini'
                            v-model="listQuery.startReleaseDate"
                            type="date"
                            clearable
                            value-format='yyyy-MM-dd'
                            placeholder="选择开始时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="endReleaseDate" label="~" v-if='searchIsShow.joinDate'>
                          <el-date-picker
                            size='mini'
                            v-model="listQuery.endReleaseDate"
                            type="date"
                            clearable
                            value-format='yyyy-MM-dd'
                            placeholder="选择结束时间">
                            </el-date-picker>
                    </el-form-item>

                    <el-form-item label="评价数" prop="minReviewCnt" v-if='searchIsShow.ReviewCnt'>
                        <el-input v-model.trim="listQuery.minReviewCnt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxReviewCnt" v-if='searchIsShow.ReviewCnt'>
                        <el-input v-model.trim="listQuery.maxReviewCnt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="品牌归属国" prop="brandOwnerAddr" v-if='searchIsShow.brandOwnerAddr'>
                        <el-select v-model="listQuery.brandOwnerAddr" placeholder="请选择" size='mini'  clearable>
                            <el-option
                            v-for="item in brandOwnerAddrOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="店铺Feedback月新增数排名" prop="minNewFeedbackRankRt" v-if='searchIsShow.NewFeedbackCnt'>
                        <el-input v-model.trim="listQuery.minNewFeedbackRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxNewFeedbackRankRt" v-if='searchIsShow.NewFeedbackCnt'>
                        <el-input v-model.trim="listQuery.maxNewFeedbackRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>

                    <el-form-item label="月新增评价数排名" prop="minAvgNewReviewRankRt" v-if='searchIsShow.AvgNewReviewRankRt'>
                        <el-input v-model.trim="listQuery.minAvgNewReviewRankRt" placeholder="请输入最低值" size='mini' clearable></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxAvgNewReviewRankRt" v-if='searchIsShow.AvgNewReviewRankRt'>
                        <el-input v-model.trim="listQuery.maxAvgNewReviewRankRt" placeholder="请输入最高值" size='mini' clearable></el-input>
                    </el-form-item>
                  
                    <el-form-item>
                        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
                        
                        <el-button size="small" type="primary" plain @click="resetSearch" :disabled="$store.state.isloading || $store.state.loading">重置搜索</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-popover
                            placement="bottom"
                            width="400"
                            trigger="hover">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group v-model="checkedClassify" @change="handleCheckedClassifyChange">
                                <el-checkbox 
                                    v-for="(item) in ClassifyArray" 
                                    :label="item.label" 
                                    :key="item.label" 
                                    style='width:160px;'
                                    :style="{marginLeft:item.label==='上架时间'?'30px':''}"
                                >
                                    {{item.label}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-button size="small" type="primary"  plain  slot="reference" >自定义筛选条件</el-button>
                        </el-popover>
                    </el-form-item>
                   
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <!-- 操作按钮 -->
        <div class="btns">
          <ElButton
            v-for="item in editBtns"
            :key='item.id'
            type="primary"
            size="small"
            :loading='item.loading'
            @click="btnClick(item)"
            plain
          >{{item.name}}</ElButton>
        </div>
        <!-- table表格 -->
        <yt-table
          :treeTable="treeTable"
            :treeTableOtions="treeTableOtions"
            v-loading="tableLoading"
            @sortChange="sortChange"
            @selectChange="selectChange"
            border
            :reserveSelection='reserveSelection'
            class="table"
            :data="tableList"
            :columns="columns"
            >
          <template slot="right">
            <el-table-column label="操作" :width="editWidth" v-if="edits.length">
              <template slot-scope="scope">
                <template v-for="(item, index) in edits">
                  <template v-if="typeof item.show === 'boolean' ? item.show : item.show(scope)">
                    <template v-if="!item.childs">
                      <el-button
                        v-if="!item.icon"
                        class="right-btns"
                        type="text"
                        :key="index"
                        @click="item.fn(scope, item)"
                        :icon="item.icon"
                      >item.name</el-button>
                      <el-tooltip v-else :content="item.name" placement="top">
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

        <el-pagination
          background
          :total="total"
          :current-page.sync="listQuery.pageNumber"
          :page-size="listQuery.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

        <!-- 弹框 -->
        <Dialog :options="innerDialogOpts" :events="events" @close="innerDialogOpts.visible = false" ref='DialogRef' @fullscreen='fullscreen'>
            <transition-type name="fadeIn-fadeOut">
                <component
                v-if="innerDialogOpts.visible"
                :is="dialogComponent.component"
                :params="dialogComponent.params"
                ref="component"
                ></component>
            </transition-type>
        </Dialog>

        <a ref='link'></a>
    </div>
</template>

<script>
import Dialog from '../common/bigDialog';

export default {
    components: {
        Dialog
    },
    data() {
        let vm=this;
        //搜索的表单的验证规则
        var validatePass = (rule, value, callback) => {
            let that=this;
            // console.log(rule);
            // console.log(value);
            if(!value){
                return callback();

            }else if(isNaN(Number(value)) && rule.field!=="startReleaseDate" && rule.field!=="endReleaseDate" && rule.field!=="brandOwnerAddr"){
                //当前选择不是开始时间 结束时间 品牌归属国
                //需要是数字
                return callback(new Error('请输入数字'));
                
            }else if(Number(value)<=0 ){
                  return callback(new Error('请输入正整数'));

            }else if(value.indexOf(".")===0 ){
                 return callback(new Error('请输入数字'));

            }else if(rule.field==="minPrice" || rule.field==="maxPrice" || rule.field==="minStarCnt" || rule.field==="maxStarCnt"){
                //当前是价格 和 评分区间
                if( rule.field==="minPrice" || rule.field==="minStarCnt"){
                    isSmall(rule.field);
                }else{
                    isBig(rule.field);
                };
                if(value.indexOf('.')){
                    var y = value.indexOf(".") + 1;//获取小数点的位置
                    var count = value.length - y;//获取小数点后的个数
                    if(count>2 || count===0) {
                          return callback(new Error('若小数,请输入一位或两位小数'));
                    }
                };

            }else{
                let present=rule.field;//当前的验证属性

                //时间验证 
                if(present==="startReleaseDate" &&  present.indexOf('start')!==-1  ){  // 当前是开始时间 ,小值需小于其对应的大值
                    let index=this.validateIndex.indexOf(present);//拿到当前属性的位置
                    //console.log(index);
                    let nextPro=this.validateIndex[index+1];//拿到对应的下一个属性
                    //console.log(nextPro);
                    let nextVal=this.listQuery[nextPro];//拿到当前属性的大值
                    let small= this.listQuery[present];//拿到当前属性小值
                    if( (new Date(small).getTime() > new Date(nextVal).getTime() ) && new Date(nextVal).getTime() ){
                         return callback(new Error('需小于结束时间'));
                    };

                }else if( present==="endReleaseDate" &&  present.indexOf('end')!==-1 ){
                    let index=this.validateIndex.indexOf(present);//拿到当前属性的位置
                    //console.log(index);
                    let up=this.validateIndex[index-1];//拿到对应的上一个属性
                    //console.log(nextPro);
                    let nextVal=this.listQuery[present];//拿到当前属性的大值
                    let small= this.listQuery[up];//拿到当前属性小值
                    if( (new Date(small).getTime() > new Date(nextVal).getTime() ) && new Date(small).getTime() ){
                         return callback(new Error('需大于开始时间'));
                    };

                };
               
                //不是时间的验证,
                if(present.indexOf('min')!==-1){  //说明当前输入的是小值 ,小值需小于其对应的大值
                    isSmall(present);
                }else{
                    isBig(present);
                };


            };
            
            //当前输入是小值得函数的调用
            function isSmall(present){
               let index=that.validateIndex.indexOf(present);//拿到当前属性的位置
                //console.log(index);
                let nextPro=that.validateIndex[index+1];//拿到对应的下一个属性
                //console.log(nextPro);
                let nextVal=that.listQuery[nextPro];//拿到当前属性的大值
                let small= that.listQuery[present];//拿到当前属性小值
               if( (Number(small) >=  Number(nextVal )) && nextVal){
                    return callback(new Error('需小于最大值'));
                }
            };
            //当前输入是大值得函数的调用
            function isBig(present){
                let index=that.validateIndex.indexOf(present);//拿到当前属性的位置
                //console.log(index);
                let up=that.validateIndex[index-1];//拿到对应的上一个属性
                //console.log(nextPro);
                let nextVal=that.listQuery[present];//拿到当前属性的大值
                let small= that.listQuery[up];//拿到当前属性小值
                if( (Number(small) >= Number(nextVal )) && small ){
                        return callback(new Error('需大于小值'));
                };
            };
            
            callback();
        };
        return {
            reserveSelection:'parentAsin',
            //查询添条件
                listQuery:{
                    startReleaseDate:"",//上架开始时间
                    endReleaseDate:"",//上架结束时间
                    minPrice:'',//价格最小值
                    maxPrice:'',//价格最小值
                    minRank:"",//大类BSR小值
                    maxRank:"",//大类BSR大值
                    minSmallBsrCnt:"",//小类BSR小值
                    maxSmallBsrCnt:"",//小类BSR大值
                    minAvgNewReviewCnt:'',//月新增评价数小值
                    maxAvgNewReviewCnt:'',//月新增评价数大值
                    minStarCnt:"",//评分区间小值
                    maxStarCnt:"",//评分区间大值
                    minReviewCnt:"",//评价数小值
                    maxReviewCnt:"",//评价数大值
                    minShopNewReviewRankRt:"",//店铺产品月新增评价数排名最小值
                    maxShopNewReviewRankRt:"",//店铺产品月新增评价数排名最大值
                    brandOwnerAddr:"",//品牌归属国
                    minSalesRankRt:"",//销量排名小值
                    maxSalesRankRt:"",//销量排名大值
                    minStarRankRt:"",//评分排名小值
                    maxStarRankRt:"",//评分排名大值
                    minReviewRankRt:"",//评价数排名小值
                    maxReviewRankRt:"",//评价数排名大值
                    minAvgNewReviewRankRt:"",//月新增评价数排名小值
                    maxAvgNewReviewRankRt:"",//月新增评价数排名大值
                    minDirectRankRt:null,//直评数排名小值
                    maxDirectRankRt:null,//直评数排名小值
                    minSameRankRt:"",//同款数排名最小值
                    maxSameRankRt:"",//同款数排名最大值
                   // minNewFeedbackCnt:"",//店铺feedback月新增数排名最小值
                    minNewFeedbackRankRt:"",//店铺feedback月新增数排名最小值
                    //maxNewFeedbackCnt:"",//店铺feedback月新增数排名最大值
                    maxNewFeedbackRankRt:"",//店铺feedback月新增数排名最大值

                    siteId:'',
                    sellerId:'',
                    taskId:'',//任务id
                    platformId:this.platformId,
                    pageNumber:1,
                    pageSize:10,
                },
            //品牌归属国下拉
            brandOwnerAddrOptions:[
                {label:"中国",value:'中国'},
                {label:"美国",value:'美国'},
                {label:"英国",value:'英国'},
                {label:"法国",value:'法国'},
            ],

            tableLoading:false,//确认搜索的和table表格的loading


            //自定义筛选条件
            checkAll:false,//是否全部勾选
            checkedClassify:['上架时间','价格区间','大类BSR','评分区间','小类BSR'],//单个的勾选
            isIndeterminate: true,
            //自定义筛选的全部options
            ClassifyArray:[
                {label:'上架时间',sign:"joinDate"},
                {label:'价格区间',sign:"price"},
                {label:'大类BSR',sign:"bigBSR"},
                {label:'评分区间',sign:"StarCnt"},
                {label:'小类BSR',sign:"smallBSR"},
                {label:'销量排名',sign:"SalesRankRt"},
                {label:'评分排名',sign:"StarRankRt"},
                {label:'评价数',sign:"ReviewCnt"},
                {label:'月新增评价数',sign:"AvgNewReviewCnt"},
                {label:'品牌归属国',sign:"brandOwnerAddr"},
                {label:'评价数排名',sign:"ReviewRankRt"},
                {label:'月新增评价数排名',sign:"AvgNewReviewRankRt"},
                {label:'直评数排名',sign:"DirectRankRt"},
                {label:'同款数排名',sign:"SameRankRt"},
                //{label:'店铺产品月新增评价数排名',sign:"ShopNewReviewRankRt"},
                {label:'店铺feedback月新增数排名',sign:"NewFeedbackCnt"}
            ],
            //自定义筛选条件是否显示
            searchIsShow:{
                joinDate:true, //上架时间
                price:true,//价格区间
                bigBSR:true,//大类BSR
                StarCnt:true,//评分区间
                smallBSR:true,//小类BSR
                SalesRankRt:false,//销量排名
                StarRankRt:false,//评分排名
                ReviewCnt:false,//评价数
                AvgNewReviewCnt:false,//月新增评价数
                brandOwnerAddr:false,//品牌归属国
                ReviewRankRt:false,//评价数排名
                AvgNewReviewRankRt:false,//月新增评价数排名
                DirectRankRt:false,//直评数排名
                SameRankRt:false,//同款数排名
                //ShopNewReviewRankRt:false,//店铺产品月新增评价数排名
                NewFeedbackCnt:false,//店铺feedback月新增数排名
            },

            //table表格配置
            treeTable: true,
            treeTableOtions: {
                childs: "sameListings",
                expandFunc: row => {
                    return (row.sameListings && row.sameListings.length > 0);
                }
            },
            tableLoading:false,//tableloading加载
            tableList:[],//table数据
            //table的每一项
            columns: [
                {
                    label: "ASIN",
                    value: "parentAsin",
                    minWidth: 150,
                    //url:'productUrl',
                    expand: true,
                    render(h,scope){
                        return (
                            <a href={scope.row.productUrl} target='_blink' style='color: #4BA2D7;'>{scope.row.parentAsin}</a>
                        )
                    }
                },
                {
                    value: "imageUrl", //table需要渲染的值
                    label: "主图", //表头
                    // width: "60", //当前行宽度
                    img: true, //如图片传
                    style: {
                        //图片宽高
                        width: 40,
                        height: 40
                    },
                    bulkyHeight: 150 //鼠标hover图片高，宽度自动
                },
                {
                    label: "价格",
                    value: "price",
                    // expand: true,
                    minWidth: 150,
                    sortable: 'custom',
                },
                {
                    label: "大类BSR",
                    value: "rank",
                    minWidth: 150,
                    sortable: true,
                },
                {
                    label: "小类",
                    value: "smallBsrCnt",
                    minWidth: 150,
                    sortable: 'custom',
                    render(h, scope) {
                            // console.log('object');
                            // console.log(scope.row);
                            return <el-button type='text' onClick={() =>{
                              vm.$dialog({
                                title: "查看类目",
                                width:'800px',
                                showMaxBtn:false,
                                params: {
                                    sellerId:vm.listQuery.sellerId,
                                    siteId:vm.listQuery.siteId,
                                    taskId:vm.$route.query.taskId, //任务id
                                    parentAsin:scope.row.parentAsin,//父asin
                                },
                                component: () => import("../common/selectionTaskDetailsSmallClassDialog.vue"),
                                //okBtnText: "确认",
                                //cancelBtnText: "取消"
                            });
                        
                            }}>{scope.row.smallBsrCnt}</el-button>
                        }
                },
                 {
                    label: "月新增评价数",
                    value: "avgNewReviewCntD30",
                    minWidth: 150,
                    sortable: 'custom'
                }, {
                    label: "评分",
                    value: "starCnt",
                    minWidth: 150,
                    sortable: 'custom'
                }, {
                    label: "评价数",
                    value: "reviewCnt",
                    minWidth: 150,
                    sortable: 'custom'
                }, {
                    label: "品牌归属国",
                    value: "brandOwnerAddr",
                    minWidth: 150,
                }, {
                    label: "上架时间",
                    value: "releaseDate",
                    minWidth: 150,
                    sortable: 'custom',
                    render(h,scope){
                        return(
                            <span>{scope.row.releaseDate.split(' ')[0]}</span>
                        )
                    }
                }, {
                    label: "销量排名",
                    value: "salesRankRt",
                    minWidth: 150,
                    sortable: 'custom',
                }, {
                    label: "同款listing数",
                    value: "listingCnt",
                    minWidth: 150,
                    sortable: 'custom',
                },
                {
                    label: "卖家归属地",
                    value: "shopCnFlag",
                    minWidth: 150,
                    render(h, scope) {
                            // console.log('object');
                            // console.log(scope.row);
                        return (
                            <span>{scope.row.shopCnFlag===0?"国外":"CN"}</span>
                        )
                    }
                },{
                    label: "直评数",
                    value: "directCnt",
                    minWidth: 150,
                    sortable: 'custom'
                },{
                    label: "评价师评价数",
                    value: "appraiserReviewCnt",
                    minWidth: 150,
                    sortable: 'custom'
                },{
                    label: "上架前评价数",
                    value: "beforeShefReviewCnt",
                    minWidth: 150,
                    sortable: true,
                },
                {
                    label: "上架后30天内日新增评价数",
                    value: "shefAvgNewReviewCntD30",
                    minWidth: 200,
                    sortable: 'custom'
                },
                {
                    label: "buybox获得卖家数",
                    value: "buyboxCnt",
                    minWidth: 150,
                    render(h, scope) {
                            // console.log('object');
                            //console.log(scope.row);
                            return <el-button type='text' onClick={() =>{
                                if(scope.row.buyboxCnt==0){
                                    return
                                };
                                vm.$dialog({
                                    title: "卖家详情",
                                    width:'800px',
                                    params: {
                                        //datas:scope.row.buyBoxSellers,
                                        taskId:scope.row.taskId,
                                        parentAsin:scope.row.parentAsin,
                                        platformId:vm.platformId,
                                        sellerId:vm.listQuery.sellerId,
                                        siteId:vm.listQuery.siteId,
                                    },
                                    component: () => import("../common/buyboxNumberOfSellersDialog.vue"),
                                    //okBtnText: "确认",
                                    //cancelBtnText: "取消"
                                });
                        
                            }}>{scope.row.buyboxCnt}</el-button>
                        }
                },

            ],
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看新增评价数",
                        icon: "el-icon-search",
                        fontSize:'16px',
                        show: scope => {
                            //console.log(scope);
                            return true//scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.lookDatsils(scope.row)
                        }
                    },

                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "重新抓取数据",
                        showLoading:true,
                        fn: () =>{
                            return this.refetchData()
                        }
                    },
                    {
                        name: "人工标注同款",
                        showLoading:true,
                        fn: () => {
                           return this.markSameItem(1);
                        }
                    },
                     {
                        name: "设为独立",
                        showLoading:true,
                        fn: () => {
                            return this.markSameItem(0);
                        }
                    },
                    {
                        name: "加入竞品分析",
                        fn: () =>{
                            this.joinPartBtn()
                        }
                    },
                    {
                        name: "导出",
                        showLoading:true,
                        fn: () =>{
                           return this.exportBtn()
                        }
                    },
                    
                ],
            //table表格右边操作栏总宽度
            editWidth: {
                default: 120
            },

            total:0,//分页总页数

            rules:{},//表单验证
            validatePass,//搜搜表单验证规则
            validateIndex:[],//记录验证规则的属性,好得到其位置

            selectIds:[],//表格勾选的ASIN数组
            selectproducts:[],//勾选的产品数组
            
            //弹框的配置
            innerDialogOpts: {
                visible: false,
                closeOnClickModal: true
            },
            dialogComponent: {},//弹框的组件
            //弹框的事件
            events:{
                open() {
                    setTimeout(() => {
                        vm.$nextTick(() => {
                        // 弹窗里的组件
                        let component = vm.$refs.component
                        if (!component) {
                            return
                        }
                        // 调用组件初始化函数
                        component && component._initData && component._initData()
                        })
                    })
                },
                close() {
                    // 弹窗里的组件
                    let component = vm.$refs.component
                    // 调用组件关闭函数
                    component && component._close && component._close()
                    },
                    handleOkClick() {
                    let component = vm.$refs.component
                    // if (!component) {
                    //   return
                    // }
                    if (!component._submit) {
                        throw new Error('确保弹窗组件内定义了_submit方法')
                    }
                    return (
                        component &&
                        component._submit &&
                        component._submit().then(res => {
                        if (res) {
                            vm.innerDialogOpts.visible = false
                            vm.getList(undefined, res === 'reset')
                        }
                        })
                    )
                }
            }

        };
    },
    methods: {
        btnClick(item){
            if(item.showLoading) {
                this.$set(item, 'loading', true)
            }
            const done = () => {
                item.loading = false
            }
            let res = item.fn()
            if(res && res.then) {
                res.then(() => {
                    done()
                }).catch(() =>{
                    done()
                })
            }
            return res
        },
        fullscreen(){
            this.$refs.component.echratsResize()
        },
        //返回按钮
            // handleBack() {
            //     const matched = this.$route.matched
            //     const len = matched.length
            //     const backRoute = matched[len - 2]
            //     this.$router.push({
            //         name: backRoute.name,
            //         query: backRoute.query,
            //         params: backRoute.params
            //     })
            // },
        //确认搜索
            handleSearch(){
                this.listQuery.pageNumber=1;
                this.getList();
            },
        //重置搜素
            resetSearch(){
                this.$refs.searchRuleForm.resetFields();
                this.listQuery.pageNumber=1;
                this.getList();
            },
        //自定义筛选条件展示全选改变
            handleCheckAllChange(val){
                let label=[];//拿到选择的所有的label
                this.ClassifyArray.forEach(i=>{
                    label.push(i.label);
                });
                this.checkedClassify = val ? label : [];
                this.isIndeterminate = false;
                //console.log(val);
                
                //全选把所有的筛选条件展示
                if(val){
                    for (const key in this.searchIsShow) {
                        if (this.searchIsShow.hasOwnProperty(key)) {
                            this.searchIsShow[key]=true;
                        }
                    }
                }else{
                    for (const key in this.searchIsShow) {
                        if (this.searchIsShow.hasOwnProperty(key)) {
                            this.searchIsShow[key]=false;
                        }
                    }
                }
            },
        //自定义筛选条件展示单个勾选改变
            handleCheckedClassifyChange(value){
                //console.log(value);
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.ClassifyArray.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.ClassifyArray.length;
                let arr=[]; // 自定义筛选条件是否显示,要显示的字段保存起来
                if(value.length>=0){
                    value.forEach(item=>{
                        this.ClassifyArray.forEach(i=>{
                            if(item===i.label){
                                arr.push(i.sign);
                            }
                        })
                    })
                    //console.log(arr);
                    //先把所有的自定义筛选显示变为不显示
                    for (const key in this.searchIsShow) {
                        if (this.searchIsShow.hasOwnProperty(key)) {
                            this.searchIsShow[key]=false;
                        };
                    };
                    //自定义筛选条件是否显示,把对应的显示出来
                    arr.forEach(i=>{
                        if (this.searchIsShow.hasOwnProperty(i)) {
                           this.searchIsShow[i]=true;
                        }
                    });
                    //console.log(this.searchIsShow);
                };
            },
        //tabl表格排序改变
            sortChange(column, prop, order){
                let tit=column.prop; //排序的字段名
                let sort=column.order;//排序顺序
                console.log(tit);
                console.log(sort);
                let v=this.sortableFunc(column, tit, sort );
                this.listQuery.sortField=v.sortField;
                this.listQuery.sort=v.sort;
                this.listQuery.pageNumber=1;
                this.getList();
            },
        //table排序参数处理
            sortableFunc(column, pro, order ){
                let prop = pro.replace(/[A-Z]/g, function (match) {
                    return '_' + match.toLowerCase()
                })
                return {
                    sort: order === 'ascending' ? 1 : 0,
                    sortField: prop
                }
            },
        //tabl表格勾选改变
            selectChange(v){
                console.log(v);
                this.selectIds=[];
                this.selectproducts=[];
                v.forEach(i=>{
                    this.selectIds.push(i.parentAsin);
                    this.selectproducts.push({parentAsin:i.parentAsin,listingCnt:i.listingCnt,sameNo:i.sameNo})
                })
            },
        //重新抓取数据
            refetchData(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:"请至少勾选一项",
                        type:'warning'
                    });
                    return Promise.reject()
                };
                return this.$api['taskSelectionRetrieveData']({
                    sellerId:this.listQuery.sellerId,
                    siteId:this.listQuery.siteId,
                    taskId:this.listQuery.taskId,
                    parentAsins:this.selectIds,
                })
                .then(data => {
                    //console.log(data);
                    if(data.code===0){
                        this.getList();
                    }
                })
            },
        //分页当前页改变
            handleCurrentChange(val){
                //console.log(val);
                this.listQuery.pageNumber = val
                this.getList()
            },  
        //分页每页总数改变
            handleSizeChange(){
                this.listQuery.pageSize = val
                this.getList()
            },  
        //人工标记为同款/独立
            markSameItem (n){
                if(this.selectIds.length===0){
                    this.$message({
                        message:"请至少勾选一项",
                        type:'warning'
                    });
                    return Promise.reject()
                };
                return this.$api['taskSelectionManualHandle']({
                    sellerId:this.listQuery.sellerId,
                    siteId:this.listQuery.siteId,
                    taskId:this.listQuery.taskId,
                    products:this.selectproducts,
                    sameFlag:n,
                })
                .then(data => {
                    //console.log(data);
                    if(data.code===0){
                        this.getList()
                    };
                
                }).catch(() => {})
            },
        //加入竞品分析
            joinPartBtn(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    })
                    return
                };
                this.$dialog({
                    title: "加入竞品分析",
                    width: "500px",
                    params: {
                        sellerId:this.listQuery.sellerId,//卖家id
                        siteId:this.listQuery.siteId,//站点id
                        platformId:this.platformId,
                        url:"productAnalysisSave",//请求数据的url
                        asins:this.selectIds
                    },
                    component: () => import("../common/addProductAnalysisDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //导出
            exportBtn(){
                let data={
                    siteId: this.listQuery.siteId,
                    sellerId: this.listQuery.sellerId,
                    taskId:this.listQuery.taskId,
                };
                if(this.selectIds.length>0){
                    data.parentAsins=this.selectIds
                };
                return this.$api['taskSelectionExportTaskDetail'](
                    data
                )
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "选品任务分析详情.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(err=>{

                })
            },
        //查看新增评价数
            lookDatsils(v){
                console.log(v);
                 this.$dialog({
                    title: "新增评价数",
                    width: "1200px",
                    //size: "large",
                    showMaxBtn:true,
                    params: {
                        taskId:this.listQuery.taskId,//任务id
                        parentAsin:v.parentAsin,
                        resultTime:v.releaseDate,//上架时间
                        url:"taskSelectionListReview",//请求数据的url
                        time:v.releaseDate,
                        parentAsin:v.parentAsin

                    },
                    component: () => import("../common/echartsDialog.vue"),
                    // okBtnText: "确认",
                    // cancelBtnText: "取消"
                });
            },
         //弹窗
            $dialog({ title, width,showMaxBtn, component, okBtnText, cancelBtnText, params }) {
                component().then(com => {
                    //console.log(com)
                    com.default.inheritAttrs = false
                    this.dialogComponent.component = com.default
                    this.dialogComponent.params = params
                    this.innerDialogOpts.title = title
                    this.innerDialogOpts.visible = true
                    this.innerDialogOpts.showMaxBtn = showMaxBtn
                    this.innerDialogOpts.width = width
                    this.innerDialogOpts.okBtnText = okBtnText
                    this.innerDialogOpts.cancelBtnText = cancelBtnText
                })
            },

        //获取列表数据
            getList(){
               
                this.tableLoading = true
                this.$api['taskSelectionListTaskDetail'](this.listQuery).then(res => {
                    //console.log(res);
                    this.total=res.total;
                    this.tableList=res.rows;
                    this.tableLoading = false;
                    console.log(res);

                }).catch(err=>{
                     this.tableLoading = false;
                })
            },


        
        
    },
    created() {
        this.listQuery.taskId=this.$route.query.taskId;//任务id
        if (this.sellerId && this.siteId) {
           this.listQuery.siteId=this.siteId;
           this.listQuery.sellerId=this.sellerId;
           this.getList();
        };

        //为搜索表单搞上输入验证
        for (const key in this.listQuery) {
            if (this.listQuery.hasOwnProperty(key)) {
                    this.rules[key]= [{ validator: this.validatePass, trigger: ['blur','change'] } ] ;
                    if(key!=='brandOwnerAddr'){
                        this.validateIndex.push(key);
                    };

            }
        };
        //console.log(this.validateIndex);
    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.listQuery.siteId=this.siteId;
                this.listQuery.sellerId=this.sellerId;
                this.getList();
            };
        }
    },
   
};
</script>

<style scoped lang="less">
  .custom-collapse {
    .el-collapse-item__header,
    .collapse-item-title {
      display: flex;
      justify-content: space-between;
    }
    .collapse-item-title {
      flex: 1;
      .el-button--text {
        margin-right: 10px;
      }
    }
    /deep/.el-collapse-item__arrow {
        float: left !important;
    }
    .el-form-item{
        margin-bottom: 10px;
    }
  }
   .btns {
        padding: 10px;
        border-left:1px solid #e5e5e5;
        border-right:1px solid #e5e5e5;
  }
  .table{
    /deep/.el-icon-search{
      font-size:16px;
    }
  }
 

</style>
