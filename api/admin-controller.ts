import ControllerBase from '~/api/controller-base';
import { AdminDto } from '~/api/dto/admin.dto';
import { LoginDto } from '~/api/dto/login.dto';
import LS from '~/store/constants/LS';
import { PasswordChangedDto } from '~/api/dto/password-changed.dto';
import { GetAllTagsResponseDto, TagFullInfoDto } from '~/api/dto/tag.dto';
import { CreateTagsDto } from '~/api/dto/create-tags.dto';
import { VoidResponseDto } from '~/api/dto/void-response.dto';
import { Report } from '~/api/dto/reports.dto';

export class AdminController extends ControllerBase {
  public setToken(token: string | null): void {
    this.token = token;
  }

  public async auth() {
    return await this.get<AdminDto>('/api/admin/auth');
  }

  public async login(username: string, password: string) {
    const response = await this.post<LoginDto>('/api/admin/login', {
      username,
      password,
    });

    if (ControllerBase.isSuccess(response?.status ?? 500)) {
      this.token = response?.data?.accessToken ?? null;
      localStorage.setItem(LS.AccessToken, this.token ?? '');
    }

    return response;
  }

  public async changePassword(oldPassword: string, newPassword: string) {
    const response = await this.put<PasswordChangedDto>('/api/admin/password', {
      oldPassword,
      newPassword,
    });

    if (ControllerBase.isSuccess(response?.status ?? 500)) {
      this.token = response?.data?.accessToken ?? null;
      localStorage.setItem(LS.AccessToken, this.token ?? '');
    }

    return response;
  }

  public async getAllTags() {
    return await this.get<GetAllTagsResponseDto>('/api/admin/tag/all');
  }

  public async getTagById(id: number) {
    return await this.get<TagFullInfoDto>(`/api/admin/tag/${id}`);
  }

  public async createTags(dto: CreateTagsDto) {
    return await this.post<VoidResponseDto>('/api/admin/tags', dto);
  }

  public async getAllReports(input?: { isResolved?: boolean }) {
    if (input.isResolved === null || input.isResolved === undefined)
      return await this.get<Report>(`/api/admin/report/tag/all`);

    return await this.get<Report>(
      `/api/admin/report/tag/all?isResolved=${input.isResolved}`,
    );
  }
}
