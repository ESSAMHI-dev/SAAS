import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    const hasPremiumPlan = await has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);
    const metadata = user.privateMetadata || {};

    if (hasPremiumPlan) {
      if (metadata.plan !== "premium" || metadata.free_usage !== 0) {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...metadata,
            plan: "premium",
            free_usage: 0,
          },
        });
      }
      req.plan = "premium";
      req.free_usage = 0;
    } else {
      req.plan = "free";
      req.free_usage = metadata.free_usage ?? 0;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
