# yutoo web 通用模板

> 约定即约束，通常情况按照文档中的规定来处理，如特殊情况，可以一起讨论制定

## api service

后端接口统一在`~/src/service/api`中定义，根据项目大小来决定是否模块化定义接口（建议模块化定义接口，方便日后维护）

- 模块化： 在`~/src/service/api/index.js`中导出对象，对象的 key 对应的就是模块，如果后端划分了端口，需要在`~/src/config/index.js`中配置各个端口。比如，后端分产品库、采购模块，需要分别加入 product、purchase 两个模块端口，配置`CONST_PORT_CONFIG.PRODUCT_URL = {产品库端口} | CONST_PORT_CONFIG.PURCHASE_URL = {采购端口}`,在单文件组件.vue 中调用方法`this.$api['{端口名称}/{接口名称}'](参数).then().catch()`，在其它.js 文件中引用`GLOBAL.ajax['{端口名称}/{接口名称}'](参数).then().catch()`

- 非模块化： 在`~/src/service/api/index.js`中导出一个数组即可.调用`this.$api['{接口名称}'](参数).then().catch()`

* formData 上传：设置 api 中`type:'formdata'`
