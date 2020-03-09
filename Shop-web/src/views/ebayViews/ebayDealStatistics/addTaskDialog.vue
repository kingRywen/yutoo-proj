<template>
    <div>
        <yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
    </div>
</template>

<script>
export default {
    data() {
        let vm=this;
        let pages = new Array(10)
        .toString()
        .split(',')
        .map((el, index) => ({ label: index + 1, value: index + 1 }))
        return {
            formData: {
                dataType: 0
            },
            activeFields:[
                {
                    label: '任务名称',
                    name: 'taskName',
                    span: 24,
                    placeholder: '请输入任务名称',
                    type:"input",
                    required: true
                },
                {
                    label: '数据类型',
                    name: 'dataType',
                    span: 24,
                    type:"select",
                    placeholder: '请选择数据类型',
                    required: true,
                    options:[
                        {  value: 0, label: '产品链接'},
                        {  value: 1, label: '关键词'},
                        {  value: 2, label: '类目'},
                        {  value: 3, label: '店铺链接'},
                    ],
                },
                {
                    label: '产品链接',
                    name: 'productUrl',
                    span: 24,
                    placeholder: '请输入产品链接,一行一个',
                    rows: 5,
                    type:"textarea",
                    required: 'multiUrl',
                     hidden(data) {
                        return data.dataType === 0
                    }
                },
                {
                    label: '关键词',
                    name: 'keyword',
                    span: 24,
                    rows: 5,
                    placeholder: '请输入关键词,一行一个',
                    type:"textarea",
                    required: 'keyword',
                    hidden(data) {
                        return data.dataType === 1
                    }
                },
                {
                    label: '类目',
                    // name: 'productCategoryGetCategory',
                    name: 'categoryId',
                    span: 24,
                    width:'260px',
                    placeholder: '请选择类目',
                    options: vm.loadTree,
                    bind: {
                        label: 'name',
                        value: 'pcid',
                        children: 'childs',
                        enabled: 'enabled'
                    },
                    type: 'cascader',
                    last: true,
                    required: true,
                    hidden(data) {
                        return data.dataType === 2
                    }
                },
                {
                    label: '店铺链接',
                    name: 'storeUrl',
                    span: 24,
                    rows: 5,
                    placeholder: '请输入店铺链接,一行一个',
                    type:"textarea",
                    required: 'multiUrl',
                    hidden(data) {
                        return data.dataType === 3
                    }
                },
                {
                    label: '搜索页数',
                    name: 'searchPages',
                    type: 'select',
                    options: pages,
                    span: 24,
                    hidden(data) {
                        return data.dataType === 1 || data.dataType === 2
                    },
                    required: true
                },

            ]
        };
    },
    methods: {
        //加载类目
        loadTree(id = [0], selEl, itemDisabled) {
            if (!selEl) {
                selEl = {
                pcid: 0
                }
            }
            let { pcid } = selEl
            let params = {
                parentPcid:pcid,
                siteId: this.siteId,
                platformId: this.ebayPlatformId
            }
            this.$const['OTHER/phoneExp']
            return this.$api[`ebProductCategoryGetCategory`](params)
                .then(data => {
                    if (data && data.code && data.code !== 0) {
                        this.$message.error(data.msg)
                        return
                    };
                    return data.data.map(el => {
                        return {
                        ...el,
                        childs: el.haveChildren ? [] : null,
                        enabled: true,
                        isLeaf: !el.haveChildren
                        }
                    })
                })
            .catch(() => {
            })
        },
        _submit() {
            return this.$refs.form.validate().then(() => {
                let {taskName, dataType, productUrl, keyword, categoryId , storeUrl, searchPages} = this.formData,
                dataSources = [];
                let { sellerId, siteId } = this.sellerData;
                let platformId=this.ebayPlatformId;
                console.log(categoryId);
                switch (dataType) {
                    case 0:
                        dataSources = this.$.getAsins(productUrl)
                        break
                    case 1:
                        dataSources = this.$.getAsins(keyword)
                        break
                    case 2:
                        dataSources.push(categoryId.slice(0).pop())
                        break
                    case 3:
                        dataSources = this.$.getAsins(storeUrl)
                        break
                    default:
                        break
                };
                return this.$api[`ebTaskSalesStatSave`]({
                    taskName,
                    platformId,
                    sellerId,
                    siteId,
                    dataType,
                    dataSources,
                    searchPages
                })
                // .then(data => {
                //     return Promise.resolve('reset')
                // })
            })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="less">

</style>
