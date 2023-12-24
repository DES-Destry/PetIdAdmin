export class TagReviewDto {
  id: number;
  isAlreadyInUse: boolean;
  createdAt: Date;
}

export class GetAllTagsResponseDto {
  tags: TagReviewDto[];
}

export class TagFullInfoDto {
  id: number;
  publicCode: string;
  controlCode: string;
  isAlreadyInUse: boolean;
  createdAt: Date;
  petAddedAt: Date | null;
  lastScannedAt: Date | null;
}
