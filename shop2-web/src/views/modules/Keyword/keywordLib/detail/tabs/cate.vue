<template>
  <div :class="['cate', {'show-left': showLeft}]">
    <div class="left">
      <div class="header">
        <div class="title">关键词分类树</div>
        <!-- <i @click="showLeft = !showLeft" :class="['el-icon-caret-left']"></i> -->
      </div>
      <div class="content">
        <slot></slot>
        <el-tree
          v-if="!type || productId"
          :current-node-key="currentId"
          node-key="id"
          :data="trees"
          ref="tree"
          highlight-current
          @current-change="handleNodeClick"
          :expand-on-click-node="false"
          default-expand-all
        ></el-tree>
        <transition name="el-fade-in-linear">
          <div class="arrow" @click="showLeft = !showLeft">
            <i :class="`el-icon-caret-${!showLeft ? 'right': 'left'}`"></i>
          </div>
        </transition>
      </div>
    </div>
    <div class="right">
      <component
        v-if="!type || productId"
        :key="currentId"
        :is="comName"
        :categoryId="categoryId"
        :product-id="productId"
        :curQuery="curQuery"
      />
    </div>
    <transition name="el-fade-in-linear">
      <div v-show="!showLeft" class="arrow" @click="showLeft = !showLeft">
        <i class="el-icon-caret-right"></i>
      </div>
    </transition>
  </div>
