// tests/pages/SearchResultsPage.js
import { expect } from '@playwright/test';

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class SearchResultsPage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Locators for price filter - using more flexible selectors
    this.priceSection = this.page.locator('text="Price"').first();
    
    // Store multiple locators so we can fall back if the primary selector stops matching.
    this.productSelectors = [
      '[data-qa-locator="product-item"]',
      'div.c16H9d',
      '[data-qa-locator="general-products"] [data-qa-locator*="product"]',
      'div[data-qa-locator="product-item-card"]',
    ];
    this.noResultsBanner = this.page.locator('[data-qa-locator="general-products-empty"], text=/no results/i');

    this.brandSearchInput = this.page.locator('[placeholder="Search in Brand"], [placeholder="Search in brands"], [placeholder="Search brand"]');
    this.brandFilterOptions = this.page.locator('[data-qa-locator="filter-option"], label:has(input[type="checkbox"]), a:has(input[type="checkbox"])');
  }

  /**
   * Task 4: Apply a brand filter
   * @param {string} brandName
   */
  async applyBrandFilter(brandName) {
    await this.waitForResults().catch(() => {});

    const brandSearch = this.brandSearchInput.first();
    const hasBrandSearch = await brandSearch.isVisible().catch(() => false);
    if (hasBrandSearch) {
      await brandSearch.fill('');
      await brandSearch.fill(brandName);
      await this.page.waitForTimeout(300);
    }

    const brandMatcher = new RegExp(`^${escapeForRegex(brandName)}$`, 'i');

    let brandLabel = this.page.locator('label').filter({ hasText: brandMatcher }).first();
    if (!await brandLabel.count()) {
      brandLabel = this.page.locator('[data-qa-locator="filter-option"]').filter({ hasText: brandMatcher }).first();
    }
    if (!await brandLabel.count()) {
      brandLabel = this.page.locator('a:has(input[type="checkbox"])').filter({ hasText: brandMatcher }).first();
    }

    if (!await brandLabel.count()) {
      return false;
    }

    await brandLabel.scrollIntoViewIfNeeded();
    const brandCheckbox = brandLabel.locator('input[type="checkbox"]');
    if (await brandCheckbox.count()) {
      const alreadyChecked = await brandCheckbox.isChecked().catch(() => false);
      if (!alreadyChecked) {
        await brandCheckbox.check({ force: true });
      }
    } else {
      await brandLabel.click();
    }

    await this.waitForNetworkIdle();
    await this.waitForResults();
    return true;
  }

  async applyFirstAvailableBrandFilter() {
    await this.waitForResults().catch(() => {});

    const totalOptions = await this.brandFilterOptions.count();
    for (let index = 0; index < totalOptions; index++) {
      const option = this.brandFilterOptions.nth(index);
      const isVisible = await option.isVisible().catch(() => false);
      if (!isVisible) {
        continue;
      }

      const applied = await this.toggleBrandOption(option);
      if (applied) {
        return applied;
      }
    }

    return null;
  }

  async toggleBrandOption(optionLocator) {
    const label = optionLocator;
    await label.scrollIntoViewIfNeeded().catch(() => {});
    const checkbox = label.locator('input[type="checkbox"]');
    if (await checkbox.count()) {
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (!isChecked) {
        await checkbox.check({ force: true });
      }
    } else {
      await label.click();
    }

    await this.waitForNetworkIdle();
    await this.waitForResults();

    const text = await label.innerText().catch(() => '');
    const appliedText = text.trim();
    return appliedText || null;
  }

  /**
   * Task 5: Apply a price filter
   * @param {string} min
   * @param {string} max
   */
  async applyPriceFilter(min, max) {
    // Scroll to the price filter section
    const priceSection = this.page.locator('text="Price"').first();
    await priceSection.scrollIntoViewIfNeeded().catch(() => {});
    await this.page.waitForTimeout(500);

    // Find price inputs more flexibly
    const allNumberInputs = await this.page.locator('input[type="number"], input.ant-input-number-input').all();
    
    if (allNumberInputs.length >= 2) {
      const minInput = allNumberInputs[allNumberInputs.length - 2]; // Second to last
      const maxInput = allNumberInputs[allNumberInputs.length - 1]; // Last
      
      // Clear and fill the price inputs
      await minInput.clear().catch(() => {});
      await minInput.fill(min);
      await this.page.waitForTimeout(300);
      
      await maxInput.clear().catch(() => {});
      await maxInput.fill(max);
      await this.page.waitForTimeout(300);

      // Press Enter on the max input to apply the filter
      await maxInput.press('Enter');
    } else {
      // Fallback: try by placeholder
      const minInput = this.page.locator('[placeholder="Min"]').first();
      const maxInput = this.page.locator('[placeholder="Max"]').first();
      
      await minInput.fill(min);
      await this.page.waitForTimeout(300);
      await maxInput.fill(max);
      await this.page.waitForTimeout(300);
      await maxInput.press('Enter');
    }

    await this.waitForNetworkIdle();
    await this.waitForResults();
  }

  /**
   * Task 6: Count products in results
   * @returns {Promise<number>}
   */
  async getProductCount() {
    const productLocator = await this.waitForResults();
    if (!productLocator) {
      return 0;
    }
    return await productLocator.count();
  }

  /**
   * Task 7: Open the first product in the details
   */
  async openFirstProduct() {
  const productLocator = await this.waitForResults();
    if (!productLocator) {
      return null;
    }
    return await this.openProductCard(productLocator.first());
  }

  async openProductWithFreeShipping() {
  const productLocator = await this.waitForResults();
    if (!productLocator) {
      return null;
    }

    const freeShippingProducts = productLocator.filter({ hasText: /free\s+(shipping|delivery)/i });
    if (await freeShippingProducts.count() === 0) {
      return null;
    }
    return await this.openProductCard(freeShippingProducts.first());
  }

  async waitForResults() {
    // Try to wait for load state but don't fail if it times out
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (error) {
      console.log('Note: Page load state timeout, checking for products anyway...');
    }

    const startTime = Date.now();
    const timeout = 30000;

    while (Date.now() - startTime < timeout) {
      if (await this.noResultsBanner.first().isVisible().catch(() => false)) {
        return null;
      }

      for (const selector of this.productSelectors) {
        const locator = this.page.locator(selector);
        const first = locator.first();
        const isVisible = await first.isVisible().catch(() => false);
        if (isVisible) {
          return locator;
        }

        const count = await locator.count().catch(() => 0);
        if (count > 0) {
          return locator;
        }
      }

      await this.page.waitForTimeout(250);
    }

    throw new Error('Timed out waiting for search results to render.');
  }

  async waitForNetworkIdle() {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch {
      // Network idle might not trigger on every filter update; ignore timeouts.
    }
  }

  async openProductCard(cardLocator) {
    await cardLocator.scrollIntoViewIfNeeded();
    const clickableTarget = cardLocator.locator('a').first();
    const interactionTarget = (await clickableTarget.count()) ? clickableTarget : cardLocator;
    await expect(interactionTarget).toBeVisible({ timeout: 15000 });

    const context = this.page.context();
    const newPagePromise = context.waitForEvent('page', { timeout: 7000 }).catch(() => null);
    await interactionTarget.click();
    const maybeNewPage = await newPagePromise;
    if (maybeNewPage) {
      await maybeNewPage.waitForLoadState('domcontentloaded');
      return maybeNewPage;
    }

    await this.page.waitForLoadState('domcontentloaded');
    return this.page;
  }
}