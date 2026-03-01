import numpy as np

def calculate_similarity(participants: list, items: list, answers: list):
    # participants: list of dict {participant_id, nick_name, email}
    # items: list of dict {item_id} (sorted)
    # answers: list of dict {participant_id, item_id, score}
    
    if not participants or not items:
        return {}
    
    # 1. Build Matrix
    # Rows: Participants, Cols: Items
    p_map = {p['participant_id']: i for i, p in enumerate(participants)}
    i_map = {item['item_id']: j for j, item in enumerate(items)}
    
    n_p = len(participants)
    n_i = len(items)
    
    # Initialize with neutral value (3) for NULLs
    matrix = np.full((n_p, n_i), 3.0)
    
    for ans in answers:
        if ans['score'] is not None:
            r = p_map.get(ans['participant_id'])
            c = i_map.get(ans['item_id'])
            if r is not None and c is not None:
                matrix[r, c] = float(ans['score'])
    
    # 2. Calculate Cosine Similarity
    norms = np.linalg.norm(matrix, axis=1)
    norms[norms == 0] = 1e-9 # Avoid division by zero
    
    dot_products = np.dot(matrix, matrix.T)
    sim_matrix = dot_products / np.outer(norms, norms)
    
    # 3. Find top 3 for each
    results = {}
    for i, p in enumerate(participants):
        pid = p['participant_id']
        sims = sim_matrix[i]
        
        # Exclude self
        sims[i] = -1.0
        
        # Get indices of top 3
        # If fewer than 3 others, take all valid
        k = min(3, n_p - 1)
        if k <= 0:
            results[pid] = []
            continue
            
        # argsort returns indices low->high. 
        top_indices = np.argsort(sims)[::-1][:k]
        
        top_matches = []
        for idx in top_indices:
            match_pid = participants[idx]['participant_id']
            match_score = sims[idx]
            match_nick = participants[idx]['nick_name']
            top_matches.append({
                "participant_id": match_pid,
                "nick_name": match_nick,
                "score": float(match_score)
            })
            
        results[pid] = top_matches
        
    return results
