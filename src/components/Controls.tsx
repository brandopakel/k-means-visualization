import React from "react";

type ControlsProps = {
  k: number;
  setK: (k: number) => void;
  dataset: string;
  setDataset: (d: string) => void;
  onRunKMeans: () => void;
  onInitRandom: () => void;
  onResetCentroids: () => void;
  onReassignPoints: () => void;
  onUpdateCentroids: () => void;
  manualCentroidsPlaced: boolean;
  onResetAll: () => void;
};

export default function Controls({k, setK, dataset, setDataset, onRunKMeans, onInitRandom, onResetCentroids, onReassignPoints, onUpdateCentroids, manualCentroidsPlaced, onResetAll}: ControlsProps){
    const datasets = ["gaussian","uniform","dbscan_rings","density_bars"];
    const clusterOptions = [2,3,4,5];


    return(
        <div style={{ marginBottom: "1rem" }}>
            <div>
                <strong>Dataset:</strong>
                {datasets.map((d) => (
                <button key={d} onClick={() => setDataset(d)} style={{ margin: "0 5px" }}>
                    {d}
                </button>
                ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
                <strong>Clusters (k):</strong>
                {clusterOptions.map((val) => (
                <button key={val} onClick={() => setK(val)} style={{ margin: "0 5px" }}>
                    {val}
                </button>
                ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
                <button onClick={onInitRandom}> Random Centroids </button>
                <button onClick={onResetCentroids}> Reset Manual Centroids </button>
                <button onClick={onResetAll}>Reset All</button>
            </div>

            {manualCentroidsPlaced && (
                <div style={{ marginTop: "1rem" }}>
                <button onClick={onRunKMeans}>Run K-Means</button>
                <button onClick={onReassignPoints}>Reassign Points</button>
                <button onClick={onUpdateCentroids}>Update Centroids</button>
                </div>
            )}
        </div>
    )
}