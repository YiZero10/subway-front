<template>
  <el-container>
    <el-header
      style="
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        margin: auto;
      "
    >
      <img
        class="logo"
        src="https://pic.90sjimg.com/design/00/07/85/23/59335c9282770.png"
      />
      <h1 style="display: inline">{{ msg }}</h1>
    </el-header>
    <el-main>
      <el-row :gutter="20" class="container">
        <el-col :span="5">
          <div class="grid-content">
            <div class="block">
              <el-cascader
                v-model="startValue"
                ref="start"
                :options="fisrtLines"
                :props="cascaderProps"
                @change="handleStart"
                placeholder="请选择起始站"
              >
              </el-cascader>
            </div>
          </div>
        </el-col>
        <el-col :span="0.5">
          <div class="grid-content">
            <span class="mes-content">至</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
            <div class="block">
              <el-cascader
                v-model="endValue"
                ref="end"
                :options="secondLines"
                :props="cascaderProps"
                @change="handleEnd"
                placeholder="请选择终点站"
              >
              </el-cascader>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="source">
        <div class="block">
          <div class="radio">
            <el-radio-group v-model="reverse" @change="getResult">
              <el-radio :label="true">最短路径</el-radio>
              <el-radio :label="false">最少换乘</el-radio>
            </el-radio-group>
          </div>

          <el-timeline class="timeLine">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :color="activity.color"
              :size="activity.size"
            >
              <div>
                <p class="station">{{ activity.content }}</p>
                <p class="station stationLine">{{ activity.line }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Subway",
  props: {
    msg: String,
  },
  data() {
    return {
      startValue: [],
      endValue: [],
      fisrtLines: [],
      secondLines: [],
      startStation: null,
      endStation: null,
      cascaderProps: {
        expandTrigger: "hover",
      },
      reverse: null,
      activities: [],
    };
  },
  created() {
    this.$axios.get("/api/get").then((res) => {
      var result = res.data;
      console.log(result);
      result.arrayList.forEach((element) => {
        if (element != null) {
          this.fisrtLines.push({
            value: element.id,
            label: element.name,
            children: element.stations.arrayList.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          });
        }
      });
    });
    this.$axios.get("/api/get").then((res) => {
      var result = res.data;
      result.arrayList.forEach((element) => {
        if (element != null) {
          this.secondLines.push({
            value: element.id,
            label: element.name,
            children: element.stations.arrayList.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          });
        }
      });
    });
  },
  methods: {
    handleStart() {
      let start = this.$refs["start"].getCheckedNodes()[0];
      this.reverse = null;
      this.activities = [];
      this.startStation = {
        lid: start.getPath()[0],
        sid: start.getPath()[1],
      };
    },
    handleEnd() {
      let end = this.$refs["end"].getCheckedNodes()[0];
      this.reverse = null;
      this.activities = [];
      this.endStation = {
        lid: end.getPath()[0],
        sid: end.getPath()[1],
      };
    },
    getResult(value) {
      let data = {
        startStation: this.startStation,
        endStation: this.endStation,
      };
      if(! this.startStation || ! this.endStation){
        this.$message.error('请选择起始站点或重点站点！');
        this.reverse = null;
        return;
      }
      this.reverse = value;
      let flag = this.startStation.lid === this.endStation.lid;
      let URL = "/api/cal"
      if(!value && !flag){
        URL = "/api/dfs";
      }
      this.$axios.post(URL, data).then((res) => {
        this.activities = [];
        console.log(res);
        var datas = res.data.passStations.arrayList;
        let start = res.data.start;
        if(!start){
          start = datas[0];
          datas.shift();
        }
        this.activities.push({
          content: start.name,
          line: start.line,
          size: "large",
          color: "#0bbd87",
        });
        datas.forEach((element) => {
          if (element != null) {
            this.activities.push({
              content: element.name,
              line: element.line,
            });
          }
        });
        let flag = this.activities[0].line;
        for (let index = 0; index < this.activities.length; index++) {
          const element = this.activities[index];
          if (element.line !== flag) {
            flag = element.line;
            this.activities[index - 1].color = "#0bbd87";
            this.activities[index - 1].size = "large";
            this.activities[index - 1].line = "换乘：" + flag;
          }
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logo {
  width: 30px;
  height: 30px;
}
.container {
  display: flex;
  justify-content: center;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
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
.mes-content {
  font-size: 20px;
  font-weight: 800;
  color: #606266;
  line-height: 36px;
}
.button-parent {
  border-bottom: 2px solid #606266;
}
.button-content {
  font-size: 20px;
  font-weight: 800;
}
.source {
  width: 200px;
  padding: 24px;
  margin: 0 auto;
}
.el-timeline-item__content {
  color: #303133;
}

.el-timeline-item__wrapper {
  position: relative;
  padding-left: 0px;
  top: -3px;
}

.timeLine {
  padding: 10px;
  padding-left: revert;
  margin: 0px auto;
  text-align: left;
}
.station {
  margin: 0px;
}

.stationLine {
  color: #606266;
}
.el-cascader-node__label {
  padding: 0;
}
</style>
