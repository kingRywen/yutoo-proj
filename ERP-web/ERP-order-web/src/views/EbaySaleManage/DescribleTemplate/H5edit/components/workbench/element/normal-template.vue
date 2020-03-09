<template>
    <div class="element-wrapper" :active="{active:isActive}" :id="id">
        <!--  -->
        <!--  -->
        <!--  -->
        <!--  -->
        <VueDragResize v-if="value.renderType==1" :isResizable="false" :isDraggable="isDraggable" :isActive="true" :w="value.maxW" :h="180" v-on:resizing="resize" v-on:dragging="resize">
            <div :style="{width:value.maxW,height:'180px',background: '#ccc',fontSize: '24px',textAlign: 'center',lineHeight: '180px'}">店铺Logo</div>
        </VueDragResize>
        <VueDragResize v-if="value.renderType==2" :isResizable="false" :isDraggable="isDraggable" :isActive="true" :w="value.maxW" :h="40" v-on:resizing="resize" v-on:dragging="resize">
            <div :style="{width:value.maxW,height:'40px',background: '#333',fontSize: '14px', color:'#fff',textAlign: 'left',lineHeight: '40px'}">未设置</div>
        </VueDragResize>
        <!-- <div style="width:100%;" v-if="value.renderType==2">
            <img src="https://img.mukewang.com/5cdccfac0001ac4816000540.jpg" width="100%" height="auto" alt>
        </div>-->
    </div>
</template>
<script>
import VueDragResize from 'vue-drag-resize';
export default {
    props: {
        value: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        VueDragResize
    },
    data() {
        return {
            id: 0,
            cursorTop: 0,
            cursorLeft: 0,
            elWidth: 0,
            elHeight: 0,
            zIndex: 0,
            rotate: 0,
            isActive: false,

            width: 0,
            height: 0,
            top: 0,
            left: 0,

            isDraggable: true
        };
    },
    methods: {
        // 鼠标右键点击触发
        rightClick(e) {
            console.log(e);
        },
        resize(newRect) {
            this.width = newRect.width;
            this.height = newRect.height;
            this.top = newRect.top;
            this.left = newRect.left;
        }
    }
};
</script>

<style lang="scss">
.element-wrapper {
    position: absolute;
    &:hover {
        cursor: move;
    }
}
</style>
