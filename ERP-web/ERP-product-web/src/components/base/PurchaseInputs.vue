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

    SelectSingleWrite(12,"可输入单选框") 
    SingleButton(13,"单选按钮radio") 
    Time(16,"时间") 
    MultipleCheckbox(17,"多选选框") 

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
    <div>
        <v-input
            :maxlength="maxLength"
            :value="value"
            :key="maxLength"
            @input="$emit('input', $event)"
            :disabled="disabled"
            v-if="item[type] !== 3 && item[inputType] === 1 && item[type] !== 1 && item[type] !== 5 && item[type] !== 7"
            style="width:100%"
            v-on="$listeners"
        ></v-input>
        <v-input-number
            :min="0.01"
            :max="99999999999"
            size="large"
            :disabled="disabled"
            v-if="item[type] !== 3 && item[inputType] === 1 && (item[type] === 1 || item[type] === 5 || item[type] === 7)"
            style="width:100%"
            :value="value || ''"
            @change="$emit('input', $event)"
            @focus="$emit('focus')"
        ></v-input-number>

        <!-- inputType = controlType   type = dataType -->
        <PurchaseSelect :plat="inType" @clearVal="$emit('clearVal')" :disabled="disabled" v-if="item[inputType] === 2" :value="value" @change="$emit('input', $event)" :list="acList" v-on="$listeners"></PurchaseSelect>

        <PurchaseSelect :plat="inType" :disabled="disabled" @clearVal="$emit('clearVal')" v-if="item[type] === 4" type="4" :value="value" @change="$emit('input', $event)" :list="acList" v-on="$listeners"></PurchaseSelect>

        <PurchaseSelect :plat="inType" :disabled="disabled" @clearVal="$emit('clearVal')" v-if="item[inputType] === 3" :value="value" @change="$emit('input', $event)" :list="acList" type="1" v-on="$listeners"></PurchaseSelect>

        <v-input
            :max="maxLength"
            :placeholder="`最多输入 ${maxLength} 个字符`"
            :disabled="disabled"
            v-if="item[inputType] === 4"
            :value="value"
            @change="$emit('input', $event)"
            type="textarea"
            :maxlength="maxLength"
            :autosize="{minRows:6}"
            style="width:100%"
            v-on="$listeners"
        ></v-input>

        <PurchaseSelect :plat="inType" :disabled="disabled" v-if="item[inputType] === 5 && item[type] !==4" :value="value" @change="$emit('input', $event)" :list="acList" type="2" v-on="$listeners"></PurchaseSelect>

        <template v-if="item[type] === 3 && item[inputType] === 1 && selType === 'default'">
            <el-date-picker
                clearable
                :picker-options="pickerOptions"
                :disabled="disabled"
                :value-format="dateRange"
                size="small"
                v-if="USATime.indexOf(item.propertyName) === -1"
                :value="value"
                @change="$emit('input', $event)"
                style="width:100%"
                type="date"
                placeholder="选择日期"
                v-on="$listeners"
            ></el-date-picker>
            <el-date-picker
                clearable
                :picker-options="pickerOptions"
                :disabled="disabled"
                :value-format="dateRange"
                size="small"
                v-if="USATime.indexOf(item.propertyName) >-1 && time"
                :value="value"
                @change="$emit('input', $event)"
                style="width:100%"
                type="date"
                placeholder="选择日期"
                v-on="$listeners"
            ></el-date-picker>
        </template>

        <PurchaseSelect :plat="inType" :disabled="disabled" v-if="item[type] === 3 && item[inputType] ===1 && selType === 'upload'" :value="value" @change="$emit('input', $event)" :list="acList" v-on="$listeners"></PurchaseSelect>

        <!-- <el-switch v-else-if="item[inputType] === 5" :active-value="item.activeValue || 1" :inactive-value="item.inactiveValue || 0" @change="$emit('input', $event)" :value="value"></el-switch> -->

        <!-- 多选checkbox -->
        <el-checkbox-group v-model="checkBoxVal" :disabled="disabled" v-else-if="item[inputType] === 17">
            <el-checkbox v-for="item in list" :label="item.salePfPropItemId" :key="item.salePfPropItemId">{{item.itemKey}}</el-checkbox>
        </el-checkbox-group>

        <Editor :noCN="true" :upload="false" :disabled="disabled" v-if="item[inputType] === 7" :init-id="`editor-${Math.random()}`" :config="config" :value="value" :defaultMsg="123" @input="$emit('input', $event)"/>

        <v-cascader :disabled="disabled" v-if="item[inputType] === 9 || item[inputType] === 10" size="large" v-on="$listeners"></v-cascader>

        <span class="__span" v-if="item[inputType] === 4">{{`最多输入 ${maxLength} 个字符`}}</span>
    </div>
