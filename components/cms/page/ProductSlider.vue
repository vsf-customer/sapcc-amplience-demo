<!-- <template>
  <SfCarousel v-if="list.length" class="product-carousel">
    <SfCarouselItem v-for="(product, i) in list" :key="i">
      <SfProductCard
        class="product-card"
        data-cy="home-url_product"
        :title="productGetters.getName(product)"
        :image="product.images[0].url"
        :regular-price="
          $n(
            productGetters.getFormattedPrice(
              productGetters.getPrice(product).regular,
            ),
            'currency',
          )
        "
        :special-price="
          productGetters.getPrice(product).special &&
          $n(productGetters.getPrice(product).special, 'currency')
        "
        :max-rating="5"
        :score-rating="3.5"
        :show-add-to-cart-button="true"
        :is-in-wishlist="isInWishlist({ product })"
        :link="
          localePath(
            `/p/${productGetters.getSlug(product)}/${productGetters.getSku(
              product,
            )}`,
          )
        "
        @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
        @click:wishlist="
          !isInWishlist({ product })
            ? addItemToWishlist({ product })
            : removeItemFromWishlist(product)
        "
        :is-added-to-cart="isInCart({ product })"
      />
    </SfCarouselItem>
  </SfCarousel>
</template>


<script lang="ts">
import Vue from 'vue'
import { SfCarousel, SfProductCard } from '@storefront-ui/vue'
import {
  productGetters,
  useProduct,
  useCart,
  useWishlist,
  wishlistGetters,
} from '@vsf-enterprise/commercetools';
import { onMounted, computed } from '@nuxtjs/composition-api';

export default Vue.extend({
  name: 'ProductSlider',
  components: {
    SfCarousel,
    SfProductCard,
  },
  props: {
    items: {
      type: [String, Array],
      required: true,
    },
  },
  setup({ items }: { items: string | string[] }) {
    const { addItem: addItemToCart, isInCart } = useCart()
    const {
      addItem: addItemToWishlist,
      isInWishlist,
      removeItem,
      wishlist,
    } = useWishlist()
    const uid = Array.isArray(items) ? items.join('') : items;
    const { products, search } = useProduct(uid);

    const masterProducts = computed(() =>
      productGetters.getFiltered(products.value, { master: true }),
    )

    const removeItemFromWishlist = (productItem) => {
      const wishlistItems = wishlistGetters.getItems(wishlist.value)
      const product = wishlistItems.find(
        (wishlistItem) => wishlistItem.variant.sku === productItem.sku,
      )
      removeItem({ product })
    }

    onMounted(async () => {
      const params = Array.isArray(items) ? { skus: items }: { catId: items };
      await search(params);
    });

    return {
      list: masterProducts,
      productGetters,
      addItemToCart,
      isInCart,
      addItemToWishlist,
      removeItemFromWishlist,
      isInWishlist,
    }
  },
})
</script> -->
