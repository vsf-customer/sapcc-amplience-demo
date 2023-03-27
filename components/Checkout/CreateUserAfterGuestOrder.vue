<template>
  <ValidationObserver
    tag="div"
    v-slot="{ handleSubmit }"
    key="sign-up"
    v-if="!isCreateAccountSuccesfull"
  >
    <div class="highlighted">
      <SfHeading
        :level="3"
        :title="$t('Create an account')"
        :description="$t('Create an account description')"
        class="sf-heading--left sf-heading--no-underline title"
      />
    </div>
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <ValidationProvider
          name="password"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'password-field'"
            v-model="form.password"
            :label="$t('Password')"
            name="password"
            class="form__element"
            type="password"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="confirm-password"
          rules="required|confirm:@password"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'confirm-password-field'"
            v-model="form.confirmPassword"
            :label="$t('Confirm password')"
            name="confirmPassword"
            class="form__element"
            type="password"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          :rules="{ required: { allowFalse: false } }"
          v-slot="{ errors }"
        >
          <SfCheckbox
            v-e2e="'create-account'"
            v-model="createAccount"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
            name="create-account"
            label="I want to create an account"
            class="form__element"
          />
        </ValidationProvider>
      </div>
      <div v-if="error && error.register">
        {{ error.register }}
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-e2e="'create-an-account'"
            class="form__action-button"
            type="submit"
          >
            {{ $t('Create an Account') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
  <div class="login" v-else-if="isCreateAccountSuccesfull">
    <SfHeading
      :level="4"
      :title="$t('Your account succesfully created!')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <SfButton
      v-e2e="'create-an-account'"
      class="
        form__action-button
        sf-button--full-width
        button-size
        color-secondary
      "
      @click="toggleLoginModal"
    >
      {{ $t('Login') }}
    </SfButton>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import { SfInput, SfButton, SfCheckbox, SfHeading } from '@storefront-ui/vue';
import { ref, reactive } from '@nuxtjs/composition-api';
import { required } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { useOrder, useUser } from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';

export default defineComponent({
  name: 'CreateUserAfterGuestOrder',
  components: {
    SfInput,
    SfButton,
    SfCheckbox,
    SfHeading,
    ValidationProvider,
    ValidationObserver
  },
  setup(props, context) {
    extend('required', {
      ...required,
      message: context.root.$t('This field is required')
    });

    extend('confirm', {
      params: ['target'],
      validate: (value, { target }) => value === target,
      message: context.root.$t('Password do not match')
    });

    const { order } = useOrder();
    const { register, error: userError } = useUser();
    const { toggleLoginModal } = useUiState();
    const isCreateAccountSuccesfull = ref(false);
    const form = ref({
      password: '',
      confirmPassword: ''
    });

    const error = reactive({ register: null });

    const createAccount = ref(false);

    const handleFormSubmit = async () => {
      error.value = {};
      if (order.value) {
        await register({
          user: {
            uid: order.value.user.uid.replace(/^(.*?)\|/g, ''),
            firstName: 'Anonymous',
            lastName: 'User',
            password: form.value.password,
            title: order.value.deliveryAddress.title
          }
        });

        if (!userError.value.register) {
          isCreateAccountSuccesfull.value = true;
        } else {
          error.register = userError.value.register?.response?.data?.message;
        }
      }
    };

    return {
      form,
      createAccount,
      error,
      handleFormSubmit,
      toggleLoginModal,
      isCreateAccountSuccesfull
    };
  }
});
</script>

<style lang="scss" scoped>
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
    margin: 0 0 var(--spacer-md) 0;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding: 0 0 0 var(--spacer-sm);
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
  &__action-button {
    margin-top: var(--spacer-sm);
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
  }
}

.title {
  margin: 0 0 var(--spacer-xs) 0;
}

.button-size {
  @include for-desktop {
    --button-width: 25rem;
  }
}
</style>
