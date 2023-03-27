<template>
  <div>
    <SfAlert
      v-if="product.stock.stockLevel === 0"
      message="Out of Stock"
      type="warning"
    >
      <template v-slot:icon>
        <SfIcon
          color="yellow-primary"
          icon="info_shield"
          size="lg"
          view-box="0 0 24 24"
        />
      </template>
    </SfAlert>
    <AddToCart
      :disabled="!canAddToCart"
      :max="maxQuantity"
      @add-to-cart="addToCart({ productCode: product.code, quantity: $event })"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api';
import { useCartEntries } from '@vsf-enterprise/sapcc';
import { SfAlert, SfIcon } from '@storefront-ui/vue';
import AddToCart from '~/components/AddToCart';

export default defineComponent({
  name: 'ProductAddToCart',
  components: { AddToCart, SfAlert, SfIcon },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup({ product }) {
    const {
      add: addToCart,
      loading: cartEntriesLoading,
      getMaxQuantity
    } = useCartEntries('main');

    const isBaseProduct = computed(() => product.variantOptions && product.variantOptions.length);
    const maxQuantity = computed(() => getMaxQuantity({ product }));
    const canAddToCart = computed(() => !isBaseProduct.value && !cartEntriesLoading.value.add && maxQuantity.value > 0);

    return { addToCart, cartEntriesLoading, canAddToCart, maxQuantity };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__add-to-cart {
    @include for-desktop {
      margin-top: var(--spacer-xl);
    }
  }
}
</style>
