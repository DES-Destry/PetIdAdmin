import axios, { AxiosError, AxiosResponse } from 'axios';
import Config from '@/assets/config';

export default abstract class ControllerBase {
  private static baseFutuructaUrl = Config.ApiBaseUrl;
  protected static token: string | null;

  public static async get<T>(
    path: string,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await axios.get(`${this.baseFutuructaUrl}${path}`, {
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

  public static async post<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await axios.post(`${this.baseFutuructaUrl}${path}`, body, {
        headers: {
          'X-Version': '999999.0.0',
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }

  public static async put<T>(
    path: string,
    body: unknown = null,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await axios.put(`${this.baseFutuructaUrl}${path}`, body, {
        headers: {
          'X-Version': '999999.0.0',
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }

  public static async delete<T>(
    path: string,
  ): Promise<AxiosResponse<T> | undefined> {
    try {
      return await axios.delete(`${this.baseFutuructaUrl}${path}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'X-Version': '999999.0.0',
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        return err.response;
      }
    }
  }
}
