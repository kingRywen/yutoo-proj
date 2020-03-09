<!--  -->
<template>
	<div v-if="$route.name === 'ProductCheck'" class="___common">
		<template>
			<el-search :search="search" :clearSearch.sync="clearSearch" :clearfield='clearfield'></el-search>
		</template>
		<template>
			<el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
		</template>
		<template>
			<!-- <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination> -->
			<el-table ref="Table" @selection-change="handleSelectionChange" :data="table.rows" style="width: 100%" border
			 @select='selectc' :row-style="showRow" reserve-selection='true' row-key="verifyId">
				<el-table-column type="selection" width="55" ></el-table-column>
				<!-- asin关键词检验的 -->
				<el-table-column prop="asin" label="ASIN" width="260" show-overflow-tooltip >
					<template slot-scope="scope">
						<!-- :style="{width:12*scope.row.floor.length+'px'}" -->
						<el-button v-if="scope.row.isChild" icon="__common__space" type="text" style="width:30px"></el-button>
						<el-button type="text" v-if="scope.row.productKeywordVerifyVOList&&!scope.row.childShow" icon="el-icon-caret-right __pointer"
						@click="list_listShowChildCate(scope)"></el-button>
						<el-button type="text" v-if="scope.row.productKeywordVerifyVOList&&scope.row.childShow" icon="el-icon-caret-bottom __pointer"
						@click="list_listHiddenChildCate(scope)"></el-button>
						<!-- <span v-if="scope.row.highlight" v-html='scope.row.asin'></span> -->
						<el-tooltip class="item" effect="light" content="已优先" placement="top-start" :enterable="false">
							<i v-if="scope.row.isChild&&scope.row.priorityType" class="el-icon-upload2" style="width:20px;font-size:18px;color:#D81E06;position:absolute;left:18px;top:14px"></i>
						</el-tooltip>
						<a :href="scope.row.productUrl" target="_blank" style="color:rgb(16, 142, 233)">{{scope.row.asin}}</a>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="imageUrl" label="主图" width="80px">
					<template slot-scope="scope">
						<el-popover placement="right" title="" trigger="hover">
							<img v-lazy="scope.row.imageUrl" class="big__ loadingImg" />
							<a class="__img_wrapper" slot="reference" :href="scope.row.productUrl" target="_blank">
								<img class="loadingImg" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
							</a>
						</el-popover>
					</template>
				</el-table-column> -->
				<el-table-column prop="imageUrl" width="80" label="主图">
					<template slot-scope="scope">
						<el-popover placement="right" trigger="hover">
							<div
							  class="__img_wrapper mar-auto"
							  :style="{width:'200' + 'px', height:'200' + 'px'}"
							>
						 	    <img v-lazy="scope.row.imageUrl" class="loadingImg" style="object-fit: contain;overflow: hidden;">
							</div>
							<a class="__img_wrapper" slot="reference" :href="scope.row.productUrl" target="_blank">
								<img class="loadingImg"  :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
							</a>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="sku" label="SKU" width="200">
					<template slot-scope="scope">{{scope.row.sku?scope.row.sku:'-'}}</template>
				</el-table-column>
				<el-table-column prop="verifyStatus" label="标题卖点校验状态">
					<template slot-scope="scope">
						<span v-if="scope.row.verifyStatus===0">未执行</span>
						<span v-if="scope.row.verifyStatus===1">执行中</span>
						<span v-if="scope.row.verifyStatus===2">执行失败</span>
						<span v-if="scope.row.verifyStatus>2">执行成功</span>
						<span v-if="scope.row.verifyStatus===null">-</span>
					</template>
				</el-table-column>
				<el-table-column prop="backStatus" label="后台关键词校验">
					<template slot-scope="scope">
						<span v-if="scope.row.backStatus===0">未执行</span>
						<span v-if="scope.row.backStatus===1">执行中</span>
						<span v-if="scope.row.backStatus===2">执行失败</span>
						<span v-if="scope.row.backStatus===3">执行成功</span>
						<!-- <span v-if="scope.row.backStatus===5">执行失败</span> -->
						<span v-if="scope.row.backStatus===null">-</span>
					</template>
				</el-table-column>
				<el-table-column prop="validCnt" label="有效词">
					<template slot-scope="scope">{{scope.row.validCnt!==null?scope.row.validCnt:'-'}}</template>
				</el-table-column>
				<el-table-column prop="invalidCnt" label="无效词">
					<template slot-scope="scope">{{scope.row.invalidCnt!==null?scope.row.invalidCnt:'-'}}</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注">
					<template slot-scope="scope">{{scope.row.remark?scope.row.remark:'-'}}</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column prop="handle" label="操作" width="160">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="light" content="编辑" placement="top-start" :enterable="false">
							<el-button class="__icon" type="text" icon="el-icon-edit-outline" @click="edit__(scope)"></el-button>
						</el-tooltip>
						<!-- <el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false" v-if="scope.row.invalidCnt || scope.row.validCnt">
              <el-button  v-if="scope.row.invalidCnt || scope.row.validCnt" class="__icon" type="text" icon="el-icon-search" @click="check__(scope)"></el-button>
            </el-tooltip> -->
						<el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false">
							<el-button class="__icon" type="text" icon="el-icon-search" @click="check__(scope)"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="light" content="重新校验" placement="top-start" :enterable="false">
							<el-button  v-if="scope.row.invalidCnt" class="__icon" type="text" icon="el-icon-refresh" @click="refresh__(scope)"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="light" content="添加关键词" placement="top-start" :enterable="false">
							<el-button class="__icon" type="text" icon="el-icon-circle-plus-outline" @click="toKeyLexiconKey(scope)"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false">
							<el-button v-if="!scope.row.isChild" class="__icon" type="text" icon="el-icon-delete" @click="delete__(scope)"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="mt10" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="table.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="table.total"></el-pagination>
		</template>
		<!-- 编辑标题卖点 -->
		<el-dialog class="customDialog" :visible.sync="options2.visible" width="700px" @close="closeMethod" :close-on-click-modal='false'>
			<span slot="title">
				<span v-if="options2.title">{{options2.title}}</span>
			</span>
			<div class="__dialog" style="max-height: 550px;overflow: auto;">
				<el-tabs type="card" v-model="activeTab">
					<el-tab-pane label="标题" name="title">
						<section>
							<ElForm size="small">
								<ElFormItem label="源关键词">
									<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.titleOriginKeywordList"
									 style="width:100%" />
								</ElFormItem>
								<ElFormItem label="推荐单词">
									<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.titleKeywords"
									 style="width:100%" />
									<i v-if="resetFlag" :class="iconClass" style="font-size: 20px;position: absolute;bottom: 10px;right: 10px;cursor:pointer;"
									 @click="refreshMethod"></i>
									<div v-if="maskType" style="font-size: 20px;position: absolute;bottom: 10px;right: 10px;cursor:pointer;border-radius: 50%;width: 20px;height: 21px;"></div>
								</ElFormItem>
								<ElFormItem label="标题">
									<el-input type="textarea" placeholder="请输入标题内容，应包含上方推荐的所有推荐单词" v-model="options2.productName" :readonly="false"
									 :autosize="{ minRows: 4, maxRows: 4}" :value="options2.productName" style="width:100%" />
								</ElFormItem>
							</ElForm>
						</section>
						<div style="margin: 20px 0 0 10px;color: green;" v-if="problemList.status1"><i class="el-icon-success" style="color: green;"></i>
							检验合格</div>
						<div style="margin: 20px 0 0 10px;color: red;" v-else><i class="el-icon-error" style="color: red;"></i> 检验不合格</div>
						<div style="margin: 10px 0 0 10px;" v-if="!problemList.status1">
							<!-- <div style="color: red;">问题:　</div> -->
							<div style="padding-left:18px;margin:0">
								<div v-for="item in problemList.msg1" style="margin:5px 5px;word-wrap:break-word;">{{item}}</div>
							</div>

						</div>
					</el-tab-pane>
					<el-tab-pane label="卖点" name="point2">
						<ElForm size="small">
							<ElFormItem label="源关键词">
								<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.bulletOriginKeywordList"
								 style="width:100%" />
							</ElFormItem>
							<ElFormItem label="推荐单词">								
								<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.bulletKeywords"
								 style="width:100%" />
								<i  v-if="resetFlag" :class="iconClass" style="font-size: 20px;position: absolute;bottom: 10px;right: 10px;cursor:pointer;"
								 @click="refreshMethod"></i>
								<div v-if="maskType" style="font-size: 20px;position: absolute;bottom: 10px;right: 10px;cursor:pointer;border-radius: 50%;width: 20px;height: 21px;"></div>
							</ElFormItem>
							<ElFormItem label="卖点">
								<!-- <el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint" :readonly="false"
								 :autosize="{ minRows: 4, maxRows: 4}" :value="options2.bulletPoint" style="width:100%" /> -->
								<el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint1" :readonly="false"
								 :autosize="{ minRows: 2, maxRows: 2}" :value="options2.bulletPoint1" style="width:100%" />
								<el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint2" :readonly="false"
								 :autosize="{ minRows: 2, maxRows: 2}" :value="options2.bulletPoint2" style="width:100%;margin-top: 20px;" />
								<el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint3" :readonly="false"
								 :autosize="{ minRows: 2, maxRows: 2}" :value="options2.bulletPoint3" style="width:100%;margin-top: 20px;" />
								<el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint4" :readonly="false"
								 :autosize="{ minRows: 2, maxRows: 2}" :value="options2.bulletPoint4" style="width:100%;margin-top: 20px;" />
								<el-input type="textarea" placeholder="请输入卖点内容，应包含上方推荐的所有推荐单词" v-model="options2.bulletPoint5" :readonly="false"
								 :autosize="{ minRows: 2, maxRows: 2}" :value="options2.bulletPoint5" style="width:100%;margin-top: 20px;" />
							</ElFormItem>
						</ElForm>

						<div style="margin: 20px 0 0 10px;color: green;" v-if="problemList.status2"><i class="el-icon-success" style="color: green;"></i>
							检验合格</div>
						<div style="margin: 20px 0 0 10px;color: red;" v-else><i class="el-icon-error" style="color: red;"></i> 检验不合格</div>
						<div style="margin: 10px 0 0 10px;" v-if="!problemList.status2">
							<div style="padding-left:18px;margin:0">
								<div v-for="item in problemList.msg2" style="margin:5px 5px;word-wrap:break-word;">{{item}}</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="后台词" v-if="problemList.isChild3" name="back3">
						<ElForm size="small">
							<ElFormItem label="源关键词">
								<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.backOriginKeywordList"
								 style="width:100%" />
							</ElFormItem>
							<ElFormItem label="后台词">
								<el-input type="textarea" placeholder="暂无数据" :readonly="true" :autosize="{ minRows: 4, maxRows: 4}" :value="options2.backKeywords"
								 style="width:100%" />
							</ElFormItem>
							<!-- <ElFormItem label="后台词">
								<el-input type="textarea" placeholder="请输入后台词内容，应包含上方推荐的所有推荐单词" v-model="options2.backName" :readonly="false"
								 :autosize="{ minRows: 4, maxRows: 4}" :value="options2.backName" style="width:100%" />
							</ElFormItem> -->
						</ElForm>

						<!-- <div style="margin: 20px 0 0 10px;color: green;" v-if="problemList.status3"><i class="el-icon-success" style="color: green;"></i>
							检验合格</div>
						<div style="margin: 20px 0 0 10px;color: red;" v-else><i class="el-icon-error" style="color: red;"></i> 检验不合格</div>
						<div style="margin: 10px 0 0 10px;" v-if="!problemList.status3">
							<div style="color: red;">问题:　</div>
							<div style="padding-left:18px;margin:0">
								<div v-for="item in problemList.msg3" style="margin:5px 5px;word-wrap:break-word;">{{item}}</div>
							</div>
						</div> -->
					</el-tab-pane>
				</el-tabs>


			</div>
			<div class="dialog-footer txc" slot="footer" v-if="activeTab === 'title' || activeTab === 'point2'">
				<el-button size="small" type="primary" @click="editSave(0)" :loading="options2.loading_save">保存</el-button>
				<el-button size="small" type="primary" @click="editSave(1)" :loading="options2.loading_submit">保存并校验</el-button>
			</div>
			<div class="dialog-footer txc" slot="footer" v-else>
				<el-button size="small" type="primary" @click="submitCheck">提交校验</el-button>
			</div>
		</el-dialog>
		<!-- 添加 -->
		<el-dialog-yt :options="options" :events="events">
			<div class="__dialog">
				<div class="margin_bottom8">
					<div class="margin_bottom8">
						<span class="title_icon"></span>
						<span class="color_666" style="font-size:14px;">选择ASIN</span>
					</div>
					<template>
						<el-search :search="form.search" :clearSearch.sync="form.clearSearch" :text="false" :class_box="false" :box_query="false"
						 :clearfield='clearfieldItem'></el-search>
					</template>
				</div>

				<template>
					<!-- 父asin -->
					<div class="__checkDialog" style="margin-bottom:10px;margin-top:-6px;">
						<template>
							<el-table-pagination :table="form.table" :pageNumber.sync="form.table.pageNumber" :pageSize.sync="form.table.pageSize"
							 :total="form.table.total" v-loading="form.table.loading" :userSelect.sync="form.userSelect"></el-table-pagination>
						</template>
						<!-- 选择了父asin,展示子asin -->
						<template v-if="form.userSelect__.length>0?true:false">
							<div class="margin_bottom8" style="margin-top:15px;">
								<span class="title_icon"></span>
								<span class="color_666" style="font-size:14px">已选ASIN</span>
							</div>
							<!-- <div style="margin-top:8px;margin-bottom:8px;">
                <span>ASIN : </span>
                <el-input @clear="clearSearchChild" placeholder="ASIN" v-model.trim="form.childSkuSearch.asin" clearable style='max-width:150px;margin-right:10px;' size="mini">
                </el-input>
                <el-button size="mini" type="primary" plain @click="searchChild">确认搜索</el-button>
              </div>-->
						</template>
						<template v-if="form.userSelect__.length>0?true:false">
							<el-table ref="Table2" :data="form.userSelect__" style="width: 100%;max-height:300px;overflow:auto;" border
							 stripe>
								<!-- asin关键词检验的 -->
								<el-table-column prop="imageUrl" label="主图" width="80px">
									<template slot-scope="scope">
										<el-popover placement="right" title="" trigger="hover">
											<img :src="scope.row.imageUrl" class="big__" />
											<a class="__img_wrapper" slot="reference" :href="scope.row.productUrl" target="_blank">
												<img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
											</a>
										</el-popover>
									</template>
								</el-table-column>
								<el-table-column prop="asin" label="ASIN" width="200">
									<template slot-scope="scope">
										<!-- :style="{width:12*scope.row.floor.length+'px'}" -->
										<i v-if="scope.row.isChild" class="__common__space" style="width:60px"></i>
										<i v-if="scope.row.productAsinVOList&&!scope.row.childShow" class="el-icon-caret-right common_font_color __pointer"
										 @click="listShowChildCate(scope)"></i>
										<i v-if="scope.row.productAsinVOList&&scope.row.childShow" class="el-icon-caret-bottom common_font_color __pointer"
										 @click="listHiddenChildCate(scope)"></i>
										{{scope.row.asin}}
									</template>
								</el-table-column>								
								<el-table-column prop="sku" label="sku">
									<template slot-scope="scope">
										{{scope.row.sku?scope.row.sku:"-"}}
									</template>
								</el-table-column>
								<!-- 名称 -->
								<el-table-column prop="productName" label="名称">
									<template slot-scope="scope">
										<div class="fix__row_1" v-if="scope.row.productName === '' || scope.row.productName == null">{{scope.row.productName || "-"}}</div>
										<el-tooltip v-else placement="top" :content="scope.row.productName">
											<div class="fix__row_1">
												<span>{{ scope.row.productName!=""?scope.row.productName:""}}</span>
											</div>
										</el-tooltip>
									</template>
								</el-table-column>
								<!-- 操作 -->
								<el-table-column prop="handle" label="操作" width="120">
									<template slot-scope="scope">
										<el-button type="text" @click="edit__first(scope)" size="mini" v-if="scope.row.isChild&&!scope.row.first">设置优先</el-button>
										<el-button type="text" @click="cancel__first(scope)" size="mini" v-if="scope.row.isChild&&scope.row.first">取消优先</el-button>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</div>
				</template>
			</div>
		</el-dialog-yt>
		
		
		<!-- 关键词生成工具 -->
		<!-- <el-dialog class="customDialog" title="关键词生成工具" :visible.sync="newVisible" width="900px" @close="closeMethod1('newToolList')">
			<div class="__dialog" style="max-height: 570px;overflow: auto;">
				<el-form label-position='top' :model="newToolList" ref='newToolList'  :rules='rules'>
					<div style="width: 100%;display: flex;justify-content: space-between;">
						<div style="width: 20%;">
							<el-form-item label="源关键词" prop="keyword">
								<el-input v-model.trim="newToolList.keyword" type="textarea" :autosize="{ minRows: 26, maxRows: 26}"></el-input>
							</el-form-item>
						</div>
						<div style="width: 30%;">
							<div style="margin-bottom: 20px;">
								<el-form-item prop="minLength" label="字符长度" style="display:inline-block;margin-bottom: 0;">
									<el-input v-model.trim="newToolList.minLength" size="small" style="width: 120px;"></el-input>&nbsp;~&nbsp;
								</el-form-item>
								<el-form-item prop="maxLength" style="display:inline-block;margin-bottom: 0;">
									<el-input v-model.trim="newToolList.maxLength" size="small" style="width: 120px;"></el-input>
								</el-form-item>
							</div>
							<el-form-item prop="barring" label="排除" style="margin-bottom: 0;">
								<el-input v-model.trim="newToolList.barring" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
							</el-form-item>
							<el-form-item prop="include" label="包含排除" style="margin-bottom: 0;">
								<el-input v-model.trim="newToolList.include" type="textarea" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
							</el-form-item>
							<el-form-item prop="exclude" label="不包含排除" style="margin-bottom: 0;">
								<el-input v-model.trim="newToolList.exclude" type="textarea" :autosize="{ minRows: 3, maxRows: 3}"></el-input>
							</el-form-item>
						</div>
						<div style="width: 40%;">
							<el-form-item  prop="getKeyword" label="生成关键词">
								<el-input v-model="newToolList.getKeyword" type="textarea" :autosize="{ minRows: 26, maxRows: 26}"></el-input>
							</el-form-item>
						</div>
					</div>
				</el-form>
			</div>
			<div class="dialog-footer txc" slot="footer">
				<el-button size="small" type="primary" @click="submit1('newToolList')" :loading="newToolLoading">确认生成</el-button>
				<el-button size="small" @click="closeMethod1('newToolList')" >取消</el-button>
			</div>
		</el-dialog> -->
		
		<!-- 关键词生成工具 -->
		<el-dialog  :fullscreen="isFull" :close-on-click-modal='false' class="customDialog" :custom-class="keyClass" :visible.sync="newVisibleNew" width="1300px" @close="closeMethod1New('newToolListNew')" @closed="closedBig">
			<div slot="title" style="font-size:18px;">
			    <span>关键词组装工具</span>
				<i class="iconfont1 iconfangda bigIcon" @click="isFullMethod" ></i>
			</div>
			<div>
				<el-form label-position='top' :model="newToolListNew" ref='newToolListNew'  :rules='rulesNew'>
					<div style="width: 100%;display: flex;justify-content: space-between;" :style="{height: isFull ? '856px' : '600px'}" >
						<div style="width: 32.5%;height: 100%;" >
							<el-form-item prop="keywords">
								<el-input placeholder="输入关键词..." v-model.trim="newToolListNew.keywords" type="textarea" :rows="inputSize.first"></el-input>
							</el-form-item>
						</div>
						<div style="width: 66%;height: 100%;display: flex;flex-direction: column">
							<!-- <div>
								
							</div> -->
							<div style="width: 100%;height:90%;display: flex;justify-content: space-between;">
								<div style="width: 49%;">
									<el-form-item prop="partStr" style="margin-bottom: 25px;">
										<el-input placeholder="片段(仅去除关键词中的过滤词片段)" v-model.trim="newToolListNew.partStr" type="textarea" :rows="inputSize.second"></el-input>
									</el-form-item>
									<el-form-item prop="includeStr" style="margin-bottom: 25px;">
										<el-input placeholder="包含(包含过滤词时,去除整行关键词)" v-model.trim="newToolListNew.includeStr" type="textarea" :rows="inputSize.second"></el-input>
									</el-form-item>
									<el-form-item prop="wholeStr" style="margin-bottom: 0;">
										<el-input placeholder="完整(完全一样时,去除整行关键词)" v-model.trim="newToolListNew.wholeStr" type="textarea" :rows="inputSize.second"></el-input>
									</el-form-item>
								</div>
								<div style="width: 49%;">
									<el-form-item prop="promptText" style="margin-bottom: 25px;">
										<el-input ref="inputRef" placeholder="指定词,行号　　关键词(多个以,分隔),如:
		1　　black,long
		2　　white,short" v-model.trim="newToolListNew.promptText"  @keydown.tab.native="keyupMethod" type="textarea" :rows="inputSize.three1"></el-input>
									</el-form-item>
									<el-form-item >
										<el-input placeholder="结果词" :readonly="true" v-model="getKeywordNew" type="textarea" :rows="inputSize.three2"></el-input>
									</el-form-item>
								</div>
							</div>
							<div style="width: 100%;height: 10%;">
								<el-form-item  style='display:inline-block;' >
									<el-checkbox v-model="newToolListNew.self">自包含</el-checkbox>
								</el-form-item>
								<el-form-item  style='display:inline-block;margin-left: 10px;' >
									<el-checkbox v-model="newToolListNew.similarity">相似度</el-checkbox>
								</el-form-item>
								<el-form-item prop="sortType"  style='display:inline-block;margin-left: 10px;' >
									<el-select v-model="newToolListNew.sortType" size="mini" style="width: 130px;">
										<el-option label="排序:单词数量" key=0 value=0 ></el-option>
										<el-option label="排序:自然语言" key=1 value=1  ></el-option>
										<el-option label="排序:输入顺序" key=2 value=2  ></el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop="lineCount"  style='display:inline-block;margin-left: 10px;' >
									<el-input  style="width: 100px;" size="mini" placeholder="行数" v-model.trim="newToolListNew.lineCount"></el-input>
								</el-form-item>
								<el-button :loading="newToolLoading1" type="primary" size="mini" plain  style='margin-left: 10px;' @click='submitNew(0)'>开始组装</el-button>
								<el-button :loading="newToolLoading2" type="primary" size="mini" plain  style='margin-left: 10px;' @click='submitNew(1)'>仅过滤</el-button>
								<el-button type="primary" size="mini" plain  style='margin-left: 10px;' @click="copyMethod">复制结果</el-button>
								<el-button type="primary" size="mini" plain  style='margin-left: 10px;' @click="exportTxtMethod">导出结果</el-button>
								<el-button type="primary" size="mini" plain  style='float: right;margin-top: 8px;'  @click="closeMethod1New1('newToolListNew')">清除</el-button>
							</div>
						</div>
						
					</div>
				</el-form>
			</div>
			<!-- <div class="dialog-footer txc" slot="footer">
				<el-button size="small" type="primary" @click="submit1('newToolListNew')" :loading="newToolLoadingNew">确认生成</el-button>
				<el-button size="small" @click="closeMethod1('newToolListNew')" >取消</el-button>
			</div> -->
		</el-dialog>
		
		
	</div>
	<router-view v-else></router-view>
