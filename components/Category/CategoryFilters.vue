<template>
  <SfSidebar
    class="category-filters"
    :visible="isFilterSidebarOpen"
    title="Filters"
    @close="toggleFilterSidebar"
  >
    <div class="desktop-only">
      <div
        v-for="facet in facets"
        :key="facet.name"
      >
        <SfHeading
          class="category-filters__title sf-heading--left"
          :level="4"
          :title="facet.name"
          :key="`filter-title-${facet.name}`"
        />
        <div
          class="category-filters__colors"
          v-if="isFacetColor(facet)"
          :key="`${facet.name}-colors`"
        >
          <SfColor
            v-for="option in facet.values"
            :key="`${facet.name}-${option.query.query.value}`"
            :color="option.name"
            :selected="option.selected"
            class="category-filters__color"
            @click="() => applyFilter(option)"
          />
        </div>
        <div v-else>
          <SfFilter
            v-for="option in facet.values"
            :key="`${facet.name}-${option.query.query.value}`"
            :label="
              option.name + `${option.count ? ` (${option.count})` : ''}`
            "
            :selected="option.selected"
            class="category-filters__item"
            @change="() => applyFilter(option)"
          />
        </div>
      </div>
    </div>
    <SfAccordion class="smartphone-only">
      <div v-for="facet in facets" :key="facet.name">
        <SfAccordionItem
          class="category-filters__accordion-item"
          :key="`filter-title-${facet.name}`"
          :header="facet.name"
        >
          <SfFilter
            v-for="option in facet.values"
            :key="`${facet.name}-${option.query.query.value}`"
            :label="option.name"
            :selected="option.selected"
            class="category-filters__item"
            @change="() => applyFilter(option)"
          />
        </SfAccordionItem>
      </div>
    </SfAccordion>
    <template #content-bottom>
      <div class="category-filters__buttons">
        <SfButton
          class="category-filters__button--clear sf-button--full-width"
          @click="clearFilters"
        >
          {{ $t('Clear all') }}
        </SfButton>
      </div>
    </template>
    <SidebarLoader :is-loading="loading" />
  </SfSidebar>
</template>

<script>
import { defineComponent, computed, useRouter, useRoute } from '@nuxtjs/composition-api';
import { SfSidebar, SfButton, SfHeading, SfColor, SfFilter, SfAccordion } from '@storefront-ui/vue';
import { useUiState, useUiHelpers } from '~/composables';
import SidebarLoader from '~/components/Sidebar/SidebarLoader';
import { useProductSearch } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'CategoryFilters',
  components: { SfSidebar, SfButton, SfHeading, SfColor, SfFilter, SfAccordion, SidebarLoader },
  setup() {
    const { isFilterSidebarOpen, toggleFilterSidebar } = useUiState();
    const { changeFilters, isFacetColor } = useUiHelpers();
    const { result, loading } = useProductSearch('category-search');
    const router = useRouter();
    const route = useRoute();

    const facets = computed(() => result.value?.facets ?? []);

    const applyFilter = (option) => {
      option.selected = !option.selected;
      changeFilters(option);
    };

    const clearFilters = () => {
      const updatedQuery = Object.assign({}, route.value.query);
      delete updatedQuery.query;
      router.replace({ query: updatedQuery });
      toggleFilterSidebar();
    };

    return {
      applyFilter,
      isFilterSidebarOpen,
      toggleFilterSidebar,
      clearFilters,
      facets,
      isFacetColor,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.category-filters {
  --sidebar-z-index: 3;
  --overlay-z-index: 3;
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
  &__title {
    --heading-title-font-size: var(--font-size--xl);
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
    &:first-child {
      margin: calc(var(--spacer-xl) + var(--spacer-base)) 0 var(--spacer-xs) 0;
    }
  }
  &__colors {
    display: flex;
  }
  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
  }
  &__item {
    --radio-container-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    --radio-background: transparent;
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    padding: var(--spacer-sm) 0;
    border-bottom: 1px solid var(--c-light);
    &:last-child {
      border-bottom: 0;
    }
    @include for-desktop {
      --checkbox-padding: 0;
      margin: var(--spacer-sm) 0;
      border: 0;
      padding: 0;
    }
  }
  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  &__buttons {
    margin: var(--spacer-sm) 0;
  }
  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
}

::v-deep .sf-sidebar {
  &__circle-icon {
    z-index: 3;
  }
}
</style>
