import { projectColors } from "@/constants/colors";
import { STATUS_OPTIONS } from "@/constants/status";
import { FormTask } from "@/db";
import { ValidationResult } from "@/types/initialState.types";
import {
  IsoDate,
  TaskStatus,
  TaskStatusOptionsArray,
  Weekday,
} from "@/types/task.types";
import { isValidIsoDate } from "@/utils/date";

type InvalidTaskReturnType = {
  ok: false;
  data: null;
  message: string;
};

const validationError = (message: string): InvalidTaskReturnType => ({
  ok: false,
  data: null,
  message,
});

type ValidateTaskStatusArgs = {
  status: TaskStatusOptionsArray | null;
  repeat: Weekday[] | null;
};

export const validateTaskStatus = ({
  status,
  repeat,
}: ValidateTaskStatusArgs): ValidationResult<TaskStatusOptionsArray | null> => {
  const hasRepeat = Boolean(repeat?.length);

  if (hasRepeat && status?.value !== "next") {
    return validationError("A repeating task must have the Next status");
  }

  if (status === null || status === undefined) {
    return {
      ok: true,
      data: null,
      message: "Status cleared successfully",
    };
  }

  if (typeof status !== "object" || !("value" in status)) {
    return validationError("Status is not valid");
  }

  const validStatus = STATUS_OPTIONS.find(
    (option) => option.value === status.value,
  );

  if (!validStatus) {
    return validationError("Status is not valid");
  }

  return {
    ok: true,
    data: validStatus,
    message: "Status saved successfully",
  };
};

type ValidateTaskRepeatArgs = {
  repeatDays: Weekday[] | null;
  status: TaskStatus | null;
};

export const validateTaskRepeat = ({
  repeatDays,
  status,
}: ValidateTaskRepeatArgs): ValidationResult<Weekday[] | null> => {
  if (repeatDays === null || repeatDays === undefined) {
    return {
      ok: true,
      data: null,
      message: "Repeat option cleared successfully",
    };
  }

  if (!Array.isArray(repeatDays)) {
    return validationError("Repeat option is not valid");
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
    return validationError("Repeat option is not valid");
  }

  if (new Set(repeatDays).size !== repeatDays.length) {
    return validationError("Repeat option contains duplicate days");
  }

  if (repeatDays.length > 0 && status !== "next") {
    validationError("A repeating task must have the Next status");
  }

  return {
    ok: true,
    data: repeatDays,
    message: "Repeat option saved successfully",
  };
};

type ValidateTaskTitleArgs = {
  title: string | null;
};

export const validateTaskTitle = ({
  title,
}: ValidateTaskTitleArgs): ValidationResult<string> => {
  if (typeof title !== "string") {
    return validationError("Title is required");
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return validationError("Title is required");
  }

  if (trimmedTitle.length > 255) {
    return validationError("Title must be 255 characters or less");
  }

  return {
    ok: true,
    data: trimmedTitle,
    message: "Title saved successfully",
  };
};

type ValidateTaskDescriptionArgs = {
  description: string | null;
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
    return validationError("Description is not valid");
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
    return validationError("Description must be 2000 characters or less");
  }

  return {
    ok: true,
    data: trimmedDescription,
    message: "Description saved successfully",
  };
};

type ValidateTaskStartDateArgs = {
  start_date: IsoDate | null;
  deadline: IsoDate | null;
};

