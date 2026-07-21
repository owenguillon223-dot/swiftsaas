import { describe, expect, it, vi, beforeEach } from "vitest";

const meterEventsCreate = vi.fn();

vi.mock("@/lib/stripe", () => ({
  stripe: { billing: { meterEvents: { create: meterEventsCreate } } },
}));

const { reportAgentRunUsage } = await import("./billing-meter");

describe("reportAgentRunUsage", () => {
  beforeEach(() => {
    meterEventsCreate.mockReset();
    delete process.env.STRIPE_METER_EVENT_NAME;
  });

  it("reports a usage event with the default event name and value", async () => {
    meterEventsCreate.mockResolvedValue({});

    const result = await reportAgentRunUsage({ customerId: "cus_123" });

    expect(result).toEqual({ reported: true });
    expect(meterEventsCreate).toHaveBeenCalledWith({
      event_name: "agent_run",
      payload: { stripe_customer_id: "cus_123", value: "1" },
    });
  });

  it("uses STRIPE_METER_EVENT_NAME and a custom value when provided", async () => {
    process.env.STRIPE_METER_EVENT_NAME = "custom_event";
    meterEventsCreate.mockResolvedValue({});

    await reportAgentRunUsage({ customerId: "cus_123", value: 3 });

    expect(meterEventsCreate).toHaveBeenCalledWith({
      event_name: "custom_event",
      payload: { stripe_customer_id: "cus_123", value: "3" },
    });
  });

  it("swallows Stripe errors and returns reported: false", async () => {
    meterEventsCreate.mockRejectedValue(new Error("network down"));

    const result = await reportAgentRunUsage({ customerId: "cus_123" });

    expect(result).toEqual({ reported: false });
  });
});
