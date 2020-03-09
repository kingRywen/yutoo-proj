<template>
  <div>
    {{$attrs}}
    <ComTable v-bind="$props" :data="allData" :tree="true" :header="$props.header" :slotContent="$scopedSlots" v-on=$listeners>
    </ComTable>
  </div>
</template>

<script>
import ComTable from './ComTable.vue'
export default {
  name: "ComTree",
  props: {
    data: {
      type: Array,
      default: []
    },
    
    columns: {
      type: Array,
      default: []
    },

    selection: {
      type: Boolean,
      default: false
    },

    header: {
      type: Boolean,
      // default: true
    }
  },
  inheritAttrs: false,
  components: {
    ComTable
  },
  mounted: function () {
    console.log(1)
    this.$nextTick(function () {
      console.log(this.data)
    })
  },
  computed: {
    allData () {
      const { $attrs: attrs } = this

      if (!this.data) {
        return
      }
      // 对数据进行处理，找出所有的parentId并排序
      let parents = [...new Set(this.data.map(el => el[attrs['parent-field']]))].sort((a, b) => a-b)
      // 遍历parentId，整理新的列表排序
      let arr = []
      let data = [...this.data]
      for (let i = parents.length - 1; i >= 0; i--) {
        const id = parents[i]; // parentid
        if (i === 0) {
          data.forEach((el, index) => {
            if (el[attrs['parent-field']] === id) {
              // 拷贝元素并推入
              arr.push({...el})
            }
          })
        } else {
          data.forEach((sub, index) => {
            // console.log(i, sub);
            if (sub[attrs['parent-field']] === id) {
              // 找到父元素，并push子元素到父元素中
              data.forEach((some) => {
                if (some[attrs['id-field']] === id) {
                  console.log(some.menuId);
                  if (some.children && Object.prototype.toString.call(some.children) === "[object Array]" ) {
                    some.children.push({...sub})
                  } else {
                    some.children = []
                    some.children.push({...sub})
                  }
                  
                }
              })


              // 找到menuid为子元素parentid的父元素所在的位置，插入子元素
              // let pos
              // arr.forEach((el, index) => {
              //   if (el[attrs['id-field']]  === id) {
              //     pos = index + 1
              //   }
              // })
              
              // arr.splice(pos, 0, el)
            }
          })
        }
        
      }
      console.log(arr);
      return arr
    }
  }
}
</script>

<style>

</style>
