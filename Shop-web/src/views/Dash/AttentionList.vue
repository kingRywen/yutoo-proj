<template>
  <div class="wrapper">
    <div class="item" v-for="n in list" :class="{'active': n.checked}" @click="n.checked = !n.checked">
      <div class="icon">
        <img src="@/assets/images/home_icon/ts-alert-shine.png" width="30">
      </div>
      <div class="text">{{n.name}}</div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['allList'],
  data() {
    return {
      list: []
    }
  },
  // watch: {
  //   allList: {
  //     immediate: true,
  //     handler(val) {
  //       if (!val) {
  //         return
  //       }
  //       this.getList(val)
  //     }
  //   }
  // },
  // created() {
  //   this.getList()
  // },
  methods: {
    submit(cb) {
      let itemList = this.list
        .filter(el => el.checked)
        .map((el, sortBy) => {
          return {
            itemType: el.itemType,
            sortBy
          }
        })
      let params = {
        ...this.storeIds,
        itemList
      }
      this.$api[`homeItemConfigSave`](params)
        .then(data => {
          cb()
        })
        .catch(() => {})
    },
    _initData() {
      this.getList(this.allList)
    },
    getList(data) {
      let index = data.length
      this.list = new Array(6)
        .join()
        .split(',')
        .map((el, sortBy) => {
          let icon, name, checked, itemType
          let e = data.find(el => el.itemType === sortBy)
          if (e) {
            checked = true
            itemType = e.itemType
            sortBy = e.sortBy
          } else {
            itemType = sortBy
            sortBy = index++
          }
          switch (itemType) {
            // 栏目类型，0:预警消息；1:产品信息监控消息；2:库存预警；3:索赔预警；4:广告异常监控；5:产品监控；
            case 0:
              icon = 'ts-alert-shine'
              name = '预警消息'

              break
            case 1:
              icon = 'ts-d'
              name = '产品信息监控'
              break
            case 2:
              icon = 'xintubiao-_1'
              name = '库存预警'
              break
            case 3:
              icon = 'ts-list-check'
              name = '索赔预警'
              break
            case 4:
              icon = 'ts-bar-graph-2'
              name = '广告监控'
              break
            case 5:
              icon = 'ts-magnifying-glass'
              name = '产品监控'
              break

            default:
              break
          }
          return {
            icon,
            name,
            sortBy,
            checked,
            itemType
          }
        })
      // debugger
      this.list = this.list.sort((a, b) => a.sortBy - b.sortBy)
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    // border: 1px solid #ddd;
    width: 200px;
    margin: 20px;
    border-radius: 5px;
    height: 200px;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    &:hover {
      box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
    }
    .icon {
      font-size: 48px;
    }
    .text {
      line-height: 2;
    }
    .circle {
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 100%;
      border: 2px solid #ececec;
      top: 20px;
      right: 20px;
      transition: all 0.25s ease-in-out;
    }
    &.active {
      // border: 2px solid $titleColor;
      box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
      .circle {
        border-color: $titleColor;
        background-color: $titleColor;
        &:after {
          content: '✓';
          display: block;
          margin-left: 3px;
          color: #fff;
        }
      }
    }
  }
  
}
</style>
