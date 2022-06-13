import Style from "@styles/components/common/LoadingAnimation.module.scss";

interface LoadingAnimProps {
  scale?: number;
}

export default function LoadingAnim({ scale = 2 }: LoadingAnimProps) {
  return (
    <div style={{ transform: `scale(${scale})` }}>
      <div className={Style.cube}>
        <div className={Style.side} />
        <div className={Style.side} />
        <div className={Style.side} />
        <div className={Style.side} />
        <div className={Style.side} />
        <div className={Style.side} />
      </div>
    </div>
  );
}
