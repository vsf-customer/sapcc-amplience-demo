<template>
  <SfAddToCart
    class="sf-product-card-horizontal__add-to-cart"
    :disabled="disabled"
    @click="addToCart"
    data-testid="add-to-cart-button"
  >
    <template #quantity-select-input>
      <SfQuantitySelector
        class="sf-add-to-cart__select-quantity"
        aria-label="Quantity"
        v-model="quantity"
        :max="max"
        :disabled="disabled"
      />
    </template>
  </SfAddToCart>
</template>

<script>
import { defineComponent, ref, unref } from '@nuxtjs/composition-api';
import { SfAddToCart, SfQuantitySelector } from '@storefront-ui/vue';

const initialQuantity = 1;

export default defineComponent({
  name: 'AddToCart',
  components: { SfAddToCart, SfQuantitySelector },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    }
  },
  setup(_props, { emit }) {
    const quantity = ref(initialQuantity);

    const addToCart = () => {
      emit('add-to-cart', unref(quantity));
      quantity.value = initialQuantity;
    };

    return { quantity, addToCart };
  }
});
</script>

<style>

</style>
