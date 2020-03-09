<template>
    <section class="edit-setupBtn">
        <el-button plain size="mini">设 置</el-button>
        <el-button plain size="mini" @click="$emit('previewTemplate')">预 览</el-button>
        <el-button plain size="mini">清空画布</el-button>
        <el-button plain size="mini" @click="$emit('saveTemplate')">保存为模板</el-button>
        <!-- <el-button plain size="mini">保存H5</el-button> -->
        <el-button plain size="mini" @click="$router.go(-1)">退 出</el-button>
    </section>
</template>
