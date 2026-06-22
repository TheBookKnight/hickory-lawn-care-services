import { test, expect } from '@playwright/test';

test.describe('Service Request List Component', () => {

  test('should redirect / to /requests and show loading state then correct data', async ({ page }) => {
    // Mock the API response with mock data
    const mockData = [
      {
        id: '1',
        customerName: 'Alice Smith',
        phone: '555-0100',
        address: '123 Maple St',
        serviceType: 'Lawn Mowing',
        description: 'Mow the front yard lawn',
        preferredDate: '2026-06-22T09:00:00Z',
        status: 'Pending',
        createdAt: '2026-06-21T10:00:00Z',
      },
      {
        id: '2',
        customerName: 'Bob Jones',
        phone: '555-0200',
        address: '456 Oak Ave',
        serviceType: 'Tree Trimming',
        description: 'Trim the branches in the backyard',
        preferredDate: '2026-06-25T14:00:00Z',
        status: 'Completed',
        createdAt: '2026-06-20T14:30:00Z',
      }
    ];

    // Mock API request
    await page.route('**/api/servicerequests', async (route) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData)
      });
    });

    // Navigate to base URL (should redirect to /requests)
    const navigationPromise = page.goto('/');

    // Verify loading state is shown initially while request is pending
    await expect(page.locator('text=Loading service requests...')).toBeVisible();
    await expect(page.locator('table')).not.toBeVisible();

    // Wait for page to fully load (navigation and API mock complete)
    await navigationPromise;

    // Verify redirect occurred
    await expect(page).toHaveURL(/.*\/requests/);

    // Verify loading state disappears
    await expect(page.locator('text=Loading service requests...')).not.toBeVisible();

    // Verify table structure and content
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Verify table headers
    const headers = table.locator('thead th');
    await expect(headers).toHaveText([
      'Customer Name',
      'Service Type',
      'Preferred Date',
      'Status',
      'Created Date'
    ]);

    // Verify table rows
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(2);

    // Row 1
    const firstRowCells = rows.nth(0).locator('td');
    await expect(firstRowCells).toHaveText([
      'Alice Smith',
      'Lawn Mowing',
      '2026-06-22T09:00:00Z',
      'Pending',
      '2026-06-21T10:00:00Z'
    ]);

    // Row 2
    const secondRowCells = rows.nth(1).locator('td');
    await expect(secondRowCells).toHaveText([
      'Bob Jones',
      'Tree Trimming',
      '2026-06-25T14:00:00Z',
      'Completed',
      '2026-06-20T14:30:00Z'
    ]);
  });

  test('should display empty state when there are no service requests', async ({ page }) => {
    // Mock API request to return empty list
    await page.route('**/api/servicerequests', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Go directly to /requests
    await page.goto('/requests');

    // Verify empty state is displayed
    await expect(page.locator('text=No service requests found.')).toBeVisible();
    await expect(page.locator('text=Loading service requests...')).not.toBeVisible();
    await expect(page.locator('table')).not.toBeVisible();
  });
});
