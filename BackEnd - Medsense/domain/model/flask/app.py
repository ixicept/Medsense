import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from nltk import pos_tag
import string

nltk.download("punkt")
nltk.download("stopwords")
nltk.download("averaged_perceptron_tagger")
nltk.download("wordnet")

stop_words = set(stopwords.words("english"))
punc = set(string.punctuation)
lemmatizer = WordNetLemmatizer()
stemmer = SnowballStemmer("english")

def get_tag(treebank_tag: str):
    treebank_tag = treebank_tag.lower()
    if treebank_tag.startswith("j"):
        return wordnet.ADJ
    elif treebank_tag.startswith("v"):
        return wordnet.VERB
    elif treebank_tag.startswith("n"):
        return wordnet.NOUN
    elif treebank_tag.startswith("r"):
        return wordnet.ADV
    else:
        return wordnet.NOUN

def pre_process_sentence(sentence):
    tokens = word_tokenize(sentence)
    new_list = []
    for token in tokens:
        token = token.lower()
        if token not in stop_words and token not in punc and token.isalpha():
            new_list.append(stemmer.stem(token))
    return new_list
def sentence_vector(tokens, model):
    vec = np.zeros(model.vector_size)
    count = 0
    for token in tokens:
        if token in model.wv:
            vec += model.wv[token]
            count += 1
    if count > 0:
        vec /= count
    return vec
def load_bundle(bundle_path: str):
    try:
        with open(bundle_path, "rb") as f:
            bundle = pickle.load(f)
        return bundle
    except FileNotFoundError:
        raise FileNotFoundError(f"No such file: {bundle_path!r}")
    except Exception as e:
        raise RuntimeError(f"Error loading bundle: {e}")

def predict_top3(raw_text: str,
                 bundle_path: str = "full_pipeline.pkl"
                ) -> list[tuple[str, float]]:
    bundle = load_bundle(bundle_path)
    w2v_model = bundle["w2v_model"]
    clf       = bundle["clf"]

    tokens = pre_process_sentence(raw_text)                    
    vec    = sentence_vector(tokens, w2v_model)

    probs = clf.predict_proba([vec])[0]

    top_idx = np.argsort(probs)[-3:][::-1]
    return [(clf.classes_[i], float(probs[i])) for i in top_idx]

with open("full_pipeline.pkl", "rb") as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5174", "http://localhost:5173"])
@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(force=True)
    text = payload.get("text", "")
    
    top3 = predict_top3(text, bundle_path="full_pipeline.pkl")
    
    return jsonify({
        "predictions": [
            {"label": lbl, "confidence": conf}
            for lbl, conf in top3
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4999, debug=True)