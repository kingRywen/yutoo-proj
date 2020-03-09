<template>
  <div>
    <yt-table class="mb20" :data="data" :selection="false" :columns="columns"></yt-table>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      // data: [],
      // columns: [
      //   {
      //     label: '链接',
      //     value: 'dataSources',
      //   },
      //   {
      //     label: '搜索页数',
      //     value: 'searchPages',
      //   }
      // ]
    }
  },
  computed: {
    data() {
      let { categoryUrl, dataType, dataSources, searchPages } = this.params
      return dataSources.map(el => {
        return {
          title: el,
          page: searchPages,
          categoryUrl
        }
      })
    },
    columns() {
      const { dataType } = this.params
      switch (dataType) {
        // 0:产品链接,1:店铺链接,2:类目,3:Top100链接,4:关键词
        case 3:
          return [
            {
              label: '链接',
              value: 'title',
              //url: 'title'
              render(h,scope){
                return(
                  <a href={scope.row.title} target='_blink' style='color: #108ee9' class='fix__row_1'>{scope.row.title}</a>
                )
              }
            }
          ]
          break
        case 2:
          return [
            {
              label: '链接',
              value: 'title',
              url: 'categoryUrl'
            },
            {
              label: '搜索页数',
              value: 'page'
            }
          ]
          break
        case 4:
          return [
            {
              label: '关键词',
              value: 'title'
            },
            {
              label: '搜索页数',
              value: 'page'
            }
          ]
          break

        default:
          return [
            {
              label: '链接',
              value: 'title',
              //url: 'title',
              render(h,scope){
                return(
                  <a href={scope.row.title} target='_blink' style='color: #108ee9' class='fix__row_1'>{scope.row.title}</a>
                )
              }
            }
          ]
          break
      }
    }
  }
}
</script>

<style>
</style>
