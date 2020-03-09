import {
	isNullOrEmpty,
	BASE_URL
} from 'scripts/common'

//登录token
var token = localStorage.getItem("token");
if (token == 'null') {
	parent.location.href = '/login/index.html';
}

// 跳转链接
const toUrl = function (href) {
	window.location.href = href;
}

//全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false,
	url: BASE_URL,
	headers: {
		"token": localStorage.getItem('token')
	},
	complete: function (xhr) {
		if (xhr.responseText) {
			const res = JSON.parse(xhr.responseText)
			if (res.code == 401) {
				top.location.replace('/login/index.html');
			}
		}
	}
})

// bootstrap表格配置
$.fn.bootstrapTableEx = function (opt) {
	var defaults = {
		url: BASE_URL,
		dataField: "rows",
		method: 'post',
		dataType: 'json',
		selectItemName: 'id',
		clickToSelect: true,
		pagination: true,
		smartDisplay: false,
		pageSize: 10,
		pageList: [10, 20, 30, 40, 50],
		paginationLoop: false,
		sidePagination: 'server',
		queryParamsType: null,
		columns: [],
		onLoadSuccess: function () {
			if(top && top.windowISWHO && top.windowISWHO.resize) {
				top.windowISWHO.resize()
			}
		}
	}
	var option = $.extend({}, defaults, opt);
	option.url = defaults.url + option.url
	$(this).bootstrapTable(option);
}