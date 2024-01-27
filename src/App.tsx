import { useState } from "react";
import Timer from "./Timer";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function App() {
  const [timerArray, setTimerArray] = useState([
    { id: 0, timer: <Timer key={0} /> },
  ]);

  function addTimer() {
    const newTimer = {
      id: timerArray.length,
      timer: <Timer key={timerArray.length} />,
    };
    setTimerArray([...timerArray, newTimer]);
  }

  function removeTimer(id: number) {
    setTimerArray(timerArray.filter((timer) => timer.id !== id));
  }

  return (
    <Container>
      <Grid display="flex" container alignItems="center">
        {timerArray.map(({ id, timer }) => (
          <Grid
            display="flex"
            container
            alignItems="center"
            key={id}
            justifyContent="space-between"
          >
            <Grid>{timer}</Grid>
            <Grid>
              <IconButton
                onClick={() => removeTimer(id)}
                aria-label="delete"
                sx={{ color: "red" }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <IconButton onClick={addTimer} aria-label="add" sx={{ color: "green" }}>
        <AddIcon />
      </IconButton>
    </Container>
  );
}

export default App;
