<template>
  <div class="container">
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic" @keyup.enter.native="submitForm('dynamicValidateForm')">
      <el-form-item>
        <h2>登录</h2>
      </el-form-item>
      <el-form-item prop="user" :rules="[
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ]">
        <el-input v-model="dynamicValidateForm.user" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="pass" :rules="{
          required: true, message: '请输入密码', trigger: 'blur'
        }">
        <el-input v-model="dynamicValidateForm.pass" type='password' placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label-width="135px" prop="pass" :rules="{
          required: true, message: '验证码', trigger: 'blur'
        }">
        <img slot="label" class="vali" :src="img" @click="refresh">
        <el-input v-model="dynamicValidateForm.vali" placeholder="验证码" @keyup.enter.native="submitForm('dynamicValidateForm')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')" style="width:100%" :loading="loading">{{ loginText }}</el-button>
      </el-form-item>
    </el-form>
    <div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { baseURL } from "../api/axios.js";
export default {
  data() {
    return {
      dynamicValidateForm: {
        user: "test",
        pass: "1",
        vali: ""
      },
      // img: "/sys/valicode?t=",
      img: baseURL + "/sys/valicode?t=",
      loginText: "登 录",
      loading: false
    };
  },
  mounted() {
    this.refresh();
    setTimeout(() => {
      this.createBackground();
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);
        if (valid) {
          this.loading = true;
          this.loginText = "登录中...";
          this.logIn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logIn() {
      const formData = this.dynamicValidateForm;
      let data = new FormData();
      data.append("username", formData.user);
      data.append("password", formData.pass);
      data.append("captcha", formData.vali);
      console.log(formData);
      console.log(this);
      axios({
        method: "post",
        timeout: 10000000000,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        },
        url: `${baseURL}/sys/login?username=${formData.user}&password=${
          formData.pass
        }&captcha=${formData.vali}`
      })
        .then(res => {
          console.log(res);
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            this.loading = false;
            this.loginText = "登 录";
            this.refresh();
            return;
          }
          localStorage.setItem("token", res.data.token);
          // console.log(window.location.host + "/#/admin");
          // location.href = window.location.host + "/#/admin";
          this.$router.push("/admin");
        })
        .catch(err => {
          this.$message.error(
            err.message ? err.message : "服务器错误，请联系管理员"
          );
          this.loading = false;
          this.loginText = "登 录";
        });
    },
    createBackground() {
      //定义画布宽高和生成点的个数
      var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight,
        POINT = 20;

      var canvas = document.getElementById("canvas");
      (canvas.width = WIDTH), (canvas.height = HEIGHT);
      var context = canvas.getContext("2d");
      (context.strokeStyle = "rgba(155,155,155,0.1)"),
        (context.strokeWidth = 1),
        (context.fillStyle = "rgba(155,155,155,0.1)");
      var circleArr = [];

      //线条：开始xy坐标，结束xy坐标，线条透明度
      function Line(x, y, _x, _y, o) {
        (this.beginX = x),
          (this.beginY = y),
          (this.closeX = _x),
          (this.closeY = _y),
          (this.o = o);
      }
      //点：圆心xy坐标，半径，每帧移动xy的距离
      function Circle(x, y, r, moveX, moveY) {
        (this.x = x),
          (this.y = y),
          (this.r = r),
          (this.moveX = moveX),
          (this.moveY = moveY);
      }
      //生成max和min之间的随机数
      function num(max, _min) {
        var min = arguments[1] || 0;
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      // 绘制原点
      function drawCricle(cxt, x, y, r, moveX, moveY) {
        var circle = new Circle(x, y, r, moveX, moveY);
        cxt.beginPath();
        cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
        cxt.closePath();
        cxt.fill();
        return circle;
      }
      //绘制线条
      function drawLine(cxt, x, y, _x, _y, o) {
        var line = new Line(x, y, _x, _y, o);
        cxt.beginPath();
        cxt.strokeStyle = "rgba(155,155,155," + o + ")";
        cxt.moveTo(line.beginX, line.beginY);
        cxt.lineTo(line.closeX, line.closeY);
        cxt.closePath();
        cxt.stroke();
      }
      //初始化生成原点
      function init() {
        circleArr = [];
        for (var i = 0; i < POINT; i++) {
          circleArr.push(
            drawCricle(
              context,
              num(WIDTH),
              num(HEIGHT),
              num(15, 2),
              num(10, -10) / 40,
              num(10, -10) / 40
            )
          );
        }
        draw();
      }
      //每帧绘制
      function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < POINT; i++) {
          drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
        }
        for (var i = 0; i < POINT; i++) {
          for (var j = 0; j < POINT; j++) {
            if (i + j < POINT) {
              var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
                B = Math.abs(circleArr[i + j].y - circleArr[i].y);
              var lineLength = Math.sqrt(A * A + B * B);
              var C = 1 / lineLength * 7 - 0.009;
              var lineOpacity = C > 0.2 ? 0.2 : C;
              if (lineOpacity > 0) {
                drawLine(
                  context,
                  circleArr[i].x,
                  circleArr[i].y,
                  circleArr[i + j].x,
                  circleArr[i + j].y,
                  lineOpacity
                );
              }
            }
          }
        }
      }
      //调用执行
      window.onload = function() {
        init();
        setInterval(function() {
          for (var i = 0; i < POINT; i++) {
            var cir = circleArr[i];
            cir.x += cir.moveX;
            cir.y += cir.moveY;
            if (cir.x > WIDTH) cir.x = 0;
            else if (cir.x < 0) cir.x = WIDTH;
            if (cir.y > HEIGHT) cir.y = 0;
            else if (cir.y < 0) cir.y = HEIGHT;
          }
          draw();
        }, 16);
      };
    },
    refresh() {
      // this.img = "http://localhost:8080/sys/valicode?t=" + Date.now();
      this.img = baseURL + "/sys/valicode?t=" + Date.now();
    }
  }
};
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}
form {
  width: 300px;
  text-align: center;
}
.el-form-item.is-required .el-form-item__label:before {
  content: "";
}
.vali {
  height: 40px;
}
</style>
