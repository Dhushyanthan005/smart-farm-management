"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, AlertCircle, Loader2, Droplets, CheckCircle2 } from "lucide-react";
import { Cow } from "@/types/cow";
import { cowApi } from "@/lib/api/cow-api";
import { useCreateMilkRecord, useUpdateMilkRecord } from "../hooks/use-milk";
import { MilkRecord, MilkRecordStatus, MilkShift } from "@/types/milk";

const milkFormSchema = z.object({
  cowId: z.string().min(1, "Cow selection is required"),
  productionDate: z.string().min(1, "Production date is required"),
  shift: z.enum(["MORNING", "EVENING"] as const),
  quantityLiters: z.coerce
    .number()
    .min(0, "Milk yield must be 0 or greater")
    .max(100, "Single milking cannot exceed 100 L"),
  status: z.enum([
    "BULK",
    "APPROVED",
    "WASTE",
    "COLOSTRUM",
    "WITHHELD",
    "DISCARDED",
  ] as const),
  fatPercentage: z.coerce
    .number()
    .min(0, "Must be positive")
    .max(15, "Max 15%")
    .optional()
    .or(z.literal("")),
  proteinPercentage: z.coerce
    .number()
    .min(0, "Must be positive")
    .max(15, "Max 15%")
    .optional()
    .or(z.literal("")),
  somaticCellCount: z.coerce
    .number()
    .min(0, "Must be positive")
    .optional()
    .or(z.literal("")),
  conductivity: z.coerce
    .number()
    .min(0, "Must be positive")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
});

type MilkFormData = z.infer<typeof milkFormSchema>;

interface MilkEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: MilkRecord | null;
  defaultShift?: "MORNING" | "EVENING";
  defaultDate?: string;
  defaultCowId?: string;
}

