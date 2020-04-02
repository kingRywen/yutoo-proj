<template>
  <div class="w600">
    <table class="custom-table">
      <tr>
        <td class="table-header" style="width:80px">收件人</td>
        <td>{{row.buyerName}}</td>
      </tr>
      <tr>
        <td class="table-header" style="width:80px">地址</td>
        <td>
          {{row.buyerName || ""}}, {{row.addressLine1 || ""}}  {{row.city || ""}}, {{row.state || ""}} {{row.postalCode ||
          ""}} {{row.countryCode || ""}}
        </td>
      </tr>
      <tr>
        <td class="table-header" style="width:80px">电话</td>
        <td>{{row.phone || '-'}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  props: ['row']
}
</script>