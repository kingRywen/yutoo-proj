<template>
  <new-main-layout
    :columns="columns"
    :show-selection="false"
    :outerParams="{productRecycleId}"
    url="main/recycleStorageLocation"
  ></new-main-layout>
</template>
<script>
export default {
  props: ['productRecycleId'],
  data() {
    return {
      columns: [
        {
          label: '仓库标签',
          value: 'barCode'
        },
        {
          label: '库位',
          value: 'storageLocation'
        }
      ]
    }
  }
}
</script>