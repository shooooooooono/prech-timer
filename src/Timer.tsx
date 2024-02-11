import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";

function Timer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [isValidMinutes, setIsValidMinutes] = useState(true);
  const [isValidSeconds, setIsValidSeconds] = useState(true);

  // Timer state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [startedAt, setStartedAt] = useState<Date | null>(null);

  function reset() {
    setMinutes(0);
    setSeconds(0);
    setIsRunning(false);
  }

  function increment() {
    if (seconds === 59) {
      setMinutes(minutes + 1);
      setSeconds(0);
      return;
    }
    setSeconds(seconds + 1);
  }

  function updateTimerInterval() {
    const now = new Date()
    const elapsedSec = Math.floor(calcElapsedTime(now) / 1000)
    const elapsedSecAndMin = secToSecAndMin(elapsedSec)
    setMinutes(elapsedSecAndMin.min)
    setSeconds(elapsedSecAndMin.sec)
  }

  function calcElapsedTime(now: Date): number {
    if (startedAt === null) {
      return 0
    }

    return Math.floor(now.getTime() - startedAt.getTime())
  }

  function secToSecAndMin(seconds: number): { min: number; sec: number } {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return { min, sec };
  }

  function formatTime(): string {
    const formatedMinutes = minutes.toString().padStart(2, "0");
    const formatedSeconds = seconds.toString().padStart(2, "0");
    return `${formatedMinutes}:${formatedSeconds}`;
  }

  function updateSeconds(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const secNum = Number(value);
    if (isNaN(secNum)) {
      setSeconds(seconds);
      setIsValidSeconds(false);
      return;
    }

    if (secNum > 59) {
      setSeconds(seconds);
      setIsValidSeconds(false);
      return;
    }

    setIsValidSeconds(true);
    setSeconds(secNum);
  }

  function updateMinutes(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    const minNum = Number(value);

    if (isNaN(minNum)) {
      setMinutes(minutes);
      setIsValidMinutes(false);
      return;
    }

    setIsValidMinutes(true);
    setMinutes(minNum);
  }

  function set45min() {
    setMinutes(45);
    setSeconds(0);
    setIsRunning(false);
  }

  function startTimer() {
    // diffMilliSec
    let diffMilliSec = 0;
    const now = new Date()

    // 時刻を設定している場合は引く
    diffMilliSec -= (seconds * 1000)
    diffMilliSec -= (minutes * 60 * 1000)

    setStartedAt(new Date(now.getTime() + diffMilliSec))

    setIsRunning(true)
  }

  function stopTimer() {
    setIsRunning(false)
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateTimerInterval, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimerInterval, isRunning]);

  function toggleRunning() {
    if (isRunning) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  return (
    <Grid container alignItems={"center"} spacing={0.5}>
      <Grid>
        <h1
          className="timer-display"
          style={{
            fontSize: "150px",
            marginTop: 0,
            marginBottom: 0,
            marginRight: "100px",
          }}
        >
          {formatTime()}
        </h1>
      </Grid>
      <Grid>
        <TextField
          label="Min"
          value={minutes}
          onChange={updateMinutes}
          error={!isValidMinutes}
          sx={{
            width: "70px",
            ".MuiInputBase-input": {
              background: "wheat",
            },
          }}
        ></TextField>
      </Grid>
      <Grid>
        <TextField
          label="Sec"
          value={seconds}
          onChange={updateSeconds}
          error={!isValidSeconds}
          sx={{
            width: "70px",
            ".MuiInputBase-input": {
              background: "wheat",
            },
          }}
        ></TextField>
      </Grid>
      <Grid>
        <Button
          variant="contained"
          onClick={toggleRunning}
          sx={{
            backgroundColor: isRunning ? "red" : "blue",
            "&:hover": {
              backgroundColor: isRunning ? "darkred" : "darkblue",
            },
            width: "80px",
            fontWeight: "bold",
          }}
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
      </Grid>
      <Grid>
        <Button
          variant="contained"
          onClick={set45min}
          sx={{
            backgroundColor: "green",
            "&:hover": { backgroundColor: "darkgreen" },
            fontWeight: "bold",
          }}
        >
          SET 45:00
        </Button>
      </Grid>
      <Grid>
        <Button
          variant="contained"
          onClick={reset}
          sx={{
            backgroundColor: "orange",
            "&:hover": { backgroundColor: "darkorange" },
            fontWeight: "bold",
            color: "black",
          }}
        >
          Reset
        </Button>
      </Grid>
    </Grid>
  );
}

export default Timer;
