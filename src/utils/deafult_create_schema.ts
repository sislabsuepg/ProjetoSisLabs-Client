export const createNewSchema = (obj: object) => {
  return Object.entries(obj)
    ?.reverse()
    ?.reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
};
