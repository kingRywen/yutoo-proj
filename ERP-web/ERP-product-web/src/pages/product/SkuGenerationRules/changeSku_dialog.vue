
<template lang="html">
    <div class="">
        <el-dialog :title="title" :visible.sync="_ruleDialog" width="900px" top="5vh" modal-append-to-body :append-to-body="true">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px" class="rule_content">
                <el-form-item label="规则名称:" prop="ruleName" class="form_item">
                    <el-input v-model="form.ruleName" placeholder="请输入规则名称" />
                </el-form-item>
                <!--  -->
                <el-form-item class="form_item" label="店铺名称:" prop="objectId" v-if="applyTitle==1">
                    <el-select v-model="form.objectId" placeholder="请选择店铺">
                        <el-option :label="item.name" :value="item.storeId" v-for='item in shopList'/>
                    </el-select>
                </el-form-item>
                <!--  -->
                <el-form-item class="form_item" label="平台:" prop="platformId" v-if="applyTitle==2">
                    <el-select v-model="form.platformId" placeholder="请选择店铺">
                        <el-option :label="item.platformName" :value="item.platformId" v-for='item in platformList'/>
                    </el-select>
                </el-form-item>
                <!--  -->

                <el-form-item class="form_item" label="规则：" prop="formalList">
                    <div class="lebelBox">
                        <div class="lebel">
                            <el-checkbox-group v-model="form.formalList" size="mini">
                                <el-checkbox :label="item" border  v-for='(item,index) in rulesList' :key="index">
                                    <el-badge  :is-dot="item.ruleKey==2 || item.ruleKey==9" >{{item.ruleName}}</el-badge>
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="lebel">
                            <template v-for="(item,index) in formalList">
                                <el-tag closable  class="tag"  @close="handleClose(item.key,index)">
                                    {{item.name}}
                                    <el-input size="mini" v-show="item.editFlag" v-model.number="item.content" @input="isImport(item.content,index,item)" class="ruleinput"/>
                                    <span v-show="item.editFlag && item.key != 8">位数</span>

                                    <!-- <p>{{item.editFlag}}  {{item.digit}}</p> -->
                                    <span v-show="item.editFlag && item.digit" class="rulehint">{{item.digit}}</span>
                                </el-tag>
                            </template>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="form_item" label="规则描述：">
                    <div class="textarea">
                        <el-input v-model='form.description' type="textarea" :rows="2" />
                    </div>
                </el-form-item>
                <el-form-item class="form_item" label="预览：">
                    <div class="preview_inputBox">                        
                        <span>{{preview?preview:'选择规则输入预览'}}</span>
                    </div>
                </el-form-item>
                <el-form-item class="form_item">
                    <el-checkbox v-model="form.activateFlag">是否激活</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onPreserve('ruleForm')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        platformList: {
            type: Array,
            default: () => []
        },
        shopList: {
            type: Array,
            default: () => []
        },
        rulesList: {
            type: Array,
            default: () => []
        },
        ruleDialog: {
            type: Boolean,
            default: false
        },
        ruleInfo: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        _ruleDialog: {
            get() {
                this.formalList = [];
                this.preview = '';

                this.form.ruleName = '';
                this.form.formalList = [];
                this.form.description = '';
                this.form.type = '';
                this.form.objectId = '';
                this.form.activateFlag = 0;
                this.form.platformId = '';
                return this.ruleDialog;
            },
            set(val) {
                console.log(val);
                this.$emit('ruleDialogChange', val);
            }
        },
        applyTitle() {
            let str = this.title;
            // debugger
            if (str.indexOf('店铺') != -1) {
                this.$set(this.rules, 'objectId', [
                    { required: true, message: '请选择店铺', trigger: 'change' }
                ]);
                return 1;
            }
            if (str.indexOf('平台') != -1) {
                this.$set(this.rules, 'platformId', [
                    { required: true, message: '请选择平台', trigger: 'change' }
                ]);
                return 2;
            }
            if (str.indexOf('仓库') != -1) {
                return 3;
            }
        }
    },
    data() {
        return {
            isStore: false,
            isPlatform: false,
            hint: [],
            formalList: [],
            rules: {
                ruleName: [
                    {
                        required: true,
                        message: '请输入规则名称',
                        trigger: 'blur'
                    }
                ],
                // objectId: [{
                //     required: true,
                //     message: '请选择店铺',
                //     trigger: 'change'
                // }],
                formalList: [
                    {
                        required: true,
                        message: '请选择规则',
                        trigger: 'blur'
                    }
                ]
            },
            previewArr: [],
            preview: '',
            form: {
                ruleName: '',
                formalList: [],
                description: '',
                type: '',
                objectId: '',
                activateFlag: 0,
                platformId: ''
            }
        };
    },
    watch: {
        ['form.formalList']: {
            // immediate: true,
            handler(val, oldval) {
                console.log('j', val);
                if (!val.length) {
                    this.preview = '';
                }
                val.forEach((item, index) => {
                    if (this.formalList.find(j => j.key == item.ruleKey))
                        return;
                    this.$set(this.formalList, index, {
                        key: item.ruleKey,
                        sort: index,
                        content: item['content'],
                        digit: item.editFlag ? '请输入位数' : false,
                        auto: item.autoFlag,
                        editFlag: item.editFlag,
                        name: item.ruleName
                    });
                });
                this.formalList.forEach((item, index) => {
                    if (val.find(curitem => curitem.ruleKey == item.key))
                        return;

                    if (oldval[index].hasOwnProperty('content'))
                        oldval[index]['content'] = '';
                    console.log(oldval[index]);
                    this.formalList.splice(index, 1);
                });

                this.preview = this.formalList.map(i => i.name).join('-');
            },
            deep: true
        },
        _ruleDialog(val) {
            // console.log(12345678993,val)

            if (val && this.title.indexOf('编辑') != -1) {
                let obj = Object.assign({}, this.ruleInfo);

                this.form.ruleName = obj.ruleName;
                this.form.description = obj.description;
                this.form.type = obj.type;
                this.form.objectId = obj.objectId;
                this.form.activateFlag = obj.activateFlag ? true : false;
                this.form.platformId = obj.objectId;
                // console.log(123456,obj)
                // this.form.formalList = []
                // this.formalList = []
                let vm = this;
                obj.skuRuleModel.map((i, index) => {
                    vm.rulesList.map((j, jindex) => {
                        if (i.key == j.ruleKey) {
                            if (i.content) {
                                j['content'] = Number(i.content);
                                // debugger
                                vm.$set(vm.form.formalList, index, j);
                                setTimeout(() => {
                                    let arr = vm.formalList;
                                    this.isImport(
                                        Number(i.content),
                                        index,
                                        vm.formalList[index]
                                    );
                                }, 200);
                                return;
                            }
                            vm.$set(vm.form.formalList, index, j);
                        }
                    });
                });
            }
        }
    },
    methods: {
        //是否输入规则
        isImport(val, index, item) {
            // console.log(val, index, item)
            switch (item.name) {
                case '随机数字':
                    this.previewArr[index] = randomNumber(val, msg => {
                        // console.log(this.formalList)
                        // console.log('随机数字',item)
                        this.$set(item, 'digit', msg);
                    });
                    break;
                case '随机数字字母':
                    this.previewArr[index] = randomNumAlphabet(val, msg => {
                        this.$set(item, 'digit', msg);
                    });
                    break;
                case '随机字母':
                    this.previewArr[index] = randomAlphabet(val, msg => {
                        this.$set(item, 'digit', msg);
                    });
                    break;
                case '固定字符':
                    this.previewArr[index] = fixedCharacter(val, msg => {
                        this.$set(item, 'digit', msg);
                    });
                    break;
            }

            let newarr = [];
            this.formalList.forEach((i, j) => {
                if (i.editFlag) {
                    newarr.push(this.previewArr[j]);
                } else {
                    newarr.push(i.name);
                }
            });

            this.preview = newarr.join('-');
            //随机数字
            function randomNumber(val, callback) {
                let reg = /^[1-9]{1,1}$/;
                let rand = '';
                if (reg.test(val)) {
                    callback && callback(false);
                    for (let i = 0; i < val; i++) {
                        let r = Math.floor(Math.random() * 10);
                        rand += r;
                    }
                    return rand;
                } else {
                    callback && callback('请输入1位正整数');
                }
            }
            //随机数字字母
            function randomNumAlphabet(num, callback) {
                let arr = [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    'A',
                    'B',
                    'C',
                    'D',
                    'E',
                    'F',
                    'G',
                    'H',
                    'I',
                    'J',
                    'K',
                    'L',
                    'M',
                    'N',
                    'O',
                    'P',
                    'Q',
                    'R',
                    'S',
                    'T',
                    'U',
                    'V',
                    'W',
                    'X',
                    'Y',
                    'Z'
                ];
                let reg = /^[1-9]{1,1}$/;
                let str = '';
                if (reg.test(val)) {
                    callback && callback(false);
                    for (let i = 0; i < num; i++) {
                        let r = Math.round(Math.random() * (arr.length - 1));
                        str += arr[r];
                    }
                    return str;
                } else {
                    callback && callback('请输入1位正整数');
                }
            }
            //随机字母
            function randomAlphabet(num, callback) {
                let arr = [
                    'A',
                    'B',
                    'C',
                    'D',
                    'E',
                    'F',
                    'G',
                    'H',
                    'I',
                    'J',
                    'K',
                    'L',
                    'M',
                    'N',
                    'O',
                    'P',
                    'Q',
                    'R',
                    'S',
                    'T',
                    'U',
                    'V',
                    'W',
                    'X',
                    'Y',
                    'Z'
                ];
                let reg = /^[1-9]{1,1}$/;
                let str = '';
                if (reg.test(val)) {
                    callback && callback(false);
                    for (let i = 0; i < num; i++) {
                        let r = Math.round(Math.random() * (arr.length - 1));
                        str += arr[r];
                    }
                    return str;
                } else {
                    callback && callback('请输入1位正整数');
                }
            }
            //固定字符
            function fixedCharacter(val, callback) {
                let reg = /^[^\_]{1,1}$/;
                if (reg.test(val)) {
                    callback && callback(false);
                    return val;
                } else {
                    callback && callback("只能输入一个,且不能是'_'符号");
                }
            }
        },
        //删除已选中的
        handleClose(key, index) {
            this.formalList.splice(index, 1);
            this.form.formalList.forEach((i, j) => {
                if (key == i.ruleKey) {
                    this.form.formalList.splice(j, 1);
                }
            });
        },
        //保存
        onPreserve(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (
                        this.formalList.find(item => item.key == 2) ||
                        this.formalList.find(item => item.key == 9)
                    ) {
                        if (
                            this.formalList.every(item => item.digit == false)
                        ) {
                            console.log('全部通过');
                            let formal = this.formalList.map(item => {
                                return {
                                    key: item.key,
                                    digit: '',
                                    content: item.content,
                                    auto: item.auto,
                                    sort: item.sort
                                };
                            });
                            let params = {
                                ruleName: this.form.ruleName,
                                formal: JSON.stringify(formal),
                                description: this.form.description,
                                type: this.applyTitle,
                                activateFlag: this.form.activateFlag ? 1 : 0
                            };
                            if (this.applyTitle == 1) {
                                params = {
                                    ...params,
                                    objectId: this.form.objectId
                                };
                            } else if (this.applyTitle == 2) {
                                params = {
                                    ...params,
                                    objectId: this.form.platformId
                                };
                            }
                            this.$emit('submit', params);
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: '随机字母以及父产品SKU必须选着一项',
                            type: 'warning'
                        });
                    }
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="scss">
.rule_content {
    .form_item {
        .el-select {
            width: 100%;
        }
        .lebelBox {
            display: flex;
            flex-direction: row;
            .lebel {
                min-height: 200px;
                width: 367px;
                padding: 10px;
                border: 1px solid #dcdfe6;
                border-radius: 5px;
                margin-right: 10px;
                .el-checkbox {
                    &:first-child {
                        margin-right: 10px;
                    }
                }
                .el-checkbox.is-bordered + .el-checkbox.is-bordered {
                    margin: 0 10px 0 0;
                }
                &:last-child {
                    flex: 1;
                    margin-right: 0;
                    .tag {
                        margin-right: 10px;
                        margin-bottom: 15px;
                        position: relative;
                        .rulehint {
                            position: absolute;
                            left: 0;
                            bottom: -26px;
                            color: #f56c6c;
                        }
                    }
                    .ruleinput {
                        width: 30px;
                        .el-input__inner {
                            padding: 0;
                            text-align: center;
                        }
                    }
                }
            }
        }
        .preview_inputBox {
            .el-input {
                width: 160px;
                input {
                    text-align: center;
                }
            }
            span {
                line-height: 40px;
                margin-left: 10px;
            }
        }
        &:last-child {
            div {
                margin-left: 80px;
            }
        }
        .textarea {
            .el-textarea__inner {
                resize: none;
                height: 83px;
            }
        }
    }
}
.dialog-footer {
    text-align: center;
}
</style>
