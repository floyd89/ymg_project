
import { AppSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ID = 1;
const BUCKET_NAME = 'store-images';

// Objek default yang lengkap untuk memastikan tidak ada nilai 'undefined'
const defaultSettings: AppSettings = {
  whatsAppNumber: '',
  storeName: 'YMG',
  storeTagline: 'Explore your true style',
  storeLogoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAf4SURBVHhe7Z1/bFxVFcd/55577bXrvbZ1naRxtLHT2oFjgGlTgwQ03CgE8Qc0jYSIuEFMNAiKiElM0BBDfPDBpGo0gGhMEDUmUhMToEGpCBpAUwpMOAYt06Z5A1s6SGN3vXfvvffee8/pj9bV9d67d+/eA79I/pB17j7n3HvPved87zn3/j+2K2N9fT0zMzPZwsJCGR4eZg8PD1tcXGSPj4+trq5mCwoK2OLiIvv5+dlWVVVZHx8f++TkJDs/P88WFxdZX1+fraysZGNjYxkaGsrs7OxsdnaWJSQk2NraWvbs2TP74sUL9sWLF/b582f25csXW1paYn///rVerxcKhUKhUCj4/5nL5Zqbm5v/+fPnw/v375uPHz/aixcvjA8fPjTeunXLunLlSnv+/Ln1+fNn6+rqKuvs7KyTk5Nsdna2ra+vZzExMeyLFy/s6dOn7NmzZ/bIkSO2t7dnS0tL9vjxY1tbW8vKy8vZgoKC7OXlZUNDA5uZmWGdnZ3s8PDw4ziGIAiCIAiCIAiCIAiCICwfLly4YO3du9e6c+dOd/fuXev48eM2Pz/POjo62NnZWVZWVrKVlZVsYWEhW1paYmdnZ/b8+XN7+vSp/fDhA3vy5Al79uwZ29nZsbe3tz1+/Nj++vWraWpqsqWlpezx48dsY2Mjq6+vZzdu3LCbN2+2ubk5Gx0dZXfu3LHbu3dvjMlkYpIkYRjGMAxFUfynKIpyHMcwDENRlGEYhmEYhmEYhuF/i7W1tWxtbS0rLy+3ubk5y8vLs42NjWxtbS07OzvZ2tpaNjIykg0ODrKJiYl29+5dW1paYn/8+MH+/Plj//r1iz18+NBqa2vZrVu32jvvvNPee++97ZtvvrEtLS3txo0b7ZEjR2x0dJRdvHjRfvjhBzs3N8f+/v1r37x5Y7/++qt9/fpVe/fuXfv69at9++239vXXX9ujR4/swoUL7ZtvvrFvvvnGrq6u2vz8PBEREf6f7u7uNDc311544YWRnZ1tHThwQPr6+jpycnLCI0eOGBcXFxkVFcXwer2mUChobW2tPXDgAFNTU+O1tbW8wWAQTqeTTqdTXl5eZGVlhaurq3R2dsYsy5SWliYuLi5i27ZtMXZ2dnh6etqWLVuGLVu2DA8ePJAZGRlER0dHenq6BAQE0NjYWLZt2zbW29ubrq6uvLm5ia+vr7S2tpYdHR28ePEidXV1iYiI4OLiIjU1NaGlpYWdnp4kJSVFOjs7MXZ2tvT09PDs7ExWVlYYHR3l8PDweTweW1tb+8CBA+zBgwdERkaGUVFR/tFfvnwZGx4e5ubOnavW2trS0dERa2trExMT09LS8t/a2trGxsaNGzdycnKCIAgAyMjIYD6fJ4hA9XpdlmW2tbVlR0dHpFIpTzAYzGazbTab2WwWiURieXk5R0dH8Xq9aWlpiaWlpdjtdlpaWqLVahMTE8Ps7GzyeDzncjlFUVRXV1fC4TCdTpfr6+ssLy+P1WrVbrczOTlZqamp6HQ6pVIpwWDQrKys+P1+sVgsNpvNXC6XRCKRSqVSqVQoFAqFQuF/pWtra5kamqKFhaV8+PAhKysr8fPzm0Kh0Ov1SJK0oKCAnJycGBkZiaWlpaSnp2dycpJcLhdaWlppaWkpFospISEhaGtro9VqMzIyktFoc/Pnz/Px8ZFLly5x/vx5CoUCu7u7NDc3hyAIHA4HX19fOXLkCPX19ZmenubSpUvZ29tDc3MznU5Hc3MzBwcHGR8fZ3h4GEVROTw85MiRI3z+/DkzM7McHR1hWRZTp06VdevW0dHRwcTEBB6Px/DwMNlsltraWjIzM2OxWEydOpXU1FQMBoOkUqlGo5FqtZpjx45htVoFBgZiaGiICxcu0NjYyJUrV7K+vo5qtZoNGzZgWdY6Ozv58OEDy5cvh8/nR6PRyMvLw2KxxGq1Ojs74+PjQ6FQ4Ny5c8zPz1dpaakzZ86gWq26urqyqKioVCqV0WgUCATKysri4uJiOp0OmUwmkUgUCgUKBQKBQKBQCP8f3d3dkUgkycnJobGxcXx8fHh4eNDS0oJOp3NycqK5uRlfXx+lUinT09PYbDZBEFRTU8OZM2ei0WhYW1ujt7d3YGCgEydOMDMzg16vx+l0UlNTw9jYGEVFRRwcHMhkMhQXF+Pk5ERrayu9vb0oFAp7e3uoVCpyuRwzMzP4fD4Wi4WqqioURcFoNHJ1dYWqqirS09OZk5PD6ekpVlZWGBoaIhAIUFlZydDQEKVSKWdnZxgMBo2NjdTW1nJ1dYWqqipSqRTLy8tYXFxEWZaVlpZycnISW1tb6Ojo4P79+7hcrvj4+FBfX8+3b9/g8/nhcDhERUVx/Phx6urq+PDhA6qqqnh6eqLRaDg7O8NhN41NTk7OxcXF0tJSCoVCbm5uaG5uZnl5mdnZWdFoNLa2trC1tYWtra34fD7z8/Po9Xq9Xm/y8/Nzc3MThUIpLi6mqamJg4ODaDQa1tbWsLa2RqvVYllWExMTHB4eYnt7GwMDAzh//jzBYJDJyUnS09PZtWsXExMTuLu7IzExEY1Gg8/nU1JSIjc3F11dXUQiESaTCUVR6Ozs5MiRIxw9epSuri7a2toQBMHk5CTDw8McHBwkFou5urpibGyMJ0+eYGRkhKmpKSwWCyMjIxgYGMDV1RTXrl2rVCq5d+8etbW1fP36FceOHSM3N5eAgACWlpZobm5mampKqVQqFAr+l33+/JkPHz5wdHRkSUkJy8vL9Ho9vV6PzWbT6XRwuVzYbDZyuZwzZ87w4cOHDA8PCwQCxcXFzM7Ocvz4cXp7e+nt7UVRFLVaq76+HsMwDAaDxMTEkJGRwZkzZ1hYWEAul+Pw8BDNZnNiYiKqqqpkMhmGhoYYGBgQCAQ4OTnh7u6ORCIhEAiIxWKUSqVsNht+v19VVZWSkhKKiopwuVyYTCb6+vqYnp5GUZQyMjIIBAIMBgNCofC6d+9eKpWSl5fHysrK8PDwEydO8ObNGwoKCujq6qK9vR1EUXh6emJlZQVFUcjlcq5fv47ZbJbr62uOjo4wmUzYbDYaGhrg8/mUlJTQ1NREJBIhEAjQ6/VERUUQiUTIZDJUKpWenh6SkpJITU1Fq9Xy8PAgEAhwcnIiLy+PSCRCU1MTc3Nz3Lt3j9HRUQAICgqiubmZnp4eenp6+Pr64uLiguTkZB49eoRarQ4ODkZERAS3bt2iWCzy8/MzJyenVCqlpqamqKgoWlpa+PjxI0VFRQgEAjIzM9Hr9XR1dem1116jqqrKtWvX+ODBg1KpVFdXl/r6esViMRqNRi6XS6VSqVQqFAoF/yv1ev2JEydsampqfHw8gUBAXFwcnU7H4sWL+fTpk08//RSRSERFRQUpKSlERUUhCAL19fUkJSVRXFyMoihUKpWy2Synp6ecnJyQSqU0NjYCEBERQXFxcWJiIvb29hgYGMDV1ZX6+npaWlqoVCri4uJoaGhgYmKCUCjEZrPR2NhIKpUyNjaGLVu24PP5OHv2LDk5OSwvL1NbW8uNGzcIBoNER0ejUCgAgJqaGoLBIPn5+eTl5WFmZoaLFy+ytrZGc3MztbW1bNq0ifXr16MoCtPpzP379xkeHuZf/vIX7Nu3D1NTUzQ1NaGzszMzM5Nvv/0WfX19nDt3Dq2trURFRREREcHGxga9vb0oFAo2NjbIz88XCAQ4OjpCR0cHFxcXREZG0tzcTLvdJhKJYFkWXdfRaDSer7/+mpqaGpWVlfT19fH8+XMKhYLW1lZyuRyXy6W7uxun00lHRwdBEFhbW+PQoUOYTCa2trZSWVmJ3W7n5OSEjo4OOjo6GBsbw+VyUVRUREVFodPpxMXF4e7ujqWlJYqKirh69SodHR3c3d1FWZbt7+8nFApRV1eXmpoqKytLVlaWTCbT6/X/B3z65Kk7Xv2WAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTA3LTMxVDEwOjMwOjA5KzAwOjAwv4/NzgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0wNy0zMVQxMDozMDowOSswMDowMOBhU14AAAAASUVORK5CYII=',
  instagramUrl: '',
  tiktokUrl: '',
  facebookUrl: '',
  telegramUrl: '',
};

const ensureFullUrl = (pathOrUrl: string | null | undefined): string | null => {
    // Jika URL sudah lengkap (dimulai dengan http) atau tidak ada, kembalikan apa adanya.
    if (!pathOrUrl || pathOrUrl.startsWith('http')) {
        return pathOrUrl || null;
    }

    // Jika ini adalah nama file (path), bangun URL lengkapnya.
    const supabaseUrlString = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrlString) {
        console.error("VITE_SUPABASE_URL tidak ditemukan, tidak dapat membangun URL gambar lengkap.");
        return pathOrUrl; // Kembalikan path jika URL Supabase tidak tersedia
    }
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.substring(1) : pathOrUrl;
    return `${supabaseUrlString}/storage/v1/object/public/${BUCKET_NAME}/${cleanPath}`;
}

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .limit(1);

    if (error) {
      console.error("Error fetching settings:", error);
      return defaultSettings;
    }

    if (data && data.length > 0) {
      const dbSettings = data[0];
      // Pastikan URL logo adalah URL lengkap sebelum digabungkan dengan default
      dbSettings.storeLogoUrl = ensureFullUrl(dbSettings.storeLogoUrl);
      return { ...defaultSettings, ...dbSettings };
    }

    return defaultSettings;
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    const { ...settingsToSave } = settings;

    const { error } = await supabase
      .from('settings')
      .upsert({ id: SETTINGS_ID, ...settingsToSave });

    if (error) {
      console.error("Error saving settings:", error);
      throw new Error(`Gagal menyimpan pengaturan: ${error.message}`);
    }
  },
};