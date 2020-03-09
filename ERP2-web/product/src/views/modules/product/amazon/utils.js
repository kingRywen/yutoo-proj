import formUtils from 'Components/NewForm/utils.js';

function getOpts(itemSign, isSystemProperty) {
    
    if (itemSign && getOpts[itemSign]) {
        return getOpts[itemSign]
    } else {
        return getOpts[itemSign] = GLOBAL.ajax[`product/ptTemplatePropertyItemList`]({
            itemSign,
            isSystemProperty
        }).then(data => {
            return data.rows.map(el => ({
                label: el.itemLabel,
                value: el.itemValue
            }))
        })
    }
    
}
export function options(itemSign, isSystemProperty) {
    return () => getOpts(itemSign, isSystemProperty)
}




/**
 * 将表单值设置到每组tabs的props中
 * @param {*} obj           分组对象
 * @param {*} e             单个表单对象
 * @param {*} key           propertikey
 * @param {*} variants      所有变体值 ，包含变体属性值 和变体差异值
 * @param {*} themeData     主题数据，只有需要主题筛选的时候传
 * @param {*} data          平台，店铺编辑时传，比较全的数据
 */
export function setToEl(obj, e, key, variants, themeData, data) {
    // 判断变体属性是不是普通属性，根据用户选择的主题来判断
    function variantFormIsVariant(prop) {
        let selectTheme = data ? themeData.find(
            el => el.variationThemeAmzId === data.variationThemeAmzId
        ) : null
        if (!selectTheme) {
            return true
        }
        return selectTheme.propertys.find(
            el => el.propertyId === prop.propertyId
        )
    }

    
    // 区分变体、变体信息 与 普通tabs
    if (
        obj.propertyGroupKey === '变体信息' ||
        obj.propertyGroupKey === '变体'
    ) {
        if (!obj.props) {
            obj.props = {
                table: {
                    type: 'table',
                    label: 'table',
                    width: 'auto',
                    head: {},
                    rows: {
                        label: '平台SKU',
                        value: 'platSku',
                        props: {}
                    }
                }
            }
        }
        if (!obj.props.table.rows.hasProp) {
            // 将变体和变体差异转化成表格数据
            variants && variants
                .sort(a => (a.parentFlag ? -1 : 1))
                .filter(e => obj.propertyGroupKey === '变体' ? e.parentFlag == 0 : e)
                .forEach(el => {
                    obj.props.table.rows.props[el.platSku] = {
                        defaultVal: el.propertys.reduce((total, cur) => {
                            if ((cur.fixedPropertyFlag || (cur.variantsFlag && variantFormIsVariant(cur))) && obj.propertyGroupKey === '变体') {
                                total[cur.propertyId] = cur.propertyValue
                            } else if (
                                cur.variantsDifferenceFlag &&
                                obj.propertyGroupKey === '变体信息'
                            ) {
                                total[cur.propertyId] = cur.propertyValue
                            }
                            return total
                        }, {
                            productPlatId: el.productPlatId,
                            platSku: el.platSku,
                            parentFlag: el.parentFlag
                        })
                    }
                })

            obj.props.table.rows.hasProp = true
            // console.log(obj.props.table.rows.props);
        }

        obj.props.table.head[key] = { ...e, noLabel: true }
        return
    } else {
        if (e.required && formUtils.isEmpty(e.propertyValue) && formUtils.isEmpty(e.defaultValue)) {
            obj.validSuccess = false
        }
    }
    if (!obj.props) {
        obj.props = {}
    }
    obj.props[key] = e
}

export function switchToForm(params, groupEl, data, span = 24, noLabel) {
    let lines, ret, _span
    // 特殊属性类型 0，普通属性， 1，同一标识的属性一行显示 2，同一标识用户可以一行一行加着填写
    switch (params.specialType) {
        case 1:
            // 一行显示

            lines = data.lines.find(el => el.specialSign === params.specialSign)
            _span = parseInt(24 / (lines.propertys.length + 1))
            ret = setForm(params, _span)
            lines &&
                lines.propertys.forEach(el => {
                    setToEl(
                        groupEl,
                        switchToForm({...el, specialType: 0}, groupEl, data, _span, true),
                        el.propertyId
                    )
                })
            break
        case 2:
        default:
            // 普通属性
            ret = setForm(params, span, noLabel)
            break
    }
    return ret
}

/**
 * 将后端单个表单数据处理成前端可用单个表单数据
 * @param {object} param0   表单对象
 * @param {number} span          宽度
 * @param {boolean} noLabel       是否展示label
 */
