<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">宜人贷监控平台</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.account" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;">Tips : 账密与程序设计申请的密码保持一样。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    data: function(){
      return {
        ruleForm: {
          account: 'admin',
          password: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid){
            // sessionStorage.setItem('user',JSON.stringify(res.data.data));
            sessionStorage.removeItem('user')
            if (self.ruleForm.account === 'admin' && self.ruleForm.password==='admin123'){
              sessionStorage.setItem('user',self.ruleForm.account);
              this.$router.push('/');
              this.$message.success('登录成功');
            }else if(self.ruleForm.account === 'hadoop' && self.ruleForm.password==='hadoop'){
              sessionStorage.setItem('user',self.ruleForm.account);
              this.$router.push('/');

            }else {
              this.$message.warning('用户名密码错误！');
            }
          }
          // if (valid) {
          //   $.ajax({
          //     method:"post",
          //     url: this.HOST+"/login",
          //     data: this.ruleForm
          //   }).then((res)=>{
          //     console.log(res.data)
          //     if(res.data.code==0) {
          //       this.$message.success('登录成功');
          //       localStorage.setItem('user',JSON.stringify(res.data.data));
          //       this.$router.push('/');
          //     }else{
          //       this.$message.error(res.data.msg);
          //     }
          //   })
          // } else {
          //   console.log('error submit!!');
          //   return false;
          // }
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background: red;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    left: 0%;
    margin-top: -200px;
    text-align: center;
    font-size:30px;
  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>
