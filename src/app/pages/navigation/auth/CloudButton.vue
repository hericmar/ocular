<template>
  <Button
    v-tooltip="{ text: tooltip, position: 'right' }"
    :class="classes"
    textual
    :color="color"
    :icon="icon"
    @click="auth"
  />
</template>

<script lang="ts" setup>
import { RiCloudLine, RiCloudOffLine, RiRefreshLine } from '@remixicon/vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@components/base/button/Button.vue';
import { Color } from '@composables';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import type { Component } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const router = useRouter();
const { status, logout } = useStorage();

const classes = computed(() => props.class);
const tooltip = computed(() => (status.value === 'idle' ? 'Login' : 'Logout'));

const icon = computed((): Component => {
  switch (status.value) {
    case 'syncing':
      return RiRefreshLine;
    case 'idle':
      return RiCloudOffLine;
  }

  return RiCloudLine;
});

const color = computed((): Color => {
  switch (status.value) {
    case 'authenticated':
      return 'success';
    case 'loading':
      return 'warning';
    case 'idle':
      return 'danger';
    case 'syncing':
      return 'primary';
  }

  return 'danger';
});

const auth = () => {
  if (status.value === 'idle') {
    router.push({ name: 'login' });
  } else {
    logout();
    router.push({ name: 'login' });
  }
};
</script>
