import HoloCard from "../components/HoloCard";

export default function CratePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-8">
      <h1 className="text-[48px] font-normal leading-[1.1] tracking-tight text-white">
        XMAQUINA CRATES
      </h1>
      <HoloCard img="/img/card-rare.png" alt="Rare Card" width={330} />
    </div>
  );
}
