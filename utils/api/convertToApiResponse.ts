export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export function convertToApiResponse<T>(
  data: T | null,
  errorMessage?: string
): ApiResponse<T> {
  if (errorMessage) {
    return { status: "error", message: errorMessage };
  } else if (data) {
    return { status: "success", data };
  } else {
    return { status: "success" };
  }
}
