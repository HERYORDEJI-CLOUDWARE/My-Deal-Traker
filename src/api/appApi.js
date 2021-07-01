import axios from "axios";

export default axios.create({
  baseURL: "https://mydealtracker.staging.cloudware.ng/api"
});
