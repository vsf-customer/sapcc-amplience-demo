import { useRoute, computed } from '@nuxtjs/composition-api';
import { useUser, useConsents, useCart } from '@vsf-enterprise/sapcc';

const useAppState = () => {
  const route = useRoute();
  const { load: loadUser, logout, set: setUser } = useUser();
  const { load: loadConsents } = useConsents();
  const { load: loadCart, set: setCart } = useCart('main');
  const { load: loadWishlist, set: setWishlist } = useCart('wishlist');

  const isLogout = computed(() => Boolean(route.value.query.logout));

  const loadInitialAppState = async () => {
    await Promise.all([loadUser(), loadCart(), loadWishlist(), loadConsents()]);
  };

  const resetAppState = async () => {
    await resetUser();
    await Promise.all([resetCart(), resetWishlist(), loadConsents()]);
  };

  async function resetUser() {
    setUser(null);
    await logout();
  }

  async function resetCart() {
    setCart(null);
    await loadCart();
  }

  async function resetWishlist() {
    setWishlist(null);
    await loadWishlist();
  }

  return { loadInitialAppState, resetAppState, isLogout };
};

export default useAppState;
