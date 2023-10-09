import axios, { AxiosError, AxiosResponse } from 'axios';

export default abstract class ControllerBase {
  private readonly baseUrl: string | undefined = undefined;
  protected token: string | null = null;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  public async get<T>(path: string): Promise<AxiosResponse<T> | undefined> {
    try {
      return await axios.get(`${this.baseUrl}${path}`, {
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
      return await axios.post(`${this.baseUrl}${path}`, body, {
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
      return await axios.put(`${this.baseUrl}${path}`, body, {
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
      return await axios.delete(`${this.baseUrl}${path}`, {
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
