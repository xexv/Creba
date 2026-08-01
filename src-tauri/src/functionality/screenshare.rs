//! Creba: скрытие плавающей плашки-индикатора «… is sharing your screen»,
//! которую WebView2/Chromium показывает при демонстрации экрана.
//!
//! У WebView2 нет API, чтобы отключить эту плашку (открытый feature request
//! Microsoft), поэтому мы находим её окно по заголовку и прячем через WinAPI.
//! Совпадение по заголовку очень специфично, так что риск задеть чужое окно
//! минимален. Работает только на Windows.

#[cfg(target_os = "windows")]
use crate::log;

/// Запускает фоновый поток, который периодически прячет окно-индикатор.
#[cfg(target_os = "windows")]
pub fn start_hider() {
  use std::thread;
  use std::time::Duration;
  use windows::Win32::Foundation::LPARAM;
  use windows::Win32::UI::WindowsAndMessaging::EnumWindows;

  log!("Starting screen-share indicator hider");

  thread::spawn(|| {
    loop {
      unsafe {
        let _ = EnumWindows(Some(enum_proc), LPARAM(0));
      }
      thread::sleep(Duration::from_millis(400));
    }
  });
}

#[cfg(target_os = "windows")]
unsafe extern "system" fn enum_proc(
  hwnd: windows::Win32::Foundation::HWND,
  _lparam: windows::Win32::Foundation::LPARAM,
) -> windows::core::BOOL {
  use windows::core::BOOL;
  use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowTextLengthW, GetWindowTextW, IsWindowVisible, ShowWindow, SW_HIDE,
  };

  // Заголовки плашки на разных языках (совпадение по подстроке, lowercase).
  const NEEDLES: [&str; 4] = [
    "sharing your screen",
    "is sharing",
    "демонстрация экрана",
    "доступ к экрану",
  ];

  let cont = BOOL(1); // продолжить перечисление

  if !IsWindowVisible(hwnd).as_bool() {
    return cont;
  }

  let len = GetWindowTextLengthW(hwnd);
  if len <= 0 {
    return cont;
  }

  let mut buf = vec![0u16; (len + 1) as usize];
  let read = GetWindowTextW(hwnd, &mut buf);
  if read <= 0 {
    return cont;
  }

  let title = String::from_utf16_lossy(&buf[..read as usize]).to_lowercase();

  if NEEDLES.iter().any(|n| title.contains(n)) {
    let _ = ShowWindow(hwnd, SW_HIDE);
  }

  cont
}
