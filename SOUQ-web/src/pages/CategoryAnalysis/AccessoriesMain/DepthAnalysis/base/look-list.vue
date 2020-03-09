<template lang="html">
        <ul class="lookList">
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist"> -->
                        <!-- <router-link :to="{ name: 'storeList', params: {} }">查 看 店 铺 列 表</router-link> -->
                    </el-button>
                </div>
            </li>
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist"> -->
                        <!-- <router-link :to="{ name: 'salesList', params: {} }">查 看 店 铺 列 表</router-link> -->
                    </el-button>
                </div>
            </li>
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist">查 看 店 铺 列 表</el-button> -->
                </div>
            </li>
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist">查 看 店 铺 列 表</el-button> -->
                </div>
            </li>
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist">查 看 店 铺 列 表</el-button> -->
                </div>
            </li>
            <li>
                <div>773.371(件)</div>
                <div>56.52%</div>
                <div>
                    <!-- <el-button type="success" icon="el-icon-menu" size="small" class="btnlist">查 看 店 铺 列 表</el-button> -->
                </div>
            </li>
        </ul>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" >
.lookList {
  flex: 1;
  margin-top: 22px;
  li {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 26px;
    & > div {
      font-size: 24px;
      color: #333;
      line-height: 34px;
      &:last-child {
        line-height: 0;
      }
      .btnlist {
        background: #1faeae;
        border: none;
      }
    }
  }
}
</style>
