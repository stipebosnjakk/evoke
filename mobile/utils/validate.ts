import { projectColors } from "@/constants/colors";
import { STATUS_OPTIONS } from "@/constants/status";
import { ValidationResult } from "@/types/initialState.types";
import { IsoDate, TaskStatusOptionsArray, Weekday } from "@/types/task.types";
import { isValidIsoDate } from "@/utils/date";

type ValidateTaskStatusArgs = {
  status: unknown;
};

export const validateTaskStatus = ({
  status,
}: ValidateTaskStatusArgs): ValidationResult<TaskStatusOptionsArray | null> => {
  if (status === null || status === undefined) {
    return {
      ok: true,
      data: null,
      message: "Status cleared successfully",
    };
  }

  if (typeof status !== "object" || !("value" in status)) {
    return {
      ok: false,
      data: null,
      message: "Status is not valid",
    };
  }

  const validStatus = STATUS_OPTIONS.find(
    (option) => option.value === status.value,
  );

  if (!validStatus) {
    return {
      ok: false,
      data: null,
      message: "Status is not valid",
    };
  }

  return {
    ok: true,
    data: validStatus,
    message: "Status saved successfully",
  };
};

type ValidateTaskRepeatArgs = {
  repeatDays: unknown;
};

export const validateTaskRepeat = ({
  repeatDays,
}: ValidateTaskRepeatArgs): ValidationResult<Weekday[] | null> => {
  if (repeatDays === null || repeatDays === undefined) {
    return {
      ok: true,
      data: null,
      message: "Repeat option cleared successfully",
    };
  }

  if (!Array.isArray(repeatDays)) {
    return {
      ok: false,
      data: null,
      message: "Repeat option is not valid",
    };
  }

  if (repeatDays.length === 0) {
    return {
      ok: true,
      data: null,
      message: "Repeat option cleared successfully",
    };
  }

  const isValidDay = (day: unknown): day is Weekday =>
    typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6;

  if (!repeatDays.every(isValidDay)) {
    return {
      ok: false,
      data: null,
      message: "Repeat option is not valid",
    };
  }

  if (new Set(repeatDays).size !== repeatDays.length) {
    return {
      ok: false,
      data: null,
      message: "Repeat option contains duplicate days",
    };
  }

  return {
    ok: true,
    data: repeatDays,
    message: "Repeat option saved successfully",
  };
};

type ValidateTaskTitleArgs = {
  title: unknown;
};

export const validateTaskTitle = ({
  title,
}: ValidateTaskTitleArgs): ValidationResult<string> => {
  if (typeof title !== "string") {
    return {
      ok: false,
      data: null,
      message: "Title is required",
    };
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return {
      ok: false,
      data: null,
      message: "Title is required",
    };
  }

  if (trimmedTitle.length > 255) {
    return {
      ok: false,
      data: null,
      message: "Title must be 255 characters or less",
    };
  }

  return {
    ok: true,
    data: trimmedTitle,
    message: "Title saved successfully",
  };
};

type ValidateTaskDescriptionArgs = {
  description: unknown;
};

export const validateTaskDescription = ({
  description,
}: ValidateTaskDescriptionArgs): ValidationResult<string | null> => {
  if (description === null || description === undefined) {
    return {
      ok: true,
      data: null,
      message: "Description cleared successfully",
    };
  }

  if (typeof description !== "string") {
    return {
      ok: false,
      data: null,
      message: "Description is not valid",
    };
  }

  const trimmedDescription = description.trim();

  if (!trimmedDescription) {
    return {
      ok: true,
      data: null,
      message: "Description cleared successfully",
    };
  }

  if (trimmedDescription.length > 2000) {
    return {
      ok: false,
      data: null,
      message: "Description must be 2000 characters or less",
    };
  }

  return {
    ok: true,
    data: trimmedDescription,
    message: "Description saved successfully",
  };
};

type ValidateTaskStartDateArgs = {
  start_date: unknown;
  deadline: unknown;
};

export const validateTaskStartDate = ({
  start_date,
  deadline,
}: ValidateTaskStartDateArgs): ValidationResult<IsoDate | null> => {
  if (start_date === null || start_date === undefined || start_date === "") {
    return {
      ok: true,
      data: null,
      message: "Start date cleared successfully",
    };
  }

  if (typeof start_date !== "string") {
    return {
      ok: false,
      data: null,
      message: "Start date must be a valid date in YYYY-MM-DD format",
    };
  }

  const startDate = start_date.trim();

  if (!startDate) {
    return {
      ok: true,
      data: null,
      message: "Start date cleared successfully",
    };
  }

  if (!isValidIsoDate(startDate)) {
    return {
      ok: false,
      data: null,
      message: "Start date must be a valid date in YYYY-MM-DD format",
    };
  }

  if (deadline !== null && deadline !== undefined && deadline !== "") {
    if (typeof deadline !== "string") {
      return {
        ok: false,
        data: null,
        message: "Deadline is not valid",
      };
    }

    const taskDeadline = deadline.trim();

    if (taskDeadline) {
      if (!isValidIsoDate(taskDeadline)) {
        return {
          ok: false,
          data: null,
          message: "Deadline is not valid",
        };
      }

      if (startDate > taskDeadline) {
        return {
          ok: false,
          data: null,
          message: "Start date cannot be after deadline",
        };
      }
    }
  }

  return {
    ok: true,
    data: startDate as IsoDate,
    message: "Start date saved successfully",
  };
};

