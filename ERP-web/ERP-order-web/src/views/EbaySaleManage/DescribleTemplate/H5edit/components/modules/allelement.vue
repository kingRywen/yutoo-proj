<template>
    <div class="allelement">
        <el-collapse v-model="activeElement" accordion>
            <template v-for="(item,index) in elementlist">
                <el-collapse-item :title="item.label" :name="index" :key="index">
                    <!--  -->

                    <div v-for="(j,jindex) in item.children" :key="jindex" class="layoutType-warp" :class="item.layoutType==2?'mbot10':''">
                        <div :class="corresponding(item.layoutType)" draggable="true" @dragstart="dragstart(j,item)">
                            <i class="icon" :class="j.icon"/>
                            <span class="text">{{j.label}}</span>
                        </div>
                    </div>

                    <!--  -->

                    <!--  -->
                </el-collapse-item>
            </template>
        </el-collapse>
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        const setVariableId = variable => {
            return `$${variable}$`;
        };
        return {
            activeElement: '1',
            elementlist: [
                {
                    label: '店铺LOGO',
                    layoutType: 1,
                    children: [
                        {
                            label: '店铺LOGO',
                            icon: 'el-icon-picture-outline',
                            renderType: 1
                        }
                    ]
                },
                {
                    label: '店铺菜单',
                    layoutType: 2,
                    children: [
                        {
                            label: '店铺菜单',
                            icon: 'el-icon-s-grid',
                            renderType: 2
                        },
                        {
                            label: '店铺菜单123',
                            icon: 'el-icon-s-grid',
                            renderType: 2
                        }
                    ]
                },
                {
                    label: '广告Banner',
                    value: ''
                },
                {
                    label: '产品标题',
                    value: ''
                },
                {
                    label: '产品图片',
                    value: ''
                },
                {
                    label: '文字描述',
                    value: ''
                },
                {
                    label: '业务政策',
                    value: ''
                },
                {
                    label: '店铺分类',
                    value: ''
                },
                {
                    label: '构图元素',
                    layoutType: 1,
                    children: [
                        {
                            label: '水平线',
                            icon: 'el-icon-minus',
                            renderType: 1
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        corresponding(layoutType) {
            switch (layoutType) {
                case 1:
                    return 'layoutType-column';
                case 2:
                    return 'layoutType-row';
                default:
                    break;
            }
        },
        ...mapMutations('tempEdit', ['setCurRenderInfo']),
        dragstart(cur, parent) {
            event.dataTransfer.setData(cur, parent);
            this.setCurRenderInfo(cur, parent);
        }
    }
};
</script>
<style lang="scss" scoped>
$borderColor: #8a909e;

@mixin same($height) {
    height: $height;
    cursor: move;
    padding: 5px;
    user-select: none;
    border-radius: 4px;
    border: 1px solid $borderColor;
    transition: all 0.25s;
    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
}
.allelement {
    margin: 0 15px;
    overflow-y: auto;
    height: 100%;
    .mbot10 {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0px;
        }
    }
    .layoutType-warp {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        .layoutType-column {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            @include same(40px);
            .icon {
                font-size: 24px;
            }
            .text {
                font-size: 12px;
            }
        }
        .layoutType-row {
            @include same(30px);
            width: 100%;
            line-height: 30px;
            .icon {
                font-size: 21px;
                vertical-align: text-bottom;
            }
            .text {
                font-size: 14px;
                padding-left: 5px;
            }
        }
    }
}
</style>