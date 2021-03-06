import { attrTypes } from "../functions/attrTypes";
import { formatJson } from "../functions/formatJson";

module.exports = {
  getResultFields: async (req, res) => {
    let fields = {};
    let status = {};
    try {
      fields = await attrTypes({ ...req.query });
      status = { success: true };
    } catch {
      status = { success: false, error: "Unable to fetch fields" };
    }
    let response = { status, fields };
    return res.status(200).send(formatJson(response, req.query.indent));
  },
};
