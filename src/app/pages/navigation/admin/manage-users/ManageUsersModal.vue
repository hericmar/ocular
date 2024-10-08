<template>
  <Dialog :title="t('navigation.admin.manageUsers')" :open="open" @close="emit('close')">
    <ul v-if="users.length" :class="$style.list">
      <li v-for="usr of users" :key="usr.username" :class="$style.item">
        <span :class="$style.name">{{ usr.username }}</span>
        <Button
          :color="usr.isAdministrator ? 'success' : 'dimmed'"
          textual
          :icon="RiShieldUserLine"
          @click="toggleAdmin(usr, !usr.isAdministrator)"
        />
        <Button color="danger" textual :icon="RiCloseCircleLine" @click="removeUser(usr)" />
      </li>
    </ul>
    <p v-else :class="$style.placeholder">{{ t('navigation.admin.noUsersFound') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { RiCloseCircleLine, RiShieldUserLine } from '@remixicon/vue';
import { ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import { GenesisUser } from '@storage/createGenesisStore';
import { useStorage } from '@storage/index';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { user, getAllUsers, updateUser, deleteUser } = useStorage();

const users = ref<GenesisUser[]>([]);

const toggleAdmin = async (user: GenesisUser, admin: boolean) => {
  await updateUser(user.id, { ...user, isAdministrator: admin });
  await fetchUsers();
};

const removeUser = async (user: GenesisUser) => {
  if (window.confirm(t('navigation.admin.deleteUserConfirmation', { name: user.username }))) {
    await deleteUser(user.id);
    await fetchUsers();
  }
};

const fetchUsers = async () => (users.value = await getAllUsers());

watch([user, toRef(props, 'open')], ([user]) => user?.isAdministrator && void fetchUsers(), { immediate: true });
</script>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none outside none;
  gap: 2px;
  margin: 0;
  max-height: 225px;
  overflow-y: auto;
  overflow-x: hidden;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  min-width: 175px;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-s);

  .name {
    display: inline-block;
    margin-right: auto;
    cursor: default;
  }
}

.actions {
  width: 100%;
  display: flex;
  padding-top: 6px;
  justify-content: space-between;
}

.placeholder {
  text-align: center;
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  color: var(--c-dimmed);
}
</style>
