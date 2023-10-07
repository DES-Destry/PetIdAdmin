export default class LS {
  static AccessToken = 'accessToken';
  static AdminId = 'adminId';
  static Username = 'username';

  static deleteAuthData() {
    localStorage.removeItem(this.AccessToken);
    localStorage.removeItem(this.AdminId);
    localStorage.removeItem(this.Username);
  }
}
