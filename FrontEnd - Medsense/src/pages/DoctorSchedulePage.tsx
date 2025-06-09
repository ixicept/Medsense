import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Clock } from "../components/Icons";
import axiosInstance from "../services/AxiosInstance";
import { getCurrentUser } from "../utils/auth";

const times = [7, 9, 11, 13, 15, 17, 19];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Hospital {
  ID: string;
  Location: string;
}
interface Schedule {
  ID: string;
  DoctorID: string;
  HospitalID: string;
  Day: string;
  ScheduleStart: string; // "09:00:00"
  ScheduleEnd: string; // "17:00:00"
}

function parseHour(timeStr: string): string {
  if (!timeStr) return "";
  const match = timeStr.match(/T?(\d{1,2}):/);
  if (!match) return "";
  return match[1].padStart(2, "0");
}

export default function DoctorSchedulePage() {
  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [schedule, setSchedule] = useState<
    { day: string; start: string; end: string; hospital: string }[]
  >(daysOfWeek.map((d) => ({ day: d, start: "", end: "", hospital: "" })));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = getCurrentUser();
  const doctorId = user?.id;

  // Load hospitals and doctor's current schedule on mount
  useEffect(() => {
    axiosInstance
      .get("/hospital")
      .then((res) =>
        setHospitalList(
          Array.isArray(res.data.hospitals) ? res.data.hospitals : []
        )
      )
      .catch(() => toast.error("Could not load hospitals"));

    if (doctorId) {
      axiosInstance
        .get(`/schedule/doctor/${doctorId}`)
        .then((res) => {
          const fetched: Schedule[] = Array.isArray(res.data) ? res.data : [];
          const mapped = daysOfWeek.map((day) => {
            const sch = fetched.find((s) => s.Day === day);
            return sch
              ? {
                  day,
                  start: parseHour(sch.ScheduleStart),
                  end: parseHour(sch.ScheduleEnd),
                  hospital: sch.HospitalID,
                }
              : { day, start: "", end: "", hospital: "" };
          });
          console.log("Mapped schedule:", mapped);
          setSchedule(mapped);
        })
        .catch(() => {});
    }
  }, []);

  // Handlers
  const handleChange = (
    idx: number,
    field: "start" | "end" | "hospital",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // VALIDATION: Only submit filled and valid rows, allow if at least one.
  const validateAndBuildPayload = () => {
    const out: any[] = [];
    for (const row of schedule) {
      if (!row.start || !row.end || !row.hospital) continue;
      const startInt = parseInt(row.start, 10);
      const endInt = parseInt(row.end, 10);
      if (isNaN(startInt) || isNaN(endInt) || startInt >= endInt) continue;
      console.log(doctorId);
      out.push({
        doctor_id: doctorId,
        hospital_id: row.hospital,
        day: row.day,
        schedule_start: `1970-01-01T${row.start}:00:00Z`,
        schedule_end: `1970-01-01T${row.end}:00:00Z`,
      });
    }
    return out.length > 0 ? out : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = validateAndBuildPayload();
    if (!payload) {
      toast.error(
        "Please fill valid hospital, start and end times (start < end) for at least one day."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await Promise.all(
        payload.map((scheduleObj) =>
          axiosInstance.post("/schedule", scheduleObj)
        )
      );
      toast.success("Schedules saved successfully!");
    } catch (error) {
      toast.error("Failed to save schedules");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-sky-600">
          Set Your Weekly Schedule
        </h2>
        <p className="text-sky-700 mb-3">
          Choose available times and hospital for each day.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-sky-200 rounded-lg shadow-lg p-8 max-w-2xl mx-auto space-y-8"
      >
        <div className="space-y-4">
          {schedule.map((row, idx) => (
            <div
              key={row.day}
              className="flex flex-col md:flex-row items-center gap-4 border border-sky-100 rounded-lg px-3 py-2 bg-sky-50"
            >
              <span className="w-14 font-semibold text-sky-700">{row.day}</span>
              <div className="flex gap-1 items-center">
                <Clock className="h-5 w-5 text-sky-500" />
                <select
                  className="rounded border border-sky-300 p-1 text-sky-700 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  value={row.start}
                  onChange={(e) => handleChange(idx, "start", e.target.value)}
                >
                  <option value="">Start</option>
                  {times.map((t) => (
                    <option key={t} value={String(t).padStart(2, "0")}>
                      {String(t).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
                <span className="mx-1 text-gray-600">to</span>
                <select
                  className="rounded border border-sky-300 p-1 text-sky-700 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  value={row.end}
                  onChange={(e) => handleChange(idx, "end", e.target.value)}
                >
                  <option value="">End</option>
                  {times.map((t) => (
                    <option key={t} value={String(t).padStart(2, "0")}>
                      {String(t).padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
              <select
                className="rounded border border-sky-300 p-1 text-sky-700 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none min-w-[160px]"
                value={row.hospital}
                onChange={(e) => handleChange(idx, "hospital", e.target.value)}
              >
                <option value="">Select hospital…</option>
                {hospitalList.map((hosp) => (
                  <option key={hosp.ID} value={hosp.ID}>
                    {hosp.Location}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </button>
      </form>
    </div>
  );
}
