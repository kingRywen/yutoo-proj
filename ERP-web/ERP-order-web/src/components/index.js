import SimpleForm from './SimpleForm';
import Vue from 'vue';
import UniversalLayout from '@/components/UniversalLayout';
import Search from '@/components/search';
import logInfo from '@/components/logInfo';
import YtTable from '@/components/table';
import YtDialog from '@/components/dialog';
import CustomExport from '@/components/CustomExport';
import MenuSelect from '@/components/MenuSelect';
import TransitionType from '@/components/TransitionType';
import ECharts from 'vue-echarts/components/ECharts.vue';

Vue.use(UniversalLayout);
Vue.use(Search);
Vue.use(logInfo);
Vue.use(YtTable);
Vue.use(CustomExport);
Vue.use(TransitionType);
Vue.use(MenuSelect);
Vue.use(YtDialog);
Vue.component('chart', ECharts)
Vue.use(SimpleForm)