<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="队列资源" name="first">队列资源</el-tab-pane>
      <el-tab-pane label="用户资源" name="second">用户资源</el-tab-pane>
      <el-tab-pane label="集群资源" name="third">集群资源</el-tab-pane>
      <el-tab-pane label="任务详情" name="fourth">任务详情</el-tab-pane>
      <!--<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>-->
    </el-tabs>
    <el-col v-if="activeName==='first'">
    <ve-histogram :data="cpuData" :settings="cpuSettings"></ve-histogram>
    <ve-histogram :data="memData" :settings="memSettings"></ve-histogram>
    </el-col>
    <el-col v-if="activeName==='second'" v-for="cpuMemUser in cpuMemUsers">
      <p>{{ cpuMemUser.userName }}</p>
      <ve-histogram :data="cpuMemUser.cpuUserData" :settings="cpuUserSettings"></ve-histogram>
      <ve-histogram :data="cpuMemUser.memUserData" :settings="memUserSettings"></ve-histogram>
    </el-col>
    <el-col v-if="activeName==='third'">
      <div>
        <ve-pie :data="metricCpuData" :settings="metricCpuSettings">集群cpu使用情况</ve-pie>
      </div>
      <div>
        <ve-pie :data="metricMemData" :settings="metricMemSettings">集群内存使用情况</ve-pie>
      </div>
    </el-col>
    <div>
      <el-form :inline="true" >
        <!--:model="formInline"   v-model="formInline.user.name"-->
        <el-form-item label="姓名">
          <el-input  placeholder="姓名" style="width: 140px;"></el-input>
        </el-form-item>
      </el-form>
      <template>
      <el-table v-if="activeName==='fourth'"
      :data="app"
              border
      style="width: 100%">
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
          prop="startedTime">
        </el-table-column>
        <el-table-column
          label="finishedTime"
          prop="finishedTime">
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
          prop="runningContainers">
        </el-table-column>
        <el-table-column
          label="allocatedMB"
          prop="allocatedMB">
        </el-table-column>
        <el-table-column
        label="allocatedVCores"
        prop="allocatedVCores">
      </el-table-column>
        <el-table-column
          label="progress"
          prop="progress">
        </el-table-column>
        <el-table-column label="KILL">
          <template slot-scope="scope">
            <el-button
              @click="confirmKill"
              type="danger"
              size="small"
              round>
              kill
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </template>
    </div>
  </div>
</template>


