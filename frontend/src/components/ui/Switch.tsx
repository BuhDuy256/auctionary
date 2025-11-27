import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { clsx } from "clsx";
import "./Switch.css";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={clsx("switch", className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className={clsx("switch-thumb")} />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
