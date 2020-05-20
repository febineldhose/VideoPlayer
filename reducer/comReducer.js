const init = {
  vidID: [],
  storeItem: [],
  store_channels: [],
  loader: '',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'reset': //to pass videoIds
      return {
        vidID: action.payload,
        storeItem: state.storeItem,
        store_channels: state.store_channels,
        loader: state.loader,
      };
    case 'keys':
      return {
        vidID: state.vidID,
        storeItem: action.payload,
        store_channels: state.store_channels,
        loader: state.loader,
      };
    case 'pass_channel':
      return {
        vidID: state.vidID,
        storeItem: state.storeItem,
        store_channels: action.payload,
        loader: state.loader,
      };
    case 'loading':
      return {
        vidID: state.vidID,
        storeItem: state.storeItem,
        store_channels: state.store_channels,
        loader: action.payload,
      };
  }
};
export {reducer, init};
