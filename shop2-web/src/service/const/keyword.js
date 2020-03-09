const invalid = {
  INVALID_EXACT: "精准无效",
  INVALID_PHRASE: "词组无效",
  ABSOLUTE_PHRASE: "绝对无效"
};

const nagativeType = {
  INVALID_EXACT: "精准否定",
  INVALID_PHRASE: "词组否定"
};

// 否定词
const INVALID_MAP = {
  INVALID_EXACT: "INVALID_EXACT",
  INVALID_PHRASE: "INVALID_PHRASE",
  ABSOLUTE_PHRASE: "ABSOLUTE_PHRASE",
  VALID: "VALID",
  INVALID: "INVALID"
};

// 相关词分类枚举 用于添加关键词的类型
const RELETE_TYPE_ENUM = {
  // 关键词类型，CORE:核心词；LONG:长尾词；OTHER:其他词；
  CORE: "CORE",
  LONG: "LONG",
  OTHER: "OTHER"
};

const RELETE_TYPE_ENUM_OPTIONS = [
  {
    label: "核心词",
    value: RELETE_TYPE_ENUM["CORE"]
  },
  {
    label: "长尾词",
    value: RELETE_TYPE_ENUM["LONG"]
  },
  {
    label: "其他词",
    value: RELETE_TYPE_ENUM["OTHER"]
  }
];

// 品牌词
const BRAND_TYPE = {
  AD: 1,
  LAYOUT: 2
};

// 相关词枚举
// BRAND:可布局品牌词；BRAND_CORE:可布局品牌词-核心词；BRAND_LONG:可布局品牌词-长尾词；BRAND_OTHER:可布局品牌词-其他词；ADVERT:品牌词-仅广告；NO_BRAND:非品牌词；NO_BRAND_CORE:非品牌词-核心词；NO_BRAND_LONG:非品牌词-长尾词；NO_BRAND_OTHER:非品牌词-其他词；
const RELATE_ENUM = {
  BRAND: "BRAND",
  BRAND_CORE: "BRAND_CORE",
  BRAND_LONG: "BRAND_LONG",
  BRAND_OTHER: "BRAND_OTHER",
  ADVERT: "ADVERT",
  NO_BRAND: "NO_BRAND",
  NO_BRAND_CORE: "NO_BRAND_CORE",
  NO_BRAND_LONG: "NO_BRAND_LONG",
  NO_BRAND_OTHER: "NO_BRAND_OTHER"
};

export default [
  {
    name: "status",
    desc: "抓取状态",
    value: [
      {
        label: "处理中",
        value: 1
      },
      {
        label: "处理成功",
        value: 2
      },
      {
        label: "处理失败",
        value: 3
      }
    ]
  },
  {
    value: nagativeType,
    name: "negativeType",
    desc: "否定词类型"
  },
  {
    value: Object.keys(nagativeType).map(key => ({
      label: nagativeType[key],
      value: key
    })),
    name: "negativeTypeOpts",
    desc: "否定词类型-选项"
  },
  {
    value: {
      VALID: "有效",
      // INVALID: "无效",
      ...invalid
    },
    name: "rootType",
    desc: "词根类型"
  },
  {
    value: INVALID_MAP,
    name: "rootTypeMap",
    desc: "词根类型枚举"
  },
  {
    value: RELATE_ENUM,
    name: "relatedMap",
    desc: "相关词类型枚举"
  },
  {
    value: RELETE_TYPE_ENUM,
    name: "releteTypeEnum",
    desc: "添加相关词类型枚举"
  },
  {
    value: RELETE_TYPE_ENUM_OPTIONS,
    name: "releteTypeOptions",
    desc: "添加相关词类型下拉"
  },
  {
    // AMAZON:Amazon；EBAY:eBay；GOOGLE:Google；OTHER:其他；
    value: [
      {
        value: "AMAZON",
        label: "Amazon"
      },
      {
        value: "EBAY",
        label: "eBay"
      },
      {
        value: "GOOGLE",
        label: "Google"
      },
      {
        value: "OTHER",
        label: "其他"
      }
    ],
    name: "relatedSource",
    desc: "相关词来源"
  },
  {
    // SPECIAL:手动添加；AUTO:自动筛选；MANUAL:人工筛选；
    value: [
      {
        value: "SPECIAL",
        label: "手动添加"
      },
      {
        value: "AUTO",
        label: "自动筛选"
      },
      {
        value: "MANUAL",
        label: "人工筛选"
      }
    ],
    name: "relatedHandleType",
    desc: "相关词-添加类型"
  },

  {
    value: invalid,
    name: "invalidType",
    desc: "无效词根类型"
  },
  {
    value: Object.keys(invalid).map(key => ({
      label: invalid[key],
      value: key
    })),
    name: "invalidTypeOp",
    desc: "无效词根类型-选项"
  },
  {
    value: [
      {
        label: "仅广告",
        value: BRAND_TYPE["AD"]
      },
      {
        label: "可布局",
        value: BRAND_TYPE["LAYOUT"]
      }
    ],
    name: "brandType",
    desc: "品牌词类型"
  },
  {
    value: BRAND_TYPE,
    name: "brandTypeMap",
    desc: "品牌词类型枚举"
  },
  // {
  //   value: [
  //     {
  //       label: "核心词",
  //       value: "CORE"
  //     },
  //     {
  //       label: "长尾词",
  //       value: "LONG"
  //     },
  //     {
  //       label: "其他词",
  //       value: "OTHER"
  //     }
  //   ],
  //   name: "keywordType",
  //   desc: "关键词类型"
  // },
  // {
  //   value: [
  //     {
  //       label:''
  //     }
  //   ],
  //   name: "rootSource",
  //   desc: "词根来源"
  // },
  {
    value: [
      {
        label: "1",
        value: 1
      },
      {
        label: "2",
        value: 2
      },
      {
        label: "3",
        value: 3
      },
      {
        label: ">=4",
        value: 4
      }
    ],
    name: "wordCnt",
    desc: "单词数量"
  }
];
