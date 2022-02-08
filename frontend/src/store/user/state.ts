import { UserModel, UserSuggestionModel } from 'src/models/user/user.model';

export interface UserStateInterface {
  currentUser: UserModel | null;
  token: string | null;
  refreshToken: string | null;
  suggestions: UserSuggestionModel[] | null;
}

function state(): UserStateInterface {
  return {
    currentUser: null,
    token: null,
    refreshToken: null,
    suggestions: null,
  };
}

export default state;
