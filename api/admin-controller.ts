import ControllerBase from '~/api/controller-base';
import { AdminDto } from '~/api/dto/admin.dto';
import { LoginDto } from '~/api/dto/login.dto';
import LS from '~/store/constants/LS';

export class AdminController extends ControllerBase {
  public setToken(token: string | null): void {
    this.token = token;
  }

  public async auth() {
    return await this.get<AdminDto>('/api/admin/auth');
  }

  public async login(
    username: string,
    password: string,
  ): Promise<any | undefined> {
    const response = await this.post<LoginDto>('/api/admin/login', {
      username,
      password,
    });

    if (response?.status === 200) {
      this.token = response?.data?.accessToken;
      localStorage.setItem(LS.AccessToken, this.token);
    }

    return response;
  }
}
