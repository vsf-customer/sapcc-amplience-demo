<template>
  <SfLoader
    class="sidebar-loader"
    :loading="isLoading"
    :class="{ 'sidebar-loader--active': isLoading }"
  />
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfLoader } from '@storefront-ui/vue';

export default defineComponent({
  name: 'SidebarSubtotal',
  components: { SfLoader },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: auto;
  height: auto;
  &--active {
    z-index: 2;
    --loader-overlay-background: rgb(255, 255, 255, 0.6);
  }
}
</style>
