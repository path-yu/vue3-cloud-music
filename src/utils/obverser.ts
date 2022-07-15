class Observer {
  subscribes:{
    [key:string]:Function[]
  };
  constructor() {
    //储存订阅者
    this.subscribes = {};
  }
  //订阅
  on(name:string, callback:(...data: any) => void) {
    // 如果不存在这个订阅者就添加这个订阅者
    if (!this.subscribes[name]) {
      this.subscribes[name] = [];
    }
    this.subscribes[name].push(callback);
  }
  // 发布
  emit(name:string, ...data: any[]) {
    // 如果不存在这个订阅者就打断函数执行
    if (!this.subscribes[name]) throw new Error('未找到订阅者');
    this.subscribes[name].forEach(fn => fn(...data));
  }
}

export default new Observer();