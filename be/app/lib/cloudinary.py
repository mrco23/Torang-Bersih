"""Cloudinary integration for file uploads"""
import cloudinary
import cloudinary.uploader
import concurrent.futures
from flask import current_app

from app.utils.logger import logger


def init_cloudinary():
    """Initialize Cloudinary config at app startup."""
    cloudinary.config(
        cloud_name=current_app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=current_app.config.get('CLOUDINARY_API_KEY'),
        api_secret=current_app.config.get('CLOUDINARY_API_SECRET'),
        secure=True
    )


def upload_image(file, folder="uploads", public_id=None, transformation=None):
    try:
        upload_options = {"folder": folder, "resource_type": "image", "overwrite": True}
        
        if public_id:
            upload_options["public_id"] = public_id
        
        if transformation:
            upload_options["transformation"] = transformation
        
        result = cloudinary.uploader.upload(file, **upload_options)
        
        logger.info(f"Image uploaded: {result.get('public_id')}")
        
        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height"),
            "bytes": result.get("bytes")
        }
        
    except Exception as e:
        logger.error(f"Failed to upload image: {e}")
        return None


def upload_images_concurrently(files, folder="uploads"):
    """
    Upload multiple files to Cloudinary concurrently using a ThreadPoolExecutor.
    Returns a list of successful secure_urls.
    """
    uploaded_urls = []
    if not files:
        return uploaded_urls
        
    # We filter out empty files first
    valid_files = [f for f in files if f.filename]
    if not valid_files:
        return uploaded_urls

    # Use ThreadPoolExecutor to upload images in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(valid_files), 10)) as executor:
        # Submit all tasks
        futures = [executor.submit(upload_image, file, folder=folder) for file in valid_files]
        
        # Gather results as they complete
        for future in concurrent.futures.as_completed(futures):
            res = future.result()
            if res and 'url' in res:
                uploaded_urls.append(res['url'])
                
    return uploaded_urls

def delete_image(public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        
        if result.get("result") == "ok":
            logger.info(f"Image deleted: {public_id}")
            return True
        return False
        
    except Exception as e:
        logger.error(f"Failed to delete image: {e}")
        return False


def get_image_url(public_id, width=None, height=None, crop="fill"):
    transformations = []
    
    if width or height:
        transform = {"crop": crop}
        if width:
            transform["width"] = width
        if height:
            transform["height"] = height
        transformations.append(transform)
    
    url, _ = cloudinary.utils.cloudinary_url(
        public_id,
        transformation=transformations if transformations else None,
        secure=True
    )
    
    return url
