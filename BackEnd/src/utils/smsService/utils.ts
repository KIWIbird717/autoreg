import { Service, serviceList } from "./smsActivate.js";
import { UniversalError } from "./smsHandler.js";

type CheckerService = Service | string;

export async function checkService(
  service: CheckerService
): Promise<Service | null> {
  if (!service || !serviceList.includes(service as Service)) {
    return null;
  }

  return service as Service;
}

// List of error

export const errorApiMap: Record<Service, Map<string, UniversalError>> = {
  "sms-man": new Map([
    ["BAD_KEY", "INVALID_API_KEY"],
    ["NO_NUMBERS", "NO_NUMBERS_AVAILABLE"],
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["BAD_STATUS", "INVALID_STATUS"],
  ]),
  "5sim": new Map([
    ["Status Code: 401 Unauthorized", "INVALID_API_KEY"],
    ["Status Code 400: order not found", "INVALID_ACTIVATION"],
    ["Status Code 400: order expired", "INVALID_ACTIVATION"],
    ["Status Code 400: order has sms", "INVALID_STATUS"],
    ["Status Code 400: hosting order", "INVALID_ACTION"],
    ["Status Code 400: order no sms", "INVALID_STATUS"],
    ["Status Code: 500 internal error", "SYSTEM_ERROR"],
    ["no free phones", "NO_NUMBERS_AVAILABLE"],
    ["select operator", "INVALID_ACTION"],
    ["not enough user balance", "INSUFFICIENT_BALANCE"],
    ["bad country", "INVALID_ACTION"],
    ["bad operator", "INVALID_ACTION"],
    ["server offline", "SYSTEM_ERROR"],
    ["not enough rating", "UNKNOWN_ERROR"],
    ["no product", "INVALID_ACTION"],
    ["reuse not possible", "INVALID_ACTION"],
    ["reuse false", "INVALID_ACTION"],
    ["reuse expired", "INVALID_ACTION"],
    ["Status Code: 400 country is incorrect", "INVALID_ACTION"],
    ["Status Code: 400 product is incorrect", "INVALID_ACTION"],
  ]),
  "sms-activation-service": new Map([
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["NO_NUMBERS", "NO_NUMBERS_AVAILABLE"],
    ["ACCESS_CANCEL", "INVALID_ACTIVATION"],
    ["ACCESS_RETRY_GET", "UNKNOWN_ERROR"],
    ["ACCESS_ACTIVATION", "UNKNOWN_ERROR"],
    ["CANNOT_BEFORE_2_MIN", "UNKNOWN_ERROR"],
    ["STATUS_WAIT_CODE", "UNKNOWN_ERROR"],
    ["STATUS_CANCEL", "INVALID_ACTIVATION"],
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_KEY", "INVALID_API_KEY"],
    ["BAD_LANG", "UNKNOWN_ERROR"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["ERROR_SQL", "SYSTEM_ERROR"],
    ["ERROR_API", "SYSTEM_ERROR"],
  ]),
  "sms-acktiwator": new Map([
    ["101", "INVALID_ACTION"],
    ["102", "INSUFFICIENT_BALANCE"],
    ["103", "NO_NUMBERS_AVAILABLE"],
    ["201", "UNKNOWN_ERROR"],
    ["202", "INVALID_API_KEY"],
    ["203", "UNKNOWN_ERROR"],
    ["Отсутствует api ключ", "INVALID_API_KEY"],
  ]),
  "sms-activate": new Map([
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_KEY", "INVALID_API_KEY"],
    ["NO_KEY", "INVALID_API_KEY"],
    ["BAD_SERVICE", "INVALID_ACTION"],
    ["BAD_STATUS", "INVALID_STATUS"],
    ["ERROR_SQL", "SYSTEM_ERROR"],
    ["OPERATORS_NOT_FOUND", "UNKNOWN_ERROR"],
    ["NO_ACTIVATIONS", "UNKNOWN_ERROR"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["BANNED", "UNKNOWN_ERROR"],
    ["WRONG_EXCEPTION_PHONE", "INVALID_ACTION"],
    ["RENEW_ACTIVATION_NOT_AVAILABLE", "INVALID_ACTION"],
    ["WRONG_ACTIVATION_ID", "INVALID_ACTION"],
    ["NEW_ACTIVATION_IMPOSSIBLE", "INVALID_ACTION"],
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["INVALID_ACTIVATION_ID", "INVALID_ACTIVATION"],
  ]),
  "sms-hub": new Map([
    ["BAD_KEY", "INVALID_API_KEY"],
    ["ERROR_SQL", "SYSTEM_ERROR"],
    ["BAD_ACTION", "INVALID_ACTION"],
    ["BAD_SERVICE", "INVALID_ACTION"],
    ["NO_ACTIVATION", "INVALID_ACTIVATION"],
    ["NO_NUMBERS", "NO_NUMBERS_AVAILABLE"],
    ["NO_BALANCE", "INSUFFICIENT_BALANCE"],
    ["WRONG_SERVICE", "INVALID_ACTION"],
  ]),
  "vak-sms": new Map([
    ["apiKeyNotFound", "INVALID_API_KEY"],
    ["noService", "INVALID_ACTION"],
    ["noNumber", "NO_NUMBERS_AVAILABLE"],
    ["noMoney", "INSUFFICIENT_BALANCE"],
    ["noCountry", "INVALID_ACTION"],
    ["noOperator", "INVALID_ACTION"],
    ["badStatus", "INVALID_STATUS"],
    ["idNumNotFound", "INVALID_ACTIVATION"],
    ["badService", "INVALID_ACTION"],
    ["badData", "INVALID_ACTION"],
  ]),
};


export const errorsKeys = {
  "sms-man": [
    "BAD_KEY",
    "NO_NUMBERS",
    "NO_BALANCE",
    "NO_ACTIVATION",
    "BAD_STATUS",
  ],
  "5sim": [
    "Status Code: 401 Unauthorized",
    "Status Code 400: order not found",
    "Status Code 400: order expired",
    "Status Code 400: order has sms",
    "Status Code 400: hosting order",
    "Status Code 400: order no sms",
    "Status Code: 500 internal error",
    "no free phones",
    "select operator",
    "not enough user balance",
    "bad country",
    "bad operator",
    "server offline",
    "not enough rating",
    "no product",
    "reuse not possible",
    "reuse false",
    "reuse expired",
    "Status Code: 400 country is incorrect",
    "Status Code: 400 product is incorrect",
  ],
  "sms-activation-service": [
    "NO_BALANCE",
    "NO_NUMBERS",
    "ACCESS_CANCEL",
    "ACCESS_RETRY_GET",
    "ACCESS_ACTIVATION",
    "CANNOT_BEFORE_2_MIN",
    "STATUS_WAIT_CODE",
    "STATUS_CANCEL",
    "BAD_ACTION",
    "BAD_KEY",
    "BAD_LANG",
    "NO_ACTIVATION",
    "ERROR_SQL",
    "ERROR_API",
  ],
  "sms-acktiwator": ["101", "102", "103", "201", "202", "203"],
  "sms-activate": [
    "BAD_ACTION",
    "BAD_KEY",
    "BAD_SERVICE",
    "BAD_STATUS",
    "ERROR_SQL",
    "OPERATORS_NOT_FOUND",
    "NO_ACTIVATIONS",
    "NO_ACTIVATION",
    "BANNED",
    "WRONG_EXCEPTION_PHONE",
    "RENEW_ACTIVATION_NOT_AVAILABLE",
    "WRONG_ACTIVATION_ID",
    "NEW_ACTIVATION_IMPOSSIBLE",
    "NO_BALANCE",
    "INVALID_ACTIVATION_ID",
  ],
  "sms-hub": [
    "BAD_KEY",
    "ERROR_SQL",
    "BAD_ACTION",
    "BAD_SERVICE",
    "NO_ACTIVATION",
    "NO_NUMBERS",
    "NO_BALANCE",
    "WRONG_SERVICE",
  ],
  "vak-sms": [
    "apiKeyNotFound",
    "noService",
    "noNumber",
    "noMoney",
    "noCountry",
    "noOperator",
    "badStatus",
    "idNumNotFound",
    "badService",
    "badData",
  ],
};

// List of country

export const countryListMap: Record<string, any[]> = {
  "sms-man": [],
  "5sim": [],
  "sms-activate": [],
  "sms-activation-service": [],
  "sms-acktiwator": [],
  "vak-sms": [
    { id: "ru", name: "Russia" },
    { id: "dk", name: "Denmark" },
    { id: "fi", name: "Finland" },
    { id: "fr", name: "France" },
    { id: "ge", name: "Georgia" },
    { id: "de", name: "Germany" },
    { id: "hk", name: "Hong Kong" },
    { id: "id", name: "Indonesia" },
    { id: "kz", name: "Kazakhstan" },
    { id: "la", name: "Laos" },
    { id: "lv", name: "Latvia" },
    { id: "lt", name: "Lithuania" },
    { id: "my", name: "Malaysia" },
    { id: "mx", name: "Mexico" },
    { id: "md", name: "Moldova" },
    { id: "nl", name: "Netherlands" },
    { id: "ph", name: "Phillipines" },
    { id: "pl", name: "Poland" },
    { id: "pt", name: "Portugal" },
    { id: "ro", name: "Romania" },
    { id: "es", name: "Spain" },
    { id: "se", name: "Sweden" },
    { id: "th", name: "Thailand" },
    { id: "ua", name: "Ukraine" },
    { id: "gb", name: "United Kingdom" },
    { id: "vn", name: "Vietnam" },
  ],
  "sms-hub": [
    { id: 0, name: "Russia" },
    { id: 1, name: "Ukraine" },
    { id: 2, name: "Kazakhstan" },
    { id: 3, name: "China" },
    { id: 4, name: "Philippines" },
    { id: 5, name: "Myanmar" },
    { id: 6, name: "Indonesia" },
    { id: 7, name: "Malaysia" },
    { id: 8, name: "Kenya" },
    { id: 9, name: "Tanzania" },
    { id: 10, name: "Vietnam" },
    { id: 11, name: "Kyrgyzstan" },
    { id: 12, name: "USA (virtual)" },
    { id: 13, name: "Israel" },
    { id: 14, name: "Hong Kong" },
    { id: 15, name: "Poland" },
    { id: 16, name: "England" },
    { id: 17, name: "Madagascar" },
    { id: 18, name: "Democratic Republic of Congo" },
    { id: 19, name: "Nigeria" },
    { id: 20, name: "Macao" },
    { id: 21, name: "Egypt" },
    { id: 22, name: "India" },
    { id: 23, name: "Ireland" },
    { id: 24, name: "Cambodia" },
    { id: 25, name: "Laos" },
    { id: 26, name: "Haiti" },
    { id: 27, name: "Ivory Coast" },
    { id: 28, name: "Gambia" },
    { id: 29, name: "Serbia" },
    { id: 30, name: "Yemen" },
    { id: 31, name: "South Africa" },
    { id: 32, name: "Romania" },
    { id: 33, name: "Colombia" },
    { id: 34, name: "Estonia" },
    { id: 35, name: "Azerbaijan" },
    { id: 36, name: "Canada" },
    { id: 37, name: "Morocco" },
    { id: 38, name: "Ghana" },
    { id: 39, name: "Argentina" },
    { id: 40, name: "Uzbekistan" },
    { id: 41, name: "Cameroon" },
    { id: 42, name: "Chad" },
    { id: 43, name: "Germany" },
    { id: 44, name: "Lithuania" },
    { id: 45, name: "Croatia" },
    { id: 46, name: "Sweden" },
    { id: 47, name: "Iraq" },
    { id: 48, name: "Netherlands" },
    { id: 49, name: "Latvia" },
    { id: 50, name: "Austria" },
    { id: 51, name: "Belarus" },
    { id: 52, name: "Thailand" },
    { id: 53, name: "Saudi Arabia" },
    { id: 54, name: "Mexico" },
    { id: 55, name: "Taiwan" },
    { id: 56, name: "Spain" },
    { id: 57, name: "Iran" },
    { id: 58, name: "Algeria" },
    { id: 59, name: "Slovenia" },
    { id: 60, name: "Bangladesh" },
    { id: 61, name: "Senegal" },
    { id: 62, name: "Turkey" },
    { id: 63, name: "Czech Republic" },
    { id: 64, name: "Sri Lanka" },
    { id: 65, name: "Peru" },
    { id: 66, name: "Pakistan" },
    { id: 67, name: "New Zealand" },
    { id: 68, name: "Guinea" },
    { id: 69, name: "Mali" },
    { id: 70, name: "Venezuela" },
    { id: 71, name: "Ethiopia" },
    { id: 72, name: "Mongolia" },
    { id: 73, name: "Brazil" },
    { id: 74, name: "Afghanistan" },
    { id: 75, name: "Uganda" },
    { id: 76, name: "Angola" },
    { id: 77, name: "Cyprus" },
    { id: 78, name: "France" },
    { id: 79, name: "Papua New Guinea" },
    { id: 80, name: "Mozambique" },
    { id: 81, name: "Nepal" },
    { id: 82, name: "Belgium" },
    { id: 83, name: "Bulgaria" },
    { id: 84, name: "Hungary" },
    { id: 85, name: "Moldova" },
    { id: 86, name: "Italy" },
    { id: 87, name: "Paraguay" },
    { id: 88, name: "Honduras" },
    { id: 89, name: "Tunisia" },
    { id: 90, name: "Nicaragua" },
    { id: 91, name: "Timor-Leste" },
    { id: 92, name: "Bolivia" },
    { id: 93, name: "Costa Rica" },
    { id: 94, name: "Guatemala" },
    { id: 95, name: "United Arab Emirates" },
    { id: 96, name: "Zimbabwe" },
    { id: 97, name: "Puerto Rico" },
    { id: 99, name: "Togo" },
    { id: 100, name: "Kuwait" },
    { id: 101, name: "El Salvador" },
    { id: 102, name: "Libya" },
    { id: 103, name: "Jamaica" },
    { id: 104, name: "Trinidad and Tobago" },
    { id: 105, name: "Ecuador" },
    { id: 106, name: "Eswatini" },
    { id: 107, name: "Oman" },
    { id: 108, name: "Bosnia and Herzegovina" },
    { id: 109, name: "Dominican Republic" },
    { id: 110, name: "Syria" },
    { id: 111, name: "Qatar" },
    { id: 112, name: "Panama" },
    { id: 113, name: "Cuba" },
    { id: 114, name: "Mauritania" },
    { id: 115, name: "Sierra Leone" },
    { id: 116, name: "Jordan" },
    { id: 117, name: "Portugal" },
    { id: 118, name: "Barbados" },
    { id: 119, name: "Burundi" },
    { id: 120, name: "Benin" },
    { id: 121, name: "Brunei" },
    { id: 122, name: "Bahamas" },
    { id: 123, name: "Botswana" },
    { id: 124, name: "Belize" },
    { id: 125, name: "Central African Republic" },
    { id: 126, name: "Dominica" },
    { id: 127, name: "Grenada" },
    { id: 128, name: "Georgia" },
    { id: 129, name: "Greece" },
    { id: 130, name: "Guinea-Bissau" },
    { id: 131, name: "Guyana" },
    { id: 132, name: "Iceland" },
    { id: 133, name: "Comoros" },
    { id: 134, name: "Saint Kitts and Nevis" },
    { id: 135, name: "Liberia" },
    { id: 136, name: "Lesotho" },
    { id: 137, name: "Malawi" },
    { id: 138, name: "Namibia" },
    { id: 139, name: "Niger" },
    { id: 140, name: "Rwanda" },
    { id: 141, name: "Slovakia" },
    { id: 142, name: "Suriname" },
    { id: 143, name: "Tajikistan" },
    { id: 144, name: "Monaco" },
    { id: 145, name: "Bahrain" },
    { id: 146, name: "Réunion" },
    { id: 147, name: "Zambia" },
    { id: 148, name: "Armenia" },
    { id: 149, name: "Somalia" },
    { id: 150, name: "Congo" },
    { id: 151, name: "Chile" },
    { id: 152, name: "Burkina Faso" },
    { id: 153, name: "Lebanon" },
    { id: 154, name: "Gabon" },
    { id: 155, name: "Albania" },
    { id: 156, name: "Uruguay" },
    { id: 157, name: "Mauritius" },
    { id: 158, name: "Bhutan" },
    { id: 159, name: "Maldives" },
    { id: 160, name: "Guadeloupe" },
    { id: 161, name: "Turkmenistan" },
    { id: 162, name: "French Guiana" },
    { id: 163, name: "Finland" },
    { id: 164, name: "Saint Lucia" },
    { id: 165, name: "Luxembourg" },
    { id: 166, name: "Saint Vincent and the Grenadines" },
    { id: 167, name: "Equatorial Guinea" },
    { id: 168, name: "Djibouti" },
    { id: 169, name: "Antigua and Barbuda" },
    { id: 170, name: "Cayman Islands" },
    { id: 171, name: "Montenegro" },
    { id: 172, name: "Denmark" },
    { id: 173, name: "Switzerland" },
    { id: 174, name: "Norway" },
    { id: 175, name: "Australia" },
    { id: 176, name: "Eritrea" },
    { id: 177, name: "South Sudan" },
    { id: 178, name: "São Tomé and Príncipe" },
    { id: 179, name: "Aruba" },
    { id: 180, name: "Montserrat" },
    { id: 181, name: "Anguilla" },
    { id: 183, name: "North Macedonia" },
    { id: 184, name: "Seychelles" },
    { id: 185, name: "New Caledonia" },
    { id: 186, name: "Cape Verde" },
    { id: 187, name: "United States" }, // Note: SMS-Hub code is "usaphysical"
    { id: 189, name: "Fiji" },
    { id: 196, name: "Singapore" },
  ],
};
