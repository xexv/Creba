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

Creba удаляет/блокирует по умолчанию:

* **Коммерция:** Nitro-плашки и апселлы, Shop, подарки/гифты, boost-UI.
* **Косметика:** аватарные декорации, profile effects, nameplates, анимированные баннеры.
* **Балласт-фичи:** Quests, Activities/встроенные игры, Server Discovery, game detection, connections, Clyde/AI, Family Center.
* **Тяжёлый контент:** автоплей гифок/видео/аватаров, лишние ассеты пикеров.
* **Фон/приватность:** телеметрия, `science`/`track`, Sentry-отчёты, промо-попапы.

> Часть пунктов вырезается «по-настоящему» (блок сетевых запросов и патч рендера — не грузит), часть скрывается через CSS. Подробности — в исходниках патча инъекции.

## Платформы

Собирается под **Windows, macOS, Linux** (x86_64 и ARM64). Основная и наиболее стабильная — Windows.

| Возможность | Windows | macOS | Linux |
|---|---|---|---|
| Базовое (вход, навигация, текст/DM) | ✓ | ✓ | ~ |
| Голос | ✓ | ✓ | ✗[^1] |
| Демонстрация экрана | ~[^2] | ~ | ✗[^1] |
| Темы / Shelter / плагины | ✓ | ✓ | ✓ |

[^1]: Голос/стрим на Linux зависят от WebRTC в WebKitGTK и в большинстве сборок не работают полноценно.
[^2]: Захват экрана в WebView2 использует системный пикер; кастомный пикер «как в Discord» — в разработке.

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

Релизы собираются через GitHub Actions: вкладка **Actions → Release Creba → Run workflow**, ввести версию и патчноуты — workflow соберёт Creba под все платформы/архитектуры и опубликует GitHub Release.

## Плагины и темы

Creba поставляется с Shelter; Vencord включается в настройках. Файлы кладутся в папку конфига:

```
Windows: %appdata%\creba\{plugins,themes,extensions}\
Linux:   ~/.config/creba/{plugins,themes}\
macOS:   ~/Library/Application Support/creba/{plugins,themes}\
```

## Благодарности

Creba основана на [**Dorion**](https://github.com/SpikeHD/Dorion) (© SpikeHD, MIT) и использует [Shelter](https://github.com/uwu/shelter). Огромная благодарность их авторам — без них этого проекта бы не было. Оригинальная лицензия сохранена в [LICENSE](./LICENSE).
