<template>
  <SfSection :title-heading="title" class="section">
    <SfLoader :class="{ loading }" :loading="loading">
      <SfCarousel
        :settings="{ peek: 16, breakpoints: { 1023: { peek: 0, perView: 2 } } }"
        class="carousel"
      >
        <SfCarouselItem class="carousel__item" v-for="(product, i) in products" :key="i">
          <ProductCard
            :key="productGetters.getSlug(product)"
            :product="product"
          />
        </SfCarouselItem>
      </SfCarousel>
    </SfLoader>
  </SfSection>
</template>

<script lang="ts">
import {
  SfCarousel,
  SfProductCard,
  SfSection,
  SfLoader
} from '@storefront-ui/vue';
import { productGetters } from '@vsf-enterprise/sapcc';
import ProductCard from '~/components/ProductCard.vue';

export default {
  name: 'RelatedProducts',
  components: {
    SfCarousel,
    SfProductCard,
    SfSection,
    SfLoader,
    ProductCard
  },
  props: {
    title: String,
    products: Array,
    loading: Boolean
  },
  setup() {
    return { productGetters };
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin-top: var(--spacer-base);
}

.carousel {
  margin: 0 calc(0 - var(--spacer-sm)) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.9375rem 0 2.4375rem 0;
  }
}

</style>
