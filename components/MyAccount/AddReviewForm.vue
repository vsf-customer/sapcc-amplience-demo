<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      v-e2e="'review-heading'"
      :level="3"
      :title="$t('Add Review')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(handleFormSubmit)">
      <div class="form">
        <ValidationProvider
          name="headLine"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-e2e="'review-headLine'"
            v-model="form.headline"
            :label="$t('Headline')"
            name="headLine"
            class="form__element"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
        <ValidationProvider
          name="rating"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-e2e="'review-rating'"
            :value="form.rating + ''"
            @input="onRatingSelected"
            :label="$t('Rating')"
            name="rating"
            class="form__element sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          >
            <SfSelectOption
              v-for="opt in [1, 2, 3, 4, 5]"
              :key="opt"
              :value="opt"
            >
              {{ opt }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="comment"
          rules="required"
          v-slot="{ errors }"
          slim
        >
          <SfTextarea
            v-e2e="'review-comment'"
            v-model="form.comment"
            :label="$t('Comment')"
            name="comment"
            class="form__element"
            required
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
            :rows="10"
            :cols="40"
          />
        </ValidationProvider>
        <ValidationProvider name="alias" v-slot="{ errors }" slim>
          <SfInput
            v-e2e="'review-alias'"
            v-model="form.alias"
            :label="$t('Alias')"
            name="alias"
            class="form__element"
            :valid="!errors[0]"
            :errorMessage="$t(errors[0])"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            v-e2e="'save-review'"
            class="form__action-button"
            type="submit"
            :disabled="saving"
          >
            <SfLoader v-if="saving" :loading="saving" />
            <span>
              {{ $t('Add Review') }}
            </span>
          </SfButton>
          <SfButton
            v-e2e="'cancel-review'"
            type="button"
            class="form__cancel-button"
            @click="cancel"
          >
            {{ $t('Cancel') }}
          </SfButton>
        </div>
      </div>
    </form>
    <div v-if="error">{{ error }}</div>
  </ValidationObserver>
</template>

<script>
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import {
  SfHeading,
  SfInput,
  SfButton,
  SfLoader,
  SfTextarea,
  SfSelect
} from '@storefront-ui/vue';
import { required, min, regex } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});

extend('regex', regex);

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
    SfHeading,
    SfInput,
    SfButton,
    SfLoader,
    SfTextarea,
    SfSelect
  },
  setup(_, { emit }) {
    const saving = ref(false);
    const error = ref(null);

    const form = reactive({
      comment: '',
      headline: '',
      alias: '',
      rating: 5
    });

    const onRatingSelected = (value) => {
      form.rating = Number(value);
    };

    const onError = (err) => {
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

    return {
      form,
      saving,
      error,
      handleFormSubmit,
      cancel,
      onRatingSelected
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
    --button-width: auto;
  }
  &__element {
    margin: 0 0 var(--spacer-lg) 0;
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
</style>
