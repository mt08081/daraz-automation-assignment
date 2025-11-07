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
    try {
      await this.page.goto('https://www.daraz.pk/', { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 // 60 seconds timeout
      });
    } catch (error) {
      console.log('First navigation attempt failed, retrying...');
      // Retry once more
      await this.page.goto('https://www.daraz.pk/', { 
        waitUntil: 'networkidle',
        timeout: 60000
      });
    }
    await this.ensureReady();
  }

  /**
   * Task 3: Search for a product
   * @param {string} item
   */
  async search(item) {
    await this.ensureReady();
    await this.searchBox.fill(item);
    await this.page.waitForTimeout(500);
    
    const trigger = await this.findVisibleSearchTrigger();

    // Click search button or press Enter
    if (trigger) {
      await trigger.click();
    } else {
      await this.searchBox.press('Enter');
    }
    
    // Wait for URL to change (indicates navigation happened)
    try {
      await this.page.waitForURL('**/catalog/**', { timeout: 15000 });
      console.log('✓ Search URL loaded');
    } catch (error) {
      console.log('Note: URL did not change to expected pattern, continuing...');
    }
    
    // Give page time to load content
    await this.page.waitForTimeout(2000);
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