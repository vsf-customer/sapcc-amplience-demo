export class Notifications {

  get getNotificationToast() {
    return cy.getByTestId('notification-toast');
  }

  assertNotification(expectedValue: string) {
    this.getNotificationToast.should('contain.text', expectedValue);
  }
}