type ValidateTaskDeadlineArgs = {
  deadline: unknown;
  startDate?: unknown;
};

export const validateTaskDeadline = ({
  deadline,
  startDate,
}: ValidateTaskDeadlineArgs): ValidationResult<IsoDate | null> => {
  if (deadline === null || deadline === undefined || deadline === "") {
    return {
      ok: true,
      data: null,
      message: "Deadline cleared successfully",
    };
  }

  if (typeof deadline !== "string") {
    return {
      ok: false,
      data: null,
      message: "Deadline must be a valid date in YYYY-MM-DD format",
    };
  }

  const trimmedDeadline = deadline.trim();

  if (!trimmedDeadline) {
    return {
      ok: true,
      data: null,
      message: "Deadline cleared successfully",
    };
  }

  if (!isValidIsoDate(trimmedDeadline)) {
    return {
      ok: false,
      data: null,
      message: "Deadline must be a valid date in YYYY-MM-DD format",
    };
  }

  if (startDate !== null && startDate !== undefined && startDate !== "") {
    if (typeof startDate !== "string") {
      return {
        ok: false,
        data: null,
        message: "Start date is not valid",
      };
    }

    const taskStartDate = startDate.trim();

    if (taskStartDate) {
      if (!isValidIsoDate(taskStartDate)) {
        return {
          ok: false,
          data: null,
          message: "Start date is not valid",
        };
      }

      if (trimmedDeadline < taskStartDate) {
        return {
          ok: false,
          data: null,
          message: "Deadline cannot be before start date",
        };
      }
    }
  }

  return {
    ok: true,
    data: trimmedDeadline as IsoDate,
    message: "Deadline saved successfully",
  };
};

type ValidateTaskTime = {
  start_time_min: number | null;
};

export const validateTaskTime = ({
  start_time_min,
}: ValidateTaskTime): ValidationResult<number | null> => {
  const minStart = 0;
  const maxStart = 23 * 60 + 55;
  const minuteStep = 5;

  if (start_time_min === null || start_time_min === undefined) {
    return {
      ok: true,
      data: null,
      message: "Start time cleared successfully",
    };
  }

  if (typeof start_time_min !== "number" || !Number.isInteger(start_time_min)) {
    return {
      ok: false,
      data: null,
      message: "Start time must be a whole number",
    };
  }

  if (start_time_min < minStart || start_time_min > maxStart) {
    return {
      ok: false,
      data: null,
      message: "Start time must be between 00:00 and 23:55",
    };
  }

  if (start_time_min % minuteStep !== 0) {
    return {
      ok: false,
      data: null,
      message: "Start time must be in 5-minute increments",
    };
  }

  return {
    ok: true,
    data: start_time_min,
    message: "Start time saved successfully",
  };
};

type ValidateTaskDuration = {
  duration_min: number | null;
};

export const validateTaskDuration = ({
  duration_min,
}: ValidateTaskDuration): ValidationResult<number | null> => {
  const maxDuration = 24 * 60 - 1;
  const durationStep = 5;

  const normalizedDuration = duration_min === 0 ? null : duration_min;

  if (normalizedDuration === null || normalizedDuration === undefined) {
    return {
      ok: true,
      data: null,
      message: "Duration cleared successfully",
    };
  }

  if (
    typeof normalizedDuration !== "number" ||
    !Number.isInteger(normalizedDuration)
  ) {
    return {
      ok: false,
      data: null,
      message: "Duration must be a whole number",
    };
  }

  if (normalizedDuration < 0) {
    return {
      ok: false,
      data: null,
      message: "Duration can't be negative",
    };
  }

  if (normalizedDuration > maxDuration) {
    return {
      ok: false,
      data: null,
      message: "Duration must be less than 24 hours",
    };
  }

  if (normalizedDuration % durationStep !== 0) {
    return {
      ok: false,
      data: null,
      message: "Duration must be in 5-minute increments",
    };
  }

  return {
    ok: true,
    data: normalizedDuration,
    message: "Duration saved successfully",
  };
};

type ValidateProjectNameArgs = {
  name: unknown;
};

export const validateProjectName = ({
  name,
}: ValidateProjectNameArgs): ValidationResult<string> => {
  if (typeof name !== "string") {
    return {
      ok: false,
      data: null,
      message: "Project name is required",
    };
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      ok: false,
      data: null,
      message: "Project name is required",
    };
  }

  if (trimmedName.length > 250) {
    return {
      ok: false,
      data: null,
      message: "Project name must be 250 characters or less",
    };
  }

  return {
    ok: true,
    data: trimmedName,
    message: "Project name saved successfully",
  };
};

type ValidateProjectColorArgs = {
  color: unknown;
};

export const validateProjectColor = ({
  color,
}: ValidateProjectColorArgs): ValidationResult<string> => {
  if (typeof color !== "string" || !color) {
    return {
      ok: false,
      data: null,
      message: "Project color is required",
    };
  }

  const validColor = projectColors.find((item) => item.hex === color);

  if (!validColor) {
    return {
      ok: false,
      data: null,
      message: "Project color is invalid",
    };
  }

  return {
    ok: true,
    data: validColor.hex,
    message: "Project color saved successfully",
  };
};
