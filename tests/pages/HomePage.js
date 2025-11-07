// tests/pages/HomePage.js
export class HomePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#q');
    this.searchTriggers = [
      page.locator('button[data-qa-locator="search-box-submit"]'),
      page.locator('button.search-box__button--1oV7'),
      page.locator('.search-box__button'),
      page.locator('button[type="submit"]'),
    ];
    this.dismissibleOverlays = [
      page.getByRole('button', { name: /got it/i }),
      page.getByRole('button', { name: /continue/i }),
      page.getByRole('button', { name: /accept/i }),
    ];
  }

  /**
   * Task 2: Navigate to Daraz.pk
   */
  async navigate() {
    await this.page.goto('https://www.daraz.pk/', { waitUntil: 'domcontentloaded' });
    await this.ensureReady();
  }

  /**
   * Task 3: Search for a product
   * @param {string} item
   */
  async search(item) {
    await this.ensureReady();
    await this.searchBox.fill(item);
    const trigger = await this.findVisibleSearchTrigger();
    const navigationPromise = this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {});

    if (trigger) {
      await Promise.all([
        navigationPromise,
        trigger.click(),
      ]);
    } else {
      await Promise.all([
        navigationPromise,
        this.searchBox.press('Enter'),
      ]);
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  async ensureReady() {
    await this.dismissOverlaysIfPresent();
    await this.searchBox.waitFor({ state: 'visible', timeout: 15000 });
    await this.findVisibleSearchTrigger().catch(() => null);
  }

  async dismissOverlaysIfPresent() {
    for (const overlayButton of this.dismissibleOverlays) {
      const isVisible = await overlayButton.isVisible().catch(() => false);
      if (isVisible) {
        await overlayButton.click().catch(() => {});
      }
    }
  }

  async findVisibleSearchTrigger() {
    for (const trigger of this.searchTriggers) {
      const isVisible = await trigger.isVisible().catch(() => false);
      if (isVisible) {
        return trigger;
      }
    }
    return null;
  }
}