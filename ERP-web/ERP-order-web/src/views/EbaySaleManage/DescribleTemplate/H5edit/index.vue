<template>
    <section class="H5edit">
        <!-- 头部 -->
        <edit-header></edit-header>
        <!--  -->
        <section class="edit-container">
            <!-- 左边 -->
            <edit-modules></edit-modules>
            <!-- 编辑区 -->
            <edit-workbench></edit-workbench>
            <!-- 右边 -->
            <edit-details></edit-details>
            <!--  -->
        </section>
        <!--  -->
    </section>
</template>

<script>
import EditHeader from './components/header/index';
import EditModules from './components/modules/index';
import EditWorkbench from './components/workbench/index';
import EditDetails from './components/details/index';
export default {
    components: {
        EditHeader,
        EditModules,
        EditWorkbench,
        EditDetails
    },
    data() {
        return {};
    },
    mounted() {
        console.log(this.$route.params);
        document.title = 'eBay销售管理-添加模板';
    }
};
</script>

<style lang='scss' scope>
.H5edit {
    height: 100%;
    background: #fff;
    // background: linear-gradient(#326a9b, #a2bfcc);
    font-size: 14px;
    font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei', Arial,
        sans-serif;
    display: flex;
    flex-direction: column;
    .edit-container {
        height: 100%;
        display: flex;
        .edit-modules {
            min-width: 266px;
            border-right: 1px solid #d1dbe5;
            height: 100%;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
                0 0 6px 0 rgba(0, 0, 0, 0.04);
            .el-tabs__nav {
                border-left: none;
            }
        }
        .edit-workbench {
            flex: 1;
            display: flex;
            justify-content: center;
            // align-items: center;
            .workbench-container {
                margin: 5px 0;
                border: 1px solid #333;
                border-radius: 3px;
                position: relative;
                .bg-hint {
                    position: absolute;
                    top: 50%;
                    right: -54px;
                    width: 48px;
                    height: 48px;
                    padding: 2px;
                    background: #324057;
                    transform: translateY(-50%);
                    text-align: center;
                    border-radius: 3px;
                    .icon {
                        font-size: 28px;
                        color: rgb(191, 203, 217);
                        transform: translateY(9px);
                    }
                }
                .workbench-showScreen {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
            }
        }
        .edit-details {
            min-width: 288px;
            border-left: 1px solid #d1dbe5;
            height: 100%;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
                0 0 6px 0 rgba(0, 0, 0, 0.04);
            .el-tabs__nav {
                border-left: none;
            }
        }
    }
}
</style>
