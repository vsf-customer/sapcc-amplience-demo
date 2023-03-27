<template>
  <div class="order-history">
    <SfTable v-if="orders.length" class="order-history__orders">
      <SfTableHeading>
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
        >
          {{ tableHeader }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="order in orders"
        :key="order.code"
        class="order-history__order"
        @click.native="selectOrder(order)"
      >
        <SfTableData v-e2e="'order-number'">{{ order.code }}</SfTableData>
        <SfTableData>{{ getOrderDate(order) }}</SfTableData>
        <SfTableData>{{ getOrdertotal(order) }}</SfTableData>
        <SfTableData :class="getOrderStatusClass(order)">
          {{ order.statusDisplay }}
        </SfTableData>
      </SfTableRow>
      <SfPagination
        class="order-history__pagination"
        :total="totalPages"
        :current="currentPage"
        hasArrows
      />
    </SfTable>
    <div
      v-else-if="orderHistory && !orders.length"
      class="order-history__no-orders"
    >
      <p class="no-orders__title">
        {{ $t('You currently have no orders') }}
      </p>
      <SfButton class="no-orders__button">
        {{ $t('Start shopping') }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { SfTable, SfButton, SfPagination } from '@storefront-ui/vue';
import { defineComponent, computed, useContext } from '@nuxtjs/composition-api';
import { useUserOrderHistory } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'OrderHistoryList',
  components: { SfTable, SfButton, SfPagination },
  props: {
    currentPage: {
      type: Number,
      default: 0
    }
  },
  setup(_props, { emit }) {
    const { i18n } = useContext();
    const { orderHistory } = useUserOrderHistory();
    const tableHeaders = ['Order ID', 'Payment date', 'Amount', 'Status'];
    const statusClassMap = {
      CANCELLED: 'danger',
      OPEN: 'warning',
      SUSPENDED: 'warning',
      CHECKED_VALID: 'warning',
      COMPLETE: 'success'
    };

    const orders = computed(() => orderHistory.value?.orders ?? []);
    const totalPages = computed(() => orderHistory.value?.pagination.totalPages ?? 0);

    const getOrderDate = (order) => i18n.d(new Date(order.placed), 'short');
    const getOrdertotal = (order) => order.total?.formattedValue ?? '';
    const getOrderStatusClass = (order) => `text-${statusClassMap[order.status]}`;

    const selectOrder = (order) => {
      emit('order-selected', order);
    };

    return {
      orderHistory,
      orders,
      totalPages,
      getOrderDate,
      getOrdertotal,
      getOrderStatusClass,
      tableHeaders,
      statusClassMap,
      selectOrder
    };
  }
});
</script>

<style lang="scss" scoped>
.order-history {
  &__orders {
    @include for-desktop {
      &__element--right {
        --table-column-flex: 1;
        text-align: right;
      }
    }
  }
  &__order {
    cursor: pointer;
  }
  &__pagination {
    margin-top: var(--spacer-sm);
  }
  &__no-orders {
    &__title {
      margin: 0 0 var(--spacer-lg) 0;
      font: var(--font-weight--normal) var(--font-size--base) / 1.6
        var(--font-family--primary);
    }
    &__button {
      --button-width: 100%;
      @include for-desktop {
        --button-width: 17, 5rem;
      }
    }
  }
}
</style>
