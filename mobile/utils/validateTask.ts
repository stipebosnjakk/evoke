import { STATUS_OPTIONS } from "@/constants/status";
import { IsoDate, TaskStatusOptionsArray, Weekday } from "@/types/task.types";
import { isValidIsoDate } from "@/utils/date";

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
      message: string;
    }
  | {
      ok: false;
      data: null;
      message: string;
    };

export const validateTaskStatus = (
  data: TaskStatusOptionsArray | null,
): ValidationResult<TaskStatusOptionsArray | null> => {
  if (!data) {
    return {
      ok: true,
      data: null,
      message: "Status cleared successfully",
    };
  }

  const isStatusValid = STATUS_OPTIONS.some(
    (status) => status.value === data.value,
  );

  if (!isStatusValid) {
    return {
      ok: false,
      data: null,
      message: "Status is not valid",
    };
  }

  return {
    ok: true,
    data,
    message: "Status saved successfully",
  };
};

export const validateTaskRepeat = (
  data: unknown,
): ValidationResult<Weekday[] | null> => {
  if (data === null || data === undefined) {
    return {
      ok: true,
      data: null,
      message: "Repeat option cleared successfully",
    };
  }

  if (!Array.isArray(data)) {
    return {
      ok: false,
      data: null,
      message: "Repeat option is not valid",
    };
  }

  if (data.length === 0) {
    return {
      ok: true,
      data: null,
      message: "Repeat option cleared successfully",
    };
  }

  const isValidDay = (day: any) => day >= 0 && day <= 6;

  if (!data.every(isValidDay)) {
    return {
      ok: false,
      data: null,
      message: "Repeat option is not valid",
    };
  }

  const noDuplicates = [...new Set(data)];

  if (noDuplicates.length !== data.length) {
    return {
      ok: false,
      data: null,
      message: "Repeat option contains duplicate days",
    };
  }

  return {
    ok: true,
    data,
    message: "Repeat option saved successfully",
  };
};

export const validateTaskTitle = (
  data: string | null,
): ValidationResult<string> => {
  if (!data) {
    return {
      ok: false,
      data: null,
      message: "Title is required",
    };
  }

  const title = data.trim();

  if (!title) {
    return {
      ok: false,
      data: null,
      message: "Title is required",
    };
  }

  if (title.length > 255) {
    return {
      ok: false,
      data: null,
      message: "Title must be 255 characters or less",
    };
  }

  return {
    ok: true,
    data: title,
    message: "Title saved successfully",
  };
};

export const validateTaskDescription = (
  data: string | null,
): ValidationResult<string | null> => {
  const description = data?.trim();

  if (!description) {
    return {
      ok: true,
      data: null,
      message: "Description cleared successfully",
    };
  }

  if (description.length > 2000) {
    return {
      ok: false,
      data: null,
      message: "Description must be 2000 characters or less",
    };
  }

  return {
    ok: true,
    data: description,
    message: "Description saved successfully",
  };
};

export const validateTaskStartDate = (
  data: IsoDate | null,
  deadline?: IsoDate | null,
): ValidationResult<IsoDate | null> => {
  const startDate = data?.trim() || null;
  const taskDeadline = deadline?.trim() || null;

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

  if (taskDeadline) {
    if (!isValidIsoDate(taskDeadline)) {
      return {
        ok: false,
        data: null,
        message: "Deadline is not valid",
      };
    }

    // TODO: check if this is working
    if (startDate > taskDeadline) {
      return {
        ok: false,
        data: null,
        message: "Start date cannot be after deadline",
      };
    }
  }

  return {
    ok: true,
    data: startDate as IsoDate,
    message: "Start date saved successfully",
  };
};

export const validateTaskDeadline = (
  data: IsoDate | null,
  startDate?: IsoDate | null,
): ValidationResult<IsoDate | null> => {
  const deadline = data?.trim() || null;
  const taskStartDate = startDate?.trim() || null;

  if (!deadline) {
    return {
      ok: true,
      data: null,
      message: "Deadline cleared successfully",
    };
  }

  if (!isValidIsoDate(deadline)) {
    return {
      ok: false,
      data: null,
      message: "Deadline must be a valid date in YYYY-MM-DD format",
    };
  }

  if (taskStartDate) {
    if (!isValidIsoDate(taskStartDate)) {
      return {
        ok: false,
        data: null,
        message: "Start date is not valid",
      };
    }

    if (deadline < taskStartDate) {
      return {
        ok: false,
        data: null,
        message: "Deadline cannot be before start date",
      };
    }
  }

  return {
    ok: true,
    data: deadline as IsoDate,
    message: "Deadline saved successfully",
  };
};

export const validateTaskTime = (
  start_time_min: number | null,
  duration_min: number | null,
): ValidationResult<{
  start_time_min: number | null;
  duration_min: number | null;
} | null> => {
  const minStart = 0;
  const maxStart = 1439;
  const normalizedDuration = duration_min === 0 ? null : duration_min;

  if (start_time_min === null) {
    if (normalizedDuration !== null) {
      return {
        ok: false,
        data: null,
        message: "Duration can't be set without a start time",
      };
    }

    return {
      ok: true,
      data: {
        start_time_min: null,
        duration_min: null,
      },
      message: "Time cleared successfully",
    };
  }

  if (!Number.isInteger(start_time_min)) {
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
      message: "Start time must be between 00:00 and 23:59",
    };
  }

  if (normalizedDuration === null) {
    return {
      ok: true,
      data: {
        start_time_min,
        duration_min: null,
      },
      message: "Start time saved successfully",
    };
  }

  if (!Number.isInteger(normalizedDuration)) {
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

  if (normalizedDuration > 1439) {
    return {
      ok: false,
      data: null,
      message: "Duration must be less than 24 hours",
    };
  }

  return {
    ok: true,
    data: {
      start_time_min,
      duration_min: normalizedDuration,
    },
    message: "Time saved successfully",
  };
};
