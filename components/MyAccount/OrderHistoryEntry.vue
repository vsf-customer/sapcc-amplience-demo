<template>
  <SfLoader :loading="!order">
    <div class="order-history-entry" v-if="order">
      <div class="order-history-entry__details">
        <SfProperty
          class="sf-property--full-width property"
          :name="$t('Order ID')"
          :value="order.code"
        />
        <SfProperty
          class="sf-property--full-width property"
          :name="$t('Created')"
          :value="orderDate"
        />
        <SfProperty
          class="sf-property--full-width property"
          :name="$t('Status')"
          :value="order.statusDisplay"
        />
        <SfProperty
          class="sf-property--full-width property"
          :name="$t('Total')"
          :value="orderTotalPrice"
        />
      </div>
      <OrderEntriesList :entries="order.entries" />
    </div>
  </SfLoader>
</template>

<script>
import { defineComponent, onMounted, computed, useContext } from '@nuxtjs/composition-api';
import { SfProperty, SfLoader } from '@storefront-ui/vue';
import { useOrder } from '@vsf-enterprise/sapcc';
import OrderEntriesList from '~/components/OrderEntriesList';

export default defineComponent({
  name: 'OrderHistoryEntry',
  components: { SfProperty, SfLoader, OrderEntriesList },
  props: {
    orderCode: {
      type: String,
      required: true
    }
  },
  setup({ orderCode }) {
    const { i18n } = useContext();
    const { load: loadOrder, order } = useOrder(orderCode);

    const orderDate = computed(() => i18n.d(new Date(order.value.created), 'short'));
    const orderTotalPrice = computed(() => order.value.totalPrice?.formattedValue ?? '');

    onMounted(async () => {
      loadOrder({ code: orderCode });
    });

    return { order, orderDate, orderTotalPrice };
  }
});
</script>

<style lang="scss" scoped>
.order-history-entry {
  width: 100%;

  &__details {
    box-sizing: border-box;
    background-color: var(--c-light);
    padding: var(--spacer-sm);

    ::v-deep .sf-property__name {
     white-space: nowrap;
    }

    @include for-desktop {
      --property-name-font-size: var(--font-size--lg);
      --property-name-font-weight: var(--font-weight--medium);
      --property-value-font-size: var(--font-size--lg);
      --property-value-font-weight: var(--font-weight--semibold);
    }
  }
}
</style>
