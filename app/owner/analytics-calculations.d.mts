export function normalizeCustomerPhone(value: unknown): string | null;
export function calculateBookingRates(counts?: Record<string, number>): {total:number;completionRatePct:number|null;cancellationRatePct:number|null;noShowRatePct:number|null};
export function comparePeriod(current: number, previous: number): number | null;
export function buildInsights(input?: {total?:number;noShowRatePct?:number|null;awaitingCollectionCount?:number;unassignedCompleted?:number}): {code:string;value:number}[];
