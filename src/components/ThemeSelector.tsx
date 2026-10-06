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
      aria-labelledby="theme-label"
      className="flex items-center justify-center gap-2.5"
    >
      {THEMES.map((t) => (
        <label key={t} className="cursor-pointer">
          <Radio.Root
            value={t}
            data-theme={t}
            className="data-checked:ring-offset-none flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-checked:ring-2 data-checked:ring-primary data-checked:ring-offset-2"
          ></Radio.Root>
          <span className="sr-only">{t} theme</span>
        </label>
      ))}
    </RadioGroup>
  );
}
