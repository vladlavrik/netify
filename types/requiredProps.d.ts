type RequiredProps<T extends Record<any, any>, P extends keyof T> = T & {[K in P]-?: T[K]};
