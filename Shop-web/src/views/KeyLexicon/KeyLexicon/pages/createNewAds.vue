<template>
    <div>
        <!-- 创建广告活动 -->
        <div class='item' v-if="showSeries">
            <div class="tit">
                创建广告活动
            </div>
            <div class="cont">
                <div class='form'>
                    <el-form :label-position="'top'" label-width="80px" :model="adCampaign" ref='adCampaign' :rules='adCampaignRules'>
                        <el-form-item label="广告系列名称" prop='name'>
                            <el-input v-model.trim="adCampaign.name" size="small" style='width:500px' clearable></el-input>
                        </el-form-item>
                        <el-form-item label="开始时间" prop='startDate' >
                            <el-date-picker
                                v-model="adCampaign.startDate"
                                type="date"
                                size="small" 
                                :picker-options="pickerOptions"
                                value-format='yyyy-MM-dd'
                                style='width:500px'
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间" prop='endDate'>
                            <el-date-picker
                                size="small" 
                                style='width:500px'  
                                value-format='yyyy-MM-dd' 
                                v-model="adCampaign.endDate"
                                :picker-options="pickerOptions"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="投放类型" prop='targetingType'>
                            <el-select v-model="adCampaign.targetingType" placeholder="请选择" size="small" style='width:500px' clearable >
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='每日预算'  prop='dailyBudget'>
                            <el-input placeholder="请输入值" v-model.trim="adCampaign.dailyBudget"  clearable size="small" style='width:500px'>
                                <template slot="prepend">$</template>
                            </el-input>
                            <el-button type="primary" plain size='small' style='margin-left:10px;' @click='addAdStrategy'>{{btnText}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if='addAdStrategyShow' class='formChild'>
                    <el-form  label-width="60px" :model="adCampaignStrategy" :label-position="'right'"  ref='adCampaignStrategy'>
                        <el-form-item label="方式"  :rules="[{ required: true, message: '请选择', trigger: 'change' }]" prop='seoType'>
                            <el-select v-model="adCampaignStrategy.seoType" placeholder="请选择" size="small" style='width:440px' clearable >
                                <el-option
                                    v-for="item in weekOrDayOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" v-if='adCampaignStrategy.seoType===1'>
                            <el-radio-group v-model="adCampaignStrategy.weekDay">
                                <el-radio-button :label="item.value" v-for="item in weekDayOptions" :key='item.value'>{{item.label}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <div style='margin-top:10px;'>
                            <div v-for='(item,index) in adCampaignStrategy.strategyDetail' :key='item.id'>
                                <el-row>
                                    <el-form-item label='时间段' :prop="'strategyDetail.' + index + '.hourStart'" :rules='dayFormRules(index)' style='width:260px;display: inline-block;'>
                                        <el-time-select
                                            :disabled="item.disabled"
                                            size='small'
                                            
                                            v-model="item.hourStart"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '1:00',
                                                end: '23:00'
                                            }"
                                            placeholder="选择时间">
                                        </el-time-select>    
                                    </el-form-item>
                                    <el-form-item label='~' :prop="'strategyDetail.' + index + '.hourEnd'" :rules='dayFormRules(index)' label-width="38px" style='width:260px;display: inline-block;'>
                                        <el-time-select
                                            size='small'
                                           
                                            :disabled="item.disabled"
                                            v-model="item.hourEnd"
                                            :picker-options="{
                                                start: '01:00',
                                                step: '1:00',
                                                end: '24:00'
                                            }"
                                            placeholder="选择时间">
                                        </el-time-select>    
                                    </el-form-item>
                                </el-row>
                                <el-row>
                                    <el-form-item label="价格($)" :prop="'strategyDetail.' + index + '.bid'" :rules='dayFormRules(index)' style='width:500px;display: inline-block;'>
                                        <el-input-number v-model.trim="item.bid" placeholder="请输入" size='small' :disabled="item.disabled" :controls="false" :precision="2" style="width: 100%;"></el-input-number>
                                    </el-form-item>

                                    <ElButton 
                                        style='margin-top:6px;margin-left:6px;'
                                        size="small" type="plain" icon="el-icon-plus" plain
                                        @click='adCampaignStrategy.strategyDetail.push({hourStart:null,hourEnd:null,bid:null})'
                                    ></ElButton>
                                    <ElButton  
                                        style='margin-top:6px;margin-left:6px;'
                                        size="small" type="danger" icon="el-icon-delete" plain     
                                        v-if='adCampaignStrategy.strategyDetail.length!==1  '                         
                                        @click='adCampaignStrategy.strategyDetail.splice(index,1)'
                                    ></ElButton>
                                </el-row>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 广告活动竞争策略 -->
        <div class='item' style='margin-top:20px;'  v-if="showSeries">
            <div class="tit">
                广告活动竞争策略
            </div>
            <div class="cont">
                <!-- <div class='div-item'>
                   <div>
                        <input type="radio" name="strategyType" id="one" value="one" v-model='strategyType'>
                        <label for="one" style='margin-left:6px;'>动态竞价 – 只降低</label>
                   </div>
                   <div>
                       当您的广告不太可能带来销售时，Amazon将实时降低您的竞价。 在 2019 年 01 月之前创建的任何广告活动都会使用此设置。
                   </div>
                </div>
                <div class='div-item'>
                   <div>
                        <input type="radio" name="strategyType" id="two" value="two"  v-model='strategyType'>
                        <label for="two" style='margin-left:6px;'>动态竞价 – 提高和降低</label>
                   </div>
                   <div>
                       当您的广告很有可能带来销售时，Amazon将实时提高您的竞价（最高可达 100%），并在您的广告不太可能带来销售时降低您的竞价。
                   </div>
                </div>
                <div class='div-item'>
                   <div>
                        <input type="radio" name="strategyType" id="three" value="three"  v-model='strategyType'>
                        <label for="three" style='margin-left:6px;'>固定竞价</label>
                   </div>
                   <div>
                       Amazon将使用您的确切竞价和您设置的任何手动调整，而不会根据售出可能性对您的竞价进行更改。
                   </div>
                </div>
                 <div class='div-item'>
                   <div>
                        <el-button type='text'  :icon="btnIcon" style='font-size:22px;' @click="lookMore"></el-button>
                        根据广告位调整竞价
                   </div>
                   <div v-show='moreShow'>
                        <p>除了竞价策略外，您可以将竞价提高多达 900%。</p> 
                        <img src="./626.png" alt="">
                   </div>
                </div> -->
                <div class='div-item' style='padding-bottom:20px;'>
                    <div style='display:inline-block;'>
                        是否开启竞价:
                    </div>
                    <div style='display:inline-block;margin-left:30px;'>
                        <input type="radio" name="premiumBidAdjustment" id="three" value="true"  v-model='premiumBidAdjustment'>
                        <label for="three" style='margin-left:6px;'>是</label>
                   </div>
                    <div style='display:inline-block;'>
                        <input type="radio" name="premiumBidAdjustment" id="threes" value="false"  v-model='premiumBidAdjustment'>
                        <label for="threes" style='margin-left:6px;'>否</label>
                   </div>
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 创建广告组 -->
        <div class='item' style='margin-top:20px;'>
            <div class="tit">
                创建广告组
            </div>
            <div class="cont">
                <div class='label'><span style='color:red;'>*</span>广告组名称</div>
                <div class='inp' :class='{"adGroup":adGroupClass}'>
                    <el-input v-model.trim="adGroup.name" placeholder="请输入" type='input'  size='small' style='width:500px;border-color: #f56c6c;' @blur='adGroupNameBlur'></el-input>
                </div>
                <div style='height:30px;' class='hint'>
                    {{createADGroupsInpHint}}
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 商品 -->
        <div class='item' style='margin-top:20px;'>
            <div class="tit cont">
                商品 <span v-if='CommodityHint' class='hint'>请至少添加一项</span>
            </div>
            <div class="cont">
                <Commodity ref='Commodity' :productIds.sync='productIds' />
            </div>
        </div>
        <!-- 竞价 -->
        <div class='item' style='margin-top:20px;'>
            <div class="tit">
                竞价
            </div>
            <div class="cont">
                <div class='label'>
                    <!-- <span style='color:red;'>*</span>默认竞价 -->
                </div>
                <div class="form">
                    <el-form  label-width="80px" :model="adGroup" :inline="true" :rules='adGroupRules' ref='adGroup'>
                        <el-form-item label="默认竞价" prop='defaultBid' style='display:block;'>
                            <el-input v-model.trim="adGroup.defaultBid" size="small" style='width:160px' clearable></el-input>
                        </el-form-item>
                        <el-form-item label="计算公式" prop='propertyType'>
                            <el-select v-model="adGroup.propertyType" placeholder="请选择" size="small" style='width:160px' clearable >
                                <el-option
                                    v-for="item in BiddingTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=""   prop='operator'> 
                            <el-select v-model="adGroup.operator " placeholder="请选择" size="small" style='width:160px' clearable >
                                <el-option
                                    v-for="item in BiddingCalculateOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=""  prop='value'>
                            <el-input v-model.trim="adGroup.value" size="small" style='width:160px' clearable></el-input>
                            <el-button type="primary" plain size='small' style='margin-left:10px;' @click='addBiddingbtn'>{{BiddingbtnText}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if='formBiddingShow' class='formChild'>
                    <el-form  label-width="60px" :model="adGroupStrategy" :label-position="'right'" ref='adGroupStrategy'>
                        <el-form-item label="方式" :rules="[{ required: true, message: '请选择', trigger: 'change' }]" prop='seoType'>
                            <el-select v-model="adGroupStrategy.seoType" placeholder="请选择" size="small" style='width:440px' clearable >
                                <el-option
                                    v-for="item in weekOrDayOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" v-if='adGroupStrategy.seoType===1'>
                            <el-radio-group v-model="adGroupStrategy.weekDay">
                                <el-radio-button :label="item.value" v-for="item in weekDayOptions" :key='item.value'>{{item.label}}</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <div style='margin-top:10px;'>
                            <div v-for='(item,index) in adGroupStrategy.strategyDetail' :key='item.id'>
                                <el-row>
                                    <el-form-item label='时间段' :prop="'strategyDetail.' + index + '.hourStart'" :rules='grounpdayFormRules(index)' style='width:260px;display: inline-block;'>
                                        <el-time-select
                                            :disabled="item.disabled"
                                            size='small'
                                            
                                            v-model="item.hourStart"
                                            :picker-options="{
                                                start: '00:00',
                                                step: '1:00',
                                                end: '23:00'
                                            }"
                                            placeholder="选择时间">
                                        </el-time-select>    
                                    </el-form-item>
                                    <el-form-item label='~' :prop="'strategyDetail.' + index + '.hourEnd'" :rules='grounpdayFormRules(index)' label-width="38px" style='width:260px;display: inline-block;'>
                                        <el-time-select
                                            size='small'
                                           
                                            :disabled="item.disabled"
                                            v-model="item.hourEnd"
                                            :picker-options="{
                                                start: '01:00',
                                                step: '1:00',
                                                end: '24:00'
                                            }"
                                            placeholder="选择时间">
                                        </el-time-select>    
                                    </el-form-item>
                                </el-row>
                                <el-row>
                                    <el-form-item label="价格($)" :prop="'strategyDetail.' + index + '.bid'" :rules='grounpdayFormRules(index)' style='width:500px;display: inline-block;'>
                                        <el-input  v-model.trim="item.bid" placeholder="请输入"  size='small' :disabled="item.disabled"></el-input>
                                    </el-form-item>

                                    <ElButton 
                                        style='margin-top:6px;margin-left:6px;'
                                        size="small" type="plain" icon="el-icon-plus" plain
                                        @click='adGroupStrategy.strategyDetail.push({hourStart:null,hourEnd:null,bid:null})'
                                    ></ElButton>
                                    <ElButton  
                                        style='margin-top:6px;margin-left:6px;'
                                        size="small" type="danger" icon="el-icon-delete" plain     
                                        v-if='adGroupStrategy.strategyDetail.length!==1  '                         
                                        @click='adGroupStrategy.strategyDetail.splice(index,1)'
                                    ></ElButton>
                                </el-row>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 投放 -->
        <div class='item' style='margin-top:20px;'>
            <div class="tit">
                投放
            </div>
            <div class="cont">
                <p>你可以向广告活动添加多个广告组 ，但只能为每个广告组选择一种投放类型。</p>
                <div>
                    <div>
                        <el-radio v-model="putOnType" label="1">关键词投放</el-radio>
                        <p style='margin-left:20px;'>选择有助于您的商品针对买家搜索展示的关键词。</p>
                        <div class='put-in-hint'>
                            <div style='width:324px;'>如果你知道买家在搜索与您商品类似的商品时所用的</div>
                            <div style='margin-top:10px;'>搜索词,请使用此策略。</div>
                        </div>
                    </div>
                    <div style='margin-top:40px;padding-bottom:20px;'>
                        <el-radio v-model="putOnType" label="2">商品投放</el-radio>
                        <p style='margin-left:20px;'>选择特定商品,分类,品牌或其他商品功能来定位你的广告。</p>
                        <div class='put-in-hint'>
                            <div style='width:324px;'>使用此策略可帮助买家在亚马逊上浏览商品详情和</div>
                            <div style='margin-top:10px;'>分类或搜索时发现您的商品。</div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        <!-- 完 -->
        <!-- 关键词和否定词 -->
        <AddExistingAds  :advertisingSeriesShow='false' ref='AddExistingAds' v-if='putOnType == 1' :keywordHint='keywordHint' :productIds='productIds' />
        <!-- 完 -->
        <!-- 商品投放 -->
        <div class='item' style='margin-top:20px;' v-if='putOnType == 2' >
            <div class="tit">
                商品投放
            </div>
            <div class="cont">
                <GoodsOn ref='GoodsOn' :GoodsOnHint='GoodsOnHint' />
            </div>
         </div>
         <div class='item' style='margin-top:20px;' v-if='putOnType == 2' >
            <div class="tit">
                可选:否定商品投放
            </div>
            <div class="cont">
                <NegativeCommodityp ref='NegativeCommodityp' />
            </div>
         </div>
        <!-- 完 -->
        <div style='text-align:center;margin:50px 0;'>
            <el-button size="small" type="primary" style='margin-right:30px;' @click='submitBtn' :loading='submitLoading'>确定投放广告</el-button>
            <el-button size="small" type="primary" plain  style='margin-left:30px;' @click='$router.go(-1)' :disabled="submitLoading">取消投放广告</el-button>
        </div>
    </div>
