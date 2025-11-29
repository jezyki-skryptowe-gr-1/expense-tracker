import { ChartsSection } from "../../components/charts";
import { DashboardHeader } from "../../components/header";
import { SummaryCards } from "../../components/summaryCards";
import { TransactionsTable } from "../../components/table";
import { CategoriesListModal } from "../../components/categoriesListModal";
import { AddExpenseModal } from "../../components/addExpenseModal";
import { useState } from "react";

const MainDashboardView = () => {
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-6">
            <DashboardHeader onCategoriesClick={() => setCategoriesModalOpen(true)} onAddExpenseClick={() => setAddExpenseModalOpen(true)} />
            <SummaryCards />
            <ChartsSection />
            <TransactionsTable />
            <CategoriesListModal open={categoriesModalOpen} onOpenChange={setCategoriesModalOpen} />
            <AddExpenseModal open={addExpenseModalOpen} onOpenChange={setAddExpenseModalOpen} />
        </div>
    )
}

export default MainDashboardView;