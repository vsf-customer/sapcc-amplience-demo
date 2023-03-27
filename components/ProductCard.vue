<template>
  <component
    :is="componentName"
    :class="componentClass"
    data-testid="category-product-card"
    :title="productGetters.getName(product)"
    :image="$getCloudinaryUploadPath(productImageUrl)"
    :image-tag="productImageUrl ? $globalImgTag : 'img'"
    :regular-price="productGetters.getFormattedPrice(product)"
    :special-price="specialPrice && $n(specialPrice, 'currency')"
    :max-rating="5"
    :score-rating="productGetters.getAverageRating(product)"
    :isAddedToCart="Boolean(cartEntry)"
    :isInWishlist="Boolean(wishlistEntry)"
    :link="localePath(productGetters.getSlug(product))"
    :image-height="imageSize.height"
    :image-width="imageSize.width"
    :wishlist-icon="!isHorizontal && wishlistIcon"
    @click:wishlist="toggleWishlistItem"
    @click:add-to-cart="addToCart({ productCode: product.code, quantity: 1 })"
    :add-to-cart-disabled="!canAddToCart"
    show-add-to-cart-button
  >
    <template #title="{ title, link }">
      <SfButton
        class="sf-button--pure sf-product-card__link"
        data-testid="product-link"
        :link="link"
      >
        <span class="sf-product-card__title" v-html="title" />
      </SfButton>
    </template>
    <template #configuration>
      <SfProperty
        class="desktop-only"
        name="Size"
        value="XS"
      />
    </template>
    <template #actions>
      <SfButton
        class="sf-button--text"
        :aria-label="$t('Add to wishlist')"
        @click="toggleWishlistItem({ product })"
      >
        <SfIcon
          :icon="wishlistIcon"
          size="19px"
          data-test="sf-wishlist-icon"
        />
      </SfButton>
    </template>
    <template v-if="isHorizontal" #add-to-cart>
      <AddToCart
        :disabled="!canAddToCart"
        :max="maxQuantity"
        @add-to-cart="addToCart({ productCode: product.code, quantity: $event })"
      />
    </template>
  </component>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api';
import { productGetters, useCartEntries } from '@vsf-enterprise/sapcc';
import AddToCart from '~/components/AddToCart';
import {
  SfProductCard,
  SfProductCardHorizontal,
  SfButton,
  SfIcon,
  SfProperty
} from '@storefront-ui/vue';

export default defineComponent({
  name: 'ProductCard',
  components: {
    SfProductCard,
    SfProductCardHorizontal,
    SfButton,
    SfIcon,
    SfProperty,
    AddToCart
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    isHorizontal: {
      type: Boolean,
      default: false
    },
    imageWidth: {
      type: [Number, String],
      default: null
    },
    imageHeight: {
      type: [Number, String],
      default: null
    }
  },
  setup(props) {
    const {
      get: getWishlistEntry,
      add: addToWishlist,
      remove: removeFromWishlist
    } = useCartEntries('wishlist');
    const {
      add: addToCart,
      get: getCartEntry,
      loading: cartLoading,
      getMaxQuantity
    } = useCartEntries('main');

    const componentName = computed(() => `SfProductCard${props.isHorizontal ? 'Horizontal' : ''}`);
    const componentClass = computed(() => `product-card${props.isHorizontal ? '--horizontal' : ''}`);
    const wishlistEntry = computed(() => getWishlistEntry({ productCode: props.product.code }));
    const cartEntry = computed(() => getCartEntry({ productCode: props.product.code }));
    const wishlistIcon = computed(() => wishlistEntry.value ? 'heart_fill' : 'heart');
    const specialPrice = computed(() => productGetters.getPrice(props.product).special);
    const imageSize = computed(() => ({
      height: props.imageHeight || props.isHorizontal ? 140 : 215,
      width: props.imageWidth || props.isHorizontal ? 140 : 215
    }));
    const maxQuantity = computed(() => getMaxQuantity({ product: props.product }));
    const canAddToCart = computed(() => !cartLoading.value.add && maxQuantity.value > 0);
    const productImageUrl = computed(() => {
      const { images = [] } = props.product;
      const productImage = images.find(image => image.format === 'product');

      if (productImage) return productImage.url;

      if (images.length) {
        const firstAvailableImage = images[0];
        return firstAvailableImage.url;
      }

      return '';
    });

    const toggleWishlistItem = () => wishlistEntry.value
      ? removeFromWishlist({ entryNumber: wishlistEntry.value.entryNumber })
      : addToWishlist({ productCode: props.product.code });

    return {
      componentName,
      componentClass,
      productGetters,
      addToCart,
      toggleWishlistItem,
      wishlistIcon,
      productImageUrl,
      specialPrice,
      imageSize,
      cartEntry,
      wishlistEntry,
      canAddToCart,
      maxQuantity
    };
  }
});
</script>

<style lang="scss" scoped>
.product-card {
  ::v-deep .sf-product-card {
    &__image-wrapper {
      position: static;
    }
    &__wishlist-icon {
      right: var(--spacer-xs);
      top: var(--spacer-xs);
    }
    &__add-button {
      bottom: var(--spacer-xs);
      right: var(--spacer-xs);
    }
    &__title {
      .search-results-highlight {
        color: var(--c-primary);
      }
    }
  }

  ::v-deep .sf-image {
    &--placeholder {
      @include for-mobile {
        height: 154px;
        width: 154px;
      }
    }
  }

  &--horizontal {
    width: 100%;
    padding: var(--spacer-xs);

    @include for-desktop {
      margin-bottom: var(--spacer-lg);
    }

    ::v-deep .sf-product-card-horizontal {
      &__image-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
      }
      &__actions {
        width: 100%;
        display: flex;
        justify-content: flex-end;

        @include for-desktop {
          margin-bottom: var(--spacer-xs);
        }
      }
    }

    ::v-deep .sf-image {
      &--placeholder {
        @include for-mobile {
          height: 85px;
          width: 85px;
        }
      }
    }
  }
}
</style>
