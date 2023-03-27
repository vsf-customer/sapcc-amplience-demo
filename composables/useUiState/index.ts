import { reactive, computed, useContext } from '@nuxtjs/composition-api';
import { ACCEPTED_COOKIES_COOKIE_NAME } from '~/helpers/constants';
import Cookie from 'cookie-universal';

const cookies = Cookie();

const state = reactive({
  isCartSidebarOpen: false,
  isWishlistSidebarOpen: false,
  isLoginModalOpen: false,
  isNewsletterModalOpen: false,
  isCategoryGridView: true,
  isFilterSidebarOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAnonymousConsentsModalOpen: false,
  isCookiesAccepted: cookies.get(ACCEPTED_COOKIES_COOKIE_NAME) ?? false
});

const useUiState = () => {
  const context = useContext();
  const isSearchOpen = computed(() => state.isSearchOpen);
  const closeSearchModal = () => state.isSearchOpen = false;
  const openSearchModal = () => state.isSearchOpen = true;

  const isMobileMenuOpen = computed(() => state.isMobileMenuOpen);
  const toggleMobileMenu = () => {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
  };

  const isCartSidebarOpen = computed(() => state.isCartSidebarOpen);
  const toggleCartSidebar = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    state.isCartSidebarOpen = !state.isCartSidebarOpen;
  };

  const isWishlistSidebarOpen = computed(() => state.isWishlistSidebarOpen);
  const toggleWishlistSidebar = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    state.isWishlistSidebarOpen = !state.isWishlistSidebarOpen;
  };

  const isLoginModalOpen = computed(() => state.isLoginModalOpen);
  const toggleLoginModal = () => {
    if (state.isMobileMenuOpen) toggleMobileMenu();
    state.isLoginModalOpen = !state.isLoginModalOpen;
  };

  const isNewsletterModalOpen = computed(() => state.isNewsletterModalOpen);
  const toggleNewsletterModal = () => {
    state.isNewsletterModalOpen = !state.isNewsletterModalOpen;
  };

  const isCategoryGridView = computed(() => state.isCategoryGridView);
  const changeToCategoryGridView = () => {
    state.isCategoryGridView = true;
  };
  const changeToCategoryListView = () => {
    state.isCategoryGridView = false;
  };

  const isFilterSidebarOpen = computed(() => state.isFilterSidebarOpen);
  const toggleFilterSidebar = () => {
    state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
  };

  const isCookiesAccepted = computed(() => state.isCookiesAccepted);
  const acceptCookies = () => {
    context.$cookies.set(ACCEPTED_COOKIES_COOKIE_NAME, true);
    state.isCookiesAccepted = true;
  };

  const isAnonymousConsentsModalOpen = computed(() => state.isAnonymousConsentsModalOpen);
  const toggleAnonymousConsentsModal = () => {
    state.isAnonymousConsentsModalOpen = !state.isAnonymousConsentsModalOpen;
  };

  return {
    isCartSidebarOpen,
    isWishlistSidebarOpen,
    isLoginModalOpen,
    isNewsletterModalOpen,
    isCategoryGridView,
    isFilterSidebarOpen,
    isMobileMenuOpen,
    isSearchOpen,
    toggleCartSidebar,
    toggleWishlistSidebar,
    toggleLoginModal,
    toggleNewsletterModal,
    changeToCategoryGridView,
    changeToCategoryListView,
    toggleFilterSidebar,
    toggleMobileMenu,
    closeSearchModal,
    openSearchModal,
    acceptCookies,
    isCookiesAccepted,
    isAnonymousConsentsModalOpen,
    toggleAnonymousConsentsModal
  };
};

export default useUiState;
