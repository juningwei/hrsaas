import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}