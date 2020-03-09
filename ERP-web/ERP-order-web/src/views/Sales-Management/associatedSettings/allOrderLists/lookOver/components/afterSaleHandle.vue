<template lang="html">
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="客户往来邮件" name="first">
                <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false">
                    <el-table-column label="操作" width="100" align="center" slot="right">
                        <template slot-scope="scope">
                            <el-button type="text" @click="look(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </yt-table>
            </el-tab-pane>
            <el-tab-pane label="买家留言" name="second">
                <yt-table :data="listB" :columns="columnsB" :border="true" :selection="false"></yt-table>
            </el-tab-pane>
            <el-tab-pane label="买家评价" name="third">
                <yt-table :data="listC" :columns="columnsC" :border="true" :selection="false"></yt-table>
            </el-tab-pane>
        </el-tabs>
        <!--  -->
        <el-dialog
            title="查看邮件"
            :visible.sync="emailVisible"
            width="800px">  
            <el-row :gutter="20" class="email-warp"  
                v-loading="emailinfo.loading"
                element-loading-text="邮件加载中...">
                <el-col :span="8" v-for="(i,j) in emailinfo.list" :key='j' class="email-orderInfo">
                    <span>{{i.label +':'}}</span>{{i.value || '-'}}
                </el-col>
                <el-col :span="24" v-html='emailinfo.content' class="email-content"></el-col>                        
            </el-row>
        
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    data() {
        return {
            emailVisible: false,
            emailinfo: {
                list: [],
                content: '',
                loading: true
            },
            activeName: 'first',
            listA: [],
            listB: [],
            listC: [],
            columnsA: [
                { value: 'addresser', label: '发件人' },
                { value: 'title', label: '主题' },
                { value: 'receivingTime', label: '收件时间' },
                { value: 'replyTime', label: '回复时间' },
                { value: 'serviceName', label: '客服人员' }
            ],
            columnsB: [
                { value: 'buyerAccount', label: '买家账号' },
                { value: 'message', label: '留言' },
                { value: 'leavingTime', label: '留言时间' },
                { value: 'handleTime', label: '卖家处理' }
            ],
            columnsC: [
                { value: 'buyerAccount', label: '买家账号' },
                { value: 'asin', label: 'ASIN' },
                { value: 'level', label: '评价星级' },
                { value: 'content', label: '评论信息' },
                { value: 'leavingTime', label: '评论时间' },
                { value: 'handleTime', label: '卖家处理' }
            ]
        };
    },
    methods: {
        look(item) {
            const { emailBaseId, emailType } = item;
            this.emailVisible = true;
            this.$api['email/emailBaseGet']({
                emailBaseId,
                emailType
            }).then(res => {
                const {
                    orderNumPlatform,
                    orderNumSystem,
                    storeName,
                    serviceName,
                    customerName,
                    itemId,
                    customerEmailBox,
                    subject,
                    content
                } = res.rows;
                this.emailinfo.list = [
                    { label: '平台订单号', value: orderNumPlatform },
                    { label: '系统订单号', value: orderNumSystem },
                    { label: '订单来源', value: storeName },
                    { label: '客服人员', value: serviceName },
                    { label: '客户姓名', value: customerName },
                    { label: 'Item ID', value: itemId },
                    { label: '邮箱', value: customerEmailBox },
                    { label: '主题', value: subject }
                ];
                this.emailinfo.content = content;
                this.emailinfo.loading = false;
            });
        },
        handleClick(tab, event) {
            if (tab.name == 'second') {
                this.getList('afterMessageRecord');
            } else if (tab.name == 'third') {
                this.getList('afterEvaluateRecord');
            }
        },
        getList(url = 'afterEmailRecord') {
            this.$api['order/' + url]({
                orderId: this.$route.query.orderServiceId
            })
                .then(res => {
                    let list = res.rows;
                    switch (url) {
                        case 'afterEmailRecord':
                            this.listA = list;
                            break;
                        case 'afterMessageRecord':
                            this.listB = list;
                            break;
                        case 'afterEvaluateRecord':
                            this.listC = list;
                            break;
                    }
                })
                .catch(err => {
                    this.$message.error(err.msg);
                });
        }
    }
};
</script>

<style lang="scss">
.email-warp {
    min-height: 500px;
    max-height: 600px;
    overflow-y: auto;
    padding: 0 10px;
    .email-orderInfo {
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        color: #108ee9;
        span {
            padding-right: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #606266;
        }
    }
    .email-content {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
        min-height: 400px;
    }
}
</style>
