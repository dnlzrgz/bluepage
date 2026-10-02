import Editor from "./features/Editor";
import { FloatingToolbar } from "./components/ui/FloatingToolbar";
import { DatePicker } from "./components/ui/DatePicker";
import { StatusIndicator } from "./features/StatusIndicator";

import "./App.css";

function App() {
  return (
    <main className="h-lvh w-full bg-primary font-sans">
      <FloatingToolbar>
        <span className="flex w-5 justify-center">
          <StatusIndicator />
        </span>

        <DatePicker />

        <span className="flex w-5 justify-center"></span>
      </FloatingToolbar>
      <Editor />
    </main>
  );
}

export default App;
