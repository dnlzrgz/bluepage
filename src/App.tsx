import { Editor } from "./components/Editor";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { DatePicker } from "./components/DatePicker";
import { StatusIndicator } from "./components/StatusIndicator";
import { NoiseBackground } from "./components/NoiseBackground";
import { SettingsPopover } from "./components/SettingsPopover";

function App() {
  return (
    <main className="font-sans">
      <FloatingToolbar>
        <StatusIndicator />
        <DatePicker />
        <SettingsPopover />
      </FloatingToolbar>
      <Editor />
      <NoiseBackground enabled />
    </main>
  );
}

export default App;
