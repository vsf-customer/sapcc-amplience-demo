<template>
  <SfModal :visible="isLoginModalOpen" class="modal" @close="toggleLoginModal">
    <template #modal-bar>
      <SfBar
        class="sf-modal__bar smartphone-only"
        :close="true"
        :title="isLogin ? $t('Sign in') : $t('Sign up')"
        @click:close="toggleLoginModal"
      />
    </template>
    <transition name="sf-fade" mode="out-in">
      <div v-if="isLogin">
        <ValidationObserver v-slot="{ handleSubmit }" key="log-in">
          <form class="form" data-testid="login-form" @submit.prevent="handleSubmit(handleLogin)">
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                v-model="form.username"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                name="email"
                :label="$t('Your email')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                name="password"
                :label="$t('Password')"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <SfCheckbox
              v-e2e="'login-remember-me'"
              v-model="rememberMe"
              name="remember-me"
              :label="$t('Remember me')"
              class="form__element checkbox"
            />
            <div v-if="error.login">
              {{ $t(error.login) }}
            </div>
            <SfButton
              type="submit"
              class="sf-button--full-width form__button"
              data-testid="login-button"
              :disabled="isLoading"
            >
              <SfLoader :class="{ loader: isLoading }" :loading="isLoading">
                <div>{{ $t('Login') }}</div>
              </SfLoader>
            </SfButton>
          </form>
        </ValidationObserver>
        <div class="action">
          <SfButton class="sf-button--text">
            {{ $t('Forgotten password?') }}
          </SfButton>
        </div>
        <div class="bottom">
          <p class="bottom__paragraph">{{ $t('No account') }}</p>
          <SfButton
            data-testid="register-today-button"
            class="sf-button--text"
            @click="setIsLoginValue(false)"
          >
            {{ $t('Register today') }}
          </SfButton>
        </div>
      </div>
      <div v-else class="form">
        <ValidationObserver v-slot="{ handleSubmit }" key="sign-up">
          <form
            class="form"
            data-testid="register-form"
            @submit.prevent="handleSubmit(handleRegister)"
            autocomplete="off"
            v-if="localizedTitles.length"
          >
            <ValidationProvider
              name="title"
              rules="required"
              v-slot="{ errors }"
            >
              <SfSelect
                data-testid="register-title"
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
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <SfInput
                data-testid="register-email-input"
                v-model="form.uid"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                required
                name="email"
                :label="$t('Your email')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                data-testid="register-firstName-input"
                v-model="form.firstName"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                required
                name="first-name"
                :label="$t('First Name')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <SfInput
                data-testid="register-lastName-input"
                v-model="form.lastName"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                required
                name="last-name"
                :label="$t('Last Name')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              name="password"
              rules="required|password"
              v-slot="{ errors }"
            >
              <SfInput
                data-testid="register-password-input"
                v-model="form.password"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                required
                name="password"
                :label="$t('Password')"
                type="password"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              name="confirm-password"
              rules="required|confirm:@password"
              v-slot="{ errors }"
            >
              <SfInput
                data-testid="register-confirm-password-input"
                v-model="confirmPassword"
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
                data-testid="create-account-checkbox"
                v-model="createAccount"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                name="create-account"
                :label="$t('I want to create an account')"
                class="form__element"
              />
            </ValidationProvider>
            <ValidationProvider
              :rules="{ required: { allowFalse: false } }"
              v-slot="{ errors }"
            >
              <SfCheckbox
                data-testid="consent-checkbox"
                v-model="consentAggreed"
                :valid="!errors[0]"
                :errorMessage="$t(errors[0])"
                name="create-account-consent"
                :label="
                  $t(
                    'I am confirming that I have read and agreed with the Terms &amp; Conditions'
                  )
                "
                class="form__element create-account-constent"
              />
            </ValidationProvider>
            <div v-if="error.register">
              {{ error.register }}
            </div>
            <SfButton
              type="submit"
              class="sf-button--full-width form__button"
              :disabled="isLoading"
            >
              <SfLoader :class="{ loader: isLoading }" :loading="isLoading">
                <div>{{ $t('Create an account') }}</div>
              </SfLoader>
            </SfButton>
          </form>
          <SfLoader
            v-else
            :loading="!localizedTitles.length"
          />
        </ValidationObserver>
        <div class="action">
          {{ $t('or') }}
          <SfButton
            v-e2e="'login-modal-login-to-your-account'"
            class="sf-button--text"
            @click="setIsLoginValue(true)"
          >
            {{ $t('login in to your account') }}
          </SfButton>
        </div>
      </div>
    </transition>
  </SfModal>
</template>
<script>
import {
  ref,
  watch,
  reactive
} from '@nuxtjs/composition-api';
import {
  SfModal,
  SfSelect,
  SfInput,
  SfButton,
  SfCheckbox,
  SfLoader,
  SfAlert,
  SfBar
} from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { useUser, useMiscs, useConsents, useUserCarts } from '@vsf-enterprise/sapcc';
import { useUiState } from '~/composables';
import { validateEmail, validatePassword } from '~/helpers/validation-utils';
import { useCartHelpers } from '~/composables';

