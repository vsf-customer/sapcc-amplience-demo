<template>
  <ValidationObserver v-slot="observer">
    <form
      v-if="isFormVisible"
      @submit.prevent="observer.handleSubmit(submitForm)"
    >
      <div class="form">
        <ValidationProvider
          v-for="input of formInputs"
          :key="input.field"
          :name="input.field"
          :rules="input.validationRules"
          v-slot="{ errors }"
          slim
        >
          <component
            :is="input.component"
            class="form__element"
            :class="input.classes"
            :value="form[input.field]"
            :label="$t(input.label)"
            :name="input.field"
            :errorMessage="$t(errors[0])"
            :valid="!errors[0]"
            @input="newValue => updateForm(form, input.field, newValue)"
            required
          >
            <template v-if="input.select">
              <SfSelectOption
                v-for="option in input.select.options"
                :key="option[input.select.valueKey]"
                :value="option[input.select.valueKey]"
              >
                {{ option[input.select.labelKey] }}
              </SfSelectOption>
            </template>
          </component>
        </ValidationProvider>
      </div>
      <div class="form__buttons">
        <slot name="buttons" v-bind="{ form, observer }" />
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { defineComponent, watch, ref, computed } from '@nuxtjs/composition-api';
import { SfInput, SfSelect } from '@storefront-ui/vue';
import { useCountries, useMiscs } from '@vsf-enterprise/sapcc';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, min, digits } from 'vee-validate/dist/rules';
import { onSSR } from '@vue-storefront/core';

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

export default defineComponent({
  name: 'AddressForm',
  components: { SfInput, SfSelect, ValidationObserver, ValidationProvider },
  props: {
    addressType: {
      type: String,
      default: 'shipping'
    },
    initialAddress: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { countries, load: loadCountries } = useCountries(props.addressType);
    const { titles, loadTitles } = useMiscs(props.addressType);

    const isFormVisible = computed(() => countries.value.length && titles.value.length);
    const formInputs = computed(() => ([
      createFormInput('Title', 'titleCode', 'required|min:2', {
        component: 'SfSelect',
        options: titles.value,
        valueKey: 'code',
        labelKey: 'name'
      }),
      createFormInput('First name', 'firstName', 'required|min:2', { half: true }),
      createFormInput('Last name', 'lastName', 'required|min:2', { half: true, even: true }),
      createFormInput('Street name', 'line1', 'required|min:2', { half: true }),
      createFormInput('Apartment number', 'line2', 'required', { half: true, even: true }),
      createFormInput('City', 'town', 'required', { half: true }),
      createFormInput('Postal code', 'postalCode', 'required|min:2', { half: true, even: true }),
      createFormInput('Country', 'country', 'required|min:2', {
        component: 'SfSelect',
        options: countries.value,
        valueKey: 'isocode',
        labelKey: 'name',
        half: true
      }),
      createFormInput('Phone number', 'phone', 'digits:9', { half: true, even: true })
    ]));

    const form = ref(createForm(formInputs.value));

    function createFormInput (label, field, validationRules, config) {
      const {
        component = 'SfInput',
        half = false,
        even = false,
        classes = '',
        options,
        valueKey,
        labelKey
      } = config;

      let finalClasses = classes;

      if (half) finalClasses += ' form__element--half';
      if (even) finalClasses += ' form__element--half-even';
      if (component === 'SfSelect') finalClasses += ' form__select sf-select--underlined';

      return {
        component,
        label,
        field,
        validationRules,
        classes: finalClasses,
        select: options ? {
          options,
          valueKey,
          labelKey
        } : null
      };
    }

    function createForm (inputs) {
      return inputs.reduce((form, input) => {
        form[input.field] = '';
        return form;
      }, {});
    }

    function populateForm (initialAddress) {
      if (!initialAddress) return;
      for (const key in form.value) {
        if (key === 'country') {
          form.value[key] = initialAddress[key].isocode;
        } else {
          form.value[key] = initialAddress[key];
        }
      }
    }

    function updateForm (formObject, propertyName, value) {
      formObject[propertyName] = value;
      emit('changed');
    }

    function submitForm () {
      emit('submit', {
        ...form.value,
        country: { isocode: form.value.country }
      });
    }

    watch(() => props.initialAddress, populateForm, { immediate: true });

    onSSR(async () => {
      await Promise.all([
        loadTitles({}),
        loadCountries({ type: 'shipping' })
      ]);
    });

    return {
      form,
      formInputs,
      submitForm,
      updateForm,
      isFormVisible
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
    &--add-address {
      width: 100%;
      margin: 0;
      @include for-desktop {
        margin: 0 0 var(--spacer-lg) 0;
        width: auto;
      }
    }
  }
  &__buttons {
    & ::v-deep > * {
      margin-bottom: var(--spacer-sm);
    }

    @include for-desktop {
      display: flex;
      & ::v-deep > * {
        margin: 0 var(--spacer-base) 0 0;
      }
    }
  }
}
</style>
