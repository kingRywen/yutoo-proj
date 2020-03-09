<template>
    <div class="look-info">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
// import { fabric } from 'fabric';
import 'fabric';
export default {
    props: ['modelType', 'id', 'url'],
    // id 面单报关单id
    // type MODEL_ONE(1, "自定义面单"),
    // MODEL_TWO(2, "报关单"),
    // MODEL_THREE(3, "发票"),
    data() {
        let modelType = this.modelType;
        return {
            modelTypeName:
                modelType == 1 ? '面单' : modelType == 2 ? '报关单' : '发票',
            editData: {}
        };
    },
    mounted() {
        this.init();
        document.title = '查看 -' + this.modelTypeName;
    },
    methods: {
        init() {
            let key =
                this.url == 'wmDocumentModelGet'
                    ? 'wmDocumentModelId'
                    : 'wmDocumentModelMId';
            this.$api[`warehouse/${this.url}`]({
                [key]: Number(this.id)
            })
                .then(data => {
                    this.editData = data.rows;
                    this.createCanvas();
                })
                .catch(() => {});
        },
        createCanvas() {
            // eslint-disable-next-line
            this.canvas = new fabric.Canvas('canvas');
            let {
                editData: { modelLength, modelWidth, modelContent }
            } = this;

            try {
                console.log(modelLength * 25);
                this.canvas.setHeight(modelLength * 25);
                this.canvas.setWidth(modelWidth * 35);
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
    }
};
</script>
<style>
.look-info {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
