<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts"/>
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <tree-tools slot-scope="{ data }" :tree-node="data"  @delDepts="getDepartments" @addDepts="addDepts"  @editDepts="editDepts"/>
        </el-tree>
      </el-card>
     
    </div>
     <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments"/>
  </div>
</template>
<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import AddDept from './components/add-dept.vue' // 引入新增部门组件

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人", id: "" },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
      showDialog: false, // 显示窗体
      node: {}

    };
  },
  created() {
    this.getDepartments(); // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人" }; // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      console.log(result.depts);
      this.departs = tranListToTreeData(result.depts, "");
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    editDepts(node) {
      // 首先打开弹层
      console.log("aaaaaa");
      this.showDialog = true
      this.node = node // 赋值操作的节点
       this.$refs.addDept.getDepartDetail(node.id) 
    }
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
