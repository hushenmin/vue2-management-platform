<template>
  <div>
    <section>
      <!--<section>-->
      <el-form labelPosition="left" size="small" v-model="form">
        <!--<el-form label-width="100px">-->
        <el-row>
          <el-col :span="10">
            <el-form-item label="应用状态">
              <el-checkbox-group
                v-model="checkedState">
                <el-checkbox v-for="st in stateList" :label="st" :key="st">{{st}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="最终状态">
              <el-radio-group v-model="form.finalStatus">
                <el-radio label="FAILED"></el-radio>
                <el-radio label="SUCCEEDED"></el-radio>
                <el-radio label="KILLED"></el-radio>
                <el-radio label="">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间范围" label-width="100px">
              <el-col :span="12">
                <el-date-picker
                  v-model="startedList"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="结束时间范围" label-width="100px">
              <el-col :span="12">
                <el-date-picker
                  v-model="finishedList"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <!--:model="formInline"   v-model="formInline.user.name"-->
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="应用ID">
              <el-input v-model="form.id" placeholder="ID" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户名">
              <el-input v-model="form.user" placeholder="User" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="队列名">
              <el-input v-model="form.queue" placeholder="queue" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="应用类型">
              <el-input v-model="form.applicationTypes" placeholder="ApplicationType" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="应用标签">
              <el-input v-model="form.applicationTags" placeholder="ApplicationTags" style="width: 140px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button size="small" type="primary" @click="queryAppData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <el-table :data="app" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="clusterId">
              <span>{{ props.row.clusterId }}</span>
            </el-form-item>
            <el-form-item label="memorySeconds">
              <span style="margin: 50px;">{{ props.row.memorySeconds }}</span>
            </el-form-item>
            <el-form-item label="vcoreSeconds">
              <span style="margin: 10px;">{{ props.row.vcoreSeconds }}</span>
            </el-form-item>
            <el-form-item label="preemptedResourceMB">
              <span style="margin: 100px;">{{ props.row.preemptedResourceMB }}</span>
            </el-form-item>
            <el-form-item label="preemptedResourceVCores">
              <span style="margin: 100px;">{{ props.row.preemptedResourceVCores }}</span>
            </el-form-item>
            <el-form-item label="numNonAMContainerPreempted">
              <span style="margin: 130px;">{{ props.row.numNonAMContainerPreempted }}</span>
            </el-form-item>
            <el-form-item label="numAMContainerPreempted">
              <span style="margin: 100px;">{{ props.row.numAMContainerPreempted }}</span>
            </el-form-item>
            <el-form-item label="trackingUI">
              <span>{{ props.row.trackingUI }}</span>
            </el-form-item>
            <el-form-item label="trackingUrl">
              <span>{{ props.row.trackingUrl }}</span>
            </el-form-item>
            <el-form-item label="logAggregationStatus">
              <span style="margin: 50px;">{{ props.row.logAggregationStatus }}</span>
            </el-form-item>
            <el-form-item label="applicationTags">
              <span>{{ props.row.applicationTags }}</span>
            </el-form-item>
            <el-form-item label="elapsedTime">
              <span>{{ props.row.elapsedTime }}</span>
            </el-form-item>
            <el-form-item label="diagnostics">
              <span>{{ props.row.diagnostics }}</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="User"
        prop="user">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        label="ApplicationType"
        prop="applicationType">
      </el-table-column>
      <el-table-column
        label="Queue"
        prop="queue">
      </el-table-column>
      <el-table-column
        label="startedTime"
        prop="startedTime"
        :formatter="formatTime2Date">
      </el-table-column>
      <el-table-column
        label="finishedTime"
        prop="finishedTime"
        :formatter="formatTime2Date">
      </el-table-column>
      <el-table-column
        label="state"
        prop="state">
      </el-table-column>
      <el-table-column
        label="finalStatus"
        prop="finalStatus">
      </el-table-column>
      <el-table-column
        label="runningContainers"
        prop="runningContainers"
        :formatter="formatNum2Str">
      </el-table-column>
      <el-table-column
        label="allocatedMB"
        prop="allocatedMB"
        :formatter="formatNum2Str">
      </el-table-column>
      <el-table-column
        label="allocatedVCores"
        prop="allocatedVCores"
        :formatter="formatNum2Str">
      </el-table-column>
      <el-table-column
        label="progress"
        prop="progress" align="center">
        <template scope="scope">
          <div v-if="scope.row.progress <=50">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"
                         status="exception"></el-progress>
          </div>
          <div v-else-if="scope.row.progress >50 && scope.row.progress < 100">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"
                         status="exception"></el-progress>
          </div>
          <div v-else="scope.row.progress >50 && scope.row.progress ===100">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"
                         status="success"></el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="KILL">
        <template slot-scope="scope">
          <!--<el-button-->
          <!--@click.native.prevent="confirmKill(scope.row)"-->
          <!--type="danger"-->
          <!--size="small"-->
          <!--round>-->
          <!--kill-->
          <!--</el-button>-->
          <div v-if="scope.row.state !=='RUNNING'">
            <el-button
              :disabled="true"
              type="warning"
              size="small"
              round>
              no kill
            </el-button>
          </div>
          <div v-else>
            <el-button
              @click.native.prevent="confirmKill(scope.row)"
              type="danger"
              size="small"
              round>
              kill
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.appPageList.length">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  // const cityOptions = ['accepted', 'running', 'finished', 'failed'];
  import $ from 'jquery'

  export default {
    data() {
      return {
        startedList: [],
        finishedList: [],
        dialogVisible: false,
        checkedState: ['running', 'finished'],
        stateList: ['accepted', 'running', 'finished', 'failed', 'killed'],
        currentPage: 1,
        pageSize: 20,
        appPageList: [],
        form: {
          states: '',
          finalStatus: 'FAILED',
          startedTimeBegin: '',
          startedTimeEnd: '',
          finishedTimeBegin: '',
          finishedTimeEnd: '',
          id: '',
          user: '',
          queue: '',
          applicationTypes: '',
          applicationTags: ''
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        app: [],
        activeName: 'first'
      };
    },
    watch: {
      checkedState: function () {
        this.form.states = this.checkedState.join(",")
        // console.log(this.form.states)
      },
      startedList: function (val) {
        if (val !== null) {
          this.form.startedTimeBegin = new Date(this.startedList[0]).getTime().toString()
          this.form.startedTimeEnd = new Date(this.startedList[1]).getTime().toString()
        }

      },
      finishedList: function (val) {
        if (val !== null) {
          this.form.finishedTimeBegin = new Date(this.finishedList[0]).getTime().toString()
          this.form.finishedTimeEnd = new Date(this.finishedList[1]).getTime().toString()
        }
      }
    },
    mounted() {
      this.form.states = this.checkedState.join(",")
    },
    methods: {
      queryAppData() {
        // console.log(this.form.id + " =======")
        let self = this
        self.app = []
        if (this.form.id === '') {
          self.axios.get('/api/yarn/getAppsBy', {params: self.form}).then(value => {
            let data = value.data
            if (data.apps !== null) {
              self.appPageList = data.apps.app
              self.handlePage()
            }
          })
          // $.ajax({
          //   url: '/api/yarn/getAppsBy',
          //   dataType: 'json',
          //   type: 'GET',
          //   async: false,
          //   data: this.form,
          //   success: function (data) {
          //     // console.log(data.apps)
          //     if (data.apps !== null) {
          //       self.appPageList = data.apps.app
          //       // console.log(self.appPageList)
          //       self.handlePage()
          //     }
          //
          //   }
          // })
        } else {
          self.axios.get('/api/yarn/getAppByID/' + this.form.id).then(
            value => {
              let data = value.data
              self.app = []
              self.app.push(data.app)
            }
          ).catch(() => {
            self.$message({
              message: 'Sorry，没有找到这个application！请检查这个\`ID\`',
              type: 'warning'
            });
          })
          // $.ajax({
          //   contentType: 'application/json;charset=UTF-8',
          //   url: '/api/yarn/getAppByID/' + this.form.id,
          //   dataType: 'json',
          //   type: 'GET',
          //   async: false,
          //   success: function (data) {
          //     self.app = []
          //     self.app.push(data.app)
          //   },
          //   error: function () {
          //     self.$message({
          //       message: 'Sorry，没有找到这个application！请检查这个\`ID\`',
          //       type: 'warning'
          //     });
          //   }
          // })
        }
      },
      confirmKill(row) {
        let self = this
        this.$confirm('此操作将强制杀掉该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(row.finishedTime)
          //   if(sessionStorage.getItem("user") !=="admin"){
          //   self.$message.error("不是admin不能执行此操作！请联系管理员！")
          //     return;
          // }
          self.axios.post('/api/yarn/killAppByID/', JSON.stringify({
            "id": row.id,
            "state": "KILLED"
          }), {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then(value => {
            console.log(value)
            let data = value.data
            if (data.state !== 'RUNNING') {
              self.$message({
                type: 'success',
                message: 'Kill成功!'
              });
            }
          }).catch((err) => {
            self.$message({
              message: 'Sorry，kill失败，网络异常或者yarn异常！',
              type: 'warning'
            })
          })
          // $.ajax({
          //   contentType: 'application/json;charset=UTF-8',
          //   url: '/api/yarn/killAppByID/',
          //   dataType: 'json',
          //   type: 'POST',
          //   async: false,
          //   data: JSON.stringify({"id":row.id,"state":"KILLED"}),
          //   success: function (data) {
          //     if(data.state !=='RUNNING'){
          //       self.$message({
          //         type: 'success',
          //         message: 'Kill成功!'
          //       });
          //     }
          //   },
          //   error: function () {
          //     self.$message({
          //       message: 'Sorry，kill失败，网络异常或者yarn异常！',
          //       type: 'warning'
          //     });
          //   }
          // })

        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      handleSizeChange(val) {
        let self = this
        // console.log(`每页 ${val} 条`);
        this.pageSize = val
        self.handlePage()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        // console.log(`当前页: ${val}`);
        this.handlePage()
      },
      handlePage() {
        let self = this
        self.app = []
        if (self.appPageList.length > 0) {
          if ((self.currentPage) * self.pageSize - 1 > self.appPageList.length) {
            self.app = self.appPageList.slice((self.currentPage - 1) * self.pageSize, self.appPageList.length)
          }
          self.app = self.appPageList.slice((self.currentPage - 1) * self.pageSize, (self.currentPage) * self.pageSize)
          // console.log(self.app)
        }
      },
      formatTime2Date(row, column, cellValue) {
        var date = new Date()
        date.setTime(cellValue)
        return date.toString().split("GMT")[0]
      },
      formatNum2Str(row, column, cellValue) {
        if (cellValue === -1) {
          return 'N/A'
        }
        return cellValue
      },
      showProgress(row, index) {

      }
    },
  };
</script>
<style>
  .form-section {
    padding: 10px;
    width: 500px;
  }
</style>
