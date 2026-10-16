
type LogLevel = "info" | "error";

type LogFields = Record<
  string,
  string | number | boolean | null
>;

export function logEvent(
  level: LogLevel,
  event: string,
  fields: LogFields
) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...fields,
  };

  const message = JSON.stringify(payload);

  if (level === "error") {
    console.error(message);
  } else {
    console.info(message);
  }
}

