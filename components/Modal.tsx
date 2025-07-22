import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from './UI/dialog';
import { Button } from './UI/button';
import { DialogContent } from '@radix-ui/react-dialog';
// type TypeToValue = {
//     number: number;
//     string: string;
//     paragraph: string;
//     date: string;  // ISO string
//     checkbox: boolean;
// };

type ModalConfigType = {
    fields: {
        label: string,
        type: "number" | "date" | "string" | "checkbox" | "paragraph",
        rules?: {
            required?: boolean;
            validator?: () => boolean;
            message?: string;
        }[]
        placeholder?: string,
        name: string,
        col?: number,
        row?: number
    }[]
}

type ModalPropsType = {
    title: string,
    config: ModalConfigType,
    footer?: React.ReactElement,
    triggerLabel?: string
}


export default function Modal(props: ModalPropsType) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    {
                        props.triggerLabel ? props.triggerLabel : "Open Modal"
                    }
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl w-full p-6">
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                </DialogHeader>

                <form className="space-y-4">
                    {
                        props.config.fields.map((field, index) => {
                            const { label, type, name, placeholder } = field;
                            return (
                                <div key={index} className={`grid ${field.col ? `grid-cols-${field.col}` : 'grid-cols-1'} gap-2`}>
                                    <label className="text-sm font-medium text-gray-700">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        placeholder={placeholder}
                                        className="border rounded-md p-2"
                                    />
                                </div>
                            )
                        })
                    }
                </form>

                {props.footer && (
                    <div className="mt-4">
                        {props.footer}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
