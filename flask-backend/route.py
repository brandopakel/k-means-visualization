from flask import Blueprint, request, jsonify
from clustering import custom_k_means
from datasets import generate_dbscan_rings,generate_density_bars,generate_gaussian_mixture,generate_uniform_points
import pandas as pd
import numpy as np
from generate_dataset import generate_dataset_by_type

bp = Blueprint('cluster_route', __name__)

@bp.route("/cluster", methods=["GET","POST"]) # type: ignore
def cluster():
    req = request.get_json()
    dataset_type = req.get("dataset", "gaussian")
    k = int(req.get("k",3))
    init_method = req.get("init_method","random")
    initial_centroids = req.get("initial_centroids")
    
    df = generate_dataset_by_type(dataset_type=dataset_type)
    X = df.to_numpy()

    if init_method == "manual" and initial_centroids:
        centroids = np.array(initial_centroids)
        labels = np.argmin(np.linalg.norm(X[:,None] - centroids[None,:], axis=2), axis=1)
        new_centroids = np.array([X[labels == i].mean(axis=0) for i in range(k)])
        return jsonify({
            "centroids": centroids.tolist(),
            "labels": labels.tolist(),
            "data": df.to_dict(orient="records"),
            "update_centroids": new_centroids.tolist()
        })
    
    centroids, labels, history = custom_k_means(X=X, k=k)
    return jsonify({
        "data": df.to_dict(orient="records"),
        "history": [
            {"centroids": c.tolist(), "labels": l.tolist()} for c, l in history
        ]
    })

@bp.route("/generate", methods=['POST']) #type: ignore
def generate():
    body = request.get_json()
    dataset = body.get("dataset", "gaussian")

    try:
        df = generate_dataset_by_type(dataset)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    return jsonify({"points": df.to_dict(orient="records")})

@bp.route("/reassign", methods=['POST']) #type: ignore
def reassign():
    body = request.get_json()
    points = np.array([[p["x"], p["y"]] for p in body["points"]])
    centroids = np.array(body["centroids"])

    distances = np.linalg.norm(points[:,None] - centroids[None,:], axis=2)
    labels = np.argmin(distances, axis=1)

    return jsonify({"lables": labels.tolist()})

@bp.route("/update", methods=["POST"]) #type: ignore
def update():
    body = request.get_json()
    points = np.array([[p["x"],p["y"]] for p in body["points"]])
    labels = np.array(body["labels"])
    k = int(body["k"])

    new_centroids = np.array([
        points[labels == i].mean(axis=0) if np.any(labels == i) else np.random.rand(2) for i in range(k)
    ])

    return jsonify({"centroids": new_centroids.tolist()})