<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="队列资源" name="first"></el-tab-pane>
      <el-tab-pane label="用户资源" name="second"></el-tab-pane>
      <el-tab-pane label="集群资源" name="third"></el-tab-pane>
      <el-tab-pane label="任务详情" name="fourth"></el-tab-pane>
    </el-tabs>
    <el-row v-show="activeName==='first'">
      <el-col :span="12">
        <el-alert title="集群中每个队列使用cpu个数" type="warning" center></el-alert>
        <div id="cpuChart" :style="{width: '100%', height: '300px'}"></div>
      </el-col>

      <el-col :span="12">
        <el-alert title="集群中每个队列使用内存大小" type="warning" center></el-alert>
        <div id="memChart" :style="{width: '100%', height: '300px'}"></div>
      </el-col>
    </el-row>
    <!--<div v-for="ele in options">-->
    <el-row v-show="activeName==='second'" v-for="ele in options" :style="{height:'300px' ,width: '100%'}">
      <el-col :span="12">
        <el-alert :title="ele.userName+'用户cpu资源使用'" type="warning" center></el-alert>
        <div :id="'cpu'+ele.userName" :style="{height:'300px' ,width: '100%'}"></div>
      </el-col>
      <el-col :span="12">
        <el-alert :title="ele.userName+'用户内存资源使用'" type="warning" center></el-alert>
        <div :id="'mem'+ele.userName" :style="{height:'300px' ,width: '100%'}"></div>
      </el-col>
    </el-row>
    <!--</div>-->
    <!--<div v-show="activeName==='third'">-->
    <el-row v-if="activeName==='third'">
      <el-col :span="8">
        <el-alert title="集群cpu使用情况" type="warning" center></el-alert>
        <ve-pie :data="metricCpuData" :settings="metricCpuSettings"></ve-pie>
      </el-col>
      <el-col :span="8">
        <el-alert title="集群内存使用情况" type="warning" center></el-alert>
        <ve-pie :data="metricMemData" :settings="metricMemSettings"></ve-pie>
      </el-col>
      <el-col :span="8">
        <el-alert title="集群Job运行状态详情" type="warning" center></el-alert>

        <ve-ring :data="metricJobData" :settings="metircJobSettings"></ve-ring>
      </el-col>
    </el-row>
    <!--</div>-->
    <div v-if="activeName==='fourth'">
      <v-yarn-app></v-yarn-app>
    </div>
  </div>