</template>

<script>
	import storage from "Utils/saver";
	import {saveAs} from 'Utils/exportTxt'
	export default {
		components: {},
		provide() {
			return {
				getList: this.getList,
				addTask: this.addTask,
				resetFields_add: this.resetFields_add,
				verify: this.verify,
				verify2: this.verify2,
				priority: this.priority,
				showToolDialog: this.openMethod,
				showToolDialogNew:this.openMethodNew
			};
		},
		data() {
			var checkLength = (rule, value, callback)=>{
			  let numReg = /^[1-9]\d*$/
			  if (!value) {
			    return callback(new Error('请输入字符长度'))
			  } else {
			    if (!numReg.test(value)) {
			      return callback(new Error('请输入正整数'))
			    }
			    callback()
			  }
			}
			var checkLengthNew = (rule, value, callback)=>{
			  let numReg = /^[1-9]\d*$/
			  if(!value) return callback()
			  if (!numReg.test(value)) {
			    return callback(new Error('请输入正整数'))
			  }
			  callback()
			}
			return {
				newToolListNew:{
					keywords:null,
					partStr:null,
					includeStr:null,
					wholeStr:null,
					promptText:'',
					self:false,
					similarity:false,
					sortType:null,
					lineCount:null,
				},
				newToolLoading1:false,
				newToolLoading2:false,
				getKeywordNew:null,
				rulesNew:{
					keywords: [
						{ required: true, message: '请输入关键词', trigger: 'blur' }
					],
					sortType: [
						{ required: true, message: '请选择排序规则', trigger: 'change' }
					],
					lineCount: [
						{ validator: checkLengthNew, trigger: 'blur' },
					],
				},
				rules:{
					keyword: [
						{ required: true, message: '请输入源关键词', trigger: 'blur' }
					],
					minLength: [
						{ validator: checkLength, trigger: 'blur' },
						{ required: true, message: '请输入字符长度', trigger: 'blur' }
					],
					maxLength: [
						{ validator: checkLength, trigger: 'blur' },
						{ required: true, message: '请输入字符长度', trigger: 'blur' }
					],
				},
				
				
				newToolLoading:false,
				maskType: 0,
				iconClass: 'el-icon-refresh',
				clearfield: ['asin', 'titleStatus', 'BackStatus'],
				// 搜索
				search: {
					asin: true,
					TitleOptions: true,
					BackstageOptions: true
				},
				searchName0: "",
				clearSearch: null,
				// 控件
				hander: {
					addTask: true,
					verify: true,
					verify2: true,
					priority: true,
					cancel_priority: true,
					// showTool:true,
					showToolNew:true,
					addButton: "添加"
					// deleteAuthCate: true
				},
				// 添加任务，编辑任务
				formLabelWidth: "70px", //label宽度
				options: {
					loading: false,
					visible: false,
					width: "800px",
					title: "添加",
					URL: "ProductKeywordVerifySave", // 添加还是编辑，默认添加
					okBtnText: "确认"
				},
				events: {
					handleOkClick: this.addTask
				},
				clearfieldItem: ['asin'],
				form: {
					// 搜索
					search: {
						asin: true
					},
					clearSearch: null,
					cateWidth: "100%",
					count: 0,
					table: {
						maxHeigth: true,
						loading: false,
						rows: [],
						// rowKey: "productId",
						pageNumber: 1,
						pageSize: 10,
						total: 0,
						show: {

							asin: true,
							mainImg: true,
							skuItem: true,
							productName: true,

						}
					},
					userSelect: [],
					// 加入isChild
					userSelect__: [],
					// 保存一下已经选过的
					userSelect__copy: [],
					// 设置了优先的集合
					// 搜索子asin
					childSkuSearch: {}
				},
				// 表格
				table: {
					type: "1",
					URL: "productKeywordVerifyList", //列表的table,要是添加页面的table,默认table
					loading: false,
					rows: [],
					// rowKey: "verifyId",
					pageNumber: 1,
					pageSize: 10,
					total: 0,
					count: 0,
					show: {
						taskName: true,
						platformName: true,
						keywordTypes: true,
						status: true,
						createTime: true,
						resultTime: true,
						Handle: {
							// edit: true,
							refresh: true,
							check: true
						}
					}
				},
				// table编辑变体卖点
				activeTab: "title",
				options2: {
					isChild: null,
					verifyId: null,
					// 标题
					titleOriginKeywordList:null,
					titleKeywords: null,
					productName: null,
					// 卖点
					bulletOriginKeywordList:null,
					bulletKeywords: null,
					// bulletPoint: null,
					bulletPoint1:null,
					bulletPoint2:null,
					bulletPoint3:null,
					bulletPoint4:null,
					bulletPoint5:null,
					// 后台词
					backOriginKeywordList:null,
					backKeywords: null,
					backName: null,
					//
					loading_save: false,
					loading_submit: false,
					visible: false,
					width: "900px",
					title: "编辑"
				},
				userSelect: [],
				problemList: {
					msg1: null,
					status1: null,
					msg2: null,
					status2: null,
					msg3: null,
					status3: null,
				},
				resetFlag:0,
				veriFyId:null,
				newVisible:false,
				newToolList:{
					keyword:null,
					minLength:null,
					maxLength:null,
					include:null,
					exclude:null,
					barring:null,
					getKeyword:null,
				},
				
				newVisibleNew:false,
				isFull:false,
				keyClass:'suKeyDialog',
				inputSize:{
					first:31,
					second:8,
					three1:6,
					three2:20
				}
			};
		},
		
		methods: {
			isFullMethod(){
				this.$set(this,'isFull',!this.isFull)
				if(this.isFull){
					this.keyClass = 'suKeyDialogBig'
					this.inputSize = {
						first:45,
						second:12,
						three1:9,
						three2:29
					}
				}else{
					this.keyClass = 'suKeyDialog'
					this.inputSize = {
						first:31,
						second:8,
						three1:6,
						three2:20
					}
				}
				
			},
			keyupMethod(e){
				this.$nextTick(function(){
					this.$refs.inputRef.focus()
					this.newToolListNew.promptText += '    '			
				})
				
			},
			exportTxtMethod(){
				if(!this.getKeywordNew) return this.$message.warning('暂无可导出的内容')
				var blob = new Blob([this.getKeywordNew], {type: "text/plain;charset=utf-8"});  
				saveAs(blob, "结果词");  
			},
			copyMethod(){
				let vm = this
				let data = vm.getKeywordNew
				if(!data) return vm.$message.warning('暂无可复制的内容')
				vm.$copyText(data).then(function (e) {
				  vm.$message.success('复制成功')
				}, function (e) {
				  vm.$message.error('复制失败')
				})
			},
			submitNew(type) {
				this.$refs["newToolListNew"].validate((valid) => {
				    if (valid) {
						type == 1 ? this.newToolLoading2 = true : this.newToolLoading1 = true
						let form = this.newToolListNew
						let params = {
							keywords:form.keywords ? form.keywords.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							partStr:form.partStr ? form.partStr.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							includeStr:form.includeStr ? form.includeStr.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							wholeStr:form.wholeStr ? form.wholeStr.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							promptText:form.promptText ? form.promptText.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							self:form.self,
							similarity:form.similarity,
							sortType:form.sortType,
							lineCount:form.lineCount,
							execType:type,
						}
						this.$api['productKeywordVerifyGenerationKeywordToolNew'](params).then((res)=>{
							type == 1 ? this.newToolLoading2 = false : this.newToolLoading1 = false
							this.getKeywordNew = ''
							if(res.data && res.data.length){
								this.getKeywordNew = res.data.join('\n')
							}
							
						}).catch(()=>{type == 1 ? this.newToolLoading2 = false : this.newToolLoading1 = false})
				    } else {
						return false;
				    }
				});
			},
			submit1(formName) {
				this.$refs[formName].validate((valid) => {
				    if (valid) {
						this.newToolLoading = true
						let form = this.newToolList
						let params = {
							keyword:form.keyword,
							minLength:form.minLength,
							maxLength:form.maxLength,
							include:form.include ? form.include.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							exclude:form.exclude ? form.exclude.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
							barring:form.barring ? form.barring.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') : null,
						}
						this.$api['productKeywordVerifyGenerationKeywordTool'](params).then((res)=>{
							this.newToolLoading = false
							if(res.data && res.data.length){
								form.getKeyword = res.data.join('\n')
							}
							
						}).catch(()=>{this.newToolLoading = false})
				    } else {
						return false;
				    }
				});
			},
			openMethodNew(){
				this.newToolListNew.sortType = '0'
				this.newVisibleNew = true
			},
			openMethod(){
				this.$api['keywordConfigGetBackConfig']().then((res)=>{
					if(res.code == 0){
						this.newToolList.minLength = res.data.minLength
						this.newToolList.maxLength = res.data.maxLength
					}
				})
				this.newVisible = true
			},
			closeMethod1(formName){
				this.newVisible = false
				this.$refs[formName].resetFields();
			},
			closeMethod1New1(formName){
				this.newToolListNew.self = false;
				this.newToolListNew.similarity = false;
				this.getKeywordNew = null;
				this.$refs[formName].resetFields();
			},
			closeMethod1New(formName){
				this.newVisibleNew = false
				this.newToolListNew.self = false;
				this.newToolListNew.similarity = false;
				this.getKeywordNew = null;
				this.$refs[formName].resetFields();
			},
			showRow(scope) {
				if (scope.row.productType == 0) {
					return 'background-color:#f2f6fc'
				}
			},
			submitCheck(){
				let params = {
					verifyIds: [this.veriFyId]
				};
				params.sellerId = this.sellerId;
				params.siteId = this.siteId;
				params.type = 1;
				this.$api["ProductKeywordVerifyVerify"](params)
					.then(data => {
						if (data.code === 0) {
							let param = {
								pageSize: 10,
								pageNumber: 1
							};
							this.getList(param);
						}
					})
					.catch(err => {
						console.log(err);
					});
				this.options2.visible = false
			},
			refreshMethod() {
				this.iconClass = 'el-icon-loading'
				this.maskType = 1
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId,
					verifyId: this.options2.verifyId
				};
				this.$api["productKeywordVerifyResetTitleSelling"](params).then(data => {
					this.$api["ProductKeywordVerifyInfo"](params).then(data => {
						let row = data.data;
						this.options2.verifyId = row.verifyId;
						// 标题
						if(row.titleOriginKeywordList && row.titleOriginKeywordList.length) this.options2.titleOriginKeywordList = row.titleOriginKeywordList.join(',')						
						this.options2.titleKeywords = row.titleKeywords;
						this.options2.productName = row.productName;
						//   卖点;						
						if(row.bulletOriginKeywordList && row.bulletOriginKeywordList.length) this.options2.bulletOriginKeywordList = row.bulletOriginKeywordList.join(',')
						this.options2.bulletKeywords = row.bulletKeywords;
						// let arr = [row.bulletPoint1, row.bulletPoint2, row.bulletPoint3, row.bulletPoint4, row.bulletPoint5]
						// let string123 = arr.join('\n')
						// this.options2.bulletPoint = string123
						// this.options2.bulletPoint = row.bulletPoint;
						this.options2.bulletPoint1 = row.bulletPoint1;
						this.options2.bulletPoint2 = row.bulletPoint2;
						this.options2.bulletPoint3 = row.bulletPoint3;
						this.options2.bulletPoint4 = row.bulletPoint4;
						this.options2.bulletPoint5 = row.bulletPoint5;
						// 后台词
						if(row.backOriginKeywordList && row.backOriginKeywordList.length) this.options2.backOriginKeywordList = row.backOriginKeywordList.join(',')						
						this.options2.backKeywords = row.backKeywords;
						this.options2.backName = row.backName;
						if (!row.productType) {
							this.$set(this.problemList, "isChild3", 1);
						} else {
							this.$set(this.problemList, "isChild3", 0);
						}
					}).catch(() => {
						this.iconClass = 'el-icon-refresh';
						this.maskType = 0
					});
					this.$api["productKeywordVerifyVerifyData"](params).then(data => {
						let row = data.data;
						if (row) {
							for (var i = 0; i < row.length; i++) {
								if (row[i].type === 0) {

									this.$set(this.problemList, "msg1", row[i].message);
									this.$set(this.problemList, "status1", row[i].status);
								} else if (row[i].type === 1) {
									this.$set(this.problemList, "msg2", row[i].message);
									this.$set(this.problemList, "status2", row[i].status);
								} else if (row[i].type === 2) {
									this.$set(this.problemList, "msg3", row[i].message);
									this.$set(this.problemList, "status3", row[i].status);
								}
							}
						}
					}).catch(() => {
						this.iconClass = 'el-icon-refresh';
						this.maskType = 0
					});
					this.iconClass = 'el-icon-refresh'
					this.maskType = 0
					this.$message.success('重置成功')
				}).catch(() => {
					this.iconClass = 'el-icon-refresh'
					this.maskType = 0
				})
			},
			closedBig(){
				this.isFull = false
				this.keyClass = 'suKeyDialog'
				this.inputSize = {
					first:31,
					second:8,
					three1:6,
					three2:20
				}
			},
			closeMethod() {
				// this.problemList = {}
			},
			selectc(selection, row) {
				// console.log(selection);
				// console.log(row);
				this.$nextTick(() => {
					// console.log(this.userSelect, "this.userSelect");
					// 选中父asin，默认选中子asin
					if (row.childShow) {
						// 1.点击是父
						let isInChoose = this.userSelect.find(el => {
							return el.verifyId === row.verifyId;
						});
						if (isInChoose) {
							row.productKeywordVerifyVOList.forEach(item => {
								this.$refs.Table.toggleRowSelection(item, true);
							});
						} else {
							row.productKeywordVerifyVOList.forEach(item => {
								this.$refs.Table.toggleRowSelection(item, false);
							});
						}
					} else {
						// 2.点击子asin的时候去掉父的勾选
						// 1 先找到该子属于哪一个父
						// let parent = null;
						// this.table.rows.forEach(item => {
						// 	if (item.productKeywordVerifyVOList) {
						// 		let found = item.productKeywordVerifyVOList.find(el => {
						// 			return row.verifyId === el.verifyId;
						// 		});
						// 		if (found) {
						// 			// 找到父
						// 			parent = item;
						// 		}
						// 	}
						// });
						// console.log(parent, "找到父parent");
						// if (parent) {
						// 	//  2判断该父是否已经被勾选
						// 	let parentIsInChoose = this.userSelect.find(i => {
						// 		return parent.verifyId === i.verifyId;
						// 	});
						// 	// console.log(parentIsInChoose, "parentIsInChoose");
						// 	// 3333333333333333该父已被勾选的情况下
						// 	if (parentIsInChoose) {
						// 		// 4判断此次是去掉子的钩，还是把它勾上
						// 		let isChildInUserSelect = this.userSelect.find(u => {
						// 			return u.verifyId === row.verifyId;
						// 		});
						// 		// console.log(isChildInUserSelect, "isChildInUserSelect");
						// 		if (!isChildInUserSelect) {
						// 			// 8如果行为时去掉钩子，则直接去掉该子上面的父钩（因为一个子未勾选，则父不能勾选）
						// 			this.$refs.Table.toggleRowSelection(parentIsInChoose, false);
						// 			return;
						// 		}
						// 	} else {
						// 		// 333333333333333该父为未被勾选的情况下
						// 		let isAllChildChoosed = true;
						// 		parent.productKeywordVerifyVOList.forEach(j => {
						// 			let result = this.userSelect.find(k => {
						// 				return k.verifyId === j.verifyId;
						// 			});
						// 			// console.log(result, "result");
						// 			if (!result) {
						// 				isAllChildChoosed = false;
						// 			}
						// 		});
						// 		if (isAllChildChoosed) {
						// 			// 其他子已经全勾
						// 			this.$refs.Table.toggleRowSelection(parent, true);
						// 		} else {
						// 			// 其他子未全勾
						// 			this.$refs.Table.toggleRowSelection(parent, false);
						// 		}
						// 		return;
						// 	}
						// }
					}
				});
			},
			// 列表
			getList(arg) {
				let params = {
					siteId: this.siteId, //上线要改
					sellerId: this.sellerId, //上线要改
					...arg
				};
				if (this.table.type === "1") {
					params.pageSize = this.table.pageSize;
					params.pageNumber = this.table.pageNumber;
				} else if (this.table.type === "2") {
					params.pageSize = this.form.table.pageSize;
					params.pageNumber = this.form.table.pageNumber;
				}
				// 如果搜索了分类名称，则记录分类名称，用于搜索结果高亮
				if (params.asin) {
					this.searchName0 = params.asin;
				} else {
					this.searchName0 = "";
				}
				if (params.titleStatus) {
					let n = params.titleStatus[0];
					if (n === 0) {
						params.verifyStatus = 0;
					} else if (n === 1) {
						params.verifyStatus = 1;
					} else if (n === 2) {
						params.verifyStatus = 2;
					} else if (n === 3) {
						params.verifyStatus = 3;
					}
				}

				if (params.BackStatus) {
					let x = params.BackStatus[0];
					if (x === 0) {
						params.backStatus = 0;
					} else if (x === 1) {
						params.backStatus = 1;
					} else if (x === 2) {
						params.backStatus = 2;
					} else if (x === 3) {
						params.backStatus = 3;
					}
				}

				// 如果与日期，要分开赋值
				// if (
				//   // params.titleStatus &&
				//   params.titleStatus.length &&
				//   !params.BackStatus.length
				// ) {
				//   // 只选左边
				//   let n = params.titleStatus[0];
				//   if (n === 0) {
				//     params.verifyStatus = 0;
				//   } else if (n === 1) {
				//     params.verifyStatus = 1;
				//   } else if (n === 2) {
				//     params.verifyStatus = 2;
				//   } else if (n === 3) {
				//     params.verifyStatus = 3;
				//   }
				// } else if (
				//   !params.titleStatus.length &&
				//   // params.BackStatus &&
				//   params.BackStatus.length
				// ) {
				//   // 只选右边
				//   let n = params.BackStatus[0];
				//   if (n === 0) {
				//     params.BackStatus = 0;
				//   } else if (n === 1) {
				//     params.BackStatus = 1;
				//   } else if (n === 2) {
				//     params.BackStatus = 2;
				//   } else if (n === 3) {
				//     params.BackStatus = 3;
				//   }
				// } 
				// else if (
				//      params.titleStatus &&
				//      params.titleStatus.length &&
				//      params.BackStatus &&
				//      params.BackStatus.length
				//    ) {
				//      //   两边都选
				//      let a = params.titleStatus[0];
				//      let b = params.BackStatus[0];
				//      if (a === 0 && b === 0) {
				//        params.verifyStatus = [0];
				//      } else if (a === 1 && b === 0) {
				//        params.verifyStatus = [1];
				//      } else if (a === 2 && b === 1) {
				//        params.verifyStatus = [3];
				//      } else if (a === 2 && b === 2) {
				//        params.verifyStatus = [4];
				//      } else if (a === 2 && b === 3) {
				//        params.verifyStatus = [5];
				//      }
				//    }
				delete params.titleStatus;
				delete params.BackStatus;
				params = this.$.dealObjectValue(params);
				// console.log(params, "params");
				if (this.table.type === "1") {
					this.table.loading = true;
				} else if (this.table.type === "2") {
					this.form.table.loading = false;
				}
				return this.$api[this.table.URL](params)
					.then(data => {
						if (
							data.rows == "" &&
							data.pageNo !== null &&
							data.pageNo !== "" &&
							data.pageNo !== 1
						) {
							let a;
							if (this.table.type === "1") {
								a = {
									pageSize: this.table.pageSize,
									pageNumber: 1
								};
							} else {
								a = {
									pageSize: this.form.table.pageSize,
									pageNumber: 1
								};
							}
							this.getList(a);
							return;
						}
						// 如果搜索了名称，则要高亮
						let rows = data.rows;
						if (rows) {
							if (this.searchName0) {
								this.findSearNameIndex(rows, this.searchName0);
							}
						}
						if (this.table.type === "1") {
							this.table.loading = false;
							this.table.rows = data.rows;
							this.table.rows.forEach(el => {
								if (
									el.productKeywordVerifyVOList &&
									el.productKeywordVerifyVOList.length
								) {
									el.productKeywordVerifyVOList.forEach(i => {
										i.isChild = true;
									});
								}
							});
							this.table.pageNumber = data.pageNo;
							this.table.pageSize = data.pageSize;
							this.table.total = data.total;
						} else if (this.table.type === "2") {
							this.form.table.loading = false;
							this.form.table.rows = data.rows;
							this.form.table.pageNumber = data.pageNo;
							this.form.table.pageSize = data.pageSize;
							this.form.table.total = data.total;
						}
						return true;
					})
					.catch(err => {
						this.table.loading = false;
						this.form.table.loading = false;
						console.log(err);
						return true;
					});
			},
			// table选中
			handleSelectionChange(val) {
				console.log(val);
				this.userSelect = val;
			},
			// 分页
			handleSizeChange(pageSize) {
				let arg = {
					pageSize: pageSize
				};
				this.getList(arg);
			},
			handleCurrentChange(pageNumber) {
				let arg = {
					pageNumber: pageNumber
				};
				this.getList(arg);
			},
			// 找到搜索的名称所在项，并标记表示渲染时要高亮
			findSearNameIndex(rows, searchName) {
				rows.forEach((item, index) => {
					let isIn = item.asin.indexOf(searchName);
					if (isIn !== -1) {
						item.highlight = true;
						let regExp = new RegExp(searchName, "gm");
						// let newStr = `<span style="color:red">${searchName}</span>`;
						let newStr = searchName;
						item.asin = item.asin.replace(regExp, newStr);
					}
					if (
						item.productKeywordVerifyVOList &&
						item.productKeywordVerifyVOList.length > 0
					) {
						this.findSearNameIndex(item.productKeywordVerifyVOList, searchName);
					}
				});
				// console.log(rows, "高亮后");
			},
			// 显示表格子类目
			list_listShowChildCate(scope) {
				// console.log(scope);
				//   console.log(scope.row.productKeywordVerifyVOList);
				let index = scope.$index;
				let child = scope.row.productKeywordVerifyVOList;
				let item = this.table.rows[index];
				item.childShow = true;
				this.table.rows.splice(index, 1, item);
				if (child) {
					// console.log(index);
					// console.log(child);
					this.table.rows.splice(index + 1, 0, ...child);
					// console.log(this.table.rows, "rows");
				}
			},
			// 收起列表
			async list_listHiddenChildCate(scope) {
				try {
					//   console.log(scope.row.productKeywordVerifyVOList);
					let index = scope.$index;
					let child = scope.row.productKeywordVerifyVOList;
					
					let item = this.table.rows[index];
					//   console.log(item, "item");
					this.table.count += this.table.rows[
						index
					].productKeywordVerifyVOList.length;
					if (child) {
						child.map(el => {
							if (this.userSelect.indexOf(el) > -1) {
								el.__pre__checked= true
							} else {
								el.__pre__checked= false
							}
						})
						// console.log(index);
						// console.log(child);
						let delOld = this.list_deOld(child);
						if (delOld) {
							let c = await this.list_childShowCount(child);
							// console.log(c);
							if (c) {
								let set = this.list_setChildShow(child);
								if (set) {
									this.table.rows.splice(index + 1, c);
									// console.log(this.table.rows);
								}
							}
						}
					}
					item.childShow = false;
					this.table.count = 0;
					// 改变了childShow是为了判断展示加号还是减号
					this.table.rows.splice(index, 1, item);
				} catch (err) {
					console.log(err);
				}
			},
			// 收起前删除isOld
			list_deOld(arr) {
				let len = arr.length;
				if (arr) {
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (arr[i].productKeywordVerifyVOList) {
							delete arr[i].isOld;
							this.list_deOld(arr[i].productKeywordVerifyVOList);
							continue;
						}
					}
				}
				return true;
			},
			// 收起的时候递归查找有几个childShow是true的，就删除几个
			list_childShowCount(arr) {
				if (arr) {
					let len = arr.length;
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (
							arr[i].productKeywordVerifyVOList &&
							arr[i].childShow === true &&
							!arr[i].isOld
						) {
							arr[i].isOld = true;
							this.table.count += arr[i].productKeywordVerifyVOList.length;
							this.list_childShowCount(arr[i].productKeywordVerifyVOList);
							continue;
						}
					}
				}
				return this.table.count;
			},
			// 收起的时候设置被收起的项的childShow为false
			list_setChildShow(arr) {
				let len = arr.length;
				if (arr) {
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (arr[i].productKeywordVerifyVOList && arr[i].isOld === true) {
							arr[i].childShow = false;
							this.list_setChildShow(arr[i].productKeywordVerifyVOList);
							continue;
						}
					}
				}
				return true;
			},
			// 大table中的编辑标题卖点todo
			edit__(scope) {
				this.options2.visible = true;
				this.activeTab = "title";
				// console.log(scope, "scope");
				if (scope.row.verifyStatus === 4) {
					this.$set(this.options2, "verifyStatus", 4);
				} else {
					this.$set(this.options2, "verifyStatus", "");
				}
				// 子sku才有后台词
				// if (scope.row.isChild === true) {       
				//   this.$set(this.options2, "isChild", true);
				// } else {
				//   this.$set(this.options2, "isChild", false);
				// }
				
				this.veriFyId = scope.row.verifyId
				this.getOne__(scope);
				this.getTwo__(scope);
			},
			// 获取单条详情
			getOne__(scope) {
				let verifyId = scope.row.verifyId;
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId,
					verifyId: verifyId
				};
				this.$api["ProductKeywordVerifyInfo"](params).then(data => {
					let row = data.data;
					this.options2.verifyId = row.verifyId;
					this.resetFlag = row.resetFlag
					// 标题
					if(row.titleOriginKeywordList && row.titleOriginKeywordList.length) this.options2.titleOriginKeywordList = row.titleOriginKeywordList.join(',')	
					this.options2.titleKeywords = row.titleKeywords;
					this.options2.productName = row.productName;
					//   卖点;
					if(row.bulletOriginKeywordList && row.bulletOriginKeywordList.length) this.options2.bulletOriginKeywordList = row.bulletOriginKeywordList.join(',')
					this.options2.bulletKeywords = row.bulletKeywords;
					// let arr = [row.bulletPoint1, row.bulletPoint2, row.bulletPoint3, row.bulletPoint4, row.bulletPoint5]
					// let string123 = arr.join('\n')
					// this.options2.bulletPoint = string123
					// this.options2.bulletPoint = row.bulletPoint;
					this.options2.bulletPoint1 = row.bulletPoint1;
					this.options2.bulletPoint2 = row.bulletPoint2;
					this.options2.bulletPoint3 = row.bulletPoint3;
					this.options2.bulletPoint4 = row.bulletPoint4;
					this.options2.bulletPoint5 = row.bulletPoint5;
					// 后台词
					if(row.backOriginKeywordList && row.backOriginKeywordList.length) this.options2.backOriginKeywordList = row.backOriginKeywordList.join(',')
					
					this.options2.backKeywords = row.backKeywords;
					this.options2.backName = row.backName;
					if (!row.productType) {
						this.$set(this.problemList, "isChild3", 1);
					} else {
						this.$set(this.problemList, "isChild3", 0);
					}
				});
			},
			getTwo__(scope) {
				let verifyId = scope.row.verifyId;
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId,
					verifyId: verifyId
				};
				this.$api["productKeywordVerifyVerifyData"](params).then(data => {
					let row = data.data;
					if (row) {
						for (var i = 0; i < row.length; i++) {
							if (row[i].type === 0) {
								this.$set(this.problemList, "msg1", row[i].message);
								this.$set(this.problemList, "status1", row[i].status);
							} else if (row[i].type === 1) {
								this.$set(this.problemList, "msg2", row[i].message);
								this.$set(this.problemList, "status2", row[i].status);
							} else if (row[i].type === 2) {
								this.$set(this.problemList, "msg3", row[i].message);
								this.$set(this.problemList, "status3", row[i].status);
							}
						}
					}
				});
			},
			// 编辑保存 提交
			editSave(flag) {
				// let arr = this.options2.bulletPoint.split('\n')
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId,
					verifyId: this.options2.verifyId,
					type: this.activeTab === 'back3' ? 1 : this.activeTab === 'point2' ? 2 : 0,
					productName: this.options2.productName,
					bulletPoint1: this.options2.bulletPoint1,
					bulletPoint2: this.options2.bulletPoint2,
					bulletPoint3: this.options2.bulletPoint3,
					bulletPoint4: this.options2.bulletPoint4,
					bulletPoint5: this.options2.bulletPoint5,
					backName: this.options2.backName,
					flag: flag
				};
				params = this.$.dealObjectValue(params);
				if (flag === 0) {
					this.options2.loading_save = true;
				} else {
					this.options2.loading_submit = true;
				}
				this.$api["ProductKeywordVerifyUpdateTitleSelling"](params)
					.then(data => {
						// this.options2.visible = false;
						if (data.code === 0) {
							//this.options2.visible = false;
							//this.problemList = {}
							if (this.activeTab === 'title') {
								this.$set(this.problemList, "msg1", []);
								this.$set(this.problemList, "status1", 1);
							} else if (this.activeTab === 'point2') {
								this.$set(this.problemList, "msg2", []);
								this.$set(this.problemList, "status2", 1);
							} else if (this.activeTab === 'back3') {
								this.$set(this.problemList, "msg3", []);
								this.$set(this.problemList, "status3", 1);
							}
							if (flag === 0) {
								this.options2.loading_save = false;
								this.getList();
							} else {
								this.options2.loading_submit = false;
								this.getList();
							}
						} else {
							let row = data.data;
							if (row) {
								for (var i = 0; i < row.length; i++) {
									if (row[i].type === 0) {
										this.$set(this.problemList, "msg1", row[i].message);
										this.$set(this.problemList, "status1", row[i].status);
									} else if (row[i].type === 1) {
										this.$set(this.problemList, "msg2", row[i].message);
										this.$set(this.problemList, "status2", row[i].status);
									} else if (row[i].type === 2) {
										this.$set(this.problemList, "msg3", row[i].message);
										this.$set(this.problemList, "status3", row[i].status);
									}
								}
							}
							if (flag === 0) {
								this.options2.loading_save = false;
							} else {
								this.options2.loading_submit = false;
							}
						}
					})
					.catch(err => {
						if (flag === 0) {
							this.options2.loading_save = false;
						} else {
							this.options2.loading_submit = false;
						}
					});
			},
			// 查看单条
			check__(scope) {
				//   console.log(scope.row);
				let row = scope.row;
				this.$router.push({
					name: "ProductCheckDetail",
					query: {
						verifyId: row.verifyId,
						asin: row.asin,
						asinName: 'ASIN: ' + row.asin,
						sellerId: this.sellerId,
						siteId: this.siteId
					}
				});
			},
			// 重新校验
			refresh__(scope) {
				let str;
				str = "此操作对本条进行重新校验, 是否继续?";
				this.$confirm(str, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let verifyIds = [];
						verifyIds.push(scope.row.verifyId);
						this.verify(verifyIds);
					})
					.catch(err => {
						console.log(err);
						this.$message({
							type: "info",
							message: "已放弃本次操作"
						});
					});
			},
			// 词库不足，前往添加关键词
			toKeyLexiconKey(scope) {
				console.log(scope);
				let cached = [
        'cusCateIdArray',
        'activeName',
        'pParams',
        'componentName',
        'defaultExpanded',
        'currentNodeKey',
        'currentNodeKeyPro',
        'defaultExpandedPro'
			]
			cached.forEach(name => {
				storage.remove('session', name)
			})
				let row = scope.row;
				let params = {
					cusCateId: row.cusCateId,
					productId: row.parentProductId,
					customName: row.customName,
					backBtnShow: true
				};

				try {
					// let backRoutes = storage.get("local", "backRoutes") || [];
					// backRoutes.push({
					//   title: this.$route.meta.title,
					//   query: this.$route.query,
					//   name: this.$route.name
					// });
					// storage.set("local", "backRoutes", backRoutes);
					// this.$store.commit("setBackRoutes", backRoutes);
				} catch (error) {}

				this.$router.push({
					path: "/keyLexicon/key",
					query: params
				});

				// this.$message.warning("功能开发中，须携带的参数尚未确定");
			},
			// 添加
			addTask() {
				let select = this.form.userSelect;
				if (select.length === 0) {
					this.$message.warning("请选择ASIN");
				} else {
					console.log(select, "select");
					let params = {
						siteId: this.siteId, //上线要改
						sellerId: this.sellerId, //上线要改
						product: this.form.userSelect__
					};
					params = this.$.dealObjectValue(params);
					console.log(params, "params");
					this.addFun(params);
				}
			},
			addFun(params) {
				this.options.loading = true; // 按钮loading;
				let arr = JSON.parse(JSON.stringify(params.product));
				let arr_ = [];
				if (params.product) {
					arr.forEach(el => {
						// console.log(el);
						if (!el.isChild) {
							arr_.push(el);
						}
					});
				}
				params.product = arr_;
				this.$api[this.options.URL](params)
					.then(data => {
						this.options.loading = false;
						this.options.visible = false; // 关闭弹窗
						this.$nextTick(() => {
							this.reset();
							this.clearSearch = new Date().getTime();
						});
					})
					.catch(err => {
						console.log(err, "err");
						this.options.loading = false;
					});
			},
			resetFields_add() {
				this.reset();
				this.$nextTick(() => {
					this.getList();
				});
			},
			// 校验
			verify(arg) {
				let params = {
					verifyIds: arg
				};
				params.sellerId = this.sellerId;
				params.siteId = this.siteId;
				params.type = 0;
				this.$api["ProductKeywordVerifyVerify"](params)
					.then(data => {
						if (data.code === 0) {
							let param = {
								pageSize: 10,
								pageNumber: 1
							};
							this.getList(param);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			verify2(arg) {
				let params = {
					verifyIds: arg
				};
				params.sellerId = this.sellerId;
				params.siteId = this.siteId;
				params.type = 1;
				this.$api["ProductKeywordVerifyVerify"](params)
					.then(data => {
						if (data.code === 0) {
							let param = {
								pageSize: 10,
								pageNumber: 1
							};
							this.getList(param);
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 设置优先、取消优先
			priority(verifyIds, type) {
				let params = {
					verifyIds: verifyIds
				};
				params.sellerId = this.sellerId;
				params.siteId = this.siteId;
				if (type === 0) {
					// 取消优先
					params.priorityType = 0;
				} else {
					//   设置优先
					params.priorityType = 1;
				}
				return this.$api["ProductKeywordVerifyUpdatePriorityType"](params)
					.then(data => {
						if (data.code === 0) {
							let param = {
								pageSize: 10,
								pageNumber: 1
							};
							this.getList(param);
							this.userSelect = [];
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 显示表格子类目 dialog
			listShowChildCate(scope) {
				//   console.log(scope.row.productAsinVOList);
				let index = scope.$index;
				let child = scope.row.productAsinVOList;
				let item = this.form.userSelect__[index];
				item.childShow = true;
				this.form.userSelect__.splice(index, 1, item);
				if (child) {
					// console.log(index);
					// console.log(child);
					this.form.userSelect__.splice(index + 1, 0, ...child);
				}
			},
			// 收起列表
			async listHiddenChildCate(scope) {
				try {
					//   console.log(scope.row.productAsinVOList);
					let index = scope.$index;
					let child = scope.row.productAsinVOList;
					let item = this.form.userSelect__[index];
					//   console.log(item, "item");
					this.form.count += this.form.userSelect__[
						index
					].productAsinVOList.length;
					if (child) {
						// console.log(index);
						// console.log(child);
						let delOld = this.deOld(child);
						if (delOld) {
							let c = await this.childShowCount(child);
							// console.log(c);
							if (c) {
								let set = this.setChildShow(child);
								if (set) {
									this.form.userSelect__.splice(index + 1, c);
									// console.log(this.form.userSelect__);
								}
							}
						}
					}
					item.childShow = false;
					this.form.count = 0;
					// 改变了childShow是为了判断展示加号还是减号
					this.form.userSelect__.splice(index, 1, item);
				} catch (err) {
					console.log(err);
				}
			},
			// 收起前删除isOld
			deOld(arr) {
				let len = arr.length;
				if (arr) {
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (arr[i].productAsinVOList) {
							delete arr[i].isOld;
							this.deOld(arr[i].productAsinVOList);
							continue;
						}
					}
				}
				return true;
			},
			// 收起的时候递归查找有几个childShow是true的，就删除几个
			childShowCount(arr) {
				if (arr) {
					let len = arr.length;
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (
							arr[i].productAsinVOList &&
							arr[i].childShow === true &&
							!arr[i].isOld
						) {
							arr[i].isOld = true;
							this.form.count += arr[i].productAsinVOList.length;
							this.childShowCount(arr[i].productAsinVOList);
							continue;
						}
					}
				}
				return this.form.count;
			},
			// 收起的时候设置被收起的项的childShow为false
			setChildShow(arr) {
				let len = arr.length;
				if (arr) {
					for (let i = 0; i < len; i++) {
						// console.log(child[i]);
						if (arr[i].productAsinVOList && arr[i].isOld === true) {
							arr[i].childShow = false;
							this.setChildShow(arr[i].productAsinVOList);
							continue;
						}
					}
				}
				return true;
			},
			reset() {
				// todo
				this.form.userSelect__copy = [];
			},
			// 添加——搜索已选中asin todo
			searchChild() {
				// this.$message.warning("功能开发中");
				// 1.搜索结果出来前复制一份
				this.form.userSelect__2 = JSON.parse(
					JSON.stringify(this.form.userSelect__)
				);
				// 2.输入的搜索asin
				let sear_asin = this.form.childSkuSearch.asin;
				console.log(this.form.userSelect__2, "this.form.userSelect__2");
				console.log(sear_asin, "sear_asin");
				let item = this.form.userSelect__2.find(el => {
					return el.asin === sear_asin;
				});
				console.log(item, "item");
				this.form.userSelect__ = [item];
			},
			// 清空子asin搜索框
			clearSearchChild() {
				if (this.form.userSelect__2) {
					this.form.userSelect__ = this.form.userSelect__2;
					// 清空类似于重新请求，收起列表
					this.form.userSelect__.forEach(el => {
						el.childShow = false;
					});
					// 清空表示不在搜索状态下
					this.form.userSelect__2 = [];
				}
			},
			// 搜索情况下设置优先，要将其改变到this.form.userSelect__2中去
			effect_userSelect__2_by_edit__first(arg, arr) {
				let index = arg.$index;
				arg.row.first = true;
				//   console.log(arg.row);
				let data = arr.find(el => {
					return el.asin === arg.row.parentAsin;
				});
				data.priorityId.push(arg.row.productId);
				//   console.log(data, "data");
				arr.splice(index, 1, arg.row);
				//   console.log(this.form.userSelect__, "userSelect__");
				// 设置 this.form.userSelect__copy 里面的数据 用于去掉选择后，再次选择时呈现展开与否，优先与否
				this.form.userSelect__copy = arr;
			},
			// 搜索情况下取消优先，要将其改变到this.form.userSelect__2中去
			effect_userSelect__2_by_cancel__first(arg, arr) {
				let index = arg.$index;
				arg.row.first = false;
				let data = arr.find(el => {
					// 找到父asin，asin下有priorityId用来保存优先集合的
					return el.asin === arg.row.parentAsin;
				});
				let i = data.priorityId.findIndex(el => {
					// 找到当前productId所在的位置i
					return el === arg.row.productId;
				});
				// 去掉此productId
				data.priorityId.splice(i, 1);
				arr.splice(index, 1, arg.row);
				//   console.log(this.form.userSelect__, "userSelect__");
				// 设置 this.form.userSelect__copy 里面的数据 用于去掉选择后，再次选择时呈现展开与否，优先与否
				this.form.userSelect__copy = arr;
			},
			// 设置优先
			edit__first(arg) {
				// 搜索情况下设置优先，要将其改变到this.form.userSelect__2中去
				if (this.form.userSelect__2) {
					this.effect_userSelect__2_by_edit__first(arg, this.form.userSelect__2);
				}
				//   console.log(arg, "设置优先");
				let index = arg.$index;
				arg.row.first = true;
				//   console.log(arg.row);
				let data = this.form.userSelect__.find(el => {
					return el.asin === arg.row.parentAsin;
				});
				data.priorityId.push(arg.row.productId);
				//   console.log(data, "data");
				this.form.userSelect__.splice(index, 1, arg.row);
				//   console.log(this.form.userSelect__, "userSelect__");
				// 设置 this.form.userSelect__copy 里面的数据 用于去掉选择后，再次选择时呈现展开与否，优先与否
				this.form.userSelect__copy = this.form.userSelect__;
				//   console.log(this.form.userSelect__copy, "this.form.userSelect__copy");
			},
			// 取消设置优先
			cancel__first(arg) {
				if (this.form.userSelect__2) {
					this.effect_userSelect__2_by_cancel__first(
						arg,
						this.form.userSelect__2
					);
				}
				let index = arg.$index;
				arg.row.first = false;
				let data = this.form.userSelect__.find(el => {
					// 找到父asin，asin下有priorityId用来保存优先集合的
					return el.asin === arg.row.parentAsin;
				});
				let i = data.priorityId.findIndex(el => {
					// 找到当前productId所在的位置i
					return el === arg.row.productId;
				});
				// 去掉此productId
				data.priorityId.splice(i, 1);
				this.form.userSelect__.splice(index, 1, arg.row);
				//   console.log(this.form.userSelect__, "userSelect__");
				// 设置 this.form.userSelect__copy 里面的数据 用于去掉选择后，再次选择时呈现展开与否，优先与否
				this.form.userSelect__copy = this.form.userSelect__;
				//   console.log(this.form.userSelect__copy, "this.form.userSelect__copy");
			},
			delete__(arg) {
				this.$confirm("此操作将删除该项, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						// this.$message.warning("尚未提供接口");
						let params = {
							sellerId: this.sellerId,
							siteId: this.siteId,
							verifyId: arg.row.verifyId
						};
						this.$api["ProductKeywordVerifyRemove"](params)
							.then(data => {
								let param = {
									pageSize: 10,
									pageNumber: 1
								};
								this.getList(param);
							})
							.catch(err => {
								console.log(err);
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已放弃本次操作"
						});
					});
			}
		},
		computed: {},
		created() {
			if (this.sellerId && this.siteId) {
				this.getList();
			}
		},
		mounted() {},
		watch: {
			"table.rows"(val) {
				// todo
				this.$nextTick(() => {
					// console.log(this.userSelect, "this.userSelect");
					this.userSelect.forEach(el => {
						if (el.childShow) {
							// __pre__checked
								el.productKeywordVerifyVOList.forEach(item => {
									this.$refs.Table.toggleRowSelection(item, !!item.__pre__checked);
								});
						}
						// if (el.childShow) {
						// 	el.productKeywordVerifyVOList.forEach(item => {
						// 		this.$refs.Table.toggleRowSelection(item, true);
						// 	});
						// } else {
						// 	el.productKeywordVerifyVOList.forEach(item => {
						// 		this.$refs.Table.toggleRowSelection(item, false);
						// 	});
						// }
					});
				});
			},
			sellerData() {
				this.table.pageNumber = 1;
				this.getList();
			},
			"options.visible"(new_val) {
				if (new_val === true) {
					this.table.type = "2";
					this.table.URL = "ProductListToParentAsin";
					// 清空弹窗
					// 清空第一个搜索框
					this.form.clearSearch = new Date().getTime();
					// 清空第二个搜索框
					this.form.childSkuSearch = {};
					// end
				} else if (new_val === false) {
					this.table.type = "1";
					this.table.URL = "productKeywordVerifyList";
				}
			},
			// 监听用户选择的父asin,给每一个父asin下的子asin加上isChild 字样，用于可以设置优先
			"form.userSelect"(val) {
				let v = JSON.parse(JSON.stringify(val));
				if (v.length === 0) {
					this.form.userSelect__ = [];
					return;
				} else {
					v.forEach((el, index) => {
						console.log(el, "el");
						// 添加一个放设置优先id的空数组
						el.priorityId = [];
						el.productAsinVOList.forEach(i => {
							i.isChild = true;
						});
						// 找到是否已选
						let isInCopy = this.form.userSelect__copy.find(item => {
							return el.asin === item.asin;
						});
						console.log(isInCopy, "isInCopy");
						if (!isInCopy) {
							// 没选则放进去
							this.form.userSelect__copy.push(el);
						} else {
							//   已选则使用里面的优先设置
							el.priorityId = isInCopy.priorityId;
							el.productAsinVOList = isInCopy.productAsinVOList;
							this.form.userSelect__copy.push(isInCopy);
						}
					});
					this.form.userSelect__ = v;
					// console.log(this.form.userSelect__copy, "copy");
					// console.log(this.form.userSelect__, "form.userSelect__");
				}
			}
		}
	};
</script>
<style lang="scss">
	
</style>
<style lang='scss' scoped>
	._title {
		display: flex;
		position: relative;

		._label {
			width: 50px;
			text-align: right;
		}

		._content_box {
			border: 1px solid #e4e4e4;
			width: 574px;
			padding: 8px;
			line-height: 1.5em;
			min-height: 100px;
		}
	}

	.big__ {
		width: 220px;
		height: 220px;
		object-fit: contain;
		overflow: hidden;
	}
	.bigIcon{
		  float: right;
		  margin-right: 20px;
		  cursor: pointer;
		  font-size: 14px;
		  color:#909399;
		  margin-top: 0.8px;
	}
	.bigIcon:hover{
		  color: #377EA8
	}
</style>
