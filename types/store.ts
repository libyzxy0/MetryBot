// Update IState to include object configurations
export interface IState {
  is_awake: boolean;
  configs: {
    anti_unsend: boolean;
    shoti_cron: boolean;
  };
}
