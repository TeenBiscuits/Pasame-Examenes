#!/usr/bin/env python3
"""Remove inline ![img-*](img-*.jpeg) from questions.ts text fields,
since images are now rendered via image/explanationImage fields."""
import re

path = "/Users/pablo/Dev/Pasame-Examenes/src/subjects/cepe/questions.ts"
with open(path) as f:
    content = f.read()

# Pattern for ![img-X.jpeg](img-X.jpeg)
pattern = re.compile(r'\s*!\[img-\d+\.jpeg\]\(img-\d+\.jpeg\)\s*')

# Remove from all text fields (question, correctAnswer, explanation, subquestions)
# Replace with nothing (the image is now rendered via the separate image field)
new_content = pattern.sub('\n', content)

# Clean up multiple blank lines
new_content = re.sub(r'\n{3,}', '\n\n', new_content)

with open(path, 'w') as f:
    f.write(new_content)

print(f"Stripped inline image references from {path}")

# Count remaining image references
remaining = re.findall(r'!\[img-', new_content)
if remaining:
    print(f"WARNING: {len(remaining)} image refs remain")
else:
    print("All inline image references removed.")
