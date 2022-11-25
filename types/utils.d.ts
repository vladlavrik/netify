type RequiredProps<T extends Record<keyof any, any>, P extends keyof T> = T & {[K in P]-?: T[K]};
