import { ComponentProps } from "react";
import { Toolbar } from "@base-ui/react/toolbar";

export function FloatingToolbar({ className, ...props }: ComponentProps<typeof Toolbar.Root>) {
  return (
    <Toolbar.Root
      className="pointer-events-auto flex items-center justify-between bg-primary px-3 py-1.5"
      {...props}
    />
  );
}
