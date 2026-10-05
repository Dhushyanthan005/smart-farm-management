"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { Cow, Breed, CowGender, HealthStatus, LifecycleStatus, CowSource } from "@/types/cow";
import { useCreateCow, useUpdateCow } from "../hooks/use-cows";

const cowFormSchema = z
  .object({
    tagNumber: z
      .string()
      .min(2, "Tag number must be at least 2 characters")
      .max(30, "Tag number cannot exceed 30 characters"),
    rfid: z.string().max(50, "RFID cannot exceed 50 characters").optional().or(z.literal("")),
    name: z.string().max(50, "Name cannot exceed 50 characters").optional().or(z.literal("")),
    breed: z.enum([
      "HOLSTEIN_FRIESIAN",
      "HOLSTEIN",
      "JERSEY",
      "GUERNSEY",
      "AYRSHIRE",
      "BROWN_SWISS",
      "SIMMENTAL",
      "OTHER",
    ]),
    gender: z.enum(["FEMALE", "MALE"]),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    parity: z.coerce.number().min(0, "Parity cannot be negative").default(0),
    healthStatus: z.enum([
      "HEALTHY",
      "UNDER_TREATMENT",
      "PREGNANT",
      "QUARANTINED",
      "RECOVERING",
    ]),
    lifecycleStatus: z.enum(["ACTIVE", "SOLD", "DECEASED", "TRANSFERRED"]),
    source: z.enum(["BORN", "PURCHASED", "BOUGHT"]),
    barn: z.string().max(50).optional().or(z.literal("")),
    pen: z.string().max(50).optional().or(z.literal("")),
    expectedMilkCapacity: z.coerce.number().min(0).optional().or(z.literal("")),
    currentMilkStatus: z.string().max(30).optional().or(z.literal("")),
    acquisitionDate: z.string().optional().or(z.literal("")),
    acquisitionPlace: z.string().max(100).optional().or(z.literal("")),
    notes: z.string().max(1000).optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.dateOfBirth) {
        const dob = new Date(data.dateOfBirth);
        return dob <= new Date();
      }
      return true;
    },
    {
      message: "Date of birth cannot be in the future",
      path: ["dateOfBirth"],
    }
  );

type CowFormData = z.infer<typeof cowFormSchema>;

interface CowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cowToEdit?: Cow | null;
}

