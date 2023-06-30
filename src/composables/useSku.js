import { computed, nextTick, ref } from 'vue'
import {
    createGoodsSkuCard,
    updateGoodsSkusCard,
    deleteGoodsSkuCard,
    sortGoodsSkuCard,
    createGoodsSkuCardValue,
    updateGoodsSkuCardValue,
    deleteGoodsSkuCardValue,
    chooseAndSetGoodsSkuCard,
} from '@/api/goods'
import {
    useArrayMoveUp,
    useArrayMoveDown,
    Message,
    cartesianProductOf
} from './util'

// 获取当前的商品的ID
export const goodsId = ref(0)
// 获取规格选项列表
export const sku_card_list = ref([])
// 定义一个响应式的数组，在规格设置中 用来获取当前规格选项的内容和值
export const sku_list = ref([])


// 初始化规格选项列表
export function initSkuCardList(data) {
    sku_card_list.value = data.goodsSkusCard.map(item => {
        // 每个属性的name值，如果没提交，则能显示之前name，防止没提交name又被修改
        item.text = item.name
        // 设置item的状态
        item.loading = false
        // 设置规格选项中的规格值
        item.goodsSkusCardValue.map(o => {
            // 同样，保存之前值
            o.text = o.value || '属性值'
            return o
        })
        return item
    })
    // 获取到规格选项列表里面当前规格选项的内容和值，它们都存在data.goodsSkus中
    sku_list.value = data.goodsSkus
}

// 初始化每个规格选项中的规格值列表
export function initSkuCardItem(id) {
    // 拿到选项id，获取选项里面规格值，是一个数组,转为对象
    const item = sku_card_list.value.find(o => o.id == id)
    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref()
    // 定义添加规格选项值的加载状态
    const loading = ref(false)

    // 删除规格值的id
    const handleClose = (tag) => {
        loading.value = true
        deleteGoodsSkuCardValue(tag.id).then(res => {
            // 拿到当前删除项的id
            let i = item.goodsSkusCardValue.findIndex(o => o.id === tag.id)
            item.goodsSkusCardValue.splice(i, 1)
            getTableData()
        })
            .finally(() => {
                loading.value = false
            })
    }

    // 从标签变成输入框
    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value.input.focus()
        })
    }

    // 修改输入框的选项值
    const handleChange = (value, tag) => {
        loading.value = true
        updateGoodsSkuCardValue(tag.id, {
            goods_skus_card_id: id, //规格ID
            name: item.name, //规格名称
            order: tag.order, //排序
            value: value //规格选项名称
        })
            .then(res => {
                tag.value = value
                getTableData()
            })
            .catch(err => {
                tag.text = tag.value
            })
            .finally(() => {
                loading.value = false
            })
    }

    // 确认添加后的操作
    const handleInputConfirm = () => {
        if (!inputValue.value) {
            inputVisible.value = false
            return
        }
        loading.value = true
        createGoodsSkuCardValue({
            goods_skus_card_id: id, //当前的规格ID
            name: item.name, //当前的规格名称
            order: 50, //排序
            value: inputValue.value //规格选项名称
        }).then(res => {
            item.goodsSkusCardValue.push({
                ...res,
                text: res.value
            })
            getTableData()
        }).finally(() => {
            inputVisible.value = false
            inputValue.value = ''
            loading.value = false
        })
    }

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        loading,
        handleClose,
        handleChange,
        showInput,
        handleInputConfirm
    }
}
//  初始化规格设置中的表格
export function initSkuTable() {
    // 获取当前商品规格中有多少规格选项的内容个数，把规格选项内容个数中且有值的拿到,用computed是为了把它变成响应式
    const skuLabels = computed(() => sku_card_list.value.filter(o => o.goodsSkusCardValue.length > 0))
    // 定义固定表头
    const tableThs = computed(() => {
        // 表头的商品规格部分根据规格选项的个数来确定合并多少列
        let length = skuLabels.value.length
        return [
            {
                name: '商品规格',
                colspan: length,
                widht: '',
                rowspan: length > 0 ? 1 : 2
            },
            {
                name: '销售价',
                width: '100',
                rowspan: 2
            },
            {
                name: '市场价',
                width: '100',
                rowspan: 2
            },
            {
                name: '成本价',
                width: '100',
                rowspan: 2
            },
            {
                name: '库存',
                width: '100',
                rowspan: 2
            },
            {
                name: '体积',
                width: '100',
                rowspan: 2
            },
            {
                name: '重量',
                width: '100',
                rowspan: 2
            },
            {
                name: '编码',
                width: '100',
                rowspan: 2
            },
        ]
    })
    // 返回需要的参数
    return {
        skuLabels,
        sku_list,
        tableThs
    }
}
// 定义商品规格Loading状态
export const btnLoading = ref(false)

