/**
 * It returns a message string, If the error is a real Error, it returns its message, otherwise it returns the provided fallback message or a default one.
 * @param error The error to handle, can be of any type
 * @param fallback The message to return if the error is not an instance of Error, or if it doesn't have a message. If not provided, it defaults to "Something went wrong."
 * @returns A string message extracted from the error or the fallback message
 */
export const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

/**
 * Handles error messages from database operations.
 * If the error is an instance of Error, it extracts and throws the message.
 * Otherwise, it throws a new Error with the provided fallback message or a default one.
 * @param error caught errors can be anything
 * @param fallback If the error is not a real Error, it uses the fallback message or a default one.
 */
export const throwDbError: (
  error: unknown,
  fallback: string | null,
) => never = (error, fallback) => {
  const message = getErrorMessage(error, fallback ?? "Something went wrong");
  throw new Error(message);
};
