<template>
  <div class="category-footer">
    <SfPagination
      v-if="!loading"
      class="category-footer__pagination "
      v-show="pagination.totalPages > 1"
      :current="pagination.currentPage"
      :total="pagination.totalPages"
      pageParamName="page"
      :visible="5"
    />

    <div
      v-if="pagination.totalPages > 1"
      class="category-footer__items-per-page"
    >
      <span class="category-footer__items-per-page__label">
        {{ $t('Show on page') }}
      </span>
      <SfSelect
        class="category-footer__items-per-page__options"
        data-testid="items-per-page-select"
        :value="pagination.pageSize.toString()"
        @input="changeItemsPerPage($event, pagination.pageSize)"
      >
        <SfSelectOption
          v-for="option in pageSizeOptions"
          :key="option"
          class="category-footer__items-per-page__option"
          :value="option"
        >
          {{ option }}
        </SfSelectOption>
      </SfSelect>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api';
import { SfPagination, SfSelect } from '@storefront-ui/vue';
import { useProductSearch } from '@vsf-enterprise/sapcc';
import { useUiHelpers } from '~/composables';
export default defineComponent({
  name: 'CategoryFooter',
  components: { SfPagination, SfSelect },
  setup() {
    const { $config } = useContext();
    const { changeItemsPerPage } = useUiHelpers();
    const { result, loading } = useProductSearch('category-search');

    const pageSizeOptions = $config.theme.category.pageSizeOptions;
    const pagination = computed(() => result.value.pagination);

    return {
      changeItemsPerPage,
      loading,
      pagination,
      pageSizeOptions
    };
  }
});
</script>

<style lang="scss" scoped>
.category-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacer-2xl);
  padding: var(--spacer-sm);
  @include for-mobile {
    flex-direction: column;
    align-items: center;
  }
  &__items-per-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}
</style>
