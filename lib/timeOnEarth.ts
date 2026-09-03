export const BIRTH_INSTANT = new Date("2004-04-02T02:45:00+05:30");

export type TimeOnEarthParts = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type ISTParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function getISTParts(date: Date): ISTParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parseInt(parts.find((part) => part.type === type)?.value ?? "0", 10);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

export function getTimeOnEarth(now = new Date()): TimeOnEarthParts {
  const birth = getISTParts(BIRTH_INSTANT);
  const current = getISTParts(now);

  let seconds = current.second - birth.second;
  let minutes = current.minute - birth.minute;
  let hours = current.hour - birth.hour;
  let days = current.day - birth.day;
  let months = current.month - birth.month;
  let years = current.year - birth.year;

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    days += new Date(current.year, current.month - 1, 0).getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

export function formatTimeOnEarth(
  parts: TimeOnEarthParts,
  variant: "full" | "compact" | "static",
) {
  if (variant === "compact") {
    return `${parts.years}y ${parts.months}mo`;
  }

  const date = `${parts.years}y ${parts.months}mo ${parts.days}d`;

  if (variant === "static") {
    return date;
  }

  return `${date} · ${pad2(parts.hours)}:${pad2(parts.minutes)}:${pad2(parts.seconds)}`;
}

export function formatTimeOnEarthAria(parts: TimeOnEarthParts) {
  return `${parts.years} years, ${parts.months} months, ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, and ${parts.seconds} seconds on Earth`;
}
