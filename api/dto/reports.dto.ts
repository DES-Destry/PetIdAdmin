import { AdminDto } from '~/api/dto/admin.dto';
import { TagReviewDto } from '~/api/dto/tag.dto';

export class Report {
  id: string;
  corruptedTag: TagReviewDto;
  reporter: AdminDto;
  resolver?: AdminDto;
  isResolved: boolean;
  createdAt: Date;
}

export class ReportsDto {
  reports: Report[];
}