</template>
<script>
import { setLibCache, getGroupCache } from '../cache'
export default {
  inheritAttrs: false,
  props: ['type', 'id', 'productId'],
  components: {
    BrandWords: () => import('./components/brandWords'),
    ClassificationAttr: () => import('./components/classificationAttr'),
    KeywordManage: () => import('./components/keywordManage'),
    Privative: () => import('./components/privative'),
    RelatedWords: () => import('./components/relatedWords'),
    RootManage: () => import('./components/rootManage'),
    UnfilteredWords: () => import('./components/unfilteredWords')
  },
  data() {
    const cached = getGroupCache(+this.$route.query.id)
    const brandTypeMap = this.$const['KEYWORD/brandTypeMap'],
      rootTypeMap = this.$const['KEYWORD/rootTypeMap'],
      relatedMap = this.$const['KEYWORD/relatedMap']
    const COM_MAP = {
      BRAND_WORDS: {
        name: 'BrandWords'
      },
      CLASSIFICATION_ATTR: {
        name: 'ClassificationAttr'
      },
      KEYWORD_MANAGE: {
        name: 'KeywordManage'
      },
      PRIVATIVE: {
        name: 'Privative'
      },
      RELATED_WORDS: {
        name: 'RelatedWords'
      },
      ROOT_MANAGE: {
        name: 'RootManage'
      },
      UNFILTERED_WORDS: {
        name: 'UnfilteredWords'
      }
    }
    const comMap = {
      // 分类属性
      1: {
        component: COM_MAP['CLASSIFICATION_ATTR']
      },
      // 相关词
      2: {
        component: COM_MAP['RELATED_WORDS']
      },
      // 非品牌词
      3: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['NO_BRAND']
        }
      },
      // 非品牌词 > 核心词
      7: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['NO_BRAND_CORE']
        }
      },
      // 非品牌词 > 长尾词
      8: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['NO_BRAND_LONG']
        }
      },
      // 非品牌词 > 其它词
      9: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['NO_BRAND_OTHER']
        }
      },
      // 可布局品牌词
      4: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['BRAND']
        }
      },
      // 可布局品牌词 > 核心词
      30: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['BRAND_CORE']
        }
      },
      // 可布局品牌词 > 长尾词
      31: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['BRAND_LONG']
        }
      },
      // 可布局品牌词 > 其它词
      32: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['BRAND_OTHER']
        }
      },
      // 仅广告品牌词
      5: {
        component: COM_MAP['RELATED_WORDS'],
        query: {
          pageType: relatedMap['ADVERT']
        }
      },
      // 否定词
      11: {
        component: COM_MAP['PRIVATIVE']
      },
      // 否定词 > 精确否定
      12: {
        component: COM_MAP['PRIVATIVE'],
        query: {
          negativeType: rootTypeMap['INVALID_EXACT']
        }
      },
      // 否定词 > 词组否定
      13: {
        component: COM_MAP['PRIVATIVE'],
        query: {
          negativeType: rootTypeMap['INVALID_PHRASE']
        }
      },
      // 关键词管理
      14: {
        component: COM_MAP['KEYWORD_MANAGE']
      },
      // 未筛选词
      15: {
        component: COM_MAP['UNFILTERED_WORDS']
      },
      // 词根管理
      16: {
        component: COM_MAP['ROOT_MANAGE']
      },
      // 词根管理 > 有效词组
      33: {
        component: COM_MAP['ROOT_MANAGE'],
        query: {
          rootType: rootTypeMap['VALID']
        }
      },
      // 词根管理 > 无效词组
      34: {
        component: COM_MAP['ROOT_MANAGE'],
        query: {
          rootType: rootTypeMap['INVALID']
        }
      },
      // 品牌词库
      20: {
        component: COM_MAP['BRAND_WORDS']
      },
      // 品牌词库 > 可布局
      21: {
        component: COM_MAP['BRAND_WORDS'],
        query: {
          brandType: brandTypeMap['LAYOUT']
        }
      },
      // 品牌词库 > 仅广告
      22: {
        component: COM_MAP['BRAND_WORDS'],
        query: {
          brandType: brandTypeMap['AD']
        }
      }
    }
    const currentId =
      (this.type === 'product' ? cached.secondTree : cached.tree) ||
      this.id ||
      1
    const trees = [
      {
        label: '分类属性',
        id: 1
      },
      {
        label: '相关词',
        id: 2,
        children: [
          {
            label: '非品牌词',
            id: 3,
            children: [
              {
                label: '核心词',
                id: 7
              },
              {
                label: '长尾词',
                id: 8
              },
              {
                label: '其它词',
                id: 9
              }
            ]
          },
          {
            label: '可布局品牌词',
            id: 4,
            children: [
              {
                label: '核心词',
                id: 30
              },
              {
                label: '长尾词',
                id: 31
              },
              {
                label: '其它词',
                id: 32
              }
            ]
          },
          {
            label: '仅广告品牌词',
            id: 5
          }
        ]
      },
      {
        label: '否定词',
        id: 11,
        children: [
          {
            label: '精确否定',
            id: 12
          },
          {
            label: '词组否定',
            id: 13
          }
        ]
      }
    ]
    if (!this.type) {
      trees.push(
        {
          label: '未筛选词',
          id: 15
        },
        {
          label: '关键词管理',
          id: 14
        },

        {
          label: '词根管理',
          // id: 16,
          children: [
            {
              label: '有效词根',
              id: 33
            },
            {
              label: '无效词根',
              id: 34
            }
          ]
        },
        {
          label: '品牌词库',
          id: 20,
          children: [
            {
              label: '可布局',
              id: 21
            },
            {
              label: '仅广告',
              id: 22
            }
          ]
        }
      )
    }
    return {
      // 映射分类树所有参数
      comMap,
      // 当前分类树ID
      currentId,
      // 当前分类树要带的参数
      curQuery: comMap[currentId].query || {},
      categoryId: +this.$route.query.id,
      // 当前选择的分类
      comName: comMap[currentId].component.name,
      showLeft: true,
      // 分类树
      trees
    }
  },
  watch: {
    productId(val) {
      if (this.type == 'product' && val == null) {
        this.currentId = 1
      }
    }
  },
  methods: {
    handleNodeClick(data) {
      if (data.id == null) {
        this.$refs.tree.setCurrentKey(this.currentId)
        return
      }
      if (this.currentId === data.id) {
        return
      }
      if (this.comMap[data.id]) {
        this.currentId = data.id
        this.comName = this.comMap[data.id].component.name
        this.curQuery = this.comMap[data.id].query || {}
        setLibCache(
          this.type === 'product' ? 'secondTree' : 'tree',
          data.id,
          this.categoryId
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$leftPadding: 8px;
$leftBg: #f2f2f2;
$leftWidth: 160px;

.cate {
  font-size: 14px;
  .left {
    left: -$leftWidth;
    // transform: scaleX(0);
    // transform-origin: left;
    position: absolute;
    width: $leftWidth;
    transition: left 0.25s;
    .header {
      background-color: $leftBg;
      padding: $leftPadding;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        font-size: 16px;
        color: $btnColor;
        cursor: pointer;
      }
    }
    .content {
      min-height: 500px;
      font-size: 13px;
      border: 1px solid $leftBg;
      padding: $leftPadding;
      // min-height: 400px;
      /deep/ .el-tree-node__label {
        font-size: 12px;
      }
      /deep/ .el-tree-node__content * {
        // font-size: 12px;
        user-select: none;
      }
    }
  }
  .right {
    // margin-left: 10px;
    // width: 100%;
    padding-left: 0;
    // background: #f2f2f2;
    min-height: 640px;
    transition: 0.25s;
  }
  .arrow {
    position: absolute;
    display: flex;
    width: 12px;
    height: 70px;
    // border: 1px solid #999;
    justify-content: center;
    align-items: center;
    top: 50%;
    right: -14px;
    z-index: 223;
    box-shadow: inset 0px 1px 0px 0px #ffffff;
    background: linear-gradient(to bottom, #f9f9f9 5%, #e9e9e9 100%);
    background-color: #f9f9f9;
    border-radius: 0 3px 3px 0;
    border: 1px solid #e4e4e4;
    border-left-width: 0;
    cursor: pointer;
    color: #666666;
    font-family: Arial;
    font-size: 12px;
    font-weight: bold;
    text-decoration: none;
    text-shadow: 0px 1px 0px #ffffff;
    i {
      color: #999;
      display: block;
    }
    &:hover {
      background: linear-gradient(to bottom, #e9e9e9 5%, #f9f9f9 100%);
      background-color: #e9e9e9;
    }
  }
  &.show-left {
    .left {
      // transform: scaleX(1);
      left: 0;
    }
    .right {
      padding-left: $leftWidth + 20px;
    }
  }
}
</style>