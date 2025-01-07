import axios from "axios";
import server_url from "./server_url";
export default axios.create({
  baseURL: server_url,
});
