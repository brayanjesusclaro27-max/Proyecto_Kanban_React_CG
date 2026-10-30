import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import * as api from "../api.js";
import { reducer } from "./boardReducer.js";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [tasks, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      dispatch({ type: "set", tasks: data });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  async function addTask(title, priority) {
    try {
      setError("");
      const task = await api.createTask(title, priority);
      dispatch({ type: "add", task });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function moveTask(id, status) {
    try {
      setError("");
      await api.moveTask(id, status);
      dispatch({ type: "move", id, status });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function editTask(id, title, priority) {
    try {
      setError("");
      await api.updateTask(id, title, priority);
      dispatch({ type: "edit", id, title, priority });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function removeTask(id) {
    try {
      setError("");
      await api.deleteTask(id);
      dispatch({ type: "remove", id });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <BoardContext.Provider value={{ tasks, loading, error, addTask, moveTask, editTask, removeTask, refreshTasks }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard debe usarse dentro de BoardProvider");
  return context;
}
