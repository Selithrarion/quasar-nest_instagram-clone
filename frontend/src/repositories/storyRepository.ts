import { http } from 'boot/axios';
import { ApiResponseModel } from 'src/models/common/apiResponse.model';
import { StoryDTO, StoryModel } from 'src/models/feed/story.model';

export default {
  async getAll({ page = 1, limit = 5 } = { page: 1, limit: 5 }): Promise<StoryModel[]> {
    const { data }: ApiResponseModel<StoryModel[]> = await http.get('/story', { params: { page, limit } });
    return data;
  },
  async getByID(id: number): Promise<StoryModel> {
    const { data }: ApiResponseModel<StoryModel> = await http.get(`/story/${id}`);
    return data;
  },
  async create(payload: FormData): Promise<StoryModel> {
    const { data }: ApiResponseModel<StoryModel> = await http.post('/story', payload);
    return data;
  },
  async update(id: number, postData: Partial<StoryDTO>): Promise<StoryModel> {
    const { data }: ApiResponseModel<StoryModel> = await http.patch(`/story/${id}`, postData);
    return data;
  },
  async delete(id: number): Promise<void> {
    return await http.delete(`/story/${id}`);
  },
};
