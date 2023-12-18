export class TagReviewDto {
  id: number = -1;
  isAlreadyInUse: boolean = false;
  createdAt: Date = new Date(-1);
}

export class GetAllTagsResponseDto {
  tags: TagReviewDto[] = [];
}

export class TagFullInfoDto {
  id: number = -1;
  publicCode: string = 'undefined';
  controlCode: number = -1;
  isAlreadyInUse: boolean = false;
  createdAt: Date = new Date(-1);
  petAddedAt: Date | null = null;
  lastScannedAt: Date | null = null;
}
