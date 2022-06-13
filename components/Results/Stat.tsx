import Style from "@styles/components/Results/Stat.module.scss";

interface StatProps {
  top: string;
  bottom: string;
}

export default function Stat({ top, bottom }: StatProps) {
  return (
    <div className={Style.wrapper}>
      <p className={Style.top}>{top}</p>
      <p className={Style.bottom}>{bottom}</p>
    </div>
  );
}