export function setForm(
    {
        controlType,
        dataType,
        specialType,
        dataMaxLength,
        maxValue,
        itemSign,
        propertyType,
        fixedPropertyFlag,
        isSystemProperty,
        minValue,
        defaultValue: defaultVal,
        propertyValue,
        variantsFlag,
        variantsDifferenceFlag,
        mustFlag: required,
        specialNum,
        propertyNameEn: label,
        propertyDesc: content,
        decimalPlaces: precision
    },
    span = 24,
    noLabel,
    propertys
) {
    defaultVal = defaultVal || propertyValue
    const isArrayVals = [3, 11, 12]
    if (isArrayVals.indexOf(controlType) > -1) {
        defaultVal =
            typeof defaultVal === 'string'
                ? defaultVal
                    .split('@,,#@')
                    .map(el => (dataType == 2 ? el : Number(el)))
                    .filter(el => !isNaN(el))
                : []
    }
    let ret = {
        variantsFlag,
        variantsDifferenceFlag,
        fixedPropertyFlag,
        propertyType,
        label,
        span,
        defaultVal,
        required: !!required,
        maxlength: dataMaxLength,
        noLabel,
        tip: {
            // 帮助信息
            content, // 内容
            icon: 'el-icon-info' // 图标
        }
    },
        ex = {}
    if (propertys) {
        // 同一行
        let child = {}
        propertys.forEach(e => {
            child[e.propertyId] = setForm(e, propertys.length, true)
        })
        ret.child = child
    }
    if (specialType == 2) {
        // 累加
        ret.lenMax = specialNum
        // ret.defaultVal =
    }
    switch (controlType) {
        // 控件类型 1.输入框 2.单选框 3.多选框 4.多行文本输入框 5.radio 6.日期 7.文本框 8.可输入单选框 9.switch 10.时间 11.复选框 12.可输入多选框 13.自定义控件
        case 1:
            // 数据类型1.整数，2.字符串，3.日期，4.布尔，5.小数
            if (dataType == 1) {
                ex = {
                    widget: 'number',
                    min: minValue,
                    max: maxValue
                }
            } else if (dataType == 5) {
                ex = {
                    widget: 'number',
                    precision
                }
            }
            break

        case 2:
            ex = {
                widget: 'select',
                options: options(itemSign, isSystemProperty)
            }
            break

        case 3:
            ex = {
                widget: 'select',
                options: options(itemSign, isSystemProperty),
                multi: true
            }
            break

        case 4:
            ex = {
                widget: 'textarea'
            }
            break

        case 5:
            ex = {
                widget: 'radio',
                options: options(itemSign, isSystemProperty)
            }
            break

        case 6:
            ex = {
                widget: 'date',
                defaultVal: defaultVal == null ? null : new Date(defaultVal)
            }
            break

        case 7:
            ex = {
                widget: 'editor'
            }
            break

        case 8:
            ex = {
                widget: 'select',
                options: options(itemSign, isSystemProperty),
                allowCreate: true
            }
            break

        case 9:
            ex = {
                widget: 'switch',
                options: options(itemSign, isSystemProperty)
            }
            break

        case 10:
            ex = {
                widget: 'datetime',
                time: true,
                options: options(itemSign, isSystemProperty)
            }
            break

        case 11:
            ex = {
                widget: 'checkbox',
                options: options(itemSign, isSystemProperty)
            }
            break

        case 12:
            ex = {
                widget: 'select',
                options: options(itemSign, isSystemProperty),
                allowCreate: true,
                multi: true
            }
            break

        default:
            break
    }
    return { ...ret, ...ex }
}

/**
 * 生成amazon平台编辑动态数据
 * @param {object} data                     表单数据
 * @param {object} themeData                变体主题数据
 * @param {array} selectedThemeVarProps     选择theme后获取到的变体属性值
 */
