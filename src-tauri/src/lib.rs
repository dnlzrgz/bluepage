mod commands;
mod db;
mod models;

use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;

            let pool = tauri::async_runtime::block_on(async {
                let pool = db::connect(&app_data_dir).await?;
                db::migrate(&pool).await?;
                Ok::<_, Box<dyn std::error::Error>>(pool)
            })?;

            app.manage(pool);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_entry,
            commands::get_entry_dates,
            commands::upsert_entry,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
