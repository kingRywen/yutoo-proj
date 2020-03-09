<template>
    <ul class="search-list">
        <li v-for="item in searchList">
            <div class="left">
                <p class="keyworld">{{item.categoryName}}</p>
                <p>{{item.path }}</p>
            </div>
            <div class="right">
                <span class="more" @click="$emit('handleNextPage', item, true)">选择类别</span>
            </div>
        </li>
    </ul>
</template>
<script>
export default {
    props: {
        searchList: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss">
.search-list {
    font-size: 13px;
    li {
        height: 66px;

        display: flex;
        justify-content: space-between;
        padding: 0 10px 0 15px;
        border-radius: 5px;
        color: #999999;
        border: 1px solid rgba(228, 228, 228, 1);
        .left {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            p {
                margin: 0;
            }
        }
        .right {
            line-height: 66px;
        }
    }
    .keyworld {
        color: #1e1e1e;
    }
}
</style>