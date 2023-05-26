<template>

  <div id="category">
    <div v-if="cmsLoading">Loading content...</div>
    <!-- <div v-if="cmsError.search">Something is wrong!</div> -->
    <div v-if="content">
            <render-content :content="content" />
    </div>
    <CategoryBreadcrumbs :category-breadcrumbs="categoryBreadcrumbs" />

    <CategoryHeader />

    <div class="main section">
      <LazyHydrate when-idle>
        <CategorySidebar :category-breadcrumbs="categoryBreadcrumbs" />
      </LazyHydrate>

      <SfLoader :class="{ loading: isPageLoading }" :loading="isPageLoading">
        <div class="products">
          <transition-group
            v-if="isCategoryGridView"
            appear
            name="products__slide"
            tag="div"
            class="products__grid"
          >
            <ProductCard
              v-for="(product, i) in products"
              :key="productGetters.getSlug(product)"
              :product="product"
              :style="{ '--index': i }"
            />
          </transition-group>
          <transition-group
            v-else
            appear
            name="products__slide"
            tag="div"
            class="products__list"
          >
            <ProductCard
              v-for="(product, i) in products"
              :key="productGetters.getSlug(product)"
              :product="product"
              :style="{ '--index': i }"
              is-horizontal
            />
          </transition-group>

          <div v-if="products && !products.length" class="empty-category">
            {{ $t('Category Empty') }}
          </div>

          <CategoryFooter />

        </div>
      </SfLoader>
    </div>
  </div>
</template>

<script>
import { SfLoader } from '@storefront-ui/vue';
import { computed, onMounted, useRoute } from '@nuxtjs/composition-api';
import { productGetters, useProductSearch, useCategory } from '@vsf-enterprise/sapcc';
import { useUiHelpers, useUiState } from '~/composables';
import LazyHydrate from 'vue-lazy-hydration';
import ProductCard from '~/components/ProductCard';
import CategoryBreadcrumbs from '~/components/Category/CategoryBreadcrumbs';
import CategoryHeader from '~/components/Category/CategoryHeader';
import CategorySidebar from '~/components/Category/CategorySidebar';
import CategoryFooter from '~/components/Category/CategoryFooter';
import { getCategoryBreadcrumbs } from '~/helpers/category';
import { onSSR } from '@vue-storefront/core';
import { useContent } from '@vsf-enterprise/amplience';
import RenderContent from '../components/cms/page/RenderContent.vue';
export default {
  transition: 'fade',
  components: {
    ProductCard,
    SfLoader,
    LazyHydrate,
    CategoryBreadcrumbs,
    CategoryHeader,
    CategorySidebar,
    CategoryFooter,
    RenderContent
  },
  setup(_props, context) {
    const { getSearchFromURL } = useUiHelpers();
    const { isCategoryGridView } = useUiState();
    const { result, search, loading: productsLoading } = useProductSearch('category-search');
    const { categories, loadAll } = useCategory('category-search');
    const route = useRoute();
    const { search: cmsSearch, content, loading: cmsLoading, error: cmsError } = useContent();
    const currentCategoryId = route.value.params.slug_1;
    const products = computed(() => result.value?.products);
    const isPageLoading = computed(() => productsLoading.value || !products.value);
    const categoryBreadcrumbs = computed(() => getCategoryBreadcrumbs(categories.value, currentCategoryId));

    onSSR(async () => {
      await loadAll();
    });

    onMounted(async () => {
      context.root.$scrollTo(context.root.$el, 2000);
      await search(getSearchFromURL());
      await cmsSearch({ url: currentCategoryId });
    });
    console.log(currentCategoryId);
    return {
      isCategoryGridView,
      products,
      isPageLoading,
      productGetters,
      result,
      productsLoading,
      categoryBreadcrumbs,
      content,
      cmsError,
      cmsLoading
    };
  }
};
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}

.main {
  display: flex;
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}

.products {
  box-sizing: border-box;
  flex: 1;
  margin: 0;
  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }
  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }
  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }
  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__list {
      margin: var(--spacer-sm);
    }
  }
}

.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }
}

::v-deep .sf-sidebar__aside {
  --sidebar-z-index: 3;
}

.empty-category {
  padding: var(--spacer-sm);
  font-size: var(--font-size--lg);
  color: var(--_c-gray-primary);
}
</style>
