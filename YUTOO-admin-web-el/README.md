## 开发环境下
修改根目录中`node_modules/`下`\_element-ui@2.3.7@element-ui\lib\form-item.js`
第469行： 改为`_asyncValidator2.default.default(descriptor)`

## 生产环境打包
修改根目录中`node_modules/`下`\_element-ui@2.3.7@element-ui\lib\form-item.js`
第469行： 改为`_asyncValidator2.default(descriptor)`