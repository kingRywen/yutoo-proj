## 扩展 table

用于数据展示的表格，内部已封装分页，大部分传参基于 element-ui，最大的改进是列的传递，由传统的 template 中 slot 传递改为 jsx render 函数传递 html，实现 UI 利用。

### 基础 table

快速创建一个 table 展示数据。

:::demo 组件基本参数 data columns 必须传入， rowKey 对应 element-ui 中的rowKey, columns中每项中的value为数据中的对应key值，另外提供了一种渲染jsx函数的方式展示数据(如果提供了value和render属性，优先展示render结果)，此方法接收两个参数(h, scope), 第一个参数为渲染函数，不用处理，第二个参数为当前行的数据，对应el-table中的scope, 参见[jsx语法](https://github.com/vuejs/jsx#installation)

```html
<yt-table :data="data" :columns="columns"></yt-table>
<script>
  export default {
    data() {
      return {
        data: [
          {
            name: 'hehe',
            age: 30,
            activeFlag: '激活中',
            imgUrl: '123'
          }
        ],
        columns: [
          {
            value: "imgUrl", //table需要渲染的值
            label: "主图",//表头
            width: "300",//当前行宽度
            img:true,   //如图片传
            style:{     //图片宽高
                width:40,
                height:40
            },
            bulkyHeight:120 //鼠标hover图片高，宽度自动
          },
          {
            label: '姓名',
            value: 'name'
          },
          {
            label: '年龄',
            value: 'age'
          },
          {
            label: '激活',
            render(h, scope) {
              return <el-tag>{scope.row.activeFlag}</el-tag>
            }
          }
        ]
      }
    }
  }
</script>
```
:::

