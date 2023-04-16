import pandas as pd
import joblib

df = pd.read_csv('unlabeled_private_test_hackathon_vcs_2023.csv', index_col=0)
model = joblib.load('model.pkl')

result = model.predict(df['x'])

df["y"] = result
df.to_csv("result.csv")
