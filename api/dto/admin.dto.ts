export class AdminDto {
  username: string = '';
  createdAt: Date = new Date();
  isCapable: boolean = false;
  passwordLastChangedAt: Date | null = null;
}
