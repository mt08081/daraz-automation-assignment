// tests/daraz-assignment.spec.js
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductPage } from './pages/ProductPage';

test.describe('Daraz.pk Functional Test', () => {

  test('should search, filter, and verify product details', async ({ page }) => {
    
    // Initialize Page Objects
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    // --- Start of Test Tasks ---

    // Task 2: Navigate to Daraz.pk
    await homePage.navigate();

    // Task 3: Search for "electronics"
    await homePage.search('electronics');
    await searchResultsPage.waitForResults();
    
    // Task 4: Apply brand filter (e.g., 'Samsung')
    // We wait for the filter to be visible before clicking
    let brandFilterLabel = 'Samsung';
    const brandFilterApplied = await searchResultsPage.applyBrandFilter(brandFilterLabel);
    if (!brandFilterApplied) {
      const fallbackBrand = await searchResultsPage.applyFirstAvailableBrandFilter();
      if (!fallbackBrand) {
        test.skip('No brand filters were available for the current search results.');
        return;
      }
      brandFilterLabel = fallbackBrand;
      console.log(`Applied fallback brand filter: ${brandFilterLabel}`);
    } else {
      console.log('Applied brand filter.');
    }

    // Task 5: Apply price filter (500–5000)
    await searchResultsPage.applyPriceFilter('500', '5000');
    console.log('Applied price filter.');

    // Task 6: Count products and validate > 0
    const productCount = await searchResultsPage.getProductCount();
    console.log(`Found ${productCount} products.`);
    expect(productCount).toBeGreaterThan(0);

    // Task 7: Open product details with Free Shipping preference
    const productDetailsPage = await searchResultsPage.openProductWithFreeShipping();
    if (!productDetailsPage) {
      test.skip('No product with Free Shipping was available for the current filters.');
      return;
    }

    const productPage = new ProductPage(productDetailsPage);
    await productPage.waitForReady();

    // Task 8: Verify if free shipping is available
    const isFreeShipping = await productPage.isFreeShippingAvailable();
    console.log(`Is free shipping available? ${isFreeShipping}`);
    
    // Assertion: Check if the free shipping text is visible.
    // Note: This might fail if the first product *doesn't* have free shipping.
    // A good test would be to confirm the *element* exists, not that it's always true.
    expect(isFreeShipping).toBe(true);
    
    // Close the new tab
    if (productDetailsPage !== page) {
      await productDetailsPage.close();
    }
  });
});