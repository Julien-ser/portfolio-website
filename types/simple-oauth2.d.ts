declare module 'simple-oauth2' {
  export class OAuth2 {
    static create(config: any): OAuth2;
    getAccessToken(refreshToken: { refresh_token: string }): Promise<{
      token: {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        [key: string]: any;
      };
    }>;
  }
}
