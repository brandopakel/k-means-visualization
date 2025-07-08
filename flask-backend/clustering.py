from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.decomposition import PCA
import pandas as pd
import numpy as np
from typing import Literal

def run_kmeans(data: pd.DataFrame, k: int, use_pca: bool = True, init_method: Literal['k-means++', 'random'] = 'k-means++'):

    """

    init_method:
        - k-means: sklearn default
        - random: sklearn random init
        - custom: manually provided centroids
    """

    if init_method not in ['k-means++', 'random']:
        raise ValueError("init_method must be in 'k-means++' or 'random'")
    
    model = KMeans(n_clusters=k, init=init_method, n_init='auto', random_state=42)
    labels = model.fit_predict(data)

    result = {
        'original_data' : data.assign(cluster=labels),
        'centers': model.cluster_centers_.tolist(),
        'labels': labels.tolist()
    }

    if use_pca:
        pca = PCA(n_components=2)
        reduced = pca.fit_transform(data)
        result['pca_data'] = pd.DataFrame({
            'x': reduced[:,0],
            'y': reduced[:,1],
            'cluster': labels
        }).to_dict(orient='records')
    
    return result

def custom_k_means(X: np.ndarray, k: int, max_iters = 100):
    rng = np.random.default_rng(seed=42)
    centroids = X[rng.choice(len(X), k, replace=False)]
    history = []

    for _ in range(max_iters):
        distances = np.linalg.norm(X[:,None] - centroids[None, :], axis=2)
        labels = np.argmin(distances, axis=1)

        history.append((centroids.copy(), labels.copy()))

        new_centroids = np.array([X[labels == i].mean(axis=0) for i in range(k)])

        if np.allclose(new_centroids, centroids):
            break

        centroids = new_centroids
    
    return centroids, labels, history # type: ignore