import request from './axios'

export function getSalesAnalysisList (params) {
  params = {
    'pageNumber': 1,
    'pageSize': 10,
    groupId: 0,
    ...params
  }
  return request.post('/salesAnalysis/list', params).then(res => res.data)
}
