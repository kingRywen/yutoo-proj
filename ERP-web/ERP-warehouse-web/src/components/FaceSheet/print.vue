<template>
    <div class="canvas-pring">
        <template v-for="(item,index) in list">
            <canvas :id="`canvas${index}`"></canvas>
        </template>

        <div class="noprint barcodeBox">
            <template v-for="(item,index) in barcodeList">
                <VueBarcode :value="item.code" :options="item.options" tag="img" :ref="item.refs" style="margin-right:20px;"/>
            </template>
        </div>
    </div>
</template>
<script>
import { fabric } from 'fabric';
import VueBarcode from '@chenfengyuan/vue-barcode';
export default {
    components: {
        VueBarcode
    },
    data() {
        return {
            loading: {},
            list: [],
            canvasList: [],
            timer: null,
            timer1: null,
            barcodeVal: '123456',
            barcodeList: [],
            isReplace: false
        };
    },
    methods: {
        test(str, obj) {
            let _s = str.replace(/\{\{(\w+)\}\}/g, (match, key, value) => {
                if (obj[key] == null) {
                    console.log(obj);
                    // console.log(obj.tableKey);

                    let v = '';
                    obj.tableKey.forEach((i, j) => {
                        if (obj[i]) {
                            console.log(obj[i][0][key]);
                            v = obj[i][0][key];
                        }
                    });
                    return v;
                }
                return obj[key];
            });
            return _s;
        },
        createCanvas(arr) {
            if (!Array.isArray(arr)) return;
            this.$nextTick(() => {
                let timer = null;
                this.canvasList = arr.map((item, index) => {
                    let obj = {};
                    for (let k in item) {
                        obj = Object.assign({}, obj, item[k]);
                    }
                    return {
                        id: `canvas${index}`,
                        width: item.modelInfo.modelWidth * 35,
                        height: item.modelInfo.modelLength * 25,
                        options: item.modelInfo.modelContent,
                        canvas: new fabric.Canvas(`canvas${index}`),
                        dataAll: obj
                    };
                });
                try {
                    this.canvasList.map(item => {
                        item.canvas.setHeight(item.height);
                        item.canvas.setWidth(item.width);
                        let options = JSON.parse(item.options);
                        let optionsArr = options.objects;
                        optionsArr.map((groupKlass, index) => {
                            if ('navType' in groupKlass) {
                                switch (groupKlass.navType) {
                                    //文字
                                    case 1:
                                        let key =
                                            groupKlass.objects[
                                                groupKlass.objects.length - 1
                                            ].text;
                                        groupKlass.objects[
                                            groupKlass.objects.length - 1
                                        ].text = item.dataAll[key]
                                            ? item.dataAll[key] + ''
                                            : '-';
                                        break;
                                    //表格
                                    case 6:
                                        //外层表格
                                        let { tableList, objects } = groupKlass;
                                        let rectWidth =
                                            objects[0].objects[0].width;
                                        let rectHeight =
                                            objects[0].objects[0].height;
                                        let arr = item.dataAll[tableList].map(
                                            (j, k) => {
                                                let obj = JSON.stringify(
                                                    groupKlass.objects[1]
                                                );
                                                Object.keys(j).forEach(key => {
                                                    obj = obj.replace(
                                                        key,
                                                        j[key]
                                                    );
                                                });
                                                obj = JSON.parse(obj);
                                                // obj.top =
                                                //     groupKlass.objects[0].top +
                                                //     groupKlass.objects[0]
                                                //         .height +
                                                //     rectHeight * k -
                                                //     2;
                                                return obj;
                                            }
                                        );
                                        groupKlass.objects = [
                                            ...groupKlass.objects,
                                            ...arr
                                        ];
                                        break;
                                    // 条码
                                    case 7:
                                        let { barcodeIndex } = this;
                                        let refsKey = 'barcode' + index;
                                        let { width, height, src } = this.$refs[
                                            refsKey
                                        ][0].$el;
                                        console.log(width, height, src);

                                        groupKlass.width = width;
                                        groupKlass.height = height;
                                        groupKlass.src = src;

                                        console.log(groupKlass);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                        item.canvas.selection = false;

                        item.canvas.loadFromJSON(JSON.stringify(options));
                    });
                    let items = [];
                    this.timer = setTimeout(() => {
                        this.canvasList.map(item => {
                            items = item.canvas.getObjects();
                            items.forEach(i => {
                                i.set('selectable', false);
                            });
                        });
                    }, 500);
                    this.loading.close();

                    this.timer1 = setTimeout(() => {
                        // window.print();
                    }, 500);
                } catch (error) {
                    this.$message.error('初始化数据失败啦');
                    console.error(error);
                    this.loading.close();
                }
            });
        },
        getInfo(printType, wmPackageIds) {
            this.$api['warehouse/wmPackagePrint']({
                wmPackageIds,
                printType: Number(printType)
            }).then(res => {
                this.list = res.rows;

                this.list.map(item => {
                    let canvasOptions = JSON.parse(item.modelInfo.modelContent);
                    let objects = canvasOptions.objects;
                    let obj = {};
                    for (let k in item) {
                        obj = Object.assign({}, obj, item[k]);
                    }
                    objects.map((klass, index) => {
                        if ('navType' in klass) {
                            if (klass.navType == 7) {
                                let { barCode, barCodeText } = klass;
                                this.barcodeList.push({
                                    code: obj[barCode] || '123456',
                                    refs: 'barcode' + index,
                                    options: {
                                        displayValue: true,
                                        height: 32,
                                        // width: 1,
                                        margin: 3,
                                        textAlign: 'left',
                                        textPosition: 'top',
                                        fontOptions: 'normal',
                                        // background: '#faf9eb',
                                        textMargin: 3,
                                        fontSize: 12,
                                        text: barCodeText
                                    }
                                });
                                console.log(this.barcodeList);
                            }
                        }
                    });
                });

                this.$nextTick(() => {
                    this.createCanvas(res.rows);
                });
            });
        }
    },
    mounted() {
        this.loading = this.$loading({
            lock: true,
            text: '数据加载中...',
            background: '#ececec'
        });

        let { printType, wmPackageIds, isReplace } = this.$route.query;
        this.isReplace = isReplace;

        if (!Array.isArray(wmPackageIds)) {
            wmPackageIds = Array.of(wmPackageIds);
        }
        // 替换数据
        if (this.isReplace) {
            this.getInfo(printType, wmPackageIds);
        } else {
        }

        document.title =
            printType == 3
                ? '打印面单'
                : printType == 4
                ? '打印发票'
                : printType == 5
                ? '打印报关资料'
                : '';
    },
    beforeDestroy() {
        window.clearTimeout(this.timer);
        window.clearTimeout(this.timer1);
    }
};
</script>
<style lang="scss" scope>
@media print {
    .noprint {
        display: none !important;
    }
}

.canvas-pring {
    min-width: 740px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
    .barcodeBox {
        position: absolute;
        top: -1000px;
    }
}
.canvas-container {
    margin: 10px auto;
    background: #faf9eb;
    border-radius: 5px;
}
</style>