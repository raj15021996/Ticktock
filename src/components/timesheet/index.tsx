"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import TimesheetCard from "@/components/timesheet/TimesheetCard";

import type {
  EntryFormData,
  TimesheetDay,
  TimesheetEntry,
  TimesheetWeekDetail,
} from "@/types";
import { useParams } from "next/navigation";
import Loading from "../ui/loading";
import { forError, forSuccess } from "@/utils/commonServices";
import {
  addTimesheetEntry,
  deleteTimesheetEntry,
  getTimesheet,
  updateTimesheetEntry,
} from "@/services/timesheet";

const AddEntryModal = dynamic(
  () => import("@/components/timesheet/AddEntryModal"),
);

interface ModalState {
  isOpen: boolean;
  dayDate: string | null;
  editingEntry: TimesheetEntry | null;
}

const INITIAL_MODAL_STATE: ModalState = {
  isOpen: false,
  dayDate: null,
  editingEntry: null,
};

function TimesheetContent() {
  const [timesheetData, setTimesheetData] = useState<TimesheetWeekDetail>();
  const [days, setDays] = useState<TimesheetDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState<ModalState>(INITIAL_MODAL_STATE);

  const params = useParams();
  const id = params.slug as string;

  useEffect(() => {
    const fetchTimesheetData = async () => {
      try {
        setIsLoading(true);
        const data = await getTimesheet(id);
        setTimesheetData(data);
      } catch (error) {
        forError("Failed to fetch timesheet data");
        console.error("Error fetching timesheet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimesheetData();
  }, [id]);

  const openAddModal = (dayDate: string) => {
    setModalState({
      isOpen: true,
      dayDate,
      editingEntry: null,
    });
  };

  const openEditModal = (dayDate: string, entry: TimesheetEntry) => {
    setModalState({
      isOpen: true,
      dayDate,
      editingEntry: entry,
    });
  };

  const closeModal = () => {
    setModalState(INITIAL_MODAL_STATE);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm("Delete this entry?")) {
      return;
    }

    try {
      const data = await deleteTimesheetEntry(id, entryId);

      setTimesheetData(data?.week);

      forSuccess("Entry deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);

      forError("Failed to delete entry. Please try again.");
    }
  };

  const handleSubmitEntry = async (data: EntryFormData) => {
    const { dayDate, editingEntry } = modalState;

    if (!dayDate) {
      return;
    }

    const isEditing = Boolean(editingEntry);

    try {
      setIsLoading(true);

      const result = isEditing
        ? await updateTimesheetEntry(id, editingEntry!.id, {
            project: data.project || "Project Name",
            typeOfWork: data.typeOfWork,
            description: data.description,
            hours: data.hours,
          })
        : await addTimesheetEntry(id, {
            dayFullDate: dayDate,
            project: data.project || "Project Name",
            typeOfWork: data.typeOfWork,
            description: data.description,
            hours: data.hours,
          });
        debugger
      setTimesheetData(result?.week);

      forSuccess(`Entry ${isEditing ? "updated" : "created"} successfully!`);

      closeModal();
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} entry:`,
        error,
      );

      forError(
        `Failed to ${isEditing ? "update" : "create"} entry. Please try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <TimesheetCard
            dateRangeLabel={timesheetData?.dateRangeLabel ?? ""}
            days={timesheetData?.days ?? []}
            onAddTask={openAddModal}
            onEditEntry={openEditModal}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>
      )}

      {modalState.isOpen && (
        <AddEntryModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onSubmit={handleSubmitEntry}
          initialEntry={modalState.editingEntry}
        />
      )}
    </>
  );
}

export default TimesheetContent;
