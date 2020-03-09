<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="通用约束" name="first" lazy>
        <ElForm :model="data" ref="form0" label-width="65px" size="small">
          <div class="title flex-c">
            通用约束
            <el-button type="primary" size="small" @click="save(0)" plain>保存</el-button>
          </div>
          <ElRow type="flex" v-for="(item, index) in data.systemSettingListSafetyConst" :key="index">
            <ElCol :span="9">
              <ElFormItem label-width="90px">
                <span slot="label">
                  约束项
                  <ElTooltip :content="item.remark" placement="top">
                    <ElButton type="text" icon="el-icon-question"></ElButton>
                  </ElTooltip>
                </span>
                <el-input v-model="item.remark" disabled></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="9">
              <ElFormItem label="约束值">
                <el-input v-model="item.value" :disabled="item.editFlag === 0"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem label="单位">
                <el-input v-model="item.unit" disabled></el-input>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
      </el-tab-pane>
      <el-tab-pane label="购买时间间隔约束" name="second" lazy>
        <ElForm ref="form3" :model="data" label-width="65px" size="small">
          <div class="title flex-c">
            购买时间间隔约束
            <el-button type="primary" size="small" @click="save(3)" plain>保存</el-button>
          </div>
          <div class="params">
            <template v-if="data.taskConstBuyTimeList.length">
              <div class="flex mb20" v-for="(param, paramIndex) in data.taskConstBuyTimeList" :key="paramIndex">
                <div class="flex-r mr10 br pt10">
                  <div class="flex-c">
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :rules="vali(true, '')"
                      :prop="`taskConstBuyTimeList.${paramIndex}.condition`"
                    >
                      <el-select v-model="param.condition" style="width:100%">
                        <el-option v-for="i in timeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                      </el-select>
                    </ElFormItem>
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstBuyTimeList.${paramIndex}.min`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber
                        :max="paramIndex == data.taskConstBuyTimeList.length - 1 ? 100000: 99999"
                        :disabled="true"
                        :min="0"
                        controls-position="right"
                        v-model="param.min"
                      ></ElInputNumber>
                    </ElFormItem>

                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstBuyTimeList.${paramIndex}.max`"
                      :rules="getMaxRule(param, paramIndex, data.taskConstBuyTimeList)"
                    >
                      <span class="mr10">~</span>
                      <span
                        style="width: 130px;display:inline-block"
                        v-if="paramIndex == data.taskConstBuyTimeList.length - 1"
                      >∞</span>
                      <ElInputNumber
                        v-show="paramIndex != data.taskConstBuyTimeList.length - 1"
                        :disabled="paramIndex == data.taskConstBuyTimeList.length - 1"
                        :min="param.min || 0"
                        :max="paramIndex == data.taskConstBuyTimeList.length - 1 ? 100002: 99999"
                        controls-position="right"
                        @change="lastItemChange(param, paramIndex, data.taskConstBuyTimeList, $event, 'min')"
                        v-model="param.max"
                      ></ElInputNumber>
                    </ElFormItem>
                  </div>
                </div>
                <div class="flex-c mr10 br pt10">
                  <ElFormItem
                    label-width="160px"
                    label="购买间隔天数"
                    :prop="`taskConstBuyTimeList.${paramIndex}.intervalDay`"
                    :rules="vali(true, '')"
                  >
                    <ElInputNumber :min="0" controls-position="right" v-model="param.intervalDay"></ElInputNumber>
                  </ElFormItem>
                </div>
                <div class="flex-c">
                  <ElButton
                    type="text"
                    icon="el-icon-plus"
                    style="margin:0;padding: 4px"
                    @click="handleTimeArr(param, paramIndex, data.taskConstBuyTimeList, true)"
                  ></ElButton>
                  <ElButton
                    v-if="paramIndex !== 0"
                    type="text"
                    icon="el-icon-minus"
                    style="margin:0;padding: 4px"
                    :style="{visibility: data.taskConstBuyTimeList.length <= 1 ? 'hidden' : 'initial'}"
                    @click="handleTimeArr(param, paramIndex,data.taskConstBuyTimeList)"
                  ></ElButton>
                </div>
              </div>
            </template>
          </div>
        </ElForm>
      </el-tab-pane>
      <el-tab-pane label="账号类目约束" name="third" lazy>
        <ElForm ref="form1" :model="data" label-width="65px" size="small">
          <div class="title flex-c">
            账号类目约束
            <el-button type="primary" size="small" @click="save(1)" plain>保存</el-button>
          </div>
          <div class="params">
            <template v-if="data.accountConstParamList.length">
              <div class="flex mb20" v-for="(param, paramIndex) in data.accountConstParamList">
                <!-- 注册天数等 -->
                <div class="flex-r mr10 br pt10">
                  <div class="flex-c" v-for="(i, iIndex) in param.index">
                    <ElFormItem label-width="0" class="mr10" :rules="vali(true, '')">
                      <!-- 注册天数下拉框 -->
                      <el-select
                        @visible-change="handleAccountVisibleChange($event, param.index)"
                        v-model="param.index[iIndex]"
                        style="width:100%"
                      >
                        <el-option
                          v-for="i in AccountHabitConstTaskTypeParamList"
                          :disabled="i.disabled"
                          :key="i.value"
                          :label="i.label"
                          :value="i.value"
                        ></el-option>
                      </el-select>
                    </ElFormItem>
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`accountConstParamList.${paramIndex}.constraitParam.${getSymbol(param.index[iIndex])}`"
                      :rules="vali(true, '')"
                    >
                      <el-select
                        :disabled="param.index[iIndex] == null"
                        v-model="param.constraitParam[getSymbol(param.index[iIndex])]"
                        style="width:100%"
                      >
                        <el-option v-for="i in orderSymbolList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                      </el-select>
                    </ElFormItem>
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`accountConstParamList.${paramIndex}.constraitParam.${getParamVal(param.index[iIndex])}`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber
                        :min="1"
                        controls-position="right"
                        :max="99999999999"
                        :disabled="param.index[iIndex] == null"
                        v-model="param.constraitParam[getParamVal(param.index[iIndex])]"
                      ></ElInputNumber>
                    </ElFormItem>
                    <div class="flex-c" style="margin-bottom: 18px;">
                      <ElButton
                        type="text"
                        icon="el-icon-plus"
                        style="margin:0;padding: 4px"
                        @click="handleAccountTypeParam(param, iIndex, data.accountConstParamList,param.index[iIndex], true)"
                      ></ElButton>
                      <ElButton
                        type="text"
                        icon="el-icon-minus"
                        :style="{margin: 0, padding: 4, visibility: param.index.length <= 1 ? 'hidden' : 'initial'}"
                        @click="handleAccountTypeParam(param, iIndex, data.accountConstParamList, param.index[iIndex])"
                      ></ElButton>
                    </div>
                  </div>
                </div>
                <div class="flex-c mr10 br pt10">
                  <ElFormItem
                    label-width="160px"
                    label="账号可操作类目数"
                    :prop="`accountConstParamList.${paramIndex}.categoryCount`"
                    :rules="vali(true, '')"
                  >
                    <ElInputNumber :min="1" controls-position="right" :max="cateMaxNum" v-model="param.categoryCount"></ElInputNumber>
                  </ElFormItem>
                </div>
                <div class="flex-c">
                  <ElButton
                    type="text"
                    icon="el-icon-plus"
                    style="margin:0;padding: 4px"
                    @click="handleTaskTypeArr(param, paramIndex, data.accountConstParamList, true)"
                  ></ElButton>
                  <ElButton
                    type="text"
                    icon="el-icon-minus"
                    style="margin:0;padding: 4px"
                    :style="{visibility: data.accountConstParamList.length <= 1 ? 'hidden' : 'initial'}"
                    @click="handleTaskTypeArr(param, paramIndex,data.accountConstParamList)"
                  ></ElButton>
                </div>
              </div>
            </template>
          </div>
        </ElForm>
      </el-tab-pane>
      <el-tab-pane label="任务类型约束" name="fourth" lazy>
        <ElForm ref="form2" :model="data" label-width="65px" size="small">
          <div class="title flex-c">
            任务类型约束
            <el-button type="primary" size="small" @click="save(2)" plain>保存</el-button>
          </div>
          <div class="params">
            <div class="flex">
              <ElFormItem
                label-width="130px"
                class="constraintCycle"
                :prop="`constraintCycle`"
                :rules="vali(true, '约束时间周期')"
              >
                <template slot="label">
                  <div class="flex-c">
                    <span>约束时间周期</span>
                    <ElTooltip content="仅适用于“任务类型约束”的最小执行次数和最大执行次数。" placement="top">
                      <el-button style="margin-left:5px" type="text" icon="el-icon-info"></el-button>
                    </ElTooltip>
                  </div>
                </template>
                <el-select v-model="data.constraintCycle" style="width:100%">
                  <el-option v-for="i in constraintCycleList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                </el-select>
              </ElFormItem>
            </div>
            <template v-if="data.taskTypeConstList.length">
              <div v-for="(item, index) in data.taskTypeConstList" class="params-row">
                <div class="flex">
                  <ElFormItem
                    label-width="0"
                    :prop="`taskTypeConstList.${index}.taskTypeId`"
                    class="mr10"
                    :rules="vali(true, '动作')"
                  >
                    <el-select v-model="item.taskTypeId" style="width:100%">
                      <el-option v-for="i in taskTypeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                    </el-select>
                  </ElFormItem>
                  <div class="flex-c" style="margin-bottom: 18px;">
                    <ElButton
                      type="text"
                      icon="el-icon-plus"
                      style="margin:0;padding: 4px"
                      @click="handlePrmsAdd(item, index)"
                    ></ElButton>
                    <ElButton
                      type="text"
                      icon="el-icon-minus"
                      style="margin:0;padding: 4px"
                      v-if="data.taskTypeConstList.length > 1"
                      @click="handlePrmsMinus(item, index)"
                    ></ElButton>
                  </div>
                </div>
                <div class="flex mb20" v-for="(param, paramIndex) in item.taskTypeConstParamArray">
                  <!-- 注册天数等 -->
                  <div class="flex-r mr10 br pt10">
                    <div class="flex-c" v-for="(i, iIndex) in param.index">
                      <ElFormItem
                        label-width="0"
                        :prop="`taskTypeConstList.${index}.taskTypeConstParamArray.${paramIndex}.index.${iIndex}`"
                        class="mr10"
                        :rules="vali(true, '')"
                      >
                        <!-- 注册天数下拉框 -->
                        <el-select
                          @visible-change="handleVisibleChange($event, param.index)"
                          v-model="param.index[iIndex]"
                          style="width:100%"
                        >
                          <el-option
                            v-for="i in habitConstTaskTypeParamList"
                            :disabled="i.disabled"
                            :key="i.value"
                            :label="i.label"
                            :value="i.value"
                          ></el-option>
                        </el-select>
                      </ElFormItem>
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskTypeConstList.${index}.taskTypeConstParamArray.${paramIndex}.constraitParam.${getSymbol(param.index[iIndex])}`"
                        :rules="vali(true, '')"
                      >
                        <el-select
                          :disabled="param.index[iIndex] == null"
                          v-model="param.constraitParam[getSymbol(param.index[iIndex])]"
                          style="width:100%"
                        >
                          <el-option v-for="i in orderSymbolList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                        </el-select>
                      </ElFormItem>
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskTypeConstList.${index}.taskTypeConstParamArray.${paramIndex}.constraitParam.${getParamVal(param.index[iIndex])}`"
                        :rules="vali(true, '')"
                      >
                        <ElInputNumber
                          :min="1"
                          controls-position="right"
                          :max="99999999999"
                          :disabled="param.index[iIndex] == null"
                          v-model="param.constraitParam[getParamVal(param.index[iIndex])]"
                        ></ElInputNumber>
                      </ElFormItem>
                      <div class="flex-c" style="margin-bottom: 18px;">
                        <ElButton
                          type="text"
                          icon="el-icon-plus"
                          style="margin:0;padding: 4px"
                          @click="handleTypeParam(param, iIndex, item.taskTypeConstParamArray,param.index[iIndex], true)"
                        ></ElButton>
                        <ElButton
                          type="text"
                          icon="el-icon-minus"
                          :style="{margin: 0, padding: 4, visibility: param.index.length <= 1 ? 'hidden' : 'initial'}"
                          @click="handleTypeParam(param, iIndex, item.taskTypeConstParamArray, param.index[iIndex])"
                        ></ElButton>
                      </div>
                    </div>
                  </div>
                  <div class="flex-c mr10 br pt10">
                    <ElFormItem
                      label-width="120px"
                      label="最小执行次数"
                      :prop="`taskTypeConstList.${index}.taskTypeConstParamArray.${paramIndex}.minTimes`"
                      :rules="vali(true, '最小执行次数')"
                    >
                      <ElInputNumber :min="0" controls-position="right" :max="99999999999" v-model="param.minTimes"></ElInputNumber>
                    </ElFormItem>
                    <ElFormItem
                      label-width="120px"
                      label="最大执行次数"
                      :prop="`taskTypeConstList.${index}.taskTypeConstParamArray.${paramIndex}.maxTimes`"
                      :rules="vali(true, '最大执行次数')"
                    >
                      <ElInputNumber
                        :min="param.minTimes ? param.minTimes : 1"
                        controls-position="right"
                        :max="99999999999"
                        v-model="param.maxTimes"
                      ></ElInputNumber>
                    </ElFormItem>
                  </div>
                  <div class="flex-c">
                    <ElButton
                      type="text"
                      icon="el-icon-plus"
                      style="margin:0;padding: 4px"
                      @click="handleTaskTypeArr(param, paramIndex, item.taskTypeConstParamArray, true)"
                    ></ElButton>
                    <ElButton
                      type="text"
                      icon="el-icon-minus"
                      style="margin:0;padding: 4px"
                      :style="{visibility: item.taskTypeConstParamArray.length <= 1 ? 'hidden' : 'initial'}"
                      @click="handleTaskTypeArr(param, paramIndex,item.taskTypeConstParamArray)"
                    ></ElButton>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </ElForm>
      </el-tab-pane>
      <el-tab-pane label="评价约束" name="five" lazy>
        <ElForm ref="form4" :model="data" label-width="65px" size="small">
          <div class="title flex-c">
            评价约束
            <el-button type="primary" size="small" @click="save(4)" plain>保存</el-button>
          </div>
          <div class="params">
            <h5>数量约束</h5>
            <template v-if="data.taskConstReviewList.length">
              <div class="flex mb20" v-for="(param, paramIndex) in data.taskConstReviewList" :key="paramIndex">
                <div class="flex-r mr10 br pt10">
                  <div class="flex-c">
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :rules="vali(true, '')"
                      :prop="`taskConstReviewList.${paramIndex}.condition`"
                    >
                      <el-select v-model="param.condition" style="width:100%">
                        <el-option v-for="i in timeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                      </el-select>
                    </ElFormItem>
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstReviewList.${paramIndex}.min`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber
                        :max="paramIndex == data.taskConstReviewList.length - 1 ? 100000: 99999"
                        :disabled="true"
                        :min="1"
                        controls-position="right"
                        v-model="param.min"
                      ></ElInputNumber>
                    </ElFormItem>

                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstReviewList.${paramIndex}.max`"
                      :rules="getMaxRule(param, paramIndex, data.taskConstReviewList)"
                    >
                      <span class="mr10">~</span>
                      <span
                        style="width: 130px;display:inline-block"
                        v-if="paramIndex == data.taskConstReviewList.length - 1"
                      >∞</span>
                      <ElInputNumber
                        v-show="paramIndex !== data.taskConstReviewList.length - 1"
                        :max="paramIndex == data.taskConstReviewList.length - 1 ? 100002: 99999"
                        :min="param.min || 0"
                        :disabled="paramIndex === data.taskConstReviewList.length - 1"
                        controls-position="right"
                        @change="lastItemChange(param, paramIndex, data.taskConstReviewList, $event, 'min')"
                        v-model="param.max"
                      ></ElInputNumber>
                    </ElFormItem>
                  </div>
                </div>
                <div class="flex-c mr10 br pt10">
                  <ElFormItem
                    label-width="160px"
                    label="允许评价次数百分比"
                    :prop="`taskConstReviewList.${paramIndex}.percentage`"
                    :rules="vali(true, '')"
                  >
                    <ElInputNumber
                      :min="1"
                      :max="100"
                      :precision="0"
                      controls-position="right"
                      v-model="param.percentage"
                    ></ElInputNumber>
                  </ElFormItem>
                </div>
                <div class="flex-c">
                  <ElButton
                    type="text"
                    icon="el-icon-plus"
                    style="margin:0;padding: 4px"
                    @click="handleReviewArr(param, paramIndex, data.taskConstReviewList, true)"
                  ></ElButton>
                  <ElButton
                    type="text"
                    icon="el-icon-minus"
                    style="margin:0;padding: 4px"
                    v-if="paramIndex !== 0"
                    :style="{visibility: data.taskConstReviewList.length <= 1 ? 'hidden' : 'initial'}"
                    @click="handleReviewArr(param, paramIndex,data.taskConstReviewList)"
                  ></ElButton>
                </div>
              </div>
            </template>
          </div>
          <div class="hr"></div>
          <div class="params">
            <h5>好评率约束</h5>
            <template v-if="data.taskConstReviewList1.length">
              <div class="flex mb20" v-for="(param, paramIndex) in data.taskConstReviewList1" :key="paramIndex">
                <div class="flex-r mr10 br pt10">
                  <div class="flex-c">
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :rules="vali(true, '')"
                      :prop="`taskConstReviewList1.${paramIndex}.condition`"
                    >
                      <el-select v-model="param.condition" style="width:100%">
                        <el-option v-for="i in timeList1" :key="i.value" :label="i.label" :value="i.value"></el-option>
                      </el-select>
                    </ElFormItem>
                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstReviewList1.${paramIndex}.min`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber
                        :max="paramIndex == data.taskConstReviewList1.length - 1 ? 100000: 99999"
                        :disabled="true"
                        :min="1"
                        controls-position="right"
                        v-model="param.min"
                      ></ElInputNumber>
                    </ElFormItem>

                    <ElFormItem
                      label-width="0"
                      class="mr10"
                      :prop="`taskConstReviewList1.${paramIndex}.max`"
                      :rules="getMaxRule(param, paramIndex, data.taskConstReviewList1)"
                    >
                      <span class="mr10">~</span>
                      <span
                        style="width: 130px;display:inline-block"
                        v-if="paramIndex == data.taskConstReviewList1.length - 1"
                      >∞</span>
                      <ElInputNumber
                        v-show="paramIndex !== data.taskConstReviewList1.length - 1"
                        :max="paramIndex == data.taskConstReviewList1.length - 1 ? 100002: 99999"
                        :min="param.min || 0"
                        :disabled="paramIndex === data.taskConstReviewList1.length - 1"
                        controls-position="right"
                        @change="lastItemChange(param, paramIndex, data.taskConstReviewList1, $event, 'min')"
                        v-model="param.max"
                      ></ElInputNumber>
                    </ElFormItem>
                  </div>
                </div>
                <div class="flex-c mr10 br pt10">
                  <ElFormItem
                    label-width="160px"
                    label="最高好评率"
                    :prop="`taskConstReviewList1.${paramIndex}.percentage`"
                    :rules="vali(true, '')"
                  >
                    <ElInputNumber
                      :min="1"
                      :max="100"
                      :precision="0"
                      controls-position="right"
                      v-model="param.percentage"
                    ></ElInputNumber>
                  </ElFormItem>
                </div>
                <div class="flex-c">
                  <ElButton
                    type="text"
                    icon="el-icon-plus"
                    style="margin:0;padding: 4px"
                    @click="handleReviewArr(param, paramIndex, data.taskConstReviewList1, true, 1)"
                  ></ElButton>
                  <ElButton
                    type="text"
                    v-if="paramIndex !== 0"
                    icon="el-icon-minus"
                    style="margin:0;padding: 4px"
                    :style="{visibility: data.taskConstReviewList1.length <= 1 ? 'hidden' : 'initial'}"
                    @click="handleReviewArr(param, paramIndex,data.taskConstReviewList1)"
                  ></ElButton>
                </div>
              </div>
            </template>
          </div>
        </ElForm>
      </el-tab-pane>
      <el-tab-pane label="产品防关联约束" name="six" lazy>
        <ElForm ref="form5" :model="data" label-width="65px" size="small">
          <div class="title flex-c">
            产品防关联约束
            <el-button type="primary" size="small" @click="save(5)" plain>保存</el-button>
          </div>
          <div class="params">
            <template v-if="data.taskConstProdAvoidRelList.length">
              <div v-for="(param, paramIndex) in data.taskConstProdAvoidRelList" :key="paramIndex">
                <div class="flex-c">
                  <ElFormItem
                    label="约束时间周期"
                    class="mr10"
                    label-width="120px"
                    :rules="vali(true, '')"
                    :prop="`taskConstProdAvoidRelList.${paramIndex}.cycle`"
                  >
                    <span slot="label">
                      约束时间周期
                      <!-- <ElTooltip content="仅适用于“任务类型约束”的最小执行次数和最大执行次数" placement="top">
                    <i class="el-icon-info"></i>
                      </ElTooltip>-->
                    </span>
                    <el-select v-model="param.cycle" style="width:100%">
                      <el-option v-for="i in timeCycleList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                    </el-select>
                  </ElFormItem>
                </div>
                <h5>相同产品约束</h5>
                <div class="flex mb10" v-for="(item, index) in param.samePro">
                  <div class="flex-r mr10 br pt10">
                    <div class="flex-c">
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :rules="vali(true, '')"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.samePro.${index}.condition`"
                      >
                        <el-select v-model="item.condition" style="width:100%">
                          <el-option v-for="i in timeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                        </el-select>
                      </ElFormItem>
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.samePro.${index}.min`"
                        :rules="vali(true, '')"
                      >
                        <ElInputNumber
                          :max="index == param.samePro.length - 1 ? 100000: 99999"
                          :min="0"
                          :disabled="true"
                          controls-position="right"
                          v-model="item.min"
                        ></ElInputNumber>
                      </ElFormItem>

                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.samePro.${index}.max`"
                        :rules="getMaxRule(item, index, param.samePro)"
                      >
                        <span class="mr10">~</span>
                        <span style="width: 130px;display:inline-block" v-if="index == param.samePro.length - 1">∞</span>
                        <ElInputNumber
                          :max="index == param.samePro.length - 1 ? 100002: 99999"
                          v-show="index !== param.samePro.length - 1"
                          :disabled="index === param.samePro.length - 1"
                          :min="item.min || 0"
                          controls-position="right"
                          v-model="item.max"
                          @change="lastItemChange(item, index, param.samePro, $event, 'min')"
                        ></ElInputNumber>
                      </ElFormItem>
                    </div>
                  </div>
                  <div class="flex-c mr10 pt10 br">
                    <ElFormItem
                      label-width="200px"
                      label="相同产品允许购买次数"
                      :prop="`taskConstProdAvoidRelList.${paramIndex}.samePro.${index}.times`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber :min="0" controls-position="right" v-model="item.times"></ElInputNumber>
                    </ElFormItem>
                  </div>
                  <div class="flex-c">
                    <ElButton
                      type="text"
                      icon="el-icon-plus"
                      style="margin:0;padding: 4px"
                      @click="handleSameProArr(item, index, param.samePro, true)"
                    ></ElButton>
                    <ElButton
                      v-if="index !== 0"
                      type="text"
                      icon="el-icon-minus"
                      style="margin:0;padding: 4px"
                      :style="{visibility: param.samePro.length <= 1 ? 'hidden' : 'initial'}"
                      @click="handleSameProArr(item, index,param.samePro)"
                    ></ElButton>
                  </div>
                </div>
                <div class="hr"></div>
                <h5>相同店铺约束</h5>
                <div class="flex mb10" v-for="(item, index) in param.sameSto">
                  <div class="flex-r mr10 br pt10">
                    <div class="flex-c">
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :rules="vali(true, '')"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.sameSto.${index}.condition`"
                      >
                        <el-select v-model="item.condition" style="width:100%">
                          <el-option v-for="i in timeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                        </el-select>
                      </ElFormItem>
                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.sameSto.${index}.min`"
                        :rules="vali(true, '')"
                      >
                        <ElInputNumber
                          :max="index == param.sameSto.length - 1 ? 100000: 99999"
                          :disabled="true"
                          :min="0"
                          controls-position="right"
                          v-model="item.min"
                        ></ElInputNumber>
                      </ElFormItem>

                      <ElFormItem
                        label-width="0"
                        class="mr10"
                        :prop="`taskConstProdAvoidRelList.${paramIndex}.sameSto.${index}.max`"
                        :rules="getMaxRule(item, index, param.sameSto)"
                      >
                        <span class="mr10">~</span>
                        <span style="width: 130px;display:inline-block" v-if="index == param.sameSto.length - 1">∞</span>
                        <ElInputNumber
                          :max="index == param.sameSto.length - 1 ? 100002: 99999"
                          v-show="index !== param.sameSto.length - 1"
                          :disabled="index === param.sameSto.length - 1"
                          :min="item.min || 0"
                          controls-position="right"
                          v-model="item.max"
                          @change="lastItemChange(item, index, param.sameSto, $event, 'min')"
                        ></ElInputNumber>
                      </ElFormItem>
                    </div>
                  </div>
                  <div class="flex-c mr10 pt10 br">
                    <ElFormItem
                      label-width="200px"
                      label="不同产品允许购买次数"
                      :prop="`taskConstProdAvoidRelList.${paramIndex}.sameSto.${index}.times`"
                      :rules="vali(true, '')"
                    >
                      <ElInputNumber :min="0" controls-position="right" v-model="item.times"></ElInputNumber>
                    </ElFormItem>
                  </div>
                  <div class="flex-c">
                    <ElButton
                      type="text"
                      icon="el-icon-plus"
                      style="margin:0;padding: 4px"
                      @click="handleSameProArr(item, index, param.sameSto, true)"
                    ></ElButton>
                    <ElButton
                      v-if="index !== 0"
                      type="text"
                      icon="el-icon-minus"
                      style="margin:0;padding: 4px"
                      :style="{visibility: param.sameSto.length <= 1 ? 'hidden' : 'initial'}"
                      @click="handleSameProArr(item, index,param.sameSto)"
                    ></ElButton>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </ElForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import vali from 'Utils/validator'
