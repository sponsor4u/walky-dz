import { router, publicProcedure } from "./middleware";
import { authRouter } from "./routers/auth-router";
import { productRouter } from "./routers/product-router";
import { orderRouter } from "./routers/order-router";
import { shippingRouter } from "./routers/shipping-router";
import { settingsRouter } from "./routers/settings-router";
import { categoryRouter } from "./routers/category-router";
import { landingRouter } from "./routers/landing-router";
import { analyticsRouter } from "./routers/analytics-router";
import { fraudRouter } from "./routers/fraud-router";
import { reviewRouter } from "./routers/review-router";
import { couponRouter } from "./routers/coupon-router";
import { mediaRouter } from "./routers/media-router";
import { homepageRouter } from "./routers/homepage-router";

export const appRouter = router({
  ping: publicProcedure.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
  shipping: shippingRouter,
  settings: settingsRouter,
  category: categoryRouter,
  landing: landingRouter,
  analytics: analyticsRouter,
  fraud: fraudRouter,
  review: reviewRouter,
  coupon: couponRouter,
  media: mediaRouter,
  homepage: homepageRouter,
});

export type AppRouter = typeof appRouter;
