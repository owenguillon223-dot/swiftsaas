import { getStripeClient } from "@/lib/stripe/client";

/**
 * Reports one usage event per agent run against a Stripe Meter (Billing > Meters),
 * enabling pay-per-agent-run pricing. Errors are swallowed so a billing hiccup
 * never blocks the user-facing agent response.
 */
export async function reportAgentRunUsage(params: {
  customerId: string;
  value?: number;
}): Promise<{ reported: boolean }> {
  const eventName = process.env.STRIPE_METER_EVENT_NAME || "agent_run";

  try {
    const stripe = getStripeClient();
    await stripe.billing.meterEvents.create({
      event_name: eventName,
      payload: {
        stripe_customer_id: params.customerId,
        value: String(params.value ?? 1),
      },
    });
    return { reported: true };
  } catch (error) {
    console.error(
      `[stripe/meter] Failed to report usage for event "${eventName}" (customer: ${params.customerId}):`,
      error
    );
    return { reported: false };
  }
}
