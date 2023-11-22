export const getUserSubscription = async (subscriptionId: string) => {
  const subscription = await fetch(
    `/api/admin/subscription?subscriptionId=${subscriptionId}`
  );
  const data = await subscription.json();
  return data;
};
