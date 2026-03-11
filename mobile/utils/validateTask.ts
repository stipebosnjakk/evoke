import { TASK_STATUSES } from "@/consts/statuses";
import { IsoDate, TaskStatusOptionsArray } from "@/types/task.types";
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

  const isStatusValid = TASK_STATUSES.some(
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

export const validateTaskStartTime = (
  data: number | null,
  due_time_min?: number | null,
): ValidationResult<number | null> => {
  if (data === null) {
    return {
      ok: true,
      data: null,
      message: "Start time cleared successfully",
    };
  }

  if (!Number.isInteger(data)) {
    return {
      ok: false,
      data: null,
      message: "Start time must be a whole number",
    };
  }

  const min = 0; // 00:00
  const max = 1439; // 23:59

  if (data < min || data > max) {
    return {
      ok: false,
      data: null,
      message: "Start time must be between 00:00 and 23:59",
    };
  }

  if (due_time_min) {
    if (!Number.isInteger(due_time_min)) {
      return {
        ok: false,
        data: null,
        message: "Due time must be a whole number",
      };
    }

    if (due_time_min < min || due_time_min > max) {
      return {
        ok: false,
        data: null,
        message: "Due time must be between 00:00 and 23:59",
      };
    }

    if (data > due_time_min) {
      return {
        ok: false,
        data: null,
        message: "Start time can't be after due time",
      };
    }
  }

  return {
    ok: true,
    data,
    message: "Start time saved successfully",
  };
};

export const validateTaskDueTime = (
  data: number | null,
  start_time_min?: number | null,
): ValidationResult<number | null> => {
  if (data === null) {
    return {
      ok: true,
      data: null,
      message: "Due time cleared successfully",
    };
  }

  if (!Number.isInteger(data)) {
    return {
      ok: false,
      data: null,
      message: "Due time must be a whole number",
    };
  }

  const min = 0; // 00:00
  const max = 1439; // 23:59

  if (data < min || data > max) {
    return {
      ok: false,
      data: null,
      message: "Due time must be between 00:00 and 23:59",
    };
  }

  if (start_time_min) {
    if (!Number.isInteger(start_time_min)) {
      return {
        ok: false,
        data: null,
        message: "Start time must be a whole number",
      };
    }

    if (start_time_min < min || start_time_min > max) {
      return {
        ok: false,
        data: null,
        message: "Start time must be between 00:00 and 23:59",
      };
    }

    if (data < start_time_min) {
      return {
        ok: false,
        data: null,
        message: "Due time can't be before start time",
      };
    }
  }

  return {
    ok: true,
    data,
    message: "Due time saved successfully",
  };
};
