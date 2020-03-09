<template>
  <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'" style="height:100px;">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<style>

</style>