extend('password', {
  validate: validatePassword,
  message:
    'Password should contain at least one number, one uppercase character, one special character'
});

extend('email', {
  validate: validateEmail,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('confirm', {
  params: ['target'],
  validate: (value, { target }) => value === target,
  message: 'Password do not match'
});

export default {
  name: 'LoginModal',
  components: {
    SfModal,
    SfSelect,
    SfInput,
    SfButton,
    SfCheckbox,
    SfLoader,
    SfAlert,
    ValidationProvider,
    ValidationObserver,
    SfBar
  },
  setup(props, context) {
    const { $route } = context.root;
    const { isLoginModalOpen, toggleLoginModal } = useUiState();
    const { titles: localizedTitles, loadTitles } = useMiscs();
    const { register, login, error: userError } = useUser();
    const { load: loadUserCarts } = useUserCarts();
    const { mergeAnonymousConsents } = useConsents();
    const { mergeCarts, mergeWishlists } = useCartHelpers();

    const isLoading = ref(false);
    const form = ref({});
    const confirmPassword = ref('');
    const isLogin = ref(true);
    const createAccount = ref(false);
    const consentAggreed = ref(false);
    const rememberMe = ref(false);
    const areTitlesLoaded = ref(false);

    const error = reactive({
      login: null,
      register: null
    });

    const resetErrorValues = () => {
      error.login = null;
      error.register = null;
    };

    watch(isLoginModalOpen, async (value) => {
      if (value) {
        form.value = {};
        resetErrorValues();
        if (!areTitlesLoaded.value) {
          await loadTitles();
          areTitlesLoaded.value = true;
        }
      }
    });

    const setIsLoginValue = (value) => {
      resetErrorValues();
      isLogin.value = value;
    };

    const isFormHasError = (formType) => {
      const err = userError.value[formType];
      if (err) {
        error[formType] = err.response?.data.message ?? err.message;
        return true;
      }
      return false;
    };

    const handleLoginForm = () => async () => {
      isLoading.value = true;
      resetErrorValues();
      await login({ ...form.value, isRememberMe: rememberMe.value });

      if (isFormHasError('login')) {
        isLoading.value = false;
        return;
      }

      await loadUserCarts({ fields: 'FULL' });
      await Promise.all([mergeCarts(), mergeWishlists()]);
      isLoading.value = false;
      toggleLoginModal();

      await mergeAnonymousConsents();
    };

    const handleRegisterForm = () => async () => {
      isLoading.value = true;
      resetErrorValues();
      await register(form.value);

      if (isFormHasError('register')) {
        isLoading.value = false;
        return;
      }
      if (!userError.value.register) {
        const loginFormValue = {
          username: form.value.uid,
          password: form.value.password
        };
        setIsLoginValue(true);
        form.value = { ...loginFormValue };
        await handleLoginForm()();
      }
    };

    const handleRegister = async () => handleRegisterForm()();

    const handleLogin = async () => handleLoginForm()();

    if ($route.query?.register && !isLoginModalOpen.value) {
      toggleLoginModal();
      setIsLoginValue(false);
    }

    return {
      form,
      error,
      userError,
      isLoading,
      isLogin,
      createAccount,
      rememberMe,
      isLoginModalOpen,
      toggleLoginModal,
      handleLogin,
      handleRegister,
      setIsLoginValue,
      localizedTitles,
      confirmPassword,
      consentAggreed,
      areTitlesLoaded
    };
  }
};
</script>

<style lang="scss" scoped>
.modal {
  --modal-index: 3;
  --overlay-z-index: 3;
}
.form {
  margin-top: var(--spacer-sm);
  &__element {
    margin: 0 0 var(--spacer-xl) 0;
  }
}
.form__select::v-deep {
  font-size: var(--font-size--lg);
  .sf-select {
    &__dropdown {
      font-size: var(--font-size--lg);
      height: 2rem;
    }
    &__label {
      top: 35%;
      padding-left: 0;
    }
  }
  &.is-selected {
    font-size: var(--font-size--xs);
    > .sf-select__label {
      top: 0;
    }
  }
}
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
  font: var(--font-weight--light) var(--font-size--base) / 1.6
    var(--font-family--secondary);
  & > * {
    margin: 0 0 0 var(--spacer-xs);
  }
}
.action {
  margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
}
.checkbox {
  margin-bottom: var(--spacer-2xl);
}
.bottom {
  text-align: center;
  margin-bottom: var(--spacer-lg);
  font-size: var(--h3-font-size);
  font-weight: var(--font-weight--semibold);
  font-family: var(--font-family--secondary);
  &__paragraph {
    color: var(--c-primary);
    margin: 0 0 var(--spacer-base) 0;
    @include for-desktop {
      margin: 0;
    }
  }
}
</style>
