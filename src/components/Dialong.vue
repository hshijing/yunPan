<template>
  <el-dialog
    :model-value="show"
    :close-on-click-modal="false"
    :draggable="true"
    :destroy-on-close="true"
    :show-close="showClose"
    :title="title"
    :top="top + 'px'"
    :width="width"
    @close="close"
  >
    <div>
      <slot></slot>
    </div>
    <template v-if="(buttons && buttons.length > 0) || showCancel">

      <div class="dialog-footer">
        <el-button link @click="close" v-if="showCancel">取消</el-button>
        <el-button
          v-for="btn in buttons"
          :key="btn.text"
          :type="btn.type || 'primary'"
          @click="btn.click"
          :style="{'margin-left':btn.buttonLeft}"
          >{{ btn.text }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
interface Button{
  text: string,
  type?: string,
  buttonLeft: string,
  click: (e:any) => void
}
type Buttons=Button[]
defineProps({
  show: {
    //是否展示
    type: Boolean,
    default: false,
  },
  //是否展示X按钮关闭
  showClose: {
    type: Boolean,
    default: false,
  },
  title: {
    //标题
    type: String,
  },
  top: {
    //距离顶部的距离
    type: Number,
    default: 20,
  },
  width: {
    //宽度
    type: String,
    default: "30%",
  },
  // 按钮
  buttons: {
    type:Array as () => Buttons,
    default: () => [],
  },
  // 是否展示传入按钮
  showCancel: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>
