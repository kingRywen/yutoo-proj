<template>
  <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'">
    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
