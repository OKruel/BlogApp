const Page = require('./helpers/customPage');

describe('TESTING BLOG PAGES FUNCTIONALITIES', () => {
    let page;
    beforeEach(async () => {
        page = await Page.build();
        await page.goto('http://localhost:3000');
    });
    afterEach(async () => {
        await page.close();
    });

    describe('WHEN LOGGED IN', () => {
        beforeEach(async () => {
            await page.login();
            await page.click('.fixed-action-btn a[href="/blogs/new"]');
        });
        test('Can see the create post form', async () => {
            const label = await page.getContentsOf('form label');
            expect(label).toEqual('Blog Title');
        });
        describe('and using VALID input values', async () => {
            beforeEach(async () => {
                await page.type('.title input', 'Automatic Title Test 1');
                await page.type('.content input', 'Automatic Content Test 1');
                await page.click('form button');
            });
            test('Submitting navigates to review screen', async () => {
                const submitButton = await page.getContentsOf('button.green.btn-flat i.material-icons');
                expect(submitButton).toBe('email');
            });
            test('Submitting then saving, add a blogPost to index page', async () => {
                await page.click('button.green.btn-flat');
                await page.waitFor('.card');
                const title = await page.getContentsOf('.card-title');
                const content = await page.getContentsOf('p');
                expect(title).toEqual('Automatic Title Test 1')
                expect(content).toEqual('Automatic Content Test 1')
            });
        });
        describe('and using INVALID input values', async () => {
            beforeEach(async () => {
                await page.click('form button');
            });
            test('Invalid warning messages should appear', async () => {
                const titleError = await page.getContentsOf('.title .red-text');
                const contentError = await page.getContentsOf('.content .red-text');
                expect(titleError).toEqual('You must provide a value');
                expect(contentError).toEqual('You must provide a value');
            });
        });
    });
    describe('When NOT Logged in', async () => {
        const actions = [
            {
                method: 'get',
                path: '/api/blogs'
            },
            {
                method: 'post',
                path: 'api/blogs',
                data: { title: 'T', content: 'C' }
            }
        ];
        test('Unauthorized actions in the blog page', async () => {
            const results = await page.execRequests(actions);
            for(let result of results) {
                expect(result).toEqual({ error: 'You must log in!' });
            }
        });
    });
});



