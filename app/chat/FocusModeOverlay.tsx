import React from 'react'
import { Circle, CheckCircle2, Keyboard, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/UI/button'
import { Textarea } from '@/components/UI/textarea'
import { Task } from './page';
type FocusModeOverlayProps = {
    focusTitle: string,
    setFocusTitle: React.Dispatch<React.SetStateAction<string>>,
    focusTasks: Task[],
    setFocusTasks: React.Dispatch<React.SetStateAction<Task[]>>,
    editMode: boolean,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
    setFocusMode: React.Dispatch<React.SetStateAction<boolean>>,
    saveAdjustments: () => void,
    updateTaskStatus: (taskId: string) => void,
    renameTask: (taskId: string, newDesc: string) => void,
}
export default function FocusModeOverlay(props: FocusModeOverlayProps) {
    const { focusTitle, setFocusTitle, focusTasks, renameTask, editMode, setEditMode, setFocusMode, saveAdjustments, updateTaskStatus } = props;
    return (
        <div className="absolute inset-0 z-50 bg-[#18181b]/95 backdrop-blur-sm text-gray-100">
            <div className="h-full w-full flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#23232a]/90">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Keyboard className="w-4 h-4" />
                        <span>Press <kbd className="px-1 border border-gray-700 rounded">Esc</kbd> to exit • <kbd className="px-1 border border-gray-700 rounded">F</kbd> to toggle</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {editMode ? (
                            <Button size="sm" onClick={saveAdjustments} className="gap-1 bg-gray-700 text-gray-100 hover:bg-gray-600">
                                <Save className="w-4 h-4" /> Save
                            </Button>
                        ) : (
                            <Button size="sm" variant="secondary" onClick={() => setEditMode(true)} className="gap-1 bg-gray-800 text-gray-100 hover:bg-gray-700">
                                <Pencil className="w-4 h-4" /> Adjust
                            </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setFocusMode(false)} className="text-gray-400">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Focus content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                    {/* Left: Title + Notes */}
                    <div className="lg:col-span-1 flex flex-col gap-3">
                        <div className="rounded-2xl border border-gray-800 p-4 shadow-sm bg-[#23232a]/90">
                            {editMode ? (
                                <Textarea
                                    value={focusTitle}
                                    onChange={(e) => setFocusTitle(e.target.value)}
                                    className="min-h-24 text-base bg-[#23232a] text-gray-100 border border-gray-700"
                                />
                            ) : (
                                <h2 className="text-xl font-semibold leading-snug">{focusTitle}</h2>
                            )}
                        </div>
                        <div className="rounded-2xl border border-gray-800 p-4 shadow-sm bg-[#23232a]/90">
                            <h3 className="text-sm font-medium mb-2 text-gray-300">Notes</h3>
                            <Textarea placeholder="Jot down constraints, blockers, or ideas..." className="min-h-40 bg-[#23232a] text-gray-100 border border-gray-700" />
                        </div>
                    </div>

                    {/* Right: Task board */}
                    <div className="lg:col-span-2 rounded-2xl border border-gray-800 p-4 shadow-sm bg-[#23232a]/90">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-300">Tasks</h3>
                            <div className="text-xs text-gray-400">Click status dot to cycle • Edit descriptions in Adjust mode</div>
                        </div>
                        <ul className="space-y-2">
                            {focusTasks.map((t) => (
                                <li key={t.id} className="flex items-start gap-3 rounded-xl border border-gray-700 p-3 bg-[#23232a]">
                                    <button
                                        onClick={() => updateTaskStatus(t.id.toString())}
                                        className="mt-1 w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900"
                                        title="Toggle status"
                                    >
                                        {t.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <div className="flex-1">
                                        {editMode ? (
                                            <input
                                                className="w-full bg-transparent outline-none text-gray-100"
                                                value={t.description}
                                                onChange={(e) => renameTask(t.id.toString(), e.target.value)}
                                            />
                                        ) : (
                                            <p className="leading-relaxed">{t.description}</p>
                                        )}
                                        {t.dueDate && (
                                            <p className="text-xs text-gray-400 mt-1">Due: {new Date(t.dueDate).toLocaleString()}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] px-2 py-1 rounded-full border ${t.status === "COMPLETED"
                                            ? "bg-green-900 text-green-300 border-green-700"
                                            : t.status === "IN_PROGRESS"
                                                ? "bg-yellow-900 text-yellow-300 border-yellow-700"
                                                : t.status === "PENDING"
                                                    ? "bg-red-900 text-red-300 border-red-700"
                                                    : "bg-gray-900 text-gray-300 border-gray-700"
                                            }`}
                                    >
                                        {t.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
