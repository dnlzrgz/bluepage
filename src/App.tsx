import { Editor } from "./components/Editor";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { DatePicker } from "./components/DatePicker";
import { StatusIndicator } from "./components/StatusIndicator";
import { NoiseBackground } from "./components/NoiseBackground";
import { SettingsPopover } from "./components/SettingsPopover";

function App() {
  return (
    <>
      <header>
        <FloatingToolbar>
          <StatusIndicator />
          <DatePicker />
          <SettingsPopover />
        </FloatingToolbar>
      </header>
      <main>
        <Editor />
        <NoiseBackground enabled />
      </main>
    </>
  );
}

export default App;
