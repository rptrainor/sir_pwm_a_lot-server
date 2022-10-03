import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

class PsswrdSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PSSWRD_SOURCE_BASE_URL || '';
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set("hibp-api-key", process.env.HIBP_API_KEY || '');
  }

  async getPwnedPasswords(passwordHashFirstFiveChar = "") {
    const pwned = await this.get(`/${passwordHashFirstFiveChar}`);
    return pwned;
  }

}

export default PsswrdSource;