import request from '@/utils/request'

const api_name = '/admin/vod/teacher'

export default {
  //讲师列表
  pageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: `post`,
      data: searchObj
    })
  },
  //删除讲师
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: `delete`
    })
  },
  //新增讲师
  save(teacher) {
    return request({
      url: `${api_name}/save`,
      method: `post`,
      data: teacher
    })
  },
  //根据id查询讲师
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: `get`
    })
  },
  //更新讲师
  updateById(teacher) {
    return request({
      url: `${api_name}/update`,
      method: `put`,
      data: teacher
    })
  },
  //批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  }

}
