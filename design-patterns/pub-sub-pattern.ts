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
  
  export interface PublishSubscribe{
    readonly publish:      (topicName: string, topicData: any)=> boolean;
    readonly subscribe:    (topicName: string, callback: SubscriptionCallback)=> SubscriptionIdentifier;
    readonly unsubscribe:  (SubscriptionIdentifier: SubscriptionIdentifier)=> Subscription | undefined;
  }
}
namespace PubSubUtils{

  export const getSubscriptionCallbackInvoker = curry(PubSubUtils.invokeSubscriptionCallback);
  export const getSubscriptionIDMatcher = curry(PubSubUtils.checkIDMatchesSubscription);

  export function findSubscriptionInTopic( topicName: string, subscriptionID: string ): [PubSubTypes.PubSubTopic | undefined, PubSubTypes.SubscriptionIndex]{
    const topicInTopicsChannel = this.topicsChannel[topicName];
    if(topicInTopicsChannel && topicInTopicsChannel.subscribers > 0){
      const topicSubscriptions = this.topicsChannel[topicName].subscriptions;
      const subscriptionIDMatcher = this.getSubscriptionIDMatcher(subscriptionID);
      const subscriptionIndex = topicSubscriptions.findIndex(subscriptionIDMatcher);
      return [topicInTopicsChannel ,subscriptionIndex];
    }
    return [undefined , -1];
  }

  export function isTopicEmptyOrNonExistent(topicName: string): boolean{
    return !this.topicsChannel[topicName] || !(this.topicsChannel[topicName].subscribers <= 0) ;
  }

  export function initializeNonExistentTopic(topicName: string): void{
    this.topicsChannel[topicName] = {
      subscribers: 0,
      subscriptions: []
    };
  }

  export function invokeSubscriptionCallback( topicName: string, topicData: any, subscription: PubSubTypes.Subscription ): void{
    return subscription.callback(topicName, topicData);
  }

  export function checkIDMatchesSubscription( subscriptionID: string, subscription: PubSubTypes.Subscription): boolean{
    return subscriptionID === subscription.subscriptionID;
  }

  export function createTopicSubscription(subscriptionID: number, callback: PubSubTypes.SubscriptionCallback): PubSubTypes.Subscription{
    return {
      subscriptionID: String(subscriptionID++),
      callback
    }
  }

  export function queueTopicSubscription(topicsChannel: PubSubTypes.PubSubTopicsChannel,topicName: string, topicSubscription: PubSubTypes.Subscription): void{
    topicsChannel[topicName].subscriptions.push(topicSubscription);
    topicsChannel[topicName].subscribers++;
  }

  export function createSubscriptionIdentifier(topicName: string, topicSubscriptionID: string): PubSubTypes.SubscriptionIdentifier{
    return {
      topicName,
      subscriptionID: topicSubscriptionID
    }
  }
}
class PubSub implements PubSubTypes.PublishSubscribe{

  /* Each subscription gets an ID , Useful for un-subscribing */
  private subscriptionID: number = 0;

  /* Topics and their subscriptions live here */
  private topicsChannel: PubSubTypes.PubSubTopicsChannel = {};

  constructor() {};

  /* create a subscription for a topic */
  public subscribe(topicName: string, callback: PubSubTypes.SubscriptionCallback): PubSubTypes.SubscriptionIdentifier{
    if(!this.topicsChannel[topicName]){
      PubSubUtils.initializeNonExistentTopic(topicName);
    }
    const topicSubscription = PubSubUtils.createTopicSubscription(this.subscriptionID,callback);
    PubSubUtils.queueTopicSubscription(this.topicsChannel, topicName, topicSubscription);
    return PubSubUtils.createSubscriptionIdentifier(topicName, topicSubscription.subscriptionID);
  }

  /* publish data to topicName and return true if a success */
  public publish(topicName: string, topicData: any): boolean{
    if(PubSubUtils.isTopicEmptyOrNonExistent(topicName)){
      return false;
    }else{
      const topicSubscriptions = this.topicsChannel[topicName].subscriptions;
      const invokeSubscriptionCallback = PubSubUtils.getSubscriptionCallbackInvoker(topicName)(topicData);
      topicSubscriptions.forEach(invokeSubscriptionCallback);
      return true;
    }
  }

  /* remove a subscription for a topic */
  public unsubscribe(subscriptionIdentifier: PubSubTypes.SubscriptionIdentifier): PubSubTypes.Subscription | undefined{
    const { topicName, subscriptionID } = subscriptionIdentifier;
    const [ topicInTopicsChannel, subscriptionIndex] = PubSubUtils.findSubscriptionInTopic(topicName, subscriptionID);
    if( topicInTopicsChannel && subscriptionIndex>=0){
      topicInTopicsChannel.subscribers--;
      return topicInTopicsChannel.subscriptions.splice(subscriptionIndex,1)[0];
    }
    return undefined;
  }
}