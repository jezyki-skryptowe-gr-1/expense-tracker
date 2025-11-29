import { ChartsSection } from "../../components/charts";
import { DashboardHeader } from "../../components/header";
import { SummaryCards } from "../../components/summaryCards";
import { TransactionsTable } from "../../components/table";

const MainDashboardView = () => {
    return (
        <div className="min-h-screen p-4 md:p-8 space-y-6">
            <DashboardHeader />
            <SummaryCards />
            <ChartsSection />
            <TransactionsTable />
        </div>
    )
}

export default MainDashboardView;