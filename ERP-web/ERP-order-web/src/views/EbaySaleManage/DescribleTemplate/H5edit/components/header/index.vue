<template>
    <header class="edit-header">
        <!-- <logo></logo> -->
        <section class="edit-content">
            <!-- <navbar></navbar> -->
            <el-form :inline="true" :rules="rules" :model="temp" :inline-message="true" ref="tempform" :show-message="false" class="temp-form" size="small" :status-icon="true">
                <el-form-item label="模板名称：" prop="templateName">
                    <el-input v-model.trim="temp.templateName"></el-input>
                </el-form-item>
                <el-form-item label="模板备注：" prop="templateRemark">
                    <el-input v-model.trim="temp.templateRemark"></el-input>
                </el-form-item>
            </el-form>

            <!--  -->
            <setup-btn @saveTemplate="isFillIn" @previewTemplate="previewTemplate"></setup-btn>
        </section>
    </header>
</template>

<script>
import logo from './logo';
import navbar from './navbar';
import setupBtn from './setupBtn';
export default {
    components: {
        logo,
        navbar,
        setupBtn
    },
    data() {
        return {
            temp: {
                templateName: '',
                templateRemark: '',
                templateContent: ''
            },
            rules: {
                templateName: [
                    {
                        required: true,
                        // message: '请选择活动区域',
                        trigger: 'blur'
                    }
                ],
                templateRemark: [
                    {
                        required: true,
                        // message: '请选择日期',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        getHtmlStr() {
            let dom = document.getElementById('h5edit');
            let html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                    </head>
                    <body>
                    ${dom.innerHTML}
                    </body>
                    </html>`;
            return {
                html,
                curDom: dom.innerHTML
            };
        },
        isFillIn() {
            this.$refs.tempform.validate(async valid => {
                if (valid) {
                    this.temp.templateContent = await this.getHtmlStr().html;
                    this.saveTemplate();
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '这输入模板名称，及备注',
                        position: 'top-left',
                        offset: 45
                    });
                    return false;
                }
            });
        },
        saveTemplate() {
            this.$api['order/descTempSave']({ ...this.temp }).then(res => {
                this.$message.success(res.msg);
                this.$router.push({
                    path: '/salesManagement/EbaySaleManage/DescribleTemplate'
                });
            });
        },
        async previewTemplate() {
            let html = await this.getHtmlStr().curDom;
            await sessionStorage.setItem('html', html);
            window.open(
                '/erp-order/#/salesManagement/EbaySaleManage/DescribleTemplate/H5edit/preview',
                '_blank',
                'scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes'
            );
        }
    }
};
</script>
<style lang="scss">
$bgColor: #324057;
@mixin line-height($heightValue: 56) {
    height: $heightValue + px;
    line-height: $heightValue + px;
}
.edit-header {
    background: #244c76; //$bgColor;
    color: #fff;
    padding: 0px 10px;
    display: flex;
    .edit-logo {
        min-width: 262px;
        @include line-height;
    }
    .edit-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        .edit-navbar {
            font-size: 16px;
            border-bottom: none;
            li {
                @include line-height;
                font-size: 14px;
                .icon {
                    font-size: 14px;
                }
                .el-submenu__title {
                    @include line-height;
                }
            }
        }
        .edit-setupBtn {
            @include line-height;
        }
    }
}
.temp-form {
    padding-left: 50px;

    margin-top: 12px;
    .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
            color: #fff;
        }
    }
}
</style>
