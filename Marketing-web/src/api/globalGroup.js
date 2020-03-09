import request from './axios'

export function getGroupingList (params) {
  params = {
    'platformId': 1,
    'siteId': 1,
    'groupType': 0,
    ...params
  }
  return request.post('/Grouping/list', params).then(res => res.data.data)
}

export function getProductLib (params, type) {
  params = {
    'pageNumber': 1,
    'pageSize': type ? 10 : 5,
    'platformId': 1,
    'siteId': 1,
    groupId: 0,
    ...params
  }
  return request.post('/ProductLib/list', params).then(res => res.data)
}

export function getkeywordLib (params) {
  params = {
    'pageNumber': 1,
    'pageSize': 10,
    'platformId': 1,
    'siteId': 1,
    groupId: 0,
    ...params
  }
  return request.post('/KeywordLib/list', params).then(res => res.data)
}
