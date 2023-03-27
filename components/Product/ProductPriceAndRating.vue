<template>
  <div class="product__price-and-rating">
    <SfPrice
      :regular="productGetters.getFormattedPrice(product)"
      :special="
        productGetters.getPrice(product).special &&
          $n(productGetters.getPrice(product).special, 'currency')
      "
    />
    <div>
      <div class="product__rating">
        <SfRating :score="averageRating" :max="5" />
        <a href="#" class="product__count">
          ({{ totalReviews }})
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api';
import { productGetters } from '@vsf-enterprise/sapcc';
import { SfPrice, SfRating } from '@storefront-ui/vue';

export default defineComponent({
  name: 'ProductPriceAndRating',
  components: { SfPrice, SfRating },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup({ product }) {
    const totalReviews = computed(() => product.reviews.length);
    const averageRating = computed(() =>
      product.reviews.reduce((accumulator, review) => accumulator + Number(review.rating), 0) / totalReviews.value
    );

    return { productGetters, totalReviews, averageRating };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>
