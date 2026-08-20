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

  const isEditing = Boolean(initialEntry);

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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-modal-title"
        className="w-full max-w-[646px] overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
          <h2
            id="add-entry-modal-title"
            className="text-base font-semibold text-gray-900"
          >
            {isEditing ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 px-4 py-5 sm:px-6"
        >
          {/* Project */}
          <div className="flex w-full flex-col gap-2 sm:w-[364px]">
            <Select
              id="project"
              label="Select Project *"
              showInfoIcon
              options={PROJECT_OPTIONS}
              value={form.project}
              error={errors.project}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  project: event.target.value,
                }))
              }
            />
          </div>

          {/* Type of Work */}
          <div className="flex w-full flex-col gap-2 sm:w-[364px]">
            <Select
              id="typeOfWork"
              label="Type of Work *"
              showInfoIcon
              options={TYPE_OF_WORK_OPTIONS}
              value={form.typeOfWork}
              error={errors.typeOfWork}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  typeOfWork: event.target.value,
                }))
              }
            />
          </div>

          {/* Description */}
          <div className="flex w-full flex-col gap-2 sm:w-[494px]">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Task description *
            </label>

            <textarea
              id="description"
              placeholder="Write text here ..."
              value={form.description}
              rows={6}
              aria-invalid={Boolean(errors.description)}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className={`h-[218px] w-full resize-none rounded-lg border ${errors.description
                  ? "border-red-400"
                  : "border-gray-300"
                } px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
            />

            <p className="text-xs text-gray-400">
              A note for extra info
            </p>

            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-900">
              Hours *

              <Info
                className="h-3.5 w-3.5 text-gray-400"
                aria-hidden="true"
              />
            </label>

            <div className="flex h-9 w-fit overflow-hidden rounded-md border border-gray-300 bg-white">
              {/* Decrease */}
              <button
                type="button"
                aria-label="Decrease hours"
                onClick={() => handleHoursChange(-1)}
                className="flex w-8 items-center justify-center border-r border-gray-300 bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <Minus
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>

              {/* Hours */}
              <input
                type="text"
                aria-label="Hours"
                value={form.hours}
                min={1}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    hours: Math.max(
                      1,
                      Number(event.target.value) || 1,
                    ),
                  }))
                }
                className="w-10 border-0 bg-white p-0 text-center text-xs text-gray-600 outline-none focus:ring-0"
              />

              {/* Increase */}
              <button
                type="button"
                aria-label="Increase hours"
                onClick={() => handleHoursChange(1)}
                className="flex w-8 items-center justify-center border-l border-gray-300 bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              >
                <Plus
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {errors.hours && (
              <p className="text-xs text-red-500">
                {errors.hours}
              </p>
            )}
          </div>

          {/* Actions */}
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
