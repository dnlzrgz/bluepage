import { lazy, Suspense } from "react";
import { Editor } from "./components/Editor";
import { FloatingToolbar } from "./components/FloatingToolbar";
import { StatusIndicator } from "./components/StatusIndicator";
import { NoiseBackground } from "./components/NoiseBackground";
import { SettingsPopover } from "./components/SettingsPopover";
import { Notifications } from "./components/Notifications";

// DayPicker is the largest non-editor dependency; it arrives right after first paint.
const DatePicker = lazy(() =>
  import("./components/DatePicker").then((module) => ({
    default: module.DatePicker,
  })),
);

function App() {
  return (
    <>
      <header>
        <FloatingToolbar>
          <StatusIndicator />
          <Suspense fallback={<span />}>
            <DatePicker />
          </Suspense>
          <SettingsPopover />
        </FloatingToolbar>
      </header>
      <main>
        <Editor />
        <NoiseBackground enabled />
      </main>
      <Notifications />
    </>
  );
}

export default App;
