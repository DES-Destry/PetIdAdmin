export class AdminDto {
  username: string = '';
  createdAt: Date = new Date();
  isNotCapable: boolean = true;
  passwordLastChangedAt: Date | null = null;
}
