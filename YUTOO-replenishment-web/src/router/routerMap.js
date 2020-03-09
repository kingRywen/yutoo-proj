import {
    importComponent
} from './index';
export default {
    layout: {
        default: () => importComponent(import(`Layout/Layout.vue`)),
        w1100: () => importComponent(import(`Layout/w1100.vue`))
    },
    IntelligentReplenishment: {
        default: () => importComponent(import(`Views/intelligent-replenishment/intelligent-replenishment`)),
        SynchronousLog: () => importComponent(import(`Views/intelligent-replenishment/synchronousLog/synchronousLog`)),
        setCalculate: {
            default: () => importComponent(import(`Views/intelligent-replenishment/setCalculate/setCalculate`)),
            Add: () => importComponent(import(`Views/intelligent-replenishment/setCalculate/Add`)),
            'edit': () => importComponent(import(`Views/intelligent-replenishment/setCalculate/Add`)),
        },
        batchReplenishment: () => importComponent(import(`Views/intelligent-replenishment/batch-intelligent-replenishment`)),
        Replenishment: () => importComponent(import(`Views/intelligent-replenishment/replenishment/replenishment`)),
        Produce: () => importComponent(import(`Views/intelligent-replenishment/Produce`))

    }
};