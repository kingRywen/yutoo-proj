export default [
  {
    name: "importLogExportTemplate",
    method: "POST",
    desc: "导出模板",
    path: "/importLog/exportTemplate",
    showSuccess: true,
    config: {
      responseType: "blob",
    },
  },
  {
    name: "importLogImportData",
    method: "POST",
    desc: "导入",
    path: "/importLog/importData",
    showSuccess: true,
    config: {
      responseType: "blob",
    },
  },
  {
    name: "importLogImportData1",
    method: "POST",
    desc: "导入",
    path: "/importLog/importData",
    showSuccess: true,
    type: "formdata",
  },
  {
    name: "importLogList",
    method: "POST",
    desc: "日志列表",
    path: "/importLog/list",
  },
  {
    name: "importLogExport",
    method: "POST",
    desc: "导出错误日志",
    path: "/importLog/export",
    showSuccess: true,
    config: {
      responseType: "blob",
    },
  },
  {
    name: "productFlowRptLogList",
    method: "POST",
    desc: "流量报告导入-列表",
    path: "/productFlowRptLog/list",
    mock: true,
  },
  {
    name: "productFlowRptLogStat",
    method: "POST",
    desc: "流量报告导入-统计",
    path: "/productFlowRptLog/stat",
    mock: true,
  },
  {
    name: "productFlowRptLogNoImportDate",
    method: "POST",
    desc: "流量报告导入-未导入报告日期",
    path: "/productFlowRptLog/noImportDate",
    showSuccess: true,
    config: {
      responseType: "blob",
    },
    mock: true,
  },
];
