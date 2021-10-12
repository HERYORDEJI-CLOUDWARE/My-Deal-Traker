import axios from "axios";

export default axios.create({
  baseURL: "https://mydealtracker.staging.cloudware.ng/api",
});

export const baseUri = "https://mydealtracker.staging.cloudware.ng/";

export const demoMeLink =
  "https://mydealtracker.staging.cloudware.ng/api/fetch_transaction_for_buyer.php?buyer_email=heryordejy.cloudware@gmail.com";
