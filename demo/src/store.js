import { configureStore } from '@reduxjs/toolkit';
import blockchainReducer from './reducer/blockchain';

export default configureStore({
  reducer: {
    blockchain: blockchainReducer,
  },
});