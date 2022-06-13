import { useValidLink } from "@common/utils/hooks";
import { PropsWithChildren } from "react";

interface LinkCheckProps {
  link: string;
}

export function WithValidLink({
  link,
  children,
}: PropsWithChildren<LinkCheckProps>) {
  const isValid = useValidLink(link);

  if (isValid) {
    return <>{children}</>;
  }
  return null;
}
