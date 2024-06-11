import ControllerBase from '~/api/controller-base';
import { AdminDto } from '~/api/dto/admin.dto';
import { LoginDto } from '~/api/dto/login.dto';
import LS from '~/store/constants/LS';
import { PasswordChangedDto } from '~/api/dto/password-changed.dto';
import { GetAllTagsResponseDto, TagFullInfoDto } from '~/api/dto/tag.dto';
import { CreateTagsDto } from '~/api/dto/create-tags.dto';
import { VoidResponseDto } from '~/api/dto/void-response.dto';
import { ReportsDto } from '~/api/dto/reports.dto';

export class AdminController extends ControllerBase {
  public setToken(token: string | null): void {
    this.token = token;
  }

  public async auth() {
    return await this.get<AdminDto>('/admin/auth');
  }

  public async login(username: string, password: string) {
    const response = await this.post<LoginDto>('/admin/login', {
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
    const response = await this.put<PasswordChangedDto>('/admin/password', {
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
    return await this.get<GetAllTagsResponseDto>('/admin/tags');
  }

  public async getTagById(id: number) {
    return await this.get<TagFullInfoDto>(`/admin/tags/${id}`);
  }

  public async createTags(dto: CreateTagsDto) {
    return await this.post<VoidResponseDto>('/admin/tags', dto);
  }

  public async clearTag(tagId: number) {
    return await this.post<VoidResponseDto>(`/admin/tags/${tagId}/clear`);
  }

  public async getAllReports(input?: { isResolved?: boolean; tagId?: number }) {
    return await this.get<ReportsDto>(
      `/admin/tags/reports${this.buildQuery(input)}`,
    );
  }

  public async resolveReport(reportId: string) {
    return await this.post<VoidResponseDto>(
      `/admin/reports/${reportId}/resolve`,
    );
  }

  private buildQuery(queries: Record<string, any>): string {
    if (!queries) return '';

    const strings = [];
    for (const query in queries) {
      strings.push(`${query}=${queries[query]}`);
    }

    if (strings.length === 0) return '';

    return `?${strings.join('&')}`;
  }
}
