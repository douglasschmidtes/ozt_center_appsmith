export default {
  setStatus(text, progress) {
    storeValue('cb_status', { text, progress });
  },
  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
}
