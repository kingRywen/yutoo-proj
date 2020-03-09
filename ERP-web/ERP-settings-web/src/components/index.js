import Vue from 'vue';
import YtDialog from '@/components/dialog';
import TransitionType from '@/components/TransitionType';
import SimpleForm from './SimpleForm';
import MainLayout from './MainLayout';
import YtTable from './table';

Vue.use(TransitionType);
Vue.use(SimpleForm);
Vue.use(YtDialog);
Vue.use(YtTable);
Vue.use(MainLayout);