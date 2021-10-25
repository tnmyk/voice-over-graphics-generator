import { useRef } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const noVoiceRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLDivElement>(null);
  const volumeLevelRef = useRef<HTMLDivElement>(null);
  const startInput = () => {
    var soundAllowed = function (stream: any) {
      var audioContent = new AudioContext();
      var audioStream = audioContent.createMediaStreamSource(stream);
      var analyser = audioContent.createAnalyser();
      audioStream.connect(analyser);
      analyser.fftSize = 1024;

      var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

      var rerun = function () {
        requestAnimationFrame(rerun);
        analyser.getByteFrequencyData(frequencyArray);
        let sum = 0;
        frequencyArray.forEach((x) => {
          sum += x;
          if (sum > 40 * frequencyArray.length) return;
        });
        const average = sum / frequencyArray.length;
        volumeLevelRef!.current!.style.width = `${average}vw`;
        console.log(sum);
        if (average > 40) {
          noVoiceRef!.current!.style.display = "none";
          voiceRef!.current!.style.display = "block";
        } else {
          voiceRef!.current!.style.display = "none";
          noVoiceRef!.current!.style.display = "block";
        }
        sum = 0;
      };
      rerun();
    };

    var soundNotAllowed = function () {
      window.alert("Please Allow microphone usage");
    };
    var n: any = navigator;
    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;
    return n.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
  };
  return (
    <>
      <h3 className="center">Voice Over Generator</h3>
      <div className={` ${styles.mainContainer} `}>
        <div ref={noVoiceRef}>🙂</div>
        <div ref={voiceRef} style={{ display: "none" }}>
          🤨
        </div>
      </div>
      <button className="center" onClick={startInput}>
        Start
      </button>
      <div className={styles.volumeLevel} ref={volumeLevelRef}></div>
    </>
  );
};

export default Home;
