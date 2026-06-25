#!/usr/bin/env python3
"""Add image/explanationImage fields and remove inline ![img-*] from extracted text."""
import json, re, os

OUT = "/Users/pablo/Dev/Pasame-Examenes/output/cepe"
FULL = "/Users/pablo/Dev/Pasame-Examenes/temp/full"
SUBJ = "/Users/pablo/Dev/Pasame-Examenes/src/subjects/cepe"

def norm(s):
    return re.sub(r'\s+', ' ', s).strip()

# Step 1: For each exam, find images in question and answer text, add to questions.json
img_pattern = re.compile(r'!\[img-(\d+)\]\(img-\d+\.jpeg\)')
img_filename = re.compile(r'img-\d+\.jpeg')

all_updates = []

def find_anchor_text(md, anchor):
    """Extract text using anchor from the actual markdown content."""
    nmd = norm(md)
    ns = norm(anchor['start'])
    ne = norm(anchor['end'])
    si = nmd.find(ns)
    if si < 0:
        return None
    ei = nmd.find(ne, si)
    if ei < 0:
        return None
    # Get original text between these positions
    return nmd[si:ei + len(ne)]

for slug, folder in [
    ("2018-06", "2018_06"), ("2018-07", "2018_07"),
    ("2019-06", "2019_06"), ("2019-07", "2019_07"),
    ("2020-06", "2020_06"), ("2020-07", "2020_07"),
    ("2021-06", "2021_06"), ("2021-07", "2021_07"),
    ("2022-06", "2022_06"), ("2022-07", "2022_07"),
    ("2023-06", "2023_06"), ("2023-07", "2023_07"),
    ("2024-06", "2024_06"), ("2024-07", "2024_07"),
    ("2025-06", "2025_06"), ("2025-07", "2025_07"),
]:
    qs_path = os.path.join(OUT, f"{slug}.questions.json")
    md_path = os.path.join(FULL, f"{folder}.md")
    
    with open(qs_path) as f:
        data = json.load(f)
    with open(md_path) as f:
        md = f.read()
    
    modified = False
    
    for q in data:
        qid = q['id']
        qtext = find_anchor_text(md, q['question'])
        
        if qtext is None:
            print(f"  {qid}: could not extract question text")
            continue
        
        # Find images in question text
        q_imgs = img_filename.findall(qtext)
        for img in q_imgs:
            new_name = f"{slug}_{img}"
            asset_path = os.path.join(SUBJ, "assets", new_name)
            if os.path.exists(asset_path):
                q['image'] = new_name
                print(f"  {qid}: image={new_name} (in question)")
                modified = True
            else:
                print(f"  {qid}: WARNING {new_name} not in assets")
        
        # Find images in answer text
        if 'correctAnswer' in q and isinstance(q['correctAnswer'], dict) and 'start' in q['correctAnswer']:
            atext = find_anchor_text(md, q['correctAnswer'])
            if atext:
                a_imgs = img_filename.findall(atext)
                for img in a_imgs:
                    if q.get('image') and q['image'].endswith(img):
                        continue  # already added as image
                    new_name = f"{slug}_{img}"
                    asset_path = os.path.join(SUBJ, "assets", new_name)
                    if os.path.exists(asset_path):
                        q['explanationImage'] = new_name
                        print(f"  {qid}: explanationImage={new_name} (in answer)")
                        modified = True
                    else:
                        print(f"  {qid}: WARNING {new_name} not in assets")
    
    if modified:
        with open(qs_path, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  Saved {qs_path}")

print("\nDone adding image references.")
