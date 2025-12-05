import requests
import PyPDF2
import json
from django.conf import settings
from .models import DocumentAnalysis


def extract_text_from_pdf(file_path, max_pages=10):
    """Extract text from PDF file"""
    try:
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            page_count = len(pdf_reader.pages)
            
            # Extract text from first N pages
            for i in range(min(max_pages, page_count)):
                page = pdf_reader.pages[i]
                text += page.extract_text()
        
        return text, page_count
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return "", 0


def analyze_document_with_ollama(document):
    """Analyze document using Ollama API"""
    try:
        # Extract text from PDF
        text, page_count = extract_text_from_pdf(document.file.path)
        
        # Update page count
        document.page_count = page_count
        
        # Create snippet (first 500 characters)
        document.snippet = text[:500] if text else ""
        document.save()
        
        if not text:
            return None
        
        # Prepare prompt for Ollama
        prompt = f"""Analysez le document suivant et fournissez:
1. Un résumé en français (2-3 phrases)
2. 5 points clés principaux

Document:
{text[:3000]}

Répondez au format JSON:
{{
    "summary": "résumé ici",
    "key_points": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}}
"""
        
        # Call Ollama API
        response = requests.post(
            f"{settings.OLLAMA_API_URL}/api/generate",
            json={
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            response_text = result.get('response', '{}')
            
            # Try to extract JSON from response
            try:
                # Find JSON in response
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start != -1 and end > start:
                    json_str = response_text[start:end]
                    analysis_data = json.loads(json_str)
                else:
                    # Fallback: create simple analysis
                    analysis_data = {
                        "summary": response_text[:500],
                        "key_points": ["Analyse disponible"]
                    }
            except json.JSONDecodeError:
                # Fallback for non-JSON responses
                analysis_data = {
                    "summary": response_text[:500] if response_text else "Analyse non disponible",
                    "key_points": ["Document analysé"]
                }
            
            # Create or update analysis
            analysis, created = DocumentAnalysis.objects.update_or_create(
                document=document,
                defaults={
                    'summary': analysis_data.get('summary', ''),
                    'key_points': analysis_data.get('key_points', []),
                    'model_used': settings.OLLAMA_MODEL
                }
            )
            
            # Mark document as analyzed
            document.analyzed = True
            document.save()
            
            return analysis
        
    except requests.exceptions.ConnectionError:
        print("Could not connect to Ollama API. Make sure Ollama is running.")
    except requests.exceptions.Timeout:
        print("Ollama API request timed out.")
    except Exception as e:
        print(f"Error analyzing document: {e}")
    
    return None


def analyze_document_async(document_id):
    """Async wrapper for document analysis (can be used with Celery)"""
    from .models import Document
    try:
        document = Document.objects.get(id=document_id)
        return analyze_document_with_ollama(document)
    except Document.DoesNotExist:
        print(f"Document {document_id} not found")
        return None
