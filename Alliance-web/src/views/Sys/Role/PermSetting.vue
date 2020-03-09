<template>
  <div>
    <el-tree
      :data="permList"
      :props="props"
      check-on-click-node
      default-expand-all
      show-checkbox
      ref="tree"
      node-key="menuId"
      :expand-on-click-node="false"
      :default-checked-keys="defaultCheckedKeys"
      @check-change="handleCheckChange"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: ['edit'],
  data() {
    return {
      defaultCheckedKeys: [],
      props: {
        label: 'name',
        children: 'childs'
      },
      permList: [],
      addFields: [
        {
          label: '角色名',
          required: true,
          name: 'roleName',
          span: 24
        },
        {
          label: '角色标识',
          required: true,
          name: 'roleSign',
          span: 24
        },
        {
          label: '备注',
          name: 'remark',
          type: 'textarea',
          rows: 5,
          span: 24
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([this.getData(), this.getPermsData()]).then(res => {
        this.defaultCheckedKeys = res[1].rows.menuIdList
        this.permList = this.handleTree(res[0])
        

      })
    },
    handleTree(data) {
      
      let obj = {},
        arr = []
      data.forEach(el => {
        // debugger
        obj[el.name] = el
        if (!el.childs) {
          el.childs = []
        }
        if (obj[el.parentName]) {
          obj[el.parentName].childs.push(el)
        } else {
          obj[el.parentName] = {
            childs: [el]
          }
        }
      })
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key]
          if (element.type == 1) {
            arr.push(element)
          }
        }
      }
      return arr
    },
    getData() {
      return this.$api[`main/sysMenuList`]({})
    },
    getPermsData() {
      return this.$api[`main/sysRoleInfo`](this.edit)
    },
    getEditData() {
      this.$api[`main/sysRoleInfo`](this.edit)
        .then(data => {
          this.$refs.add.setData(data.rows)
        })
        .catch(err => {})
    },
    handleCheckChange() {}
  }
}
</script>

<style>
</style>
