<template>
  <div class="payment">
    <SfHeading
      class="payment__title sf-heading--left sf-heading--no-underline"
      :level="3"
      :title="$t('Payment')"
    />
    <OrderEntriesList
      v-if="products"
      :entries="products"
    />
    <div v-if="products" class="summary">
      <div class="summary__group">
        <div class="summary__total">
          <SfProperty
            name="Subtotal"
            :value="
              totals.special > 0 ? totals.special : totals.subTotalFormatted
            "
            class="sf-property--full-width property"
          />
        </div>

        <SfDivider/>

        <SfProperty
          name="Total price"
          :value="totals.totalFormatted"
          class="
            sf-property--full-width sf-property--large
            summary__property-total
          "
        />

        <SfDivider class="payment-section-divider"/>

        <BillingForm/>

        <VsfPaymentProvider ref="paymentProvider" />

        <SfCheckbox
          v-e2e="'terms'"
          v-model="terms"
          name="terms"
          class="summary__terms"
        >
          <template #label>
            <div class="sf-checkbox__label">
              {{ $t('I agree to') }}
              <SfLink link="#"> {{ $t('Terms and conditions') }}</SfLink>
            </div>
          </template>
        </SfCheckbox>

        <div class="summary__action">
          <SfButton
            data-testid="make-an-order-button"
            :disabled="loading || !terms"
            class="summary__action-button"
            @click="processOrder"
          >
            {{ $t('Make an order') }}
          </SfButton>
          <SfButton
            type="button"
            class="sf-button color-secondary summary__back-button smartphone-only"
            @click="goBack"
          >
            {{ $t('Go back') }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SfHeading,
  SfCheckbox,
  SfButton,
  SfDivider,
  SfIcon,
  SfProperty,
  SfAccordion,
  SfLink
} from '@storefront-ui/vue';
import { useVSFContext } from '@vue-storefront/core';
import { ref, computed, useRouter, onMounted } from '@nuxtjs/composition-api';
import {
  useOrder,
  useCart,
  cartGetters,
  usePayment,
  useMockedPSP,
  useCartPaymentDetails,
  useUser
} from '@vsf-enterprise/sapcc';
import { useBillingForm } from '../../composables/useBillingForm';
import { useUiNotification } from '~/composables';
import OrderEntriesList from '~/components/OrderEntriesList';

