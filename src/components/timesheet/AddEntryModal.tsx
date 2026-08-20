"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, Info } from "lucide-react";
import { EntryFormData, TimesheetEntry } from "@/types";
import { PROJECT_OPTIONS, TYPE_OF_WORK_OPTIONS } from "@/utils/constant";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EntryFormData) => void;
  initialEntry?: TimesheetEntry | null;
}

const emptyForm: EntryFormData = {
  project: "",
  typeOfWork: TYPE_OF_WORK_OPTIONS[0].value,
  description: "",
  hours: 1,
};

export default function AddEntryModal({
  isOpen,
  onClose,
  onSubmit,
  initialEntry,
}: AddEntryModalProps) {
  if (!isOpen) return null;

  return (
    <AddEntryModalContent
      key={initialEntry?.id ?? "new"}
      onClose={onClose}
      onSubmit={onSubmit}
      initialEntry={initialEntry}
    />
  );
}

interface AddEntryModalContentProps {
  onClose: () => void;
  onSubmit: (data: EntryFormData) => void;
  initialEntry?: TimesheetEntry | null;
}

function AddEntryModalContent({
  onClose,
  onSubmit,
  initialEntry,
}: AddEntryModalContentProps) {
  // Derive the initial form state directly from props (no effect needed),
  // since this component remounts (via `key`) whenever the modal reopens
  // or the entry being edited changes.
  const [form, setForm] = useState<EntryFormData>(() =>
    initialEntry
      ? {
          project: initialEntry.project,
          typeOfWork: initialEntry.typeOfWork,
          description: initialEntry.description,
          hours: initialEntry.hours,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof EntryFormData, string>>
  >({});
  const isEditing = !!initialEntry;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleHoursChange = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      hours: Math.max(1, prev.hours + delta),
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof EntryFormData, string>> = {};
    if (!form.project) newErrors.project = "Please select a project";
    if (!form.typeOfWork) newErrors.typeOfWork = "Please select a type of work";
    if (!form.description.trim())
      newErrors.description = "Task description is required";
    if (!form.hours || form.hours < 1)
      newErrors.hours = "Hours must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B5563] p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-modal-title"
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        style={{ width: "calc(100% - 0px)", maxWidth: "646px" }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="add-entry-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            Add New Entry
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <div className="w-sm flex flex-col gap-2">
            <Select
              id="project"
              label="Select Project *"
              showInfoIcon
              options={PROJECT_OPTIONS}
              value={form.project}
              error={errors.project}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, project: e.target.value }))
              }
            />

            <Select
              id="typeOfWork"
              label="Type of Work *"
              showInfoIcon
              options={TYPE_OF_WORK_OPTIONS}
              value={form.typeOfWork}
              error={errors.typeOfWork}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, typeOfWork: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Task description *
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Write text here ..."
              value={form.description}
              aria-invalid={!!errors.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`w-lg resize-none rounded-lg border ${
                errors.description ? "border-red-400" : "border-gray-300"
              } px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500`}
            />
            <p className="text-xs text-gray-400">A note for extra info</p>
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-900">
              Hours *
              <Info className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
            </label>
            <div className="flex h-9 w-fit overflow-hidden rounded-md border border-gray-300 bg-white">
              {/* Decrease */}
              <button
                type="button"
                aria-label="Decrease hours"
                onClick={() => handleHoursChange(-1)}
                className="flex w-8 items-center justify-center border-r border-gray-300 text-sm text-gray-600 transition-colors bg-gray-100 hover:bg-gray-150"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {/* Hours */}
              <input
                type="text"
                aria-label="Hours"
                value={form.hours}
                min={1}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    hours: Math.max(1, Number(e.target.value) || 1),
                  }))
                }
                className="w-10 appearance-none border-0 bg-white p-0 text-center text-xs text-gray-600 outline-none focus:ring-0"
              />

              {/* Increase */}
              <button
                type="button"
                aria-label="Increase hours"
                onClick={() => handleHoursChange(1)}
                className="flex w-8 items-center justify-center border-l border-gray-300 text-sm text-gray-600 transition-colors bg-gray-100 hover:bg-gray-150"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            {errors.hours && (
              <p className="text-xs text-red-500">{errors.hours}</p>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:flex-1"
            >
              {isEditing ? "Update entry" : "Add entry"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full sm:flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