</template>

<script>
import AddExistingAds from '../components/AddExistingAds'
import Commodity from '../components/commodity'
import GoodsOn from '../components/GoodsOn'
import NegativeCommodityp from '../components/NegativeCommodityp'
import dayjs from 'dayjs'
export default {
    components:{
        AddExistingAds,
        Commodity,
        GoodsOn,
        NegativeCommodityp
    },
    data() {
        let dailyBudgetValidatePass = (rule, value, callback) => {
            //console.log(rule);
            if (!value && rule.field !== 'value') {
                return callback(new Error('请输入'));
            };
            if( value && isNaN(Number(value))){
                 return callback(new Error('请输入数字'));
            };
            if( value && rule.field === 'dailyBudget' ) {
                this.adCampaign.dailyBudget = +this.adCampaign.dailyBudget
            }else if( value && rule.field === 'value' ) {
                this.adGroup.value = +value ;
            }else if( value && rule.field === 'defaultBid' ){
                 this.adGroup.defaultBid = +value ;
            }
           
            callback()
        };
        return {
           
            submitLoading:false,
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now() - 15 * 3600 * 1000
                },
            },
            putOnType:'1',//投放的类型
			//标识字段  广告组点进来要隐藏系列
			showSeries:true,
			
            //广告活动的表单
            adCampaign:{
                name:"",
                nastartDateme:"",
                endDate:null,
                targetingType:"",
                dailyBudget:null,
                startDate: dayjs().format('YYYY-MM-DD'),
            },
            adCampaignRules:{
                name:[
                    { required: true, message: '请输入广告系列名称', trigger: 'blur' }
                ],
                startDate:[
                    { required: true, message: '请选择开始时间', trigger: ['blur','change'] }
                ],
                // endDate:[
                //     { required: true, message: '请选择结束时间', trigger: ['blur','change'] }
                // ],
                targetingType:[
                    { required: true, message: '请选择投放类型', trigger: 'change' }
                ],
                dailyBudget:[
                    { required: true, validator: dailyBudgetValidatePass, trigger: 'blur' }
                ],
            },
            typeOptions:[
                {label:"手动",value:'manual'},
                {label:"自动",value:'auto'},
            ],
            btnText:"添加预算优化策略",
            addAdStrategyShow:false,
            weekOrDayOptions:[
                {label:"每日",value:0},
                {label:"周一到周日",value:1},
            ],
            //广告系列策略
            adCampaignStrategy:{
                strategyDetail:[
                    { hourStart:null,hourEnd:null,bid:null },
                ],
                weekDay:0
            },
            weekDayOptions:[
                {label:"周日" ,value:0},
                {label:"周一" ,value:1},
                {label:"周二" ,value:2},
                {label:"周三" ,value:3},
                {label:"周四" ,value:4},
                {label:"周五" ,value:5},
                {label:"周六" ,value:6},
            ],
            dayFormRules(index){
                let checkAge = (rule, value, callback) => {
                        // console.log(rule);
                        // console.log(value)
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1]; //label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项

                        //单选验证
                        if(!value && name==='seoType'){
                            return callback(new Error('请选择') );
                            //console.log('radio');
                        };

                        //价格验证
                        if( (!value && name==='bid') ||  (isNaN(Number(value)) && name==='bid')){
                             return callback(new Error('请输入数字') );
                        };
                        if(name==='bid'){
                            this.adCampaignStrategy.strategyDetail.forEach((i,inde)=>{
                                if( (value === i.bid) &&  inde!==index ){
                                    return callback(new Error(`第${inde+1}项已填`));
                                }
                            });
                             this.adCampaignStrategy.strategyDetail[index].bid = +value
                        };
                     
                        //时间段的验证
                        if( !value && ( name==='hourStart' || name==='hourEnd')){
                            if( name==='hourStart' && this.adCampaignStrategy.strategyDetail[index].hourEnd){
                                 return callback(new Error('小值需小于大值'));
                            }else if(name==='hourEnd' && this.adCampaignStrategy.strategyDetail[index].hourStart){
                                 return callback(new Error('大值需大于小值'));
                            };
                            return callback(new Error('请正确选择'));
                        };
                        if( name==='hourStart' || name==='hourEnd'){ //当前输入的是时间段
                            if( index!==0 && (!this.adCampaignStrategy.strategyDetail[index-1].hourEnd || !this.adCampaignStrategy.strategyDetail[index-1].hourStart) ){
                                  return callback(new Error('请先完整填写上区间'));
                            };  
                            this.adCampaignStrategy.strategyDetail.forEach((i,inde)=>{
                                if( name==='hourStart' &&  inde!==index && index!==0 && this.adCampaignStrategy.strategyDetail[index-1].hourEnd ){
                                    let start=value.slice(0,2)*1;
                                    let topEnd=this.adCampaignStrategy.strategyDetail[index-1].hourEnd.slice(0,2)*1;
                                    // console.log(start);
                                    // console.log(topEnd);
                                    if( start < topEnd){
                                        return callback(new Error('需大于或等于上区间的大值'));
                                    }
                                  
                                }else if( name==='hourEnd' && this.adCampaignStrategy.strategyDetail[index+1] &&  this.adCampaignStrategy.strategyDetail[index+1].hourStart  &&  inde!==index  ){
                                    let end=value.slice(0,2)*1;
                                    let nextStart=this.adCampaignStrategy.strategyDetail[index+1].hourStart.slice(0,2)*1;
                                    // console.log(end);
                                    // console.log(nextStart);
                                    if( end > nextStart){
                                        return callback(new Error('需大于或等于下区间的小值'));
                                    }
                                }
                            });
                           
                        };  
                        if( name==='hourStart' && this.adCampaignStrategy.strategyDetail[index].hourEnd ){
                            let start=value.slice(0,2)*1;
                            let end=this.adCampaignStrategy.strategyDetail[index].hourEnd.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            //console.log( this.adCampaign.children[index].hourStart )
                            // if( this.adCampaign.children[index].hourStart===' ' ){
                            //     return callback(new Error('小值需小于大值'));
                            // }
                            if(start>=end){
                                this.adCampaignStrategy.strategyDetail[index].hourStart=null;
                                return callback(new Error('小值需小于大值'));
                            }
                        }else if(name==='hourEnd' && this.adCampaignStrategy.strategyDetail[index].hourStart) {
                            let end=value.slice(0,2)*1;
                            let start=this.adCampaignStrategy.strategyDetail[index].hourStart.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            // if( this.adCampaign.children[index].hourEnd===' ' ){
                            //     return callback(new Error('大值需大于小值'));
                            // }
                            if(start>=end){
                                this.adCampaignStrategy.strategyDetail[index].hourEnd=null;
                                return callback(new Error('大值需大于小值'));   
                            }
                        };
                       
                        callback();
                        
                    };
                    return  { validator: checkAge, trigger: ['change'] }
            },
            //广告活动竞争策略
            premiumBidAdjustment:false,
            btnIcon:"el-icon-arrow-right",
            moreShow:false,
            
            //创建广告组
            adGroup:{
                defaultBid:null,//默认竞价
                name:"",
                propertyType:"",
                operator:"",
                value:null,
            },
            adGroupRules:{
                // propertyType:[
                //     {  message: '请选择', trigger: 'change' }
                // ],
                // operator:[
                //     {  message: '请选择', trigger: ['blur','change'] }
                // ],
                // value:[
                //    {  validator: dailyBudgetValidatePass, trigger: 'blur' }
                // ],
                defaultBid:[
                   { required: true, validator: dailyBudgetValidatePass, trigger: 'blur' }
                ],
            },
            adGroupClass:false,
            createADGroupsInp:"",
            createADGroupsInpHint:"",//创建广告组的提示
            //竞价
            adGroupStrategy:{
                seoType:"",
                strategyDetail:[
                    { hourStart:null,hourEnd:null,bid:null },
                ],
                 weekDay:0,
            },
            BiddingTypeOptions:[
                {label:"推荐最高价",value:0},
                {label:"推荐最低价",value:1},
                {label:"建议竞价",value:2},
                // {label:"自定义价格",value:2}
            ],
            BiddingCalculateOptions:[
                {label:"加",value:0},
                {label:"减",value:1},
                {label:"乘",value:2},
                {label:"除",value:3},
            ],
            BiddingbtnText:"添加cpc优化策略",
            formBiddingShow:false,
            grounpdayFormRules(index){
                let checkAge = (rule, value, callback) => {
                        // console.log(rule);
                        // console.log(value)
                        let fild=rule.field.split('.');
                        let name=fild[fild.length-1]; //label名字
                        let location=fild[fild.length-2]*1+1;//当前输入的是第几项

                        //单选验证
                        if(!value && name==='seoType'){
                            return callback(new Error('请选择') );
                            //console.log('radio');
                        };

                        //价格验证
                        if( (!value && name==='bid') ||  (isNaN(Number(value)) && name==='bid')){
                             return callback(new Error('请输入数字') );
                        };
                        if(name==='bid'){
                            this.adGroupStrategy.strategyDetail.forEach((i,inde)=>{
                                if( (value === i.bid) &&  inde!==index ){
                                    return callback(new Error(`第${inde+1}项已填`));
                                }
                            });
                             this.adGroupStrategy.strategyDetail[index].bid = +value
                        };
                     
                        //时间段的验证
                        if( !value && ( name==='hourStart' || name==='hourEnd')){
                            if( name==='hourStart' && this.adGroupStrategy.strategyDetail[index].hourEnd){
                                 return callback(new Error('小值需小于大值'));
                            }else if(name==='hourEnd' && this.adGroupStrategy.strategyDetail[index].hourStart){
                                 return callback(new Error('大值需大于小值'));
                            };
                            return callback(new Error('请正确选择'));
                        };
                        if( name==='hourStart' || name==='hourEnd'){ //当前输入的是时间段
                            if( index!==0 && (!this.adGroupStrategy.strategyDetail[index-1].hourEnd || !this.adGroupStrategy.strategyDetail[index-1].hourStart) ){
                                  return callback(new Error('请先完整填写上区间'));
                            };  
                            this.adGroupStrategy.strategyDetail.forEach((i,inde)=>{
                                if( name==='hourStart' &&  inde!==index && index!==0 && this.adGroupStrategy.strategyDetail[index-1].hourEnd ){
                                    let start=value.slice(0,2)*1;
                                    let topEnd=this.adGroupStrategy.strategyDetail[index-1].hourEnd.slice(0,2)*1;
                                    // console.log(start);
                                    // console.log(topEnd);
                                    if( start < topEnd){
                                        return callback(new Error('需大于或等于上区间的大值'));
                                    }
                                  
                                }else if( name==='hourEnd' && this.adGroupStrategy.strategyDetail[index+1] &&  this.adGroupStrategy.strategyDetail[index+1].hourStart  &&  inde!==index  ){
                                    let end=value.slice(0,2)*1;
                                    let nextStart=this.adGroupStrategy.strategyDetail[index+1].hourStart.slice(0,2)*1;
                                    // console.log(end);
                                    // console.log(nextStart);
                                    if( end > nextStart){
                                        return callback(new Error('需大于或等于下区间的小值'));
                                    }
                                }
                            });
                           
                        };  
                        if( name==='hourStart' && this.adGroupStrategy.strategyDetail[index].hourEnd ){
                            let start=value.slice(0,2)*1;
                            let end=this.adGroupStrategy.strategyDetail[index].hourEnd.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            //console.log( this.adCampaign.children[index].hourStart )
                            // if( this.adCampaign.children[index].hourStart===' ' ){
                            //     return callback(new Error('小值需小于大值'));
                            // }
                            if(start>=end){
                                this.adGroupStrategy.strategyDetail[index].hourStart=null;
                                return callback(new Error('小值需小于大值'));
                            }
                        }else if(name==='hourEnd' && this.adGroupStrategy.strategyDetail[index].hourStart) {
                            let end=value.slice(0,2)*1;
                            let start=this.adGroupStrategy.strategyDetail[index].hourStart.slice(0,2)*1;
                            // console.log(start);
                            // console.log(end);
                            // if( this.adCampaign.children[index].hourEnd===' ' ){
                            //     return callback(new Error('大值需大于小值'));
                            // }
                            if(start>=end){
                                this.adGroupStrategy.strategyDetail[index].hourEnd=null;
                                return callback(new Error('大值需大于小值'));   
                            }
                        };
                       
                        callback();
                        
                    };
                    return  { validator: checkAge, trigger: ['change'] }
            },

            productIds:[],//添加的商品的id

            CommodityHint: false,//商品信息填写的提示
            keywordHint:false,//关键词信息填写的数据提示
            GoodsOnHint:false,//商品投放的数据的提示
            

          

        };
    },
    methods: {
        //添加或取消预算优化策略
        addAdStrategy(){
            this.addAdStrategyShow = !this.addAdStrategyShow;
            if(this.btnText === '添加预算优化策略'){
                this.btnText = '取消预算优化策略'
            }else{
                this.btnText = '添加预算优化策略'
            }   
        },
        //广告活动竞争策略点击根据广告位调整竞价按钮
        lookMore(){
            if( this.btnIcon === 'el-icon-arrow-right'){
                this.btnIcon = 'el-icon-arrow-down';
                this.moreShow = true;
            }else{
                this.btnIcon = 'el-icon-arrow-right';
                this.moreShow = false;
            }
        },
        //添加或取消cpc优化策略
        addBiddingbtn(){
            this.formBiddingShow = !this.formBiddingShow;
            if(this.BiddingbtnText === '添加cpc优化策略'){
                this.BiddingbtnText = '取消cpc优化策略'
            }else{
                this.BiddingbtnText = '添加cpc优化策略'
            }   
        },
        //广告组名称输入框失去焦点
        adGroupNameBlur(){
            //console.log(1);
            if( !this.adGroup.name ) {
                this.adGroupClass = true ;
                this.createADGroupsInpHint = '请输入广告组名称'
            }else{
                this.adGroupClass = false ;
                this.createADGroupsInpHint = ''
            }
        },
        //确定投放广告
        submitBtn(){

            this.submitLoading = true
            let arr = []
			
			//如果是广告组点进来的页面就不需要验证广告系列了;
			if(this.showSeries){
				//广告系列
				arr.push(this.$refs.adCampaign.validate())
				//广告系列策略
				if( this.addAdStrategyShow ) {
				    arr.push(this.$refs.adCampaignStrategy.validate())
				};
			}
                        
                        
            //广告组
            this.$refs.adGroup.validate()
            arr.push(this.$refs.adGroup.validate())
            //竞价策略
            if(this.formBiddingShow){
                this.$refs.adGroupStrategy.validate()
                arr.push(this.$refs.adGroupStrategy.validate())
            };
            //广告组名称
            this.adGroupNameBlur();
            if( this.adGroupClass){
                arr.push(Promise.reject(false))
            }else{
                arr.push(Promise.resolve(true))
            };

          
            if ( this.putOnType === '1') {
                //关键词和否定词
                let keywords = this.$refs.AddExistingAds.submitBtn(true)
                if(Object.prototype.toString.call(keywords) === '[object Object]'){
                    arr.push(Promise.resolve(true))
                    this.keywordHint =  false
                }else{
                    arr.push(Promise.reject(false))
                    this.keywordHint =  true
                }
            } else {
                //商品投放
                let GoodsOn = this.$refs.GoodsOn.saveBtn()
                if ( !GoodsOn) {
                    this.GoodsOnHint = true
                }else {
                    this.GoodsOnHint = false
                    arr.push( GoodsOn )
                }
            }
            
            
            //产品id
            if( !this.$refs.Commodity.oldPushId.length ){
                arr.push(Promise.reject(false))
                 this.CommodityHint = true
            }else{
                arr.push(Promise.resolve(true))
                this.CommodityHint = false
            }

            console.log(arr);

            Promise.all(arr).then( async res => {
               let params = { }
			   
			   //如果是广告组点进来的页面就不需要验证广告系列了;
			   if(this.showSeries){
				   //广告系列
				   params.adCampaign = this.adCampaign
				   params.adCampaign.premiumBidAdjustment = this.premiumBidAdjustment === 'true' ? true :false 
				   //广告系列策略
				   if(this.addAdStrategyShow){
				       let adCampaignStrategy =JSON.parse(JSON.stringify(this.adCampaignStrategy))
				        adCampaignStrategy.strategyDetail.forEach(i=>{
				            i.weekDay = this.adCampaignStrategy.weekDay
				            i.hourStart = i.hourStart.split(':')[0] *1
				            i.hourEnd = i.hourEnd.split(':')[0] *1
				        })
				        params.adCampaignStrategy = adCampaignStrategy
				   }
			   }
               
			   
			   
               //广告组
               params.adGroup = this.adGroup
               //竞价策略
                if(this.formBiddingShow){
                    let  adGroupStrategy = JSON.parse(JSON.stringify(this.adGroupStrategy))
                    adGroupStrategy.strategyDetail.forEach(i=>{
                        i.weekDay = this.adGroupStrategy.weekDay
                        i.hourStart = i.hourStart.split(':')[0] *1
                        i.hourEnd = i.hourEnd.split(':')[0] *1
                    })
                    params.adGroupStrategy = adGroupStrategy
                }

                if ( this.putOnType === '1' ) {
                    //关键词
                    let keywords = this.$refs.AddExistingAds.submitBtn(true)
                    params.keywords = keywords.keywords
                    //否定词
                    params.negativeKeywords = keywords.negativeKeywords
                } else {
                    //商品投放
                    let res = await this.$refs.GoodsOn.saveBtn().then( res => {
                         return res
                    })
                    params.adTarget = res
                    params.negativeTarget = this.$refs.NegativeCommodityp.saveBtn()
                }
               
                //产品id
                params.productIds = this.$refs.Commodity.oldPushId ;

                params.platformId = this.platformId;
                params.siteId = this.siteId;
                params.sellerId = this.sellerId;
				
				//广告组要多传个参数
				if(!this.showSeries) params.campaignId = this.$route.query.objectId;
                
                //console.log(params);

                this.$api[`${this.showSeries ? 'adCampaignSave' : 'adGroupSave'}`](params)
                .then(data => {
                    this.submitLoading = false
                    this.$router.push('/keyLexicon/key')
                }).catch(() => {
                    this.submitLoading = false
                })
             
               
            }).catch(err=>{
                console.log(err);
                this.$message.warning('请正确填写信息')
                this.submitLoading = false
            })
           
        },

    },
    created() {
		if(this.$route.query && this.$route.query.objectId) this.showSeries = false
    },
   
};
</script>

