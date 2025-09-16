import os
from kaggle.api.kaggle_api_extended import KaggleApi

# Kaggle authenticate
api = KaggleApi()
api.authenticate()

# Dataset download path
download_path = "data"  # backend folder ke andar 'data' folder me save hoga
os.makedirs(download_path, exist_ok=True)

# Download dataset
api.dataset_download_files(
    'PromptCloudHQ/flipkart-products',  # Kaggle dataset slug
    path=download_path,
    unzip=True  # Automatically unzip
)

print("Dataset downloaded and extracted to ./data folder")
