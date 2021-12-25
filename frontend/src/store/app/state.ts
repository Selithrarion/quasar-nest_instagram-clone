export interface AppStateInterface {
  isLoadingState: boolean;
}
function state(): AppStateInterface {
  return {
    isLoadingState: false,
  };
}

export default state;
