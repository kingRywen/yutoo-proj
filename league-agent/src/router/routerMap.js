import {
    importComponent
} from './index';
export default {
    layout: {
        default: () => importComponent(import(`Layout/Layout.vue`)),
        w1100: () => importComponent(import(`Layout/w1100.vue`))
    },
    recharge: () => importComponent(import(`Views/Recharge`)),
    spend_list: () => importComponent(import(`Views/SpendList`)),
    recycling: () => importComponent(import(`Views/Recycling`)),
    stores: () => importComponent(import(`Views/Stores`)),
    addStore: () => importComponent(import(`Views/AddStore`)),
    editStore: () => importComponent(import(`Views/EditStore`)),
    help: () => importComponent(import(`Views/Help`)),
    feedback: () => importComponent(import(`Views/Feedback`)),
    addTask: () => importComponent(import(`Views/AddTask`)),
    viewTask: () => importComponent(import(`Views/ViewTask`)),
    editTask: () => importComponent(import(`Views/EditTask`)),
    quickAdd: () => importComponent(import(`Views/QuickAdd`)),
    message: () => importComponent(import(`Views/Message`)),
    user: () => importComponent(import(`Views/User`)),
    editPass: () => importComponent(import(`Views/EditPass`)),
    findPass: () => importComponent(import(`Views/FindPass`))
};
