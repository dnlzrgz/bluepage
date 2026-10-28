use chrono::NaiveDate;
use serde::Serialize;
use sqlx::SqlitePool;
use tauri::State;

use crate::models::Entry;

/// Row still holding TipTap's JSON instead of markdown.
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct LegacyEntry {
    pub date: NaiveDate,
    pub content: String,
    pub plain_text: String,
}

/// Temporary: added so in the frontend we can convert pre-markdown rows once.
#[tauri::command]
pub async fn read_legacy_entries(pool: State<'_, SqlitePool>) -> Result<Vec<LegacyEntry>, String> {
    sqlx::query_as(
        "SELECT date, content, plain_text FROM entries WHERE content LIKE '{\"type\":\"doc\"%'",
    )
    .fetch_all(&*pool)
    .await
    .map_err(|e| e.to_string())
}

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
    if plain_text.trim().is_empty() {
        sqlx::query("DELETE FROM entries WHERE date = ?")
            .bind(date)
            .execute(&*pool)
            .await
            .map_err(|e| e.to_string())?;
        return Ok(());
    }

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