export function generateInputConf(data, themeData, selectedThemeVarProps = []) {
    // 如果已经存在选择的变体主题，需要过滤掉不在变体主题里的属性
    let selectTheme = themeData.find(
        el => el.variationThemeAmzId === data.variationThemeAmzId
    )

    const {
        catePlatId,
        catePlatName,
        templateId,
        templateType,
        variants: existVariants,
        variantPropertyValues,
        variationThemeAmzId
    } = data
    // 获取所有分组
    let groups = JSON.parse(JSON.stringify(data.propertyGroups))
    if (!groups.find(el => el.propertyGroupKey === '变体信息')) {
        groups.splice(3, 0, { propertyGroupKey: '变体信息' })
    }
    if (!groups.find(el => el.propertyGroupKey === '变体')) {
        groups.splice(1, 0, { propertyGroupKey: '变体' })
    }
    let combineVariantsInfo = existVariants.map(el => {
        let curVal = variantPropertyValues.find(e => e.platSku === el.platSku)
        if (!el.propertys) {
            el.propertys = []
        }
        const selectThemeVal = selectedThemeVarProps.find(e => e.platSku === el.platSku)
        if (selectThemeVal) {
            selectThemeVal.propertys.forEach(el => {
                if (!curVal.propertys.find(e => e.propertyId === el.propertyId)) {
                    curVal.propertys.push(el)
                }
            })
        }

        return { ...el, ...curVal }
    })
    data.templatePropertys.forEach(item => {
        const el = groups.find(e => e.propertyGroupKey === item.propertyGroupKey)
        const variantDeffs = groups.find(e => e.propertyGroupKey === '变体信息')
        const variants = groups.find(e => e.propertyGroupKey === '变体')
        item.propertys.forEach(prop => {

            switch (true) {
                // 固有属性
                case prop.fixedPropertyFlag == 1:
                    setToEl(
                        variants,
                        switchToForm(prop, variants, data),
                        prop.propertyId,
                        combineVariantsInfo
                    )
                    return
                case prop.variantsFlag == 1:
                    // 如果是变体属性
                    if (variationThemeAmzId == null || variationThemeAmzId === '') {
                        setToEl(
                            variants,
                            switchToForm(prop, variants, data),
                            prop.propertyId,
                            combineVariantsInfo, themeData, data
                        )
                    } else {

                        if (!selectTheme) {
                            throw new Error('不存在的主题')
                        }
                        if (
                            selectTheme.propertys.find(
                                el => el.propertyId === prop.propertyId
                            )
                        ) {
                            setToEl(
                                variants,
                                switchToForm(prop, variants, data),
                                prop.propertyId,
                                combineVariantsInfo, themeData, data
                            )
                        } else {
                            // 这里变体属性是否会是变体差异？
                            setToEl(el, switchToForm(prop, el, data), prop.propertyId)
                        }
                    }

                    return
                case prop.variantsDifferenceFlag == 1:
                    // 如果是变体差异属性
                    setToEl(
                        variantDeffs,
                        switchToForm(prop, variantDeffs, data),
                        prop.propertyId,
                        combineVariantsInfo, themeData, data
                    )
                    return

                default:
                    // 普通属性
                    if (variationThemeAmzId == null || variationThemeAmzId === '') {
                        setToEl(el, switchToForm(prop, el, data), prop.propertyId)
                    } else {
                        if (!selectTheme) {
                            throw new Error('不存在的主题')
                        }
                        if (
                            selectTheme.propertys.find(
                                el => el.propertyId === prop.propertyId
                            )
                        ) {
                            setToEl(
                                variants,
                                switchToForm(prop, variants, data),
                                prop.propertyId,
                                combineVariantsInfo, themeData, data
                            )
                        } else {
                            // 这里变体属性是否会是变体差异？
                            setToEl(el, switchToForm(prop, el, data), prop.propertyId)
                        }
                    }
                    // setToEl(el, switchToForm(prop, el, data), prop.propertyId)
                    break
            }
        })
    })
    console.log(groups)
    return {
        formData: groups.map(el => ({ ...el, value: {} })),
        catePlatId,
        catePlatName,
        templateId,
        templateType,
        variationThemeAmzId,
        variants: existVariants
    }
}

/**
 * amazon平台编辑提交数据时转化成后端需要的数据
 * @param {array} formData 填好的表单数据
 */
export function generateReqData(formData) {
    function getTableData(item) {
        return item.value.table.map(e => {
            const head = item.props.table.head
            let { parentFlag, platSku, productPlatId, ...info } = e
            const propertys = Object.keys(info).filter(key => head[key]).map(key => ({
                propertyId: +key,
                propertyValue: info[key],
                propertyType: head[key].propertyType
            }))
            return { parentFlag, platSku, productPlatId, propertys }
        })
    }
    function getNormalData(item) {
        const { value, propertyGroupKey } = item
        let ret = { propertyGroupKey, propertys: [] }
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                let i = {}
                const element = value[key];
                i.propertyId = key
                i.propertyValue = element
                i.propertyType = item.props[key].propertyType
                ret.propertys.push(i)
            }
        }
        return ret
    }
    let data = { templatePropertys: [] }
    formData.forEach(el => {
        if (el.propertyGroupKey === '变体信息') {
            data.variantsDifferences = getTableData(el)
        } else if (el.propertyGroupKey === '变体') {
            data.variants = getTableData(el)
        } else {
            data.templatePropertys.push(getNormalData(el))
        }
    })

    return data
}

