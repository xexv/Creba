import { applyExtraCSS } from './shared/ui'
import { applyCrebaCuts } from './shared/cuts'
import { initWindowsKeybinds } from './shared/windows_keybinds'

(async () => {
  console.log('Discord is loaded!')

  // Creba: скрыть вырезанный UI-хлам как можно раньше
  applyCrebaCuts()

  // Ensure top bar exists if we want it
  if (window.__DORION_CONFIG__.use_native_titlebar)
    window.__TAURI__.core.invoke('set_decorations', { enable: true }).catch(_e => { }) // This is allowed to fail

  initWindowsKeybinds()
  // Load up our extra css
  applyExtraCSS()

  // The comment ahead is read by tauri and used to insert theme injection code

  /*! __THEMES__ */
})()
