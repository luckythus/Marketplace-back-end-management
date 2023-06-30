import { ElMessage,ElMessageBox } from 'element-plus';
import { ElLoading } from 'element-plus';
import nProgress from 'nprogress';
// 消息提示
export function Message(message,type='success') {
    ElMessage({
        message,
        type,
    })
}

// 加载中提示
export function Loading() {
    ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
}

// 加载完毕
export function closeLoading() {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    return loading.close()
}

// 消息选择提示框
export function showMessage(content='提示内容',type='warnning',title) {
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type,
        }
    )
}

// 使用nprogress来显示进度条
// 进度条加载
export function showLoad() {
    return nProgress.start()
}
// 进度条加载完成
export function doneLoad() {
    return nProgress.done()
}

// 显示提示     传入tip,和当前文本框里面初始内容
export function showPrompt(tip,value='') {
    return ElMessageBox.prompt(tip, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: value
      })
}

// 将query对象转成url参数
export function queryParams(query) {
    let arr = []
    for (const key in query) {
        if(query[key]) {
            arr.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    let str = arr.join('&')
    str = str ? '?'+str : ''
    return str
}

// 排序商品规格选项上移功能
export function useArrayMoveUp(arr,index) {
    swapArray(arr,index,index-1)
}
// 排序商品规格选项下移功能
export function useArrayMoveDown(arr,index) {
    swapArray(arr,index,index+1)
}
// 排序函数
function swapArray(arr,index1,index2) {
    arr[index1] = arr.splice(index2,1,arr[index1])[0]
    return arr
}
// sku排列算法
export function cartesianProductOf() {
    return Array.prototype.reduce.call(arguments, function (a, b) {
        var ret = [];
        a.forEach(function (a) {
            b.forEach(function (b) {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [
        []
    ]);
  }