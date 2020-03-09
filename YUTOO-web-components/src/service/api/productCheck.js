export default [
    //关键词校验list
    {
        name: 'productKeywordVerifyList',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/list',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    //关键词校验-获取父产品列表
    {
        name: 'ProductListToParentAsin',
        method: 'POST',
        desc: '关键词校验',
        path: '/product/listToParentAsin',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    //关键词校验添加
    {
        name: 'ProductKeywordVerifySave',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/save',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    //关键词校验 校验
    {
        name: 'ProductKeywordVerifyVerify',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/verify',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    //关键词校验 设置，取消优先
    {
        name: 'ProductKeywordVerifyUpdatePriorityType',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/updatePriorityType',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    //关键词校验 获取单条详情
    {
        name: 'ProductKeywordVerifyInfo',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/info',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    //关键词校验 保存 校验
    {
        name: 'ProductKeywordVerifyUpdateTitleSelling',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/updateTitleSelling',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    //关键词校验 删除父asin
    {
        name: 'ProductKeywordVerifyRemove',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/remove',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
    // 关键词检验查看列表
    {
        name: 'ProductKeywordVerifyListToVerifyDetail',
        method: 'POST',
        desc: '关键词校验',
        path: '/productKeywordVerify/listToVerifyDetail',
        mockPath: '',
        // showSuccess: true,
        params: {
        }
    },
    // 关键词检验查看列表 加入排名
    {
        name: 'TaskKeywordRankSaveKeywordAndAd',
        method: 'POST',
        desc: '关键词校验',
        path: '/taskKeywordRank/saveKeywordAndAd',
        mockPath: '',
        showSuccess: true,
        params: {
        }
    },
	{
	    name: 'productKeywordVerifyVerifyData',
	    method: 'POST',
	    desc: '标题卖点后台词验证',
	    path: '/productKeywordVerify/verifyData',
	    mockPath: '',
		codes: [1],
	    // showSuccess: true,
	    params: {
	    }
	},
	{
	    name: 'productKeywordVerifyResetTitleSelling',
	    method: 'POST',
	    desc: '标题卖点推荐关键词重置',
	    path: '/productKeywordVerify/resetTitleSelling',
	    mockPath: '',
	    // showSuccess: true,
	    params: {
	    }
	},
]