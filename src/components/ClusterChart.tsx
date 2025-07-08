import React from "react";
import Plot from "react-plotly.js";
import type { PlotData } from "plotly.js";

type Point = {x: number; y: number};

interface ClusterChartProps {
  dataPoints: Point[];
  centroids: number[][];
  labels: number[];
  onClickAddCentroid?: (coord: [number, number]) => void;
}

export default function ClusterChart({dataPoints, centroids, labels, onClickAddCentroid}: ClusterChartProps){
    const clustered: Record<number, Point[]> = {};

    if(labels && labels.length){
        dataPoints.forEach((point, idx) => {
            const label = labels[idx]
            if(!clustered[label]) clustered[label] = [];
            clustered[label].push(point);
        });
    }

    const plotData: Partial<Plotly.PlotData>[] = [];

    if(labels && Object.keys(clustered).length){
        for(const [label, points] of Object.entries(clustered)){
            plotData.push({
                x: points.map((p) => p.x),
                y: points.map((p) => p.y),
                mode: "markers",
                type: "scatter",
                name: `Cluster ${label}`,
            });
        }
    } else{
        plotData.push({
            x: dataPoints.map((p) => p.x),
            y: dataPoints.map((p) => p.y),
            mode: "markers",
            type: "scatter",
            name: "Data",
        })
    }

    if (centroids.length) {
        plotData.push({
        x: centroids.map((c) => c[0]),
        y: centroids.map((c) => c[1]),
        mode: "markers",
        type: "scatter",
        name: "Centroids",
        marker: { color: "black", symbol: "x", size: 12 },
        });
    }

    return(
    <div style={{ border: "2px solid black", display: "inline-block" }}>
        <Plot
            data={plotData}
            layout={{
                width: 700,
                height: 500,
                title: {text: "Clustering Visualization"},
                xaxis: {
                    showgrid: false,           // remove gridlines
                    zeroline: false,           // remove 0-line
                    showticklabels: false,     // hide tick numbers
                    ticks: "",                 // remove tick marks
                },
                yaxis: {
                    showgrid: false,
                    zeroline: false,
                    showticklabels: false,
                    ticks: "",
                },
            }}
            onClick={(e) => {
                const pt = e.points[0];
                const x = pt.x;
                const y = pt.y;
                if(typeof x == "number" && typeof y == "number"){
                    onClickAddCentroid?.([x, y]);
                }
            }}
        />
    </div>
    )
}