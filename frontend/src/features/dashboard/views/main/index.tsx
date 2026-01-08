// import { ChartsSection } from "../../components/charts";
import { DashboardHeader } from "../../components/header";
import { SummaryCards } from "../../components/summaryCards";
import { TransactionsTable } from "../../components/table";
import { lazy, Suspense, useState } from "react";
import { useRouter } from "@tanstack/react-router";

const CategoriesListModal = lazy(() => import("../../components/categoriesListModal").then(module => ({ default: module.CategoriesListModal })));
const AddExpenseModal = lazy(() => import("../../components/addExpenseModal").then(module => ({ default: module.AddExpenseModal })));
const EditProfileModal = lazy(() => import("../../components/editProfileModal").then(module => ({ default: module.EditProfileModal })));

const MainDashboardView = () => {
    const router = useRouter()
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

    const handleEditProfile = () => {
        setEditProfileModalOpen(true)
    }

    const handleLogout = () => {
        router.navigate({ to: "/", viewTransition: true })
    }

    return (
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-24 space-y-6">
            <DashboardHeader onCategoriesClick={() => setCategoriesModalOpen(true)} onAddExpenseClick={() => setAddExpenseModalOpen(true)} onEditProfile={handleEditProfile} onLogout={handleLogout} />
            <SummaryCards />
            {/*<ChartsSection />*/}
            <TransactionsTable />
            <Suspense fallback={<div>Loading...</div>}>
                <CategoriesListModal open={categoriesModalOpen} onOpenChange={setCategoriesModalOpen} />
                <AddExpenseModal open={addExpenseModalOpen} onOpenChange={setAddExpenseModalOpen} />
                <EditProfileModal open={editProfileModalOpen} onOpenChange={setEditProfileModalOpen} />
            </Suspense>
        </div>
    )
}

export default MainDashboardView;