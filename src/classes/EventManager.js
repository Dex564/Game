export class EventManager {
  constructor() {
    this.emitter = new Phaser.Events.EventEmitter();
  }
  
  static getInstance() {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }
  
  emit(event, data) {
    this.emitter.emit(event, data);
  }
  
  on(event, callback, context) {
    this.emitter.on(event, callback, context);
  }
  
  off(event, callback, context) {
    this.emitter.off(event, callback, context);
  }
}