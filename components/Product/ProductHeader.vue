<template>
  <div class="product__header">
    <SfHeading
      :title="productGetters.getName(product)"
      :level="3"
      class="sf-heading--no-underline sf-heading--left"
      data-testid="product-header"

    />
    <SfIcon
      icon="drag"
      size="xxl"
      color="var(--c-text-disabled)"
      class="product__drag-icon smartphone-only"
    />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfHeading, SfIcon } from '@storefront-ui/vue';
import { productGetters } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'ProductHeader',
  components: { SfHeading, SfIcon },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { productGetters };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
