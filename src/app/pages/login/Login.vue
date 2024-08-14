<template>
  <div :class="$style.center">
    <h3 :class="$style.title">{{ t('page.login.description') }}</h3>
    <Form :submit-label="t('navigation.auth.signIn')" @submit="signIn">
      <TextField v-model="username" required :label="t('navigation.auth.username')" type="text" name="username" />
      <TextField v-model="password" required :label="t('navigation.auth.password')" type="password" name="password" />
      <Alert v-if="state === 'errored'" :text="t('navigation.auth.loginFailed')" type="error" />
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Alert from '@components/base/alert/Alert.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/form/TextField.vue';
import { useStorage } from '@storage/index';

const router = useRouter();
const { t } = useI18n();
const { login } = useStorage();

const username = ref('');
const password = ref('');
const state = ref<'idle' | 'loading' | 'errored'>('idle');

const signIn = async () => {
  if (state.value !== 'loading') {
    state.value = 'loading';

    if (await login(username.value, password.value)) {
      username.value = '';
      password.value = '';
      state.value = 'idle';
      router.push({ name: 'dashboard' });
    } else {
      state.value = 'errored';
    }
  }
};
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 12px;
}

.title {
  font-weight: var(--font-weight-l);
  font-style: var(--font-size-m);
  padding-bottom: 14px;
}
</style>
