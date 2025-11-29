import { type HTMLInputTypeAttribute } from 'react';
import { type Path, useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { LucideIcon } from 'lucide-react';

type Props<T> = {
    name: Path<T>;
    label?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    description?: string;
    disabled?: boolean;
    icon?: LucideIcon;
    step?: string;
}

const InputField = <T,>({
    name,
    label,
    placeholder,
    description,
    disabled,
    type = 'text',
    icon: Icon,
    step
}: Props<T>) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='w-full'>
                    {label && <Label htmlFor={name} className='mb-1 font-semibold'>{label}</Label>}
                    <FormControl>
                        <div className="relative">
                            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />}
                            <Input
                                {...field}
                                id={name}
                                placeholder={placeholder}
                                type={type}
                                disabled={disabled}
                                step={step}
                                className={`pl-10 h-11 border-border/50 focus-visible:ring-primary`}
                            />
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default InputField