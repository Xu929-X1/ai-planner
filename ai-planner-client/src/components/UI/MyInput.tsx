import React from 'react';
import { Input } from './input';
import { cn } from '@lib/utils';
interface MyInputProps extends React.ComponentProps<typeof Input> {
    label?: string;
    error?: string;
}

export default function MyInput({ label, error, className, ...props }: MyInputProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</label>}
            <Input {...props} className={cn(className, "text-lg p-4")} />
            {error && <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>}
        </div>
    );
}