export function MilkEntryModal({
  isOpen,
  onClose,
  recordToEdit,
  defaultShift = "MORNING",
  defaultDate,
  defaultCowId,
}: MilkEntryModalProps) {
  const isEdit = !!recordToEdit;
  const createMutation = useCreateMilkRecord();
  const updateMutation = useUpdateMilkRecord();
  const [cows, setCows] = useState<Cow[]>([]);
  const [cowsLoading, setCowsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const todayStr = defaultDate || new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MilkFormData>({
    resolver: zodResolver(milkFormSchema),
    defaultValues: {
      cowId: defaultCowId || "",
      productionDate: todayStr,
      shift: defaultShift,
      quantityLiters: 25.0,
      status: "BULK",
      fatPercentage: "" as unknown as number,
      proteinPercentage: "" as unknown as number,
      somaticCellCount: "" as unknown as number,
      conductivity: "" as unknown as number,
      notes: "",
    },
  });

  // Fetch active cows for dropdown
  useEffect(() => {
    if (isOpen) {
      setCowsLoading(true);
      cowApi
        .list({ lifecycleStatus: "ACTIVE", size: 100 })
        .then((res) => {
          if (res.data?.content) {
            setCows(res.data.content);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch cows for milk entry", err);
        })
        .finally(() => {
          setCowsLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      if (recordToEdit) {
        reset({
          cowId: recordToEdit.cowId,
          productionDate: recordToEdit.productionDate,
          shift: recordToEdit.shift,
          quantityLiters: recordToEdit.quantityLiters,
          status: recordToEdit.status,
          fatPercentage: (recordToEdit.fatPercentage ?? "") as unknown as number,
          proteinPercentage: (recordToEdit.proteinPercentage ?? "") as unknown as number,
          somaticCellCount: (recordToEdit.somaticCellCount ?? "") as unknown as number,
          conductivity: (recordToEdit.conductivity ?? "") as unknown as number,
          notes: recordToEdit.notes ?? "",
        });
      } else {
        reset({
          cowId: defaultCowId || "",
          productionDate: todayStr,
          shift: defaultShift,
          quantityLiters: 25.0,
          status: "BULK",
          fatPercentage: "" as unknown as number,
          proteinPercentage: "" as unknown as number,
          somaticCellCount: "" as unknown as number,
          conductivity: "" as unknown as number,
          notes: "",
        });
      }
    }
  }, [isOpen, recordToEdit, defaultShift, defaultDate, defaultCowId, reset, todayStr]);

  if (!isOpen) return null;

  const currentStatus = watch("status");

  const onSubmit = async (data: MilkFormData) => {
    setServerError(null);
    try {
      const selectedCow = cows.find((c) => c.id === data.cowId);
      if (isEdit && recordToEdit) {
        await updateMutation.mutateAsync({
          id: recordToEdit.id,
          data: {
            quantityLiters: data.quantityLiters,
            status: data.status,
            fatPercentage:
              data.fatPercentage !== "" && data.fatPercentage !== undefined
                ? Number(data.fatPercentage)
                : null,
            proteinPercentage:
              data.proteinPercentage !== "" && data.proteinPercentage !== undefined
                ? Number(data.proteinPercentage)
                : null,
            somaticCellCount:
              data.somaticCellCount !== "" && data.somaticCellCount !== undefined
                ? Number(data.somaticCellCount)
                : null,
            conductivity:
              data.conductivity !== "" && data.conductivity !== undefined
                ? Number(data.conductivity)
                : null,
            notes: data.notes || null,
          },
        });
      } else {
        await createMutation.mutateAsync({
          cowId: data.cowId,
          cowTagNumber: selectedCow?.tagNumber,
          productionDate: data.productionDate,
          shift: data.shift,
          quantityLiters: data.quantityLiters,
          status: data.status,
          fatPercentage:
            data.fatPercentage !== "" && data.fatPercentage !== undefined
              ? Number(data.fatPercentage)
              : null,
          proteinPercentage:
            data.proteinPercentage !== "" && data.proteinPercentage !== undefined
              ? Number(data.proteinPercentage)
              : null,
          somaticCellCount:
            data.somaticCellCount !== "" && data.somaticCellCount !== undefined
              ? Number(data.somaticCellCount)
              : null,
          conductivity:
            data.conductivity !== "" && data.conductivity !== undefined
              ? Number(data.conductivity)
              : null,
          notes: data.notes || null,
        });
      }
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string }).message ||
        "Failed to save milk production record. Please check the inputs.";
      setServerError(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F9F6] border-b border-[#E2E5DF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E3A2F] font-headline">
                {isEdit ? "Edit Milk Record" : "Record Milk Collection"}
              </h2>
              <p className="text-xs text-[#717973]">
                {isEdit
                  ? "Update yield volume, quality metrics, or disposition"
                  : "Log individual cow parlor harvest into PostgreSQL"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#717973] hover:text-[#1E3A2F] hover:bg-[#EAECE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cow Selection */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Cow (Tag Number &amp; Name) *
              </label>
              <select
                {...register("cowId")}
                disabled={isEdit || cowsLoading}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E5DF] text-xs text-[#1E3A2F] bg-white focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] outline-none disabled:bg-[#F8F9F6]"
              >
                <option value="">
                  {cowsLoading ? "Loading registered cows..." : "-- Select Active Cow --"}
                </option>
                {cows.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.tagNumber} {c.name ? `(${c.name})` : ""} — {c.breed} (Parity {c.parity})
                  </option>
                ))}
              </select>
              {errors.cowId && (
                <p className="text-[11px] text-red-600 mt-1">{errors.cowId.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Milking Date *
              </label>
              <input
                type="date"
                {...register("productionDate")}
                disabled={isEdit}
                max={new Date().toISOString().split("T")[0]}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E5DF] text-xs text-[#1E3A2F] bg-white focus:border-[#1E3A2F] outline-none disabled:bg-[#F8F9F6]"
              />
              {errors.productionDate && (
                <p className="text-[11px] text-red-600 mt-1">{errors.productionDate.message}</p>
              )}
            </div>

            {/* Shift */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Shift *
              </label>
              <select
                {...register("shift")}
                disabled={isEdit}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E5DF] text-xs text-[#1E3A2F] bg-white focus:border-[#1E3A2F] outline-none disabled:bg-[#F8F9F6]"
              >
                <option value="MORNING">Morning Shift (AM)</option>
                <option value="EVENING">Evening Shift (PM)</option>
              </select>
              {errors.shift && (
                <p className="text-[11px] text-red-600 mt-1">{errors.shift.message}</p>
              )}
            </div>

            {/* Yield Liters */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Milk Yield (Liters) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register("quantityLiters")}
                className="w-full h-10 px-3 font-mono font-semibold rounded-lg border border-[#E2E5DF] text-xs text-[#1E3A2F] bg-white focus:border-[#1E3A2F] outline-none"
              />
              {errors.quantityLiters && (
                <p className="text-[11px] text-red-600 mt-1">{errors.quantityLiters.message}</p>
              )}
            </div>

            {/* Disposition / Status */}
            <div>
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Milk Disposition / Status *
              </label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E5DF] text-xs font-semibold text-[#1E3A2F] bg-white focus:border-[#1E3A2F] outline-none"
              >
                <option value="BULK">Bulk Approved (Normal Saleable)</option>
                <option value="APPROVED">Approved for Processing</option>
                <option value="COLOSTRUM">Store as Colostrum (Calves)</option>
                <option value="WASTE">Dump to Waste (Antibiotics/Rx)</option>
                <option value="WITHHELD">Withheld (Quality Pending)</option>
                <option value="DISCARDED">Discarded / Spoiled</option>
              </select>
              {currentStatus === "WASTE" && (
                <p className="text-[10px] text-red-600 font-semibold mt-1">
                  ⚠️ Milk will be excluded from bulk sale and flagged in audit log.
                </p>
              )}
              {currentStatus === "COLOSTRUM" && (
                <p className="text-[10px] text-amber-700 font-semibold mt-1">
                  🍼 Stored separately for calf feeding. Excluded from bulk tank.
                </p>
              )}
            </div>

            {/* Inline Milk Quality Metrics (Optional) */}
            <div className="sm:col-span-2 pt-2 border-t border-[#E2E5DF]">
              <span className="text-xs font-bold text-[#1E3A2F] block mb-2">
                Parlor inline quality telemetry (optional)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-[#717973] mb-1">Butterfat %</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.9"
                    {...register("fatPercentage")}
                    className="w-full h-8 px-2 font-mono rounded border border-[#E2E5DF] text-xs bg-white focus:border-[#1E3A2F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#717973] mb-1">Protein %</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.4"
                    {...register("proteinPercentage")}
                    className="w-full h-8 px-2 font-mono rounded border border-[#E2E5DF] text-xs bg-white focus:border-[#1E3A2F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#717973] mb-1">SCC (cells/mL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120000"
                    {...register("somaticCellCount")}
                    className="w-full h-8 px-2 font-mono rounded border border-[#E2E5DF] text-xs bg-white focus:border-[#1E3A2F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#717973] mb-1">Cond. (mS/cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.1"
                    {...register("conductivity")}
                    className="w-full h-8 px-2 font-mono rounded border border-[#E2E5DF] text-xs bg-white focus:border-[#1E3A2F] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1E3A2F] mb-1">
                Operator Notes / Observations
              </label>
              <textarea
                rows={2}
                {...register("notes")}
                placeholder="E.g., Clean complete milkout, quarter 3 checked, normal flow."
                className="w-full p-2.5 rounded-lg border border-[#E2E5DF] text-xs text-[#1E3A2F] bg-white focus:border-[#1E3A2F] outline-none"
              />
              {errors.notes && (
                <p className="text-[11px] text-red-600 mt-1">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E2E5DF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E2E5DF] text-xs font-semibold text-[#717973] hover:bg-[#F8F9F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="px-5 py-2 rounded-lg bg-[#1E3A2F] text-white text-xs font-semibold hover:bg-[#1b4332] shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{isEdit ? "Save Changes" : "Record Entry"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
