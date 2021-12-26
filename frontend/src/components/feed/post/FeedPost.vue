<template>
  <q-card class="feed-post" bordered flat>
    <FeedPostHeader
      avatar="https://cdn.quasar.dev/img/avatar.png"
      :username="'username'"
      :color="'hsl(50,50,50)'"
      :is-viewer-followed="true"
    />

    <q-img
      :src="
        Math.random() < 0.5
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAD7CAMAAAD3qkCRAAAA2FBMVEWZ30D///+a4UCX4TS0vKyZ4jua4j2Fxi6Qr2+5wLKY4jiSsHOV4TH//P+R2jDa2Nv08ffCw8Dl4uh1siCds4fY1dx1sCS5v7P7+P7r6O5vrg9/wCV5uhp4qzmEySLg3eOFslKFrVeru5qO1TB9tjTr6+qlq56LnHqOmYN8oVO5t7qst6G5ubiHqGPJyMu7ubyhoKF0oD+Vr3t7qkJqfFhblgCytq16lVx8sjd2vACesYvw9O2WoYt1qDSEqVyGzSKcrYyoqqaPpXiMyjzV2dKju4qAoluVtXNVIqaZAAAEO0lEQVR4nO3aa1vaSByGcTKRqUYOARRBIJVyaF0qlrpLrdsVt3a33/8bLUIyOUjSCJiBa+/f5ZugmHmYzGT+E3I5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh/M31W6jdZ5mrp/8P2OcMD5X3ahlgfDlb7oC9K/tLwnZkp31WoGKv9VnjV1iYQpcpWk3zUlkTeNgLtOEqbpLR7fWKOjHWS7F6fiFZ1u0m09Un+ythuko9p/8OWidI41I7NR/y1pj6RnXA79vfqskbhdqwxdw3KIZ/0XF2i3dy4TyZvQnqv2uBY1mdj4yQ3eRH0qu2N1ytvnqSuq/FB8iY6Xvc1iXkQTfLyWbjY3oEkomYvW2Nv0CfF8x1IYp24rfndjk0ivQpKhl9Xs3Bz3iciJ/XGmbn3d/uP2CTycjocTqfzny/hKKpP7La0Ss5tyylZ2tLIiduYytfYJPlj7zcn4VpQJSm3anfjqt18W7nr6MpSOHMbc79Jkj+/qfqmMWzlM2y/Is7dJjSdlkoSnbt+nSSk+peOKKY33qeFllqzvLxPIlFuIzNDFhzv/n6R96ut1Eniqt+xk2GEJXnvnrs8E2skiV3Vf8n8+lIf6oMl2imS3KVMUs66U2TfHe/Fjkzsk2JjoZjQJ8VycC9gkvFIsR68C7sXrFKiScRjzfUmfK8IJBl3nNnEX1R/y7jUct66J/5s5UTLO3i+gowrPPwk46ebiOWvqsfZ1lpqC7VRE0l9EitYaeVCO5nNTBfH/okrhdCeV+ok5qfTpb9Li4b7U0Ojk+VAEZ2ie957U8rg/aQgZbp1ba/kWh4GiraLLJNY79yz2pfduUu1WqlM5oedVFHCw0fUVZKuliQrPazxCETU1adxn+W9MTnJyWZJvu9XkujsLPoqydV+JenXPcsooq7KlB0aJ79OInrjhm3Pf+zG9XLyClxdu5pk5T1e9PxbfMFNot6e7Sw8WhlhRZLHvusxGEWUjlQSr0+8F4o3WSaRl4dBx+oa/3E1Pwo0RR7ag0FzMBjY4RnJVEl+zJZ/2PVesGuZ7kvIfID1NXCPnx8HPtO4Ssvv1OpykWz9o17IvmpU1qgZ8z/VxbTYgwysICslfbt4CWvhuCTyQo2qw6fLTt56CznjncbvewTqk7RJxLm/VJtJIR2/8Mp06opYo09y5lQ1/azT7/pBqo7GLeJ19laCT7+L/l6/YQw1PcVeWCdJzjk1VrH7OnftE5LIf49c0XWhdbwyyUhnlyRXv15p+Oyj7q3a8TrVOUqeRrxKkvrp3NMTsfHzIDWNE1cucRZOIlvXkSDjut4gi1m4uGBMX3KZy9n34Oaj/d7RHGSudu6qvex9Vqs7GlebA7tZnv5s6fwyp2ftrzgIafacdrvtzMz8DjwD3pTGL3kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2HP/AUzWTm8OcTk6AAAAAElFTkSuQmCC'
          : 'https://via.placeholder.com/1080x1080/eee?text=1:1'
      "
    />

    <FeedPostActions />
    <FeedPostInfo :description="'124124124'" :likes="5" :comments="[]" :created-at="Date.now()" />
    <FeedPostCommentInput />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import FeedPostHeader from 'components/feed/post/FeedPostHeader.vue';
import FeedPostInfo from 'components/feed/post/FeedPostInfo.vue';
import FeedPostActions from 'components/feed/post/FeedPostActions.vue';
import FeedPostCommentInput from 'components/feed/post/FeedPostCommentInput.vue';

import { PostModel } from 'src/models/post/post.model';

export default defineComponent({
  name: 'FeedPost',

  components: {
    FeedPostHeader,
    FeedPostInfo,
    FeedPostActions,
    FeedPostCommentInput,
  },

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-post {
  background: white;
  width: 100%;
}
</style>
