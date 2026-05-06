"""
POST /report     – analyze uploaded medical report (PDF, image, or plain text).
POST /report/text – analyze raw text directly (for testing).
"""
import io
import importlib
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from models.schemas import ReportResponse
from services.report_analyzer import analyze_report
from config import DISCLAIMER

router = APIRouter()

# Optional PDF text extraction
try:
    import pdfminer.high_level as pdfminer_hl
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"}


@router.post("", response_model=ReportResponse)
async def analyze_report_file(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename or "report"

    if filename.lower().endswith(".pdf"):
        if not PDF_SUPPORT:
            raise HTTPException(
                status_code=400,
                detail="PDF support not installed. Run: pip install pdfminer.six"
            )
        text = pdfminer_hl.extract_text(io.BytesIO(content))
    elif filename.lower().endswith(".txt") or file.content_type == "text/plain":
        text = content.decode("utf-8", errors="ignore")
    elif filename.lower().endswith(tuple(IMAGE_EXTENSIONS)) or file.content_type.startswith("image/"):
        try:
            from PIL import Image
        except ImportError:
            raise HTTPException(
                status_code=400,
                detail=("Image support is not installed. Run: pip install pillow "
                        "and install Tesseract OCR or easyocr.")
            )

        try:
            image = Image.open(io.BytesIO(content))
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Unable to open uploaded image: {exc}"
            )

        text = ""
        pytesseract = None
        easyocr = None

        try:
            pytesseract = importlib.import_module("pytesseract")
        except ImportError:
            pytesseract = None

        if pytesseract is not None:
            try:
                text = pytesseract.image_to_string(image)
            except Exception:
                text = ""

        if not text.strip():
            try:
                easyocr = importlib.import_module("easyocr")
            except ImportError:
                easyocr = None

        if not text.strip() and easyocr is not None:
            try:
                reader = easyocr.Reader(["en"], gpu=False)
                text = "\n".join(reader.readtext(np.array(image), detail=0, paragraph=True))
            except Exception as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unable to extract text from image using OCR fallback: {exc}"
                )

        if not text.strip():
            detail_text = (
                "Unable to extract text from the image. "
                "Install Tesseract OCR and ensure it is in your PATH, "
                "or install easyocr via pip as fallback."
            )
            raise HTTPException(status_code=400, detail=detail_text)
    else:
        raise HTTPException(status_code=400, detail="Only .pdf, .txt, and common image files are supported.")

    result = analyze_report(text)
    return ReportResponse(
        filename=filename,
        summary=result["summary"],
        abnormal_parameters=result["abnormal_parameters"],
        normal_parameters=result["normal_parameters"],
        advice=result["advice"],
        disclaimer=DISCLAIMER,
    )


@router.post("/text", response_model=ReportResponse)
async def analyze_report_text(body: dict):
    text = body.get("text", "")
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text provided.")
    result = analyze_report(text)
    return ReportResponse(
        filename="manual_input",
        summary=result["summary"],
        abnormal_parameters=result["abnormal_parameters"],
        normal_parameters=result["normal_parameters"],
        advice=result["advice"],
        disclaimer=DISCLAIMER,
    )
