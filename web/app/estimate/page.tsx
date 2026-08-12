import EstimateClient from "./EstimateClient";

export const metadata = {
  title: "Estimate | Aurex Logistics",
  description: "Get an indicative shipping estimate for road, air, sea, or vehicle transport.",
};

export default function EstimatePage() {
  return <EstimateClient />;
}
