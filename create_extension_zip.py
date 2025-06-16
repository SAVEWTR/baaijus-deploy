#!/usr/bin/env python3
import zipfile
import os
from pathlib import Path

def create_extension_zip():
    """Create a proper extension ZIP file"""
    
    # Remove old zip if exists
    if os.path.exists('baaijus-extension.zip'):
        os.remove('baaijus-extension.zip')
    
    # Create new zip
    with zipfile.ZipFile('baaijus-extension.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Walk through the extension directory
        for root, dirs, files in os.walk('baaijus-extension'):
            # Skip hidden files and node_modules
            dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
            
            for file in files:
                if not file.startswith('.'):
                    file_path = os.path.join(root, file)
                    arc_path = os.path.relpath(file_path, 'baaijus-extension')
                    zipf.write(file_path, arc_path)
                    print(f"Added: {arc_path}")
    
    # Verify the zip
    with zipfile.ZipFile('baaijus-extension.zip', 'r') as zipf:
        print(f"\nCreated ZIP with {len(zipf.namelist())} files")
        print("Testing ZIP integrity...")
        zipf.testzip()
        print("ZIP file is valid!")

if __name__ == "__main__":
    create_extension_zip()