export function CowFormModal({ isOpen, onClose, cowToEdit }: CowFormModalProps) {
  const isEdit = !!cowToEdit;
  const createMutation = useCreateCow();
  const updateMutation = useUpdateCow();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CowFormData>({
    resolver: zodResolver(cowFormSchema),
    defaultValues: {
      tagNumber: "",
      rfid: "",
      name: "",
      breed: "HOLSTEIN_FRIESIAN",
      gender: "FEMALE",
      dateOfBirth: new Date().toISOString().split("T")[0],
      parity: 0,
      healthStatus: "HEALTHY",
      lifecycleStatus: "ACTIVE",
      source: "BORN",
      barn: "Barn A",
      pen: "Pen 01",
      expectedMilkCapacity: 30,
      currentMilkStatus: "Mid",
      acquisitionDate: "",
      acquisitionPlace: "",
      notes: "",
    },
  });

  const selectedGender = watch("gender");
  const selectedSource = watch("source");

  // Keep parity at 0 when Male
  useEffect(() => {
    if (selectedGender === "MALE") {
      setValue("parity", 0);
    }
  }, [selectedGender, setValue]);

  // Load existing cow values if editing
  useEffect(() => {
    if (isOpen) {
      setServerError(null);
      if (cowToEdit) {
        reset({
          tagNumber: cowToEdit.tagNumber,
          rfid: cowToEdit.rfid || "",
          name: cowToEdit.name || "",
          breed: cowToEdit.breed,
          gender: cowToEdit.gender,
          dateOfBirth: cowToEdit.dateOfBirth,
          parity: cowToEdit.parity,
          healthStatus: cowToEdit.healthStatus,
          lifecycleStatus: cowToEdit.lifecycleStatus,
          source: cowToEdit.source,
          barn: cowToEdit.barn || "",
          pen: cowToEdit.pen || "",
          expectedMilkCapacity: cowToEdit.expectedMilkCapacity ?? "",
          currentMilkStatus: cowToEdit.currentMilkStatus || "",
          acquisitionDate: cowToEdit.acquisitionDate || "",
          acquisitionPlace: cowToEdit.acquisitionPlace || "",
          notes: cowToEdit.notes || "",
        });
      } else {
        reset({
          tagNumber: "",
          rfid: "",
          name: "",
          breed: "HOLSTEIN_FRIESIAN",
          gender: "FEMALE",
          dateOfBirth: new Date().toISOString().split("T")[0],
          parity: 0,
          healthStatus: "HEALTHY",
          lifecycleStatus: "ACTIVE",
          source: "BORN",
          barn: "Barn A",
          pen: "Pen 01",
          expectedMilkCapacity: 30,
          currentMilkStatus: "Mid",
          acquisitionDate: "",
          acquisitionPlace: "",
          notes: "",
        });
      }
    }
  }, [isOpen, cowToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CowFormData) => {
    setServerError(null);
    try {
      const payload = {
        ...data,
        tagNumber: data.tagNumber.trim().toUpperCase(),
        rfid: data.rfid?.trim() || null,
        name: data.name?.trim() || null,
        barn: data.barn?.trim() || null,
        pen: data.pen?.trim() || null,
        expectedMilkCapacity:
          data.expectedMilkCapacity === "" || data.expectedMilkCapacity === undefined
            ? null
            : Number(data.expectedMilkCapacity),
        currentMilkStatus: data.currentMilkStatus?.trim() || null,
        acquisitionDate: data.acquisitionDate?.trim() || null,
        acquisitionPlace: data.acquisitionPlace?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      if (isEdit && cowToEdit) {
        await updateMutation.mutateAsync({ id: cowToEdit.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      if (err?.status === 409 || err?.response?.status === 409) {
        const msg = err?.message || err?.response?.data?.message || "Tag number or RFID already in use";
        if (msg.toLowerCase().includes("rfid")) {
          setError("rfid", { message: msg });
        } else {
          setError("tagNumber", { message: msg });
        }
        setServerError(msg);
      } else {
        setServerError(err?.message || "An unexpected error occurred while saving the animal.");
      }
    }
  };

  const isSaving = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E2E5DF] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5DF] bg-[#F8F9F6]">
          <div>
            <h2 className="text-lg font-bold text-[#1E3A2F] font-headline">
              {isEdit ? `Edit Livestock: ${cowToEdit?.tagNumber}` : "Register New Cattle"}
            </h2>
            <p className="text-xs text-[#717973] mt-0.5">
              {isEdit
                ? "Update animal health, location, or lifecycle details."
                : "Enter comprehensive livestock records for dairy herd management."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#717973] hover:text-[#1F2421] hover:bg-[#E2E5DF]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-4 flex-1">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Section: Identification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Tag Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={isEdit}
                placeholder="e.g. DF-1042"
                {...register("tagNumber")}
                className={`w-full h-9 px-3 text-xs bg-white border rounded focus:outline-none focus:border-[#1E3A2F] ${
                  errors.tagNumber ? "border-red-500 bg-red-50/50" : "border-[#E2E5DF]"
                } ${isEdit ? "bg-slate-100 cursor-not-allowed opacity-80" : ""}`}
              />
              {errors.tagNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.tagNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                RFID / Collar ID
              </label>
              <input
                type="text"
                placeholder="e.g. 840-003-241-1042"
                {...register("rfid")}
                className={`w-full h-9 px-3 text-xs bg-white border rounded focus:outline-none focus:border-[#1E3A2F] ${
                  errors.rfid ? "border-red-500 bg-red-50/50" : "border-[#E2E5DF]"
                }`}
              />
              {errors.rfid && (
                <p className="text-[11px] text-red-600 mt-1">{errors.rfid.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Animal Name</label>
              <input
                type="text"
                placeholder="e.g. Aurora"
                {...register("name")}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* Section: Breed, Gender, DOB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Breed <span className="text-red-500">*</span>
              </label>
              <select
                {...register("breed")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="HOLSTEIN_FRIESIAN">Holstein Friesian</option>
                <option value="JERSEY">Jersey Purebred</option>
                <option value="GUERNSEY">Guernsey</option>
                <option value="AYRSHIRE">Ayrshire</option>
                <option value="BROWN_SWISS">Brown Swiss</option>
                <option value="SIMMENTAL">Simmental</option>
                <option value="OTHER">Other / Crossbreed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="FEMALE">Female (Cow / Heifer)</option>
                <option value="MALE">Male (Bull / Steer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className={`w-full h-9 px-2 text-xs bg-white border rounded focus:outline-none focus:border-[#1E3A2F] ${
                  errors.dateOfBirth ? "border-red-500" : "border-[#E2E5DF]"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-[11px] text-red-600 mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          {/* Section: Statuses & Parity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Health Status
              </label>
              <select
                {...register("healthStatus")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="HEALTHY">Healthy</option>
                <option value="UNDER_TREATMENT">Under Treatment</option>
                <option value="PREGNANT">Pregnant</option>
                <option value="QUARANTINED">Quarantined</option>
                <option value="RECOVERING">Recovering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Lifecycle Status
              </label>
              <select
                {...register("lifecycleStatus")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="ACTIVE">Active (In Herd)</option>
                <option value="SOLD">Sold</option>
                <option value="DECEASED">Deceased</option>
                <option value="TRANSFERRED">Transferred</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Parity (Calvings)
              </label>
              <input
                type="number"
                disabled={selectedGender === "MALE"}
                min={0}
                {...register("parity")}
                className={`w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F] ${
                  selectedGender === "MALE" ? "bg-slate-100 opacity-60 cursor-not-allowed" : ""
                }`}
              />
              {selectedGender === "MALE" && (
                <p className="text-[10px] text-[#717973] mt-0.5">Parity not applicable for males</p>
              )}
            </div>
          </div>

          {/* Section: Location & Production */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Barn</label>
              <input
                type="text"
                placeholder="e.g. Barn A"
                {...register("barn")}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Pen</label>
              <input
                type="text"
                placeholder="e.g. Pen 02"
                {...register("pen")}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Lactation Stage
              </label>
              <select
                {...register("currentMilkStatus")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="Early">Early</option>
                <option value="Peak">Peak</option>
                <option value="Mid">Mid</option>
                <option value="Late">Late</option>
                <option value="Dry">Dry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                Exp. Capacity (L/d)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 35.0"
                {...register("expectedMilkCapacity")}
                className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              />
            </div>
          </div>

          {/* Section: Acquisition / Source */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2421] mb-1">Source</label>
              <select
                {...register("source")}
                className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
              >
                <option value="BORN">Born on Farm</option>
                <option value="PURCHASED">Purchased</option>
              </select>
            </div>

            {selectedSource === "PURCHASED" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                    Acquisition Date
                  </label>
                  <input
                    type="date"
                    {...register("acquisitionDate")}
                    className="w-full h-9 px-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2421] mb-1">
                    Acquired From
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. High-Yield Dairy Auction"
                    {...register("acquisitionPlace")}
                    className="w-full h-9 px-3 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1F2421] mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Operational observations, pedigree details, medical reminders..."
              {...register("notes")}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E2E5DF] rounded focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E5DF]">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold text-[#414844] hover:bg-[#F4F6F2] rounded border border-[#E2E5DF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-9 px-5 text-xs font-semibold text-white bg-[#1E3A2F] hover:bg-[#1b4332] rounded flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? "Update Animal" : "Register Animal"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
