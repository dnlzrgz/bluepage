import Editor from "./features/Editor";
import { FloatingToolbar } from "./components/ui/FloatingToolbar";
import { DatePicker } from "./components/ui/DatePicker";
import { StatusIndicator } from "./features/StatusIndicator";
import { NoiseBackground } from "./components/ui/NoiseBackground";

function App() {
  return (
    <main className="font-sans">
      <FloatingToolbar>
        <StatusIndicator />
        <DatePicker />
      </FloatingToolbar>
      <Editor />
      <NoiseBackground enabled />
    </main>
  );
}

export default App;
