/**
 * Creba UI cuts — скрытие «мусорных» элементов интерфейса Discord.
 *
 * ВАЖНО: селекторы опираются на префиксы классов Discord ([class*="name"]),
 * т.к. полные имена классов захешированы и меняются при апдейтах. Префикс
 * (семантическая часть) обычно стабилен и не зависит от языка клиента.
 * Часть селекторов может потребовать подстройки под текущую версию Discord —
 * тюнить лучше через devtools на живом клиенте.
 *
 * Это визуальное скрытие (не грузит меньше по сети — за это отвечает
 * блок-лист в extension/dnr-rules.json). Реально не рендерить компоненты
 * можно только webpack-патчами (следующий этап).
 */
const CREBA_CUTS_CSS = `
/* ===== Nitro / Shop / подарки ===== */
a[href="/store"],
a[href="/shop"],
a[href^="/nitro"],
[class*="premiumButton"],
[class*="premiumUpsell"],
[class*="nitroButton"],
[class*="buttonMenu"] [class*="gift"],
[class*="premiumPromo"] { display: none !important; }

/* ===== Boost-UI ===== */
[class*="premiumGuild"],
[class*="boostButton"],
[class*="guildBoost"] { display: none !important; }

/* ===== Quests ===== */
[class*="questsButton"],
[class*="questBadge"],
[class*="quests_"],
[class*="questsContainer"] { display: none !important; }

/* ===== Server Discovery / Activities ===== */
a[href="/guild-discovery"],
a[href="/discovery"],
[class*="discoverButton"],
[class*="activityLaunch"],
[class*="quickSwitcherActivit"] { display: none !important; }

/* ===== Soundboard / GIF-пикер (Tenor) ===== */
[class*="soundboard"],
[class*="expressionPickerButton"][aria-controls*="gif"] { display: none !important; }

/* ===== Косметика: декорации / profile effects / nameplates / коллекционки ===== */
[class*="avatarDecoration"],
[class*="profileEffects"],
[class*="profileEffect_"],
[class*="nameplate"],
[class*="collectibles"],
[class*="clanTag"] { display: none !important; }

/* ===== Промо-попапы / «что нового» ===== */
[class*="whatsNew"],
[class*="premiumTrialButton"],
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
