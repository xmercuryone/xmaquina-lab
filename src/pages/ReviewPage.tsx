import ReviewHero from "../components/review/ReviewHero";
import ReviewArchitecture from "../components/review/ReviewArchitecture";
import ReviewModelBreakdown from "../components/review/ReviewModelBreakdown";
import ReviewMaterials from "../components/review/ReviewMaterials";
import ReviewLighting from "../components/review/ReviewLighting";
import ReviewInteraction from "../components/review/ReviewInteraction";
import ReviewPipeline from "../components/review/ReviewPipeline";
import ReviewHolographic from "../components/review/ReviewHolographic";

export default function ReviewPage() {
  return (
    <div className="flex-1 w-full">
      <ReviewHero />
      <ReviewArchitecture />
      <ReviewModelBreakdown />
      <ReviewMaterials />
      <ReviewLighting />
      <ReviewInteraction />
      <ReviewPipeline />
      <ReviewHolographic />
    </div>
  );
}
