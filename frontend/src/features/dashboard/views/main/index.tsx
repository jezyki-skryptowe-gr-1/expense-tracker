import { ChartsSection } from "../../components/charts";
import { DashboardHeader } from "../../components/header";
import { SummaryCards } from "../../components/summaryCards";
import { TransactionsTable } from "../../components/table";
import { lazy, Suspense, useState } from "react";

const CategoriesListModal = lazy(() => import("../../components/categoriesListModal").then(module => ({ default: module.CategoriesListModal })));
const AddExpenseModal = lazy(() => import("../../components/addExpenseModal").then(module => ({ default: module.AddExpenseModal })));

const MainDashboardView = () => {
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-6">
            <DashboardHeader onCategoriesClick={() => setCategoriesModalOpen(true)} onAddExpenseClick={() => setAddExpenseModalOpen(true)} />
            <SummaryCards />
            <ChartsSection />
            <TransactionsTable />
            <Suspense fallback={<div>Loading...</div>}>
                <CategoriesListModal open={categoriesModalOpen} onOpenChange={setCategoriesModalOpen} />
                <AddExpenseModal open={addExpenseModalOpen} onOpenChange={setAddExpenseModalOpen} />
            </Suspense>
        </div>
    )
}

export default MainDashboardView;