// Define constants for different time units
const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

// Type for different time units
type Unit =
    | 'Years'
    | 'Year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Weeks'
    | 'Week'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'
    | 'Hrs'
    | 'Hr'
    | 'H'
    | 'Minutes'
    | 'Minute'
    | 'Mins'
    | 'Min'
    | 'M'
    | 'Seconds'
    | 'Second'
    | 'Secs'
    | 'Sec'
    | 's'
    | 'Milliseconds'
    | 'Millisecond'
    | 'Msecs'
    | 'Msec'
    | 'Ms';

// Type for case-insensitive time units
type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

// Type for string values that can contain a number and an optional time unit
export type StringValue =
    | `${number}`
    | `${number}${UnitAnyCase}`
    | `${number} ${UnitAnyCase}`;

/**
 * Converts a string representing time into milliseconds.
 *
 * @param str - A string representing a time duration, e.g., "1 hour", "60s", "500 milliseconds".
 * @returns The equivalent duration in milliseconds.
 * @throws {Error} If the input string does not match the expected format or the unit is not recognized.
 *
 * @example
 * ms('1 minute'); // returns 60000
 * ms('2 hours'); // returns 7200000
 * ms('500 ms'); // returns 500
 */
export function ms(str: StringValue): number {
    // Validate input
    if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
        throw new Error(
            'Value provided to ms() must be a string with length between 1 and 99.'
        );
    }

    // Regular expression to match a number and an optional time unit
    const match =
        /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
            str
        );

    // Extract value and unit from the match
    const groups = match?.groups as { value: string; type?: string } | undefined;
    if (!groups) {
        return NaN;
    }
    const n = parseFloat(groups.value);
    const type = (groups.type || 'ms').toLowerCase() as Lowercase<Unit>;

    // Convert the string value to milliseconds based on the unit
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y;
        case 'weeks':
        case 'week':
        case 'w':
            return n * w;
        case 'days':
        case 'day':
        case 'd':
            return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n;
        default:
            throw new Error(
                `Error: Time unit "${type}" was recognized but no corresponding case exists. Please check the input.`
            );
    }
}
