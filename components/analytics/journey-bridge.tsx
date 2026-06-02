"use client";

import { useEffect } from "react";
import { trackPrintMeEvent } from "@/lib/analytics/client";

export function JourneyBridge({
  eventName,
  properties,
  ...event
}: {
  eventName: string;
  entityType?: string;
  pageType?: string;
  funnelName?: string;
  funnelStage?: string;
  journey?: string;
  isMicroConversion?: boolean;
  value?: number;
  currency?: string;
  properties?: Record<string, unknown>;
}) {
  useEffect(() => {
    trackPrintMeEvent({ eventName, properties, ...event });
  }, [eventName, properties, event]);

  return null;
}
