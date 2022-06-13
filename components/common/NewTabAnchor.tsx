import { PropsWithChildren } from "react";

export default function NewTabAnchor({
  children,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
>) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
