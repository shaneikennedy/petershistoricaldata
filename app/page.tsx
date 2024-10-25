import { PeterHistoricalDataComponent } from "@/components/peter-historical-data";
import { fetchData } from "./data";

export default function Home() {
  return <PeterHistoricalDataComponent fetchData={fetchData} />;
}
