<template>
  <SfLoader
    class="product__loader"
    :loading="isPageLoading"
  >
    <div v-if="product" id="product">
      <ProductBreadcrumbs :product="product" />
      <div class="product">
        <LazyHydrate when-idle>
          <ProductGallery :product="product" />
        </LazyHydrate>

        <div class="product__info">
          <ProductHeader :product="product" />
          <ProductPriceAndRating :product="product" />
          <div class="product__details">
            <div class="product__description" data-testid="product-description" v-html="product.summary"></div>
            <ProductVariants :product="product" />
            <ProductAddToCart :product="product" />
          </div>

          <LazyHydrate when-idle>
            <ProductTabs :product="product" />
          </LazyHydrate>
        </div>
      </div>

      <LazyHydrate when-visible>
        <RelatedProducts
          v-if="relatedProducts.length"
          :products="relatedProducts"
          :loading="productReferencesLoading"
          title="Match it with"
        />
      </LazyHydrate>

      <LazyHydrate when-visible>
        <InstagramFeed />
      </LazyHydrate>
    </div>
  </SfLoader>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';
import { useProduct, productGetters, useProductReferences } from '@vsf-enterprise/sapcc';
import { computed, useRoute, onMounted } from '@nuxtjs/composition-api';
import LazyHydrate from 'vue-lazy-hydration';

import ProductBreadcrumbs from '~/components/Product/ProductBreadcrumbs.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';
import ProductGallery from '~/components/Product/ProductGallery';
import ProductVariants from '~/components/Product/ProductVariants';
import ProductHeader from '~/components/Product/ProductHeader';
import ProductPriceAndRating from '~/components/Product/ProductPriceAndRating';
import ProductAddToCart from '~/components/Product/ProductAddToCart';
import ProductTabs from '~/components/Product/ProductTabs';
import InstagramFeed from '~/components/InstagramFeed.vue';

export default {
  name: 'Product',
  transition: 'fade',
  components: {
    InstagramFeed,
    RelatedProducts,
    LazyHydrate,
    SfLoader,
    ProductBreadcrumbs,
    ProductGallery,
    ProductVariants,
    ProductHeader,
    ProductPriceAndRating,
    ProductAddToCart,
    ProductTabs
  },
  setup() {
    const route = useRoute();
    const { id } = route.value.params;
    const { product, search, loading: productLoading } = useProduct(id);
    const {
      references: productReferences,
      search: searchProductReferences,
      loading: productReferencesLoading
    } = useProductReferences(id);

    const relatedProducts = computed(() => productReferences.value.map(productReference => productReference.target));
    const isPageLoading = computed(() => productLoading.value.search || !product.value);

    onMounted(async () => {
      Promise.all([
        await search({ id }),
        await searchProductReferences({
          productCode: id,
          fields: 'references(target(FULL))',
          pageSize: 6
        })
      ]);
    });

    return {
      product,
      productGetters,
      isPageLoading,
      productReferencesLoading,
      relatedProducts
    };
  }
};
</script>

<style AddReviewForm lang="scss" scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  &__loader {
    min-height: 90vh;
  }
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 5rem;
      flex: 1;
    }
  }
  &__details {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    @include for-desktop {
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
}
</style>
