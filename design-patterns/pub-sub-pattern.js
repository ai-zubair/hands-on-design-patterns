const pubsub = (function () {
  /* each susbcriber of a topic gets an ID */
  /* useful for unsubscribing */
  let subscriberID = -1;

  /* subscription storef for topics */
  const topicChannel = {};

  /* publish data to a topic */
  function publish(topic, data) {
    /* avoid publishing to non-existing and empty topics */
    if (!topicChannel[topic] || !topicChannel[topic].totalSubscriptions) {
      return false;
    } else {
      /* invoke each subscriptions callback with topic and data */
      const topicSubscriptions = topicChannel[topic].subscriptions;
      topicSubscriptions.forEach((subscription) =>
        subscription.callback(topic, data)
      );
      return true;
    }
  }

  /* create a subscription for a topic */
  function subscribe(topic, callback) {
    /* initialise a topic if it doesn't exist already */
    if (!topicChannel[topic]) {
      topicChannel[topic] = {
        totalSubscriptions: 0,
        subscriptions: [],
      };
    }

    /* create a  subscription */
    const subscription = {
      subscriptionID: String(++subscriberID),
      callback,
    };

    /* store the subscription for the topic */
    topicChannel[topic].subscriptions.push(subscription);
    topicChannel[topic].totalSubscriptions++;

    /* return the subscriptionIdentifier for unsubscribing later on */
    return {
      subscriptionTopic: topic,
      subscriptionID: subscription.subscriptionID,
    };
  }

  /* unsubscribe a subscriber from a topic using its subscriptionIdentifier*/
  function unsubscribe(subscriptionIdentifier) {
    const subscriptionTopic = subscriptionIdentifier.subscriptionTopic;
    const subscriptionID = subscriptionIdentifier.subscriptionID;
    if (subscriptionTopic && subscriptionID) {
      const subscriptionIndex = topicChannel[subscriptionTopic].subscriptions.findIndex(
        (subscription) =>
          subscription.subscriptionID === subscriptionIdentifier.subscriptionID
      );
      if (subscriptionIndex > -1) {
        topicChannel[subscriptionTopic].totalSubscriptions--;
      }
      return topicChannel[subscriptionTopic].subscriptions.splice(subscriptionIndex, 1)[0];
    } else {
      return undefined;
    }
  }

  /* public API */
  return {
    publish,
    subscribe,
    unsubscribe,
  };
})();

const subscription = pubsub.subscribe('new-message', (topic, data) => {
  console.log(`${data} was published to ${topic}`);
});

pubsub.publish('new-message', 'Testing the the subscriptions');

console.log(pubsub.unsubscribe(subscription));

console.log(pubsub.publish('new-message', 'Testing the the subscriptions'));
