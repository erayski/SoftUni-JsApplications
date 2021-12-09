const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

describe('Tests', async function () {
    this.timeout(7000);

    let page, browser;

    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('Test-1-Loads and displays all books', async () => {
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');
        await page.waitForSelector('text=Harry Potter');
        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));

        expect(rows[1]).to.contains('Harry Potter');
        expect(rows[1]).to.contains('Rowling');
        expect(rows[2]).to.contains('C# Fundamentals');
        expect(rows[2]).to.contains('Nakov');
    });

    it('Test-2-Add book', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('form#createForm >> input[name="title"]', 'New title');
        await page.fill('form#createForm >> input[name="author"]', 'New author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('form#createForm >> text=Submit')
        ]);

        const data = JSON.parse(request.postData());
        expect(data.title).to.equal('New title');
        expect(data.author).to.equal('New author');
    });

    it('Test-3-Try to add book with empty field', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('form#createForm >> input[name="title"]', 'Title-1');
        await page.fill('form#createForm >> input[name="author"]', '');

        const [request] = await Promise.all([
            page.click('form#createForm >> text=Submit'),
            page.click('text=Load All Books')
        ]);

        const content = await page.textContent('table tbody');
        expect(content).not.to.contain('Title-1');
    });

    it('Test-4-Edit book', async () => {
        await page.goto('http://localhost:5500');

        await Promise.all([
            page.click('text=Load All Books'),
            page.click('.editBtn')
        ]);

        const visible = await page.isVisible('#editForm');
        expect(visible).to.be.true;

        await page.fill('#editForm input[name="title"]', 'Edited');

        await page.click('text=Save');
        await page.click('text=Load All Books');

        const content = await page.textContent('table tbody');
        expect(content).to.contain('Edited');
    });

    it('Test-5-Delete book', async () => {
        await page.goto('http://localhost:5500');
        await Promise.all([
            page.click('text=Load All Books'),
            page.click('.deleteBtn'),
            page.on('dialog', dialog => dialog.accept())
        ]);

        await page.click('text=Load All Books');
        const content = await page.textContent('table tbody');
        expect(content).not.to.contain('J.K.Rowling');
    });

});