import { Locator, Page } from "@playwright/test";

export abstract class BasePage {
    protected readonly page: Page;
    constructor(page: Page){
        this.page = page;
    }

    async navigate(url:string): Promise<void>{
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle')
    }

    async waitForElement(locator:Locator, timeout: number = 5000): Promise<void>{
        await locator.waitFor({state:'visible', timeout})
    }

    async isElementVisible(locator: Locator): Promise<boolean>{
        return await locator.isVisible();
    }
    async getText(locator: Locator): Promise<string>{
        return await locator.textContent() || '';
    }

    async scrollToElement(locator:Locator): Promise<void>{
        await locator.scrollIntoViewIfNeeded();
    }

    async takeScreenshot(name: string): Promise<void>{
        await this.page.screenshot({path: `screenshots/${name}.png`})
    }
}