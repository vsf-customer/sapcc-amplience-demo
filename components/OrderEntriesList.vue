<template>
  <div class="order-entries">
    <SfTable class="order-entries__table">
      <SfTableHeading class="order-entries__table__row">
        <SfIcon
          icon="drag"
          size="xxl"
          color="var(--c-text-disabled)"
          class="order-entries__drag-icon smartphone-only"
        />
        <SfTableHeader
          v-for="tableHeader in tableHeaders"
          :key="tableHeader"
          class="order-entries__table__header"
        >
          {{ tableHeader }}
        </SfTableHeader>
      </SfTableHeading>
      <SfTableRow
        v-for="entry in entries"
        :key="entry.entryCode"
        class="order-entries__table__row"
      >
        <SfTableData class="order-entries__table__data">
          <SfImage
            :src="$getCloudinaryUploadPath(cartGetters.getItemImage(entry))"
            :alt="cartGetters.getItemName(entry)"
            :width="100"
            :height="100"
            :imageTag="$globalImgTag"
          />
        </SfTableData>
        <SfTableData class="order-entries__table__data">
          {{ cartGetters.getItemQty(entry) }}
        </SfTableData>
        <SfTableData class="order-entries__table__data">
          <nuxt-link
            class="order-entries__table__product-title"
            :to="localePath(`/p/${entry.product.code}/details`)"
          >
            {{ cartGetters.getItemName(entry) }}
          </nuxt-link>
          <p class="order-entries__table__product-sku">
            {{ cartGetters.getItemSku(entry) }}
          </p>
        </SfTableData>
        <SfTableData class="order-entries__table__data">
          <SfPrice
            :regular="cartGetters.getItemPrice(entry).formattedRegular"
            :special="
              cartGetters.getItemPrice(entry).special &&
                $n(cartGetters.getItemPrice(entry).special, 'currency')
            "
          />
        </SfTableData>
      </SfTableRow>
    </SfTable>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfTable, SfImage, SfPrice, SfIcon } from '@storefront-ui/vue';
import { cartGetters } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'OrderEntriesList',
  components: { SfTable, SfImage, SfPrice, SfIcon },
  props: {
    entries: {
      type: Array,
      required: true
    }
  },
  setup() {
    const tableHeaders = ['Item', 'Quantity', 'Description', 'Amount'];

    return {
      tableHeaders,
      cartGetters
    };
  }
});
</script>

<style lang="scss" scoped>
.order-entries {
  --_table-column-order: 0;
  position: relative;
  @include for-mobile {
    overflow-x: scroll;
    overflow-y: hidden;
  }
  &__table {
    margin: 0 0 var(--spacer-base) 0;

    &__product-sku {
      color: var(--c-text-muted);
      font-size: var(--font-size--sm);
      margin: 0;
    }
    &__header {
      width: 100%;
      @include for-mobile {
        width: 25%;
        min-width: 150px;
        flex: initial;
      }
      &:last-child {
        text-align: right;
      }
    }
    &__data {
      @include for-mobile {
        width: 25%;
        min-width: 150px;
        flex: initial;
      }
      &:last-child {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
      }
    }
  }
  &__drag-icon {
    position: absolute;
    left: 0;
    top: 0;
    animation: horizontalmoveicon 1s ease-in-out infinite;
  }
}

@keyframes horizontalmoveicon {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  50% {
    transform: translate3d(70%, 0, 0);
  }
  100% {
    transform: translate3d(70%, 0, 0);
    opacity: 0;
  }
}

// Table mobile styles!
::v-deep .sf-table__heading {
  @include for-mobile {
    width: 100%;
    display: inline-flex;
    flex-wrap: nowrap;
  }
}
</style>
