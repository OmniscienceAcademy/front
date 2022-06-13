import { handleEnterKeyDown } from "@common/utils";
import Style from "@styles/components/common/Buttons.module.scss";

export interface ButtonProps {
  name: string;
  onClick: () => void;
  isActive?: boolean;
}

interface ButtonsProps {
  buttons: ButtonProps[];
  title?: string;
  icon?: JSX.Element;
}

export default function Buttons({ buttons, title, icon }: ButtonsProps) {
  return (
    <div className={Style.wrapper}>
      <div className={Style.title}>
        <p>
          {title}
          <span>{icon}</span>
        </p>
      </div>
      <div className={Style.buttons}>
        {buttons.map((button) => (
          <div
            key={button.name}
            className={`${button.isActive && Style.active} btn`}
            onClick={button.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleEnterKeyDown(button.onClick)}
          >
            {button.name}
          </div>
        ))}
      </div>
    </div>
  );
}
