import { PromiseCanceller } from "@common/utils";
import { useState, SVGProps, useEffect, ReactSVGElement } from "react";

interface DynamicSvgProps extends SVGProps<SVGSVGElement> {
  src: string;
}

export default function DynamicSvg({ src, ...props }: DynamicSvgProps) {
  const [svg, setSvg] = useState<ReactSVGElement>();

  useEffect(() => {
    const promise = new PromiseCanceller(
      import(`../../public/img/${src}`),
      (module) => {
        setSvg(module.default(props));
      },
    );
    return () => promise.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]); //! DO NOT ADD props TO DEPS, cause infinite loop

  return svg || null;
}
