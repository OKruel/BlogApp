
const CustomPage = require('./helpers/customPage');

describe('Testing the application header', () => {
    let page;
    beforeEach(async () => {
        page = await CustomPage.build();
        await page.goto('http://localhost:3000');
    });
    afterEach(async () => {
        page.close();
    });
    test('Header has the correct text', async () => {
        const headerText = await page.getContentsOf('a.brand-logo');
        expect(headerText).toBe('Blogster');
    });
    test('Click on the login button redirects to oauthflow', async () => {
        await page.click('.right a');
        const url = await page.url();
        expect(url).toMatch(/accounts\.google\.com/);
    });
    test('Logout button should appear', async () => {
        await page.login();
        const logoutButtonText = await page.getContentsOf('.right li a[href="/auth/logout"]');
        expect(logoutButtonText).toBe('Logout');
    });
});

