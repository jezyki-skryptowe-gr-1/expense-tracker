"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import FormInput from '@/components/formInput'
import { User, DollarSign } from 'lucide-react'
import { z } from 'zod'
import { useUserQuery } from '@/features/auth/query'
import { useUpdateUserMutation } from '../../query'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const editProfileSchema = z.object({
    name: z.string().min(1, 'Imię i nazwisko jest wymagane'),
    budget: z.string().min(1, 'Budżet jest wymagany').refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Budżet musi być liczbą większą lub równą zero',
    }),
})

type EditProfileFormData = z.infer<typeof editProfileSchema>

interface EditProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
    const { data: user } = useUserQuery()
    const updateUserMutation = useUpdateUserMutation()

    const form = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: '',
            budget: '0'
        }
    })

    useEffect(() => {
        if (user && open) {
            form.reset({
                name: typeof user === 'string' ? user : user.login || '',
                budget: '0' // we don't have budget in user query yet
            })
        }
    }, [user, open, form])

    const onSubmit = (data: EditProfileFormData) => {
        updateUserMutation.mutate(Number(data.budget), {
            onSuccess: () => {
                toast.success('Profil został zaktualizowany')
                onOpenChange(false)
            },
            onError: () => {
                toast.error('Błąd podczas aktualizacji profilu')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="size-5" />
                        Edytuj Profil
                    </DialogTitle>
                    <DialogDescription>Zaktualizuj swoje dane profilowe</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput<EditProfileFormData>
                                                name="name"
                                                label="Imię i nazwisko"
                                                placeholder="Jan Kowalski"
                                                icon={User}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="budget"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput<EditProfileFormData>
                                                name="budget"
                                                label="Miesięczny budżet (PLN)"
                                                placeholder="0.00"
                                                icon={DollarSign}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Zapisz zmiany
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}