<template>
  <div class="cart-preview" data-testid="cart-preview">
    <div class="highlighted">
      <SfHeading
        :level="3"
        :title="$t('Order summary')"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <div class="highlighted ">
      <SfProperty data-testid="total-items-value"
        :name="$t('Products')"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        :name="$t(discounts.length ? 'Subtotal after discounts' : 'Subtotal')"
        :value="totals.subTotalFormatted"
        :class="[
          'sf-property--full-width',
          'sf-property--large property',
          { discounted: hasSpecialPrice }
        ]"
      />
      <SfProperty
        v-if="shippingPrice"
        :name="$t('Shipping price')"
        :value="shippingPrice"
        :class="[
          'sf-property--full-width',
          'sf-property--large property',
          { discounted: hasSpecialPrice }
        ]"
      />
      <SfProperty
        v-if="cart"
        :name="$t('Discount')"
        :value="cart.totalDiscounts.formattedValue"
        class="sf-property--full-width sf-property--large property"
      />
      <template v-if="discounts.length > 0">
        <hr />
        <SfHeading
          :title="$t('Applied discounts:')"
          :level="6"
          class="sf-property--full-width sf-property--small sf-heading--left"
        />
        <SfHeading
          v-for="discount in discounts"
          :key="discount.id"
          :title="discount.description"
          :level="6"
          class="sf-property--full-width sf-property--small sf-heading--left"
        />
      </template>
      <template v-if="coupons.length > 0">
        <hr />
        <SfHeading
          :title="$t('Applied vouchers:')"
          :level="6"
          class="sf-property--full-width sf-property--small sf-heading--left"
        />
        <div
          v-for="coupon in coupons"
          :key="coupon.id"
          class="cart-preview__coupon"
        >
          <SfHeading
            :title="coupon.code"
            :description="coupon.value"
            :level="6"
            class="sf-property--full-width sf-property--small sf-heading--left cart-preview__coupon-heading"
          />
          <SfButton
            class="cart-preview__coupon-remove-button"
            @click="removeVoucher({ voucherId: coupon.code })"
          >
            <SfIcon icon="cross" size="xxs" color="white" />
          </SfButton>
        </div>
      </template>
      <SfProperty
        v-if="hasSpecialPrice"
        :value="specialFormatted"
        class="sf-property--full-width sf-property--small property special-price"
      />
      <SfProperty data-testid="total-price-value"
        :name="$t('Total')"
        :value="totals.totalFormatted"
        class="sf-property--full-width sf-property--large property-total"
      />
    </div>
    <div class="highlighted promo-code">
      <SfInput
        v-model="promoCode"
        name="promoCode"
        :label="$t('Enter promo code')"
        class="sf-input--filled promo-code__input"
      />
      <SfButton
        class="promo-code__button"
        :disabled="!promoCode"
        @click="addVoucher({ voucherId: promoCode })"
        >{{ $t('Apply') }}</SfButton
      >
    </div>
    <div v-if="error.addVoucher" class="coupon-alert">
      <SfAlert :message="$t('Coupon Error')" type="danger" />
    </div>

    <div class="highlighted">
      <SfCharacteristic
        v-for="characteristic in characteristics"
        :key="characteristic.title"
        :title="characteristic.title"
        :description="characteristic.description"
        :icon="characteristic.icon"
        class="characteristic"
      />
    </div>
    <SfLoader
      v-if="cartLoading"
      :loading="cartLoading"
      class="cart-preview__loader"
    />
  </div>
</template>
<script>
import {
  SfHeading,
  SfButton,
  SfProperty,
  SfCharacteristic,
  SfInput,
  SfCircleIcon,
  SfDivider,
  SfIcon,
  SfLoader,
  SfAlert
} from '@storefront-ui/vue';
import { computed, ref } from '@nuxtjs/composition-api';
import { useCart, cartGetters, useCartPromotions } from '@vsf-enterprise/sapcc';
import { useContext } from '@nuxtjs/composition-api';

export default {
  name: 'CartPreview',
  components: {
    SfHeading,
    SfButton,
    SfProperty,
    SfCharacteristic,
    SfInput,
    SfCircleIcon,
    SfDivider,
    SfIcon,
    SfLoader,
    SfAlert
  },
  setup() {
    const { cart } = useCart('main');
    const { addVoucher, removeVoucher, error, loading } = useCartPromotions('main');
    const { i18n } = useContext();

    const listIsHidden = ref(false);
    const promoCode = ref('');
    const showPromoCode = ref(false);

    const cartLoading = computed(() => loading.value.addVoucher || loading.value.removeVoucher);
    const products = computed(() => cartGetters.getItems(cart.value));
    const totalItems = computed(() => cartGetters.getTotalItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const discounts = computed(() => cartGetters.getDiscounts(cart.value));
    const coupons = computed(() => cartGetters.getCoupons(cart.value));
    const cartData = computed(() => cart.value);
    const shippingPrice = computed(() =>
      cartGetters.getShippingPriceFormatted(cart.value)
    );

    return {
      shippingPrice,
      cartLoading,
      coupons,
      discounts,
      totalItems,
      listIsHidden,
      products,
      totals,
      promoCode,
      showPromoCode,
      cartGetters,
      addVoucher,
      removeVoucher,
      cart: cartData,
      characteristics: [
        {
          title: i18n.t('Safety'),
          description: i18n.t('It carefully packaged with a personal touch'),
          icon: i18n.t('safety')
        },
        {
          title: i18n.t('Easy shipping'),
          description:
            i18n.t('You’ll receive dispatch confirmation and an arrival date'),
          icon: i18n.t('shipping')
        },
        {
          title: i18n.t('Changed your mind?'),
          description: i18n.t('Rest assured, we offer free returns within 30 days'),
          icon: i18n.t('return')
        }
      ],

      selectedShippingMethod: false,
      hasSpecialPrice: false,
      error
    };
  }
};
</script>

<style lang="scss" scoped>
.highlighted {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--c-light);
  padding: var(--spacer-xl) var(--spacer-xl) 0;
  &:last-child {
    padding-bottom: var(--spacer-xl);
  }
}
.total-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacer-xl);
}
.property {
  margin-bottom: var(--spacer-base);
}
.property-total {
  margin-top: var(--spacer-xl);
  padding-top: var(--spacer-lg);
  font-size: var(--font-size-xl);
  border-top: var(--c-white) 1px solid;
  --property-name-font-weight: var(--font-weight--semibold);
  --property-name-color: var(--c-text);
}

.characteristic {
  &:not(:last-child) {
    margin-bottom: var(--spacer-base);
  }
}
.promo-code {
  display: flex;
  align-items: flex-start;
  &__button {
    --button-width: 6.3125rem;
    --button-height: var(--spacer-lg);
  }
  &__input {
    --input-background: var(--c-white);
    flex: 1;
  }
}

.discounted {
  &::v-deep .sf-property__value {
    color: var(--c-danger);
    text-decoration: line-through;
  }
}

.special-price {
  justify-content: flex-end;

  &::v-deep .sf-property__name {
    display: none;
  }
}

.cart-preview {
  position: relative;
  &__coupon {
    display: flex;
  }
  &__coupon-heading {
    max-width: calc(100% - 20px);
    flex-basis: calc(100% - 20px);
  }
  &__coupon-remove-button {
    max-width: 20px;
    flex-basis: 20px;
    padding: 0;
  }
  &__loader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    --loader-overlay-background: rgb(255, 255, 255, 0.6);
  }
}

.coupon-alert {
  padding: var(--spacer-sm) var(--spacer-xl) 0;
  background-color: var(--c-light);
}
</style>
