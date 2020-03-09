<template>
    <!-- 
    控件类型：
    Input(1,"输入框")
    ,SelectSingle(2,"单选框")
    ,SelectMultiple(3,"多选框")
    ,InputRows(4,"多行文本输入框")
    ,CheckBox(5,"单选项switch")
    ,Date(6, "日期")
    ,Richtext(7, "富文本")
    ,Cate(10,"产品类目")
    (100, 'wish运费设置')

    SelectSingleWrite(12,"可输入单选框") 
    SingleButton(13,"单选按钮radio") 
    Time(16,"时间") 
    MultipleCheckbox(17,"多选选框") 
    SelectMultipleWrite(18,"可输入多选框") wish

    --------------

    数据类型：
    Int(1,"Int")
    ,String(2,"String")
    ,Date(3,"Date")
    ,Boolean(4,"Boolean")
    ,Double(5, "Double")
    ,BigDecimal(6, "BigDecimal")
    ,Float(7,"Float")
    -->
    <!-- 普通输入 -->
    <el-input
        :disabled="disabled"
        :placeholder="item.placeholder"
        :maxlength="max || 2500"
        v-if="item.controlType === 1 && item.dataType === 2"
        style="width:100%;min-width:100px"
        :value="currentVal"
        clearable
        @focus="$emit('setSame')"
        @input="$emit('input', $event)"
        @clear="$emit('clear')"
    ></el-input>

    <!-- 数字(整形) -->
    <el-input-number
        :precision="0"
        @focus="$emit('setSame')"
        @clear="$emit('clear')"
        style="width:100%"
        v-else-if="item.controlType === 1 && item.dataType === 1"
        :value="currentVal"
        @change="$emit('input', $event)"
        controls-position="right"
        :min="min"
        :max="max"
        :disabled="disabled"
        :placeholder="`最大只能输入 ${max}`"
    ></el-input-number>

    <!-- 小数（货币） -->
    <div class="currency" v-else-if="(item.controlType === 1 || item.dataType === 5 || item.dataType === 7) && item.dataType !== 3">
        <el-input-number
            @focus="$emit('setSame')"
            @clear="$emit('clear')"
            style="width:100%"
            :value="currentVal"
            :precision="item.dataType === 7 ? 2 : (item.precision || 2)"
            @change="$emit('input', $event)"
            controls-position="right"
            :min="min"
            :max="max"
            :disabled="disabled"
            :placeholder="`最大只能输入 ${max}`"
        ></el-input-number>
        <span v-if="item.showMoney">$</span>
    </div>

    <!-- 选择select -->
    <el-select
        @focus="handleFocus"
        @visible-change="handleVisibleChange"
        :multiple-limit="item.selectKey === 'Tags-WISH' ? multipleLimit : 0"
        :reserve-keyword="true"
        :disabled="disabled"
        :multiple="item.multiple === false ? false : ((item.controlType === 3 || item.controlType === 18) ? true : false)"
        :filterable="item.controlType === 12 || item.controlType === 18"
        :allow-create="item.controlType === 12"
        style="width:100%;min-width:150px"
        v-else-if="item.controlType === 2 || item.controlType === 12 ||item.controlType === 3 || item.controlType === 18"
        :value="currentVal"
        :remote-method="handleRemoteMethod"
        :remote="item.controlType === 18"
        :loading="loading"
        :placeholder="selectPlaceholder"
        @change="$emit('input', $event)"
        @clear="$emit('clear')"
        :clearable="item.clearable===false?false:item.clearable===undefined ? true : true"
    >
        <el-option v-for="i in options" :key="i[labeVal]" :label="i[label]" :value="i[labeVal]"></el-option>
    </el-select>

    <!-- 多选checkbox -->
    <el-checkbox-group @focus="$emit('setSame')" v-model="checkBoxVal" :disabled="disabled" v-else-if="item.controlType === 17">
        <el-checkbox v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>

    <!-- 多行文本 -->
    <el-input
        @focus="$emit('setSame')"
        v-else-if="item.controlType === 4"
        @input="$emit('input', $event)"
        :value="currentVal"
        @clear="$emit('clear')"
        type="textarea"
        :maxlength="max"
        clearable
        :disabled="disabled"
        :rows="rows || item.rows || 2"
        :placeholder="item.placeholder"
    ></el-input>

    <!-- 单选radio -->
    <el-radio-group class="custom-radio-group" v-model="radioVal" :disabled="disabled" v-else-if="item.controlType === 13">
        <template v-if="options.length">
            <el-radio v-for="item in options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
        </template>
        <template v-else>
            <el-radio label="暂无数据" disabled></el-radio>
        </template>
    </el-radio-group>

    <!-- 日期 -->
    <el-date-picker
        @focus="$emit('setSame')"
        :disabled="disabled"
        :value-format="item.dataRanges"
        :type="item.dataRanges === 'yyyy-MM-dd hh:mm:ss' ? 'datetime' : 'date'"
        v-else-if="item.controlType === 6 || item.dataType === 3 || item.controlType === 16"
        :value="currentVal"
        :picker-options="getPickerOptions"
        :style="{width: item.width ? parseInt(item.width) + 'px' : '200px'}"
        @clear="$emit('clear')"
        @input="$emit('input', $event)"
    ></el-date-picker>

    <!-- 时间 -->
    <!-- <el-time-picker
    :disabled="disabled"
    :value-format="item.dataRanges"
    v-else-if="item.controlType === 16"
    :value="currentVal"
    :picker-options="getPickerOptions"
    :style="{width: item.width ? parseInt(item.width) + 'px' : '200px'}"
    @clear="$emit('clear')"
    @input="$emit('input', $event)"
    ></el-time-picker>-->

    <!-- 富文本 -->
    <UeEditor v-else-if="item.controlType === 7" @input="$emit('input', $event)" :value="currentVal" @clear="$emit('clear')" :disabled="disabled" :rows="item.rows || 2" :placeholder="item.placeholder" ref="editor"/>

    <!-- 树型展示 -->
    <el-cascader :disabled="disabled" v-else-if="item.controlType === 10" :options="options" :props="item.bind" :placeholder="item.placeholder" @clear="$emit('clear')" @change="$emit('setSame'), $emit('input', $event)" :value="currentVal"></el-cascader>

    <!-- switch -->
    <el-switch
        v-else-if="item.controlType === 5"
        :disabled="disabled"
        :active-value="switchVal[0] && switchVal[0].salePfPropItemId || 1"
        :inactive-value="switchVal[1] && switchVal[1].salePfPropItemId || 0"
        :active-text="switchVal[0] && switchVal[0].itemValue || '是'"
        :inactive-text="switchVal[1] && switchVal[1].itemValue || '否'"
        @change="$emit('setSame'), $emit('input', $event)"
        :value="currentVal"
    ></el-switch>

    <!-- 树型展示异步 -->
    <!-- <SyncCascader
    v-else-if="item.type === 'cascader' && typeof item.options === 'function'"
    :props="item.bind"
    :disabled="disabled"
    :last="item.last"
    :placeholder="item.placeholder"
    @clear="$emit('clear')"
    @change="$emit('input', $event)"
    @changeEl="$emit('changeEl', $event)"
    :value="currentVal"
    :itemDisabled="item.itemDisabled && item.itemDisabled(formData)"
    :get-el="item.getEl"
    :load="item.options"
    ></SyncCascader>-->