<script>
  /* eslint-disable */
  import $ from 'jquery'
  export default {
    data() {
      this.cpuUserSettings = {
        axisSite: {right: ['最大cpu']},
        yAxisType: ['KMB', 'KMB'],
        yAxisName: ['数值', '数值']
      }
      this.memUserSettings = {
        axisSite: {right: ['最大内存']},
        yAxisType: ['KMB', 'KMB'],
        yAxisName: ['数值', '数值']
      }

      this.metricMemSettings = {
        dimension: 'mem',
        metrics: 'static'
      }
      this.metricCpuSettings = {
        dimension: 'cpu',
        metrics: 'static'
      }
      this.cpuSettings = {
        axisSite: {right: ['最大cpu']},
        yAxisType: ['KMB', 'KMB'],
        yAxisName: ['数值', '百分比']
      }
      this.memSettings = {
        axisSite: {right: ['最大内存']},
        yAxisType: ['KMB', 'KMB'],
        yAxisName: ['数值', '百分比']
      }
      return {
        dialogVisible: false,
        app: [
          {
            id: "application_1529929139008_0052",
            user: "hadoop",
            name: "Spark Pi",
            queue: "root.default",
            state: "RUNNING",
            finalStatus: "UNDEFINED",
            progress: 10,
            trackingUI: "ApplicationMaster",
            trackingUrl: "http://t2:8088/proxy/application_1529929139008_0052/",
            diagnostics: "",
            clusterId: 1529929139008,
            applicationType: "SPARK",
            applicationTags: "",
            startedTime: 1531378404240,
            finishedTime: 0,
            elapsedTime: 9894,
            amContainerLogs: "http://t4:8042/node/containerlogs/container_1529929139008_0052_01_000001/hadoop",
            amHostHttpAddress: "t4:8042",
            allocatedMB: 7168,
            allocatedVCores: 7,
            runningContainers: 4,
            memorySeconds: 9279,
            vcoreSeconds: 9,
            preemptedResourceMB: 0,
            preemptedResourceVCores: 0,
            numNonAMContainerPreempted: 0,
            numAMContainerPreempted: 0,
            logAggregationStatus: "NOT_START"
          }
        ],
        tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }],
        cpuUserData: {
          columns: ['队列名', '正常cpu', '使用cpu', '最大cpu'],
          rows: [// { '队列名': '1/1', '正常cpu': 1393, '使用cpu': 1093, '最大cpu': 0.9 }
          ]
        },
        memUserData: {
          columns: ['队列名', '正常内存', '使用内存', '最大内存'],
          rows: [// { '队列名': '1/1', '正常内存': 1393, '使用内存': 1093, '最大内存': 0.9 }
          ]
        },
        metricMemData: {
          columns: ['mem', 'static'],
          rows: [
            // { 'mem': '已用核数', 'static': 1393 },
            // { 'mem': '剩余核数', 'static': 1393 }
          ]
        },
        metricCpuData: {
          columns: ['cpu', 'static'],
          rows: [
            // { 'cpu': '已用核数', 'static': 1393 },
            // { 'cpu': '剩余核数', 'static': 1393 }
          ]
        },
        cpuData: {
          columns: ['队列名', '正常cpu', '使用cpu', '最大cpu'],
          rows: [// { '队列名': '1/1', '正常cpu': 1393, '使用cpu': 1093, '最大cpu': 0.9 }
          ]
        },
        memData: {
          columns: ['队列名', '正常内存', '使用内存', '最大内存'],
          rows: [// { '队列名': '1/1', '正常内存': 1393, '使用内存': 1093, '最大内存': 0.9 }
          ]
        },
        activeName: 'first',
        cpuMemUsers: []
      };
    },
    created() {
      this.getQueueInfo()
      this.getMetrics()
      this.getResourceByUser()
    },
    methods: {
      confirmKill() {
        this.$confirm('此操作将强制杀掉该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '已杀掉任务'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleClick(tab, event) {
        // console.log(tab, event);
        this.getQueueInfo()
        this.getMetrics()
        this.getResourceByUser()
      },
      getQueueInfo() {
        let self = this
        self.cpuData.rows = []
        self.memData.rows = []

        $.ajax({
          url: '/api/yarn/getQueueInfo',
          dataType: 'json',
          type: 'GET',
          success: function (data) {
            // console.info(data)
            for (var i = 0; i < data.length; i++) {
              let cpu = {}
              let mem = {}
              // console.info(data[i].queueName + " "+ data[i].cpus.coreNum)
              // console.log(this.cpuData.columns[0])
              cpu["队列名"] = data[i].queueName
              cpu["正常cpu"] = data[i].cpus.coreNum
              cpu["使用cpu"] = data[i].cpus.usedCore
              cpu["最大cpu"] = data[i].cpus.maxcoreNum
              self.cpuData.rows.push(cpu)
              mem["队列名"] = data[i].queueName
              mem["正常内存"] = data[i].mems.memSize
              mem["使用内存"] = data[i].mems.usedMem
              mem["最大内存"] = data[i].mems.maxMemSize
              self.memData.rows.push(mem)
            }
          },
          error: function (data) {
          },
          complete: function (data) {
          }
        });
      },
      getMetrics() {
        let self = this
        $.ajax({
          url: '/api/yarn/getMetrics',
          dataType: 'json',
          type: 'GET',
          success: function (data) {
            self.metricCpuData.rows = [
              {'cpu': '已用核数', 'static': data.clusterMetrics.allocatedVirtualCores},
              {'cpu': '剩余核数', 'static': data.clusterMetrics.availableVirtualCores}
            ]
            self.metricMemData.rows = [
              {'mem': '已用内存', 'static': data.clusterMetrics.allocatedMB},
              {'mem': '剩余内存', 'static': data.clusterMetrics.availableMB}
            ]

          }
        })
      },
      getResourceByUser() {

        let self = this
        self.cpuMemUsers = []
        $.ajax({
          url: '/api/yarn/getResourceForUser',
          dataType: 'json',
          type: "GET",
          success: function (data) {
            // console.info(data)
            for (var i = 0; i < data.length; i++) {
              for (var j = 0; j < data[i].queue.length; j++) {
                let cpu = {}
                let mem = {}
                cpu["队列名"] = data[i].queue[j].queueName;
                cpu["正常cpu"] = data[i].queue[j].cpus.coreNum
                cpu["使用cpu"] = data[i].queue[j].cpus.usedCore
                cpu["最大cpu"] = data[i].queue[j].cpus.maxcoreNum
                self.cpuUserData.rows.push(cpu)
                mem["队列名"] = data[i].queue[j].queueName
                mem["正常内存"] = data[i].queue[j].mems.memSize
                mem["使用内存"] = data[i].queue[j].mems.usedMem
                mem["最大内存"] = data[i].queue[j].mems.maxMemSize
                self.memUserData.rows.push(mem)
              }
              self.cpuMemUsers.push({
                "cpuUserData": self.cpuUserData,
                "memUserData": self.memUserData,
                "userName": data[i].userName
              })
              self.cpuUserData = {
                columns: ['队列名', '正常cpu', '使用cpu', '最大cpu'],
                rows: [// { '队列名': '1/1', '正常cpu': 1393, '使用cpu': 1093, '最大cpu': 0.9 }
                ]
              },
                self.memUserData = {
                  columns: ['队列名', '正常内存', '使用内存', '最大内存'],
                  rows: [// { '队列名': '1/1', '正常内存': 1393, '使用内存': 1093, '最大内存': 0.9 }
                  ]
                }
            }
            // console.info(self.cpuMemUsers.length + " =======size======= ")

            // self.cpuUserDatas.push(self.cpuUserData)
            // self.memUserDatas.push(self.memUserData)
            // self.cpuMemUserItems.push({"cpuUserData":self.cpuUserData,"memUserData":self.memUserData})
            // console.info(self.cpuMemUserItems.cpuUserData)
          }
        })
      }
    }
  };
</script>
<style>
  .demo-table-expand {
    font-size: 0;
    margin-left: 0%;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .show-section.top {
    border-radius: 2px;
    height: inherit;
    margin-right: 10px;
    overflow: auto;
    width: 50%;
  }

  .show-style.top {
    position: relative;
    overflow: hidden;
    width: 70%;
    height: 400px;
    padding: 0px;
    margin: 0px;
    border-width: 0px;
    /*cursor: default;*/
    overflow: auto;
  }
</style>
