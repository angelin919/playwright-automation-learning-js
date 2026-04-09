## playwright-automation-learning-js

### 🎯 Проект по автоматизации тестирования

Учебный проект для изучения автоматизации тестирования с использованием **Playwright + TypeScript + Page Object Model**.

---

### ✅ Что уже покрыто тестами:

#### TodoMVC
- Базовые сценарии (добавление, завершение, удаление задач)
- Фильтрация задач (All / Active / Completed)

**Количество тестов: ~8**

#### DemoQA

**Elements:**
- ✅ **Links** – проверка HTTP-ссылок (навигационные и API-ссылки с кодами 200, 201, 204, 301, 400, 401, 403, 404) — **16 тестов**
- ✅ **Radio Button** – выбор "Yes", "Impressive", проверка disabled "No", переключение между кнопками — **5 тестов**
- ✅ **Text Box** – успешное заполнение формы, специальные символы, XSS-безопасность, валидация email — **4 теста**

**Alerts, Frame & Windows:**
- ✅ **Alerts** – обычный alert, alert с задержкой 5 секунд, confirm box (OK/Cancel), prompt box (ввод текста, пустой ввод, cancel) — **6 тестов**

**Widgets:**
- ✅ **Accordian** – проверка всех трёх секций, поведение аккордеона (открыта только одна секция) — **4 теста**

---

### 📊 Итого: **~43 теста**

| Раздел | Количество тестов |
| :--- | :--- |
| TodoMVC | ~8 |
| DemoQA - Links | 16 |
| DemoQA - Radio Button | 5 |
| DemoQA - Text Box | 4 |
| DemoQA - Alerts | 6 |
| DemoQA - Accordian | 4 |
| **Всего** | **~43** |

---

### 🔜 В планах:

- 🔲 DemoQA – Web Tables, Buttons, Modal Dialogs, Tool Tips, Tabs

---

### 📋 Тест-кейсы (Test documentation)

Тест-кейсы для учебных проектов написаны в **Qase.io** и выгружены в репозиторий.

#### Ссылки на тест-кейсы:

| Проект | Количество | Ссылка |
| :--- | :--- | :--- |
| **TodoMVC** (CRUD, фильтрация) | ~8 | [Скачать CSV](https://disk.yandex.ru/d/eTlQluddTkj_3g) |
| **DemoQA: Elements** (Links, Radio Button) | 21 | [Скачать CSV](https://disk.yandex.ru/d/H2hc3S_EPy0sug) |
| **DemoQA: Text Box** (валидация, XSS) | 4 | *ссылка будет добавлена* |
| **DemoQA: Alerts** (alert, confirm, prompt) | 6 | *ссылка будет добавлена* |
| **DemoQA: Accordian** (виджет) | 4 | *ссылка будет добавлена* |

---

### 🛠️ Технологии

- [Playwright](https://playwright.dev/) – e2e тестирование
- [TypeScript](https://www.typescriptlang.org/) – типизация
- **Page Object Model** – архитектура
- [Qase.io](https://qase.io/) – управление тест-кейсами
- **GitHub Actions** – CI/CD (в планах)

---

### 🚀 Запуск тестов

```bash
# Установка зависимостей
npm install

# Установка браузеров Playwright
npx playwright install

# Запуск всех тестов (~43 теста)
npx playwright test

# Запуск конкретного раздела
npx playwright test tests/demoQa/elements/

# Запуск с открытым браузером
npx playwright test --headed

# Запуск в режиме отладки
npx playwright test --debug
