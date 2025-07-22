export type RouteContext<T extends string> = {
  params: Record<T, string>;
};