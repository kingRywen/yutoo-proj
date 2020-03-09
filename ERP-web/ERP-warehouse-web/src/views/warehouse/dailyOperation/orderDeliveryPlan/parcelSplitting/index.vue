<template>
    <div class="parcelSplitting" v-loading="loading" element-loading-text="数据加载中..." element-loading-spinner="el-icon-loading">
        <!--  -->
        <div class="conten">
            <div class="package" v-for="(item,index) in packageList" :key="index">
                <div class="card">
                    <div class="package-title">
                        <span style=" font-weight: 700;">{{item.label+'-'+(index+1)}}</span>
                        <el-button type="text" icon="el-icon-delete" class="delpackage" v-if="index!=0 && item.productList.length==0" @click="del(index)"></el-button>
                    </div>
                    <el-table :data="item.productList" border class="package-product">
                        <el-table-column label="产品图片" align="center" width="120px">
                            <template slot-scope="scope">
                                <el-tooltip effect="light" placement="right">
                                    <template slot="content">
                                        <img v-lazy="scope.row.productImg" width="auto" height="180px">
                                    </template>
                                    <img v-lazy="scope.row.productImg" width="50px" height="auto" alt="产品图片">
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column prop="customSku" label="自定义SKU" align="center"/>
                        <el-table-column prop="skuStore" label="店铺SKU" align="center"/>
                        <el-table-column prop="nameZh" label="商品名称" align="center"/>
                        <el-table-column prop="logisticType" label="产品物流属性" align="center"/>
                        <el-table-column prop="variantProperty" label="规则参数" align="center">
                            <template slot-scope="scope">
                                <div v-for="i in scope.row.variantProperty">
                                    <span>{{i.propertyName}} - {{i.propertyValue}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="数量" align="center"/>
                        <el-table-column label="拆分数量" align="center">
                            <template slot-scope="scope">
                                <el-input type="number" @blur="blur(scope.row.amount,scope.row,index)" placeholder="拆分数量" size="small" v-model.number="scope.row.inputValue"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-select placeholder="移动产品" size="small" v-model="scope.row.selectValue" @change="change(scope.row,item,index,scope.$index)">
                                    <el-option :disabled="((index)==i.value)?true:false" :label="i.label+(j+1)" :value="i.value" :key="i.value" v-for="(i,j) in packageList"/>
                                </el-select>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-button type="primary" v-if="((packageList.length-1)==index)" plain size="small" class="addpackage" @click="add(index,item)">添 加 包 裹</el-button>
            </div>
        </div>
        <!--  -->
        <div class="btn">
            <el-button @click="$router.go(-1)">取 消</el-button>
            <el-button type="primary" @click="submit" :btnloading="btnloading">确 认 拆 分</el-button>
        </div>
    </div>
</template> 
<script>
export default {
    data() {
        return {
            packageList: [],
            loading: true,
            btnloading: false
        };
    },
    methods: {
        //
        submit() {
            this.btnloading = true;
            let arr = this.packageList;
            let packageInfo = arr.map(i => {
                return {
                    wmPackageId: i.wmPackageId,
                    packageProductInfo: i.productList.map(j => {
                        return {
                            wmPackageProductId: j.wmPackageProductId,
                            amount: j.amount
                        };
                    })
                };
            });
            console.log('packageInfo', packageInfo);
            this.$api['warehouse/packageSeparate']({ packageInfo }).then(
                res => {
                    this.$message.success(res.msg);
                    this.btnloading = false;
                    this.$router.push({
                        path: '/warehouse/dailyOperation/orderDeliveryPlan'
                    });
                }
            );
        },
        //移动包裹
        change(row, item, index, $index) {
            if (!row.inputValue) {
                this.$message.warning('请先输入拆分数量再移动到其他包裹');
                row.selectValue = '';
                return;
            }
            if (row.inputValue < 0) {
                row.selectValue = '';
                return this.$message.warning('拆分数量必须大于0');
            }
            let newObj = { ...row };
            newObj.amount = row.inputValue;
            newObj.selectValue = '';
            newObj.inputValue = '';
            //添加之前判断添加的包裹是否有该产品，有则数量累计，没有则添加
            let findIndex = this.packageList[
                row.selectValue
            ].productList.findIndex(i => row.baseProductId == i.baseProductId);
            if (findIndex != -1) {
                // console.log('移过来的', newObj.amount);
                // console.log('要添加的位置', findIndex);
                // console.log('加在这个数组里面', row.selectValue);
                this.packageList[row.selectValue].productList[
                    findIndex
                ].amount =
                    this.packageList[row.selectValue].productList[findIndex]
                        .amount + newObj.amount;
            } else {
                this.packageList[row.selectValue].productList.push(newObj);
            }
            row.amount = row.amount - row.inputValue;
            row.selectValue = '';
            row.inputValue = '';
            //如果产品全部移走 则删除该包裹产品
            if (row.amount == 0) {
                // console.log('全部移走', row.amount);
                this.packageList[index].productList.splice($index, 1);
            }
        },
        //校验数量
        blur(beforVal, row, index) {
            let curVal = row.inputValue;
            if (index == 0) {
                // eslint-disable-next-line
                if (curVal > 0 && curVal < beforVal) {
                } else {
                    this.$message.warning(
                        '拆分数量只能大于当前数量，且不能为0'
                    );
                    row.inputValue = '';
                    return;
                }
            } else {
                // eslint-disable-next-line
                if (curVal > 0 && curVal <= beforVal) {
                } else {
                    this.$message.warning(
                        '拆分数量只能大于或等于当前数量，且不能为0'
                    );
                    row.inputValue = '';
                }
            }
        },
        //添加包裹
        add(index, item) {
            if (!item.productList.length) {
                return this.$message.warning('当前包裹无产品不能添加');
            }
            this.packageList.push({
                label: '包裹',
                value: 1 + index,
                productList: []
            });
        },
        //删除包裹
        del(index) {
            this.packageList.splice(index, 1);
        },
        //获取包裹信息
        getPackageInfo(wmPackageId) {
            this.$api['warehouse/packageProductSeparateInfo']({
                wmPackageId
            }).then(res => {
                const arr = [...res.rows.orderProductInfo];
                arr.forEach(item => {
                    item['selectValue'] = '';
                    item['inputValue'] = '';
                });
                this.packageList.push({
                    label: '包裹',
                    value: 0,
                    wmPackageId: res.rows.wmPackageId,
                    productList: arr
                });
                this.loading = false;
            });
        }
    },
    created() {
        this.getPackageInfo(this.$route.params.id);
    }
};
</script>

<style lang="scss" scope>
.parcelSplitting {
    display: flex;
    flex-direction: column;
    height: 100%;
    .conten {
        flex: 1;
        overflow-y: auto;
        padding: 2px;
        .package {
            margin-bottom: 20px;
            .card {
                &:hover {
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                    transition: 0.3s;
                }
            }
            .package-title {
                display: flex;
                justify-content: space-between;
                height: 38px;
                line-height: 38px;
                border: 1px solid #ebeef5;
                border-bottom: none;
                padding: 0 10px;
                background: #f5f7fa;

                .delpackage {
                    i {
                        font-size: 18px;
                        color: #f56c6c;
                    }
                }
            }
            .package-product {
                width: 100%;
            }
            .addpackage {
                margin-top: 10px;
            }
        }
    }
    .btn {
        height: 38px;
        text-align: center;
    }
}
</style>
