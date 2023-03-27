<template>
  <SfTabs :open-tab="1" class="product__tabs" data-testid="additional-info-tabs">
    <!-- Description -->
    <SfTab :title="$t('Description')">
      <SfScrollable :show-text="$t('Show more')" v-if="productGetters.getDescription(product)">
        <div
          class="product__description"
          v-html="productGetters.getDescription(product)"
        />
      </SfScrollable>
      <span v-else>
        {{ $t('This product has no description yet.') }}
      </span>
    </SfTab>
    <!-- Reviews -->
    <SfTab :title="$t('Reviews')">
      <span v-if="!product.reviews.length">
        {{ $t('This product has no reviews yet.') }}
      </span>
      <SfButton
        class="add-review__button"
        @click="openReviewForm"
      >
        {{ $t('Add Review') }}
      </SfButton>

      <SfModal :visible="isReviewModalVisible" @close="closeReviewForm">
        <AddReviewForm
          @submit="saveReview"
          @cancel="closeReviewForm"
        />
      </SfModal>

      <SfReview
        v-for="review in product.reviews"
        :key="review.id"
        :author="review.alias || review.principal.name"
        :date="$d(new Date(review.date), 'long')"
        :message="review.comment"
        :max-rating="5"
        :rating="review.rating"
        :char-limit="250"
        read-more-text="Read more"
        hide-full-text="Read less"
        class="product__review"
      />
    </SfTab>
    <!-- Additional Information -->
    <SfTab
      v-if="product.classifications"
      class="product__additional-info"
      :title="$t('Additional Information')"
    >
      <SfScrollable :show-text="$t('Show more')">
        <div
          v-for="classification in product.classifications"
          :key="classification.code"
        >
          <SfHeading
            :level="4"
            :title="classification.name"
            class="sf-heading--no-underline sf-heading--left"
          ></SfHeading>
          <SfProperty
            v-for="feature in classification.features"
            :key="feature.code"
            :name="feature.name"
            :value="
              feature.featureValues.map((val) => val.value).join(', ')
            "
            class="product__property"
          >
          </SfProperty>
        </div>
      </SfScrollable>
    </SfTab>
  </SfTabs>
</template>

<script>
import { defineComponent, ref, useRoute } from '@nuxtjs/composition-api';
import { useReview } from '@vsf-enterprise/sapcc';
import AddReviewForm from '~/components/MyAccount/AddReviewForm.vue';
import { SfTabs, SfProperty, SfHeading, SfReview, SfModal, SfButton, SfScrollable } from '@storefront-ui/vue';
import { productGetters } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'ProductTabs',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: { AddReviewForm, SfTabs, SfProperty, SfHeading, SfReview, SfModal, SfButton, SfScrollable },
  setup({ product }) {
    const route = useRoute();
    const { id } = route.value.params;
    const { add: addReview, error } = useReview(id);

    const isReviewModalVisible = ref(false);

    const openReviewForm = () => {
      isReviewModalVisible.value = true;
    };
    const closeReviewForm = () => {
      isReviewModalVisible.value = false;
    };

    const saveReview = async ({ form, onError, onComplete }) => {
      await addReview({
        review: form,
        productCode: product.code
      });

      if (error.value.addReview) {
        onError(error.value.addReview);
        return;
      }

      onComplete();
      closeReviewForm();
    };

    return {
      isReviewModalVisible,
      openReviewForm,
      closeReviewForm,
      saveReview,
      productGetters
    };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__tabs {
    --tabs-title-z-index: 0;
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
}

.add-review__button {
  margin-bottom: var(--spacer-base);
}
</style>
