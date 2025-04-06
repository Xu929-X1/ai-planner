import React from 'react';
import { Input } from '../../../components/ui/input';

interface MyInputProps extends React.ComponentProps<typeof Input> {
    label?: string;
    error?: string;
}

export default function MyInput({ label, error, ...props }: MyInputProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem' }}>{label}</label>}
            <Input {...props} />
            {error && <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>}
        </div>
    );
}
