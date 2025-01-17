import Logger from "../logger";
import moment from "moment";
import { SystemInfo } from "../systemInfo/systemInfo";
import osu from "os-utils";
import os from "os";
import { PluginApp } from "../plugin/basePlugin";
import { StatusPlugin } from "../plugin/plugins/statusPlugin";
import { JobPlugin } from "../plugin/plugins/jobPlugin";

interface NamedParam {}

export class NodeClient extends PluginApp {
  constructor({}: NamedParam) {
    super();
    this.plugins = [new StatusPlugin(), new JobPlugin()];
    Logger.info("Start server");
  }

  private async prepareSystemInfo(): Promise<SystemInfo[]> {
    let memoryFree = os.freemem();
    let sysUpTime = osu.sysUptime();
    let cpuUsage: number = await new Promise((resolve, reject) => {
      osu.cpuUsage((u) => {
        resolve(u);
      });
    });

    return [
      {
        title: "CPU",
        description: "CPU Usage",
        value: (cpuUsage * 100).toFixed(2),
        unit: "%",
      },
      {
        title: "Mem Free",
        description: "Memory Free",
        value: (memoryFree / 1024 / 1024 / 1024).toFixed(2),
        unit: "GB",
      },
      {
        title: "Up Time",
        description: "System Up Time",
        value: moment({}).seconds(sysUpTime).format("HH:mm:ss"),
        unit: "",
      },
    ];
  }
}
