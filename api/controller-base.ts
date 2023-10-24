import axios, { Axios, AxiosError, AxiosResponse, HttpStatusCode } from 'axios';

export default abstract class ControllerBase {
  protected token: string | null = null;
  private readonly $axios: Axios;

  constructor(
    nuxtAxios: Axios = axios.create({ baseURL: process.env.API_BASE_URL }),
  ) {
    this.$axios = nuxtAxios;
  }

  public async get<T>(path: string): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.get(path, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
      throw err;
    }
  }

  public async post<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.post(path, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
      throw err;
    }
  }

  public async put<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.put(path, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
      throw err;
    }
  }

  public async delete<T>(path: string): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.delete(path, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
      throw err;
    }
  }

  public static isSuccess(status: number) {
    return status === HttpStatusCode.Ok || status === HttpStatusCode.Created;
  }
}