// 添加商品规格选项
export function addSkuCardEvent() {
    createGoodsSkuCard({
        goods_id: goodsId.value, //商品ID
        name: "规格名称", //规格名称
        order: 50, //排序
        type: 0 //规格类型 0文字
    }).then(res => {
        btnLoading.value = true
        sku_card_list.value.push({
            ...res,
            text: res.name,
            loading: false,
            goodsSkusCardValue: []
        })
    }).finally(() => {
        btnLoading.value = false
    })
}

// 更新商品规格选项
export function handleUpdate(item) {
    // 将当前项的加载状态改为true
    item.loading = true

    updateGoodsSkusCard(item.id, {
        goods_id: item.goods_id, //商品ID
        name: item.text, //将更新后的text作为name规格名称
        order: item.order, //排序
        type: 0 //规格类型 0文字
    })
        .then(res => {
            // 更新成功，则将保存更新后的text赋给name
            item.name = item.text
        })
        .catch(err => {
            // 更新失败时，原始name保持不变，将text重新变为原始name
            item.text = item.name
        })
        .finally(() => {
            item.loading = false
        })
}

// 删除商品规格选项
export function handleDelete(item) {
    item.loading = true
    // 该删除接口响应成功返回一个true
    deleteGoodsSkuCard(item.id).then(res => {
        // 找到匹配当前规格选项的id，然后返回当前规格选项的索引
        const index = sku_card_list.value.findIndex(o => o.id == item.id)
        if (index != -1) {
            sku_card_list.value.splice(index, 1)
        }
        getTableData()
        Message('删除成功！')
    })
}

// 更多选项中选择设置商品规格和值
export function handleChooseSetGoodsSkusCard(id, data) {
    let item = sku_card_list.value.find(o => o.id == id)
    item.loading = true
    chooseAndSetGoodsSkuCard(id, data)
        .then(res => {
            item.name = item.text = res.goods_skus_card.name
            item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
                o.text = o.value || '属性值'
                return o
            })
            getTableData()
        })
        .finally(() => {
            item.loading = false
        })
}

// 设置卡片加载状态
export const bodyLoading = ref(false)
// 上移或下移排序商品规格选项
export function sortCard(action, index) {
    // 深拷贝一个数组来替代规格列表模拟排序
    let oList = JSON.parse(JSON.stringify(sku_card_list.value))
    let func = action == 'up' ? useArrayMoveUp : useArrayMoveDown
    // 模拟排序
    func(oList, index)
    // 获取到排序后的列表
    let sortData = oList.map((item, index) => {
        return {
            id: item.id,
            order: index + 1
        }
    })
    // 调用前先加载卡片状态
    bodyLoading.value = true
    // 调用排序商品规格选项接口
    sortGoodsSkuCard({
        sortdata: sortData
    }).then(res => {
        // 获取到最新的id，再排序
        func(sku_card_list.value, index)
        getTableData()
    }).finally(() => {
        bodyLoading.value = false
    })
}

// 获取规格表格数据
function getTableData(){
    setTimeout(() => {
        if(sku_card_list.value.length === 0) return []

        let list = []
        sku_card_list.value.forEach(o=>{
            if(o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0){
                list.push(o.goodsSkusCardValue)
            }
        })

        if(list.length == 0){
            return []
        }

        let arr = cartesianProductOf(...list)

        // 获取之前的规格列表，将规格ID排序后转化成字符串，用来比较。
        let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
            if(!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }
            o.skusId = o.skus.sort((a,b) => a.id-b.id).map(s => s.id).join(',')
            return o
        })
        sku_list.value = []
        sku_list.value = arr.map(skus=>{
            let o = getBeforSkuItem(JSON.parse(JSON.stringify(skus)),beforeSkuList)
            return {
                code: o?.code || "",
                cprice:o?.cprice || "0.00",
                goods_id: goodsId.value,
                image: o?.image || "",
                oprice: o?.oprice || "0.00",
                pprice: o?.pprice || "0.00",
                skus,
                stock: o?.stock || 0,
                volume: o?.volume || 0,
                weight: o?.weight || 0,
            }
        })
    }, 200)
}
// 判断list数组中的规格选项有没有值，如果只有规格选项而没有规格选项的内容值，则return[]
  // 赋值前先清空sku_list里面的数据
  // 使用map来操作arr，对应sku_list里面的数据格式来返回,再赋值给sku_list

  function getBeforSkuItem(skus,beforeSkuList) {
    let skusId = skus.sort((a,b) => a.id-b.id).map(s => s.id).join(',')
    return beforeSkuList.find(o => {
        if(skus.length > o.skus.length) {
            return skusId.indexOf(o.skusId) != -1
        }
        return o.skusId.indexOf(skusId) != -1
    })
  }