</template>

<script>
import Vue from 'vue';
import Editor from 'components/base/editor.vue';
import PurchaseSelect from './purchaseSelect';
import { DatePicker, Tooltip, Switch, CheckboxGroup, Checkbox } from 'element-ui';
import { fetchData, _storage } from 'common/common';
import { getQueryString } from 'common/util';
import apis from 'apis';

Vue.use(DatePicker);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
export default {
    components: {
        Editor,
        PurchaseSelect
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        selType: {
            type: String,
            default: 'default' // 默认
        },
        dateRange: {
            type: String,
            default: null
        },
        list: {
            type: [Array, Function]
        },
        inType: {
            type: String,
            default: null
        },
        bindField: {
            type: Object,
            default: () => ({
                label: 'propertyName',
                value: 'value',
                bindval: 'propertyName',
                type: 'dataType',
                inputType: 'controlType',
                required: 'mustFlag'
            })
        },
        value: {
            required: true
        },
        item: {
            type: Object,
            default: () => {}
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.platformId = getQueryString('platformId');
        this.siteId = getQueryString('siteId');

        // checkbox时，监听checkbox的绑定值，并把值反馈回父组件
        if (this.item[this.inputType] === 17) {
            this.$watch('checkBoxVal', val => {
                this.$emit('input', val);
            });
        }

        let vm = this;
        if (Object.prototype.toString.call(this.list) === '[object Array]') {
            this.listPromise = this.list;
        }
        if (Object.prototype.toString.call(this.list) === '[object Function]') {
            let promise = this.list();
            if (!promise) {
                return;
            }
            if (!promise.then) {
                throw new Error('传参错了');
                showToast('error', '传参错了');
            } else {
                promise.then(res => {
                    if (res.data.code === 0) {
                        if (res.data.list) {
                            this.listPromise = res.data.list;
                        } else {
                            let data = res.data.data,
                                list = [];
                            for (const key in data) {
                                if (data.hasOwnProperty(key)) {
                                    const element = data[key];
                                    list.push({
                                        itemValue: element,
                                        salePfPropItemId: key
                                    });
                                }
                            }
                            this.listPromise = list;
                        }
                    } else {
                        showToast('error', res.data.msg);
                    }
                });
            }
        }

        // 如果是sale from date
        if (this.disabled) {
            return;
        }
        if (this.USATime.indexOf(this.item.propertyName) > -1) {
            let siteTime = _storage._get('session', 'USATime');
            if (siteTime) {
                this.time = siteTime;
            } else {
                fetchData({
                    ...apis.CATEGORY_GET_NOW_SITE_TIME,
                    data: {
                        platformId: 1,
                        siteId: 1,
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
    data() {
        let vm = this;
        return {
            checkBoxVal: [],
            time: undefined,
            // 需要设置成美国时间的
            USATime: ['sale_from_date', 'sale_end_date'],
            listPromise: [],
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350,
                scaleEnabled: false,
                maximumWords: 2000,
                // wordCount: false,
                toolbars: [
                    [
                        'fullscreen',
                        // 'source',
                        // '|',
                        'bold',
                        'italic',
                        'removeformat',
                        'pasteplain',
                        'selectall',
                        'cleardoc',
                        'touppercase',
                        'tolowercase',
                        'firstupper'
                    ]
                ],
                contextMenu: [{ label: '', cmdName: 'selectall' }]
            },
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
            }
        };
    },
    computed: {
        maxLength() {
            let { dataMaxLength, multRowsMaxLength } = this.item,
                max;
            if (multRowsMaxLength) {
                max = multRowsMaxLength;
            } else {
                max = dataMaxLength;
            }
            if (this.inType === 'plat' && this.item.propertyGroupName) {
                if (this.item.value.length > 1) {
                    return max;
                }
                return max * this.item.num;
            }
            return max || this.item.maxLength;
        },
        acList() {
            return this.listPromise;
        },
        label() {
            return this.bindField.label;
        },
        bindval() {
            return this.bindField.bindval;
        },
        val() {
            return this.bindField.value;
        },
        type() {
            return this.bindField.type;
        },
        required() {
            return this.bindField.required;
        },
        inputType() {
            return this.bindField.inputType;
        }
    }
};
</script>

<style>
</style>
