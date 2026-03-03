import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModel

class Embedder:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModel.from_pretrained(
            'nomic-ai/nomic-embed-text-v1', 
            trust_remote_code=True
        )
        self.model.eval()
    
    def mean_pooling(self, model_output, attention_mask):
        tokens_embeddings = model_output[0]
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(tokens_embeddings.size()).float()
        sum_embeddings = torch.sum(tokens_embeddings * input_mask_expanded, 1)
        return sum_embeddings / torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    
    def embed(self, text: str):
        sentences = [f'clustering: {text}']
        encoded_input = self.tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            model_output = self.model(**encoded_input)
        embeddings = self.mean_pooling(model_output, encoded_input['attention_mask'])
        embeddings = F.normalize(embeddings, p=2, dim=1)
        return embeddings