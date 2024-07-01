export const removeTypename = (key, value) => (key === '__typename' ? undefined : value);
