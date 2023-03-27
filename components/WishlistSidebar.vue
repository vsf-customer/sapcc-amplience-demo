<template>
  <div class="wishlist-sidebar">
    <SfSidebar
      class="sf-sidebar--right"
      :visible="isWishlistSidebarOpen"
      :title="$t('My Wishlist')"
      position="right"
      @close="toggleWishlistSidebar"
    >
      <template #content-top>
        <SidebarItemCount :item-count="totalItems" />
      </template>

      <SidebarEmptyMessage v-if="!totalItems" />
      <SidebarItemList
        v-else
        :items="items"
        @change-item-quantity="updateQuantity($event)"
        @remove-item="removeWishlistItem($event)"
        @close="toggleWishlistSidebar"
      >
        <template #input>&nbsp;</template>
        <template #item-actions="{ item }">
          <SfButton
            class="sf-button--text"
            :disabled="!!getCartItem({ productCode: item.product.code })"
            @click="moveItemToCart(item)"
          >
            {{ $t('Add to cart') }}
          </SfButton>
        </template>
      </SidebarItemList>

      <template #content-bottom>
        <SidebarEmptyButton @clicked="toggleWishlistSidebar" />
      </template>

      <SidebarLoader :is-loading="isLoading" />
    </SfSidebar>
  </div>
</template>
<script>
import { SfSidebar, SfButton } from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import { useCart, useCartEntries, cartGetters } from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';
import SidebarItemCount from '~/components/Sidebar/SidebarItemCount';
import SidebarItemList from '~/components/Sidebar/SidebarItemList';
import SidebarEmptyMessage from '~/components/Sidebar/SidebarEmptyMessage';
import SidebarEmptyButton from '~/components/Sidebar/SidebarEmptyButton';
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
    SidebarLoader
  },
  setup() {
    const { isWishlistSidebarOpen, toggleWishlistSidebar } = useUiState();
    const { cart: wishlist } = useCart('wishlist');
    const { remove: removeWishlistItem, loading: wishlistEntriesLoading } = useCartEntries('wishlist');
    const { add: addCartItem, get: getCartItem } = useCartEntries('main');

    const items = computed(() => cartGetters.getItems(wishlist.value));
    const totalItems = computed(() => cartGetters.getTotalItems(wishlist.value));
    const isLoading = computed(() => {
      const { remove: removingFromWishlist } = wishlistEntriesLoading.value;
      return removingFromWishlist;
    });

    const moveItemToCart = async (entry) => {
      const { entryNumber, product: { code: productCode } } = entry;
      await removeWishlistItem({ entryNumber });
      await addCartItem({ productCode });
    };

    return {
      items,
      isWishlistSidebarOpen,
      toggleWishlistSidebar,
      totalItems,
      isLoading,
      getCartItem,
      moveItemToCart,
      removeWishlistItem
    };
  }
};
</script>

<style lang="scss" scoped>
.wishlist-sidebar {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
</style>
