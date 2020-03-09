<template>
  <div class="upshelf">
    <!-- 此步 只有店铺SKU生成规则有出现用变体属性的时候 才会出现-->
    <ElForm label-width="0" :show-message="false" ref="form" :model="formData">
      <ElTable class="form-item-table" border :data="formData.stores">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ElTable class="inner-table w100" :show-header="false" border :data="scope.row.propertyValues">
              <ElTableColumn label="属性名称" width="484px" prop="propertyName" />
              <ElTableColumn label="属性值">
                <template slot-scope="scope1">
                  <ElTable class="w100" :data="scope1.row.values.slice(0, 2)">
                    <ElTableColumn label="属性值">
                      <template slot-scope="scope2">{{scope2.$index == 0 ? 'SKU' : 'title'}}</template>
                    </ElTableColumn>
                    <ElTableColumn v-for="(item, index) in scope1.row.values" :key="item.propertyValue + index">
                      <span slot="header">
                        <span class="danger">*</span>
                        {{item.propertyValue}}
                      </span>
                      <template slot-scope="scope2">
                        <ElFormItem
                          :rules="rules"
                          :prop="`stores.${scope.$index}.propertyValues.${scope1.$index}.values.${index}.${scope2.$index == 0 ? 'sku' : 'title'}`"
                        >
                          <ElInput size="mini" v-model="item[scope2.$index == 0 ? 'sku' : 'title']"></ElInput>
                        </ElFormItem>
                      </template>
                    </ElTableColumn>
                  </ElTable>
                </template>
              </ElTableColumn>
            </ElTable>
          </template>
        </el-table-column>
        <ElTableColumn label="店铺名称" prop="storeName"></ElTableColumn>
        <ElTableColumn label="父产品SKU" prop="sellerSku">
          <span slot="header">
            <span class="danger">*</span>
            父产品SKU
          </span>
          <template slot-scope="scope">
            <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.sellerSku`">
              <ElInput size="small" v-model="scope.row.sellerSku"></ElInput>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="父产品标题">
          <span slot="header">
            <span class="danger">*</span>
            父产品标题
          </span>
          <template slot-scope="scope">
            <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.title`">
              <ElInput size="small" v-model="scope.row.title"></ElInput>
            </ElFormItem>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElForm>
  </div>
</template>
<script>
export default {
  props: ['params', 'value'],
  data() {
    return {
      formData: {
        stores: [
          {
            storeId: 1,
            storeName: '1',
            productSellerId: 65575654.76739097,
            sellerSku: 'est anim Duis',
            propertyValues: [
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'in adipisicing proident voluptate',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'nisi in dolore Duis dolor',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'sint',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName:
                      'consectetur eiusmod ullamco labore quis',
                    sku: '11',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'minim Lorem',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'proident ut qui',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName:
                      'Excepteur nostrud in commodo incididunt',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'consequat commodo deserunt ut',
                    sku: '1',
                    title: '11'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'tempor irure',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'anim tempor deserunt commodo',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'sint aliquip nostrud aute adipisicing',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'mollit ut fugiat amet id',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'elit Excepteur',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'ut labore et sit',
                    sku: '1',
                    title: '11'
                  }
                ]
              }
            ],
            title: '11'
          },
          {
            storeId: 1,
            storeName: '1',
            productSellerId: 16503335.914037496,
            sellerSku: '1',
            propertyValues: [
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'aute ex culpa consequat ea',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'ex pariatur',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'dolore sint occaecat',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'in ex incididunt eiusmod fugiat',
                    title: '1',
                    sku: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'sit ut ut',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'Ut in aute et',
                    sku: '11',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'ad ut',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName:
                      'cupidatat consequat voluptate incididunt aliquip',
                    title: '1',
                    sku: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'aliquip nisi amet eiusmod mollit',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'dolor culpa',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'culpa labore incididunt',
                    sku: '1',
                    title: '1'
                  }
                ]
              }
            ],
            title: '1'
          },
          {
            storeId: 1,
            storeName: '1',
            productSellerId: 83545672.45596126,
            sellerSku: '11',
            propertyValues: [
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'nulla do adipisicing',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'est',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'do enim Excepteur Duis anim',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'in',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'cillum dolor',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'consequat occaecat ad culpa',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'anim elit laborum aliquip nisi',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'adipisicing in pro',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'sint Lorem',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'in cillum sint',
                    title: '11',
                    sku: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'dolor',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'culpa Ut non mollit ex',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'fugiat sunt esse',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'dolor esse',
                    sku: '11',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'officia fugiat',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'minim dolor null',
                    sku: '1',
                    title: '11'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'labore',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'officia non incid',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'enim',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'est cillum',
                    sku: '11',
                    title: '1'
                  }
                ]
              }
            ],
            title: '1'
          },
          {
            storeId: 1,
            storeName: '1',
            productSellerId: -76555072.08460279,
            sellerSku: '1',
            propertyValues: [
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'aliquip dolore laborum sed',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'irure proident',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'in aliqua reprehenderit ut cupidatat',
                    sku: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'labore Excepteur s',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'amet',
                    sku: '1',
                    title: '1'
                  }
                ]
              },
              {
                productPlatId: 1,
                propertyName: '1',
                propertyId: 1,
                propertyType: 1,
                values: [
                  {
                    propertyValue: 'black',
                    propertyValueName: 'amet',
                    sku: '11',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'voluptate veniam ex',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'aliqua sint eiusmod',
                    sku: '11',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'qui',
                    sku: '1',
                    title: '1'
                  },
                  {
                    propertyValue: 'black',
                    propertyValueName: 'magna eu adipisicing occaecat',
                    sku: '1',
                    title: '1'
                  }
                ]
              }
            ],
            title: '1'
          }
        ]
      },
      rules: [
        {
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  methods: {
    init() {
      const { productPlatIds, platSiteId, putawayType, storeIds } = this.params
      const params = { productPlatIds, platSiteId, putawayType, storeIds }
      this.$api[`product/platProductVariantRule`](params).then(data => {
        data.stores.forEach(el => {
          let propertyValues = el.propertys
          delete el.propertys
          el.propertyValues = propertyValues
          propertyValues.forEach(e => {
            if (e.propertyValues) {
              let values = e.propertyValues
              e.values = values
              delete e.propertyValues
            }
          })
        })
        // this.formData.stores = data.stores
      })
    },
    valid() {
      function isEmpty(data) {
        if (data == null || data === '') {
          return true
        }
        return
      }
      let validSuccess = this.$refs.form.fields.every(field => {
        return !isEmpty(field.fieldValue) && field.validateState !== 'error'
      })
      this.$emit('update:validSuccess', validSuccess)
    }
  },
  computed: {
    currentVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$nextTick(() => this.valid())
      }
    }
  }
}
</script>