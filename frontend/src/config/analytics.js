/* eslint-disable */
export default {
  logEvent(category, action, label, sessionId = null) {
    window.dataLayer.push({
      appEventCategory: category,
      appEventAction: action,
      appEventLabel: label,
      sessionId: sessionId,
    });
    window.dataLayer.push({ event: 'appEvent' });
  },

  logPage(path, name, sessionId = null) {
    window.dataLayer.push({
      screenPath: path,
      screenName: name,
      sessionId: sessionId,
    });
    window.dataLayer.push({ event: 'appScreenView' });
  },
};
