from PIL import Image


def validate_image(image_path):
    try:
        image = Image.open(image_path)
        image.verify()
        return True
    except Exception:
        return False


def get_image_info(image_path):
    image = Image.open(image_path)

    return {
        "format": image.format,
        "width": image.width,
        "height": image.height,
        "mode": image.mode
    }