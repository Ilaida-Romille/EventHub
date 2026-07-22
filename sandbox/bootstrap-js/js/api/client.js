export async function fetchJson(endpoint, options = {}) {
   const response = await fetch(endpoint, {
      ...options,
      headers: {
         Accept: "application/json",
         ...(options.headers ?? {})
      }
   });

   if (!response.ok) {
      throw new Error(`HTTP ${response.status} while requesting ${endpoint}`);
   }

   return response.json();
}
