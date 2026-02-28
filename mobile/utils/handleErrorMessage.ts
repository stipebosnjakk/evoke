export const throwDbError: (
  error: unknown,
  fallback: string | null,
) => never = (error, fallback) => {
  const message =
    error instanceof Error
      ? error.message
      : (fallback ?? "Something went wrong.");
  throw new Error(message);
};

export const handleErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};