export default {
  props: ['activePlat'],
  data() {
    return {
      activeName: 'first',
      timeList: [
        {
          label: '总订单数',
          value: 0
        }
      ],
      timeList1: [
        {
          label: '总评价数',
          value: 1
        }
      ],
      timeCycleList: [
        {
          label: '月',
          value: 0
        }
      ],
      cateMaxNum: 999999,
      constraintCycleList: [
        // {
        //   label: '周',
        //   value: 1
        // },
        {
          label: '月',
          value: 2
        }
      ],
      orderSymbolList: [
        {
          label: '<=',
          value: 0
        },
        {
          label: '<',
          value: 1
        },
        {
          label: '>=',
          value: 2
        },
        {
          label: '>',
          value: 3
        }
      ],
      habitConstTaskTypeParamList: [
        {
          label: '注册天数',
          value: 0,
          disabled: false
        },
        {
          label: '下单次数',
          value: 1,
          disabled: false
        },
        {
          label: '评价次数',
          value: 2,
          disabled: false
        }
      ],
      AccountHabitConstTaskTypeParamList: [
        {
          label: '注册天数',
          value: 0,
          disabled: false
        },
        {
          label: '下单次数',
          value: 1,
          disabled: false
        },
        {
          label: '评价次数',
          value: 2,
          disabled: false
        }
      ],
      data: {
        taskConstProdAvoidRelList: [
          {
            cycle: null,
            samePro: [],
            sameSto: []
          }
        ],
        taskConstReviewList: [
          {
            condition: null,
            min: 1,
            max: 100000,
            percentage: undefined
          }
        ],
        taskConstReviewList1: [
          {
            condition: null,
            min: 1,
            max: 100000,
            percentage: undefined
          }
        ],
        taskConstBuyTimeList: [
          {
            condition: null,
            min: 1,
            max: undefined,
            intervalDay: undefined
          }
        ],
        constraintCycle: null,
        systemSettingListSafetyConst: [],
        accountConstParamList: [
          {
            constraitParam: {
              registerDay: undefined,
              registerDaySymbol: null,
              orderSymbol: null,
              orderNumber: undefined,
              reviewSymbol: null,
              reviewNumber: undefined
            },
            index: [null],
            categoryCount: undefined
          }
        ],
        taskTypeConstList: [
          {
            taskTypeId: null,
            taskTypeConstParamArray: [
              {
                constraitParam: {
                  registerDay: undefined,
                  registerDaySymbol: null,
                  orderSymbol: null,
                  orderNumber: undefined,
                  reviewSymbol: null,
                  reviewNumber: undefined
                },
                index: [null],
                minTimes: undefined,
                maxTimes: undefined
              }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.init()
    this.getData('systemSettingListSafetyConst')
    this.getData('accountConstParamList')
    this.getData('taskTypeConstList')
    this.getData('taskConstBuyTimeList')
    this.getData('taskConstReviewList')
    this.getData('taskConstProdAvoidRelList')
  },
  computed: {
    ...mapState(['taskTypeList'])
  },
  methods: {
    ...mapActions(['getTaskTypeList']),
    getMaxRule(item, index, arr) {
      const validator = (rule, value, cb) => {
        if (item.min > value) {
          cb(new Error('不能小于最小值'))
        }
        if (value == null) {
          cb(new Error('不能为空'))
        }
        cb()
      }
      return [
        {
          validator
        }
      ]
    },
    lastItemChange(item, index, arr, val, key) {
      if (arr[index + 1]) {
        arr[index + 1][key] = val + 1
      }
    },
    init() {
      this.getTaskTypeList()
      this.getCateMaxNum()
    },
    getCateMaxNum() {
      this.$api[`main/accountConstParamMaxCategoryCount`]({
        platformCode: this.activePlat
      })
        .then(data => {
          this.cateMaxNum = data.rows.count
        })
        .catch(err => {})
    },
    getData(name) {
      this.$api[`main/${name}`]({ platformCode: this.activePlat })
        .then(data => {
          if (name === 'accountConstParamList') {
            data = data.rows
            if (!data.length) {
              return
            }
            data.forEach(el => {
              if (el.constraitParam) {
                let obj = new Function('return ' + el.constraitParam + ';')()
                el.constraitParam = obj
                this.setIndex(el, obj)
              } else {
                this.setIndex(el, {}, true)
              }
            })
          }
          if (
            name === 'taskConstBuyTimeList' ||
            name === 'taskConstReviewList'
          ) {
            if (name === 'taskConstReviewList') {
              let review1 = data.rows.filter(el => el.condition == 0)
              let review2 = data.rows.filter(el => el.condition == 1)
              if (review1.length) {
                this.data[name] = this.setLast99(review1)
              }
              if (review2.length) {
                this.data[name + '1'] = this.setLast99(review2)
              }
              return
            } else {
              data = this.setLast99(data.rows)
            }
          }
          if (name === 'taskConstProdAvoidRelList') {
            // 防关联数据
            let taskConstProdAvoidRelList = []
            let e = { samePro: [], sameSto: [] }
            taskConstProdAvoidRelList.push(e)
            data.rows.forEach(el => {
              e.cycle = el.cycle
              let item = {
                min: el.min,
                max: el.max,
                times: el.times,
                condition: el.condition
              }
              if (!el.type) {
                e.samePro.push(item)
              } else {
                e.sameSto.push(item)
              }
            })
            e.samePro = this.setLast99(e.samePro)
            e.sameSto = this.setLast99(e.sameSto)
            data = taskConstProdAvoidRelList
          }
          if (name === 'taskTypeConstList') {
            data = data.rows
            this.data.constraintCycle = data[0].constraintCycle
            data.forEach(el => {
              if (el.taskTypeConstParamArray) {
                el.taskTypeConstParamArray.forEach(_el => {
                  if (_el.constraitParam) {
                    let obj = new Function(
                      'return ' + _el.constraitParam + ';'
                    )()
                    _el.constraitParam = obj
                    this.setIndex(_el, obj)
                  } else {
                    this.setIndex(_el, {}, true)
                  }
                })
              }
            })
          }
          if (name === 'systemSettingListSafetyConst') {
            this.data[name] = data.rows
          } else {
            this.data[name] = data
          }
        })
        .catch(err => {})
    },
    setIndex(el, obj, setNull) {
      el.index = []
      if (!setNull) {
        if (obj.registerDaySymbol != null) {
          el.index.push(0)
        }
        if (obj.orderSymbol != null) {
          el.index.push(1)
        }
        if (obj.reviewSymbol != null) {
          el.index.push(2)
        }
      } else {
        el.index = [null]
        obj.registerDaySymbol = null
        obj.orderSymbol = null
        obj.reviewSymbol = null
      }
    },
    handleTaskTypeArr(param, index, arr, add) {
      if (add) {
        arr.splice(index + 1, 0, {
          constraitParam: {
            registerDay: undefined,
            registerDaySymbol: null,
            orderSymbol: null,
            orderNumber: undefined,
            reviewSymbol: null,
            reviewNumber: undefined
          },
          index: [null],
          minTimes: undefined,
          maxTimes: undefined
        })
      } else {
        arr.splice(index, 1)
      }
    },
    handleTimeArr(param, index, arr, add) {
      if (add) {
        let item = {
          condition: 0,
          min: arr[index].max >= 99999 ? undefined : param.max + 1,
          max: undefined,
          intervalDay: undefined
        }
        arr.splice(index + 1, 0, item)
        if (arr[index].max >= 99999) {
          arr[index].max = undefined
        }
      } else {
        if (index !== 0 && index !== arr.length - 1) {
          arr[index + 1].min = arr[index - 1].max + 1
        }
        if (index === arr.length - 1) {
          arr[index - 1].max = 100000
        }
        arr.splice(index, 1)
      }
      arr[arr.length - 1].max = 100000
    },
    handleReviewArr(param, index, arr, add, num = 0) {
      if (add) {
        let item = {
          condition: num,
          min: arr[index].max >= 99999 ? undefined : param.max + 1,
          max: undefined,
          percentage: undefined
        }
        arr.splice(index + 1, 0, item)
        if (arr[index].max >= 99999) {
          arr[index].max = undefined
        }
      } else {
        if (index !== 0 && index !== arr.length - 1) {
          arr[index + 1].min = arr[index - 1].max + 1
        }
        if (index === arr.length - 1) {
          arr[index - 1].max = 100000
        }
        arr.splice(index, 1)
      }
      arr[arr.length - 1].max = 100000
    },
    handleSameProArr(param, index, arr, add) {
      if (add) {
        let item = {
          condition: 0,
          min: arr[index].max >= 99999 ? undefined : param.max + 1,
          max: undefined,
          times: undefined
        }
        arr.splice(index + 1, 0, item)
        if (arr[index].max >= 99999) {
          arr[index].max = undefined
        }
      } else {
        if (index !== 0 && index !== arr.length - 1) {
          arr[index + 1].min = arr[index - 1].max + 1
        }
        if (index === arr.length - 1) {
          arr[index - 1].max = 100000
        }
        arr.splice(index, 1)
      }
      arr[arr.length - 1].max = 100000
    },
    // handlesameStoArr(param, index, arr, add) {
    //   if (add) {
    //     arr.splice(index + 1, 0, {
    //       condition: 0,
    //       min: param.max + 1,
    //       max: undefined,
    //       times: undefined
    //     })
    //   } else {
    //     if (index !== 0 && index !== arr.length - 1) {
    //       arr[index + 1].min = arr[index - 1].max + 1
    //     }
    //     arr.splice(index, 1)
    //   }
    // },
    handleAccountTypeParam(param, index, arr, i, add) {
      let len = this.AccountHabitConstTaskTypeParamList.length
      if (add) {
        if (param.index.length >= len) {
          this.$message.warning(`最多只能增加${len}个`)
          return
        } else {
          param.index.splice(index + 1, 0, null)
        }
      } else {
        param.index.splice(index, 1)
        switch (i) {
          case 0:
            delete param.constraitParam.registerDay
            delete param.constraitParam.registerDaySymbol
            break
          case 1:
            delete param.constraitParam.orderSymbol
            delete param.constraitParam.orderNumber
            break

          case 2:
            delete param.constraitParam.reviewSymbol
            delete param.constraitParam.reviewNumber
            break

          default:
            break
        }
      }
    },
    // 增删注册天数 对应 2
    handleTypeParam(param, index, arr, i, add) {
      let len = this.habitConstTaskTypeParamList.length
      if (add) {
        if (param.index.length >= len) {
          this.$message.warning(`最多只能增加${len}个`)
          return
        } else {
          param.index.splice(index + 1, 0, null)
        }
      } else {
        param.index.splice(index, 1)
        switch (i) {
          case 0:
            delete param.constraitParam.registerDay
            delete param.constraitParam.registerDaySymbol
            break
          case 1:
            delete param.constraitParam.orderSymbol
            delete param.constraitParam.orderNumber
            break

          case 2:
            delete param.constraitParam.reviewSymbol
            delete param.constraitParam.reviewNumber
            break

          default:
            break
        }
      }
    },
    handleAccountVisibleChange(val, arr) {
      if (val) {
        this.AccountHabitConstTaskTypeParamList.forEach(el => {
          if (arr.indexOf(el.value) > -1) {
            el.disabled = true
          } else {
            el.disabled = false
          }
        })
      }
    },
    handleVisibleChange(val, arr) {
      if (val) {
        this.habitConstTaskTypeParamList.forEach(el => {
          if (arr.indexOf(el.value) > -1) {
            el.disabled = true
          } else {
            el.disabled = false
          }
        })
      }
    },
    handleAcpAdd() {
      this.data.taskTypeConstList.push({
        taskTypeId: null,
        habitConstTaskTypeParamArray: [
          {
            constraitParam: {
              registerDay: undefined,
              registerDaySymbol: null,
              orderSymbol: null,
              orderNumber: undefined,
              reviewSymbol: null,
              reviewNumber: undefined
            },
            index: [null],
            minTimes: undefined,
            maxTimes: undefined
          }
        ]
      })
    },
    handlePrmsAdd(item, index) {
      this.data.taskTypeConstList.splice(index + 1, 0, {
        taskTypeId: null,
        taskTypeConstParamArray: [
          {
            constraitParam: {
              registerDay: undefined,
              registerDaySymbol: null,
              orderSymbol: null,
              orderNumber: undefined,
              reviewSymbol: null,
              reviewNumber: undefined
            },
            index: [null],
            minTimes: undefined,
            maxTimes: undefined
          }
        ]
      })
    },
    handlePrmsMinus(item, index) {
      this.data.taskTypeConstList.splice(index, 1)
    },
    vali(type, str) {
      return vali(type, str)
    },
    getSymbol(i) {
      return i === 0
        ? 'registerDaySymbol'
        : i === 1
        ? 'orderSymbol'
        : 'reviewSymbol'
    },
    getParamVal(i) {
      return i === 0 ? 'registerDay' : i === 1 ? 'orderNumber' : 'reviewNumber'
    },
    addPlatCode(params) {
      return params.map(el => ({
        ...el,
        platformCode: this.activePlat
      }))
    },
    save(type) {
      let api,
        params = {
          platformCode: this.activePlat
        }
      switch (type) {
        case 0:
          api = 'systemSettingUpdateSafetyConst'
          params = this.data.systemSettingListSafetyConst
          break
        case 1:
          api = 'accountConstParamUpdate'
          params = JSON.parse(
            JSON.stringify(this.addPlatCode(this.data.accountConstParamList))
          )
          params.forEach(e => {
            if (e.constraitParam) {
              e.constraitParam = JSON.stringify(e.constraitParam, null, '')
              delete e.index
            }
          })
          break
        case 2:
          api = 'taskTypeConstUpdate'
          params = JSON.parse(
            JSON.stringify(this.addPlatCode(this.data.taskTypeConstList))
          )
          params.forEach(el => {
            el.constraintCycle = this.data.constraintCycle
            if (el.taskTypeConstParamArray) {
              el.taskTypeConstParamArray.forEach(e => {
                if (e.constraitParam) {
                  e.constraitParam = JSON.stringify(e.constraitParam, null, '')
                  delete e.index
                }
              })
            }
          })
          break
        case 3:
          // 购买时间间隔约束
          api = 'taskConstBuyTimeUpdate'
          params = this.setLastZero(
            this.addPlatCode(this.data.taskConstBuyTimeList)
          )
          break
        case 4:
          // 评价约束
          api = 'taskConstReviewUpdate'
          params = []
          params.push(
            ...this.setLastZero(this.data.taskConstReviewList).map(el => ({
              ...el,
              platformCode: this.activePlat,
              condition: 0
            }))
          )
          params.push(
            ...this.setLastZero(this.data.taskConstReviewList1).map(el => ({
              ...el,
              platformCode: this.activePlat,
              condition: 1
            }))
          )
          break
        case 5:
          // 防关联约束
          api = 'taskConstProdAvoidRelUpdate'
          // params = JSON.parse(JSON.stringify(this.data.taskConstProdAvoidRelList))
          params = []
          this.data.taskConstProdAvoidRelList.forEach(el => {
            el.samePro.forEach((e, index) => {
              params.push({
                ...e,
                type: 0,
                platformCode: this.activePlat,
                cycle: el.cycle,
                max: index === el.samePro.length - 1 ? undefined : e.max
              })
            })
            el.sameSto.forEach((e, index) => {
              params.push({
                ...e,
                type: 1,
                platformCode: this.activePlat,
                cycle: el.cycle,
                max: index === el.sameSto.length - 1 ? undefined : e.max
              })
            })
          })
          break

        default:
          break
      }
      this.$refs[`form${type}`].validate(valid => {
        if (valid) {
          this.$api[`main/${api}`](params)
            .then(data => {})
            .catch(err => {})
        }
      })
      // this.$api[`main/${api}`](params)
      //   .then(data => {})
      //   .catch(err => {})
    },
    setLastZero(arr) {
      return arr.map((el, index) => {
        if (index === arr.length - 1) {
          return { ...el, max: null }
        } else {
          return el
        }
      })
    },
    setLast99(arr) {
      return arr.map((el, index) => {
        if (index === arr.length - 1) {
          return {
            ...el,
            max: 100000
          }
        } else {
          return el
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hr {
  padding-bottom: 0;
}

form {
  border: 1px dotted #ddd;
  border-radius: 5px;
  padding: 0 16px;
  background: #f6f6f8;
  margin-bottom: 30px;
}
</style>
<style lang="scss">
.constraintCycle {
  .el-form-item__label {
    display: flex;
  }
}
</style>
