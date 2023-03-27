<template>
  <div data-testid="category-list" class="sidebar desktop-only">
    <SfLoader
      :class="{ 'loading--categories': isLoading }"
      :loading="isLoading"
    >
      <SfAccordion
        :open="activeCategoryName"
        :show-chevron="true"
      >
        <SfAccordionItem
          v-for="category in categories"
          :key="`sidebar-category-${category.id}`"
          :header="category.name"
        >
          <template>
            <SfList class="list">
              <SfListItem class="list__item">
                <SfMenuItem :count="category.count || ''" :label="category.name">
                  <template #label>
                    <nuxt-link
                      :to="localePath(getCatLink(category))"
                      :class="
                        category.id === currentCategoryId ? 'sidebar--cat-selected' : ''
                      "
                    >
                      {{ $t('All') }}
                    </nuxt-link>
                  </template>
                </SfMenuItem>
              </SfListItem>
              <SfListItem
                class="list__item"
                v-for="subcategory in category.subcategories"
                :key="subcategory.id"
              >
                <SfMenuItem
                  :count="subcategory.count || ''"
                  :label="subcategory.name"
                >
                  <template #label="{ label }">
                    <nuxt-link
                      :to="localePath(getCatLink(subcategory))"
                      :class="
                        subcategory.id === currentCategoryId ? 'sidebar--cat-selected' : ''
                      "
                    >
                      {{ label }}
                    </nuxt-link>
                  </template>
                </SfMenuItem>
              </SfListItem>
            </SfList>
          </template>
        </SfAccordionItem>
      </SfAccordion>
    </SfLoader>
  </div>
</template>

<script>
import { defineComponent, useRoute, computed } from '@nuxtjs/composition-api';
import { SfLoader, SfAccordion, SfList, SfMenuItem } from '@storefront-ui/vue';
import { useCategory } from '@vsf-enterprise/sapcc';
import LazyHydrate from 'vue-lazy-hydration';
import { useUiHelpers } from '~/composables';
export default defineComponent({
  name: 'CategorySidebar',
  components: { SfLoader, LazyHydrate, SfAccordion, SfList, SfMenuItem },
  props: {
    categoryBreadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { loading, categories } = useCategory('category-search');
    const { getCatLink } = useUiHelpers();
    const route = useRoute();

    const currentCategoryId = route.value.params.slug_1;
    const activeCategoryName = computed(() => props.categoryBreadcrumbs[0]?.text);
    const isLoading = computed(() => loading.value || !categories.value.length);

    return {
      isLoading,
      categories,
      currentCategoryId,
      getCatLink,
      activeCategoryName
    };
  }
});
</script>
<style lang="scss" scoped>
.loading {
  &__categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}
.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
  border: 1px solid var(--c-light);
  border-width: 0 1px 0 0;
}
.list {
  --menu-item-font-size: var(--font-size--sm);
  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }
    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}
</style>
