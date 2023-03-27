<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      data-testid="provide-email-heading"
      :level="3"
      :title="$t('Provide your email')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <ValidationProvider
          name="email"
          rules="email|required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="email-field"
            v-model="form.email"
            :label="$t('Email')"
            name="email"
            class="form__element"
            required
            :disabled="emailFilled"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="confirm-email"
          rules="email|required|confirm:@email"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            data-testid="confirm-email-field"
            v-model="form.confirmEmail"
            :label="$t('Confirm email')"
            name="confirmEmail"
            class="form__element"
            required
            :disabled="emailFilled"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            data-testid="continue-to-shipping-button"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Continue to Shipping') }}
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
  SfCheckbox
} from '@storefront-ui/vue';
import { computed, ref, useRouter, watch } from '@nuxtjs/composition-api';
import { required, email } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { ANONYMOUS_USER_ID, useCart, useCartAddresses, useUser } from '@vsf-enterprise/sapcc';
import { MIDDLEWARE } from '../../helpers/constants';
import { useVSFContext } from '@vue-storefront/core';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('email', {
  ...email,
  message: 'Email is not valid'
});

extend('confirm', {
  params: ['target'],
  validate: (value, { target }) => value === target,
  message: 'Email addresses do not match'
});

export default {
  name: 'Email',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  middleware: [MIDDLEWARE.IS_ANONYMOUS_CART],
  setup() {
    const router = useRouter();

    const { cart } = useCart('main');
    const { addEmail } = useCartAddresses('main');
    const { localePath } = useVSFContext();
    const { isAuthenticated } = useUser();

    const userEmail =
      cart.value?.user?.name === 'guest'
        ? cart.value?.user?.uid.split('|')[1]
        : cart.value?.user?.uid === ANONYMOUS_USER_ID
          ? ''
          : cart.value?.user?.uid;

    const form = ref({
      email: userEmail ?? '',
      confirmEmail: userEmail ?? ''
    });

    const emailFilled = computed(
      () => cart.value?.user?.uid !== ANONYMOUS_USER_ID
    );

    const handleFormSubmit = async () => {
      if (!emailFilled.value) {
        await addEmail({ email: form.value.email });
      }
      router.push(localePath({ name: 'shipping' }));
    };

    watch(isAuthenticated, async () => {
      if (isAuthenticated.value) router.push(localePath({ name: 'shipping' }));
    });

    return {
      emailFilled,
      form,
      handleFormSubmit
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
