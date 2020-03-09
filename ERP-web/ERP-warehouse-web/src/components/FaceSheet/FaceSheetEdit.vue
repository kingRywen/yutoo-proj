<template>
    <div>
        <CanvasEditor ref="CanvasEditor" :id="id"/>
    </div>
</template>

<script>
/* eslint-disable */
import LoadingComponent from './LoadingComponent';
import ErrorComponent from './ErrorComponent';
import CanvasEditor from './CanvasEditor';

export default {
    components: {
        CanvasEditor
    },
    props: ['data'],
    // id 面单报关单id
    // type MODEL_ONE(1, "自定义面单"),
    // MODEL_TWO(2, "报关单"),
    // MODEL_THREE(3, "发票"),
    data() {
        return {
            modelTypeName: '',
            id: null,
            editData: {}
        };
    },
    created() {
        this._initData();
    },
    methods: {
        _initData() {
            let { modelType, wmDocumentModelMId: id, wmDocumentModelId } =
                this.data.data || {};

            switch (modelType) {
                case 1:
                    this.modelTypeName = '面单';
                    break;
                case 2:
                    this.modelTypeName = '报关单';
                    break;
                case 3:
                    this.modelTypeName = '发票';
                    break;
                default:
                    break;
            }
            this.id = id || wmDocumentModelId;
            this.$nextTick(() => {
                this.init(modelType);
            });
        },
        init(modelType) {
            //编辑
            if (modelType !== undefined && this.id !== undefined) {
                this.$refs.CanvasEditor.isAdd = false;
                this.$refs.CanvasEditor.isCopy = this.data.isCopy;
                this.$refs.CanvasEditor.strCopy = this.data.str;
                this.$refs.CanvasEditor.changeModelType(modelType);
                this.$refs.CanvasEditor.editContraryseries(this.id);

                //添加
            } else {
                this.$refs.CanvasEditor.isAdd = true;
                this.$refs.CanvasEditor.isCopy = false;
                this.$refs.CanvasEditor.addOpen();
            }
        }
    }
};
</script>

<style>
</style>
