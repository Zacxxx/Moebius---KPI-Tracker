import React from 'react';
import { CheckIcon } from '../Icons';

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange }) => {
    return (
        <div className="flex items-center">
            <button
                id={id}
                role="checkbox"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors
                    ${checked ? 'bg-violet-600 border-violet-600' : 'bg-zinc-800 border-zinc-600 hover:border-violet-500'}
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                `}
            >
                {checked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
            </button>
            <label htmlFor={id} className="ml-3 text-sm text-zinc-200 cursor-pointer">
                {label}
            </label>
        </div>
    );
};
