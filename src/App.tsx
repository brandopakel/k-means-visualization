import './App.css';
import React, {useState} from 'react';
import axios from 'axios';
import Controls from './components/Controls';
import ClusterChart from './components/ClusterChart';

type Point = { x: number; y: number };
type Frame = {
  centroids: number[][]; // shape: [k][2]
  labels: number[];      // cluster index per point
  points: Point[];       // data points (static)
};

export default function App() {
  const [k, setK] = useState(3);
  const [dataset, setDataset] = useState("gaussian");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [step, setStep] = useState<number>(0);
  const [points, setPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<"random" | "manual">("random");
  const [manualCentroids, setManualCentroids] = useState<number[][]>([]);

  //load dataset points from backend
  const fetchDataset = async(selectedDataset: string) => {
    const res = await axios.post("https://k-means-backend.onrender.com/generate", {dataset: selectedDataset});
    setPoints(res.data.points);
    setFrames([]);
    setManualCentroids([]);
    setStep(0);
  }

  //run full kmeans with random init
  const runKMeans = async() => {
    setMode("random")
    const res = await axios.post("https://k-means-backend.onrender.com/cluster",{
      k,
      dataset,
      init_method: "random",
    });

    const {data, history} = res.data;
    setPoints(data);
    setFrames(history.map((h: {centroids: number[][]; labels: number[]}) => ({...h, points: data})));
    setStep(0);
  }

    //user clicked to add centroid
    const onClickAddCentroid = ([x,y]: [number, number]): void => {
      if(manualCentroids.length >= k) return;
      setManualCentroids([...manualCentroids, [x,y]])
    }

    //reassign points to nearest centroid
    const reassignPoints = async (): Promise<void> => {
      const res = await axios.post("https://k-means-backend.onrender.com/reassign", {
        points,
        centroids: manualCentroids,
      });

      const {labels} = res.data;
      const newFrame : Frame = {
        centroids: manualCentroids,
        labels,
        points,
      };

      setFrames([...frames, newFrame])
      setStep(frames.length)
    }

    //update centroids based on assigned labels
    const updateCentroids = async(): Promise<void> => {
      const currentLabels = frames[frames.length - 1]?.labels;
      if(!currentLabels) return;

      const res = await axios.post("https://k-means-backend.onrender.com/update", {
        points,
        labels: currentLabels,
        k,
      });

      const {centroids} = res.data;
      const newFrame: Frame = {
        centroids,
        labels: currentLabels,
        points,
      };

      setManualCentroids(centroids);
      setFrames([...frames, newFrame]);
      setStep(frames.length);
    };

    //Reset all
    const resetAll = () => {
      setK(3);
      setDataset("gaussian");
      setPoints([]);
      setFrames([]);
      setManualCentroids([]);
      setStep(0);
      setMode("random");
    }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>K-Means Clustering Visualizer</h2>

      <Controls
        dataset={dataset}
        setDataset={ (d) => {
          setDataset(d);
          fetchDataset(d);
        }}
        k={k}
        setK={setK}
        onInitRandom={runKMeans}
        onResetCentroids={() => {
          setManualCentroids([]);
          setFrames([]);
          setStep(0);
          setMode("manual");
        }}
        onRunKMeans={runKMeans}
        onReassignPoints={reassignPoints}
        onUpdateCentroids={updateCentroids}
        manualCentroidsPlaced={manualCentroids.length === k}
        onResetAll={resetAll}
      />

      <ClusterChart
        dataPoints={points}
        centroids={
          frames.length ? frames[step].centroids : manualCentroids
        }
        labels={frames.length ? frames[step].labels : []}
        onClickAddCentroid={
          mode === "manual" && manualCentroids.length < k
            ? onClickAddCentroid
            : undefined
        }
      />

      {frames.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            ⬅️ Prev
          </button>
          <span style={{ margin: "0 10px" }}>Step {step + 1} / {frames.length}</span>
          <button
            onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
            disabled={step === frames.length - 1}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}
