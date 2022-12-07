import bpy
import os

# Blender application is needed
# Script for MacOS
# sudo /Applications/Blender.app/Contents/MacOS/Blender --background --python blender.py

# Edit your own
basedir = os.getcwd() + '/Target'
output_base_dir = basedir

os.makedirs(output_base_dir, exist_ok=True)

files = [f for f in os.listdir(basedir) if f.endswith('.blend')]

print(f'Found {len(files)} blend files. Processing...')

for f in files:
    if not f.endswith('.blend'):
        continue
    path = os.path.join(basedir, f)
    bpy.ops.wm.open_mainfile(filepath=path)
    bpy.ops.object.select_all(action='DESELECT')
    try:
        just_name = f.replace('.blend', '')
        out_path = os.path.join(output_base_dir, just_name)
        bpy.ops.export_scene.gltf(
            export_format='GLB',
            export_draco_mesh_compression_enable=True,
            filepath=out_path)
    except:
        just_name = f.replace('.blend', '')
        out_path = os.path.join(output_base_dir, just_name)
        bpy.ops.export_scene.gltf(
            export_format='GLB',
            export_draco_mesh_compression_enable=False,
            filepath=out_path)