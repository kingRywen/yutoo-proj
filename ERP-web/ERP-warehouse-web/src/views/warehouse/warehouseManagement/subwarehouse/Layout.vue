<template>
    <router-view v-if="$route.name !== 'subwarehouse'"></router-view>
    <Index v-else></Index>
</template>

<script>
import Index from './Index';
export default {
    components: {
        Index
    }
};
</script>

<style>
</style>
