const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return target[property] || browser[property] || page[property];
            }
        });
    };

    constructor(page) {
        this.page = page;
    };

    async login() {
        const user = await userFactory(); //userFactory returns a Promise because it goes to MongoDB and saves a new user there for the AWAIT keyword.
        const { session, sig } = sessionFactory(user);//Waiting for the user model mongoose object

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]'); //Waits for the element to apear in the DOM.
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, element => element.innerHTML);
    };

    get(path) {
        return this.page.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            }).then(res => res.json());
        }, path);
    };

    post(path, data) {
        return this.page.evaluate((_path, _data) => {
            return fetch(_path, {
                method: 'POST',
                headers: { 'Content-Type': 'application.json' },
                credentials: 'same-origin',
                body: JSON.stringify(_data)
            }).then(res => res.json())
        }, path, data);
    };

    execRequests(actions) {
        return Promise.all(
            actions.map(({ method, path, data }) => {
                return this[method](path, data);
            })
        );
    };
};

module.exports = CustomPage;