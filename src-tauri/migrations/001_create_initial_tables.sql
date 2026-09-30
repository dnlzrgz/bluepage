-- Main entries table.
CREATE TABLE IF NOT EXISTS entries (
    id          INTEGER PRIMARY KEY,
    date        TEXT NOT NULL UNIQUE,       -- ISO 8601 date (YYYY-MM-DD)
    content     TEXT NOT NULL DEFAULT '',   -- TipTap JSON (serialized)
    plain_text  TEXT NOT NULL DEFAULT '',   -- Extracted plain text for FTS

    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%f', 'now')),
    updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%f', 'now'))
);

-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS entries_fts USING fts5(
    plain_text,
    content='entries',
    content_rowid='id',
    tokenize='trigram remove_diacritics 1'
);

-- UPDATE: trigger for timestamp
CREATE TRIGGER IF NOT EXISTS entries_touch
AFTER UPDATE OF content, plain_text ON entries
BEGIN
    UPDATE entries
    SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = new.id;
END;

-- INSERT: Add new entry to the FTS index
CREATE TRIGGER IF NOT EXISTS entries_ai
AFTER INSERT ON entries BEGIN
    INSERT INTO entries_fts(rowid, plain_text)
    VALUES (new.id, new.plain_text);
END;

-- UPDATE: Remove the old index entry and add updated one
CREATE TRIGGER IF NOT EXISTS entries_au
AFTER UPDATE OF plain_text ON entries BEGIN
    INSERT INTO entries_fts(entries_fts, rowid, plain_text)
    VALUES ('delete', old.id, old.plain_text);
    INSERT INTO entries_fts(rowid, plain_text)
    VALUES (new.id, new.plain_text);
END;

-- DELETE: Remove entry from FTS index
CREATE TRIGGER IF NOT EXISTS entries_ad
AFTER DELETE ON entries BEGIN
    INSERT INTO entries_fts(entries_fts, rowid, plain_text)
    VALUES ('delete', old.id, old.plain_text);
END;
