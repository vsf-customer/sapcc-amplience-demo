<template>
  <SfTabs class="order-history" :open-tab="1">
    <SfTab :title="$t('My orders')">
      <MyAccountHeading>
        {{ $t('Details and status orders') }}
      </MyAccountHeading>
      <OrderHistoryEntry
        v-if="currentOrderCode"
        :order-code="currentOrderCode"
      />
      <OrderHistoryList
        v-else
        :current-page="currentPage"
        @order-selected="selectOrder"
      />
    </SfTab>
  </SfTabs>
</template>

<script>
import {
  SfTabs,
  SfTable,
  SfButton,
  SfProperty,
  SfLink,
  SfLoader,
  SfPagination
} from '@storefront-ui/vue';
import { onMounted, useRoute, useRouter, computed, unref } from '@nuxtjs/composition-api';
import { useUserOrderHistory } from '@vsf-enterprise/sapcc';
import MyAccountHeading from '~/components/MyAccount/MyAccountHeading.vue';
import OrderHistoryList from '~/components/MyAccount/OrderHistoryList.vue';
import OrderHistoryEntry from '~/components/MyAccount/OrderHistoryEntry.vue';

export default {
  name: 'PersonalDetails',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty,
    SfLink,
    SfLoader,
    SfPagination,
    MyAccountHeading,
    OrderHistoryList,
    OrderHistoryEntry
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { load, loading } = useUserOrderHistory();

    const routeQuery = computed(() => route.value.query);
    const currentPage = computed(() => Number(unref(routeQuery).page) - 1 || 0);
    const currentOrderCode = computed(() => unref(routeQuery).orderCode);

    onMounted(async () => {
      await load({
        pageSize: 3,
        statuses: 'SUSPENDED',
        currentPage: currentPage.value,
        sort: 'byOrderNumber'
      });
    });

    const selectOrder = (order) => {
      router.push({ query: { ...unref(routeQuery), orderCode: order.code }});
    };

    return {
      currentOrderCode,
      loading,
      currentPage,
      selectOrder
    };
  }
};
</script>

<style lang="scss" scoped>
.order-history {
  width: 100%;
  @include for-mobile {
    flex-wrap: nowrap;
    flex-direction: column;
  }
}
.all-orders {
  --button-padding: var(--spacer-base) 0;
}
.message {
  margin: 0 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--primary);
  &__link {
    color: var(--c-primary);
    font-weight: var(--font-weight--medium);
    font-family: var(--font-family--primary);
    font-size: var(--font-size--base);
    text-decoration: none;
    &:hover {
      color: var(--c-text);
    }
  }
}
.highlighted {

  &:last-child {
    margin-bottom: 0;
  }

  ::v-deep .sf-property__value {
    text-align: right;
  }
  &--total {
    margin-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    --property-name-font-size: var(--font-size--lg);
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-size: var(--font-size--lg);
    --property-value-font-weight: var(--font-weight--semibold);
  }
}
</style>
