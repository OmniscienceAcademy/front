import Style from "@styles/components/Results/EstimationBar.module.scss";

interface EstimationBarProps {
  estimation: number;
}

export default function EstimationBar({ estimation }: EstimationBarProps) {
  return (
    <div className={Style.wrapper}>
      {/* remove 10% to let room for the estimation text */}
      <div style={{ width: `${0.9 * estimation}%` }} />
      <p>{`${estimation} %`}</p>
    </div>
  );
}
