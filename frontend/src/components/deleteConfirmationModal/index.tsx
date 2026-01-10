import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    onConfirm: () => void
    isLoading?: boolean
}

export function DeleteConfirmationModal({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    isLoading = false,
}: DeleteConfirmationModalProps) {
    const handleConfirm = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        console.log("[DEBUG_LOG] DeleteConfirmationModal: handleConfirm called")
        onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="size-5" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">Ta akcja jest nieodwracalna. Czy na pewno chcesz kontynuować?</p>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Anuluj
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Usuwanie..." : "Usuń"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}