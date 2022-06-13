import { TransProps } from "next-translate";
import Trans from "next-translate/Trans";
import { ReactElement } from "react";

export default function TransWrapper({ components, ...props }: TransProps) {
  const defaultComponents: Record<string, ReactElement> = {
    br: <br />,
    b: <b />,
  };
  return (
    <Trans
      {...props}
      components={{
        ...defaultComponents,
        ...components,
      }}
    />
  );
}
