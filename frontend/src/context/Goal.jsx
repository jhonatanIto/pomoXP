import { createContext, useState } from "react";

export const GoalContext = createContext(null);

function GoalProvider({ children }) {
  const [goal, setGoal] = useState({
    goal: 120,
    times: 0,
  });

  return (
    <GoalContext.Provider value={{ goal, setGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export default GoalProvider;
