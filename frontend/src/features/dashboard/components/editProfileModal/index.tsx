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
import { User, Mail, Lock } from 'lucide-react'
import { z } from 'zod'

const editProfileSchema = z.object({
    name: z.string().min(1, 'Imię i nazwisko jest wymagane'),
    email: z.string().email('Nieprawidłowy adres email'),
    password: z.string().optional(),
})

type EditProfileFormData = z.infer<typeof editProfileSchema>

interface EditProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
    const form = useForm<EditProfileFormData>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: EditProfileFormData) => {
        console.log("[v0] Editing profile:", data)
        form.reset()
        onOpenChange(false)
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
                                name="email"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput<EditProfileFormData>
                                                name="email"
                                                label="Adres email"
                                                placeholder="jan@example.com"
                                                icon={Mail}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput<EditProfileFormData>
                                                name="password"
                                                label="Nowe hasło (opcjonalne)"
                                                placeholder="••••••••"
                                                icon={Lock}
                                                type="password"
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