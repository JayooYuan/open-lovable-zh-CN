import { zhCN } from "./zh-CN";
import type { LocaleMessages } from "./en";

export const messages: LocaleMessages = zhCN;

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export type { LocaleMessages } from "./en";
