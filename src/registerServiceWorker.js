import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New update available. Refresh page to update.');
  },
  onOfflineReady() {
    console.log('App is ready for offline use.');
  },
});

export default updateSW;
