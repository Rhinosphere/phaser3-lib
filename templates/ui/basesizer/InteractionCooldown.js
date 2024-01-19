export default {
  updateLastInteraction() {
    this.lastInteraction = Date.now();
  },

  isAllowed() {
    const currentTime = Date.now();
    return currentTime - this.lastInteraction < this.interactionCooldown ? false : true;
  }
}
