<template>
  <div>
    <x-table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Apple</td>
          <td>$1.25</td>
        </tr>
        <tr>
          <td>Banana</td>
          <td>$1.20</td>
        </tr>
      </tbody>
    </x-table>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  },
  created() {
    Toast({
      message: '操作成功',
      iconClass: 'icon icon-success'
    })
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px;
}
</style>
