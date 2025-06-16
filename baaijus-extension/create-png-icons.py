#!/usr/bin/env python3

from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    # Create a new image with a transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Create a gradient circle representing the "B" for Baaijus
    center = size // 2
    radius = int(size * 0.4)
    
    # Main circle with gradient-like effect
    for i in range(radius, 0, -1):
        alpha = int(255 * (i / radius) * 0.9)
        color = (33, 150, 243, alpha)  # Blue with varying transparency
        draw.ellipse([center - i, center - i, center + i, center + i], fill=color)
    
    # Inner highlight
    highlight_radius = int(radius * 0.6)
    draw.ellipse([center - highlight_radius, center - highlight_radius, 
                  center + highlight_radius, center + highlight_radius], 
                 fill=(100, 181, 246, 200))
    
    # Core
    core_radius = int(radius * 0.3)
    draw.ellipse([center - core_radius, center - core_radius, 
                  center + core_radius, center + core_radius], 
                 fill=(33, 150, 243, 255))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

# Ensure icons directory exists
os.makedirs('icons', exist_ok=True)

# Create the required icon sizes
create_icon(16, 'icons/icon16.png')
create_icon(48, 'icons/icon48.png')
create_icon(128, 'icons/icon128.png')

print("All icons created successfully!")