/**
 * 获取amazon刊登上架表单值、跟卖表单值
 * @param {*} stores        选择的店铺列表
 * @param {*} storeDif      店铺差异还是店铺变体差异，店铺变体差异以SKU为维度
 */
export function getStores(stores, storeDif = true) {
    let ret = [],
        _stores = stores.map(info => {
            return {
                storeId: info.storeId,
                storeName: info.storeName
            }
        })
    if (storeDif) {
        return _stores
    } else {
        stores[0].platSkus.forEach(el => {
            _stores.forEach((store, index) => {
                ret.push({
                    rowKey: store.storeId + el.platSku + index,
                    storeId: store.storeId,
                    storeName: store.storeName,
                    length: index == 0 ? _stores.length : undefined,
                    ...el
                })
            })
        })
        return ret
    }
}

/**
 * amazon刊登上架时需要生成的店铺差异和店铺变体差异信息
 * @param {array} rows     需要生成表单的后端数据
 * @param {array} saleType      销售类型 0-跟卖，1-自主上架
 */
export function generateUploadDiffs(rows, saleType) {
    const { propertys, lines } = rows
    console.log(propertys);
    let varSchema = {
        table: {
            // 表格数据
            type: 'table',
            label: 'table',
            width: 'auto', // 保持宽度自动 
            head: {
            },
            rows: {
                // 行信息
                label: '平台SKU', // 每一行的标记数据 一般为SKU,也是表头之一
                value: 'platSku',
                rowKey: 'rowKey',
                // eslint-disable-next-line no-unused-vars
                spanMethod({ row, column, rowIndex, columnIndex }) {
                    if (columnIndex === 1) {
                        if (row.length) {
                            return {
                                rowspan: row.length,
                                colspan: 1
                            }
                        } else {
                            if (rowIndex == 0) {
                                return {
                                    rowspan: 1,
                                    colspan: 1
                                }
                            }
                            return {
                                rowspan: 0,
                                colspan: 0
                            }
                        }
                    }
                },
                children: [
                    {
                        label: '店铺名称',
                        value: 'storeName'
                    },
                    {
                        label: 'Seller SKU',
                        value: 'sellerSku'
                    },
                ]
            }
        }
    }, storeSchema = {
        table: {
            // 表格数据
            type: 'table',
            label: 'table',
            width: 'auto', // 保持宽度自动 
            head: {
            },
            rows: {
                // 行信息
                label: '店铺名称', // 每一行的标记数据 一般为SKU,也是表头之一
                value: 'storeName'
            }
        }
    }
    propertys.forEach(el => {
        let ret
        if (el.specialType == 2) {
            // 同一行
            ret = setForm(el, 24, true, lines.find(e => e.specialSign === el.specialSign).propertys)
        } else {
            ret = setForm(el, 24, true)
        }
        if (el.variantsDifferenceFlag) {
            // 如果是变体差异，归于店铺变体差异的列表
            varSchema.table.head[el.propertyId] = ret
        } else if (saleType == 1) {
            storeSchema.table.head[el.propertyId] = ret
        }
    })
    return {
        varSchema,
        storeSchema
    }
}

/**
 * amazon生成跟卖表单数据
 * @param {object} rows 后台返回的数据
 */
export function generateSell(rows) {
    const { propertys, lines } = rows
    let schema = {
        table: {

            // 表格数据
            type: 'table',
            label: 'table',
            width: 'auto', // 保持宽度自动 
            head: {
                0: setForm({ controlType: 1, dataType: 2, mustFlag: true, propertyNameEn: 'Seller Sku' }, 24, true)
            },
            rows: {
                // 行信息
                label: '店铺名称', // 每一行的标记数据 一般为SKU,也是表头之一
                value: 'storeName'
            }
        }
    }

    propertys.forEach(el => {
        let ret
        if (el.specialType == 2) {
            // 同一行
            ret = setForm(el, 24, true, lines.find(e => e.specialSign === el.specialSign).propertys)
        } else {
            ret = setForm(el, 24, true)
        }
        schema.table.head[el.propertyId] = ret
    })
    console.log(schema);

    return schema
}
