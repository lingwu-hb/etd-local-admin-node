import axios from "axios";
import jwt from "jsonwebtoken";
import { Config } from "../config";
import Logger from "../logger";

type Channel = "node-info" | "request-job" | "submit-result" | "health";

export class RemoteAdminClient {
  config = Config.fromEnvironment();

  private getURL(channel: Channel) {
    if (channel === "node-info") {
      return "/api/v1/device/status/send-status";
    } else if (channel === "request-job") {
      return "/api/v1/device/job/get-job";
    } else if (channel === "submit-result") {
      return "/api/v1/device/result/submit-result";
    } else if (channel === "health") {
      return "/api/v1/health";
    }
  }

  private getMethod(channel: Channel) {
    if (channel === "node-info") {
      return "POST";
    } else if (channel === "request-job") {
      return "GET";
    } else if (channel === "submit-result") {
      return "POST";
    } else if (channel === "health") {
      return "GET";
    }
  }

  private getAuthenticationToken(authData: string) {
    const jwtToken = jwt.sign(
      { user: authData },
      this.config.remoteAdminPassword
    );
    return `Bearer ${jwtToken}`;
  }

  async emit(
    channel: Channel,
    data: any,
    authData: string,
    throwError?: boolean
  ) {
    try {
      const url = new URL(this.getURL(channel), this.config.remoteAdminURL);
      const method = this.getMethod(channel);
      const token = this.getAuthenticationToken(authData);
      if (method === "POST") {
        let response = await axios.post(url.toString(), data, {
          headers: { Authorization: token },
        });
        return response.data;
      } else if (method === "GET") {
        let response = await axios.get(url.toString(), {
          headers: { Authorization: token },
          data: data,
        });
        return response.data;
      }
    } catch (e) {
      if (throwError) {
        throw e;
      }
      Logger.error(`${e}: ${e.data}`);
    }
  }
}
