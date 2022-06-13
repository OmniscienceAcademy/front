import CardStyle from "@styles/components/Home/Card.module.scss";
import { PropsWithChildren } from "react";

export interface CardProps {
  top?: boolean;
  number: number;
}

export default function Card({
  number,
  top,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <div
      className={`${CardStyle.wrapper} ${
        top ? CardStyle.top : CardStyle.bottom
      }`}
    >
      {children}
      <p className={CardStyle.number}>{number}</p>
    </div>
  );
}
