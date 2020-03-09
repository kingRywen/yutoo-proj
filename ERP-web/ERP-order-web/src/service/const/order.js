export default [{
    name: 'addType',
    value: [{
        label: '客户订单',
        value: 1
    }, {
        label: '本地仓备库订单',
        value: 2
    }, {
        label: '海外仓备库订单',
        value: 3
    }, {
        label: 'FBA发货计划',
        // disabled: true,
        value: 4
    }, {
        label: 'FBA备货计划',
        value: 5
    }, ]
}, {
    name: 'addOverseeType',
    value: [{
        label: '海外仓备库订单',
        value: 3
    }, {
        label: 'FBA发货计划',
        // disabled: true,
        value: 4
    }, {
        label: 'FBA备货计划',
        value: 5
    }, ]
}, {
    name: 'currentCurrecy', //当前币种
    value: [{
        label: '美金',
        value: 1
    }, {
        label: '人民币',
        value: 2
    }, {
        label: '欧元',
        value: 3
    }]
}, {
    name: 'paymentStatus', //支付状态
    value: [{
        label: '未付款',
        value: 1
    }, {
        label: '部分付款',
        value: 2
    }, {
        label: '已付款',
        value: 3
    }]
}, {
    name: 'refundType', //退款类型 1-未发货退款2-已发货退款3-部分退款4-全额退款
    value: [{
        label: '未发货退款',
        value: 1
    }, {
        label: '已发货退款',
        value: 2
    }, {
        label: '部分退款',
        value: 3
    }, {
        label: '全额退款',
        value: 4
    }]
}, {
    name: 'packageState', //是否生成包裹单
    value: [{
        label: '未生成',
        value: 1
    }, {
        label: '部分生成',
        value: 2
    }, {
        label: '已生成',
        value: 3
    }]
}, {
    name: 'createOrderReason',
    value: [{
        label: '有问题订单重建',
        value: 1
    }, {
        label: '非问题订单重建',
        value: 2
    }, {
        label: '错发产品',
        value: 3
    }, {
        label: '采购错误',
        value: 4
    }, {
        label: '漏发产品',
        value: 5
    }, {
        label: '质量问题',
        value: 6
    }, {
        label: '运输损坏',
        value: 7
    }, {
        label: '描述不符',
        value: 8
    }, {
        label: '包裹丢失',
        value: 9
    }, {
        label: '系统错误',
        value: 10
    }, {
        label: '海关扣货',
        value: 11
    }, {
        label: '客户未签收',
        value: 12
    }, {
        label: '收获地址错误',
        value: 13
    }, {
        label: '其他原因',
        value: 14
    }, {
        label: '常规备货',
        value: 15
    }, {
        label: '站外交易',
        value: 16
    }, {
        label: '样品采购',
        value: 17
    }, {
        label: '运输时间超时',
        value: 18
    }, {
        label: '安检不合格',
        value: 19
    }, {
        label: '多仓库订单拆分',
        value: 20
    }, ]
}, {
    name: 'orderStatus',
    /*  * 1-正常 2-待审核 3-作废（该订单作废，不可进行后续操作） 4-锁定（锁定订单中的库存，该订单的所有产品不能进行后续操作）
     * 5-已完成 6-部分生成包裹单 7-已生成包裹单
     * 	8	采购中，9	质检中，10 待发货 11	发货中 	12 待入库 13	入库中	14	审核不通过 */
    desc: '订单状态',
    value: [{
            label: '正常',
            value: 1
        },
        {
            label: '待审核',
            value: 2
        },
        {
            label: '作废',
            value: 3
        },
        {
            label: '锁定',
            value: 4
        },
        {
            label: '已完成',
            value: 5
        },
        {
            label: '部分生成包裹单',
            value: 6
        },
        {
            label: '已生成包裹单',
            value: 7
        },
        {
            label: '采购中',
            value: 8
        },
        {
            label: '质检中',
            value: 9
        },
        {
            label: '待发货',
            value: 10
        },
        {
            label: '发货中',
            value: 11
        },
        {
            label: '待入库',
            value: 12
        },
        {
            label: '入库中',
            value: 13
        },
        {
            label: '审核不通过',
            value: 14
        },
    ]
}]