</template>

<script>
import UeEditor from './UeEditor';
import apis from 'apis';
import { fetchData, handlerCode, showToast, _storage } from 'common/common';
import { getQueryString } from 'common/util';

const cfun = {};
cfun._pickerFuture = {
    disabledDate(time) {
        return time.getTime() < Date.now() - 3600 * 24 * 1000;
    }
};
cfun._pickerBefore = {
    disabledDate(date) {
        return date.getTime() > Date.now();
    }
};
export default {
    name: 'FormInputs',
    components: {
        UeEditor
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    data() {
        let vm = this;
        return {
            pickerOptions: {
                disabledDate(time) {
                    if (vm.time) {
                        return (
                            time.getTime() + 24 * 3600 * 1000 <
                            new Date(vm.time).getTime()
                        );
                    } else {
                        return time.getTime() + 24 * 3600 * 1000 < Date.now();
                    }
                }
            },
            time: undefined,
            // 需要设置成美国时间的
            // USATime: ['sale_from_date', 'sale_end_date'],
            // multipleLimit: 10,
            loading: false,
            // options: [],
            checkBoxVal: [],
            optionsOrigin: [],
            switchVal: []
            // radioVal: undefined
        };
    },

    props: {
        rows: Number,
        // list: {
        //     default: () => () => Promise.resolve([])
        // },
        platformId: Number,
        siteId: Number,
        remoteMethod: {
            default: () => () => []
        },
        formData: {
            type: Object,
            default: () => {}
        },
        disabled: Boolean,
        placeholder: {
            type: String
        },
        item: {
            type: Object,
            default: () => {}
        },
        value: {
            default: null,
            required: true
        }
    },
    created() {
        let { type, controlType } = this.item;
        // checkbox时，监听checkbox的绑定值，并把值反馈回父组件
        if (type === 'checkbox') {
            this.$watch('checkBoxVal', val => {
                this.$emit('input', val);
            });
        }

        // 如果是类目模板管理，则需要自己获取选项值
        if (
            !this.item.selectDataList &&
            !this.item.itemProp &&
            this.item.catePltTempPropId != null
        ) {
            this.getSelectList();
        }

        // 如果是日期控件，需要获取美国时间
        if (
            this.item.controlType === 6 ||
            this.item.dataType === 3 ||
            this.item.controlType === 16
        ) {
            let siteTime = _storage._get('session', 'USATime');
            if (siteTime) {
                this.time = siteTime;
            } else {
                fetchData({
                    ...apis.CATEGORY_GET_NOW_SITE_TIME,
                    data: {
                        platformId:
                            +getQueryString('platformId') || this.platformId,
                        siteId: +getQueryString('siteId') || this.siteId,
                        dateFormat: 'yyyy-MM-dd hh:mm:ss'
                    }
                }).then(res => {
                    let { date, code, msg } = res.data;
                    if (code === 0) {
                        this.time = date;
                        _storage.set('session', 'USATime', date);
                    }
                });
            }
        }
    },

    methods: {
        getSelectList() {
            fetchData({
                ...apis.SALEPFPROPITEM_GETPROPITEM,
                data: {
                    propertyId: this.item.catePltTempPropId,
                    modelPropertyType: this.item.modelPropertyType
                }
            }).then(res => {
                // console.log(res)
                if (res.data.code !== 0) {
                    showToast('error', res.data.msg);
                }
                let list = res.data.data.map(el => ({
                    salePfPropItemId: el.id,
                    itemValue: el.name
                }));
                if (this.item.controlType === 5) {
                    this.switchVal = list;
                } else {
                    this.optionsOrigin = list;
                }

                if (
                    this.optionsOrigin.find(
                        el => el.salePfPropItemId == this.value
                    )
                ) {
                    this.$emit('input', this.value);
                } else {
                    this.$emit('input', null);
                }
            });
        },
        getOptions(val) {
            let options = val || this.optionsOrigin;
            return options.map(el => {
                let label = 'itemValue',
                    value;
                if (
                    this.item.controlType === 12 ||
                    this.item.controlType === 18
                ) {
                    value = 'itemValue';
                } else if (
                    this.item.controlType === 3 ||
                    this.item.controlType === 17
                ) {
                    value = 'salePfPropItemId';
                }
                return {
                    label: el[label],
                    value: el[value]
                };
            });
        },
        handleRemoteMethod(query) {
            let value = this.value || this.item.value;
            if (
                this.item.selectKey === 'Tags-WISH' &&
                this.multipleLimit <= value.length
            ) {
                showToast('warning', `只能存在${this.multipleLimit}个tags`);
                return;
            }
            if (this.item.controlType !== 18) {
                return;
            } else {
                this.loading = true;
                this.remoteMethod
                    ? this.remoteMethod(query, this.item).then(data => {
                        this.loading = false;
                        this.optionsOrigin = data;
                    })
                    : [];
            }
        },
        handleVisibleChange(show) {
            if (show && this.item.controlType === 18) {
                this.remoteMethod('', this.item).then(data => {
                    this.optionsOrigin = data;
                });
            }
        },
        handleFocus() {
            this.$emit('setSame');
        }
    },

    watch: {
        'item.selectDataList': {
            immediate: true,
            handler(val) {
                if (val) {
                    if (this.item.controlType === 5) {
                        this.switchVal = val;
                        this.$emit(
                            'input',
                            this.item.value || val[1].salePfPropItemId
                        );
                    }
                    this.optionsOrigin = val;
                }
            }
        },
        'item.itemProp': {
            immediate: true,
            handler(val) {
                if (val) {
                    this.optionsOrigin = val;
                }
            }
        },
        list: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.list().then(data => {
                        this.optionsOrigin = data;
                    });
                }
            }
        }
    },
    computed: {
        multipleLimit() {
            return this.item.dataSelectMaxValues
                ? this.item.dataSelectMaxValues
                : 10;
        },
        radioVal: {
            get() {
                return this.currentVal;
            },
            set(val) {
                this.$emit('setSame');
                this.$emit('input', val);
            }
        },
        getPickerOptions() {
            let pickerOptions = this.pickerOptions;
            if (this.item.pickerOptions) {
                pickerOptions = {
                    ...this.item.pickerOptions,
                    ...this.pickerOptions
                };
            }
            if (this.item.timeDisabled) {
                switch (this.item.timeDisabled) {
                    case 'before':
                        pickerOptions = cfun._pickerFuture;
                        break;
                    case 'after':
                        pickerOptions = cfun._pickerBefore;
                        break;

                    default:
                        break;
                }
            }
            return pickerOptions;
        },
        selectPlaceholder() {
            return this.item.placeholder ||
                (this.item.controlType === 18 || this.item.controlType === 12)
                ? '请输入或选择'
                : `请选择${this.item.label != null ? this.item.label : ''}`;
        },
        min() {
            return this.item.min || 0;
        },
        max() {
            let arr = [1, 2, 5, 6, 7];

            //   Int(1,"Int")
            // ,String(2,"String")
            // ,Date(3,"Date")
            // ,Boolean(4,"Boolean")
            // ,Double(5, "Double")
            // ,BigDecimal(6, "BigDecimal")
            // ,Float(7,"Float")
            if (arr.indexOf(this.item.dataType) > -1) {
                if (this.item.dataType === 2) {
                    return this.item.dataMaxLength;
                } else {
                    return Math.pow(10, this.item.dataMaxLength) - 1;
                }
            }
            return this.item.max || Infinity;
        },
        currentVal() {
            const isArray =
                (this.item.controlType === 3 ||
                    this.item.controlType === 18 ||
                    this.item.controlType === 17) &&
                this.item.multiple !== false;
            return this.value == null || this.value === ''
                ? isArray
                    ? []
                    : undefined
                : this.value;
        },
        label() {
            return (this.item.bind && this.item.bind.label) || 'label';
        },
        labeVal() {
            return (this.item.bind && this.item.bind.value) || 'value';
        },
        options() {
            return this.optionsOrigin.map(el => {
                let label = 'itemValue',
                    value;
                if (
                    this.item.controlType === 12 ||
                    this.item.controlType === 18
                ) {
                    value = 'itemValue';
                } else if (
                    this.item.controlType === 3 ||
                    this.item.controlType === 17
                ) {
                    value = 'salePfPropItemId';
                } else {
                    value = 'salePfPropItemId';
                }
                return {
                    label: el[label],
                    value: el[value]
                };
            });
        }
    }
};
</script>

<style>
</style>
