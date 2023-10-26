#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use window_ext::{ToolbarThickness, WindowExt};

mod window_ext;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_extra::init())
        .setup(|app| {
            let win = app.get_window("main").unwrap();
            win.set_transparent_titlebar(ToolbarThickness::Thick);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
