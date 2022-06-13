/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { PropsWithChildren, useEffect } from "react";
import Style from "@styles/components/common/Modal.module.scss";
import { disableScrolling } from "@common/utils";

interface ModalProps {
  backdrop?: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  backdrop = true,
  onClose,
}: PropsWithChildren<ModalProps>) {
  useEffect(disableScrolling, []);
  return (
    <div className={Style.outterWrapper} onClick={onClose}>
      <div className={Style.innerWrapper}>
        {backdrop && <div className={Style.backdrop} />}
        <div className={Style.content} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}
