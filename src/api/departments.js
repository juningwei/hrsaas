 import request from '@/utils/request'

 export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
export function delDepartments(id) {
  console.log("delDepartments");

  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}