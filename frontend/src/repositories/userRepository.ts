import { http } from 'boot/axios';
import { UserDTO, UserModel, UserSuggestionModel } from 'src/models/user/user.model';
import { ApiResponseModel } from 'src/models/common/apiResponse.model';
import { PublicFileModel } from 'src/models/common/public-file.model';
import { TagModel } from 'src/models/feed/tag.model';

export default {
  async getUsers(search = ''): Promise<UserModel[]> {
    const params = {
      search,
    };
    const { data }: ApiResponseModel<UserModel[]> = await http.get('/user', { params });
    return data;
  },

  async isUsernameTaken(username: string | number): Promise<boolean> {
    const params = { username };
    const { data }: ApiResponseModel<boolean> = await http.get('/user/is-username-taken', { params });
    return data;
  },
  async isEmailTaken(email: string | number): Promise<boolean> {
    const params = { email };
    const { data }: ApiResponseModel<boolean> = await http.get('/user/is-email-taken', { params });
    return data;
  },

  async getProfileByUsername(username: string): Promise<UserModel> {
    const { data }: ApiResponseModel<UserModel> = await http.get(`/user/${username}`);
    return data;
  },

  async update(id: number, payload: UserDTO): Promise<UserModel> {
    const { data }: ApiResponseModel<UserModel> = await http.patch(`/user/${id}`, payload);
    return data;
  },
  async uploadAvatar(file: File): Promise<PublicFileModel> {
    const form = new FormData();
    form.append('file', file);
    const { data }: ApiResponseModel<PublicFileModel> = await http.post('/user/avatar', form);
    return data;
  },

  async confirmEmail(token: string): Promise<boolean> {
    const { data }: ApiResponseModel<boolean> = await http.post('/email-verification', { token });
    return data;
  },
  async resendEmailConfirmation(): Promise<void> {
    const { data }: ApiResponseModel<void> = await http.post('/email-verification/resend');
    return data;
  },

  async sendEmailChange(id: number): Promise<void> {
    await http.post('/user/change-email', id);
  },
  async validateEmailChangeCode(id: number, code: number | string): Promise<void> {
    await http.post('/user/change-email-validate-code', { id, code });
  },

  async follow(id: number): Promise<void> {
    await http.post(`/user/follow/${id}`);
  },
  async unfollow(id: number): Promise<void> {
    await http.post(`/user/unfollow/${id}`);
  },

  async getSuggestions({ page = 1, limit = 3 } = { page: 1, limit: 3 }): Promise<UserSuggestionModel[]> {
    const { data }: ApiResponseModel<UserSuggestionModel[]> = await http.get('/user/suggestions', {
      params: { page, limit },
    });
    return data;
  },

  async getRecentSearch(): Promise<
    ((UserModel & { recentSearchID: number }) | (TagModel & { recentSearchID: number }))[]
  > {
    const {
      data,
    }: ApiResponseModel<((UserModel & { recentSearchID: number }) | (TagModel & { recentSearchID: number }))[]> =
      await http.get('/user/recent-search');
    return data;
  },
  async addRecentSearch(id: number, type: 'user' | 'tag'): Promise<number> {
    const { data }: ApiResponseModel<number> = await http.post('/user/recent-search', { id, type });
    return data;
  },
  async removeRecentSearch(id: number): Promise<void> {
    await http.delete(`/user/recent-search/${id}`);
  },
};
