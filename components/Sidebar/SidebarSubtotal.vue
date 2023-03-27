<template>
  <SfProperty
    :name="$t('Subtotal price')"
    class="sidebar-subtotal sf-property--full-width sf-property--large"
  >
    <template #value>
      <SfPrice
        :regular="subtotal"
        :special="0"
      />
    </template>
  </SfProperty>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfProperty, SfPrice } from '@storefront-ui/vue';

export default defineComponent({
  name: 'SidebarSubtotal',
  components: { SfProperty, SfPrice },
  props: {
    subtotal: {
      type: String,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.sidebar-subtotal {
  margin: 0 0 var(--spacer-sm) 0;
}
</style>
