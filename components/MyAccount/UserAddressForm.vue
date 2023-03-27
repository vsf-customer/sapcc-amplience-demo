<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      data-testid="shipping-header"
      :level="3"
      :title="isNew ? $t('Add the Address') : $t('Update the Address')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form
      v-if="canShowForm"
      @submit.prevent="handleSubmit(handleFormSubmit)"
    >
      <div class="form">
        <ValidationProvider
          name="titleCode"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            data-testid="shipping-title-select"
            :value="form.titleCode"
            @input="updateTitleVariables"
            :label="$t('Title')"
            name="titleCode"
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
            data-testid="shipping-firstName"
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
            data-testid="shipping-lastName"
            v-model="form.lastName"
            :label="$t('Last name')"
            name="lastName"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider name="line1" v-slot="{ errors }" slim>
          <SfInput
            data-testid="shipping-line1"
            v-model="form.line1"
            :label="$t('Address Line 1')"
            name="line1"
            required
            class="form__element "
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider name="line2" v-slot="{ errors }" slim>
          <SfInput
            data-testid="shipping-line2"
            v-model="form.line2"
            :label="$t('Address Line 2')"
            name="line2"
            class="form__element "
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider name="town" v-slot="{ errors }" slim>
          <SfInput
            data-testid="town"
            v-model="form.town"
            :label="$t('City')"
            name="town"
            class="form__element form__element--half "
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>

        <ValidationProvider name="district" v-slot="{ errors }" slim>
          <SfInput
            data-testid="shipping-district"
            ß
            v-model="form.district"
            :label="$t('District')"
            name="district"
            class="form__element form__element--half form__element--half-even"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'shipping-country'"
            v-model="form.country.isocode"
            :label="$t('Country')"
            name="country"
            class="form__element form__element--half form__select sf-select--underlined "
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
          name="postalCode"
          rule="required|min:2|max:10"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="postalCode"
            v-model="form.postalCode"
            :label="$t('Postal code')"
            name="postalCode"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="phone"
          rules="required|regex:^\+?(\d)+$"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="phone"
            v-model="form.phone"
            :label="$t('Phone')"
            name="phone"
            class="form__element "
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          v-if="!address || !address.defaultAddress"
          name="defaultAddress"
          v-slot="{ errors }"
          slim
        >
          <SfCheckbox
            v-e2e="'shipping-defaultAddress'"
            v-model="form.defaultAddress"
            :label="$t('Set as default')"
            name="defaultAddress"
            class="form__element form__element--half"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-e2e="'save-shipping'"
            class="form__action-button"
            type="submit"
            :disabled="saving"
          >
            <SfLoader v-if="saving" :loading="saving" />
            <span>
              {{ isNew ? $t('Add the Address') : $t('Update the Address') }}
            </span>
          </SfButton>
          <SfButton
            v-e2e="'save-shipping'"
            type="button"
            class="form__cancel-button"
            @click="cancel"
          >
            {{ $t('Cancel') }}
          </SfButton>
        </div>
      </div>
    </form>
    <SfLoader
      v-else
      :loading="!canShowForm"
    ></SfLoader>
    <div v-if="error">{{ error }}</div>
  </ValidationObserver>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, PropType, computed, onMounted } from '@nuxtjs/composition-api';
import { AddAddressProps, useCountries, useMiscs } from '@vsf-enterprise/sapcc';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import {
  SfHeading,
  SfInput,
  SfSelect,
  SfButton,
  SfCheckbox,
  SfLoader
} from '@storefront-ui/vue';
import { required, digits, min, max, regex } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('max', {
  ...max,
  message: 'The field should have at most {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

extend('regex', regex);

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
    SfHeading,
    SfInput,
    SfSelect,
    SfButton,
    SfCheckbox,
    SfLoader
  },
  props: {
    address: {
      type: Object as PropType<AddAddressProps['address']>
    },
    isNew: Boolean
  },
  setup(props, { emit }) {
    const { countries, load: loadCountries } = useCountries('shipping');
    const { titles: localizedTitles, loadTitles } = useMiscs();
    const saving = ref(false);
    const error = ref(null);

    onMounted(async () => {
      await Promise.all([loadTitles(), loadCountries({ type: 'SHIPPING' })]);
    });

    const form = reactive(props.address
      ? { ...props.address }
      : {
        firstName: '',
        lastName: '',
        title: '',
        titleCode: '',
        country: { isocode: '' },
        postalCode: '',
        phone: '',
        line1: '',
        line2: '',
        district: '',
        town: '',
        defaultAddress: false
      }
    );
    const canShowForm = computed(() => countries.value?.length && localizedTitles.value?.length);

    const onError = (err: any) => {
      saving.value = false;
      error.value = err;
    };

    const onComplete = () => {
      saving.value = false;
      error.value = null;
    };

    const handleFormSubmit = () => {
      saving.value = true;
      error.value = null;
      emit('submit', {
        form,
        onError,
        onComplete
      });
    };

    const cancel = () => emit('cancel');

    const updateTitleVariables = (titleCode: string) => {
      form.titleCode = titleCode;
      form.title = localizedTitles.value.find(title => title.code === titleCode).name;
    };

    return {
      form,
      handleFormSubmit,
      countries,
      localizedTitles,
      saving,
      error,
      cancel,
      canShowForm,
      updateTitleVariables
    };
  }
});
</script>
<style lang="scss" scoped>
.form {
  margin-bottom: var(--spacer-sm);
  --button-width: 100%;
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
    --button-width: auto;
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
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    &--secondary {
      @include for-desktop {
        order: -1;
        text-align: left;
      }
    }
  }
  &__cancel-button {
    margin: var(--spacer-xl) 0 var(--spacer-sm);
    background: var(--c-secondary);
    &:hover {
      color: var(--c-white);
    }
    @include for-desktop {
      margin: 0 0 0 var(--spacer-xl);
    }
  }
}

.shipping {
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    --radio-description-margin: 0;
    --radio-description-font-size: var(--font-xs);
  }
}

.title {
  margin: var(--spacer-xl) 0 var(--spacer-base) 0;
}
</style>
