import numpy as np
import pandas as pd
from sklearn.datasets import make_blobs, make_circles

def generate_gaussian_mixture(n_samples = 300):
    X, _ = make_blobs(n_samples=n_samples, centers=3, cluster_std=0.6, random_state=12) # type: ignore 
    return pd.DataFrame(X, columns=['x','y'])

def generate_uniform_points(n_samples=300):
    X = np.random.uniform(low=-5,high=5,size=(n_samples,2))
    return pd.DataFrame(X, columns=['x','y'])

def generate_dbscan_rings(n_samples=400):
    X, _ = make_circles(n_samples=n_samples, noise=0.05, factor=0.5)
    return pd.DataFrame(X, columns=['x','y'])

def generate_density_bars(n_samples=300):
    X = []
    for i in range(5):
        x_vals = np.random.normal(loc=i*2,scale=0.1,size=(n_samples// 5, ))
        y_vals = np.random.uniform(-5, 5, size=(n_samples // 5, ))
        X.append(np.stack([x_vals,y_vals], axis=1))
    return pd.DataFrame(np.vstack(X),columns=['x','y'])