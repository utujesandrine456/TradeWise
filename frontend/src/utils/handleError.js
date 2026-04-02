import { AxiosError } from "axios";

export function handleError(error) {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data?.message) {
        return {
          type: "server",
          status,
          message: data.message,
          errors: data.errors || null,
        };
      }

      return {
        type: "server",
        status,
        message: data?.error || "Server returned an error",
        errors: null,
      };
    } else if (error.request) {
      return {
        type: "network",
        message: "No response received from server",
      };
    } else {
      return {
        type: "config",
        message: error.message,
      };
    }
  }

  if (error instanceof Error) {
    return {
      type: "client",
      message: error.message,
    };
  }

  return {
    type: "unknown",
    message: "An unknown error occurred",
  };
}