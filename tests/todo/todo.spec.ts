import { test, expect } from '@playwright/test';

test.describe('Проверка главной страницы todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Поле ввода на странице', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();

  })

  test('Добавление одной задачи', async ({ page }) => {

    test.step('1. Вести текст задачи', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить хлеб');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('2. Задача появилась в списке', async () => {
      await expect(page.locator('body')).toContainText('Купить хлеб');
    });

  });
  test('Добавление нескольких задач', async ({ page }) => {

    test.step('1. Вести текст первой задачи ', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить хлеб');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })
    test.step('2. Вести текст второй задачи ', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить молоко');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('3. Задачи появились в списке', async () => {
      await expect(page.locator('body')).toContainText('Купить хлеб');
      await expect(page.locator('body')).toContainText('Купить молок');

    });

  });

  test('Добавление пустой задачи', async ({ page }) => {

    test.step('1.Оставить поле ввода пустым ', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('2. Счётчик задач не меняется', async () => {
      // await expect(page.locator('.todo-count')).toHaveText('0 item left');
      await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

  });
  test('Добавление задачи из пробелов', async ({ page }) => {

    test.step('1. В поле ввода ввести несколько пробелов', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('   ');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('2. Счётчик задач не меняется', async () => {
      // await expect(page.locator('.todo-count')).toHaveText('0 item left');
      await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

  });

  test('Фильтрация "Active"', async ({ page }) => {

    test.step('1. Добавить три задачи', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить хлеб');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить молоко');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить соль');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('2. Отметить задачу как выполненную', async () => {
      const taskToComplete = page.locator('.todo-list li:has-text("Купить молоко")')
      const checkbox = taskToComplete.locator('.toggle')
      await checkbox.check()
    });

    await test.step('3. Нажать фильтр "Active"', async () => {
      // await expect(page.locator('.todo-count')).toHaveText('0 item left');
      await page.getByRole('link', { name: 'Active' }).click()
    });


    await test.step('4. Отображение активных задач', async () => {
      await expect(page.locator('.todo-list li:has-text("Купить хлеб")')).toBeVisible();
      await expect(page.locator('.todo-list li:has-text("Купить Соль")')).toBeVisible();
      await expect(page.locator('.todo-list li:has-text("Купить молоко")')).toBeHidden();

    });
  });



  test('Фильтрация "Completed"', async ({ page }) => {

    test.step('1. Добавить три задачи', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить хлеб');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить молоко');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить соль');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    })

    await test.step('2. Отметить задачу как выполненную', async () => {
      const taskToComplete = page.locator('.todo-list li:has-text("Купить молоко")')
      const checkbox = taskToComplete.locator('.toggle')
      await checkbox.check()
    });

    await test.step('3. Нажать фильтр "Completed"', async () => {
      // await expect(page.locator('.todo-count')).toHaveText('0 item left');
      await page.getByRole('link', { name: 'Completed' }).click()
    });


    await test.step('4. Отображение активных задач', async () => {
      await expect(page.locator('.todo-list li:has-text("Купить хлеб")')).toBeHidden();
      await expect(page.locator('.todo-list li:has-text("Купить Соль")')).toBeHidden();
      await expect(page.locator('.todo-list li:has-text("Купить молоко")')).toBeVisible();

    });
  });

  test.skip('Удаление задачи(кнопка ✕)', async ({ page }) => {

    test.step('1.Добавить задачу', async () => {
      await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Купить соль');
      await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
      await expect(page.locator('body')).toContainText('Купить соль');
      await expect(page.locator('.todo-count')).toHaveText('1 item left')
    })
    test.step('2. Навести мышь на задачу (появится крестик ✕)', async () => {
      const todoItem = page.locator('.todo-list li', { hasText: 'Купить соль' });
      // await expect(todoItem).toBeVisible({timeout: 5000})
      await todoItem.waitFor({ state: 'visible' })
      // await todoItem.hover();
      const deleteButton = todoItem.locator('button.destroy')
      await expect(deleteButton).toHaveCount(1)
      await deleteButton.click({ force: true })
    })
    await test.step('3. Счётчик обновляется ', async () => {
      await expect(page.locator('.todo-list li')).toHaveCount(0);
    });

  });


})
