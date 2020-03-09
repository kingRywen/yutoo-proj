<template>
    <div class="preview" v-html="dom"></div>
</template>


<script>
export default {
    data() {
        return {
            dom: ''
        };
    },
    methods: {},
    mounted() {
        if (sessionStorage.getItem('html')) {
            this.dom = sessionStorage.getItem('html');
        } else {
            this.dom = '<div class="no">这里空空如也</div>';
        }
    }
};
</script>
<style lang="scss">
.preview {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    overflow: auto;
    .workbench-showScreen {
        max-width: 980px;
        margin: auto;
    }
}
.no {
    font-size: 24px;
    margin-top: 350px;
}
</style>
