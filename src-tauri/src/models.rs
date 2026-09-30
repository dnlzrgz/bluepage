use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entry {
    pub id: i64,
    pub date: String,
    pub content: String,
    pub plain_text: String,
    pub created_at: String,
    pub updated_at: String,
}