</template>
<script>
  // eslint-disable-next-line
  /* eslint-disable */
  import $ from 'jquery'
  import yarnApp from './app.vue';
  import VYarnApp from "./app";

  export default {
    data() {
      this.metricMemSettings = {
        dimension: 'mem',
        metrics: 'static'
      }
      this.metricCpuSettings = {
        dimension: 'cpu',
        metrics: 'static'
      }
      this.metircJobSettings = {
        dataType: 'normal'
      }
      return {
        cpulabels: ['共享cpu', '使用cpu', '最大cpu'],
        memlabels: ['共享内存', '使用内存', '最大内存'],
        activeName: "first",
        cpuChart: null,
        memChart: null,
        options: [],
        autoCpuChart: null,
        autoMemChart: null,
        metricChart: null,
        metricOption: null,
        metricMemData: {
          columns: ['mem', 'static'],
          rows: []
        },
        metricCpuData: {
          columns: ['cpu', 'static'],
          rows: []
        },
        metricJobData: {
          columns: ['jobType', 'number'],
          rows: []
        }
      }
    },
    components: {
      VYarnApp,
      'v-yarnApp': yarnApp
    },
    mounted() {
      let self = this
      self.$nextTick(() => {
        self.getQueueInfo()
        self.getResourceForUser()
        self.getMetrics()

      })
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab.name)
        let self = this
        self.$nextTick(() => {
          self.getQueueInfo()
          self.getResourceForUser()
          self.getMetrics()
          for (var i = 0; i < self.options.length; i++) {
            self.autoCpuChart = self.$echarts.init(document.getElementById("cpu" + self.options[i].userName))
            self.autoCpuChart.setOption(self.options[i].cpu)
            self.autoMemChart = self.$echarts.init(document.getElementById("mem" + self.options[i].userName))
            self.autoMemChart.setOption(self.options[i].mem)
          }
        })
      },
      getMetrics() {
        let self = this
        self.axios.get('/api/yarn/getMetrics').then(value =>{
          let data = value.data
          self.metricJobData.rows = [
            {"jobType": "Submitted", "number": data.clusterMetrics.appsSubmitted},
            {"jobType": "Completed", "number": data.clusterMetrics.appsCompleted},
            {"jobType": "Pending", "number": data.clusterMetrics.appsPending},
            {"jobType": "Running", "number": data.clusterMetrics.appsRunning},
            {"jobType": "Failed", "number": data.clusterMetrics.appsFailed}
          ]
          self.metricCpuData.rows = [
            {'cpu': '已用核数', 'static': data.clusterMetrics.allocatedVirtualCores},
            {'cpu': '剩余核数', 'static': data.clusterMetrics.availableVirtualCores}
          ]
          self.metricMemData.rows = [
            {'mem': '已用内存', 'static': data.clusterMetrics.allocatedMB},
            {'mem': '剩余内存', 'static': data.clusterMetrics.availableMB}
          ]
        })
        // $.ajax({
        //   url: '/api/yarn/getMetrics',
        //   dataType: 'json',
        //   type: 'GET',
        //   async: false,
        //   success: function (data) {
        //     self.metricJobData.rows = [
        //       {"jobType": "Submitted", "number": data.clusterMetrics.appsSubmitted},
        //       {"jobType": "Completed", "number": data.clusterMetrics.appsCompleted},
        //       {"jobType": "Pending", "number": data.clusterMetrics.appsPending},
        //       {"jobType": "Running", "number": data.clusterMetrics.appsRunning},
        //       {"jobType": "Failed", "number": data.clusterMetrics.appsFailed}
        //     ]
        //     self.metricCpuData.rows = [
        //       {'cpu': '已用核数', 'static': data.clusterMetrics.allocatedVirtualCores},
        //       {'cpu': '剩余核数', 'static': data.clusterMetrics.availableVirtualCores}
        //     ]
        //     self.metricMemData.rows = [
        //       {'mem': '已用内存', 'static': data.clusterMetrics.allocatedMB},
        //       {'mem': '剩余内存', 'static': data.clusterMetrics.availableMB}
        //     ]
        //   },
        // })
      },
      getQueueInfo() {
        let self = this
        const queueNames = []
        const coreNums = []
        const usedCores = []
        const maxcoreNums = []
        const memSizes = []
        const usedMemSizes = []
        const maxMemSizes = []
        self.axios.get('api/yarn/getQueueInfo').then(value=>{
          let data = value.data
          for (var i = 0; i < data.length; i++) {
            queueNames.push(data[i].queueName)
            coreNums.push(data[i].cpus.coreNum)
            usedCores.push(data[i].cpus.usedCore)
            maxcoreNums.push(data[i].cpus.maxcoreNum)
            memSizes.push(data[i].mems.memSize)
            usedMemSizes.push(data[i].mems.usedMem)
            maxMemSizes.push(data[i].mems.maxMemSize)
          }
          this.memChart = this.$echarts.init(document.getElementById("memChart"))
          this.cpuChart = this.$echarts.init(document.getElementById("cpuChart"))
          this.memChart.setOption(self.getMemOptions(self.memlabels, queueNames, self.getMemSeries(memSizes, usedMemSizes, maxMemSizes)))
          this.cpuChart.setOption(self.getCpuOptions(self.cpulabels, queueNames, self.getCpuSeries(coreNums, usedCores, maxcoreNums)))
        })
        // $.ajax({
        //   url: '/api/yarn/getQueueInfo',
        //   dataType: 'json',
        //   type: 'GET',
        //   async: false,
        //   success: function (data) {
        //     for (var i = 0; i < data.length; i++) {
        //       queueNames.push(data[i].queueName)
        //       coreNums.push(data[i].cpus.coreNum)
        //       usedCores.push(data[i].cpus.usedCore)
        //       maxcoreNums.push(data[i].cpus.maxcoreNum)
        //       memSizes.push(data[i].mems.memSize)
        //       usedMemSizes.push(data[i].mems.usedMem)
        //       maxMemSizes.push(data[i].mems.maxMemSize)
        //     }
        //   },
        // });
        // this.memChart = this.$echarts.init(document.getElementById("memChart"))
        // this.cpuChart = this.$echarts.init(document.getElementById("cpuChart"))
        // this.memChart.setOption(self.getMemOptions(self.memlabels, queueNames, self.getMemSeries(memSizes, usedMemSizes, maxMemSizes)))
        // this.cpuChart.setOption(self.getCpuOptions(self.cpulabels, queueNames, self.getCpuSeries(coreNums, usedCores, maxcoreNums)))
      },
      getMemSeries(memSizes, usedMemSizes, maxMemSizes) {
        let series = [
          {
            name: '共享内存',
            type: 'bar',
            stack: '共享内存',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [320, 302, 301, 334, 390, 330, 320]
            data: memSizes
          },
          {
            name: '使用内存',
            type: 'bar',
            stack: '使用内存',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [150, 212, 201, 154, 190, 330, 410]
            data: usedMemSizes
          },
          {
            name: '最大内存',
            type: 'bar',
            stack: '最大内存',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [820, 832, 901, 934, 1290, 1330, 1320]
            data: maxMemSizes
          }
        ]
        return series;
      },
      getCpuSeries(coreNums, usedCores, maxcoreNums) {
        let series = [
          {
            name: '共享cpu',
            type: 'bar',
            stack: '共享cpu',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [320, 302, 301, 334, 390, 330, 320]
            data: coreNums
          },
          {
            name: '使用cpu',
            type: 'bar',
            stack: '使用cpu',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [150, 212, 201, 154, 190, 330, 410]
            data: usedCores
          },
          {
            name: '最大cpu',
            type: 'bar',
            stack: '最大cpu',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            // data: [820, 832, 901, 934, 1290, 1330, 1320]
            data: maxcoreNums
          }
        ]
        return series;
      },
      getMemOptions(memlabels, queueNames, series) {
        let option = {
          title: {text: '内存'},
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: memlabels
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            data: queueNames
          },
          series: series
        }
        return option;
      },
      getCpuOptions(cpulabels, queueNames, series) {
        let option = {
          title: {text: 'cpu'},
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: cpulabels
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: queueNames
          },
          series: series
        }
        return option;
      },
      getMetircOptions(labels, data) {
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: labels
          },
          series: [
            {
              name: '集群Job运行情况',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ]
        }
        return option
      },
      getResourceForUser() {
        let self = this
        let options = []
        self.axios.get('/api/yarn/getResourceForUser')
          .then(value => {
            let  data = value.data
            for (var i = 0; i < data.length; i++) {
              const queueNames = []
              const coreNums = []
              const usedCores = []
              const maxCoreNums = []
              const memSizes = []
              const usedMemSizes = []
              const maxMemSizes = []
              const userName = data[i].userName
              for (var j = 0; j < data[i].queue.length; j++) {
                queueNames.push(data[i].queue[j].queueName)
                coreNums.push(data[i].queue[j].cpus.coreNum)
                usedCores.push(data[i].queue[j].cpus.usedCore)
                maxCoreNums.push(data[i].queue[j].cpus.maxcoreNum)
                memSizes.push(data[i].queue[j].mems.memSize)
                usedMemSizes.push(data[i].queue[j].mems.usedMem)
                maxMemSizes.push(data[i].queue[j].mems.maxMemSize)
              }
              options.push({
                "userName": userName,
                "cpu": self.getCpuOptions(self.cpulabels, queueNames, self.getCpuSeries(coreNums, usedCores, maxCoreNums)),
                "mem": self.getMemOptions(self.memlabels, queueNames, self.getMemSeries(memSizes, usedMemSizes, maxMemSizes))
              })
            }
            self.options = options
          })
          .catch(err => {
            console.log(err);
          });


        // $.ajax({
        //   url: '/api/yarn/getResourceForUser',
        //   dataType: 'json',
        //   type: 'GET',
        //   async: false,
        //   success: function (data) {
        //     for (var i = 0; i < data.length; i++) {
        //       const queueNames = []
        //       const coreNums = []
        //       const usedCores = []
        //       const maxCoreNums = []
        //       const memSizes = []
        //       const usedMemSizes = []
        //       const maxMemSizes = []
        //       const userName = data[i].userName
        //       for (var j = 0; j < data[i].queue.length; j++) {
        //         queueNames.push(data[i].queue[j].queueName)
        //         coreNums.push(data[i].queue[j].cpus.coreNum)
        //         usedCores.push(data[i].queue[j].cpus.usedCore)
        //         maxCoreNums.push(data[i].queue[j].cpus.maxcoreNum)
        //         memSizes.push(data[i].queue[j].mems.memSize)
        //         usedMemSizes.push(data[i].queue[j].mems.usedMem)
        //         maxMemSizes.push(data[i].queue[j].mems.maxMemSize)
        //       }
        //       options.push({
        //         "userName": userName,
        //         "cpu": self.getCpuOptions(self.cpulabels, queueNames, self.getCpuSeries(coreNums, usedCores, maxCoreNums)),
        //         "mem": self.getMemOptions(self.memlabels, queueNames, self.getMemSeries(memSizes, usedMemSizes, maxMemSizes))
        //       })
        //     }
        //     self.options = options
        //   }
        // });
      }

    }
  }
</script>
<style>
  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

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
</style>
