import { downloadFile } from './index'
import Vue from 'vue';
let XLSX
/**
 * 下载JSON数据为xlsx表格
 * @param {Array} aoa 要导出的数据
 * @param {Object} options 导出选项，可以进行合并单元格等参数的传递
 * @param {String} fileName 导出文件名
 * @param {String} csv 是否导出格式改为csv
 * @example 普通导出
 * exportEXCEL(
      [
        ['姓名', '性别', '年龄', '注册时间'],
        ['张三', '男', 18, new Date()],
        ['李四', '女', 22, new Date()]
      ]
    )
 * @example 合并单元格导出
 * exportEXCEL(
      [
        ['主要信息', null, null, '其它信息'], // 特别注意合并的地方后面预留2个null
        ['姓名', '性别', '年龄', '注册时间'],
        ['张三', '男', 18, new Date()],
        ['李四', '女', 22, new Date()]
      ],
      {
        '!merges': [
          // 设置A1-C1的单元格合并
          { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }
        ]
      }
    )
 */
export async function exportEXCEL(aoa = [
  ['姓名', '性别', '年龄', '注册时间'],
  ['张三', '男', 18, new Date()],
  ['李四', '女', 22, new Date()]
], options, fileName, csv) {
  let ext = csv ? 'csv' : 'xlsx'
  try {
    if (!XLSX) {
      ({ default: XLSX } = await import('xlsx'))
    }
  } catch (error) {
    Object.getPrototypeOf(Vue).$message.error('导出失败，请刷新重试')
    throw new Error('导出失败，请刷新重试')
  }

  let sheet = XLSX.utils.aoa_to_sheet(aoa);
  if (options) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        const element = options[key];
        sheet[key] = element
      }
    }
  }
  // if (csv) {
  //   return generateCSV(aoa)
  // }
  try {
    downloadFile(await sheet2blob(sheet, null, ext), fileName && (`${fileName}.${ext}`))
  } catch (error) {
    Object.getPrototypeOf(Vue).$message.error('导出失败，请刷新重试')
    throw new Error('导出失败，请刷新重试')
  }

}

// base64转blob
function base64ToBlob(code) {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;

  let uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

/**
 * 导出echarts为图片
 * @param {EchartInstance} chart echarts实例
 */
export function exportImg(chart, name, options) {
  chart = chart.chart || chart
  let base64 = chart.getDataURL({
    backgroundColor: '#fff',
    pixelRatio: 2,
    excludeComponents: [],
    ...options
  })
  let blob = base64ToBlob(base64)
  downloadFile(blob, name)
}

// 字符串转ArrayBuffer
function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
export async function sheet2blob(sheet, sheetName, ext) {
  if (!XLSX) {
    ({ default: XLSX } = await import('xlsx'))
  }
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  var wopts = {
    bookType: ext, // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  return blob;

}

