mod commands;
mod db;
mod models;

use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                let app_data_dir = handle
                    .path()
                    .app_data_dir()
                    .expect("failed to resolve app data dir");

                std::fs::create_dir_all(&app_data_dir).expect("failed to create app data dir");

                let pool = db::connect(&app_data_dir)
                    .await
                    .expect("failed to connect to database");

                db::migrate(&pool).await.expect("failed to run migrations");

                handle.manage(pool);
                println!("Database initialized");
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::load_entry,
            commands::upsert_entry,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
