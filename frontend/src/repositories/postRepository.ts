import { http } from 'boot/axios';
import { PostDTO, PostModel } from 'src/models/feed/post.model';
import { ApiResponseModel } from 'src/models/common/apiResponse.model';
import { CommentDTO, CommentModel } from 'src/models/feed/comment.model';
import { UserModel } from 'src/models/user/user.model';

export default {
  async getAll({ page = 1, limit = 10 } = { page: 1, limit: 10 }): Promise<PostModel[]> {
    const { data }: ApiResponseModel<PostModel[]> = await http.get('/posts', { params: { page, limit } });
    return data;
  },

  async getByID(id: number): Promise<PostModel> {
    const { data }: ApiResponseModel<PostModel> = await http.get(`/posts/${id}`);
    return data;
  },
  async getComments(id: number): Promise<CommentModel[]> {
    const { data }: ApiResponseModel<CommentModel[]> = await http.get(`/posts/comments/${id}`);
    return data;
  },
  async getLikes(id: number): Promise<UserModel[]> {
    const { data }: ApiResponseModel<UserModel[]> = await http.get(`/posts/likes/${id}`);
    return data;
  },

  async create(payload: FormData): Promise<PostModel> {
    const { data }: ApiResponseModel<PostModel> = await http.post('/posts', payload);
    return data;
  },
  async update(id: number, postData: Partial<PostDTO>): Promise<PostModel> {
    const { data }: ApiResponseModel<PostModel> = await http.patch(`/posts/${id}`, postData);
    return data;
  },
  async delete(id: number): Promise<void> {
    return await http.delete(`/posts/${id}`);
  },

  async share(id: number): Promise<void> {
    return await http.post(`/posts/share/${id}`);
  },

  async toggleLike(id: number): Promise<void> {
    return await http.post(`/posts/like/${id}`);
  },

  async createComment(payload: CommentDTO): Promise<CommentModel> {
    const { data }: ApiResponseModel<CommentModel> = await http.post('/posts/comment', payload);
    return data;
  },
  async reportComment(id: number, reasonID: number): Promise<CommentModel> {
    return await http.post('/posts/comment/${id}', { reasonID });
  },
  async updateComment(id: number, text: string): Promise<CommentModel> {
    const { data }: ApiResponseModel<CommentModel> = await http.patch(`/posts/comment/${id}`, { text });
    return data;
  },
  async deleteComment(id: number): Promise<void> {
    return await http.delete(`/posts/comment/${id}`);
  },
};
