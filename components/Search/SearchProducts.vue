<template>
  <SfMegaMenuColumn
    :title="$t('Product suggestions')"
    class="search-products sf-mega-menu-column--pined-content-on-mobile"
  >
    <template #title="{ title }">
      <SfMenuItem
        :label="title"
        class="sf-mega-menu-column__header"
        icon=""
      />
    </template>
    <SfScrollable class="search-products--desktop desktop-only">
      <div class="search-products__listing" data-testid="search-products-list">
        <ProductCard
          v-for="product in products"
          :key="product.code"
          :product="product"
        />
      </div>
    </SfScrollable>
    <div class="search-products--mobile smartphone-only">
      <ProductCard
        v-for="product in products"
        :key="product.code"
        :product="product"
      />
    </div>
  </SfMegaMenuColumn>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import {
  SfProductCard,
  SfScrollable,
  SfMenuItem
} from '@storefront-ui/vue';
import ProductCard from '~/components/ProductCard.vue';

export default defineComponent({
  name: 'SearchProducts',
  components: {
    SfProductCard,
    SfScrollable,
    SfMenuItem,
    ProductCard
  },
  props: {
    products: {
      type: Array,
      default: () => ([])
    }
  }
});
</script>

<style lang="scss" scoped>
.search {
  &-products {
    flex: 1;
    width: 100%;

    ::v-deep .sf-mega-menu-column__header {
      pointer-events: none;
      margin: 0;
      @include for-desktop {
        margin-bottom: var(--spacer-sm);
        display: flex;
      }
    }

    &__listing {
      display: flex;
      flex-wrap: wrap;
      margin-left: var(--spacer-2xs);
    }
    &--desktop {
      --scrollable-max-height: 35vh;
      ::v-deep .sf-scrollable__view-all {
        display: none;
      }
    }
    &--mobile {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      background: var(--c-white);
      padding: var(--spacer-base) var(--spacer-sm);
      --product-card-max-width: 9rem;
    }
  }
}

</style>