export default {
  name: 'ReviewOrder',
  components: {
    SfHeading,
    SfCheckbox,
    SfButton,
    SfDivider,
    SfIcon,
    SfProperty,
    SfAccordion,
    SfLink,
    OrderEntriesList,
    VsfPaymentProvider: () =>
      import('~/components/Checkout/VsfPaymentProvider.vue'),
    BillingForm: () => import('~/components/Checkout/BillingForm.vue')
  },
  setup(_props, { refs }) {
    const router = useRouter();
    const { isAuthenticated } = useUser();
    const { cart, load: loadCart, set: setCart } = useCart('main');
    const { replace: replacePaymentDetails } = useCartPaymentDetails('main');
    const { order, place: placeOrder, loading: loadingOrder } = useOrder();
    const { localePath, i18n } = useVSFContext();
    const {
      clearPaymentResponse,
      sopPaymentRequest,
      loadSopPaymentResponse,
      loadSopPaymentRequest,
      loadPaymentDetailsList,
      loadingSopPaymentResponse,
      loadingSopPaymentRequest
    } = usePayment('payment-provider');

    const {
      changeBillingDataForPaymentProvider,
      isShippingAddress
    } = useBillingForm();

    const { send: sendNotification } = useUiNotification();

    const {
      entries: mockedPSPEntries,
      mockedPSP,
      loading: loadingMockedPSP
    } = useMockedPSP('payment-provider');

    const isPaymentReady = computed(() => Boolean(cart.value?.paymentInfo?.id));
    const terms = ref(true);
    const cartId = computed(() => isAuthenticated.value ? cart.value?.code : cart.value?.guid);

    const makePayment = async () => {
      const paymentDetails = await refs.paymentProvider?.getPaymentDetails?.();

      if (!paymentDetails) {
        sendNotification({
          type: 'danger',
          message: i18n.t('Add a valid payment detail')
        });
        return false;
      }

      if (typeof paymentDetails === 'string') {
        await replacePaymentDetails({ paymentDetailsId: paymentDetails });
        await loadCart();
        return true;
      }

      const sopReqProps = {
        cartId: cartId.value,
        responseUrl: 'sampleUrl'
      };

      const cardEntries = [
        { key: 'card_nameOnCard', value: paymentDetails.cardHolderName },
        { key: 'card_cardType', value: paymentDetails.selectedCard },
        { key: 'card_accountNumber', value: paymentDetails.cardNumber },
        {
          key: 'card_expirationMonth',
          value: paymentDetails.cardExpirationMonth
        },
        {
          key: 'card_expirationYear',
          value: paymentDetails.cardExpirationYear
        },
        { key: 'card_cvNumber', value: paymentDetails.cardSecurityCode },
        {
          key: 'savePaymentInfo',
          value: true
        },
        {
          key: 'defaultPayment',
          value: paymentDetails.defaultPayment
        }
      ];
      await loadSopPaymentRequest(sopReqProps);

      const entries = isShippingAddress()
        // eslint-disable-next-line no-unsafe-optional-chaining
        ? [...sopPaymentRequest.value?.parameters?.entry, ...cardEntries]
        : [
          ...(changeBillingDataForPaymentProvider(
            sopPaymentRequest.value?.parameters?.entry
          ) || []),
          ...cardEntries
        ];

      await mockedPSP({
        postURL: sopPaymentRequest.value?.postUrl,
        entries: entries
      });

      const sopResProps = { cartId: cartId.value, entries: [...mockedPSPEntries.value] };

      await loadSopPaymentResponse(sopResProps);
      await loadPaymentDetailsList({ saved: true });
      await loadCart();
      return true;
    };

    const processOrder = async () => {
      if (!isPaymentReady.value) {
        const paymentResult = await makePayment();
        if (!paymentResult) return;
      }

      if (!isPaymentReady.value)
        return sendNotification({
          type: 'danger',
          message: i18n.t('Payment is not successfull')
        });

      await placeOrder({ cartId: cartId.value });
      clearPaymentResponse();
      setCart(null);
      await loadCart();
      router.push(localePath({
        name: 'thank-you',
        query: { order: order.value[isAuthenticated.value ? 'code' : 'guid'] }
      }));
    };

    const products = computed(() =>
      (cartGetters.getItems(cart.value))?.map((entry) => ({
        ...entry,
        options: cartGetters.getItemAttributes(entry, [
          'color',
          'size',
          'style'
        ])
      }))
    );

    const goBack = () => {
      router.push(localePath({ name: 'shipping' }));
    };

    onMounted(async () => {
      await loadCart();
    });

    return {
      goBack,
      isPaymentReady,
      terms,
      cart,
      products,
      totals: computed(() => cartGetters.getTotals(cart.value)),
      cartGetters,
      processOrder,
      loading: computed(
        () =>
          loadingSopPaymentResponse.value ||
          loadingSopPaymentRequest.value ||
          loadingMockedPSP.value ||
          loadingOrder.value.place
      )
    };
  }
};
</script>

<style lang="scss" scoped>
.payment {
  &__title {
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  }
}

.summary {
  &__terms {
    margin: var(--spacer-base) 0 0 0;
  }

  &__total {
    margin: 0 0 var(--spacer-sm) 0;
    flex: 0 0 16.875rem;
  }

  &__action {
    @include for-desktop {
      display: flex;
      margin: var(--spacer-xl) 0 0 0;
    }
  }

  &__action-button {
    margin: 0;
    width: 100%;
    margin: var(--spacer-sm) 0 0 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }

    &--secondary {
      @include for-desktop {
        text-align: right;
      }
    }
  }

  &__back-button {
    margin: var(--spacer-xs) 0 0 0;
    width: 100%;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
      width: auto;
    }
    color: var(--c-white);

    &:hover {
      color: var(--c-white);
    }
  }

  &__property-total {
    margin: var(--spacer-xl) 0 0 0;
  }
}

.property {
  margin: 0 0 var(--spacer-sm) 0;

  &__name {
    color: var(--c-text-muted);
  }
}

.accordion {
  margin: 0 0 var(--spacer-xl) 0;

  &__item {
    display: flex;
    align-items: flex-start;
  }

  &__content {
    flex: 1;
  }

  &__edit {
    flex: unset;
  }
}

.content {
  margin: 0 0 var(--spacer-xl) 0;
  color: var(--c-text);

  &:last-child {
    margin: 0;
  }

  &__label {
    font-weight: var(--font-weight--normal);
  }
}

.payment-section-divider {
  margin: var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-base) 0;
  }
}
</style>
