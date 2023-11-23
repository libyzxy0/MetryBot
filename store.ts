// Import the updated IState
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

  /**
   * Gets the instance of the Store class
   */
  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  /**
   * Activates the chatbot
   */
  wake_up() {
    this.state.is_awake = true;
  }

  /**
   * Deactivates the chatbot
   */
  sleep() {
    this.state.is_awake = false;
  }

  /**
   * Gets the current state
   */
  getState(): IState {
    return this.state;
  }

  /**
   * Updates object configurations
   */
  updateConfigs(newConfigs: Partial<IState["configs"]>) {
    this.state.configs = { ...this.state.configs, ...newConfigs };
  }
}

const store = Store.getInstance();
Object.freeze(store);

export default store;
