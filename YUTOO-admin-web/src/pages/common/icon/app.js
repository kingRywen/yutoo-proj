import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
// import 'assets/css/common.scss'
import {
	hasPermission,
	request,
	post,
	dialogOpen,
	dialogClose,
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg
} from 'scripts/common.js'

$(function () {
	$("#icons .fa-hover a").dblclick(function () {
		var icon = $(this).find('i').attr('class');
		top.layerForm.firstChild.contentWindow.vm.menu.icon = icon;
		dialogClose();
	})
})