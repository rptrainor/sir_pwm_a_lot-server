import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

class Breaches extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://haveibeenpwned.com/api/v3/breachedaccount";
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set("hibp-api-key", process.env.HIBP_API_KEY || '');
  }

  async getBreaches(email = "") {
    const breaches = await this.get(`/${email}`);

    return breaches;
  }
}

export default Breaches;