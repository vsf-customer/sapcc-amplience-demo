import { Header } from './commonComponents/header';
import { LoginModal } from './commonComponents/login-modal';
import { Cart } from './commonComponents/cart-sidebar';
import { RegisterModal } from './commonComponents/register-modal';
import { Notifications } from './commonComponents/notifications';
import { SearchModal } from './commonComponents/search-modal';

export default abstract class Page {
  abstract path: string;

  public visit() {
    cy.visit(this.path);
  }

  get header() {
    return new Header;
  }

  get loginModal() {
    return new LoginModal;
  }

  get cart() {
    return new Cart;
  }

  get registerModal() {
    return new RegisterModal;
  }

  get notifications() {
    return new Notifications();
  }

  get searchModal() {
    return new SearchModal;
  }
}
