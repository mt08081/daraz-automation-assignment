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
    console.log('Task 2: Navigating to Daraz.pk...');
    await homePage.navigate();
    console.log('✓ Successfully navigated to Daraz.pk');

    // Task 3: Search for "electronics"
    console.log('\nTask 3: Searching for "electronics"...');
    await homePage.search('electronics');
    await searchResultsPage.waitForResults();
    console.log('✓ Search completed successfully');
    
    // Task 4: Apply brand filter (e.g., 'Samsung')
    // We wait for the filter to be visible before clicking
    console.log('\nTask 4: Applying brand filter...');
    let brandFilterLabel = 'Samsung';
    const brandFilterApplied = await searchResultsPage.applyBrandFilter(brandFilterLabel);
    if (!brandFilterApplied) {
      const fallbackBrand = await searchResultsPage.applyFirstAvailableBrandFilter();
      if (!fallbackBrand) {
        throw new Error('No brand filters were available for the current search results.');
      }
      brandFilterLabel = fallbackBrand;
      console.log(`✓ Applied fallback brand filter: ${brandFilterLabel}`);
    } else {
      console.log(`✓ Applied brand filter: ${brandFilterLabel}`);
    }

    // Task 5: Apply price filter (500–5000)
    console.log('\nTask 5: Applying price filter (500-5000)...');
    await searchResultsPage.applyPriceFilter('500', '5000');
    console.log('✓ Price filter applied successfully');

    // Task 6: Count products and validate > 0
    console.log('\nTask 6: Counting products in results...');
    const productCount = await searchResultsPage.getProductCount();
    console.log(`✓ Found ${productCount} products in search results`);
    expect(productCount).toBeGreaterThan(0);

    // Task 7: Open product details with Free Shipping preference
    console.log('\nTask 7: Opening product details...');
    let productDetailsPage = await searchResultsPage.openProductWithFreeShipping();
    let selectedProductHasFreeShipping = true;
    
    if (!productDetailsPage) {
      console.log('No products with free shipping found, opening first available product...');
      productDetailsPage = await searchResultsPage.openFirstProduct();
      selectedProductHasFreeShipping = false;
    } else {
      console.log('Found product with free shipping indicator in search results');
    }

    if (!productDetailsPage) {
      throw new Error('Could not open any product from search results.');
    }
    console.log('✓ Product details page opened');

    // Task 8: Verify if free shipping is available
    console.log('\nTask 8: Verifying free shipping availability...');
    const productPage = new ProductPage(productDetailsPage);
    await productPage.waitForReady();
    
    const isFreeShipping = await productPage.isFreeShippingAvailable();
    console.log(`✓ Free shipping available: ${isFreeShipping}`);
    
    // Verify the product page loaded and we can check shipping status
    expect(typeof isFreeShipping).toBe('boolean');
    
    // If we selected a product with free shipping indicator, verify it shows on product page
    if (selectedProductHasFreeShipping) {
      expect(isFreeShipping).toBe(true);
    }
    
    console.log('\n✅ All 8 tasks completed successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Task Summary:');
    console.log('  ✓ Task 1: Project setup with Playwright');
    console.log('  ✓ Task 2: Navigate to Daraz.pk');
    console.log('  ✓ Task 3: Search for "electronics"');
    console.log(`  ✓ Task 4: Apply brand filter (${brandFilterLabel})`);
    console.log('  ✓ Task 5: Apply price filter (500-5000)');
    console.log(`  ✓ Task 6: Count products (${productCount} found)`);
    console.log('  ✓ Task 7: Open product details');
    console.log(`  ✓ Task 8: Verify free shipping (${isFreeShipping ? 'Available' : 'Not Available'})`);
    console.log('═══════════════════════════════════════');
    
    // Close the new tab
    if (productDetailsPage !== page) {
      await productDetailsPage.close();
    }
  });
});