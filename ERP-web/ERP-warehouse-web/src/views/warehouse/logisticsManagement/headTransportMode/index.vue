<template>
  <iframe :src="src" style="height:99%;width:100%" scrolling="auto"></iframe>
</template>
<script>
import {loginRedirect} from 'Config';

export default {
  data() {
    return {
      src: loginRedirect + `WarehousingLogisticsManagement.html?warehouse=1`,
      form: {
        aaaa: 'fdsafasdf'
      },
      options: {
        title: '添加',
        visible: false,
        width: '600px'
      },
      formConfig: {
        items: [
          {
            type: 'input',
            value: 'name',
            label: '名字',
            frontLabel: '122',
            backLabel: '333',
            rules: {
              type: 'number',
              required: false
            }
          },
          {
            type: 'time',
            value: 'name5',
            label: '名字1',
            rules: {
              type: 'number',
              must: false
            }
          },
          {
            type: 'table',
            config: {
              title: 'biaodan',
              thead: [
                {
                  label: '名字'
                },
                {
                  label: '名字1'
                },
                {
                  label: '名字2'
                }
              ],
              tbody: [
                [
                  [
                    {
                      type: 'input',
                      value: 'name1',
                      span: 12
                    },
                    {
                      type: 'input',
                      value: 'name7',
                      span: 12
                    }
                  ],
                  [
                    {
                      type: 'mult',
                      value: 'name3',
                      rules: {
                        required: false
                      },
                      children: [
                        {
                          label: '111',
                          value: 1
                        }
                      ]
                    }
                  ],
                  {
                    type: 'string',
                    value: 'aaaa'
                  }
                ]
              ]
            }
          }
        ]
      }
    }
  },
  watch: {
    form(val) {
      console.log(val)
    }
  },
  methods: {
    handleClick() {
      this.$refs.twpform.submitForm()
    }
  }
}
</script>
<style lang="scss">
.head-transport {
  background: white;
}
</style>