export const validateTaskStartDate = ({
  start_date,
  deadline,
}: ValidateTaskStartDateArgs): ValidationResult<IsoDate | null> => {
  if (start_date === null || start_date === undefined) {
    return {
      ok: true,
      data: null,
      message: "Start date cleared successfully",
    };
  }

  if (typeof start_date !== "string") {
    return validationError(
      "Start date must be a valid date in YYYY-MM-DD format",
    );
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
    return validationError(
      "Start date must be a valid date in YYYY-MM-DD format",
    );
  }

  if (deadline !== null && deadline !== undefined) {
    if (typeof deadline !== "string") {
      return validationError("Deadline is not valid");
    }

    const taskDeadline = deadline.trim();

    if (taskDeadline) {
      if (!isValidIsoDate(taskDeadline)) {
        return validationError("Deadline is not valid");
      }

      if (startDate > taskDeadline) {
        return validationError("Start date cannot be after deadline");
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
  deadline: IsoDate | null;
  startDate?: IsoDate | null;
};

export const validateTaskDeadline = ({
  deadline,
  startDate,
}: ValidateTaskDeadlineArgs): ValidationResult<IsoDate | null> => {
  if (deadline === null || deadline === undefined) {
    return {
      ok: true,
      data: null,
      message: "Deadline cleared successfully",
    };
  }

  if (typeof deadline !== "string") {
    return validationError(
      "Deadline must be a valid date in YYYY-MM-DD format",
    );
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
    return validationError(
      "Deadline must be a valid date in YYYY-MM-DD format",
    );
  }

  if (startDate !== null && startDate !== undefined) {
    if (typeof startDate !== "string") {
      return validationError("Start date is not valid");
    }

    const taskStartDate = startDate.trim();

    if (taskStartDate) {
      if (!isValidIsoDate(taskStartDate)) {
        return validationError("Start date is not valid");
      }

      if (trimmedDeadline < taskStartDate) {
        return validationError("Deadline cannot be before start date");
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
  start_date?: IsoDate | null;
  repeat?: Weekday[] | null;
};

export const validateTaskTime = ({
  start_time_min,
  start_date,
  repeat,
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

  if ((!repeat || repeat.length === 0) && !start_date) {
    return validationError(
      "Select a start date or recurrence before setting a start time",
    );
  }

  if (typeof start_time_min !== "number" || !Number.isInteger(start_time_min)) {
    return validationError("Start time must be a whole number");
  }

  if (start_time_min < minStart || start_time_min > maxStart) {
    return validationError("Start time must be between 00:00 and 23:55");
  }

  if (start_time_min % minuteStep !== 0) {
    return validationError("Start time must be in 5-minute increments");
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
    return validationError("Duration must be a whole number");
  }

  if (normalizedDuration < 0) {
    return validationError("Duration can't be negative");
  }

  if (normalizedDuration > maxDuration) {
    return validationError("Duration must be less than 24 hours");
  }

  if (normalizedDuration % durationStep !== 0) {
    return validationError("Duration must be in 5-minute increments");
  }

  return {
    ok: true,
    data: normalizedDuration,
    message: "Duration saved successfully",
  };
};

type ValidateProjectNameArgs = {
  name: string | null;
};

export const validateProjectName = ({
  name,
}: ValidateProjectNameArgs): ValidationResult<string> => {
  if (typeof name !== "string") {
    return validationError("Project name is required");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    return validationError("Project name is required");
  }

  if (trimmedName.length > 250) {
    return validationError("Project name must be 250 characters or less");
  }

  return {
    ok: true,
    data: trimmedName,
    message: "Project name saved successfully",
  };
};

type ValidateProjectColorArgs = {
  color: string | null;
};

export const validateProjectColor = ({
  color,
}: ValidateProjectColorArgs): ValidationResult<string> => {
  if (typeof color !== "string" || !color) {
    return validationError("Project color is required");
  }

  const validColor = projectColors.find((item) => item.hex === color);

  if (!validColor) {
    return validationError("Project color is invalid");
  }

  return {
    ok: true,
    data: validColor.hex,
    message: "Project color saved successfully",
  };
};

// TODO: fix validation

export const validateTask = (
  formTask: FormTask,
): ValidationResult<FormTask> => {
  const titleValidation = validateTaskTitle({
    title: formTask.title ?? null,
  });

  if (!titleValidation.ok) {
    return validationError(titleValidation.message);
  }

  const descriptionValidation = validateTaskDescription({
    description: formTask.description ?? null,
  });

  if (!descriptionValidation.ok) {
    return validationError(descriptionValidation.message);
  }

  const repeatValidation = validateTaskRepeat({
    repeatDays: formTask.repeat ?? null,
    status,
  });

  if (!repeatValidation.ok) {
    return validationError(repeatValidation.message);
  }

  const repeat = repeatValidation.data;

  const startDateValidation = validateTaskStartDate({
    start_date: formTask.start_date ?? null,
    deadline: formTask.deadline ?? null,
  });

  if (!startDateValidation.ok) {
    return validationError(startDateValidation.message);
  }

  const startDate = startDateValidation.data;

  const deadlineValidation = validateTaskDeadline({
    deadline: formTask.deadline ?? null,
    startDate,
  });

  if (!deadlineValidation.ok) {
    return validationError(deadlineValidation.message);
  }

  const deadline = deadlineValidation.data;

  const startTimeValidation = validateTaskTime({
    start_time_min: formTask.start_time_min ?? null,
    start_date: startDate,
    repeat,
  });

  if (!startTimeValidation.ok) {
    return validationError(startTimeValidation.message);
  }

  const startTimeMin = startTimeValidation.data;

  const durationValidation = validateTaskDuration({
    duration_min: formTask.duration_min ?? null,
  });

  if (!durationValidation.ok) {
    return validationError(durationValidation.message);
  }

  const durationMin = durationValidation.data;

  const requestedStatus =
    formTask.status ??
    (startDate !== null || deadline !== null ? "next" : null);

  const statusOption =
    requestedStatus === null
      ? null
      : (STATUS_OPTIONS.find((option) => option.value === requestedStatus) ??
        null);

  if (requestedStatus !== null && statusOption === null) {
    return validationError("Status is not valid");
  }

  const statusValidation = validateTaskStatus({
    status: statusOption,
    repeat,
  });

  if (!statusValidation.ok) {
    return validationError(statusValidation.message);
  }

  const status = statusValidation.data?.value ?? null;

  const normalizedTask: FormTask = {
    ...formTask,
    title: titleValidation.data,
    description: descriptionValidation.data,
    repeat,
    start_date: startDate,
    deadline,
    start_time_min: startTimeMin,
    duration_min: durationMin,
    status,
  };

  return {
    ok: true,
    data: normalizedTask,
    message: "Task is valid",
  };
};
