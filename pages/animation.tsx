import LoadingAnimWithBar from "@components/common/LoadingAnimWithBar";

export default function Animation() {
  return (
    <div className="animation">
      <LoadingAnimWithBar scale={3} />
      <style jsx>{`
        .animation {
          margin-top: 200px;
        }
      `}</style>
    </div>
  );
}
