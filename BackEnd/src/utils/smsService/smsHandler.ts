import { Service } from "./smsActivate";
import { AxiosResponse } from "axios";
import { errorApiMap, errorsKeys } from "./utils";

export type UniversalError =
  | "INVALID_API_KEY"
  | "NO_NUMBERS_AVAILABLE"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_ACTIVATION"
  | "INVALID_STATUS"
  | "INVALID_ACTION"
  | "SYSTEM_ERROR"
  | "UNKNOWN_ERROR";

const mapErrorToUniversalError = async (
  service: Service,
  error: string
): Promise<UniversalError> => {
  return errorApiMap[service].get(error) || "UNKNOWN_ERROR";
};

const checkForError = async (
  response: string | object, // Change the type from 'string' to 'string | object'
  service: Service
): Promise<UniversalError | null> => {
  let errorString = "";
  try {
    if (typeof response === "string") {
      errorString = response;
    } else if (
      typeof response === "object" &&
      response.hasOwnProperty("message")
    ) {
      errorString = response["message"];
    }
    const errorList = errorsKeys[service];
    for (const error of errorList) {
      if (errorString.includes(error)) {
        return await mapErrorToUniversalError(service, error);
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const checkForErrorFromAxiosResponse = async (
  response: AxiosResponse,
  service: Service
): Promise<void> => {
  // console.log(response.data)
  if (response.status !== 200) {
    const error = await mapErrorToUniversalError(
      service,
      `Status Code: ${response.status}`
    );
    if (error !== "UNKNOWN_ERROR") {
      throw new Error(`Service: ${service}, Error: ${error}`);
    } else {
      throw new Error("SYSTEM_ERROR");
    }
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    response.data.message === "Отсутствует api ключ"
  ) {
    throw new Error(`Service: ${service}, Error: INVALID_API_KEY`);
  }

  const error = await checkForError(response.data, service);
  if (error) {
    throw new Error(`Service: ${service}, Error: ${error}`);
  }
};
