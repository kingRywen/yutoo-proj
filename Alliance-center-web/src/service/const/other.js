export default [
  {
    name: 'phoneExp',
    desc: '国内外所有手机号码合集',
    value: {
      // 'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
      // 'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
      // 'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
      // 'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      // 'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
      // 'de-DE': /^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
      // 'da-DK': /^(\+?45)?(\d{8})$/,
      // 'el-GR': /^(\+?30)?(69\d{8})$/,
      // 'en-AU': /^(\+?61|0)4\d{8}$/,
      // 'en-GB': /^(\+?44|0)7\d{9}$/,
      // 'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      // 'en-IN': /^(\+?91|0)?[789]\d{9}$/,
      // 'en-NZ': /^(\+?64|0)2\d{7,9}$/,
      // 'en-ZA': /^(\+?27|0)\d{9}$/,
      // 'en-ZM': /^(\+?26)?09[567]\d{7}$/,
      // 'es-ES': /^(\+?34)?(6\d{1}|7[1234])\d{7}$/,
      // 'fi-FI': /^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/,
      // 'fr-FR': /^(\+?33|0)[67]\d{8}$/,
      // 'he-IL': /^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}/,
      // 'hu-HU': /^(\+?36)(20|30|70)\d{7}$/,
      // 'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
      // 'ja-JP': /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/,
      // 'ms-MY': /^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/,
      // 'nb-NO': /^(\+?47)?[49]\d{7}$/,
      // 'nl-BE': /^(\+?32|0)4?\d{8}$/,
      // 'nn-NO': /^(\+?47)?[49]\d{7}$/,
      // 'pl-PL': /^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/,
      // 'pt-BR': /^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/,
      // 'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
      // 'ru-RU': /^(\+?7|8)?9\d{9}$/,
      // 'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
      // 'tr-TR': /^(\+?90|0)?5\d{9}$/,
      // 'vi-VN': /^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
      'zh-CN': /^0?(13|14|15|17|18|19)[0-9]{9}$/,
      // 'zh-TW': /^(\+?886\-?|0)?9\d{8}$/
    }
  },
  {
    name: 'ipExp',
    desc: 'ip地址',
    value: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/
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
    name: 'searchType',
    desc: '搜索入口',
    value: [
      {
        label: '自然搜索',
        value: 1
      },
      {
        label: '类目搜索',
        value: 2
      },
      {
        label: '广告搜索',
        value: 3
      },
      {
        label: '产品链接',
        value: 4
      }
    ]
  },
  {
    name: 'secondSearchType',
    desc: '二次搜索',
    value: [
      {
        label: '无',
        value: 0
      },
      {
        label: '自然搜索',
        value: 1
      },
      {
        label: '类目搜索',
        value: 2
      },
      {
        label: '广告搜索',
        value: 3
      },
      {
        label: '产品链接',
        value: 4
      },
      {
        label: '关联流量',
        value: 5
      },
      {
        label: '关联广告',
        value: 6
      }
    ]
  },
  {
    name: 'relatedPosition',
    desc: '关联位置',
    value: [
      {
        label: '位置1',
        value: 1
      },
      {
        label: '位置2',
        value: 2
      }
    ]
  },
  {
    name: 'productFit',
    desc: 'productFit',
    value: [
      {
        label: 'Too small',
        value: '1'
      },
      {
        label: 'Somewhat small',
        value: '2'
      },
      {
        label: 'Fit as expected',
        value: '3'
      },
      {
        label: 'Somewhat large',
        value: '4'
      },
      {
        label: 'Too large',
        value: '5'
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
      },
      {
        label: '虚拟机',
        value: 3
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
    name: 'taskType',
    desc: '任务类型',
    value: [
      { value: 1, label: '免评购买', tip: '仅购买、无Review评价' },
      { value: 2, label: '文字评价', tip: '购买+文字Reveiw评价' },
      { value: 3, label: '图片评价', tip: '购买+图片Reveiw评价' },
      { value: 4, label: '加购物车' },
      { value: 5, label: '加Wishlist' },
      { value: 6, label: '发布QA' },
      { value: 7, label: '评价点Helpful' }
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
    name: 'taskSource',
    desc: '任务来源',
    value: [{ value: 0, label: '代理端' }, { value: 1, label: '商户端' }]
  },
  {
    name: 'checkPass',
    value: [
      { required: true, message: '请输入新密码' },
      {
        reg: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
        validator(rule, value, cb) {
          if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(value)) {
            cb(new Error('密码必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-20之间'))
          }
          cb()
        }
      }
    ]
  },
  {
    name: 'outType',
    desc: '支出类型',
    value: [
      {
        label: '手动',
        value: 0
      },
      {
        label: '自动',
        value: 1
      },
    ]
  },
  {
    name: 'star',
    desc: '星级',
    value: [
      {
        label: 1,
        value: 1
      },
      {
        label: 2,
        value: 2
      },
      {
        label: 3,
        value: 3
      },
      {
        label: 4,
        value: 4
      },
      {
        label: 5,
        value: 5
      }
    ]
  },
  {
    name: 'urlWhiteList',
    desc: 'url白名单',
    value: ['/login', '/findPass', '/editPass']
  },
  {
    name: 'reqWhiteList',
    desc: '请求白名单，不需要token',
    value: ['sys/login', 'sys/getVerificationCode']
  }
]
