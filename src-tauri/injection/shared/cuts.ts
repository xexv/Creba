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
[class*="questProgressWrapper"],
[class*="questProgressCopy"],
[class*="questProgressHint"],
[class*="questRewardTile"],
[class*="questAcceptedContent"],
[class*="questAcceptedHeader"] { display: none !important; }

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

/* Nameplate: скрываем ТОЛЬКО арт-подложку строки участника, а не саму строку.
   Строка = .childContainer.nameplated > [container_* (арт) + memberInner_* (участник)].
   Прячем арт-слой (container_), участник (memberInner_) остаётся видимым. */
[class*="nameplated"] > [class*="container_"] { display: none !important; }

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

  console.log('[Creba] UI cuts applied')
}
