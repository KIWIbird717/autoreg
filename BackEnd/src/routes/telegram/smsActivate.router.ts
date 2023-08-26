import express, { Router, Request, Response } from "express";
import * as smsService from "../../utils/smsService/smsActivate";
import { checkService, countryListMap } from "../../utils/smsService/utils";

const router: Router = express.Router();

router.get("/get-service", (_req: Request, res: Response) => {
  res.status(200).json(smsService.serviceList);
});

router.get("/get-country", async (req: Request, res: Response) => {
  const service = await checkService(req.query.service as string);

  if (service === null) {
    return res.status(400).json({ error: "Incorrect service" });
  }

  // If the list is not empty for the given service, return the list from the map
  if (countryListMap[service].length !== 0) {
    return res.status(200).json(countryListMap[service]);
  }

  // If the list is empty for the given service, fetch the countries and store them
  const countries = await smsService.getCountry(service);
  countryListMap[service] = countries;

  // Return the list of countries for the given service
  res.status(200).json(countries);
});

router.get("/get-balance", async (req: Request, res: Response) => {
  const service = await checkService(req.query.service as string);
  if (service === null) {
    return res.status(400).json({ error: "Incorrect service" });
  }

  const balance = await smsService.getBalance(service);

  res.status(200).json(balance);
});

router.get("/get-available-phones", async (req: Request, res: Response) => {
  const service = await checkService(req.query.service as string);
  if (service === null) {
    return res.status(400).json({ error: "Incorrect service" });
  }

  const country: smsService.Country = {
    id: req.query.countryId as string,
    name: (req.query.countryName as string) || undefined,
  };

  if (country.id === "") {
    return res.status(400).json({ error: "Invalid or missing Country ID" });
  }

  const phones = await smsService.getAvailablePhones(service, country);
  res.status(200).json(phones);
});

export default router;
