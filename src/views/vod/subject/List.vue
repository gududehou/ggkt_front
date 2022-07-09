<template>
  <div class="app-container">
    <div class="el-toolbar">
      <div class="el-toolbar-body" style="justify-content: flex-start;margin-bottom: 20px">
        <el-button type="primary" @click="exportData"><i class="fa fa-plus"/> 导出Excel</el-button>
        <el-button type="success" @click="importData"><i class="fa fa-plus"/> 导入数据库</el-button>
      </div>
    </div>
    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
      <el-form label-position="right" label-width="170px">
        <el-form-item label="文件">
          <el-upload
            :multiple="false"
            :on-success="onUploadSuccess"
            :action="'http://localhost:8333/admin/vod/subject/importData'"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="title"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import subjectApi from '@/api/vod/subject'

export default {
  data() {
    return {
      dialogImportVisible: false,
      list: [] //数据字典列表数组
    }
  },
  created() {
    this.getSubList(0)
  },
  methods: {
    //数据字典列表
    getSubList(id) {
      subjectApi.getChildList(id)
        .then(response => {
          this.list = response.data
        })
    },
    load(tree, treeNode, resolve) {
      subjectApi.getChildList(tree.id).then(response => {
        resolve(response.data)
      })
    },
    exportData() {
      window.open('http://localhost:8301/admin/vod/subject/exportData')
    },
    importData() {
      this.dialogImportVisible = true
    },
    onUploadSuccess(response, file) {
      this.$message.info('上传成功')
      this.dialogImportVisible = false
      this.getSubList(0)
    }
  }
}
</script>
