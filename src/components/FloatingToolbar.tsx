import { ComponentProps } from "react";
import { Toolbar } from "@base-ui/react/toolbar";

export function FloatingToolbar({ ...props }: ComponentProps<typeof Toolbar.Root>) {
  return <Toolbar.Root className="toolbar" {...props} />;
}
