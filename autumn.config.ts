import { feature, product, featureItem, priceItem } from "atmn";

export const notes = feature({
  id: "notes",
  name: "Notes",
  type: "continuous_use",
});

export const aiRequests = feature({
  id: "ai_requests",
  name: "AI Assistant Requests",
  type: "single_use",
});

export const prioritySupport = feature({
  id: "priority_support",
  name: "Priority Support",
  type: "boolean",
});

export const teamCollaboration = feature({
  id: "team_collaboration",
  name: "Team Collaboration",
  type: "boolean",
});

export const free = product({
  id: "free",
  name: "Free",
  is_default: true,
  items: [
    featureItem({
      feature_id: notes.id,
      included_usage: 10,
    }),
    featureItem({
      feature_id: aiRequests.id,
      included_usage: 20,
      interval: "month",
    }),
  ],
});

export const pro = product({
  id: "pro",
  name: "Pro",
  items: [
    priceItem({
      price: 9,
      interval: "month",
    }),
    featureItem({
      feature_id: notes.id,
    }),
    featureItem({
      feature_id: aiRequests.id,
      included_usage: 200,
      interval: "month",
    }),
    featureItem({
      feature_id: prioritySupport.id,
    }),
  ],
});

export const team = product({
  id: "team",
  name: "Team",
  items: [
    priceItem({
      price: 19,
      interval: "month",
    }),
    featureItem({
      feature_id: notes.id,
    }),
    featureItem({
      feature_id: aiRequests.id,
    }),
    featureItem({
      feature_id: prioritySupport.id,
    }),
    featureItem({
      feature_id: teamCollaboration.id,
    }),
  ],
});