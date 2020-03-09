import { loginRedirect } from 'Config';

export const mixins = {
    components: {
        //
    },
    data() {
        return {
            //是否
            whetherOrNot: [
                { label: '是', value: 1 },
                { label: '否', value: 2 }
            ],
            //借款状态
            loanStatusList: [
                { label: '借款完结', value: 1 },
                { label: '未借款', value: 2 },
                { label: '待审核', value: 3 },
                { label: '审核不通过', value: 4 }
            ],
            //借款类型
            loanTypeList: [
                { label: '采购付款', value: 1 },
                { label: '其他付款', value: 2 }
            ]
        };
    },
    methods: {
        //提 示
        _notice(msg) {
            this.$message.success(msg);
            this.$refs.page.closeForm();
        },
        //审核
        _openToExamine(title) {
            this.$refs.page.$dialog({
                title,
                visible: true,
                width: '500px',
                component: () => import('Views/dailyOperation/common/toExamine')
            });
        },
        //审核
        _toExamine(url, params = {}, cb) {
            this.$api[url](params).then(res => {
                this._notice(res.msg);
                cb && cb();
            });
        },
        //导出
        _export(url, params, cb) {
            this.$api[url](params).then(res => {
                window.location.href = res.path;
                cb && cb();
            });
        },

        //删除
        _remove(url, params, cb) {
            this.$confirm('确认删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$api[url](params).then(res => {
                        this._notice(res.msg);
                        this.$refs.page.clearSelection();
                        cb && cb();
                    });
                })
                .catch(() => {
                    return false;
                });
        },
        //订单详情
        _orderInfo(row) {
            let { orderId, orderType, platformId } = row;
            this._requiredParams({ orderId, orderType, platformId });
            let type = null;
            if (orderType == 3 || orderType == 4 || orderType == 5) {
                type = 3;
            } else {
                type = orderType;
            }
            window.open(
                `${loginRedirect}/erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=已发货&orderServiceId=${orderId}&platformId=${platformId}&orderType=${type}`,
                '_blank'
            );
        },
        //采购单详情
        /**
         * @param {采购单id} purchaseId
         * @param {采购清单号} purchaseNumber
         */
        _purchasingOrderDetails(row) {
            localStorage.setItem('procurement_type_name', 'second');
            let { purchaseId, purchaseNumber } = row;
            this._requiredParams({ purchaseId, purchaseNumber });
            window.open(
                `${loginRedirect}/erp-order/#/purchasingManagement/procurement/procurementList/purchaseDetailed?purchaseId=${purchaseId}&purchaseNumber=${purchaseNumber}`,
                '_blank'
            );
        },
        //采购下单详情
        /**
         * @param {采购订单号} lowerSingleNumber
         * @param {采购清单号} purchaseNumber
         */
        _purchasingOrderInfo(row, compName) {
            let { lowerSingleNumber, purchaseNumber } = row;
            this._requiredParams({ lowerSingleNumber, purchaseNumber });
            this.$refs[compName].$dialog({
                title: '下单详情 - ' + purchaseNumber,
                visible: true,
                width: '980px',
                component: () =>
                    import('Views/dailyOperation/common/queryOrderForm'),
                fnName: 'getListData',
                params: lowerSingleNumber,
                display: false
            });
        },
        //交易号
        _tradingNumber() {
            console.log('123456');
        },
        _requiredParams(p) {
            let arr = [];
            for (let k in p) {
                if (p[k]) {
                    continue;
                } else {
                    arr.push(k);
                }
            }
            arr.length && console.error('缺少必要的参数：' + arr.join(','));
        }
    }
};
