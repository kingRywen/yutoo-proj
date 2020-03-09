import Vue from 'vue';
import {Button, 
  Select,
  Option ,
  DatePicker,
  Input,
  Form,
  FormItem,
  Table,
  TableColumn,
  Loading,
  Pagination
} from 'element-ui';
import App from './App.vue';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Input.name, Input);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Pagination.name, Pagination);
Vue.use(Loading);

new Vue({
  el: '#app',
  render: h => h(App)
});