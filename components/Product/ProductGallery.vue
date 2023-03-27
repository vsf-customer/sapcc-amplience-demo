<template>
  <SfGallery
    class="product__gallery"
    :class="{ 'product__gallery--thumbs-hidden': productGallery.length < 2 }"
    :images="productGallery"
    :image-width="640"
    :image-height="644"
    :thumb-height="160"
    :thumb-width="160"
    :current="1"
    :image-tag="imageTag"
    :thumb-image-tag="imageTag"
    data-testid="product-gallery"
  />
</template>

<script>
import { defineComponent, computed, useContext, unref } from '@nuxtjs/composition-api';
import { SfGallery } from '@storefront-ui/vue';
import { productGetters } from '@vsf-enterprise/sapcc';

export default defineComponent({
  name: 'ProductGallery',
  components: { SfGallery },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup({ product }) {
    const { $globalImgTag, $getCloudinaryUploadPath } = useContext();
    const emptyGallery = [{
      mobile: { url: '' },
      desktop: { url: '' },
      zoom: { url: '' },
      alt: product._name || product.name
    }];

    const productGallery = computed(() => {
      const gallery = productGetters.getGallery(product).map((img) => ({
        mobile: { url: $getCloudinaryUploadPath(img.normal || img.big) },
        desktop: { url: $getCloudinaryUploadPath(img.big) },
        zoom: { url: $getCloudinaryUploadPath(img.big) },
        alt: product._name || product.name
      }));

      if (gallery.length) {
        return gallery;
      } else {
        return emptyGallery;
      }
    });

    const imageTag = computed(() => {
      const isGalleryEmpty = unref(productGallery) === emptyGallery;
      return isGalleryEmpty ? 'img' : $globalImgTag;
    });

    return { productGallery, imageTag };
  }
});
</script>

<style lang="scss" scoped>
.product {
  &__gallery {
    flex: 1;
    flex-direction: column-reverse;
    justify-content: flex-end;
    --gallery-image-width: 40rem;
    --gallery-stage-width: 40rem;
    --gallery-thumbs-flex-direction: row;

    @include for-mobile {
      flex-direction: column;
      --gallery-image-width: 100%;
      --gallery-stage-width: 100%;
      ::v-deep .glide__slides {
        align-items: center;
      }
    }

    ::v-deep .sf-gallery {
      &__stage {
        flex: initial;
        .sf-image {
          object-fit: contain;
          &--placeholder {
            @include for-mobile {
              height: 500px;
              width: 425px;
            }
          }
        }
      }
      &__thumbs {
        flex: 1;
        align-items: flex-start;
        max-width: var(--gallery-image-width);
      }
    }

    &--thumbs-hidden {
      ::v-deep .sf-gallery__thumbs {
        display: none;
      }
    }
  }
}
</style>
