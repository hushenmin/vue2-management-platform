<template>
  <div>
    <header>
      <!--<a href="https://github.com/suweiteng/vue2-management-platform"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>-->
      <ul class="header-logo">
        <span>Cluster-Monitor</span>
      </ul>
      <ul class="header-operations">
        <!--<li>-->
        <!--<span class="header-lang is-active">{{user.name}}</span>-->
        <!--<span class="header-opacity">({{user.dept}}/{{user.identity}})</span>-->
        <!--</li>-->
        <!--<li>-->
        <!-- 用户头像 -->
        <li>
          <div class="user-avator "><img src="../../../static/img/img.jpg"></div>
        </li>
        <!-- 用户名下拉菜单 -->
        <el-dropdown @command="handleCommand" class="user-name" trigger="click">
          <li>
            <span class="el-dropdown-link">{{username}}<i
              class="el-icon-caret-bottom"></i></span>
          </li>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </ul>
    </header>
  </div>
</template>
<script>
  /* eslint-disable */
  export default {
    // props: {
    //   user: {}
    // },
    data() {
      return {
        username:""
      };
    },
    created(){
      this.getUserName()
    },
    methods: {
      handleCommand(command) {
        if (command === 'logout') {
          //测试环境
          this.$store.commit('logout');
          let currentUrl = window.location.href
          if(currentUrl.indexOf('?tokens')>0){
            currentUrl = currentUrl.substring(0,currentUrl.indexOf('?tokens'))
          }
          window.location.href =  this.$store.state.loginUrl + currentUrl
        }
      },
      getUserName() {
        //生产环境启用token认证
        const self = this
        self.axios.post('/token/getAccount', self.qs.stringify({token: self.$store.state.accessToken}))
          .then(response => {
            if (response.data.code == 'OK') {
              self.username = response.data.data
              localStorage.setItem('ms_username', self.username);
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning',
                duration: 5000
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>
<style>
  header {
    background-color: rgb(32, 160, 255);
    height: 80px;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 999;
    box-sizing: border-box;
    position: fixed;
  }

  .header-logo {
    display: inline-block;
    font-size: 25px;
    float: left;
    padding-left: 0px;
    height: 120%;
    color: #fff;
    vertical-align: middle;
    margin: 0 10px;
    line-height: 80px;
    cursor: pointer;
  }

  .header-operations {
    display: inline-block;
    float: right;
    padding-right: 30px;
    height: 100%;
  }

  .header-operations li {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
    margin: 0 10px;
    line-height: 80px;
    cursor: pointer;
  }

  .header-operations li:first-child {
    cursor: default
  }

  .header-opacity {
    opacity: .7;
  }

  .header-operations:after, header:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }

  .user-avator {
    margin-left: 10px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    margin-left: 100%;
    border-radius: 50%;
  }

  .user-name {
    margin-left: 10px;
  }

  .el-dropdown-link {
    color: #fff;
    cursor: pointer;
  }


</style>
