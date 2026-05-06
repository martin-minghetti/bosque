// Shim mínimo de next/headers para tests unitarios.
// Vitest no monta un request pipeline, así que mockeamos cookies() vacía.
const store = new Map<string, string>();

export async function cookies() {
  return {
    get(name: string) {
      const value = store.get(name);
      return value ? { name, value } : undefined;
    },
    set(name: string, value: string, _opts?: unknown) {
      store.set(name, value);
    },
    delete(name: string) {
      store.delete(name);
    },
  };
}
