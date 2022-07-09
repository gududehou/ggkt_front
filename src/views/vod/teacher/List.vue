<template>
  <div class="app-container">
    <!--查询表单-->
    <el-card class="operate-container" shadow="never">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="searchObj.name" style="width: 150px" clearable placeholder="讲师名"/>
        </el-form-item>
        <el-form-item label="头衔">
          <el-select v-model="searchObj.level" style="width: 150px" clearable placeholder="头衔">
            <el-option value="1" label="高级讲师"/>
            <el-option value="0" label="首席讲师"/>
          </el-select>
        </el-form-item>
        <el-form-item label="入驻时间">
          <el-date-picker
            style="width: 140px"
            v-model="searchObj.joinDateBegin"
            placeholder="开始时间"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            style="width: 140px"
            v-model="searchObj.joinDateEnd"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-button style="margin-left: 10px" type="success" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="info" @click="resetData()" icon="el-icon-refresh">清空</el-button>
        <el-button class="btn-add" type="danger" icon="el-icon-delete-solid" @click="batchRemove()">批量删除</el-button>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column type="selection"/>
      <el-table-column
        label="序号"
        align="center"
        width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="名称" width="80"/>
      <el-table-column label="头衔" align="center" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 0" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介"/>
      <el-table-column prop="sort" align="center" label="排序" width="60"/>
      <el-table-column prop="joinDate" align="center" label="入驻时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete-solid" style="margin-right: 10px"
                     @click="removeById(scope.row)">删除
          </el-button>
          <router-link :to="'/vod/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      background
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"/>

  </div>
</template>
<script>
import teacherApi from '@/api/vod/teacher'

export default {
  // 定义数据模型
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件
      multipleSelection: []// 批量删除选中的记录列表
    }
  },
  // 页面渲染成功后获取数据
  created() {
    this.fetchData()
  },
  // 定义方法
  methods: {
    //获取所有讲师
    fetchData() {
      // 调用api
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        debugger
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    // 每页记录数改变，size：回调参数，表示当前选中的“每页条数”
    changePageSize(size) {
      this.limit = size
      this.fetchData()
    },
    // 改变页码，page：回调参数，表示当前选中的“页码”
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 根据id删除数据
    removeById(row) {
      this.$confirm('此操作将永久删除【' + row.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeById(row.id)
      }).then((response) => {
        this.fetchData()//刷新数据
        this.$message.success(response.message)
      })
    },
    // 批量删除
    batchRemove() {
      //未选中
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，调用接口删除
        // 遍历selection，将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return teacherApi.batchRemove(idList)
      }).then((response) => {
        this.fetchData()//刷新数据
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    }
  }
}
</script>
