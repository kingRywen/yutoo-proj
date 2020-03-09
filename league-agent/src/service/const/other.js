export default [
    {
        /* eslint-disable */
        name: 'phoneExp',
        desc: '国内外所有手机号码合集',
        value: {
            'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
            'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
            'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
            'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
            'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
            'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
            'da-DK': /^(\+?45)?(\d{8})$/,
            'el-GR': /^(\+?30)?(69\d{8})$/,
            'en-AU': /^(\+?61|0)4\d{8}$/,
            'en-GB': /^(\+?44|0)7\d{9}$/,
            'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
            'en-IN': /^(\+?91|0)?[789]\d{9}$/,
            'en-NZ': /^(\+?64|0)2\d{7,9}$/,
            'en-ZA': /^(\+?27|0)\d{9}$/,
            'en-ZM': /^(\+?26)?09[567]\d{7}$/,
            'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
            'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
            'fr-FR': /^(\+?33|0)[67]\d{8}$/,
            'he-IL': /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}/,
            'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
            'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
            'ja-JP': /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/,
            'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
            'nb-NO': /^(\+?47)?[49]\d{7}$/,
            'nl-BE': /^(\+?32|0)4?\d{8}$/,
            'nn-NO': /^(\+?47)?[49]\d{7}$/,
            'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
            'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
            'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
            'ru-RU': /^(\+?7|8)?9\d{9}$/,
            'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
            'tr-TR': /^(\+?90|0)?5\d{9}$/,
            'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
            'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
            'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
        }
    },
    {
        name: 'postcode',
        desc: '中国邮政编码',
        value: /[1-9]\d{5}(?!\d)/
    },
    {
        name: 'yesno',
        desc: '通用是否',
        value: [
            {
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 0
            }
        ]
    },
    {
        name: 'taskType',
        desc: '任务类型',
        value: [
            { value: 1, label: '免评购买', tip: '仅购买、无Review评价' },
            { value: 2, label: '文字评价', tip: '购买+文字Reveiw评价' },
            { value: 3, label: '图片评价', tip: '购买+图片Reveiw评价' },
            { value: 4, label: '加购物车', tip: '' },
            { value: 5, label: '加Wishlist', tip: '' },
            { value: 6, label: '发布QA', tip: '' },
            { value: 7, label: '评价点Helpful', tip: '条数=任务数量*评价数量' }
        ]
    },
    {
        name: 'taskType_aliexpress',
        desc: '速卖通任务类型',
        value: [
            { value: 1, label: '免评购买', tip: '仅购买，无评价' },
            { value: 8, label: '带评购买', tip: '购买+评价' },
        ]
    },
    {
        name: 'sex',
        desc: '性别',
        value: [{ value: -1, label: '不限' }, { value: 0, label: '男' }, { value: 1, label: '女' }]
    },
    {
        name: 'sysInform',
        desc: '性别',
        value: [
            {
                label: '系统通知',
                value: 1
            },
            {
                label: '账号支付',
                value: 2
            },
            {
                label: '年费',
                value: 3
            }
        ]
    },
    {
        name: 'termnalType',
        desc: '终端类型',
        value: [
            {
                label: '手机',
                value: 1
            },
            {
                label: 'PC',
                value: 2
            }
        ]
    },
    {
        name: 'tskSosStats',
        desc: '任务源任务状态',
        value: [
            { value: 0, label: '已提交' },
            { value: 1, label: '审核不通过' },
            { value: 2, label: '审核通过' },
            { value: 3, label: '执行中' },
            { value: 4, label: '已完成' },
            { value: 5, label: '已中止' },
            { value: 7, label: '系统中止' },
            { value: 6, label: '已归档' }

        ]
    },
    {
        name: 'recklstats',
        desc: '回收状态',
        value: [
            // 0-入库审核中 1-待入库 2-已入库 3-出库审核中 4-出库审核不通过 5-已取消出库 6-待出库 7-已打包 8-已出库
            { value: 0, label: '入库审核中' },
            { value: 1, label: '待入库' },
            { value: 2, label: '已入库' },
            { value: 3, label: '出库审核中' },
            { value: 4, label: '出库审核不通过' },
            { value: 5, label: '已取消出库' },
            { value: 6, label: '待出库' },
            { value: 7, label: '已打包' },
            { value: 8, label: '已出库' }
        ]
    }
]
