/**
 * Creba UI cuts — скрытие «мусорных» элементов интерфейса Discord.
 *
 * Селекторы ПРОВЕРЕНЫ вживую через CDP на реальном клиенте:
 *  - навигационные пункты (Nitro/Shop/Quests) — по стабильному href;
 *  - квест-бар/косметика — по префиксам классов ([class*="name"]),
 *    т.к. полные имена захешированы (questProgressWrapper_ae7810 и т.п.),
 *    но семантический префикс стабилен и не зависит от языка клиента.
 *
 * Это визуальное скрытие. Реальная разгрузка по сети (телеметрия, ассеты
 * декораций) — в extension/dnr-rules.json.
 */
const CREBA_CUTS_CSS = `
/* ===== Сайдбар: Nitro / Shop / Quests (стабильно по href) ===== */
li:has(a[href="/store"]),
li:has(a[href="/shop"]),
li:has(a[href="/quest-home"]) { display: none !important; }

/* ===== Квест-бар (снизу слева) и плитки наград ===== */
/* Корень свёрнутого/развёрнутого квест-бара — mask прямо в секции панелей аккаунта.
   Убирает и пустую полоску-контейнер, что остаётся при активном квесте. */
section[class*="panels_"] > [class*="mask_"],
[class*="questProgress"],
[class*="questReward"],
[class*="questAccepted"],
[class*="questsButton"],
[class*="questsContainer"],
[class*="questBar"],
[class*="questCard"],
[class*="questTile"],
[class*="questBadge"],
[class*="questEmbed"],
[class*="questHome"],
[class*="questContent"],
[class*="questFooter"],
[class*="questHeader"],
[class*="questNotif"],
[class*="questPopout"],
[class*="questIcon"],
[class*="postEnrollment"] { display: none !important; }

/* ===== Косметика: декорации аватаров / эффекты и баннеры профиля / кланы =====
   ВНИМАНИЕ: НЕ скрывать [class*="nameplate"] — у строк участников с nameplate
   к контейнеру строки добавляется этот класс, и display:none убирает самого
   участника из списка. Nameplate оставляем видимым. */
[class*="avatarDecoration"],
[class*="profileEffects"],
[class*="profileEffect"],
[class*="banner_"],
[class*="bannerButton"],
[class*="clanTag"],
[class*="collectible"] { display: none !important; }

/* Profile frame (новая «рамка» вокруг карточки профиля).
   Реальный видимый фрейм — слой-картинка profileFrameLayer (из collectibles-shop),
   а не borders_* (те тоже прячем на всякий случай). */
[class*="profileFrameLayer"],
[class*="staticPreview"],
[class*="background_c4293b"],
[class*="bordersTopLeft"],
[class*="bordersTopRight"],
[class*="bordersBottomLeft"],
[class*="bordersBottomRight"],
[class*="bordersBottom"],
[class*="bordersTop"] { display: none !important; }

/* Nameplate: скрываем ТОЛЬКО арт-подложку строки участника, а не саму строку.
   Строка = .childContainer.nameplated > [container_* (арт) + memberInner_* (участник)].
   Прячем арт-слой (container_), участник (memberInner_) остаётся видимым. */
[class*="nameplated"] > [class*="container_"],
/* Арт-контейнер nameplate во ВСЕХ контекстах (список, hover-попап, DM, панель
   аккаунта) — это отдельный слой container_df39b2 с video внутри, а не строка. */
[class*="container_df39b2"],
/* Nameplate на панели своего аккаунта (снизу слева) — арт-подложка с градиентом */
[class*="fitInAccount"] { display: none !important; }

/* ===== Коммерция: кнопка подарка в поле ввода ===== */
button[aria-label="Give a Gift"],
button[aria-label="Подарить"],
button[aria-label*="gift" i] { display: none !important; }

/* ===== Промо / буст ===== */
[class*="premiumUpsell"],
[class*="premiumButton"],
[class*="nitroButton"],
[class*="boostButton"],
[class*="guildBoost"],
[class*="upsellBanner"] { display: none !important; }

/* ===== Балласт: GIF-пикер / Apps(Activities) / Soundboard / Discovery / What's New ===== */
button[aria-label="Open GIF picker"],
button[aria-label*="GIF" i],
button[aria-label="Apps"],
[class*="soundboard"],
a[href="/guild-discovery"],
[data-list-item-id*="discovery"],
[class*="whatsNew"],
[class*="premiumTrial"] { display: none !important; }

/* ===== Производительность: почти отключить анимации/переходы (разгрузка GPU на idle) ===== */
*, *::before, *::after {
  animation-duration: 0.01ms !important;
  animation-delay: 0ms !important;
  transition-duration: 0.01ms !important;
  transition-delay: 0ms !important;
}
`

/**
 * Внедряет стили вырезаний в head. Идемпотентно.
 */
export function applyCrebaCuts() {
  const existing = document.getElementById('creba-cuts')
  if (existing) return

  const style = document.createElement('style')
  style.id = 'creba-cuts'
  style.textContent = CREBA_CUTS_CSS
  document.head.appendChild(style)

  hideWishlistTab()

  console.log('[Creba] UI cuts applied')
}

/**
 * Скрыть вкладку «Wishlist» в карточке профиля. У неё нет семантического
 * класса (только хеши), поэтому ищем по тексту. Debounced MutationObserver,
 * т.к. вкладки появляются только при открытии профиля.
 */
function hideWishlistTab() {
  const NEEDLE = /^(wishlist|список желаемого|game collection|коллекция игр)$/i
  const hide = () => {
    // Вкладка Wishlist в полной карточке профиля
    document.querySelectorAll('[class*="tabBarItem"]').forEach((el) => {
      if (NEEDLE.test((el.textContent || '').trim())) {
        (el as HTMLElement).style.setProperty('display', 'none', 'important')
      }
    })
    // Секция Wishlist в боковой панели профиля (заголовок -> вся секция)
    document.querySelectorAll('h1, h2, h3, [class*="header_"]').forEach((h) => {
      if (NEEDLE.test((h.textContent || '').trim())) {
        const section = h.closest('section') || h.closest('[class*="container_"]')
        if (section) (section as HTMLElement).style.setProperty('display', 'none', 'important')
      }
    })
  }
  hide()

  let scheduled = false
  const obs = new MutationObserver(() => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      hide()
    })
  })
  obs.observe(document.body, { childList: true, subtree: true })
}
