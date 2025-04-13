
import { saveUserInfo } from '../redux/action';
import store from '../redux/store';

const TokenProvider = {
  getToken: () => {
    const {userReducer} = store.getState();
    return userReducer?.data?.token || '';
  },
  clearToken: async () => {
    store.dispatch(saveUserInfo({}));
  },
  logOut:() => {
    try {
      store.dispatch(saveUserInfo(null));
    } catch (error) {
      console.log(error);
    }
  },
  
};

export default TokenProvider;
