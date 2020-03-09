import $ from 'jquery'
import Vue from 'vue'
import {
    request,
    dialogLoading,
    toUrl,
    post,
	debounce
} from 'scripts/common.js'
import 'scripts/default.js'
import routerList from 'scripts/router.js'
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'

import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'assets/fonts/fontawesome-all.min.css'
import './app.scss'



window.$ = $;
window.windowISWHO = $(window)

$(window).on('resize', debounce(100, () => {
    let $iframeDom = $('iframe#main')
    $iframeDom.height($(document.getElementById('main').contentWindow.document.body).height() + 48)
    console.log($(document.getElementById('main').contentWindow.document.body).height())
}));

//生成菜单
var menuItem = Vue
    .extend({
        name: 'menu-item',
        props: {
            item: {}
        },
        template: [
            '<li>',
            '<a v-if="item.type === 0" href="javascript:;">',
            '<i v-if="item.icon != null" :class="item.icon"></i>',
            '<span>{{item.name}}</span>',
            '<i class="fa fa-angle-left pull-right"></i>',
            '</a>',
            '<ul v-if="item.type === 0" class="treeview-menu">',
            '<menu-item :item="item" v-for="item in item.list"></menu-item>',
            '</ul>',
            '<a v-if="item.type === 1" :href="\'#\'+item.url"><i v-if="item.icon != null" :class="item.icon"></i><i v-else class="fa fa-circle-o"></i> <span class="name">{{item.name}}</span></a>',
            '</li>'
        ].join('')
    });

Vue.component('menuItem', menuItem);

window.vm = new Vue({
    el: '#root',
    data: {
        user: {},
        menuList: {},
        main: "/system/index.html",
        pswd: null,
        newPswd: null,
        navTitle: "控制台",
        smallNav: false
    },
    methods: {
        toggleNav () {
            this.smallNav = !this.smallNav
        },
        hideMenu: function () {
            if (!$("body").hasClass("sidebar-collapse")) {
                $("body").addClass("sidebar-collapse");
                removeScroll();
            } else {
                $("body").removeClass("sidebar-collapse");
                setScroll();
            }
        },
        getMenuList: function (event) {

            request("/sys/menu/user?_" + $.now())
                .then(res => {
                    this.menuList = res.data.menuList
                })
        },
        getPermList: function (event) {
            request("/sys/user/perms?_" + $.now())
                .then(res => {
                    window.perms = res.data.rows;
                })
        },
        getUser: function () {
            request("/sys/user/info?_" + $.now())
                .then(res => {
                    this.user = res.data.user;
                })
        },
        logout: function () {
            layer.open({
                title: '系统提示',
                area: '338px',
                icon: 3,
                anim: -1,
                isOutAnim: false,
                move: false,
                content: '注：您确定要安全退出本次登录吗？',
                btn: ['确定', '取消'],
                btnAlign: 'c',
                yes: function () {
                    dialogLoading(true);
                    setTimeout(function () {
                        post('/sys/logout')
                            .then(res => {
                                localStorage.removeItem("token")
                                toUrl('/login/index.html')
                            })
                    }, 500);
                }
            });
        }
    },
    created: function () {
        this.getMenuList();
        this.getPermList();
        this.getUser();
        // 菜单点击事件
        $(document).off('click', ".sidebar-menu li a").on('click', ".sidebar-menu li a", function (e) {
            var $this = $(this);
            var checkElement = $this.next();
            if ((checkElement.is('.treeview-menu')) &&
                (checkElement.is(':visible'))) {
                checkElement.slideUp('fast', function () {
                    checkElement.removeClass('menu-open');
                });
                checkElement.parent("li").removeClass("active");
            } else if ((checkElement.is('.treeview-menu')) &&
                (!checkElement.is(':visible'))) {
                var parent = $this.parents('ul').first();
                var ul = parent.find('ul:visible').slideUp('fast');
                ul.removeClass('menu-open');
                var parent_li = $this.parent("li");

                checkElement.slideDown('fast', function () {
                    checkElement.addClass('menu-open');
                    parent.find('li.active').removeClass('active');
                    parent_li.addClass('active');

                    var _height1 = $(window).height() - $("#sidebar-menu >li.active").position().top - 41;
                    var _height2 = $("#sidebar-menu li > ul.menu-open").height() + 10
                    if (_height2 > _height1) {
                        $("#sidebar-menu >li > ul.menu-open").css({
                            overflow: "auto",
                            height: _height1
                        })
                    }

                });
            }
            if (checkElement.is('.treeview-menu')) {
                e.preventDefault();
            }
        });
    },
    updated: function () {
        // 路由
        var router = new Router();
        routerList(router, vm.menuList);
        router.start();
        //默认展开第一个菜单
        if (!$('.sidebar-menu li').hasClass('active')) {
            $('.sidebar-menu li:eq(1)').addClass('active');
        }
        //自适应滚动条
        // setScroll();
    }
});