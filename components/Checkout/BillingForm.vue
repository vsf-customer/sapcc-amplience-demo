<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <template v-if="shippingAddress.firstName">
      <SfHeading
        data-testid="shipping-heading"
        :level="3"
        :title="$t('Shipping')"
        class="sf-heading--left sf-heading--no-underline title"
      />
      <SfAddressPicker
        :selected="BILLING_FORM_ADDRESS_NAME.SHIPPING"
        v-e2e="'shipping-details-preview'"
      >
        <BillingAddress
          :key="BILLING_FORM_ADDRESS_NAME.SHIPPING"
          class="form__element"
          :name="BILLING_FORM_ADDRESS_NAME.SHIPPING"
          :address="shippingAddress"
        />
      </SfAddressPicker>
    </template>

    <SfHeading
      v-e2e="'billing-heading'"
      :level="3"
      :title="$t('Billing')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <SfAddressPicker
        v-if="!isFormShowed && billingAddress.firstName"
        :selected="BILLING_FORM_ADDRESS_NAME.BILLING"
        @change="selectAddress($event)"
      >
        <BillingAddress
          v-if="billingAddress.firstName"
          :key="BILLING_FORM_ADDRESS_NAME.BILLING"
          class="form__element"
          :name="BILLING_FORM_ADDRESS_NAME.BILLING"
          :address="billingAddress"
          @click.prevent="openEditForm(BILLING_FORM_ADDRESS_NAME.BILLING, billingAddress)"
        />
      </SfAddressPicker>
      <div class="form" v-if="isFormShowed">
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'billing-title'"
            v-model="form.titleCode"
            :label="$t('Title')"
            name="title"
            class="form__element form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          >
            <SfSelectOption
              v-for="titleOption in localizedTitles"
              :key="titleOption.code"
              :value="titleOption.code"
            >
              {{ titleOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="firstName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-firstName'"
            v-model="form.firstName"
            :label="$t('First name')"
            name="firstName"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="lastName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-lastName'"
            v-model="form.lastName"
            :label="$t('Last name')"
            name="lastName"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="streetName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-streetName'"
            v-model="form.streetName"
            :label="$t('Street name')"
            name="streetName"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="apartment"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-apartment'"
            v-model="form.apartment"
            :label="$t('Apartment number')"
            name="apartment"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="city"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-city'"
            v-model="form.city"
            :label="$t('City')"
            name="city"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider name="state" slim>
          <SfInput
            v-e2e="'shipping-state'"
            v-model="form.state"
            :label="$t('State/Province')"
            name="state"
            class="form__element form__element--half form__element--half-even"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'billing-country'"
            v-model="form.country"
            :label="$t('Country')"
            name="country"
            class="
              form__element form__element--half form__select
              sf-select--underlined
            "
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          >
            <SfSelectOption
              v-for="countryOption in countries"
              :key="countryOption.isocode"
              :value="countryOption.isocode"
            >
              {{ countryOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="zipCode"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-zipcode'"
            v-model="form.postalCode"
            :label="$t('Postal code')"
            name="zipCode"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="phone"
          rules="digits:9"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'billing-phone'"
            v-model="form.phone"
            :label="$t('Phone number')"
            name="phone"
            class="form__element form__element--half"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-if="!isBillingFormSubmitted"
            class="form__action-button"
            :class="{
              'color-success': !isFormShowed,
              'color-danger': isFormShowed,
            }"
            @click="toggleEmptyForm()"
            type="button"
          >
            {{ isFormShowed ? $t('Cancel') : $t('Add Billing Address') }}
          </SfButton>
          <SfButton
            v-if="isFormShowed"
            v-e2e="'select-shipping'"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Set billing address') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio,
  SfCheckbox,
  SfProperty,
  SfAddressPicker
} from '@storefront-ui/vue';
import { ref} from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import { required, min, digits } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { useCart, useCountries, useMiscs } from '@vsf-enterprise/sapcc';
import { useBillingForm } from '../../composables/useBillingForm';
import { BILLING_FORM_ADDRESS_NAME } from '../../helpers/constants';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

export default {
  name: 'BillingForm',
  components: {
    BillingAddress: () => import('~/components/Checkout/BillingAddress'),
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    SfProperty,
    ValidationProvider,
    ValidationObserver,
    SfAddressPicker
  },
  setup() {
    const { cart } = useCart('main');
    const { countries, load: loadCountries } = useCountries('billing');
    const { titles: localizedTitles, loadTitles } = useMiscs();
    const {
      selectedAddressName,
      billingAddress,
      shippingAddress,
      addBillingAddress,
      addShippingAddress,
      selectAddress
    } = useBillingForm();
    const form = ref({
      firstName: '',
      lastName: '',
      streetName: '',
      apartment: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      phone: '',
      titleCode: ''
    });

    const cartShippingAddress = cart.value?.deliveryAddress ?? {};

    if (!shippingAddress.value?.firstName) {
      addShippingAddress({
        name: BILLING_FORM_ADDRESS_NAME.SHIPPING,
        data: cartShippingAddress
      });
      selectAddress(BILLING_FORM_ADDRESS_NAME.SHIPPING);
    }

    const isFormShowed = ref(false);

    const isBillingFormSubmitted = ref(
      Boolean(billingAddress.value?.firstName)
    );

    onSSR(async () => {
      await Promise.all([loadTitles(), loadCountries({ type: 'BILLING' })]);
    });

    const handleFormSubmit = async () => {
      addBillingAddress({
        name: BILLING_FORM_ADDRESS_NAME.BILLING,
        data: form.value,
        countries: countries.value
      });
      selectAddress(BILLING_FORM_ADDRESS_NAME.BILLING);
      isBillingFormSubmitted.value = true;
      isFormShowed.value = !isFormShowed.value;
    };

    const toggleEmptyForm = () => {
      form.value = {};
      isFormShowed.value = !isFormShowed.value;
    };

    const openEditForm = (name, value) => {
      if (selectedAddressName.value === name) {
        form.value = {
          firstName: value.firstName,
          lastName: value.lastName,
          streetName: value.line1,
          apartment: value.line2,
          city: value.town,
          state: value.district,
          country: value?.country?.isocode,
          postalCode: value.postalCode,
          phone: value.phone,
          titleCode: value.titleCode
        };
        isFormShowed.value = true;
      }
    };

    return {
      form,
      countries,
      shippingAddress,
      localizedTitles,
      handleFormSubmit,
      isFormShowed,
      isBillingFormSubmitted,
      selectedAddressName,
      selectAddress,
      openEditForm,
      toggleEmptyForm,
      billingAddress,
      BILLING_FORM_ADDRESS_NAME
    };
  }
};
</script>
<style lang="scss" scoped>
.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
.form {
  &__select {
    display: flex;
    align-items: center;
    --select-option-font-size: var(--font-size--lg);
    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size--lg);
      margin: 0;
      color: var(--c-text);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--normal);
    }
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button,
  &__back-button {
    --button-width: 100%;
    @include for-desktop {
      --button-width: auto;
    }
  }
  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        --button-margin: 0;
        text-align: left;
      }
    }
    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__back-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);
    &:hover {
      color: white;
    }
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
  &__back-button {
    margin: 0 0 var(--spacer-sm) 0;
    @include for-desktop {
      margin: 0 var(--spacer-xl) 0 0;
    }
  }
}
</style>
