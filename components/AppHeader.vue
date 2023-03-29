<template>
  <div>
    <SfHeader
      class="sf-header--has-mobile-search"
      :class="{ 'header-on-top': isSearchOpen }"
      :isNavVisible="isMobileMenuOpen"
    >
      <template #logo>
        <Logo />
      </template>
      <template #navigation>
        <CmsHeaderNavigation />
      </template>
      <template #aside>
        <div class="selector-container smartphone-only">
          <CurrencySelector />
          <LocaleSelector />
        </div>
      </template>
      <template #header-icons>
        <div data-testid="icons" class="sf-header__icons">
          <SfButton
            class="sf-button--pure sf-header__action"
            @click="handleAccountClick"
          >
            <SfIcon :icon="accountIcon" size="1.25rem" />
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            @click="toggleWishlistSidebar"
          >
            <SfIcon class="sf-header__icon" icon="heart" size="1.25rem" />
            <SfBadge
              v-if="wishlistTotalItems"
              class="sf-badge--number cart-badge"
              >{{ wishlistTotalItems }}</SfBadge
            >
          </SfButton>
          <SfButton
            class="sf-button--pure sf-header__action"
            @click="toggleCartSidebar"
          >
            <SfIcon class="sf-header__icon" icon="empty_cart" size="1.25rem" />
            <SfBadge
              data-testid="cart-badge"
              v-if="cartTotalItems"
              class="sf-badge--number cart-badge"
              >{{ cartTotalItems }}</SfBadge
            >
          </SfButton>
        </div>
      </template>
      <template #search>
        <SfSearchBar
          data-testid="search-bar"
          class="sf-header__search"
          ref="searchBarRef"
          :placeholder="$t('Search for items')"
          :aria-label="$t('Search')"
          :value="term"
          :icon="searchBarIcon"
          @input="handleSearchDebounced"
          @keydown.enter="handleSearchDebounced($event)"
          @click="openSearchModal"
          @focus="openSearchModal"
          @keydown.esc="closeSearch"
          @click:icon="focusSearchBar"
        />
      </template>
    </SfHeader>
    <SearchResults
      @close="closeSearch"
      @suggestion-click="handleSearch"
      v-click-outside="closeSearch"
    />
    <SfOverlay :visible="isSearchOpen" />
  </div>
</template>

<script>
import {
  SfHeader,
  SfImage,
  SfIcon,
  SfButton,
  SfBadge,
  SfSearchBar,
  SfOverlay,
  SfMenuItem,
  SfModal
} from '@storefront-ui/vue';
import { useUiState } from '~/composables';
import {
  useCart,
  useUser,
  cartGetters,
  useProductSearch,
  useProductSuggestions,
  useCategory
} from '@vsf-enterprise/sapcc';
import {
  computed,
  ref,
  watch,
  useRouter,
  useRoute
} from '@nuxtjs/composition-api';
import { useVSFContext, onSSR } from '@vue-storefront/core';
import { useUiHelpers } from '~/composables';
import LocaleSelector from './LocaleSelector';
import SearchResults from '~/components/Search/SearchResults';
import { clickOutside } from '@storefront-ui/vue/src/utilities/directives/click-outside/click-outside-directive.js';
import debounce from 'lodash.debounce';
import CurrencySelector from './CurrencySelector';
import HeaderNavigation from '~/components/HeaderNavigation';
import Logo from './Logo.vue';
import CmsHeaderNavigation from './CmsHeaderNavigation.vue';

export default {
  components: {
    CurrencySelector,
    SfHeader,
    SfImage,
    LocaleSelector,
    SfIcon,
    SfButton,
    SfBadge,
    SfSearchBar,
    SearchResults,
    SfOverlay,
    SfMenuItem,
    SfModal,
    HeaderNavigation,
    Logo,
    CmsHeaderNavigation
  },
  directives: { clickOutside },
  setup() {
    const {
      toggleCartSidebar,
      toggleWishlistSidebar,
      toggleLoginModal,
      isMobileMenuOpen,
      toggleMobileMenu,
      openSearchModal,
      closeSearchModal,
      isSearchOpen
    } = useUiState();
    const { getSearchFromURL } = useUiHelpers();
    const { isAuthenticated } = useUser();
    const { loadAll: loadCategories, categories } = useCategory();
    const { cart } = useCart('main');
    const { cart: wishlist } = useCart('wishlist');
    const { localePath } = useVSFContext();
    const { search, reset: resetSearch } = useProductSearch('header-search');
    const { load: getSuggestions, reset: resetSuggestions } = useProductSuggestions('header-search');
    const router = useRouter();
    const route = useRoute();
    const term = ref(getSearchFromURL()?.term || '');
    const searchBarRef = ref(null);
    const cartTotalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const wishlistTotalItems = computed(() => cartGetters.getTotalItems(wishlist.value));
    const accountIcon = computed(() => isAuthenticated.value ? 'profile_fill' : 'profile');
    const searchBarIcon = computed(() => ({
      icon: term.value ? 'cross' : 'search',
      size: '20px',
      color: 'var(--c-text)'
    }));
    const handleAccountClick = async () => {
      if (!isAuthenticated.value) toggleLoginModal();
      else router.push(localePath({ name: 'my-profile' }));
    };
    const handleSearch = async (paramValue) => {
      term.value = paramValue.target?.value || paramValue;
      if (!term.value) {
        resetSearch();
        resetSuggestions();
        return;
      }
      await Promise.all([
        search({ searchTerm: term.value }),
        getSuggestions({
          searchTerm: term.value,
          max: 5
        })
      ]);
    };
    const handleSearchDebounced = debounce(handleSearch, 1000);
    const closeSearch = (event) => {
      if (!isSearchOpen.value) return;
      const searchBar = searchBarRef.value.$el;
      if (!event || (event.key === 'Escape' || !searchBar.contains(event.target))) {
        term.value = '';
        closeSearchModal();
        resetSearch();
        resetSuggestions();
      }
    };
    const focusSearchBar = () => {
      const inputElement = searchBarRef.value.$el.querySelector('input');
      term.value = '';
      inputElement.focus();
      resetSearch();
      resetSuggestions();
    };
    watch(() => route.value.fullPath, closeSearch);

    onSSR(async () => {
      await loadCategories();
    });

    return {
      accountIcon,
      cartTotalItems,
      wishlistTotalItems,
      handleAccountClick,
      toggleCartSidebar,
      toggleWishlistSidebar,
      term,
      isSearchOpen,
      handleSearch,
      handleSearchDebounced,
      closeSearch,
      searchBarRef,
      isMobileMenuOpen,
      toggleMobileMenu,
      openSearchModal,
      closeSearchModal,
      focusSearchBar,
      searchBarIcon,
      categories
    };
  }
};
</script>
<style lang="scss" scoped>
.sf-header {
  --header-padding: var(--spacer-sm);
  @include for-desktop {
    --header-padding: 0;
  }
  &__logo-image {
    height: 100%;
  }
}
.header-on-top {
  z-index: 2;
}
.nav-item {
  --header-navigation-item-margin: 0 var(--spacer-base);
  .sf-header-navigation-item__item--mobile {
    display: none;
  }
  &--mobile {
    padding: var(--spacer-xs) 0;
  }
}
.selector-container {
  display: flex;
}
.cart-badge {
  position: absolute;
  bottom: 40%;
  left: 40%;
}
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
</style>
