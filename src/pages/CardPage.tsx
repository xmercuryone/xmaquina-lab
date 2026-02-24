import SorareCard3D from "../components/SorareCard3D";

export default function CardPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-8">
      <h1 className="text-[48px] font-normal leading-[1.1] tracking-tight text-white">
        CARD VIEWER
      </h1>
      <SorareCard3D width={340} height={550} />
    </div>
  );
}
