<template>
  <div class="cart-sidebar">
    <SfSidebar
      class="sf-sidebar--right"
      data-testid="sidebar-cart"
      :visible="isCartSidebarOpen"
      :title="$t('My Cart')"
      position="right"
      @close="toggleCartSidebar"
    >
      <template #content-top>
        <SidebarItemCount :item-count="totalItems" data-testid="total-items"/>
      </template>

      <SidebarEmptyMessage v-if="!totalItems" />
      <SidebarItemList
        v-else
        :class="{'cart-sidebar__item-list--remove-button-hidden': isRemovingItemsBlocked }"
        :items="items"
        @change-item-quantity="updateCartItem($event)"
        @remove-item="removeCartItem($event)"
        @close="toggleCartSidebar"
      >
        <template #item-actions="{ item }">
          <SfButton
            v-if="!isRemovingItemsBlocked"
            class="sf-button--text"
            :disabled="!!getWishlistItem({ productCode: item.product.code })"
            @click="moveItemToWishlist(item)"
          >
            {{ $t('Add to wishlist') }}
          </SfButton>
          <span v-else />
        </template>
      </SidebarItemList>

      <template #content-bottom>
        <SidebarEmptyButton v-if="!totalItems" @clicked="toggleCartSidebar" />
        <div v-else>
          <SidebarSubtotal :subtotal="totals.subTotalFormatted" />
          <SfButton
            v-if="!isCheckout"
            data-testid="clear-cart-button"
            class="cart-sidebar__clear-button sf-button--full-width color-secondary"
            @click="clearCart"
          >
            {{ $t('Remove all items') }}
          </SfButton>
          <SfButton
            class="sf-button--full-width color-primary"
            data-testid="go-to-checkout-button"
            @click="goToCheckout"
          >
            {{ $t('Go to checkout') }}
          </SfButton>
        </div>
      </template>
      <SidebarLoader :is-loading="isLoading" />
    </SfSidebar>
  </div>
</template>
<script>
import { SfSidebar, SfButton } from '@storefront-ui/vue';
import { computed, useRouter, useRoute } from '@nuxtjs/composition-api';
import { useVSFContext } from '@vue-storefront/core';
import {
  useCart,
  useCartEntries,
  useUser,
  cartGetters,
  ANONYMOUS_USER_ID
} from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';
import SidebarItemCount from '~/components/Sidebar/SidebarItemCount';
import SidebarItemList from '~/components/Sidebar/SidebarItemList';
import SidebarEmptyMessage from '~/components/Sidebar/SidebarEmptyMessage';
import SidebarEmptyButton from '~/components/Sidebar/SidebarEmptyButton';
import SidebarSubtotal from '~/components/Sidebar/SidebarSubtotal';
import SidebarLoader from '~/components/Sidebar/SidebarLoader';

export default {
  name: 'CartSidebar',
  components: {
    SfSidebar,
    SfButton,
    SidebarItemCount,
    SidebarItemList,
    SidebarEmptyMessage,
    SidebarEmptyButton,
    SidebarSubtotal,
    SidebarLoader
  },
  setup() {
    const { localePath } = useVSFContext();
    const router = useRouter();
    const route = useRoute();
    const { isAuthenticated } = useUser();
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const { cart, clear, load, loading: cartLoading } = useCart('main');
    const { update: updateCartItem, remove: removeCartItem, loading: cartEntriesLoading } = useCartEntries('main');
    const { get: getWishlistItem, add: addWishlistItem } = useCartEntries('wishlist');

    const items = computed(() => cartGetters.getItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const isCheckout = computed(() => route.value.matched.some(route => route.path === localePath({ name: 'checkout'})));
    const isRemovingItemsBlocked = computed(() => isCheckout.value && totalItems.value === 1);
    const isLoading = computed(() => {
      const { clear: clearingCart } = cartLoading.value;
      const { update: updatingCartItem, remove: removingCartItem } = cartEntriesLoading.value;
      return clearingCart || updatingCartItem || removingCartItem;
    });

    const clearCart = async () => {
      await clear();
      await load();
    };
    const moveItemToWishlist = async (entry) => {
      const { entryNumber, product: { code: productCode } } = entry;
      await removeCartItem({ entryNumber });
      await addWishlistItem({ productCode });
    };
    const goToCheckout = () => {
      toggleCartSidebar();
      const nextRouteName = isAuthenticated.value || cart.value?.user?.uid !== ANONYMOUS_USER_ID
        ? 'shipping'
        : 'email';
      router.push(localePath({ name: nextRouteName }));
    };

    return {
      items,
      removeCartItem,
      goToCheckout,
      clearCart,
      updateCartItem,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      isLoading,
      getWishlistItem,
      moveItemToWishlist,
      isCheckout,
      isRemovingItemsBlocked
    };
  }
};
</script>

<style lang="scss" scoped>
.cart-sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
  &__item-list {
    &--remove-button-hidden {
      ::v-deep .sf-collected-product__remove {
        display: none;
      }
    }
  }
  &__clear-button {
    margin-bottom: var(--spacer-xs);
  }
}
</style>
