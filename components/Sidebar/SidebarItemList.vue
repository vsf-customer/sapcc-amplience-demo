<template>
  <transition-group class="sidebar-item-list" name="sf-fade" tag="div" data-testid="sidebar-item-list">
    <SfCollectedProduct
      v-for="item in items"
      :key="cartGetters.getItemSku(item)"
      class="sidebar-item-list__entry"
      :has-more-actions="false"
      :image="$getCloudinaryUploadPath(cartGetters.getItemImage(item))"
      :title="cartGetters.getItemName(item)"
      :regular-price="cartGetters.getFormattedPrice(item)"
      :special-price="getSpecialPrice(item)"
      :qty="cartGetters.getItemQty(item)"
      :maxQty="getItemStockLevel(item)"
      @input="$emit('change-item-quantity', { entryNumber: item.entryNumber, quantity: $event })"
      @click:remove="$emit('remove-item', { entryNumber: item.entryNumber })"
    >
      <template #title="{ title }">
        <div class="sf-collected-product__title-wraper">
          <SfLink
            class="sf-collected-product__title"
            data-testid="product-title"
            :link="localePath(productGetters.getSlug(item.product))"
            @click.native="$emit('close')"
          >
            {{ title }}
          </SfLink>
        </div>
      </template>
      <template #image="{ image, title }">
        <SfImage
          class="sf-collected-product__image"
          data-testid="product-image"
          :src="image"
          :alt="title"
          :width="140"
          :height="140"
          :imageTag="$globalImgTag"
        />
      </template>
      <template #configuration>
        <div class="sidebar-item-list__entry__properties">
          <SfProperty
            v-for="(attribute, key) in cartGetters.getItemAttributes(
              item,
              ['color', 'size', 'style']
            )"
            :key="key"
            :name="key"
            :value="attribute.label"
          />
        </div>
      </template>
      <template #actions>
        <slot name="item-actions" v-bind="{ item }" />
      </template>
      <template #input>
        <slot name="input" />
      </template>
    </SfCollectedProduct>
  </transition-group>
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api';
import { SfCollectedProduct, SfLink, SfImage, SfProperty } from '@storefront-ui/vue';
import { cartGetters, productGetters } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'SidebarItemList',
  components: { SfCollectedProduct, SfLink, SfImage, SfProperty },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { i18n } = useContext();

    const getSpecialPrice = (entry) =>
      cartGetters.getItemPrice(entry).special &&
      i18n.n(cartGetters.getItemPrice(entry).special, 'currency');
    const getItemStockLevel = (item) => item.product.stock.stockLevel;

    return {
      cartGetters,
      productGetters,
      getSpecialPrice,
      getItemStockLevel
    };
  }
});
</script>

<style lang="scss" scoped>
.sidebar-item-list {
  --collected-product-remove-circle-icon-display: flex;
  --collected-product-remove-text-display: none;
  --collected-product-actions-display: flex;

  ::v-deep .sf-collected-product__actions {
    align-items: flex-start;
  }

  &__entry {
    margin: 0 0 var(--spacer-sm) 0;
    &__properties {
      margin: var(--spacer-xs) 0 0 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      flex: 2;
      &:first-child {
        margin-bottom: 8px;
      }
    }
    &__actions {
      transition: opacity 150ms ease-in-out;
    }
    &:hover {
      --collected-product-configuration-display: initial;
    }
  }
}
</style>
