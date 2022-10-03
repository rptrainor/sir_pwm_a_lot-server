import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

class PwnSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.PWN_SOURCE_BASE_URL || '';
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set("hibp-api-key", process.env.HIBP_API_KEY || '');
  }

  async getBreachedAccount(email = "", includeUnverified = true, domain = "") {
    const breaches = await this.get(`breachedaccount/${email}`, {
      includeUnverified,
      domain,
    });
    return breaches;
  }

  async getBreaches(domain = "") {
    const breaches = await this.get(`breaches`, { domain });
    return breaches;
  }

  async getBreach(name = "") {
    const breach = await this.get(`breach/${name}`);
    return breach;
  }

  async getPasteAccount(email = "") {
    const pastes = await this.get(`pasteaccount/${email}`);
    return pastes;
  }

  async getPwnedPasswords(passwordHashFirstFiveChar = "") {
    const pwned = await this.get(`range/${passwordHashFirstFiveChar}`);
    return pwned;
  }

}

export default PwnSource;