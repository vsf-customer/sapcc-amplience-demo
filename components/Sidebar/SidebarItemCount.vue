<template>
  <SfProperty
    v-if="itemCount"
    class="sidebar-item-count sf-property--large"
    :name="$t('Total items')"
    :value="itemCount"
  />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfProperty } from '@storefront-ui/vue';

export default defineComponent({
  name: 'SidebarItemCount',
  components: { SfProperty },
  props: {
    itemCount: {
      type: Number,
      default: 0
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-item-count {
  margin-top: var(--spacer-xl);
}
</style>
