<template>
    <el-form size="small" class="form-item-table" :model="form" :rules="rules" ref="form" label-width="0px">
        <el-table size="mini" :data="form.list" border style="width: 100%">
            <el-table-column prop="activeName" label="款式" align="center" />
            <el-table-column label="时间" align="center">
                <template slot-scope="scope">
                    <el-form-item>
                        <el-select v-model="form.list[scope.$index].calculationDays" style="width: 90%">
                            <el-option :label="item.label" :value="item.value" v-for="(item,index) in timeList" :key="index" />
                        </el-select>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="销量区间" align="center">
                <template slot-scope="scope">
                    <div style="display: flex;flex-wrap: wrap;">
                        <el-form-item prop="time" style="flex:1">
                            <el-input-number :precision="0" @change="handleSaleChange(scope.$index,'minSale')" v-model="form.list[scope.$index].minSale" controls-position="right" :min="1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="~" prop="time" style="flex:1">
                            <el-input-number :precision="0" v-model="form.list[scope.$index].maxSale" controls-position="right" :min="(form.list[scope.$index].minSale)+1"></el-input-number>
                        </el-form-item>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="呆滞库龄区间 " align="center">
                <template slot-scope="scope">
                    <div style="display: flex;flex-wrap: wrap;">
                        <el-form-item prop="time" style="flex:1">
                            <el-input-number :precision="0" @change="handleSaleChange(scope.$index,'sluggishMinDays')" v-model="form.list[scope.$index].sluggishMinDays" controls-position="right" :min="1"></el-input-number>
                        </el-form-item>
                        <el-form-item label="~" prop="time" style="flex:1">
                            <el-input-number :precision="0" v-model="form.list[scope.$index].sluggishMaxDays" controls-position="right" :min="(form.list[scope.$index].sluggishMinDays)+1"></el-input-number>
                        </el-form-item>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-form>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            timeList: [
                {
                    label: '一天',
                    value: 1
                },
                {
                    label: '一周',
                    value: 7
                },
                {
                    label: '二周',
                    value: 14
                },
                {
                    label: '一个月',
                    value: 30
                }
            ],
            form: {
                list: []
            },
            rules: {}
        };
    },
    methods: {
        _submit() {
            return this.$api['product/categoryActiveSetupUpdate'](
                this.form.list
            );
        },
        handleSaleChange(index, type) {
            if (
                type == 'minSale' &&
                this.form.list[index].minSale >= this.form.list[index].maxSale
            ) {
                this.form.list[index].maxSale = null;
            }
            if (
                type == 'sluggishMinDays' &&
                this.form.list[index].sluggishMinDays >=
                    this.form.list[index].sluggishMaxDays
            ) {
                this.form.list[index].maxSale = null;
            }
        },
        init() {
            this.$api['product/categoryActiveSetupInfo']({
                id: this.id
            }).then(res => {
                this.form.list = [...res.rows];
            });
        }
    },
    mounted() {
        this.init();
    }
};
</script>