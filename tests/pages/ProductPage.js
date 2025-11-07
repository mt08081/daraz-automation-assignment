// tests/pages/ProductPage.js
import { expect } from '@playwright/test';

export class ProductPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Locator for the free shipping text
    this.productTitle = this.page.locator('.pdp-product-title, h1');
    this.freeShippingText = this.page.locator('text=/free\s+(shipping|delivery)/i');
  }

  /**
   * Task 8: Verify if free shipping is available
   * @returns {Promise<boolean>}
   */
  async isFreeShippingAvailable() {
    const freeShippingLocator = this.freeShippingText.first();
    return await freeShippingLocator.isVisible();
  }

  async waitForReady() {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.productTitle.first()).toBeVisible({ timeout: 20000 });
  }
}