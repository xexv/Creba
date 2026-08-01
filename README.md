<h1 align="center">
 Creba
</h1>

<div align="center">
 Creba — максимально облегчённый и оптимизированный клиент Discord на Tauri.
 <br />
 Форк <a href="https://github.com/SpikeHD/Dorion">Dorion</a> с вырезанным «мусором» (Nitro, квесты, косметика, телеметрия и пр.) и упором на производительность.
</div>

---

> [!IMPORTANT]
> Creba — это **клиентский мод/обёртка** над веб-версией Discord, а не отдельный мессенджер. Использование модифицированных клиентов формально нарушает Discord ToS. На практике клиент-моды (Shelter/Vencord/BetterDiscord) терпят годами, пока нет автоматизации/самоботинга, но гарантий нет — используешь на свой риск.

## Что это

Creba загружает веб-клиент Discord в системный WebView (WebView2 на Windows) вместо тяжёлого Electron/Chromium официального клиента. За счёт этого:

* **Меньше вес и потребление** — нет своего бандла Chromium (десятки–сотни МБ экономии, быстрый старт).
* **Вырезан балласт** — Nitro и магазин, квесты, аватарные декорации / profile effects / nameplates, активности, server discovery, телеметрия и трекинг и прочее (см. [Что вырезано](#что-вырезано)).
* **Поддержка плагинов и тем** — [Shelter](https://github.com/uwu/shelter) встроен, опционально [Vencord](https://github.com/vendicated/vencord); BetterDiscord-темы (CSS) работают.

## Что вырезано

Creba удаляет/скрывает/блокирует по умолчанию:

* **Коммерция:** Nitro-плашки и апселлы, Shop, кнопка подарка, boost-UI, промо-попапы, What's New.
* **Квесты — полностью:** вкладка, квест-бар (и пустой контейнер), плитки наград, попапы **+ блок API квестов** (`/api/v*/quests`) — данные вообще не грузятся, ни вкладки, ни функционала.
* **Косметика:** аватарные декорации, profile effects, баннеры профиля, **рамка профиля** (profile frame), **nameplate** (арт-подложка — при этом сами участники в списке остаются видны), clan-теги.
* **Профиль:** секции **Wishlist** и **Game Collection**.
* **Балласт-фичи:** GIF-пикер (Tenor), Apps/Activities, Soundboard, Server Discovery.
* **Производительность:** анимации/переходы почти отключены (разгрузка GPU на idle).
* **Фон/приватность (сеть):** телеметрия `science`/`track`/`metrics`, Sentry-отчёты, ассеты косметики — режутся через declarativeNetRequest (`extension/dnr-rules.json`).

> Реально «не грузит» — сетевые блокировки (телеметрия, квест-API, ассеты) и патчи; остальное скрывается CSS/JS. Селекторы Discord захешированы, поэтому при апдейтах Discord часть вырезаний может потребовать подстройки. Правки — в `src-tauri/injection/shared/cuts.ts` и `src-tauri/extension/dnr-rules.json`.

## Платформы

Готовые сборки в [releases](https://github.com/xexv/Creba/releases): **Windows x64/ARM64**, **macOS (Apple Silicon)**, **Linux x64** (`.deb`/`.rpm`/`.AppImage`). Установщик ~5–7 МБ. Основная и наиболее стабильная платформа — Windows.

| Возможность | Windows | macOS | Linux |
|---|---|---|---|
| Базовое (вход, навигация, текст/DM) | ✓ | ✓ | ~ |
| Голос | ✓ | ✓ | ✗[^1] |
| Демонстрация экрана | ✓[^2] | ~ | ✗[^1] |
| Темы / Shelter / плагины | ✓ | ✓ | ✓ |

[^1]: Голос/стрим на Linux зависят от WebRTC в WebKitGTK и в большинстве сборок не работают полноценно.
[^2]: Демонстрация экрана использует нативный пикер WebView2 (есть выбор окна/экрана). Плавающая плашка-индикатор «…is sharing your screen» скрывается через WinAPI (`functionality/screenshare.rs`).

> Linux ARM и macOS Intel не собираются (нестабильная упаковка AppImage на ARM; Apple Silicon dmg покрывает современные Маки).

## Сборка

### Требования

* [Node.js](https://nodejs.org) + [pnpm](https://pnpm.io/)
* [Rust и Cargo](https://www.rust-lang.org/tools/install)
* [Зависимости Tauri](https://v2.tauri.app/start/prerequisites/) (на Windows — WebView2 Runtime, обычно уже есть)

### Шаги

```sh
# 1. Установить JS-зависимости
pnpm install

# 2. Скачать инжектор Shelter (в репозиторий не входит)
pnpm shupdate

# 3. (только Linux) Собрать WebKitGTK-расширение
#    cd src-tauri/extension_webkit && cmake . && cmake --build .

# 4. Запуск в dev-режиме...
pnpm dev

# ...или полная сборка
pnpm tauri build
```

Собранные файлы — в `src-tauri/target/(release|debug)/`, установщики — в `bundle/`.

## Релизы

Релизы собираются через GitHub Actions: вкладка **Actions → Release Creba → Run workflow**, ввести версию и патчноуты — workflow соберёт Creba (Windows x64/ARM, macOS Apple Silicon, Linux x64) и создаст **черновик** GitHub Release с этими сборками и патчноутами. Проверяешь черновик и жмёшь **Publish**.

## Плагины и темы

Creba поставляется с Shelter; Vencord включается в настройках. Файлы кладутся в папку конфига (папка данных унаследована от Dorion — `dorion`):

```
Windows: %appdata%\dorion\{plugins,themes,extensions}\
Linux:   ~/.config/dorion/{plugins,themes}\
macOS:   ~/Library/Application Support/dorion/{plugins,themes}\
```

## Благодарности

Creba основана на [**Dorion**](https://github.com/SpikeHD/Dorion) (© SpikeHD, MIT) и использует [Shelter](https://github.com/uwu/shelter). Огромная благодарность их авторам — без них этого проекта бы не было. Оригинальная лицензия сохранена в [LICENSE](./LICENSE).
