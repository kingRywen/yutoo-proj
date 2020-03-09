<template>
    <div v-loading="!Object.keys(options).length" element-loading-text="数据加载中">
        <canvas id="canvas"></canvas>
    </div>
</template>
<script>
import { fabric } from 'fabric';
export default {
    props: {
        options: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.createCanvas();
    },
    watch: {
        options: {
            handler(val) {
                if (Object.keys(val).length) {
                    let { modelLength, modelWidth, modelContent } = val;
                    try {
                        this.canvas.setHeight(modelLength * 25);
                        this.canvas.setWidth(modelWidth * 25);
                        this.canvas.loadFromJSON(JSON.parse(modelContent));
                        this.canvas.selection = false;

                        setTimeout(() => {
                            let items = this.canvas.getObjects();
                            items.forEach(i => {
                                i.set('selectable', false);
                            });
                        }, 500);
                    } catch (error) {
                        console.log(error);
                        this.$message.error('初始化数据失败啦');
                    }
                }
            },
            immediate: true
        }
    },
    data() {
        return {};
    },
    methods: {
        createCanvas() {
            this.canvas = new fabric.Canvas('canvas');
        }
    },
    beforeDestroy() {
        this.canvas.clear();
        console.log('销毁');
    }
};
</script>
<style lang="scss" scope>
.canvas-container {
    margin: auto;
    background: #faf9eb;
    border-radius: 5px;
}
</style>