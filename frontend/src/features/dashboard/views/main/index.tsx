// import { ChartsSection } from "../../components/charts";
import { DashboardHeader } from "../../components/header";
import { SummaryCards } from "../../components/summaryCards";
import { TransactionsTable } from "../../components/table";
import { lazy, Suspense, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useLogoutMutation } from "@/features/auth/query";

const CategoriesListModal = lazy(() => import("../../components/categoriesListModal").then(module => ({ default: module.CategoriesListModal })));
const AddExpenseModal = lazy(() => import("../../components/addExpenseModal").then(module => ({ default: module.AddExpenseModal })));
const EditProfileModal = lazy(() => import("../../components/editProfileModal").then(module => ({ default: module.EditProfileModal })));

const MainDashboardView = () => {
    const router = useRouter()
    const { mutate: logout } = useLogoutMutation();
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

    const handleEditProfile = () => {
        setEditProfileModalOpen(true)
    }

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                router.navigate({ to: "/", viewTransition: true })
            }
        })
    }

    return (
        <div className="min-h-screen px-4 pb-4 md:pb-4 md:px-8 space-y-6">
            <DashboardHeader onCategoriesClick={() => setCategoriesModalOpen(true)} onAddExpenseClick={() => setAddExpenseModalOpen(true)} onEditProfile={handleEditProfile} onLogout={handleLogout} />
            <SummaryCards />
            {/*<ChartsSection />*/}
            <TransactionsTable />
            <Suspense fallback={<div className="flex justify-center items-center h-full">Ładowanie...</div>}>
                <CategoriesListModal open={categoriesModalOpen} onOpenChange={setCategoriesModalOpen} />
                <AddExpenseModal open={addExpenseModalOpen} onOpenChange={setAddExpenseModalOpen} />
                <EditProfileModal open={editProfileModalOpen} onOpenChange={setEditProfileModalOpen} />
            </Suspense>
        </div>
    )
}

export default MainDashboardView;