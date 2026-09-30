import "./App.css";
import { getDb } from "./lib/db";

function App() {
  getDb()
    .then(() => console.log("Database ready"))
    .catch((err) => console.error("DB init failed:", err));

  return (
    <main className="grid min-h-lvh place-items-center">
      <h1 className="text-3xl">Welcome to Tauri + React</h1>
    </main>
  );
}

export default App;
