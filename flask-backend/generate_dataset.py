from datasets import generate_dbscan_rings,generate_density_bars,generate_gaussian_mixture,generate_uniform_points

def generate_dataset_by_type(dataset_type: str, n_samples: int = 300):
    if dataset_type == "gaussian":
        return generate_gaussian_mixture(n_samples)
    elif dataset_type == "uniform":
        return generate_uniform_points(n_samples)
    elif dataset_type == "dbscan_rings":
        return generate_dbscan_rings(n_samples)
    elif dataset_type == "density_bars":
        return generate_density_bars(n_samples)
    else:
        raise ValueError("Invalid dataset type")