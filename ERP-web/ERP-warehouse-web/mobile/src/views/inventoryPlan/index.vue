<template>
    <div class="inventory-plan">
        <page-layout title="盘点计划" :showFooter="false"></page-layout>
    </div>
</template>

<script>
import PageLayout from '@/components/Layouts/page-layout';
export default {
    components: {
        PageLayout
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss">
.inventory-plan {
    background: #fff;
}
</style>