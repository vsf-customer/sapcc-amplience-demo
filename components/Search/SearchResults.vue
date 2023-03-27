<template>
  <SfMegaMenu
    class="search-results"
    data-testid="search-modal"
    :visible="isSearchOpen"
    :title="$t('Search results')"
  >
    <transition name="sf-fade" mode="out-in">
      <div
        v-if="products && products.length > 0"
        class="search-results__wrapper"
        key="results"
      >
        <div class="search-results__suggestions" data-testid="search-results-suggestions">
          <!-- Category suggestions -->
          <SearchSuggestions
            :title="$t('Categories')"
            :suggestions="categories"
          />
          <!-- Keyword suggestions -->
          <SearchSuggestions
            v-if="suggestions.length"
            :title="$t('Search suggestions')"
            :suggestions="suggestions"
          >
            <template #suggestion="{ suggestion }">
              <SfMenuItem
                :label="suggestion.value"
                @click="$emit('suggestion-click', suggestion.value)"
                icon=""
              />
            </template>
          </SearchSuggestions>
        </div>
        <!-- Product suggestions -->
        <SearchProducts :products="products" />
      </div>
      <SearchNoResults
        v-else
        key="no-results"
      />
    </transition>
  </SfMegaMenu>
</template>

<script>
import { SfMegaMenu, SfMenuItem } from '@storefront-ui/vue';
import { defineComponent, watch, computed } from '@nuxtjs/composition-api';
import { useProductSearch, useProductSuggestions, useCategory } from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';
import SearchSuggestions from '~/components/Search/SearchSuggestions.vue';
import SearchProducts from '~/components/Search/SearchProducts.vue';
import SearchNoResults from '~/components/Search/SearchNoResults.vue';
export default defineComponent({
  name: 'SearchResults',
  components: {
    SfMegaMenu,
    SfMenuItem,
    SearchSuggestions,
    SearchProducts,
    SearchNoResults
  },
  setup() {
    const { isSearchOpen } = useUiState();
    const { result } = useProductSearch('header-search');
    const { suggestions } = useProductSuggestions('header-search');
    const { categories } = useCategory();
    const products = computed(() => result.value?.products ?? []);
    watch(isSearchOpen, () => {
      if (isSearchOpen.value) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    });
    return {
      isSearchOpen,
      products,
      suggestions,
      categories
    };
  }
});
</script>
<style lang="scss" scoped>
.search-results {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 3;
  --mega-menu-column-header-margin: var(--spacer-sm) 0 var(--spacer-xl);
  --mega-menu-content-padding: 0;
  --mega-menu-height: auto;
  @include for-desktop {
    --mega-menu-content-padding: var(--spacer-xl) 0;
  }
  &__wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    @include for-desktop {
      flex-direction: row;
      flex: 1;
    }
  }
  &__suggestions {
    display: flex;
    flex-direction: column;
    flex: 0 0 220px;
    @include for-mobile {
      width: 100%;
    }
  }
  ::v-deep .sf-bar {
    display: none;
  }
}
</style>
