import argparse
import os
import sys

import bpy


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []

    parser = argparse.ArgumentParser(
        description="Convert supported 3D formats to GLB using Blender."
    )
    parser.add_argument("--input", required=True, help="Input 3D file path.")
    parser.add_argument("--output", required=True, help="Output .glb path.")
    return parser.parse_args(argv)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)


def import_model(input_path: str):
    ext = os.path.splitext(input_path)[1].lower()

    if ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=input_path)
        return

    if ext == ".obj":
        # Blender 4.x uses wm.obj_import, older uses import_scene.obj.
        if hasattr(bpy.ops.wm, "obj_import"):
            bpy.ops.wm.obj_import(filepath=input_path)
        else:
            bpy.ops.import_scene.obj(filepath=input_path)
        return

    if ext == ".dxf":
        # Requires bundled add-on in most Blender builds.
        try:
            bpy.ops.preferences.addon_enable(module="io_import_dxf")
        except Exception:
            pass
        if hasattr(bpy.ops.import_scene, "dxf"):
            bpy.ops.import_scene.dxf(filepath=input_path)
            return
        raise RuntimeError(
            "DXF importer is unavailable in this Blender build. "
            "Use FBX input or install/enable a DXF importer add-on."
        )

    raise RuntimeError(f"Unsupported input format: {ext}")


def normalize_scene():
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.select_set(True)
        else:
            obj.select_set(False)
    if bpy.context.selected_objects:
        bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def export_glb(output_path: str):
    out_dir = os.path.dirname(output_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format="GLB",
        export_yup=True,
        export_apply=True,
    )


def main():
    args = parse_args()
    input_path = os.path.abspath(args.input)
    output_path = os.path.abspath(args.output)

    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input not found: {input_path}")

    clear_scene()
    import_model(input_path)
    normalize_scene()
    export_glb(output_path)
    print(f"Converted: {input_path} -> {output_path}")


if __name__ == "__main__":
    main()
