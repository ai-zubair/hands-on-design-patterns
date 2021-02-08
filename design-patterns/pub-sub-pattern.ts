import { curry } from '../bits-and-pieces/n-arity-currying';

namespace PubSubTypes{
  export interface SubscriptionCallback{
    (topicName: string, topicData: any): void;
  }
  
  export interface Subscription{
    subscriptionID: string;
    callback:       SubscriptionCallback;
  }
  
  export interface PubSubTopic{
    subscribers:    number;
    subscriptions:  Subscription[];
  }
  
  export interface PubSubTopicsChannel{
    [topicName: string]: PubSubTopic;
  }
  
  export interface SubscriptionIdentifier{
    topicName:      string;
    subscriptionID: string;
  }
  
  export type SubscriptionIndex = number;

  export type SubscriptionTuple = [PubSubTypes.PubSubTopic | undefined, SubscriptionIndex];

  export interface PublishSubscribe{
    readonly publish:      (topicName: string, topicData: any)=> boolean;
    readonly subscribe:    (topicName: string, callback: SubscriptionCallback)=> SubscriptionIdentifier;
    readonly unsubscribe:  (SubscriptionIdentifier: SubscriptionIdentifier)=> Subscription | undefined;
  }
}

namespace PubSubUtils{

  export const getSubscriptionCallbackInvoker = curry(invokeSubscriptionCallback);
  export const getSubscriptionIDMatcher       = curry(checkIDMatchesSubscription);

  export function isTopicEmptyOrNonExistent(topic: PubSubTypes.PubSubTopic): boolean{
    return (!topic) || (topic.subscribers <= 0) ;
  }

  export function invokeSubscriptionCallback( topicName: string, topicData: any, subscription: PubSubTypes.Subscription ): void{
    return subscription.callback(topicName, topicData);
  }

  export function initializeNonExistentTopic(topicsChannel: PubSubTypes.PubSubTopicsChannel,topicName: string): PubSubTypes.PubSubTopic{
    return topicsChannel[topicName] = {
      subscribers: 0,
      subscriptions: []
    };
  }

  export function createTopicSubscription(subscriptionID: number, callback: PubSubTypes.SubscriptionCallback): PubSubTypes.Subscription{
    return {
      subscriptionID: String(subscriptionID),
      callback
    }
  }

  export function queueSubscriptionInTopic(topic: PubSubTypes.PubSubTopic, topicSubscription: PubSubTypes.Subscription): number{
    topic.subscriptions.push(topicSubscription);
    topic.subscribers++;
    return topic.subscribers;
  }

  export function createSubscriptionIdentifier(topicName: string, topicSubscriptionID: string): PubSubTypes.SubscriptionIdentifier{
    return {
      topicName,
      subscriptionID: topicSubscriptionID
    }
  }

  export function findSubscriptionInTopic( topic: PubSubTypes.PubSubTopic, subscriptionID: string ): number{
    if(topic && topic.subscribers > 0){
      const topicSubscriptions = topic.subscriptions;
      const subscriptionIDMatcher = getSubscriptionIDMatcher(subscriptionID);
      const subscriptionIndex = topicSubscriptions.findIndex(subscriptionIDMatcher);
      return subscriptionIndex;
    }
    return -1;
  }

  export function checkIDMatchesSubscription( subscriptionID: string, subscription: PubSubTypes.Subscription): boolean{
    return subscriptionID === subscription.subscriptionID;
  }

  export function pruneTopicSubscription(topic: PubSubTypes.PubSubTopic, subscriptionIndex: number){
    topic.subscribers--;
    return topic.subscriptions.splice(subscriptionIndex,1)[0];
  }

}

/* IMPLEMENTATION */
class PubSub implements PubSubTypes.PublishSubscribe{

  /* Each topic subscription gets an ID , Useful for un-subscribing */
  private subscriptionID: number = 0;

  /* Topics and their subscriptions live here */
  private topicsChannel: PubSubTypes.PubSubTopicsChannel = {};

  constructor() {};

  /* publish topicData to topicName and return true if a success */
  public publish(topicName: string, topicData: any): boolean{
    const topic = this.topicsChannel[topicName];
    if(PubSubUtils.isTopicEmptyOrNonExistent(topic)){
      return false;
    }else{
      const topicSubscriptions = topic.subscriptions;
      const invokeSubscriptionCallback = PubSubUtils.getSubscriptionCallbackInvoker(topicName)(topicData);
      topicSubscriptions.forEach(invokeSubscriptionCallback);
      return true;
    }
  }

  /* create a subscription for a topic */
  public subscribe(topicName: string, callback: PubSubTypes.SubscriptionCallback): PubSubTypes.SubscriptionIdentifier{
    let topic = this.topicsChannel[topicName];
    if(!topic){
      topic = PubSubUtils.initializeNonExistentTopic(this.topicsChannel,topicName);
    }
    const topicSubscription = PubSubUtils.createTopicSubscription(this.subscriptionID++,callback);
    PubSubUtils.queueSubscriptionInTopic(topic, topicSubscription);
    return PubSubUtils.createSubscriptionIdentifier(topicName, topicSubscription.subscriptionID);
  }

  /* remove a subscription for a topic */
  public unsubscribe(subscriptionIdentifier: PubSubTypes.SubscriptionIdentifier): PubSubTypes.Subscription | undefined{
    const { topicName, subscriptionID } = subscriptionIdentifier;
    const topic = this.topicsChannel[topicName];
    const subscriptionIndex = PubSubUtils.findSubscriptionInTopic(topic, subscriptionID);
    if( topic && subscriptionIndex>=0){
      return PubSubUtils.pruneTopicSubscription(topic, subscriptionIndex);
    }
    return undefined;
  }
}

export { PubSub };