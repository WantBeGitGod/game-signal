<script setup lang="ts">
const route = useRoute()
await navigateTo(`/articles/${String(route.params.slug)}`, { redirectCode: 301 })
</script>
