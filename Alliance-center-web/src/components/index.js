import Vue from 'vue'
import YtDialog from './dialog'
import TransitionType from './TransitionType';
import None from './None';
import SimpleForm from './SimpleForm';
import MainLayout, { CollapseWrapper } from '../layouts/MainLayout';
import SyncCascader from './SimpleForm/src/SyncCascader';
import Widget from './Widget';
import NewForm from './NewForm';
import NewMainLayout from './MainLayout';
import PageHeader from './PageHeader';
import YtTable from './table';

Vue.use(YtDialog)
Vue.use(YtTable)
Vue.use(PageHeader)
Vue.use(NewMainLayout)
Vue.use(NewForm)
Vue.use(Widget)
Vue.use(SimpleForm)
Vue.use(TransitionType)
Vue.use(None)
Vue.component(MainLayout.name, MainLayout);
Vue.component(CollapseWrapper.name, CollapseWrapper);
Vue.component(SyncCascader.name, SyncCascader);