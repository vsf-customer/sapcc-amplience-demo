import { unref } from '@nuxtjs/composition-api';
import { ANONYMOUS_USER } from '@vsf-enterprise/sapcc-api';
import { useUserCarts, useCart, useCartEntries, LoadCartProps } from '@vsf-enterprise/sapcc';

const useCartHelpers = () => {
  const { load: loadCart, cart } = useCart('main');
  const { load: loadWishlist, cart: wishlist, save: saveWishlist } = useCart('wishlist');
  const { update: updateWishlistEntry } = useCartEntries('wishlist');
  const { carts: userCarts } = useUserCarts();

  const mergeCarts = async() => {
    const { user, guid: oldCartId } = unref(cart);
    const isCartAnonymous = user?.uid === ANONYMOUS_USER;

    if (!isCartAnonymous) return;

    const activeCart = userCarts.value.find(cart => cart.user);
    const loadCartProps: LoadCartProps = { oldCartId };

    if (activeCart) {
      loadCartProps.toMergeCartGuid = activeCart.guid;
    }

    await loadCart(loadCartProps);
  };

  const removeWishlistDuplicates = async () => {
    const wishlistEntries = unref(wishlist).entries;

    for (const entry of wishlistEntries) {
      const { entryNumber, quantity } = entry;

      if (quantity === 1) continue;
      await updateWishlistEntry({ entryNumber, quantity: 1 });
    }
  };

  const mergeWishlists = async () => {
    const name = 'wishlist';
    const userWishlist = userCarts.value.find(cart => cart.name === name);

    const { guid: oldCartId } = unref(wishlist);

    if (!userWishlist) {
      await loadWishlist({ oldCartId });
      await saveWishlist({ name });
    } else {
      const { guid: toMergeCartGuid } = userWishlist;
      await loadWishlist({ oldCartId, toMergeCartGuid });
      await removeWishlistDuplicates();
    }
  };

  return {
    mergeCarts,
    mergeWishlists
  };
};

export default useCartHelpers;
