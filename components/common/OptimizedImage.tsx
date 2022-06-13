import { PromiseCanceller } from "@common/utils";
import {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  useEffect,
  useState,
} from "react";

export type OptimizedImageProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function OptimizedImage({
  src,
  alt = "",
  ...props
}: OptimizedImageProps) {
  const [image, setImage] = useState<string | undefined>();
  useEffect(() => {
    const promise = new PromiseCanceller(
      import(
        `img/${src}?resize&sizes[]=640&sizes[]=740&sizes[]=828&sizes[]=1080&sizes[]=1920&sizes[]=2048&sizes[]=3840&format=webp`
      ),
      (img) => setImage(img),
    );
    return () => promise.cancel();
  }, [src]);
  return (image && <img src={image} {...props} alt={alt} />) || null;
}
