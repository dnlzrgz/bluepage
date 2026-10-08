use chrono::NaiveDate;
use sqlx::SqlitePool;
use tauri::State;

use crate::models::Entry;

#[tauri::command]
pub async fn get_entry(
    date: NaiveDate,
    pool: State<'_, SqlitePool>,
) -> Result<Option<Entry>, String> {
    sqlx::query_as::<_, Entry>("SELECT * FROM entries WHERE date = ?")
        .bind(date)
        .fetch_optional(&*pool)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_entry_dates(
    start_date: NaiveDate,
    end_date: NaiveDate,
    pool: State<'_, SqlitePool>,
) -> Result<Vec<NaiveDate>, String> {
    sqlx::query_scalar::<_, NaiveDate>(
        "SELECT date FROM entries
         WHERE date BETWEEN ? AND ?
         ORDER BY date",
    )
    .bind(start_date)
    .bind(end_date)
    .fetch_all(&*pool)
    .await
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn upsert_entry(
    date: NaiveDate,
    content: String,
    plain_text: String,
    pool: State<'_, SqlitePool>,
) -> Result<(), String> {
    sqlx::query(
        "INSERT INTO entries (date, content, plain_text)
         VALUES (?, ?, ?)
         ON CONFLICT(date) DO UPDATE SET
           content = excluded.content,
           plain_text = excluded.plain_text",
    )
    .bind(date)
    .bind(content)
    .bind(plain_text)
    .execute(&*pool)
    .await
    .map_err(|e| e.to_string())?;
    Ok(())
}
