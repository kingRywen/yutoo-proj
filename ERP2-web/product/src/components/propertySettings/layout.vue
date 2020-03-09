<template>
    <div class="property-settings">
        <el-row type="flex" justify="space-between" class="property-settings-container">
            <el-col :span="10" class="flex" style=" border: 1px solid #ebeef5;">
                <div class="field-title-container especial">
                    <div>
                        <span class="field-title">字段列表</span>
                        <el-tooltip class="item" effect="dark" content="系统内置的字段不可删除，添加的自定义字段会在仓库产品基本信息中作为扩展属性要求填写。" placement="bottom-start">
                            <i class="el-icon-warning hint-icon"></i>
                        </el-tooltip>
                    </div>
                    <div>
                        <slot name="handleBtn"></slot>
                    </div>
                </div>
                <div class="list">
                    <slot name="allFieldList"></slot>
                </div>
            </el-col>
            <el-col :span="2" class="handle">
                <div class="handle-container">
                    <div>
                        <slot name="rightAttribute"></slot>
                    </div>
                    <div class="mtop">
                        <slot name="leftAttribute"></slot>
                    </div>
                </div>
                <div class="handle-container">
                    <div>
                        <slot name="rightDiffAttribute"></slot>
                    </div>
                    <div class="mtop">
                        <slot name="leftDiffAttribute"></slot>
                    </div>
                </div>
            </el-col>
            <el-col :span="12" class="difference">
                <div class="diff-attribute-list flex">
                    <div class="field-title-container">
                        <span class="field-title">变体属性字段</span>
                        <el-tooltip class="item" effect="dark" placement="bottom-start">
                            <div slot="content">
                                <ul class="hint-field-explanation">
                                    <li>1、配置变体属性字段，在添加产品时该字段可以选择作为变体属性，最多可配置5个</li>
                                    <li>
                                        2、变体属性字段配置是否图片目录和目录层级，平台信息编辑的时候
                                        会根据目录
                                        <br />层级生成压缩包，以便传图，目录生成规则如下：
                                    </li>
                                    <li style="text-align: center;">
                                        <span class="el-icon-folder img-icon" v-for="i in hintImgText">
                                            <strong>{{i}}</strong>
                                        </span>
                                    </li>
                                    <li>
                                        3、选择是应用于标题SKU生成规则，标题或SKU规则选择了变体属性，
                                        那么生成
                                        <br />标题或SKU时将带入该变体属性
                                    </li>
                                </ul>
                            </div>
                            <i class="el-icon-warning hint-icon"></i>
                        </el-tooltip>
                    </div>
                    <div class="list">
                        <slot name="attributeFieldList"></slot>
                    </div>
                </div>
                <div class="diff-field-list flex">
                    <div class="field-title-container">
                        <span class="field-title">变体差异字段</span>
                        <el-tooltip class="item" effect="dark" content="配置后，该字段将进入对应的变体信息中填写，可以给每个变体配不同的值" placement="bottom-start">
                            <i class="el-icon-warning hint-icon"></i>
                        </el-tooltip>
                    </div>
                    <div class="list">
                        <slot name="diffFieldList"></slot>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            hintImgText: ['压缩包', '店铺', 'SKU', '1层属性', '2层属性']
        };
    }
};
</script>
<style lang="scss">
.property-settings {
    height: 100%;
    .mtop {
        margin-top: 25px;
    }
}
.property-settings-container {
    height: 100%;
    .flex {
        display: flex;
        flex-direction: column;
    }
    .list {
        flex: 1;
        width: 100%;
        overflow-y: auto;
    }
    .handle {
        @extend .flex;
        justify-content: space-around;
    }
    .handle-container {
        @extend .flex;
        text-align: center;
    }
    .difference {
        @extend .flex;
        .diff-attribute-list {
            flex: 1;
            overflow: auto;
            padding-bottom: 10px;
            border: 1px solid #ebeef5;
        }
        .diff-field-list {
            overflow: auto;
            flex: 1;
            border: 1px solid #ebeef5;
        }
    }
}
.hint-field-explanation {
    li {
        padding: 8px 0;
        line-height: 20px;
        .img-icon {
            font-size: 64px;
            color: #ff9900;
            position: relative;
            margin-right: 15px;
            strong {
                font-size: 14px;
                color: #fff;
                font-weight: 400;
                position: absolute;
                top: 30px;
                left: 8px;
            }
            &:after {
                content: '—';
                font-size: 16px;
                position: absolute;
                right: -15px;
                top: 50%;
                transform: translateY(-50%);
            }
            &:last-child {
                &:after {
                    content: '';
                }
            }
        }
    }
}
.field-title-container {
    height: 34px;
    line-height: 34px;
    background: #f2f2f2;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .field-title {
        color: #333333;
        font-size: 14px;
    }
    .hint-icon {
        color: #ff9900;
        margin-left: 8px;
    }
}
.especial {
    display: flex;
    justify-content: space-between;
}
</style>