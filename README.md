# Daraz.pk Automation Testing - Assignment No. 7

This project automates functional testing on [Daraz.pk](https://www.daraz.pk/) using **Playwright** with the **Page Object Model (POM)** design pattern.

## 📋 Assignment Overview

Automate functional testing on Daraz.pk to validate search, filters, and product details functionality.

### Learning Objectives
- Learn Playwright for web automation
- Implement filters, search, and assertions
- Apply Page Object Model (POM) for test design

## ✅ Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| 1 | Setup project with Playwright | ✅ Complete |
| 2 | Navigate to Daraz.pk | ✅ Complete |
| 3 | Search for "electronics" | ✅ Complete |
| 4 | Apply brand filter | ✅ Complete |
| 5 | Apply price filter (500–5000) | ✅ Complete |
| 6 | Count products and validate > 0 | ✅ Complete |
| 7 | Open product details | ✅ Complete |
| 8 | Verify if free shipping is available | ✅ Complete |

## 🏗️ Project Structure

```
daraz-automation-assignment/
├── tests/
│   ├── pages/
│   │   ├── HomePage.js           # Page Object for home page
│   │   ├── SearchResultsPage.js  # Page Object for search results
│   │   └── ProductPage.js        # Page Object for product details
│   ├── daraz-assignment.spec.js  # Main test file
│   └── example.spec.js           # Playwright example test
├── playwright.config.js          # Playwright configuration
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## 🛠️ Technologies Used

- **Playwright** - Modern web automation framework
- **JavaScript** - Programming language
- **Page Object Model** - Design pattern for maintainable tests
- **Node.js** - Runtime environment

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mt08081/daraz-automation-assignment.git
cd daraz-automation-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🚀 Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run specific test file:
```bash
npx playwright test tests/daraz-assignment.spec.js
```

### Run tests in headed mode (see the browser):
```bash
npx playwright test --headed
```

### Run tests in a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report:
```bash
npx playwright show-report
```

## 📝 Test Scenarios

### Main Test: `should search, filter, and verify product details`

1. **Navigate to Daraz.pk**
   - Opens https://www.daraz.pk/
   - Dismisses any popups/overlays

2. **Search for "electronics"**
   - Enters search term in search box
   - Submits search

3. **Apply Brand Filter**
   - Attempts to apply "Samsung" brand filter
   - Falls back to first available brand if Samsung not found

4. **Apply Price Filter**
   - Sets minimum price: 500
   - Sets maximum price: 5000
   - Applies filter

5. **Count Products**
   - Counts products in search results
   - Validates count is greater than 0

6. **Open Product with Free Shipping**
   - Finds product with free shipping
   - Opens product details page

7. **Verify Free Shipping**
   - Checks if free shipping is available
   - Validates free shipping indicator is visible

## 🎯 Page Object Model (POM) Implementation

### HomePage
- **Methods:**
  - `navigate()` - Navigate to Daraz.pk
  - `search(item)` - Search for a product
  - `ensureReady()` - Wait for page to be ready
  - `dismissOverlaysIfPresent()` - Close popups

### SearchResultsPage
- **Methods:**
  - `applyBrandFilter(brandName)` - Apply brand filter
  - `applyFirstAvailableBrandFilter()` - Apply first available brand
  - `applyPriceFilter(min, max)` - Apply price range filter
  - `getProductCount()` - Count products in results
  - `openProductWithFreeShipping()` - Open product with free shipping
  - `waitForResults()` - Wait for search results to load

### ProductPage
- **Methods:**
  - `isFreeShippingAvailable()` - Check if free shipping is available
  - `waitForReady()` - Wait for product page to load

## 🔧 Configuration

The `playwright.config.js` file includes:
- Test directory: `./tests`
- Timeout: 30 seconds per test
- Browsers: Chromium, Firefox, WebKit
- Screenshots on failure
- Trace on first retry

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

The report includes:
- Test execution status
- Screenshots of failures
- Execution traces
- Error details

## 🐛 Troubleshooting

### PowerShell Execution Policy Error
If you see a script execution error, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy RemoteSigned
```

### Alternative: Use Node directly
```bash
node node_modules/playwright/cli.js test tests/daraz-assignment.spec.js
```

### Test Timeout
If tests timeout, increase the timeout in `playwright.config.js`:
```javascript
timeout: 60 * 1000, // 60 seconds
```

## 👨‍💻 Author

**Muhammad Hassan**
- GitHub: [@mt08081](https://github.com/mt08081)

## 📅 Submission Details

- **Assignment:** Assignment No. 7 – Selenium/Playwright Automation
- **Due Date:** November 7, 2025 at 11:55 PM
- **Status:** ✅ Complete

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [YouTube Tutorial](https://www.youtube.com/watch?v=PXeBv-AGa6o)
- [10Pearls University - Automation Course](https://10pearlsuniversity.org/courses/automation-with-selenium-web-driver-testng/)

## 📄 License

This project is created for educational purposes as part of an automation testing assignment.
