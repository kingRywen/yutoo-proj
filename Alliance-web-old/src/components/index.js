import Vue from 'vue'
import YtDialog from './dialog'
import TransitionType from './TransitionType';
import None from './None';
import SimpleForm from './SimpleForm';
import MainLayout from '../layouts/MainLayout';

Vue.use(YtDialog)
Vue.use(SimpleForm)
Vue.use(TransitionType)
Vue.use(None)
Vue.component(MainLayout.name, MainLayout);