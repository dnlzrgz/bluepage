import { ComponentProps } from "react";
import { Toolbar } from "@base-ui/react/toolbar";

export function FloatingToolbar({
  ...props
}: ComponentProps<typeof Toolbar.Root>) {
  return (
    <Toolbar.Root
      className="grid grid-cols-[1.25rem_1fr_1.25rem] items-center justify-items-center bg-primary px-3 py-1.5 z-40 fixed top-0 inset-x-0 w-full"
      {...props}
    />
  );
}
