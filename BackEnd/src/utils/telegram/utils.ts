export function generateRandomPassword(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

import axios from "axios";

export async function testProxyConnectivity(proxySettings) {
  async function tryProtocol(protocol) {
    try {
      const response = await axios.get("https://api.ipify.org?format=json", {
        proxy: {
          protocol: protocol,
          host: proxySettings.ip,
          port: proxySettings.port,
          auth: {
            username: proxySettings.username,
            password: proxySettings.password,
          },
        },
        timeout: 5000, // Set a short timeout, e.g., 5 seconds
      });

      // If the request is successful, the proxy is working
      return true;
    } catch (error) {
      // If there's an error or timeout, the proxy is not working
      return false;
    }
  }

  // Try SOCKS4 and SOCKS5 protocols
  const protocols = ["socks4", "socks5"];
  for (const protocol of protocols) {
    const isConnected = await tryProtocol(protocol);
    if (isConnected) {
      // If the proxy is working with the current protocol, return true
      return true;
    }
  }

  // If none of the protocols worked, return false
  return false;
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let formattedNumber = phoneNumber.replace(/\D/g, "");

  // Optionally add a leading '1' if your application is US-centric
  if (formattedNumber.length === 10) {
    formattedNumber = "1" + formattedNumber;
  }

  return formattedNumber;
}