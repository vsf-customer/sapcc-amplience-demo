<template>
  <SfTabs :open-tab="1">
    <!-- Personal data update -->
    <SfTab :title="$t('Personal data')">
      <MyAccountHeading>
        {{ $t('Feel free to edit') }}
      </MyAccountHeading>

      <ProfileUpdateForm @submit="updatePersonalData" />

      <MyAccountNotice>
        {{ $t('Use your personal data') }}
        <a href="#">{{ $t('Privacy Policy') }}.</a>
      </MyAccountNotice>
    </SfTab>

    <!-- Password reset -->
    <SfTab :title="$t('Password change')">
      <MyAccountHeading>
        {{ $t('Your current email address is') }}
        <strong v-if="user" class="message__label">{{ user.uid }}.</strong>
        {{ $t('Change password your account') }}:
      </MyAccountHeading>

      <PasswordResetForm @submit="updatePassword" />
    </SfTab>
  </SfTabs>
</template>

<script>
import { extend } from 'vee-validate';
import { email, required, min, confirmed } from 'vee-validate/dist/rules';
import ProfileUpdateForm from '~/components/MyAccount/ProfileUpdateForm';
import PasswordResetForm from '~/components/MyAccount/PasswordResetForm';
import { SfTabs, SfInput, SfButton } from '@storefront-ui/vue';
import { useUser } from '@vsf-enterprise/sapcc';
import MyAccountHeading from '~/components/MyAccount/MyAccountHeading.vue';
import MyAccountNotice from '~/components/MyAccount/MyAccountNotice.vue';

extend('email', {
  ...email,
  message: 'Invalid email'
});

extend('required', {
  ...required,
  message: 'This field is required'
});

extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('password', {
  validate: value => String(value).length >= 8 && String(value).match(/[A-Za-z]/gi) && String(value).match(/[0-9]/gi),
  message: 'Password must have at least 8 characters including one letter and a number'
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match'
});

export default {
  name: 'PersonalDetails',

  components: {
    SfTabs,
    SfInput,
    SfButton,
    ProfileUpdateForm,
    PasswordResetForm,
    MyAccountHeading,
    MyAccountNotice
  },

  setup() {
    const { update: updateUser, changePassword, user } = useUser();

    const formHandler = async (fn, onComplete, onError) => {
      try {
        const data = await fn();
        await onComplete(data);
      } catch (error) {
        onError(error);
      }
    };

    const updatePersonalData = ({ form, onComplete, onError }) => formHandler(() => updateUser({ user: form.value }), onComplete, onError);
    const updatePassword = ({ form, onComplete, onError }) => formHandler(() => changePassword({ current: form.value.currentPassword, new: form.value.newPassword }), onComplete, onError);

    return {
      updatePersonalData,
      updatePassword,
      user
    };
  }
};
</script>
