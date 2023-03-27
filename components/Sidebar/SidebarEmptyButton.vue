<template>
  <SfButton
    class="sf-button--full-width color-secondary"
    @click="$emit('clicked')"
  >
    {{ $t('Go back shopping') }}
  </SfButton>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfButton } from '@storefront-ui/vue';

export default defineComponent({
  name: 'SidebarEmptyButton',
  components: { SfButton }
});
</script>
