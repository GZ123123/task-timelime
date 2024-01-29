<template>
  <div
    id="calendar"
    @add:items="onItemsChange"
    @modify:groups="onGroupsChange"
  ></div>
</template>

<script setup>
import "@/assets/plugin/calendar";
import "@/assets/plugin/calendar.css";

import { onMounted } from "vue";

const onItemsChange = (e) => {
  console.log("onItemsChange: ", e);
};

const onGroupsChange = (e) => {
  console.log("onGroupsChange: ", e);
};

onMounted(() => {
  window.renderCalendar("calendar");
});
</script>
