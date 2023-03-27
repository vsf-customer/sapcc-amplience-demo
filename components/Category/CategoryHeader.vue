<template>
  <div class="category-header section">
    <div class="category-header__aside desktop-only">
      <SfHeading
        class="category-header__title"
        :level="3"
        :title="$t('Categories')"
      />
    </div>
    <div data-testid="category-header" class="category-header__main">
      <SfButton
        class="sf-button--text category-header__filters-button"
        data-testid="filters-button"
        :aria-label="$t('Filters')"
        @click="toggleFilterSidebar"
      >
        <SfIcon
          size="24px"
          color="dark-secondary"
          icon="filter2"
          class="category-header__filters-icon"
        />
        {{ $t('Filters') }}
      </SfButton>

      <div class="category-header__sort desktop-only">
        <span class="category-header__label">{{ $t('Sort by') }}:</span>
        <LazyHydrate on-interaction>
          <SfSelect
            :value="selectedSortingOption && selectedSortingOption.code"
            placeholder="Select sorting"
            class="category-header__select"
            data-testid="sorting-select"
            @input="changeSorting"
          >
            <SfSelectOption
              v-for="option in sortingOptions"
              :key="option.code"
              :value="option.code"
              class="sort-by__option"
              >{{ option.name }}</SfSelectOption
            >
          </SfSelect>
        </LazyHydrate>
      </div>

      <div class="category-header__counter">
        <span class="category-header__label desktop-only"
          >{{ $t('Products found') }}:
        </span>
        <span data-testid="results-amount" class="desktop-only">{{ totalResults }}</span>
        <span data-testid="results-amount" class="category-header__label smartphone-only"
          >{{ totalResults }} {{ $t('Items') }}</span
        >
      </div>

      <div class="category-header__view">
        <span class="category-header__view-label desktop-only">{{ $t('View') }}</span>
        <SfIcon
          class="category-header__view-icon"
          data-testid="grid-view-icon"
          :color="isCategoryGridView ? 'black' : 'dark-secondary'"
          icon="tiles"
          size="12px"
          role="button"
          :aria-label="$t('Change to grid view')"
          :aria-pressed="isCategoryGridView"
          @click="changeToCategoryGridView"
        />
        <SfIcon
          class="category-header__view-icon"
          data-testid="list-view-icon"
          :color="!isCategoryGridView ? 'black' : 'dark-secondary'"
          icon="list"
          size="12px"
          role="button"
          :aria-label="$t('Change to list view')"
          :aria-pressed="!isCategoryGridView"
          @click="changeToCategoryListView"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@nuxtjs/composition-api';
import { useUiState, useUiHelpers } from '~/composables';
import { useProductSearch } from '@vsf-enterprise/sapcc';
import {
  SfButton,
  SfIcon,
  SfSelect,
  SfHeading
} from '@storefront-ui/vue';
import LazyHydrate from 'vue-lazy-hydration';
export default {
  name: 'CategoryHeader',
  components: {
    SfButton,
    SfIcon,
    SfSelect,
    LazyHydrate,
    SfHeading
  },
  setup() {
    const { changeSorting } = useUiHelpers();
    const { toggleFilterSidebar, isCategoryGridView, changeToCategoryGridView, changeToCategoryListView } = useUiState();
    const { result } = useProductSearch('category-search');
    const totalResults = computed(() => result.value?.pagination?.totalResults);
    const sortingOptions = computed(() => result.value?.sorts);
    const selectedSortingOption = computed(() => result.value?.sorts?.find(sort => sort.selected));
    return {
      changeSorting,
      totalResults,
      toggleFilterSidebar,
      isCategoryGridView,
      changeToCategoryGridView,
      changeToCategoryListView,
      sortingOptions,
      selectedSortingOption
    };
  }
};
</script>
<style lang="scss" scoped>
.category-header {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }
  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside,
  &__main {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
  }
  &__aside {
    flex: 0 0 15%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }
  &__main {
    flex: 1;
    padding: 0;
    justify-content: space-between;
    @include for-desktop {
      padding: var(--spacer-xs) var(--spacer-xl);
    }
  }
  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }
  &__filters-icon {
    margin: 0 0 0 var(--spacer-xs);
    order: 1;
    @include for-desktop {
      margin: 0 var(--spacer-xs) 0 0;
      order: 0;
    }
  }
  &__filters-button {
    display: flex;
    align-items: center;
    --button-font-size: var(--font-size--base);
    --button-text-decoration: none;
    --button-color: var(--c-link);
    --button-font-weight: var(--font-weight--normal);
    @include for-mobile {
      --button-font-weight: var(--font-weight--medium);
      order: 2;
    }
    svg {
      fill: var(--c-text-muted);
      transition: fill 150ms ease;
    }
    &:hover {
      svg {
        fill: var(--c-primary);
      }
    }
  }
  &__label {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--normal);
    color: var(--c-text-muted);
    @include for-desktop {
      color: var(--c-link);
      margin: 0 var(--spacer-2xs) 0 0;
    }
  }
  &__select {
    --select-width: 220px;
    --select-padding: 0;
    --select-height: auto;
    --select-selected-padding: 0 var(--spacer-lg) 0 var(--spacer-2xs);
    --select-margin: 0;
    --select-option-font-size: var(--font-size-sm);
    --select-error-message-height: 0;
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size-sm);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--light);
      margin: 0;
    }
    ::v-deep .sf-select__placeholder {
      --select-option-font-size: var(--font-size-sm);
    }
  }
  &__sort {
    display: flex;
    align-items: center;
    margin: 0 auto 0 var(--spacer-2xl);
  }
  &__counter {
    font-family: var(--font-family--secondary);
    order: 1;
    @include for-desktop {
      margin: auto 0 auto auto;
      order: 0;
    }
  }
  &__view {
    display: flex;
    align-items: center;
    order: 0;
    @include for-desktop {
      margin: 0 0 0 var(--spacer-2xl);
      order: 0;
    }
    &-icon {
      cursor: pointer;
      margin: 0 var(--spacer-base) 0 0;
      &:last-child {
        margin: 0;
      }
    }
    &-label {
      margin: 0 var(--spacer-sm) 0 0;
      font: var(--font-weight--normal) var(--font-size--base) / 1.6
        var(--font-family--secondary);
      text-decoration: none;
      color: var(--c-link);
    }
  }
}
.sort-by {
  flex: unset;
  width: 11.875rem;
}
</style>
