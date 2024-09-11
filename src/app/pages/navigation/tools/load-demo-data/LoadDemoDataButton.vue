<template>
  <ContextMenuButton :text="t('navigation.tools.demo.loadDemoData')" :icon="RiMagicLine" @click="loadDemoData" />
</template>

<script lang="ts" setup>
import { RiMagicLine } from '@remixicon/vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { useDataStore } from '@store/state';
import { DataState } from '@store/state/types';

const { deserialize } = useDataStore();
const { t } = useI18n();

const loading = ref(false);

const loadDemoData = async () => {
  if (loading.value) return;
  loading.value = true;

  const { default: data } = await import('./DemoData.json');
  data.id = crypto.randomUUID();
  await deserialize(data as DataState);

  loading.value = false;
};

onMounted(() => {
  if (location.hash === '#demo') {
    loadDemoData();
  }
});
</script>