<style scoped lang="less">
.item{
    border:1px solid #dcdcdc;
    .tit{
        font-size: 18px;
        color:#333;
        padding-left: 4px;
        line-height: 40px;
        border-bottom:1px solid #dcdcdc;
    }
    .cont{
        padding-left: 20px;
        .form{
            /deep/.el-form--label-top .el-form-item__label{
                padding:0 
            }
            /deep/.el-form-item__content{
                padding:0 ;
            }
            /deep/.el-form-item__label {
                line-height: 30px;
                font-size: 14px;
            }
        }
        .formChild{
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 204px;
            }
        }
        .div-item{
            margin-top: 20px;
            &>div:last-child{
                margin-left:16px;
                margin-top:10px;
            }
            /deep/.el-button--text.el-button i {
                font-size: 24px;
            }
        }
        .label{
              margin: 14px 4px;
        }
        .inp{
            margin: 10px 4px;
        }
        .hint{
            margin: 0 4px;
            color: #f56c6c;
            font-size: 12px;
        }
    }
}
.el-form-item {
    margin-bottom: 18px;
}
.adGroup{
    /deep/.el-input__inner{
        border-color: #f56c6c;
    }
}
.put-in-hint{
    float:right;
    margin-top: -40px;
    margin-right: 80px;
    border-left:1px solid #999;
    padding-left:10px;   
}
</style>
