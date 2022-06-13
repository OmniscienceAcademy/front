import {
  useRef,
  useEffect,
  useState,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ChangeEventHandler,
  KeyboardEventHandler,
} from "react";

interface PlaceholderProps {
  onRender: (size: number) => void;
  className: string | undefined;
  content: string;
}

function Placeholder({ onRender, content, className }: PlaceholderProps) {
  const placeholderRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    onRender(placeholderRef.current?.offsetWidth || 0);
  });
  return (
    <p
      className={className}
      style={{
        position: "absolute",
        color: "rgba(0,0,0,0)",
        zIndex: -1000,
      }}
      ref={placeholderRef}
    >
      {/* add 2 spaces at the end to gain a little more space, juste for confort */}
      {`${content}  `.replace(/\s/g, "\u00a0")}
    </p>
  );
}

type AutoScaleInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onEnter?: (content: string) => void;
};

export default function AutoScaleInput({
  onEnter,
  onChange,
  style,
  onKeyPress,
  ...inputProps
}: AutoScaleInputProps) {
  const [width, setWidth] = useState(0);
  const [content, setContent] = useState("");
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setContent(event.target.value);
    if (onChange) onChange(event);
  };
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> | undefined =
    onEnter
      ? (event) => {
          if (onKeyPress) onKeyPress(event);
          if (event.key === "Enter") {
            onEnter(content);
          }
        }
      : onKeyPress;
  return (
    <>
      <input
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        style={{ ...style, width }}
        {...inputProps}
      />
      <Placeholder
        content={content}
        onRender={setWidth}
        className={inputProps.className}
      />
    </>
  );
}
