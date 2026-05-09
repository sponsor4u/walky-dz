import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { orderRouter } from "./order-router";
import { shippingRouter } from "./shipping-router";
import { settingsRouter } from "./settings-router";
import { categoryRouter } from "./category-router";
import { landingRouter } from "./landing-router";
import { analyticsRouter } from "./analytics-router";
import { fraudRouter } from "./fraud-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  order: orderRouter,
  shipping: shippingRouter,
  settings: settingsRouter,
  category: categoryRouter,
  landing: landingRouter,
  analytics: analyticsRouter,
  fraud: fraudRouter,
});

export type AppRouter = typeof appRouter;
