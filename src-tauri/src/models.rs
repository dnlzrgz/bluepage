use chrono::{NaiveDate, NaiveDateTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entry {
    pub id: i64,
    pub date: NaiveDate,
    pub content: String,
    pub plain_text: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
