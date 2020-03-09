<script>
import CoreEditor from './editor/index.js'
import loadPluginMixin from '@/mixins/load-plugins.js'
import './support/index.js'

export default {
  extends: CoreEditor,
  mixins: [loadPluginMixin]
}
</script>
<style lang="scss" scoped>
@import '~ant-design-vue/dist/antd.css';
.ant-menu-item,
.ant-menu-submenu-title {
  padding: 0 10px;
}
.ql-editor {
  overflow: hidden;
}
</style>
