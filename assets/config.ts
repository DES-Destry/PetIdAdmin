import 'dotenv';

export default class Config {
  public static readonly Environment = process.env.NODE_ENV;
  public static readonly BaseUrl = process.env.BASE_URL;

  public static readonly ApiBaseUrl = process.env.VUE_APP_API_BASE_URL;
}
