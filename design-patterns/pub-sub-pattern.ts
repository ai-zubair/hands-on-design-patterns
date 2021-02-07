import { curry } from '../bits-and-pieces/n-arity-currying';

interface SubscriptionCallback{
  (topicName: string, topicData: any): void;
}

interface Subscription{
  subscriptionID: string;
  callback:       SubscriptionCallback;
}

interface PubSubTopic{
  subscribers:    number;
  subscriptions:  Subscription[];
}

interface PubSubTopicsChannel{
  [topicName: string]: PubSubTopic;
}

interface SubscriptionIdentifier{
  topicName:      string;
  subscriptionID: string;
}

type SubscriptionIndex = number;

interface PublishSubscribe{
  publish:      (topicName: string, topicData: any)=> boolean;
  subscribe:    (topicName: string, callback: SubscriptionCallback)=> SubscriptionIdentifier;
  unsubscribe:  (SubscriptionIdentifier: SubscriptionIdentifier)=> Subscription | undefined;
}

class PubSub implements PublishSubscribe{

  /* Each subscription gets an ID , Useful for un-subscribing */
  private subscriptionID: number = 0;

  /* Topics and their subscriptions live here */
  private topicsChannel: PubSubTopicsChannel = {};

  /* utility members */
  private getSubscriptionCallbackInvoker = curry(this.invokeSubscriptionCallback);
  private getSubscriptionIDMatcher = curry(this.checkIDMatchesSubscription);

  constructor() {};

  /* publish data to topicName and return true if a success */
  public publish(topicName: string, topicData: any): boolean{
    
    /* don't publish to non-existent|empty topics */
    if(this.isTopicEmptyOrNonExistent(topicName)){
      return false;
    }else{
      const topicSubscriptions = this.topicsChannel[topicName].subscriptions;
      const invokeSubscriptionCallback = this.getSubscriptionCallbackInvoker(topicName)(topicData);
      topicSubscriptions.forEach(invokeSubscriptionCallback);
      return true;
    }
  }

  /* create a subscription for a topic */
  public subscribe(topicName: string, callback: SubscriptionCallback): SubscriptionIdentifier{
    
    /* intitalise a non-existent topic */
    if(!this.topicsChannel[topicName]){
      this.initializeNonExistentTopic(topicName);
    }

    /* create a subscription for the topic */
    const topicSubscription = this.createTopicSubscription(callback);

    /* store the subscription */
    this.queueTopicSubscription(topicName, topicSubscription);

    /* return subscription indentifier */
    return this.createSubscriptionIdentifier(topicName, topicSubscription.subscriptionID);
  }


  /* remove a subscription for a topic */
  unsubscribe(subscriptionIdentifier: SubscriptionIdentifier): Subscription | undefined{
    const { topicName, subscriptionID } = subscriptionIdentifier;
    const [ topicInTopicsChannel, subscriptionIndex] = this.findSubscriptionInTopic(topicName, subscriptionID);
    if( topicInTopicsChannel && subscriptionIndex>=0){
      topicInTopicsChannel.subscribers--;
      return topicInTopicsChannel.subscriptions.splice(subscriptionIndex,1)[0];
    }
    return undefined;
  }

  private findSubscriptionInTopic( topicName: string, subscriptionID: string ): [PubSubTopic | undefined, SubscriptionIndex]{
    const topicInTopicsChannel = this.topicsChannel[topicName];
    if(topicInTopicsChannel && topicInTopicsChannel.subscribers > 0){
      const topicSubscriptions = this.topicsChannel[topicName].subscriptions;
      const subscriptionIDMatcher = this.getSubscriptionIDMatcher(subscriptionID);
      const subscriptionIndex = topicSubscriptions.findIndex(subscriptionIDMatcher);
      return [topicInTopicsChannel ,subscriptionIndex];
    }
    return [undefined , -1];
  }

  private isTopicEmptyOrNonExistent(topicName: string): boolean{
    return !this.topicsChannel[topicName] || !(this.topicsChannel[topicName].subscribers <= 0) ;
  }

  private initializeNonExistentTopic(topicName: string): void{
    this.topicsChannel[topicName] = {
      subscribers: 0,
      subscriptions: []
    };
  }

  private invokeSubscriptionCallback( topicName: string, topicData: any, subscription: Subscription ): void{
    return subscription.callback(topicName, topicData);
  }

  private checkIDMatchesSubscription( subscriptionID: string, subscription: Subscription): boolean{
    return subscriptionID === subscription.subscriptionID;
  }

  private createTopicSubscription(callback: SubscriptionCallback): Subscription{
    return {
      subscriptionID: String(this.subscriptionID++),
      callback
    }
  }

  private queueTopicSubscription(topicName: string, topicSubscription: Subscription): void{
    this.topicsChannel[topicName].subscriptions.push(topicSubscription);
    this.topicsChannel[topicName].subscribers++;
  }

  private createSubscriptionIdentifier(topicName: string, topicSubscriptionID: string): SubscriptionIdentifier{
    return {
      topicName,
      subscriptionID: topicSubscriptionID
    }
  }

}