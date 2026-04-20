import { statusService } from "../services/statusService.js";
import { send } from "../lib/response.js";

export const statusController = (req, res) => {
  const data = statusService();
  send(res, data, 200);
};
