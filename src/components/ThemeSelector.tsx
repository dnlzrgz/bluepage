import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { useSettings, updateSetting, type Theme, THEMES } from "@/lib/settings";

export function ThemeSelector() {
  const theme = useSettings((s) => s.theme);

  return (
    <RadioGroup
      value={theme}
      onValueChange={(value) => {
        if ((THEMES as readonly string[]).includes(value as string)) {
          updateSetting("theme", value as Theme);
        }
      }}
      aria-label="Theme"
      className="theme-selector"
    >
      {THEMES.map((t) => (
        <label key={t}>
          <Radio.Root value={t} data-theme={t} className="theme-option"></Radio.Root>
          <span className="sr-only">{t}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
