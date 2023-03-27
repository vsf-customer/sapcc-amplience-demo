<template>
  <ValidationObserver v-slot="{ handleSubmit }" ref="passwordChange">
    <SfHeading
      v-e2e="'change-password-heading'"
      :level="3"
      :title="$t('Change Password')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <ValidationProvider
          name="oldPassword"
          rules="required|password"
          v-slot="{ errors }"
        >
          <SfInput
            v-e2e="'change-password'"
            v-model="form.oldPassword"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
            required
            name="oldPassword"
            :label="$t('Current Password')"
            type="password"
            class="form__element"
          />
        </ValidationProvider>
        <ValidationProvider
          name="newPassword"
          rules="required|password"
          v-slot="{ errors }"
        >
          <SfInput
            v-e2e="'newPassword'"
            v-model="form.newPassword"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
            required
            name="newPassword"
            :label="$t('New Password')"
            type="password"
            class="form__element"
          />
        </ValidationProvider>
        <ValidationProvider
          name="confirm-password"
          rules="required|confirm:@newPassword"
          v-slot="{ errors }"
        >
          <SfInput
            v-e2e="'confirm-password-field'"
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
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-e2e="'change-password'"
            class="form__action-button"
            type="submit"
            :disabled="changing"
          >
            <SfLoader v-if="changing" :loading="changing" />
            <span>
              {{ $t('Change Password') }}
            </span>
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>
<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useUser } from '@vsf-enterprise/sapcc';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import {
  SfHeading,
  SfInput,
  SfButton,
  SfLoader
} from '@storefront-ui/vue';
import { required, regex } from 'vee-validate/dist/rules';
import { validatePassword } from '../../helpers/validation-utils';

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('password', {
  validate: validatePassword,
  message:
    'Password should contain at least one number, one uppercase character, one special character'
});

extend('confirm', {
  params: ['target'],
  validate: (value, { target } : any) => value === target,
  message: 'Password do not match'
});

extend('regex', regex);

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
    SfHeading,
    SfInput,
    SfButton,
    SfLoader
  },
  setup(_, {refs}) {
    const { changePassword, error } = useUser();
    const changing = ref(false);
    const confirmPassword = ref('');
    const complete = ref(false);

    const form = ref({
      newPassword: '',
      oldPassword: ''
    });

    const clearFromFields = () => {
      form.value = {
        newPassword: '',
        oldPassword: ''
      };
      confirmPassword.value = '';
      (refs.passwordChange as any).reset();
    };

    const handleFormSubmit = async () => {
      changing.value = true;
      await changePassword({
        old: form.value.oldPassword,
        new: form.value.newPassword
      });
      changing.value = false;
      complete.value = true;
      if (!error.value.changePassword) {
        clearFromFields();
      }
    };

    return {
      form,
      handleFormSubmit,
      confirmPassword,
      changing,
      error,
      complete
    };
  }
});
</script>
<style lang="scss" scoped>
.sf-notification {
  margin-bottom: 2rem;
}

.form {
  margin-bottom: var(--spacer-sm);
  --button-width: 100%;
  @include for-desktop {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
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
