<template>
  <div class="w1100">
    <table class="custom-table w600 mb20">
      <tr>
        <td class="table-header" style="width:80px">收件人</td>
        <td>{{row.buyerName}}</td>
      </tr>
      <tr>
        <td class="table-header" style="width:80px">地址</td>
        <td>
          {{row.addressLine1 || ""}} {{row.city || ""}}, {{row.state || ""}} {{row.postalCode ||
          ""}} {{row.countryCode || ""}}
        </td>
      </tr>
      <tr>
        <td class="table-header" style="width:80px">电话</td>
        <td>{{row.phone || '-'}}</td>
      </tr>
    </table>
    <main-layout
      :showSelection="false"
      url="fbm/fbm-orderOrderItems"
      :outerParams="queries"
      :isShowPag="false"
      :columns="columns"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['queries', 'row'],
  data() {
    return {
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          img: true,
          value: 'imagePath'
        },
        {
          label: '数量',
          value: 'itemCount'
        }
      ]
    }
  }
}
</script>