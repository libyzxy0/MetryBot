import { IState } from "./types";

class Store {
  private static instance: Store;
  private state: IState;

  private constructor() {
    this.state = {
      is_awake: true,
      configs: {
        anti_unsend: false,
        shoti_cron: false,
      },
    };
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }
  wake_up() {
    this.state.is_awake = true;
  }

  sleep() {
    this.state.is_awake = false;
  }

  getState(): IState {
    return this.state;
  }
  updateConfigs(newConfigs: Partial<IState["configs"]>) {
    this.state.configs = { ...this.state.configs, ...newConfigs };
  }
}

const store = Store.getInstance();
Object.freeze(store);

export default store;
