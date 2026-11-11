#!/bin/bash
set -e

# Industries
# Steel & Metallurgy
curl -s -L "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80" -o public/industry-steel.jpg
# Cement & Minerals
curl -s -L "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80" -o public/industry-cement.jpg
# Chemical & Petrochemical
curl -s -L "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80" -o public/industry-chemical.jpg
# Environmental / Clean Tech
curl -s -L "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1000&q=80" -o public/industry-environmental.jpg
# Process Industries
curl -s -L "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80" -o public/industry-process.jpg

# Engineering in Action
# 1. Valve Manufacturing / Welding
curl -s -L "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1000&q=80" -o public/action-manufacturing.jpg
# 2. Precision Machining / CNC
curl -s -L "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80" -o public/action-machining.jpg
# 3. Assembly
curl -s -L "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80" -o public/action-assembly.jpg
# 4. Testing / Hydrostatic Testing
curl -s -L "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80" -o public/action-testing.jpg
# 5. Factory Acceptance Testing (FAT)
curl -s -L "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1000&q=80" -o public/action-fat.jpg
# 6. Installation & Commissioning
curl -s -L "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1000&q=80" -o public/action-installation.jpg

echo "All high-res industrial photos downloaded successfully"
