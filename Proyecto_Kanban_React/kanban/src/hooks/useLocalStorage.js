import { useEffect, useState } from "react";

// Hook reutilizable incluido como práctica de la Clase 3.
// En la versión final las tareas se guardan en MySQL a través de la API.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // El almacenamiento puede estar deshabilitado por el navegador.
    }
  }, [key, value]);

  return [value, setValue];
}
