import { http } from 'boot/axios';
import { PostDTO, PostModel } from 'src/models/feed/post.model';
import { ApiResponseModel } from 'src/models/common/apiResponse.model';

export default {
  async getAll({ page = 1, limit = 5 } = { page: 1, limit: 5 }): Promise<PostModel[]> {
    const { data }: ApiResponseModel<PostModel[]> = await http.get('/posts', { params: { page, limit } });
    return data;
  },
  async getByID(id: number): Promise<PostModel> {
    const { data }: ApiResponseModel<PostModel> = await http.get(`/posts/${id}`);
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
};
