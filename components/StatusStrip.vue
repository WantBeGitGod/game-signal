<template>
  <section v-if="status" class="status-strip">
    <div>
      <span>数据状态</span>
      <strong>{{ status.data_state === "live" ? "LIVE" : "LEGACY PREVIEW" }}</strong>
    </div>
    <div>
      <span>最近采集</span>
      <strong>{{ status.latest_collection_at || "等待采集" }}</strong>
    </div>
    <div>
      <span>连续运行</span>
      <strong>{{ status.continuous_live_days }} DAYS</strong>
    </div>
    <div>
      <span>发布状态</span>
      <strong>{{ status.latest_publish_status || "PREVIEW" }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PublicStatus } from "~/types/public"
defineProps<{ status?: PublicStatus | null }>()
</script>
