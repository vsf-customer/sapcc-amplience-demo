<template>
  <ValidationObserver
    v-slot="{ handleSubmit }"
    key="sign-up"
  >
    <form
      class="form"
      data-testid="my-profile-form"
      @submit.prevent="handleSubmit(handleFormSubmit)"
      autocomplete="off"
      v-if="localizedTitles.length && user"
    >
      <ValidationProvider name="title" rules="required" v-slot="{ errors }">
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
          data-testid="my-profile-email"
          v-model="form.uid"
          :valid="!errors[0]"
          :errorMessage="$t(errors[0])"
          required
          name="email"
          :label="$t('Your email')"
          class="form__element"
          :disabled="true"
        />
      </ValidationProvider>
      <ValidationProvider rules="required" v-slot="{ errors }">
        <SfInput
          data-testid="register-firstName"
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
          data-testid="register-lastName"
          v-model="form.lastName"
          :valid="!errors[0]"
          :errorMessage="$t(errors[0])"
          required
          name="last-name"
          :label="$t('Last Name')"
          class="form__element"
        />
      </ValidationProvider>
      <SfButton
        type="submit"
        class="sf-button--full-width form__button"
        data-testid="update-my-profile-button"
        :disabled="loading"
      >
        <SfLoader :class="{ loader: loading }" :loading="loading">
          <div>{{ $t('Update my profile') }}</div>
        </SfLoader>
      </SfButton>
    </form>
    <SfLoader
      v-else
      :loading="!localizedTitles.length"
    ></SfLoader>
  </ValidationObserver>
</template>

<script>
import { SfSelect, SfInput, SfButton, SfLoader } from '@storefront-ui/vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { useUser, useMiscs } from '@vsf-enterprise/sapcc';
import { validateEmail } from '~/helpers/validation-utils';
import { ref } from '@vue/composition-api';
import { onSSR } from '@vue-storefront/core';
import {onMounted} from '@nuxtjs/composition-api';

extend('email', {
  validate: validateEmail,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

export default {
  name: 'ProfileUpdateForm',
  components: {
    SfSelect,
    SfInput,
    SfButton,
    SfLoader,
    ValidationProvider,
    ValidationObserver
  },
  setup: () => {
    const { titles: localizedTitles, loadTitles } = useMiscs();
    const { load: loadUser, user, loading, update: updateUser } = useUser();
    const form = ref({});

    onSSR(async () => {
      await loadTitles();
    });

    onMounted(async() => {
      await loadUser({});
      form.value = user.value;
    });

    const handleFormSubmit = async () => {
      await updateUser({
        user: form.value
      });
    };
    return {
      form,
      user,
      loading,
      localizedTitles,
      handleFormSubmit
    };
  }
};
</script>
