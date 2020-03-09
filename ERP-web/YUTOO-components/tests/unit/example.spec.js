import {
  expect
} from 'chai'
import {
  shallowMount
} from '@vue/test-utils'
import TreeSelect from '@/components/TreeSelect/src/TreeSelect'

describe('TreeSelect.vue', () => {
  it('renders props.msg when passed', () => {
    const value = 'new message'
    const wrapper = shallowMount(TreeSelect, {
      propsData: {
        value
      }
    })
    expect(wrapper.text()).to.include(value)
    expect(wrapper.vm.value).to.equal(value)
  })
})
