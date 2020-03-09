import $ from 'jquery'
import Vue from 'vue'
import 'assets/fonts/fontawesome-all.min.css'
import 'assets/css/common.scss'
import 'scripts/ztree/css/metroStyle/metroStyle.css'
import 'scripts/bootstrap-table/bootstrap-table.min.css'
import '../../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import 'scripts/bootstrap-table/bootstrap-table.min.js'
import 'scripts/bootstrap-table/locale/bootstrap-table-zh-CN.min.js'
import 'scripts/ztree/jquery.ztree.all.min.js'
// import '../../../../node_modules/layui-src/dist/css/layui.css'
// import '../../../../node_modules/layui-src/dist/layui.all.js'
// import layer from 'scripts/layer.js';
// import 'scripts/layui/css/layui.css'
import {
	hasPermission,
	request,
	post,
	dialogOpen,
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg,
	getIframeVue,
	BASE_URL
} from 'scripts/common.js'
import 'scripts/default.js'
import './app.scss'

// (function () {
// 	var form = layui.form, layer = layui.layer;
// 	layer.msg('Hello')
// })();

//全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false,
	headers: {
		"token": localStorage.getItem('token')
	},
	complete: function (xhr) {
		const res = JSON.parse(xhr.responseText)
		if (res.code == 401) {
			top.location.replace('/login/index.html');
		}
	}
})


/**
 * 行政区域js
 */

$(function () {
	initialPage();
	getGrid();
});

function initialPage() {
	// $("#treePanel").css('height', $(window).height() - 54);
	// $(window).resize(function () {
	// 	$("#treePanel").css('height', $(window).height() - 54);
	// 	$('#dataGrid').bootstrapTable('resetView', {
	// 		height: $(window).height() - 108
	// 	});
	// });
}

function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/sys/area/list?_' + $.now(),
		// height: $(window).height() - 108,
		queryParams: function (params) {
			params.name = vm.keyword;
			params.parentCode = vm.parentCode;
			return params;
		},
		pagination: false,
		columns: [{
			checkbox: true
		}, {
			field: "areaId",
			title: "编号",
			width: "50px"
		}, {
			field: "areaCode",
			title: "区域代码",
			width: "100px"
		}, {
			field: "name",
			title: "区域名称",
			width: "200px"
		}, {
			field: "layer",
			title: "层级",
			width: "60px",
			formatter: function (value, row, index) {
				if (value == 1) {
					return '<span class="badge badge-primary">省级</span>';
				}
				if (value == 2) {
					return '<span class="badge badge-success">地市</span>';
				}
				if (value == 3) {
					return '<span class="badge badge-warning">区县</span>';
				}
			}
		}, {
			field: "orderNum",
			title: "排序",
			width: "60px",
			align: "center",
		}, {
			field: "status",
			title: "可用",
			width: "60px",
			align: "center",
			formatter: function (value, row, index) {
				if (value == 0) {
					return '<i class="fa fa-toggle-off"></i>';
				}
				if (value == 1) {
					return '<i class="fa fa-toggle-on"></i>';
				}
			}
		}, {
			field: "remark",
			title: "备注"
		}]
	})
}

var setting = {
	async: {
		enable: true,
		type: "get",
		url: BASE_URL + "/sys/area/select",
		autoParam: ["areaCode"]
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "areaCode",
			pIdKey: "parentCode",
			rootPId: "0"
		},
		key: {
			url: "nourl"
		}
	},
	callback: {
		onClick: function (event, treeId, treeNode) {
			vm.parentCode = treeNode.areaCode;
			vm.parentName = treeNode.name;
			vm.load();
		}
	}
};
var ztree;

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		keyword: null,
		parentCode: '0',
		parentName: null
	},
	methods: {
		load: function () {
			$('#dataGrid').bootstrapTable('refresh');
		},
		getArea: function (parentCode) {
			request('/sys/area/select', {
					areaCode: parentCode
				})
				.then(res => {
					console.log(res.data)
					ztree = $.fn.zTree.init($("#areaTree"), setting, res.data);
				})
		},
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		save: function () {
			dialogOpen({
				title : '新增区域',
				url : '/base/area/add.html?_' + $.now(),
				width : '500px',
				height : '520px',
				anim: 0,
				success : (iframeId) => {
					let vueInstance = getIframeVue(iframeId)
					vueInstance.area.parentCode = vm.parentCode;
					vueInstance.area.parentName = vm.parentName;
				},
				yes : function(iframe) {
					iframe.vm.acceptClick();
				},
			});
		},
		edit: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if (checkedRow(ck)) {
				dialogOpen({
					title: '编辑区域',
					url: '/base/area/edit.html?_' + $.now(),
					width: '500px',
					height: '520px',
					success: function (iframeId) {
						let vueInstance = getIframeVue(iframeId)
						vueInstance.area.areaId = ck[0].areaId;
						vueInstance.setForm();
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					}
				});
			}
		},
		remove: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.areaId;
				});
				post('../../sys/area/remove?_' + $.now(), ids)
					.then(res => {
						if (res.data.code == 0) {
							dialogMsg(res.data.msg)
							vm.load();
						} else {
							dialogMsg(res.data.msg)
						}
					})
			}
		}
	},
	created: function () {
		this.getArea(this.parentCode);
	}
})