import axios, { Axios, AxiosError, AxiosResponse } from 'axios';

export default abstract class ControllerBase {
  protected token: string | null = null;
  private readonly baseUrl: string | undefined = undefined;
  private readonly $axios: Axios;

  constructor(baseUrl = '', nuxtAxios: Axios = axios) {
    this.baseUrl = baseUrl;
    this.$axios = nuxtAxios;
  }

  public async get<T>(path: string): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.get(`${this.baseUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }

  public async post<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.post(`${this.baseUrl}${path}`, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }

  public async put<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.put(`${this.baseUrl}${path}`, body, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }

  public async delete<T>(path: string): Promise<AxiosResponse<T> | undefined> {
    try {
      return await this.$axios.delete(`${this.baseUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }
}
