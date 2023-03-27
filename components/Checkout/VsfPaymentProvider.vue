<template>
  <div class="payment-provider">
    <SfHeading
      class="payment-provider__title sf-heading--left sf-heading--no-underline"
      :level="3"
      :title="$t('Payment details')"
    />

    <SfButton
      v-if="!isFormVisible"
      type="button"
      class="sf-button"
      @click='openForm'
    >
      {{ $t('Add New Payment') }}
    </SfButton>

    <SfAlert
      v-if="removeError"
      :message="removeError"
      type="danger"
    ></SfAlert>
    <SfAlert
      v-if="updateError"
      :message="updateError"
      type="danger"
    ></SfAlert>

    <div v-if="cartPaymentInfo">
      <SfHeading
        :level="4"
        :title="$t('Current Cart Payment Info')"
        class="sf-heading--left sf-heading--no-underline"
      />
      <PaymentDetails
        :item='cartPaymentInfo'
        disabled
      />
    </div>

    <ValidationObserver v-if='isFormVisible' ref="validator" v-slot="{ handleSubmit }">
      <SfHeading
        v-if="form.detailsId"
        :level="4"
        :title="$t('Update Payment Info')"
        class="sf-heading--left sf-heading--no-underline"
      />
      <form
        class="payment-details__container"
        @submit.prevent="handleSubmit(handleFormSubmit)"
      >
        <ValidationProvider
          name="card"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            data-testid="card-type"
            v-model="form.selectedCard"
            :label="$t('Select Card')"
            name="card"
            class="form__element form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          >
            <SfSelectOption
              v-for="card in cards"
              :key="card.code"
              :value="card.code"
            >
              {{ card.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>

        <ValidationProvider
          name="card-holder-name"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="card-holder-name"
            v-model="form.cardHolderName"
            :label="$t('Card Holder name')"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>

        <ValidationProvider
          name="card-number"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="card-number"
            v-model="form.cardNumber"
            :label="$t('Card Number')"
            required
            type="number"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>

        <div class="payment-card-details__container">
          <div class="payment-card-details__item">
            <ValidationProvider
              name="expiration-month"
              rules="required"
              v-slot="{ errors }"
              slim
            >
              <SfSelect
                data-testid="card-expiration-month"
                v-model="form.cardExpirationMonth"
                :label="$t('Select month')"
                name="month"
                class="form__element form__select sf-select--underlined"
                required
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
              >
                <SfSelectOption v-for="month in 12" :key="month" :value="month">
                  {{ month }}
                </SfSelectOption>
              </SfSelect>
            </ValidationProvider>
          </div>
          <div class="payment-card-details__item">
            <ValidationProvider
              name="expiration-year"
              rules="required"
              v-slot="{ errors }"
              slim
            >
              <SfSelect
                data-testid="card-expiration-year"
                v-model="form.cardExpirationYear"
                :label="$t('Select year')"
                name="year"
                class="form__element form__select sf-select--underlined"
                required
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
              >
                <SfSelectOption v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </SfSelectOption>
              </SfSelect>
            </ValidationProvider>
          </div>
          <div class="payment-card-details__item">
            <ValidationProvider
              name="cvv"
              rules="required"
              slim
            >
              <SfInput
                data-testid="card-cvv"
                name="cvv"
                v-model="form.cardSecurityCode"
                :label="$t('CVV code')"
              />
            </ValidationProvider>
          </div>
        </div>
        <div class='payment-details__actions'>
          <SfButton
            v-if="form.detailsId"
            v-e2e="'update-payment'"
            class="summary__action-button"
            type="submit"
          >
            {{ $t('Update Payment Details') }}
          </SfButton>
          <SfButton
            v-e2e="'cancel'"
            class="summary__action-button color-secondary"
            type="button"
            @click="closeForm"
          >
            {{ $t('Cancel') }}
          </SfButton>
          <SfCheckbox
            v-model="form.defaultPayment"
            :label="$t('Set as Default Payment')"
          />
        </div>

        <SfLoader
          v-if="loading"
          :loading="loading"
          class="payment-details__loader"
        />
        <SfAlert
          v-if="sopRequestError"
          :message="sopRequestError"
          type="danger"
        ></SfAlert>
      </form>
    </ValidationObserver>
    <div v-else class='payment-details-list'>
      <SfLoader
        v-if="loadingPaymentDetailsList"
        :loading="loadingPaymentDetailsList"
      />
      <template v-else>
        <div
          class='payment-details-wrapper'
          data-testid='payment-details-wrapper'
          v-for='item in paymentDetailsList'
          :key='item.id'>
          <PaymentDetails
            :item='item'
            @select='select'
            @edit='edit'
            @remove='remove'
            @setDefault='setDefault'
            :loading='loadingUpdatePaymentDetails || loadingRemovePaymentDetails'
            :selected-id='selectedPaymentDetailsId'
          />
        </div>
      </template>

    </div>

  </div>
</template>

<script>
import {
  SfButton,
  SfSelect,
  SfInput,
  SfHeading,
  SfAlert,
  SfLoader,
  SfCheckbox
} from '@storefront-ui/vue';
import {computed, onMounted, ref} from '@nuxtjs/composition-api';
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate';
import {required} from 'vee-validate/dist/rules';
import {useCart} from '@vsf-enterprise/sapcc';
import {usePayment} from '@vsf-enterprise/sapcc';
import PaymentDetailsComponent from './PaymentDetails.vue';

const CARDS = [
  {
    code: 'amex',
    name: 'American Express'
  },
  {
    code: 'maestro',
    name: 'Maestro'
  },
  {
    code: 'switch',
    name: 'Switch'
  },
  {
    code: 'visa',
    name: 'Visa'
  },
  {
    code: 'master',
    name: 'Mastercard'
  },
  {
    code: 'mastercard_eurocard',
    name: 'Mastercard/Eurocard'
  },
  {
    code: 'diners',
    name: 'Diner\'s Club'
  }
];

extend('required', {
  ...required,
  message: 'This field is required'
});

export default {
  name: 'VsfPaymentProvider',

  components: {
    PaymentDetails: PaymentDetailsComponent,
    SfButton,
    ValidationProvider,
    ValidationObserver,
    SfSelect,
    SfInput,
    SfHeading,
    SfAlert,
    SfLoader,
    SfCheckbox
  },

  setup(props, { refs }) {
    const {cart} = useCart('main');
    const {
      sopPaymentResponse,
      loadPaymentDetailsList,
      updatePaymentDetails,
      removePaymentDetails,
      loadingPaymentDetailsList,
      loadingUpdatePaymentDetails,
      loadingRemovePaymentDetails,
      paymentDetailsList,
      error,
      selectedPaymentDetailsId,
      selectPaymentDetails: select
    } = usePayment('payment-provider');

    const cartPaymentInfo = computed(() => cart.value?.paymentInfo);
    const selectedMethod = ref(null);
    const isFormVisible = ref(false);
    const form = ref({
      selectedCard: CARDS[0].code,
      cardHolderName: '',
      cardNumber: '',
      cardExpirationMonth: null,
      cardExpirationYear: null,
      cardSecurityCode: '',
      detailsId: null,
      defaultPayment: false
    });

    const useDetails = (details) => {
      form.value.selectedCard = details.cardType.code;
      form.value.cardExpirationMonth = details.expiryMonth;
      form.value.cardExpirationYear = details.expiryYear;
      form.value.cardHolderName = details.accountHolderName;
      form.value.cardNumber = details.cardNumber;
      form.value.cardSecurityCode = '';
      form.value.detailsId = details.id;
    };

    const hasPaymentDetails = computed(() => Boolean(paymentDetailsList.value?.length));

    onMounted(async () => {
      await loadPaymentDetailsList({saved: true});
      if (!hasPaymentDetails.value && !cartPaymentInfo.value) isFormVisible.value = true;
    });

    const currentYear = new Date().getFullYear();

    const years = new Array(20)
      .fill(0)
      .reduce((result) => [...result, result[result.length - 1] + 1], [
        currentYear
      ]);

    const handleFormSubmit = async () => {
      if (!form.value.detailsId) return;

      await updatePaymentDetails({
        paymentDetailsList: paymentDetailsList.value,
        paymentDetails: {
          id: form.value.detailsId,
          cardType: {code: form.value.selectedCard},
          cardNumber: form.value.cardNumber,
          accountHolderName: form.value.cardHolderName,
          expiryYear: form.value.cardExpirationYear,
          expiryMonth: form.value.cardExpirationMonth
        }
      });

      if (!error.value.updatePaymentDetails) {
        isFormVisible.value = false;
      }
    };

    const remove = async (details) => {
      await removePaymentDetails({paymentDetailsId: details.id, paymentDetailsList: paymentDetailsList.value});
      if (!hasPaymentDetails.value) form.value = true;
    };

    const edit = (details) => {
      useDetails(details);
      form.value.detailsId = details.id;
      isFormVisible.value = true;
    };

    const setDefault = async (details) => {
      await updatePaymentDetails({
        paymentDetailsList: paymentDetailsList.value,
        paymentDetails: {
          ...details,
          defaultPayment: true
        }
      });
    };

    const openForm = () =>
      isFormVisible.value = true;

    const closeForm = () => {
      isFormVisible.value = false;
      form.value = {
        selectedCard: CARDS[0].code,
        cardHolderName: '',
        cardNumber: '',
        cardExpirationMonth: null,
        cardExpirationYear: null,
        cardSecurityCode: '',
        detailsId: null,
        defaultPayment: false
      };
    };

    const getPaymentDetails = async () => {
      if (isFormVisible.value) {
        if (form.value.detailsId) return;

        const valid = await refs.validator?.validate();
        if (valid) return form.value;
      } else if (selectedPaymentDetailsId.value) return selectedPaymentDetailsId.value;
    };

    return {
      form,
      cards: CARDS,
      selectedMethod,
      years,
      handleFormSubmit,
      loading: computed(
        () =>
          loadingUpdatePaymentDetails.value ||
          loadingRemovePaymentDetails.value ||
          loadingPaymentDetailsList.value
      ),
      sopPaymentResponse,
      paymentDetailsList,
      select,
      remove,
      edit,
      setDefault,
      loadingPaymentDetailsList,
      loadingUpdatePaymentDetails,
      loadingRemovePaymentDetails,
      error,
      selectedPaymentDetailsId,
      openForm,
      closeForm,
      isFormVisible,
      removeError: computed(() => error.value.removePaymentDetails?.response?.data.message),
      updateError: computed(() => error.value.updatePaymentDetails?.response?.data.message),
      sopRequestError: computed(() => error.value.loadSopPaymentRequest?.response?.data.message),
      cartPaymentInfo,
      getPaymentDetails,
      hasPaymentDetails
    };
  }
};
</script>

<style lang="scss" scoped>
.payment-provider {
  &__title {
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  }
}
.cart-payment-details {
  margin: var(--spacer-lg) 0;
}

.payment-details-list {
  display: flex;
  flex-wrap: wrap;

  .payment-details-wrapper {
    width: 50%;
    padding: var(--spacer-xs);
    box-sizing: border-box;
  }
}

.payment-details {
  &__container {
    margin-bottom: var(--spacer-sm);
    margin-top: var(--spacer-sm);
    position: relative;
  }

  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: auto;
    height: auto;
    --loader-overlay-background: rgba(255, 255, 255, 0.6);
  }

  &__actions {
    display: flex;
    align-items: center;

    .sf-button {
      margin-right: var(--spacer-sm);
    }
  }
}

.payment-card-details {
  &__container {
    display: flex;
    flex-wrap: wrap;
    @include for-desktop {
      margin: 0 calc(-1 * var(--spacer-xs));
    }
  }

  &__item {
    max-width: 100%;
    flex-basis: 100%;
    @include for-desktop {
      max-width: calc(33.333% - (2 * var(--spacer-xs)));
      flex-basis: calc(33.333% - (2 * var(--spacer-xs)));
      padding: 0 var(--spacer-xs);
    }
  }
}
</style>
