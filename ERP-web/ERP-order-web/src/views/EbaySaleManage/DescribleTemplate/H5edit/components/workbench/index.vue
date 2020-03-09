<template>
    <section class="edit-workbench">
        <div class="workbench-container" :style="{width:bgWidth,height:bgHeight}">
            <el-tooltip effect="dark" content="背景" placement="right">
                <a href="javascript:;" @click="toggleBgEditor" class="bg-hint">
                    <i aria-hidden="true" class="el-icon-picture icon"></i>
                </a>
            </el-tooltip>
            <div id="h5edit">
                <div
                    @dragenter="dragenter"
                    @dragover="dragover"
                    @drop="drop"
                    @dragleave="dragleave"
                    class="workbench-showScreen"
                    style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;overflow: hidden;"
                    :style="'background-color: ' + bgColor + ' ;'"
                >
                    <!--  -->
                    <normalElement v-model="renderInfo"></normalElement>

                    <!--  -->
                </div>
            </div>
        </div>
        <!-- 鼠标右键出现 -->
        <!-- <right-mousebtn></right-mousebtn> -->
    </section>
</template>

<script>
import normalElement from './element/normal-template';
import rightMousebtn from './rightMouseBtn';
import { mapState } from 'vuex';
export default {
    components: {
        normalElement,
        rightMousebtn
    },
    data() {
        return {
            renderInfo: {}
        };
    },
    computed: {
        ...mapState('tempEdit', [
            'bgColor',
            'bgWidth',
            'bgHeight',
            'curRenderInfo'
        ])
    },
    methods: {
        toggleBgEditor() {},
        //元素在画布移动触发
        dragover(event) {
            // console.log('我在移动', event);
            event.preventDefault();
        },
        //元素进入触发
        dragenter(event) {
            console.log('进入', event);
            // event.target.style.background = 'red';
        },
        //离开
        dragleave(event) {
            console.log('我走了', event);
            // event.target.style.background = '#ccc';
        },
        //元素放下
        drop(event) {
            console.log('放下', event);

            let top = event.offsetY;
            let left = event.offsetY;

            let { renderType } = this.curRenderInfo;

            this.renderInfo = {
                renderType: renderType,
                marginTop: top + 'px',
                marginLeft: left + 'px',
                maxW: parseInt(this.bgWidth),
                maxH: parseInt(this.bgHeight)
            };

            console.log(top, left);
        }
    }
};
</script>